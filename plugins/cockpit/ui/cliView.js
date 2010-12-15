/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {


var editorCss = require("text!cockpit/ui/cliView.css");
var dom = require("pilot/dom");
dom.importCssString(editorCss);

var canon = require("pilot/canon");
var Status = require('pilot/types').Status;
var keyutil = require('pilot/keyboard/keyutil');

var CliRequisition = require('cockpit/cli').CliRequisition;
var Hint = require('cockpit/cli').Hint;
var RequestView = require('cockpit/ui/requestView').RequestView;

var NO_HINT = new Hint(Status.VALID, '', 0, 0);

/**
 * On startup we need to:
 * 1. Add 3 sets of elements to the DOM for:
 * - command line output
 * - input hints
 * - completion
 * 2. Attach a set of events so the command line works
 */
exports.startup = function(data, reason) {
    var cli = new CliRequisition(data.env);
    var cliView = new CliView(cli, data.env);
};

/**
 * A class to handle the simplest UI implementation
 */
function CliView(cli, env) {
    this.cli = cli;
    this.doc = document;
    this.win = this.doc.defaultView;

    // TODO: we should have a better way to specify command lines???
    this.element = this.doc.getElementById('cockpit');
    if (!this.element) {
        console.log('No element with an id of cockpit. Bailing on cli');
        return;
    }

    this.settings = env.settings;
    this.hintDirection = this.settings.getSetting('hintDirection');
    this.outputDirection = this.settings.getSetting('outputDirection');
    this.outputHeight = this.settings.getSetting('outputHeight');

    // If the requisition tells us something has changed, we use this to know
    // if we should ignore it
    this.isUpdating = false;

    this.createElements();
    this.update();
}
CliView.prototype = {
    /**
     * Create divs for completion, hints and output
     */
    createElements: function() {
        var input = this.element;

        this.completer = this.doc.createElement('div');
        this.completer.className = 'cptCompletion VALID';
        input.parentNode.insertBefore(this.completer, input.nextSibling);

        this.hinter = this.doc.createElement('div');
        this.hinter.className = 'cptHints';
        input.parentNode.insertBefore(this.hinter, input.nextSibling);

        this.output = this.doc.createElement('div');
        this.output.className = 'cptOutput';
        input.parentNode.insertBefore(this.output, input.nextSibling);

        this.win.addEventListener('resize', this.resizer.bind(this), false);
        this.hintDirection.addEventListener('change', this.resizer.bind(this));
        this.outputDirection.addEventListener('change', this.resizer.bind(this));
        this.resizer();

        var setMaxOutputHeight = function() {
            this.output.style.maxHeight = this.outputHeight.get() + 'px';
        }.bind(this);
        this.outputHeight.addEventListener('change', setMaxOutputHeight);
        setMaxOutputHeight();

        canon.addEventListener('output',  function(ev) {
            new RequestView(ev.request, this);
        }.bind(this));

        keyutil.addKeyDownListener(input, this.onKeyDown.bind(this));
        input.addEventListener('keyup', this.onKeyUp.bind(this), true);
        // cursor position affects hint severity. TODO: shortcuts for speed
        input.addEventListener('mouseup', function(ev) {
            this.isUpdating = true;
            this.update();
            this.isUpdating = false;
        }.bind(this), false);

        this.cli.addEventListener('argumentChange', this.onArgChange.bind(this));
    },

    /**
     * We need to see the output of the latest command entered
     */
    scrollOutputToBottom: function() {
        // Certain browsers have a bug such that scrollHeight is too small
        // when content does not fill the client area of the element
        var scrollHeight = Math.max(this.output.scrollHeight, this.output.clientHeight);
        this.output.scrollTop = scrollHeight - this.output.clientHeight;
    },

    /**
     * To be called on window resize or any time we want to align the elements
     * with the input box.
     */
    resizer: function() {
        var rect = this.element.getClientRects()[0];

        this.completer.style.top = rect.top + 'px';
        this.completer.style.height = rect.height + 'px';
        this.completer.style.left = rect.left + 'px';
        this.completer.style.width = rect.width + 'px';

        if (this.hintDirection.get() === 'below') {
            this.hinter.style.top = rect.bottom + 'px';
            this.hinter.style.bottom = 'auto';
        }
        else {
            this.hinter.style.top = 'auto';
            this.hinter.style.bottom = (this.win.innerHeight - rect.top) + 'px';
        }
        this.hinter.style.left = (rect.left + 30) + 'px';
        this.hinter.style.maxWidth = (rect.width - 110) + 'px';

        if (this.outputDirection.get() === 'below') {
            this.output.style.top = rect.bottom + 'px';
            this.output.style.bottom = 'auto';
        }
        else {
            this.output.style.top = 'auto';
            this.output.style.bottom = (this.win.innerHeight - rect.top) + 'px';
        }
        this.output.style.left = rect.left + 'px';
        this.output.style.width = (rect.width - 80) + 'px';
    },

    /**
     * Ensure that TAB isn't handled by the browser
     */
    onKeyDown: function(ev) {
        var handled;
        // var handled = keyboardManager.processKeyEvent(ev, this, {
        //     isCommandLine: true, isKeyUp: false
        // });
        if (ev.keyCode === keyutil.KeyHelper.KEY.TAB ||
                ev.keyCode === keyutil.KeyHelper.KEY.UP ||
                ev.keyCode === keyutil.KeyHelper.KEY.DOWN) {
            return true;
        }
        return handled;
    },

    /**
     * The main keyboard processing loop
     */
    onKeyUp: function(ev) {
        var handled;
        /*
        var handled = keyboardManager.processKeyEvent(ev, this, {
            isCommandLine: true, isKeyUp: true
        });
        */

        // RETURN does a special exec/highlight thing
        if (ev.keyCode === keyutil.KeyHelper.KEY.RETURN) {
            var worst = this.cli.getWorstHint();
            // Deny RETURN unless the command might work
            if (worst.status === Status.VALID) {
                this.cli.exec();
                this.element.value = '';
            }
            else {
                // If we've denied RETURN because the command was not VALID,
                // select the part of the command line that is causing problems
                // TODO: if there are 2 errors are we picking the right one?
                this.element.selectionStart = worst.start;
                this.element.selectionEnd = worst.end;
            }
        }

        this.update();

        // Special actions which delegate to the assignment
        var current = this.cli.getAssignmentAt(this.element.selectionStart);
        if (current) {
            // TAB does a special complete thing
            if (ev.keyCode === keyutil.KeyHelper.KEY.TAB) {
                current.complete();
                this.update();
            }

            // UP/DOWN look for some history
            if (ev.keyCode === keyutil.KeyHelper.KEY.UP) {
                current.increment();
                this.update();
            }
            if (ev.keyCode === keyutil.KeyHelper.KEY.DOWN) {
                current.decrement();
                this.update();
            }
        }

        return handled;
    },

    /**
     * Actually parse the input and make sure we're all up to date
     */
    update: function() {
        this.isUpdating = true;
        var input = {
            typed: this.element.value,
            cursor: {
                start: this.element.selectionStart,
                end: this.element.selectionEnd
            }
        };
        this.cli.update(input);

        var display = this.cli.getAssignmentAt(input.cursor.start).getHint();

        // 1. Update the completer with prompt/error marker/TAB info
        this.completer.classList.remove(Status.VALID.toString());
        this.completer.classList.remove(Status.INCOMPLETE.toString());
        this.completer.classList.remove(Status.INVALID.toString());
        // TODO: borked implementation? This is modern browser only. Fix
        // dom.removeCssClass(completer, Status.VALID.toString());
        // dom.removeCssClass(completer, Status.INCOMPLETE.toString());
        // dom.removeCssClass(completer, Status.INVALID.toString());

        var completion = '<span class="cptPrompt">&gt;</span> ';
        if (this.element.value.length > 0) {
            var scores = this.cli.getInputStatusMarkup();
            completion += this.markupStatusScore(scores);
        }

        // Display the "-> prediction" at the end of the completer
        if (this.element.value.length > 0 &&
                display.predictions && display.predictions.length > 0) {
            var tab = display.predictions[0];
            completion += ' &nbsp;&#x21E5; ' + (tab.name ? tab.name : tab);
        }
        this.completer.innerHTML = completion;
        this.completer.classList.add(this.cli.getWorstHint().status.toString());
        // dom.addCssClass(input, this.cli.getWorstHint().status.toString());

        // 2. Update the hint element
        var hint = '';
        if (this.element.value.length !== 0) {
            hint += display.message;
            if (display.predictions && display.predictions.length > 0) {
                hint += ': [ ';
                display.predictions.forEach(function(prediction) {
                    hint += (prediction.name ? prediction.name : prediction);
                    hint += ' | ';
                }, this);
                hint = hint.replace(/\| $/, ']');
            }
        }

        this.hinter.innerHTML = hint;
        if (hint.length === 0) {
            this.hinter.classList.add('cptNoHints');
        }
        else {
            this.hinter.classList.remove('cptNoHints');
        }

        this.isUpdating = false;
    },

    /**
     * Markup an array of Status values with spans
     */
    markupStatusScore: function(scores) {
        var completion = '';
        // Create mark-up
        var i = 0;
        var lastStatus = -1;
        while (true) {
            if (lastStatus !== scores[i]) {
                completion += '<span class=' + scores[i].toString() + '>';
                lastStatus = scores[i];
            }
            completion += this.element.value[i];
            i++;
            if (i === this.element.value.length) {
                completion += '</span>';
                break;
            }
            if (lastStatus !== scores[i]) {
                completion += '</span>';
            }
        }

        return completion;
    },

    /**
     * Update the input element to reflect the changed argument
     */
    onArgChange: function(ev) {
        if (this.isUpdating) {
            return;
        }

        var prefix = this.element.value.substring(0, ev.argument.start);
        var suffix = this.element.value.substring(ev.argument.end);
        var insert = typeof ev.text === 'string' ? ev.text : ev.text.name;
        this.element.value = prefix + insert + suffix;
        // Fix the cursor.
        var insertEnd = (prefix + insert).length;
        this.element.selectionStart = insertEnd;
        this.element.selectionEnd = insertEnd;
    }
};
exports.CliView = CliView;


});
