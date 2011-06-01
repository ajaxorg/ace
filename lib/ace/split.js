/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
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
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 *  Julian Viereck <julian.viereck@gmail.com>
 *
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
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

var oop = require("pilot/oop");
var lang = require("pilot/lang");
var EventEmitter = require("pilot/event_emitter").EventEmitter;

var Editor = require("ace/editor").Editor;
var Renderer = require("ace/virtual_renderer").VirtualRenderer;
var EditSession = require("ace/edit_session").EditSession;
var SplitEditSession = require("ace/split_edit_session").SplitEditSession;

var SplitEditor = function(container, theme, splits) {
    this.BELOW = 1;
    this.BESIDE = 0;

    this.$container = container;
    this.$theme = theme;
    this.$splits = 0;
    this.$editorCSS = "";
    this.$editors = [];
    this.$splitSession = [];
    this.$oriantation = this.BESIDE;
    this.$emptySplitEditSession = new SplitEditSession("");

    this.setSplits(splits || 1);
    this.$cEditor = this.$editors[0];

    this.on("focus", function(editor) {
        // Update the "current" editor.
        this.$cEditor = editor;

        // Notify the SplitEditSession of the current editor that one of its
        // sessions got the focus.
        var idx = editor.$splitIdx;
        this.$splitSession[idx]._dispatchEvent("focus", {idx: idx});
    }.bind(this));

    this.on("deactivate", function(editor) {
        var idx = editor.$splitIdx;
        this.$splitSession[idx]._dispatchEvent("deactivate", {idx: idx});
    }.bind(this));
};

(function(){

    oop.implement(this, EventEmitter);

    this.$createEditor = function() {
        var dom = document.createElement("div");
        dom.className = this.$editorCSS;
        dom.style = "position: absolute; top:0px; bottom:0px";
        this.$container.appendChild(dom);

        var idx = this.$editors.length;
        var splitSession = null;
        if (idx == 0) {
            splitSession = this.$emptySplitEditSession;
        } else {
            splitSession = this.$splitSession[idx - 1];
        }
        this.$splitSession[idx] = splitSession;
        session = splitSession.getEditSession(idx);

        var editor = new Editor(new Renderer(dom, this.$theme), session);
        editor.on("focus", function() {
            this._emit("focus", editor);
        }.bind(this));
        editor.$splitIdx = idx;

        this.$editors.push(editor);
        editor.container.style.fontSize = this.$fontSize;
        return editor;
    }

    this.setSplits = function(splits) {
        var editor;
        if (splits < 1) {
            throw "The number of splits have to be > 0!";
        }

        if (splits == this.$splits) {
            return;
        } else if (splits > this.$splits) {
            while (this.$splits < this.$editors.length && this.$splits < splits) {
                var editor = this.$editors[this.$splits];
                this.$container.appendChild(editor.container);
                editor.container.style.fontSize = this.$fontSize;
                this.$splits ++;
            }
            while (this.$splits < splits) {
                this.$createEditor();
                this.$splits ++;
            }
        } else {
            while (this.$splits > splits) {
                editor = this.$editors[this.$splits - 1];
                this.$container.removeChild(editor.container);
                this.$splits --;
                // Notify that a split got deactivated.
                this._emit("deactivate", editor);
            }
        }
        this.resize();
    }

    this.getSplits = function() {
        return this.$splits;
    }

    this.getEditor = function(idx) {
        if (idx == null) {
            return this.$cEditor;
        } else {
            return this.$editors[idx];
        }
    }

    this.getSplitSession = function() {
        return this.$splitSession[this.$cEditor.$splitIdx];
    }

    this.getSession = function() {
        var idx = this.$cEditor.$splitIdx;
        return this.$splitSession[idx].getEditSession(idx);
    }

    this.getRenderer = function() {
        return this.getEditor().renderer;
    }

    this.focus = function() {
        this.$cEditor.focus();
    }

    this.blur = function() {
        this.$cEditor.blur();
    }

    this.setKeyboardHandler = function(keybinding) {
        this.$editors.forEach(function(editor) {
            editor.setKeyboardHandler(keybinding);
        });
    }

    this.forEach = function(callback, scope) {
        this.$editors.forEach(callback, scope);
    }

    this.setFontSize = function(size) {
        this.$fontSize = size;
        this.forEach(function(editor) {
           editor.container.style.fontSize = size;
        });
    }

    this.setSession = function(splitSession, idx) {
        var editor
        if (idx == null) {
            editor = this.$cEditor;
            idx = editor.$splitIdx;
        } else {
            editor = this.$editors[idx];
        }

        // Get the editSession for this editor from the splitSession;
        var session = splitSession.getEditSession(idx)
        editor.setSession(session);
        this.$splitSession[idx] = splitSession;
    }

    this.getOriantation = function() {
        return this.$oriantation;
    }

    this.setOriantation = function(oriantation) {
        if (this.$oriantation == oriantation) {
            return;
        }
        this.$oriantation = oriantation;
        this.resize();
    }

    this.resize = function() {
        var width = this.$container.clientWidth;
        var height = this.$container.clientHeight;
        var editor;

        if (this.$oriantation == this.BESIDE) {
            var editorWidth = width / this.$splits;
            for (var i = 0; i < this.$splits; i++) {
                editor = this.$editors[i];
                editor.container.style.width = editorWidth + "px";
                editor.container.style.top = "0px";
                editor.container.style.left = i * editorWidth + "px";
                editor.container.style.height = height + "px";
                editor.resize();
            }
        } else {
            var editorHeight = height / this.$splits;
            for (var i = 0; i < this.$splits; i++) {
                editor = this.$editors[i];
                editor.container.style.width = width + "px";
                editor.container.style.top = i * editorHeight + "px"
                editor.container.style.left = "0px";
                editor.container.style.height = editorHeight + "px";
                editor.resize();
            }
        }
    }

}).call(SplitEditor.prototype);

var editorAPI = [
    "Theme",
    "KeyboardHandler",
    "HighlightActiveLine",
    "HighlightSelectedWord",
    "ShowInvisibles",
    "ShowPrintMargin",
    "PrintMarginColumn",
    "ShowGutter",
    "HScrollBarAlwaysVisible",
    "BehavioursEnabled",
    "SelectionStyle"
];

editorAPI.forEach(function(api) {
    SplitEditor.prototype["get" + api] = function() {
        return this.$cEditor["get" + api]();
    }

    SplitEditor.prototype["set" + api] = function(value) {
        this.$editors.forEach(function(editor) {
            editor["set" + api](value);
        });
    }
});

exports.SplitEditor = SplitEditor;
});
