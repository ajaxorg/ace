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
    var EditSession = require("ace/edit_session").EditSession;
    var JavaScriptMode = require("ace/mode/javascript").Mode;
    var CssMode = require("ace/mode/css").Mode;
    var HtmlMode = require("ace/mode/html").Mode;
    var XmlMode = require("ace/mode/xml").Mode;
    var PythonMode = require("ace/mode/python").Mode;
    var PhpMode = require("ace/mode/php").Mode;
    var JavaMode = require("ace/mode/java").Mode;
    var RubyMode = require("ace/mode/ruby").Mode;
    var CCPPMode = require("ace/mode/c_cpp").Mode;
    var TextMode = require("ace/mode/text").Mode;
    var UndoManager = require("ace/undomanager").UndoManager;

    var vim = require("ace/keyboard/keybinding/vim").Vim;
    var emacs = require("ace/keyboard/keybinding/emacs").Emacs;
    var HashHandler = require("ace/keyboard/hash_handler").HashHandler;

    var keybindings = {
      // Null = use "default" keymapping
      ace: null,
      vim: vim,
      emacs: emacs,
      // This is a way to define simple keyboard remappings
      custom: new HashHandler({
          "gotoright": "Tab"
      })
    }

    var docs = {};

    // Make the lorem ipsum text a little bit longer.
    var loreIpsum = document.getElementById("plaintext").innerHTML;
    for (var i = 0; i < 5; i++) {
        loreIpsum += loreIpsum;
    }
    docs.plain = new EditSession(loreIpsum);
    docs.plain.setUseWrapMode(true);
    docs.plain.setMode(new TextMode());
    docs.plain.setUndoManager(new UndoManager());

    docs.js = new EditSession(document.getElementById("jstext").innerHTML);
    docs.js.setMode(new JavaScriptMode());
    docs.js.setUndoManager(new UndoManager());

    docs.css = new EditSession(document.getElementById("csstext").innerHTML);
    docs.css.setMode(new CssMode());
    docs.css.setUndoManager(new UndoManager());

    docs.html = new EditSession(document.getElementById("htmltext").innerHTML);
    docs.html.setMode(new HtmlMode());
    docs.html.setUndoManager(new UndoManager());

    docs.python = new EditSession(document.getElementById("pythontext").innerHTML);
    docs.python.setMode(new PythonMode());
    docs.python.setUndoManager(new UndoManager());

    docs.php = new EditSession(document.getElementById("phptext").innerHTML);
    docs.php.setMode(new PhpMode());
    docs.php.setUndoManager(new UndoManager());

    docs.java = new EditSession(document.getElementById("javatext").innerHTML);
    docs.java.setMode(new JavaMode());
    docs.java.setUndoManager(new UndoManager());

    docs.ruby = new EditSession(document.getElementById("rubytext").innerHTML);
    docs.ruby.setMode(new RubyMode());
    docs.ruby.setUndoManager(new UndoManager());

    docs.c_cpp = new EditSession(document.getElementById("cpptext").innerHTML);
    docs.c_cpp.setMode(new CCPPMode());
    docs.c_cpp.setUndoManager(new UndoManager());

    var container = document.getElementById("editor");
    env.editor = new Editor(new Renderer(container, theme));

    var modes = {
        text: new TextMode(),
        xml: new XmlMode(),
        html: new HtmlMode(),
        css: new CssMode(),
        javascript: new JavaScriptMode(),
        python: new PythonMode(),
        php: new PhpMode(),
        java: new JavaMode(),
        ruby: new RubyMode(),
        c_cpp: new CCPPMode()
    };

    function getMode() {
        return modes[modeEl.value];
    }

    var modeEl = document.getElementById("mode");
    var wrapModeEl = document.getElementById("soft_wrap");

    bindDropdown("doc", function(value) {
        var doc = docs[value];
        env.editor.setSession(doc);

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
        else if (mode instanceof JavaMode) {
            modeEl.value = "java";
        }
        else if (mode instanceof RubyMode) {
            modeEl.value = "ruby";
        }
        else if (mode instanceof CCPPMode) {
            modeEl.value = "c_cpp";
        }
        else {
            modeEl.value = "text";
        }

        if (!doc.getUseWrapMode()) {
            wrapModeEl.value = "off";
        } else {
            wrapModeEl.value = doc.getWrapLimit();
        }
        env.editor.focus();
    });

    bindDropdown("mode", function(value) {
        env.editor.getSession().setMode(modes[value] || modes.text);
    });

    bindDropdown("theme", function(value) {
        env.editor.setTheme(value);
    });

    bindDropdown("keybinding", function(value) {
        env.editor.setKeyboardHandler(keybindings[value]);
    });

    bindDropdown("fontsize", function(value) {
        document.getElementById("editor").style.fontSize = value;
    });

    bindDropdown("soft_wrap", function(value) {
        var session = env.editor.getSession();
        var renderer = env.editor.renderer;
        switch (value) {
            case "off":
                session.setUseWrapMode(false);
                renderer.setPrintMarginColumn(80);
                break;
            case "40":
                session.setUseWrapMode(true);
                session.setWrapLimit(40);
                renderer.setPrintMarginColumn(40);
                break;
            case "80":
                session.setUseWrapMode(true);
                session.setWrapLimit(80);
                renderer.setPrintMarginColumn(80);
                break;
        }
    });

    bindCheckbox("select_style", function(checked) {
        env.editor.setSelectionStyle(checked ? "line" : "text");
    });

    bindCheckbox("highlight_active", function(checked) {
        env.editor.setHighlightActiveLine(checked);
    });

    bindCheckbox("show_hidden", function(checked) {
        env.editor.setShowInvisibles(checked);
    });

    bindCheckbox("show_gutter", function(checked) {
        env.editor.renderer.setShowGutter(checked);
    });

    bindCheckbox("show_print_margin", function(checked) {
        env.editor.renderer.setShowPrintMargin(checked);
    });

    function bindCheckbox(id, callback) {
        var el = document.getElementById(id);
        var onCheck = function() {
            callback(!!el.checked);
        };
        el.onclick = onCheck;
        onCheck();
    }

    function bindDropdown(id, callback) {
        var el = document.getElementById(id);
        var onChange = function() {
            callback(el.value);
        };
        el.onchange = onChange;
        onChange();
    }

    function onResize() {
        container.style.width = (document.documentElement.clientWidth) + "px";
        container.style.height = (document.documentElement.clientHeight - 60 - 22) + "px";
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
                } else if (/^.*\.java$/i.test(file.name)) {
                    mode = "java";
                } else if (/^.*\.rb$/i.test(file.name)) {
                    mode = "ruby";
                } else if (/^.*\.(c|cpp|h|hpp|cxx)$/i.test(file.name)) {
                    mode = "c_cpp";
                }

                env.editor.onTextInput(reader.result);

                modeEl.value = mode;
                env.editor.getSession().setMode(modes[mode]);
            };
            reader.readAsText(file);
        }

        return event.preventDefault(e);
    });

    window.env = env;
};

});
