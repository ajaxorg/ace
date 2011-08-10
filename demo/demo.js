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
 *      Julian Viereck <julian DOT viereck AT gmail DOT com>
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
    var canon = require("pilot/canon");
    var event = require("pilot/event");
    var Range = require("ace/range").Range;
    var Editor = require("ace/editor").Editor;
    var Renderer = require("ace/virtual_renderer").VirtualRenderer;
    var theme = require("ace/theme/textmate");
    var EditSession = require("ace/edit_session").EditSession;

    var JavaScriptMode = require("ace/mode/javascript").Mode;
    var CssMode = require("ace/mode/css").Mode;
    var ScssMode = require("ace/mode/scss").Mode;
    var HtmlMode = require("ace/mode/html").Mode;
    var XmlMode = require("ace/mode/xml").Mode;
    var PythonMode = require("ace/mode/python").Mode;
    var PhpMode = require("ace/mode/php").Mode;
    var JavaMode = require("ace/mode/java").Mode;
    var CSharpMode = require("ace/mode/csharp").Mode;
    var RubyMode = require("ace/mode/ruby").Mode;
    var CCPPMode = require("ace/mode/c_cpp").Mode;
    var CoffeeMode = require("ace/mode/coffee").Mode;
    var JsonMode = require("ace/mode/json").Mode;
    var PerlMode = require("ace/mode/perl").Mode;
    var ClojureMode = require("ace/mode/clojure").Mode;
    var OcamlMode = require("ace/mode/ocaml").Mode;
    var SvgMode = require("ace/mode/svg").Mode;
    var TextileMode = require("ace/mode/textile").Mode;
    var TextMode = require("ace/mode/text").Mode;
    var GroovyMode = require("ace/mode/groovy").Mode;
    var ScalaMode = require("ace/mode/scala").Mode;

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
          "gotoright":      "Tab",
          "indent":         "]",
          "outdent":        "[",
          "gotolinestart":  "^",
          "gotolineend":    "$"
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
    docs.plain.setWrapLimitRange(80, 80)
    docs.plain.setMode(new TextMode());
    docs.plain.setUndoManager(new UndoManager());

    docs.js = new EditSession(document.getElementById("jstext").innerHTML);
    docs.js.setMode(new JavaScriptMode());
    docs.js.setUndoManager(new UndoManager());

    docs.css = new EditSession(document.getElementById("csstext").innerHTML);
    docs.css.setMode(new CssMode());
    docs.css.setUndoManager(new UndoManager());

    docs.scss = new EditSession(document.getElementById("scsstext").innerHTML);
    docs.scss.setMode(new ScssMode());
    docs.scss.setUndoManager(new UndoManager());

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
    docs.java.addFold("...", new Range(8, 44, 13, 4));

    docs.ruby = new EditSession(document.getElementById("rubytext").innerHTML);
    docs.ruby.setMode(new RubyMode());
    docs.ruby.setUndoManager(new UndoManager());

    docs.csharp = new EditSession(document.getElementById("csharptext").innerHTML);
    docs.csharp.setMode(new CSharpMode());
    docs.csharp.setUndoManager(new UndoManager());

    docs.c_cpp = new EditSession(document.getElementById("cpptext").innerHTML);
    docs.c_cpp.setMode(new CCPPMode());
    docs.c_cpp.setUndoManager(new UndoManager());

    docs.coffee = new EditSession(document.getElementById("coffeetext").innerHTML);
    docs.coffee.setMode(new CoffeeMode());
    docs.coffee.setUndoManager(new UndoManager());

    docs.json = new EditSession(document.getElementById("jsontext").innerHTML);
    docs.json.setMode(new JsonMode());
    docs.json.setUndoManager(new UndoManager());

    docs.perl = new EditSession(document.getElementById("perltext").innerHTML);
    docs.perl.setMode(new PerlMode());
    docs.perl.setUndoManager(new UndoManager());

    docs.clojure = new EditSession(document.getElementById("clojuretext").innerHTML);
    docs.clojure.setMode(new ClojureMode());
    docs.clojure.setUndoManager(new UndoManager());

    docs.ocaml = new EditSession(document.getElementById("ocamltext").innerHTML);
    docs.ocaml.setMode(new OcamlMode());
    docs.ocaml.setUndoManager(new UndoManager());

    docs.svg = new EditSession(document.getElementById("svgtext").innerHTML.replace("&lt;", "<"));
    docs.svg.setMode(new SvgMode());
    docs.svg.setUndoManager(new UndoManager());

    docs.textile = new EditSession(document.getElementById("textiletext").innerHTML);
    docs.textile.setMode(new TextileMode());
    docs.textile.setUndoManager(new UndoManager());

    docs.groovy = new EditSession(document.getElementById("groovy").innerHTML);
    docs.groovy.setMode(new GroovyMode());
    docs.groovy.setUndoManager(new UndoManager());

    docs.scala = new EditSession(document.getElementById("scala").innerHTML);
    docs.scala.setMode(new ScalaMode());
    docs.scala.setUndoManager(new UndoManager());

    
    

    // Add a "name" property to all docs
    for (doc in docs) {
        docs[doc].name = doc;
    }

    var container = document.getElementById("editor");
    var cockpitInput = document.getElementById("cockpitInput");

    // Splitting.
    var Split = require("ace/split").Split;
    var split = new Split(container, theme, 1);
    env.editor = split.getEditor(0);
    split.on("focus", function(editor) {
        env.editor = editor;
        updateUIEditorOptions();
    });
    env.split = split;
    window.env = env;
    window.ace = env.editor;

    var modes = {
        text: new TextMode(),
        textile: new TextileMode(),
        svg: new SvgMode(),
        xml: new XmlMode(),
        html: new HtmlMode(),
        css: new CssMode(),
        scss: new ScssMode(),
        javascript: new JavaScriptMode(),
        python: new PythonMode(),
        php: new PhpMode(),
        java: new JavaMode(),
        ruby: new RubyMode(),
        c_cpp: new CCPPMode(),
        coffee: new CoffeeMode(),
        json: new JsonMode(),
        perl: new PerlMode(),
        clojure: new ClojureMode(),
        ocaml: new OcamlMode(),
        csharp: new CSharpMode(),
        groovy: new GroovyMode(),
        scala: new ScalaMode()
    };

    function getMode() {
        return modes[modeEl.value];
    }

    var docEl = document.getElementById("doc");
    var modeEl = document.getElementById("mode");
    var wrapModeEl = document.getElementById("soft_wrap");
    var themeEl = document.getElementById("theme");
    var selectStyleEl = document.getElementById("select_style");
    var highlightActiveEl = document.getElementById("highlight_active");
    var showHiddenEl = document.getElementById("show_hidden");
    var showGutterEl = document.getElementById("show_gutter");
    var showPrintMarginEl = document.getElementById("show_print_margin");
    var highlightSelectedWordE = document.getElementById("highlight_selected_word");
    var showHScrollEl = document.getElementById("show_hscroll");
    var softTabEl = document.getElementById("soft_tab");
    var behavioursEl = document.getElementById("enable_behaviours");

    bindDropdown("doc", function(value) {
        var doc = docs[value];
        var session = env.split.setSession(doc);
        session.name = doc.name;

        updateUIEditorOptions();

        env.editor.focus();
    });

    function updateUIEditorOptions() {
        var editor = env.editor;
        var session = editor.session;

        docEl.value = session.name;

        var mode = session.getMode();
        if (mode instanceof JavaScriptMode) {
            modeEl.value = "javascript";
        }
        else if (mode instanceof CssMode) {
            modeEl.value = "css";
        }
        else if (mode instanceof ScssMode) {
            modeEl.value = "scss";
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
        else if (mode instanceof CoffeeMode) {
            modeEl.value = "coffee";
        }
        else if (mode instanceof JsonMode) {
            modeEl.value = "json";
        }
        else if (mode instanceof PerlMode) {
            modeEl.value = "perl";
        }
        else if (mode instanceof ClojureMode) {
            modeEl.value = "clojure";
        }
        else if (mode instanceof OcamlMode) {
            modeEl.value = "ocaml";
        }
        else if (mode instanceof CSharpMode) {
            modeEl.value = "csharp";
        }
        else if (mode instanceof SvgMode) {
            modeEl.value = "svg";
        }
        else if (mode instanceof TextileMode) {
            modeEl.value = "textile";
        }
        else if (mode instanceof GroovyMode) {
            modeEl.value = "groovy";
        }
        else if (mode instanceof ScalaMode) {
            modeEl.value = "scala";
        }
        else {
            modeEl.value = "text";
        }

        if (!session.getUseWrapMode()) {
            wrapModeEl.value = "off";
        } else {
            wrapModeEl.value = session.getWrapLimitRange().min || "free";
        }

        selectStyleEl.checked = editor.getSelectionStyle() == "line"
        themeEl.value = editor.getTheme();
        highlightActiveEl.checked = editor.getHighlightActiveLine();
        showHiddenEl.checked = editor.getShowInvisibles();
        showGutterEl.checked = editor.renderer.getShowGutter();
        showPrintMarginEl.checked = editor.renderer.getShowPrintMargin();
        highlightSelectedWordE.checked = editor.getHighlightSelectedWord();
        showHScrollEl.checked = editor.renderer.getHScrollBarAlwaysVisible();
        softTabEl.checked = session.getUseSoftTabs();
        behavioursEl.checked = editor.getBehavioursEnabled()
    }

    bindDropdown("mode", function(value) {
        env.editor.getSession().setMode(modes[value] || modes.text);
    });

    bindDropdown("theme", function(value) {
        if (require.packaged) {
            loadTheme(value, function() {
                env.editor.setTheme(value);
            });
        }
        else {
            env.editor.setTheme(value);
        }
    });

    bindDropdown("keybinding", function(value) {
        env.editor.setKeyboardHandler(keybindings[value]);
    });

    bindDropdown("fontsize", function(value) {
        env.split.setFontSize(value);
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
                session.setWrapLimitRange(40, 40);
                renderer.setPrintMarginColumn(40);
                break;
            case "80":
                session.setUseWrapMode(true);
                session.setWrapLimitRange(80, 80);
                renderer.setPrintMarginColumn(80);
                break;
            case "free":
                session.setUseWrapMode(true);
                session.setWrapLimitRange(null, null);
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

    bindCheckbox("highlight_selected_word", function(checked) {
        env.editor.setHighlightSelectedWord(checked);
    });

    bindCheckbox("show_hscroll", function(checked) {
        env.editor.renderer.setHScrollBarAlwaysVisible(checked);
    });

    bindCheckbox("soft_tab", function(checked) {
        env.editor.getSession().setUseSoftTabs(checked);
    });

    bindCheckbox("enable_behaviours", function(checked) {
        env.editor.setBehavioursEnabled(checked);
    });

    var secondSession = null;
    bindDropdown("split", function(value) {
        var sp = env.split;
        if (value == "none") {
            if (sp.getSplits() == 2) {
                secondSession = sp.getEditor(1).session;
            }
            sp.setSplits(1);
        } else {
            var newEditor = (sp.getSplits() == 1);
            if (value == "below") {
                sp.setOriantation(sp.BELOW);
            } else {
                sp.setOriantation(sp.BESIDE);
            }
            sp.setSplits(2);

            if (newEditor) {
                var session = secondSession || sp.getEditor(0).session;
                var newSession = sp.setSession(session, 1);
                newSession.name = session.name;
            }
        }
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
        var width = (document.documentElement.clientWidth - 280);
        container.style.width = width + "px";
        cockpitInput.style.width = width + "px";
        container.style.height = (document.documentElement.clientHeight - 22) + "px";
        env.split.resize();
//        env.editor.resize();
    };

    window.onresize = onResize;
    onResize();

    // Call resize on the cli explizit. This is necessary for Firefox.
    env.cli.cliView.resizer()

    event.addListener(container, "dragover", function(e) {
        return event.preventDefault(e);
    });

    event.addListener(container, "drop", function(e) {
        var file
        try {
            file = e.dataTransfer.files[0];
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
                } else if (/^.*\.scss$/i.test(file.name)) {
                    mode = "scss";
                } else if (/^.*\.py$/i.test(file.name)) {
                    mode = "python";
                } else if (/^.*\.php$/i.test(file.name)) {
                    mode = "php";
                } else if (/^.*\.cs$/i.test(file.name)) {
                    mode = "csharp";
                } else if (/^.*\.java$/i.test(file.name)) {
                    mode = "java";
                } else if (/^.*\.rb$/i.test(file.name)) {
                    mode = "ruby";
                } else if (/^.*\.(c|cpp|h|hpp|cxx)$/i.test(file.name)) {
                    mode = "c_cpp";
                } else if (/^.*\.coffee$/i.test(file.name)) {
                    mode = "coffee";
                } else if (/^.*\.json$/i.test(file.name)) {
                    mode = "json";
                } else if (/^.*\.(pl|pm)$/i.test(file.name)) {
                    mode = "perl";
                } else if (/^.*\.(ml|mli)$/i.test(file.name)) {
                    mode = "ocaml";
                } else if (/^.*\.(groovy)$/i.test(file.name)) {
                    mode = "groovy";
                } else if (/^.*\.(scala)$/i.test(file.name)) {
                    mode = "scala";
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

    /**
     * This demonstrates how you can define commands and bind shortcuts to them.
     */

    // Command to focus the command line from the editor.
    canon.addCommand({
        name: "focuscli",
        bindKey: {
            win: "Ctrl-J",
            mac: "Command-J",
            sender: "editor"
        },
        exec: function() {
            env.cli.cliView.element.focus();
        }
    });

    // Command to focus the editor line from the command line.
    canon.addCommand({
        name: "focuseditor",
        bindKey: {
            win: "Ctrl-J",
            mac: "Command-J",
            sender: "cli"
        },
        exec: function() {
            env.editor.focus();
        }
    });

    // Fake-Save, works from the editor and the command line.
    canon.addCommand({
        name: "save",
        bindKey: {
            win: "Ctrl-S",
            mac: "Command-S",
            sender: "editor|cli"
        },
        exec: function() {
            alert("Fake Save File");
        }
    });

    // Fake-Print with custom lookup-sender-match function.
    canon.addCommand({
        name: "print",
        bindKey: {
            win: "Ctrl-P",
            mac: "Command-P",
            sender: function(env, sender, hashId, keyString) {
                if (sender == "editor") {
                    return true;
                } else {
                    alert("Sorry, can only print from the editor");
                }
            }
        },
        exec: function() {
            alert("Fake Print File");
        }
    });

    canon.addCommand({
        name: "fold",
        bindKey: {
            win: "Alt-L",
            mac: "Alt-L",
            sender: "editor"
        },
        exec: function(env) {
            toggleFold(env, false)
        }
    });

    canon.addCommand({
        name: "unfold",
        bindKey: {
            win: "Alt-Shift-L",
            mac: "Alt-Shift-L",
            sender: "editor"
        },
        exec: function(env) {
            toggleFold(env, true)
        }
    });

    function isCommentRow(row) {
        var session = env.editor.session;
        var token;
        var tokens = session.getTokens(row, row)[0].tokens;
        var c = 0;
        for (var i = 0; i < tokens.length; i++) {
            token = tokens[i];
            if (/^comment/.test(token.type)) {
                return c;
            } else if (!/^text/.test(token.type)) {
                return false;
            }
            c += token.value.length;
        }
        return false;
    };

    function toggleFold(env, tryToUnfold) {
        var session = env.editor.session;
        var selection = env.editor.selection;
        var range = selection.getRange();
        var addFold;

        if(range.isEmpty()) {
            var br = session.findMatchingBracket(range.start);
            var fold = session.getFoldAt(range.start.row, range.start.column);
            var column;

            if (fold) {
                session.expandFold(fold);
                selection.setSelectionRange(fold.range)
            } else if (br) {
                if (range.compare(br.row, br.column) == 1)
                    range.end = br;
                else
                    range.start = br;
                addFold = true;
            } else if ((column = isCommentRow(range.start.row)) !== false) {
                var firstCommentRow = range.start.row;
                var lastCommentRow = range.start.row;
                var t;
                while ((t = isCommentRow(firstCommentRow - 1)) !== false) {
                    firstCommentRow --;
                    column = t;
                }
                while (isCommentRow(lastCommentRow + 1) !== false) {
                    lastCommentRow ++;
                }
                range.start.row = firstCommentRow;
                range.start.column = column + 2;
                range.end.row = lastCommentRow;
                range.end.column = session.getLine(lastCommentRow).length - 1;
                addFold = true;
            }
        } else {
            addFold = true;
        }
        if (addFold) {
            var placeHolder = session.getTextRange(range);
            if(placeHolder.length < 3)
                return;
            placeHolder = placeHolder.trim().substring(0, 3).replace(' ','','g') + "...";
            session.addFold(placeHolder, range);
        }
    }
};

var themes = {};
function loadTheme(name, callback) {
    if (themes[name])
        return;
        
    themes[name] = 1;
    var base = name.split("/").pop();
    var fileName = "src/theme-" + base + ".js";
    loadScriptFile(fileName, callback)
}

function loadScriptFile(path, callback) {
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('script');

    s.src = path;
    head.appendChild(s);
    
    s.onload = callback;
}

});
