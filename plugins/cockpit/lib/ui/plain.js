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


var editorCss = require("text!cockpit/ui/plain.css");
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
    var plainUi = new CliView(data);
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
        console.log('No element with an id of cockpit. Bailing on plain cli');
        return;
    }

    this.cli = new CliRequisition();

    this.settings = data.env.settings;
    this.showHint = this.settings.getSetting('showHint');
    this.outputHeight = this.settings.getSetting('outputHeight');

    this.hints = [];
    this.shownHint;
    this.worstHint;

    this.createElements();
}
CliView.prototype = {
    /**
     * Create divs for completion, hints and output
     */
    createElements: function() {
        this.completer = this.doc.createElement('div');
        this.completer.className = 'cptCompletion VALID';
        this.element.parentNode.insertBefore(this.completer, this.element);

        this.hinter = this.doc.createElement('div');
        this.hinter.className = 'cptHints';
        this.element.parentNode.insertBefore(this.hinter, this.element);

        this.output = this.doc.createElement('div');
        this.output.className = 'cptOutput';
        this.element.parentNode.insertBefore(this.output, this.element);

        this.win.addEventListener('resize', this.resizer.bind(this), false);
        this.resizer();

        canon.addEventListener('output', this.showOutput.bind(this));

        this.showHint.addEventListener('change', this.hintShower.bind(this));
        this.hintShower();

        keyutil.addKeyDownListener(this.element, this.onKeyDown.bind(this));
        this.element.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        this.element.addEventListener('keyup', this.onKeyUp.bind(this), true);
    },

    /**
     * To be called on window resize or any time we want to align the elements
     * with the input box.
     */
    resizer: function() {
        var top, height, left, width;

        if (this.element.getClientRects) {
            var rect = this.element.getClientRects()[0];
            top = rect.top;
            height = rect.height;
            left = rect.left;
            width = rect.width;
        }
        else {
            var style = this.win.getComputedStyle(this.element, null);
            top = parseInt(style.getPropertyValue('top'), 10);
            height = parseInt(style.getPropertyValue('height'), 10);
            left = parseInt(style.getPropertyValue('left'), 10);
            width = parseInt(style.getPropertyValue('width'), 10);
        }

        this.completer.style.top = top + 'px';
        this.completer.style.height = height + 'px';
        this.completer.style.left = left + 'px';
        this.completer.style.width = width + 'px';

        this.hinter.style.bottom = (this.win.innerHeight - top) + 'px';
        this.hinter.style.left = (left + 30) + 'px';

        this.output.style.bottom = (this.win.innerHeight - top) + 'px';
        this.output.style.left = left + 'px';
        this.output.style.width = (width - 60) + 'px';
    },

    /**
     * Update the display of executed commands
     */
    showOutput: function(ev) {
        var requestOutput = new RequestView(ev.request, this);

        /*
        // TODO: be less brutal in how we update this
        this.output.innerHTML = '';

        new RequestView(ev.request, this);
        ev.requests.forEach(function(request) {
            // this.duration.innerHTML = this.request.duration ?
            //     'completed in ' + (this.request.duration / 1000) + ' sec ' :
            //     '';
            // this.typed.innerHTML = this.request.typed;

            request.outputs.forEach(function(output) {
                var node;
                if (typeof output == 'string') {
                    node = document.createElement('p');
                    node.innerHTML = output;
                } else {
                    node = output;
                }
                this.output.appendChild(node);
            }, this);

            // this.cliView.scrollToBottom();
            // util.setClass(this.output, 'cmd_error', this.request.error);
            // this.throb.style.display = this.request.completed ? 'none' : 'block';
        }, this);
        */
    },

    /**
     * Show/hide the hint line.
     * It's not clear that this is actually useful, however it does help to
     * highlight some features for right now.
     * TODO: remove this?
     */
    hintShower: function() {
        if (this.showHint.get()) {
            this.hinter.style.display = 'block';
        }
        else {
            this.hinter.style.display = 'none';
        }
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
            if (this.worstHint && this.worstHint.status !== Status.VALID) {
                this.element.selectionStart = this.worstHint.start;
                this.element.selectionEnd = this.worstHint.end;
            }
            else {
                this.cli.exec();
                this.element.value = '';
            }
        }

        if (ev.keyCode === keyutil.KeyHelper.KEY.TAB && this.shownHint &&
                this.shownHint.predictions && this.shownHint.predictions.length > 0) {
            var prefix = this.element.value.substring(0, this.shownHint.start);
            var suffix = this.element.value.substring(this.shownHint.end);
            var insert = this.shownHint.predictions[0];
            insert = typeof insert === 'string' ? insert : insert.name;
            this.element.value = prefix + insert + suffix;
            // Fix the cursor.
            var insertEnd = (prefix + insert).length;
            this.element.selectionStart = insertEnd;
            this.element.selectionEnd = insertEnd;
        }

        this.update();

        return handled;
    },

    /**
     * Cause an update if the cursor changes position due to a mouse click
     * TODO: there are probably some performance wins here.
     */
    onMouseUp: function(ev) {
        this.update();
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

        // Those hints came in order of display importance - i.e. an INCOMPLETE
        // hint under the cursor should be displayed before an INVALID hint
        // somewhere else. That's good for displaying hints, but not good for
        // deciding if we're good to go.
        if (this.hints.length > 1) {
            hintClone = this.hints.slice(0);
            this.worstHint = Hint.sort(hintClone)[0];
        }

        // Create a marked up version of the input
        var highlightedInput = '';
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
        this.shownHint = (this.hints.length > 0) ? this.hints[0] : NO_HINT;
        var message = this.shownHint.message;
        if (this.shownHint.predictions && this.shownHint.predictions.length > 0) {
            message += ': [ ';
            this.shownHint.predictions.forEach(function(prediction) {
                if (prediction.name) {
                    message += prediction.name + ' | ';
                }
                else {
                    message += prediction + ' | ';
                }
            }, this);
            message = message.replace(/\| $/, ']');

            var onTab = this.shownHint.predictions[0];
            onTab = onTab.name ? onTab.name : onTab;
            this.completer.innerHTML = highlightedInput + ' &nbsp;-&gt; ' + onTab;
        }
        else {
            this.completer.innerHTML = highlightedInput;
        }
        this.hinter.innerHTML = message;

        var status = this.worstHint ? this.worstHint.status : Status.VALID;
        this.completer.classList.add(status.toString());
        // dom.addCssClass(input, status.toString());
    }
};
exports.CliView = CliView;


});
