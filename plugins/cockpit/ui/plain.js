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
var dom = require("pilot/dom");
dom.importCssString(editorCss);

var CliRequisition = require('cockpit/cli').CliRequisition;
var keyutil = require('pilot/keyboard/keyutil');

exports.startup = function(data, reason) {
    // TODO: we should have a better way to specify command lines???
    this.input = document.getElementById('cockpit');
    if (!this.input) {
        // console.log('No element with an id of cockpit. Bailing on plain cli');
        return;
    }

    var cli = new CliRequisition();

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

    this.input.addEventListener('keyup', function(ev) {
        /*
        var handled = keyboardManager.processKeyEvent(ev, this, {
            isCommandLine: true, isKeyUp: true
        });
        */

        if (ev.keyCode === keyutil.KeyHelper.KEY.RETURN) {
            cli.exec();
            this.input.value = '';
        } else {
            cli.update({
                typed: this.input.value,
                cursor: {
                    start: this.input.selectionStart,
                    end: this.input.selectionEnd
                }
            });
            //console.log(JSON.stringify(cli.getHints()));
        }

        // return handled;
    }.bind(this), true);
};


});
