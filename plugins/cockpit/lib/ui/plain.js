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

var CliRequisition = require('cockpit/cli').CliRequisition;
var Hint = require('cockpit/cli').Hint;
var keyutil = require('pilot/keyboard/keyutil');

var plainRow = require("text!cockpit/ui/plainRow.html");
var Templater = require("pilot/domtemplate").Templater;
var canon = require("pilot/canon");
var Status = require('pilot/types').Status;

/**
 * On startup we need to:
 * 1. Add 3 sets of elements to the DOM for:
 * - command line output
 * - input hints
 * - completion
 * 2. Attach a set of events so the command line works
 */
exports.startup = function(data, reason) {
    var doc = document;
    var win = doc.defaultView;

    var cli = new CliRequisition();

    // TODO: we should have a better way to specify command lines???
    var input = doc.getElementById('cockpit');
    if (!input) {
        console.log('No element with an id of cockpit. Bailing on plain cli');
        return;
    }

    var templates = doc.createElement('dic');
    templates.innerHTML = plainRow;
    var row = templates.firstChild;

    var completer = doc.createElement('div');
    completer.className = 'cptCompletion VALID';
    input.parentNode.insertBefore(completer, input);

    var hinter = doc.createElement('div');
    hinter.className = 'cptHints';
    input.parentNode.insertBefore(hinter, input);

    var output = doc.createElement('div');
    output.className = 'cptOutput';
    input.parentNode.insertBefore(output, input);

    function resizer() {
        var style = win.getComputedStyle(input, null);

        var top = parseInt(style.getPropertyValue('top'), 10);
        var height = parseInt(style.getPropertyValue('height'), 10);
        var left = parseInt(style.getPropertyValue('left'), 10);
        var width = parseInt(style.getPropertyValue('width'), 10);

        completer.style.top = top + 'px';
        completer.style.height = height + 'px';
        completer.style.left = left + 'px';
        completer.style.width = width + 'px';

        hinter.style.bottom = (win.innerHeight - top) + 'px';
        hinter.style.left = (left + 30) + 'px';

        output.style.bottom = (win.innerHeight - top) + 'px';
        output.style.left = left + 'px';
        output.style.width = width + 'px';
    }

    win.addEventListener('resize', resizer.bind(this), true);
    resizer();

    // TODO: be less brutal in how we update this
    output.innerHTML = '';
    canon.addEventListener('output', function(ev) {
        ev.requests.forEach(function(request) {
            request.outputs.forEach(function(out) {
                if (typeof out === 'string') {
                    output.appendChild(doc.createTextNode(out));
                } else {
                    output.appendChild(out);
                }
            }, this);
        }, this);
    }.bind(this));

    /*
    // All this does is to kill TABs normal use. I wonder if we can train
    // people to use right arrow? Probably not? but ...
    keyutil.addKeyDownListener(input, function(ev) {
        // env.commandLine = this;
        // var handled = keyboardManager.processKeyEvent(ev, this, {
        //     isCommandLine: true, isKeyUp: false
        // });
        if (ev.keyCode === keyutil.KeyHelper.KEY.TAB) {
            return true;
        }
        //return handled;
    }.bind(this));
    */

    var NO_HINT = new Hint(Status.VALID, '', 0, 0);
    var hints = [];
    var worst;

    input.addEventListener('keyup', function(ev) {
        /*
        var handled = keyboardManager.processKeyEvent(ev, this, {
            isCommandLine: true, isKeyUp: true
        });
        */

        if (ev.keyCode === keyutil.KeyHelper.KEY.RETURN) {
            cli.exec();
            input.value = '';
        } else {
            cli.update({
                typed: input.value,
                cursor: {
                    start: input.selectionStart,
                    end: input.selectionEnd
                }
            });

            completer.classList.remove(Status.VALID.toString());
            completer.classList.remove(Status.INCOMPLETE.toString());
            completer.classList.remove(Status.INVALID.toString());

            // TODO: borked implementation?
            // dom.removeCssClass(completer, Status.VALID.toString());
            // dom.removeCssClass(completer, Status.INCOMPLETE.toString());
            // dom.removeCssClass(completer, Status.INVALID.toString());

            hints = cli.getHints();

            // Create a marked up version of the input
            var highlightedInput = '';
            if (input.value.length > 0) {
                // 'scores' is an array which tells us what chars are errors
                // Initialize with everything VALID
                var scores = input.value.split('').map(function(char) {
                    return Status.VALID;
                });
                // For all chars in all hints, check and upgrade the score
                hints.forEach(function(hint) {
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
                    highlightedInput += input.value[i];
                    i++;
                    if (i === input.value.length) {
                        highlightedInput += '</span>';
                        break;
                    }
                    if (lastStatus !== scores[i]) {
                        highlightedInput += '</span>';
                    }
                }
            }

            worst = Hint.worst(hints) || NO_HINT;
            var message = worst.message;
            if (worst.predictions && worst.predictions.length > 0) {
                message += ' [ ';
                worst.predictions.forEach(function(prediction) {
                    if (prediction.name) {
                        message += prediction.name + ' | ';
                    }
                    else {
                        message += prediction + ' | ';
                    }
                }, this);
                message = message.replace(/\| $/, ']');

                var completion = worst.predictions[0];
                completion = completion.name ? completion.name : completion;
                completer.innerHTML = highlightedInput + ' &nbsp;-&gt; ' + completion;
            }
            else {
                completer.innerHTML = highlightedInput;
            }
            hinter.innerHTML = message;

            completer.classList.add(worst.status.toString());
            // dom.addCssClass(input, worst.status.toString());
        }

        // return handled;
    }.bind(this), true);
};


});
