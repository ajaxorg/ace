/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2013 Matthew Christopher Kastor-Inare III, Atropa Inc. Intl
 * All rights reserved.
 * 
 * Contributed to Ajax.org under the BSD license.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
/*global
    define,
    require
*/

/**
 * Add Editor Menu Options
 * @fileOverview Add Editor Menu Options <br />
 * The menu options property needs to be added to the editor
 *  so that the settings menu can know about options for 
 *  selection elements and track which option is selected.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 */
 
define(function(require, exports, module) {
'use strict';

/**
 * The menu options property needs to be added to the editor
 *  so that the settings menu can know about options for 
 *  selection elements and track which option is selected.
 * @author <a href="mailto:matthewkastor@gmail.com">
 *  Matthew Christopher Kastor-Inare III </a><br />
 *  ☭ Hial Atropa!! ☭
 * @param {ace.Editor} editor An instance of the ace editor.
 */
module.exports.addEditorMenuOptions = function addEditorMenuOptions (editor) {
    var modelist = require('../modelist');
    editor.menuOptions = {
        "setNewLineMode" : [{
                "textContent" : "unix",
                "value" : "unix"
            }, {
                "textContent" : "windows",
                "value" : "windows"
            }, {
                "textContent" : "auto",
                "value" : "auto"
            }
        ],
        "setTheme" : [{
                "textContent" : "ambiance",
                "value" : "ace/theme/ambiance"
            }, {
                "textContent" : "chaos",
                "value" : "ace/theme/chaos"
            }, {
                "textContent" : "chrome",
                "value" : "ace/theme/chrome"
            }, {
                "textContent" : "clouds",
                "value" : "ace/theme/clouds"
            }, {
                "textContent" : "clouds_midnight",
                "value" : "ace/theme/clouds_midnight"
            }, {
                "textContent" : "cobalt",
                "value" : "ace/theme/cobalt"
            }, {
                "textContent" : "crimson_editor",
                "value" : "ace/theme/crimson_editor"
            }, {
                "textContent" : "dawn",
                "value" : "ace/theme/dawn"
            }, {
                "textContent" : "dreamweaver",
                "value" : "ace/theme/dreamweaver"
            }, {
                "textContent" : "eclipse",
                "value" : "ace/theme/eclipse"
            }, {
                "textContent" : "github",
                "value" : "ace/theme/github"
            }, {
                "textContent" : "idle_fingers",
                "value" : "ace/theme/idle_fingers"
            }, {
                "textContent" : "kr",
                "value" : "ace/theme/kr"
            }, {
                "textContent" : "merbivore",
                "value" : "ace/theme/merbivore"
            }, {
                "textContent" : "merbivore_soft",
                "value" : "ace/theme/merbivore_soft"
            }, {
                "textContent" : "monokai",
                "value" : "ace/theme/monokai"
            }, {
                "textContent" : "mono_industrial",
                "value" : "ace/theme/mono_industrial"
            }, {
                "textContent" : "pastel_on_dark",
                "value" : "ace/theme/pastel_on_dark"
            }, {
                "textContent" : "solarized_dark",
                "value" : "ace/theme/solarized_dark"
            }, {
                "textContent" : "solarized_light",
                "value" : "ace/theme/solarized_light"
            }, {
                "textContent" : "textmate",
                "value" : "ace/theme/textmate"
            }, {
                "textContent" : "tomorrow",
                "value" : "ace/theme/tomorrow"
            }, {
                "textContent" : "tomorrow_night",
                "value" : "ace/theme/tomorrow_night"
            }, {
                "textContent" : "tomorrow_night_blue",
                "value" : "ace/theme/tomorrow_night_blue"
            }, {
                "textContent" : "tomorrow_night_bright",
                "value" : "ace/theme/tomorrow_night_bright"
            }, {
                "textContent" : "tomorrow_night_eighties",
                "value" : "ace/theme/tomorrow_night_eighties"
            }, {
                "textContent" : "twilight",
                "value" : "ace/theme/twilight"
            }, {
                "textContent" : "vibrant_ink",
                "value" : "ace/theme/vibrant_ink"
            }, {
                "textContent" : "xcode",
                "value" : "ace/theme/xcode"
            }
        ],
        "setMode" : []
    };
    
    modelist.modes.forEach(function (mode) {
        editor.menuOptions.setMode.push({
            'textContent' : mode.name,
            'value' : mode.mode
        });
    });
};


});