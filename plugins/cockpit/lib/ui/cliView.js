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
var dom = require("pilot/dom").dom;
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
    var cliView = new CliView(data);
};

/**
 * A class to handle the simplest UI implementation
 */
function CliView(data) {
    this.doc = document;
    this.win = this.doc.defaultView;

    // TODO: we should have a better way to specify command lines???
    this.element = this.doc.getElementById('cockpit');
    if (!this.element) {
        console.log('No element with an id of cockpit. Bailing on cli');
        return;
    }

    this.cli = new CliRequisition();

    this.settings = data.env.settings;
    this.hintDirection = this.settings.getSetting('hintDirection');
    this.outputDirection = this.settings.getSetting('outputDirection');
    this.outputHeight = this.settings.getSetting('outputHeight');

    this.hints = [];

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
            this.update();
        }.bind(this), false);
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
        if (ev.keyCode === keyutil.KeyHelper.KEY.TAB) {
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

        if (ev.keyCode === keyutil.KeyHelper.KEY.RETURN) {
            if (this.hints.worst || this.hints.worst.status === Status.VALID) {
                this.cli.exec();
                this.element.value = '';
            }
        }

        if (ev.keyCode === keyutil.KeyHelper.KEY.TAB && this.hints.display &&
                this.hints.display.predictions && this.hints.display.predictions.length > 0) {
            var prefix = this.element.value.substring(0, this.hints.display.start);
            var suffix = this.element.value.substring(this.hints.display.end);
            var insert = this.hints.display.predictions[0];
            insert = typeof insert === 'string' ? insert : insert.name;
            this.element.value = prefix + insert + suffix;
            // Fix the cursor.
            var insertEnd = (prefix + insert).length;
            this.element.selectionStart = insertEnd;
            this.element.selectionEnd = insertEnd;
        }

        this.update();

        if (ev.keyCode === keyutil.KeyHelper.KEY.RETURN) {
            if (this.hints.worst && this.hints.worst.status !== Status.VALID) {
                this.element.selectionStart = this.hints.worst.start;
                this.element.selectionEnd = this.hints.worst.end;
            }
        }

        return handled;
    },

    /**
     * Actually parse the input and make sure we're all up to date
     */
    update: function() {
        this.cli.update({
            typed: this.element.value,
            cursor: {
                start: this.element.selectionStart,
                end: this.element.selectionEnd
            }
        });

        // TODO: borked implementation? This is modern browser only. Fix
        this.completer.classList.remove(Status.VALID.toString());
        this.completer.classList.remove(Status.INCOMPLETE.toString());
        this.completer.classList.remove(Status.INVALID.toString());
        // dom.removeCssClass(completer, Status.VALID.toString());
        // dom.removeCssClass(completer, Status.INCOMPLETE.toString());
        // dom.removeCssClass(completer, Status.INVALID.toString());

        this.hints = this.cli.getHints();

        // Create a marked up version of the input
        var highlightedInput = '<span class="cptPrompt">&gt;</span> ';
        if (this.element.value.length > 0) {
            // 'scores' is an array which tells us what chars are errors
            // Initialize with everything VALID
            var scores = this.element.value.split('').map(function(char) {
                return Status.VALID;
            });
            // For all chars in all hints, check and upgrade the score
            this.hints.forEach(function(hint) {
                for (var i = hint.start; i <= hint.end; i++) {
                    if (hint.status > scores[i]) {
                        scores[i] = hint.status;
                    }
                }
            }, this);
            // Create markup
            var i = 0;
            var lastStatus = -1;
            while (true) {
                if (lastStatus !== scores[i]) {
                    highlightedInput += '<span class=' + scores[i].toString() + '>';
                    lastStatus = scores[i];
                }
                highlightedInput += this.element.value[i];
                i++;
                if (i === this.element.value.length) {
                    highlightedInput += '</span>';
                    break;
                }
                if (lastStatus !== scores[i]) {
                    highlightedInput += '</span>';
                }
            }
        }

        // Display the "-> prediction" at the end of the completer
        var display = this.hints.display || NO_HINT;
        var message = display.message;
        if (display.predictions && display.predictions.length > 0) {
            message += ': [ ';
            display.predictions.forEach(function(prediction) {
                if (prediction.name) {
                    message += prediction.name + ' | ';
                }
                else {
                    message += prediction + ' | ';
                }
            }, this);
            message = message.replace(/\| $/, ']');

            var onTab = display.predictions[0];
            onTab = onTab.name ? onTab.name : onTab;
            this.completer.innerHTML = highlightedInput + ' &nbsp;&#x21E5; ' + onTab;
        }
        else {
            this.completer.innerHTML = highlightedInput;
        }
        this.hinter.innerHTML = message;
        if (message.length === 0) {
            this.hinter.classList.add('cptNoHints');
        }
        else {
            this.hinter.classList.remove('cptNoHints');
        }

        var status = this.hints.worst ? this.hints.worst.status : Status.VALID;
        this.completer.classList.add(status.toString());
        // dom.addCssClass(input, status.toString());
    }
};
exports.CliView = CliView;


});
