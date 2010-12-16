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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Kevin Dangoor (kdangoor@mozilla.com)
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

exports.launch = function(env) {

    var event = require("pilot/event");
    var Editor = require("ace/editor").Editor;
    var Renderer = require("ace/virtual_renderer").VirtualRenderer;
    var theme = require("ace/theme/textmate");
    var Document = require("ace/document").Document;
    var JavaScriptMode = require("ace/mode/javascript").Mode;
    var CssMode = require("ace/mode/css").Mode;
    var HtmlMode = require("ace/mode/html").Mode;
    var XmlMode = require("ace/mode/xml").Mode;
    var PythonMode = require("ace/mode/python").Mode;
    var PhpMode = require("ace/mode/php").Mode;
    var TextMode = require("ace/mode/text").Mode;
    var UndoManager = require("ace/undomanager").UndoManager;

    var docs = {};

    docs.js = new Document(document.getElementById("jstext").innerHTML);
    docs.js.setMode(new JavaScriptMode());
    docs.js.setUndoManager(new UndoManager());

    docs.css = new Document(document.getElementById("csstext").innerHTML);
    docs.css.setMode(new CssMode());
    docs.css.setUndoManager(new UndoManager());

    docs.html = new Document(document.getElementById("htmltext").innerHTML);
    docs.html.setMode(new HtmlMode());
    docs.html.setUndoManager(new UndoManager());

    docs.python = new Document(document.getElementById("pythontext").innerHTML);
    docs.python.setMode(new PythonMode());
    docs.python.setUndoManager(new UndoManager());

    docs.php = new Document(document.getElementById("phptext").innerHTML);
    docs.php.setMode(new PhpMode());
    docs.php.setUndoManager(new UndoManager());

    var docEl = document.getElementById("doc");

    var container = document.getElementById("editor");
    env.editor = new Editor(new Renderer(container, theme));

    function onDocChange() {
        var doc = getDoc();
        env.editor.setDocument(doc);

        var mode = doc.getMode();
        if (mode instanceof JavaScriptMode) {
            modeEl.value = "javascript";
        }
        else if (mode instanceof CssMode) {
            modeEl.value = "css";
        }
        else if (mode instanceof HtmlMode) {
            modeEl.value = "html";
        }
        else if (mode instanceof XmlMode) {
            modeEl.value = "xml";
        }
        else if (mode instanceof PythonMode) {
            modeEl.value = "python";
        }
        else if (mode instanceof PhpMode) {
            modeEl.value = "php";
        }
        else {
            modeEl.value = "text";
        }

        env.editor.focus();
    }
    docEl.onchange = onDocChange;

    function getDoc() {
        return docs[docEl.value];
    }

    var modeEl = document.getElementById("mode");
    modeEl.onchange = function() {
        env.editor.getDocument().setMode(modes[modeEl.value] || modes.text);
    };

    var modes = {
        text: new TextMode(),
        xml: new XmlMode(),
        html: new HtmlMode(),
        css: new CssMode(),
        javascript: new JavaScriptMode(),
        python: new PythonMode(),
        php: new PhpMode()
    };

    function getMode() {
        return modes[modeEl.value];
    }

    var themeEl = document.getElementById("theme");
    themeEl.onchange = function() {
        env.editor.setTheme(themeEl.value);
    };

    var selectEl = document.getElementById("select_style");
    selectEl.onchange = function() {
        if (selectEl.checked) {
            env.editor.setSelectionStyle("line");
        } else {
            env.editor.setSelectionStyle("text");
        }
    };

    var activeEl = document.getElementById("highlight_active");
    activeEl.onchange = function() {
        env.editor.setHighlightActiveLine(!!activeEl.checked);
    };

    onDocChange();

    window.jump = function() {
        var jump = document.getElementById("jump");
        var cursor = env.editor.getCursorPosition();
        var pos = env.editor.renderer.textToScreenCoordinates(cursor.row, cursor.column);
        jump.style.left = pos.pageX + "px";
        jump.style.top = pos.pageY + "px";
        jump.style.display = "block";
    };

    function onResize() {
        container.style.width = (document.documentElement.clientWidth - 4) + "px";
        container.style.height = (document.documentElement.clientHeight - 55 - 4 - 23) + "px";
        env.editor.resize();
    };

    window.onresize = onResize;
    onResize();

    event.addListener(container, "dragover", function(e) {
        return event.preventDefault(e);
    });

    event.addListener(container, "drop", function(e) {
        try {
            var file = e.dataTransfer.files[0];
        } catch(e) {
            return event.stopEvent();
        }

        if (window.FileReader) {
            var reader = new FileReader();
            reader.onload = function(e) {
                env.editor.getSelection().selectAll();

                var mode = "text";
                if (/^.*\.js$/i.test(file.name)) {
                    mode = "javascript";
                } else if (/^.*\.xml$/i.test(file.name)) {
                    mode = "xml";
                } else if (/^.*\.html$/i.test(file.name)) {
                    mode = "html";
                } else if (/^.*\.css$/i.test(file.name)) {
                    mode = "css";
                } else if (/^.*\.py$/i.test(file.name)) {
                    mode = "python";
                } else if (/^.*\.php$/i.test(file.name)) {
                    mode = "php";
                }

                env.editor.onTextInput(reader.result);

                modeEl.value = mode;
                env.editor.getDocument().setMode(modes[mode]);
            };
            reader.readAsText(file);
        }

        return event.preventDefault(e);
    });
};

});
