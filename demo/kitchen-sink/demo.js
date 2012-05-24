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
"never use strict";

require("ace/lib/fixoldbrowsers");
require("ace/config").init();
var env = {};

var dom = require("ace/lib/dom");
var net = require("ace/lib/net");

var event = require("ace/lib/event");
var theme = require("ace/theme/textmate");
var EditSession = require("ace/edit_session").EditSession;
var UndoManager = require("ace/undomanager").UndoManager;

var vim = require("ace/keyboard/vim").handler;
var emacs = require("ace/keyboard/emacs").handler;
var HashHandler = require("ace/keyboard/hash_handler").HashHandler;

var Renderer = require("ace/virtual_renderer").VirtualRenderer;
var Editor = require("ace/editor").Editor;
var MultiSelect = require("ace/multi_select").MultiSelect;

// workers do not work for file:
if (location.protocol == "file:")
    EditSession.prototype.$useWorker = false;

/************** modes ***********************/
var modesByName;
function getModeFromPath(path) {
    var mode = modesByName.text;
    for (var i = 0; i < modes.length; i++) {
        if (modes[i].supportsFile(path)) {
            mode = modes[i];
            break;
        }
    }
    return mode;
};

var Mode = function(name, desc, extensions) {
    this.name = name;
    this.desc = desc;
    this.mode = "ace/mode/" + name;
    this.extRe = new RegExp("^.*\\.(" + extensions.join("|") + ")$", "g");
};

Mode.prototype.supportsFile = function(filename) {
    return filename.match(this.extRe);
};

var modes = [
    new Mode("c_cpp", "C/C++", ["c", "cpp", "cxx", "h", "hpp"]),
    new Mode("clojure", "Clojure", ["clj"]),
    new Mode("coffee", "CoffeeScript", ["coffee"]),
    new Mode("coldfusion", "ColdFusion", ["cfm"]),
    new Mode("csharp", "C#", ["cs"]),
    new Mode("css", "CSS", ["css"]),
    new Mode("golang", "Go", ["go"]),
    new Mode("groovy", "Groovy", ["groovy"]),
    new Mode("haxe", "haXe", ["hx"]),
    new Mode("html", "HTML", ["html", "htm"]),
    new Mode("java", "Java", ["java"]),
    new Mode("javascript", "JavaScript", ["js"]),
    new Mode("json", "JSON", ["json"]),
    new Mode("latex", "LaTeX", ["tex"]),
    new Mode("less", "LESS", ["less"]),
    new Mode("lua", "Lua", ["lua"]),
    new Mode("liquid", "Liquid", ["liquid"]),
    new Mode("markdown", "Markdown", ["md", "markdown"]),
    new Mode("ocaml", "OCaml", ["ml", "mli"]),
    new Mode("scad", "OpenSCAD", ["scad"]),
    new Mode("perl", "Perl", ["pl", "pm"]),
    new Mode("pgsql", "pgSQL", ["pgsql", "sql"]),
    new Mode("php", "PHP", ["php"]),
    new Mode("powershell", "Powershell", ["ps1"]),
    new Mode("python", "Python", ["py"]),
    new Mode("scala", "Scala", ["scala"]),
    new Mode("scss", "SCSS", ["scss"]),
    new Mode("ruby", "Ruby", ["rb"]),
    new Mode("sql", "SQL", ["sql"]),
    new Mode("svg", "SVG", ["svg"]),
    new Mode("text", "Text", ["txt"]),
    new Mode("textile", "Textile", ["textile"]),
    new Mode("xml", "XML", ["xml"]),
    new Mode("sh", "SH", ["sh"]),
    new Mode("xquery", "XQuery", ["xq"]),
    new Mode("yaml", "YAML", ["yaml"])
];

modesByName = {};
modes.forEach(function(m) {
    modesByName[m.name] = m;
});

/*********** demo documents ***************************/
var fileCache = {};

function initDoc(file, path, doc) {
    if (doc.prepare)
        file = doc.prepare(file);

    var session = new EditSession(file);
    session.setUndoManager(new UndoManager());
    doc.session = session;
    doc.path = path;
    if (doc.wrapped) {
        session.setUseWrapMode(true);
        session.setWrapLimitRange(80, 80);
    }
    var mode = getModeFromPath(path)
    session.modeName = mode.name;
    session.setMode(mode.mode);
}


function makeHuge(txt) {
    for (var i = 0; i < 5; i++)
        txt += txt;
    return txt
}

var docs = {
    "docs/javascript.js": "JavaScript",
    "docs/plaintext.txt": {name: "Plain Text", prepare: makeHuge, wrapped: true},
    "docs/coffeescript.coffee": "Coffeescript",
    "docs/json.json": "JSON",
    "docs/css.css": "CSS",
    "docs/scss.scss": "SCSS",
    "docs/less.less": "LESS",
    "docs/html.html": "HTML",
    "docs/xml.xml": "XML",
    "docs/yaml.yaml": "YAML",
    "docs/svg.svg": "SVG",
    "docs/php.php": "PHP",
    "docs/coldfusion.cfm": "ColdFusion",
    "docs/python.py": "Python",
    "docs/ruby.rb": "Ruby",
    "docs/perl.pl": "Perl",
    "docs/ocaml.ml": "OCaml",
    "docs/OpenSCAD.scad": "OpenSCAD",
    "docs/lua.lua": "Lua",
    "docs/liquid.liquid": "Liquid",
    "docs/java.java": "Java",
    "docs/clojure.clj": "Clojure",
    "docs/groovy.groovy": "Groovy",
    "docs/scala.scala": "Scala",
    "docs/csharp.cs": "C#",
    "docs/powershell.ps1": "Powershell",
    "docs/cpp.cpp": "C/C++",
    "docs/Haxe.hx": "haXe",
    "docs/sh.sh": "SH",
    "docs/xquery.xq": "XQuery",
    "docs/markdown.md": {name: "Markdown", wrapped: true},
    "docs/textile.textile": {name: "Textile", wrapped: true},
    "docs/latex.tex": {name: "LaTeX", wrapped: true},
    "docs/sql.sql": {name: "SQL", wrapped: true},
    "docs/pgsql.pgsql": {name: "pgSQL", wrapped: true},
    "docs/golang.go": "Go"
}

var ownSource = {
    /* filled from require*/
};

var hugeDocs = {
    "build/src/ace.js": "",
    "build/src-min/ace.js": ""
};

if (window.require && window.require.s) try {
    for (var path in window.require.s.contexts._.loaded) {
        if (path.indexOf("!") != -1)
            path = path.split("!").pop();
        else
            path = path + ".js";
        ownSource[path] = ""
    }
} catch(e) {}

function prepareDocList(docs) {
    var list = []
    for (var path in docs) {
        var doc = docs[path];
        if (typeof doc != "object")
            doc = {name: doc || path};

        doc.path = path;
        doc.desc = doc.name.replace(/^(ace|docs|demo|build)\//, "");
        if (doc.desc.length > 18)
            doc.desc = doc.desc.slice(0, 7) + ".." + doc.desc.slice(-9)

        fileCache[doc.name] = doc;
        list.push(doc);
    };

    return list;
}

docs = prepareDocList(docs);
ownSource = prepareDocList(ownSource);
hugeDocs = prepareDocList(hugeDocs);

/*********** create editor ***************************/
var container = document.getElementById("editor");

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
window.editor = window.ace = env.editor;
env.editor.setAnimatedScroll(true);

var consoleHight = 20;
function onResize() {
    var left = env.split.$container.offsetLeft;
    var width = document.documentElement.clientWidth - left;
    container.style.width = width + "px";
    container.style.height = document.documentElement.clientHeight - consoleHight + "px";
    env.split.resize();

    consoleEl.style.width = width + "px";
    cmdLine.resize()
}

var consoleEl = dom.createElement("div");
container.parentNode.appendChild(consoleEl);
consoleEl.style.position="fixed"
consoleEl.style.bottom = "1px"
consoleEl.style.right = 0
consoleEl.style.background = "white"
consoleEl.style.border = "1px solid #baf"
consoleEl.style.zIndex = "100"
var cmdLine = new singleLineEditor(consoleEl);
cmdLine.editor = env.editor;
env.editor.cmdLine = cmdLine;

env.editor.commands.addCommands([{
    name: "gotoline",
    bindKey: {win: "Ctrl-L", mac: "Command-L"},
    exec: function(editor, line) {
        if (typeof needle == "object") {
            var arg = this.name + " " + editor.getCursorPosition().row;
            editor.cmdLine.setValue(arg, 1)
            editor.cmdLine.focus()
            return
        }
        line = parseInt(line, 10);
        if (!isNaN(line))
            editor.gotoLine(line);
    },
    readOnly: true
}, {
    name: "find",
    bindKey: {win: "Ctrl-F", mac: "Command-F"},
    exec: function(editor, needle) {
        if (typeof needle == "object") {
            var arg = this.name + " " + editor.getCopyText()
            editor.cmdLine.setValue(arg, 1)
            editor.cmdLine.focus()
            return
        }
        editor.find(needle);
    },
    readOnly: true
}, {
    name: "focusCommandLine",
    bindKey: "shift-esc",
    exec: function(editor, needle) { editor.cmdLine.focus(); },
    readOnly: true
}])

cmdLine.commands.bindKeys({
    "Shift-Return|Ctrl-Return|Alt-Return": function(cmdLine) { cmdLine.insert("\n")},
    "Esc|Shift-Esc": function(cmdLine){ cmdLine.editor.focus(); },
    "Return": function(cmdLine){
        var command = cmdLine.getValue().split(/\s+/);
        var editor = cmdLine.editor;
        editor.commands.exec(command[0], editor, command[1]);
        editor.focus();
    },
})

cmdLine.commands.removeCommands(["find", "goToLine", "findAll", "replace", "replaceAll"])

window.onresize = onResize;
onResize();

/**
 * This demonstrates how you can define commands and bind shortcuts to them.
 */

var commands = env.editor.commands;
commands.addCommand({
    name: "save",
    bindKey: {win: "Ctrl-S", mac: "Command-S"},
    exec: function() {alert("Fake Save File");}
});

commands.addCommand({
    name: "print",
    bindKey: {win: "Ctrl-P", mac: "Command-P"},
    exec: function(editor) {editor.session.setValue("please,\ndo not waste paper\n");}
});

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
};



/*********** options pane ***************************/
var docEl = document.getElementById("doc");
var modeEl = document.getElementById("mode");
var wrapModeEl = document.getElementById("soft_wrap");
var themeEl = document.getElementById("theme");
var foldingEl = document.getElementById("folding");
var selectStyleEl = document.getElementById("select_style");
var highlightActiveEl = document.getElementById("highlight_active");
var showHiddenEl = document.getElementById("show_hidden");
var showGutterEl = document.getElementById("show_gutter");
var showPrintMarginEl = document.getElementById("show_print_margin");
var highlightSelectedWordE = document.getElementById("highlight_selected_word");
var showHScrollEl = document.getElementById("show_hscroll");
var animateScrollEl = document.getElementById("animate_scroll");
var softTabEl = document.getElementById("soft_tab");
var behavioursEl = document.getElementById("enable_behaviours");

var group = document.createElement("optgroup");
group.setAttribute("label", "Mode Examples");
fillDropdown(docs, group);
docEl.appendChild(group);
var group = document.createElement("optgroup");
group.setAttribute("label", "Huge documents");
fillDropdown(hugeDocs, group);
docEl.appendChild(group);
var group = document.createElement("optgroup");
group.setAttribute("label", "own source");
fillDropdown(ownSource, group);
docEl.appendChild(group);


fillDropdown(modes, modeEl);

bindDropdown("mode", function(value) {
    env.editor.getSession().setMode(modesByName[value].mode || modesByName.text.mode);
    env.editor.getSession().modeName = value;
});

bindDropdown("doc", function(name) {
    var doc = fileCache[name];
    if (!doc)
        return;

    if (doc.session)
        return setSession(doc.session)

    //@todo do something while waiting
    // env.editor.setSession(emptySession || (emptySession = new EditSession("")))
    var path = doc.path;
    var parts = path.split("/");
    if (parts[0] == "docs")
        path = "demo/kitchen-sink/" + path;
    else if (parts[0] == "ace")
        path = "lib/" + path;

    net.get(path, function(x) {
        initDoc(x, path, doc);
        setSession(doc.session)
    })

    function setSession(session) {
        var session = env.split.setSession(session);
        updateUIEditorOptions();
        env.editor.focus();
    }
});

function updateUIEditorOptions() {
    var editor = env.editor;
    var session = editor.session;

    session.setFoldStyle(foldingEl.value);

    saveOption(docEl, session.name);
    saveOption(modeEl, session.modeName || "text");
    saveOption(wrapModeEl, session.getUseWrapMode() ? session.getWrapLimitRange().min || "free" : "off");

    saveOption(selectStyleEl, editor.getSelectionStyle() == "line");
    saveOption(themeEl, editor.getTheme());
    saveOption(highlightActiveEl, editor.getHighlightActiveLine());
    saveOption(showHiddenEl, editor.getShowInvisibles());
    saveOption(showGutterEl, editor.renderer.getShowGutter());
    saveOption(showPrintMarginEl, editor.renderer.getShowPrintMargin());
    saveOption(highlightSelectedWordE, editor.getHighlightSelectedWord());
    saveOption(showHScrollEl, editor.renderer.getHScrollBarAlwaysVisible());
    saveOption(animateScrollEl, editor.getAnimatedScroll());
    saveOption(softTabEl, session.getUseSoftTabs());
    saveOption(behavioursEl, editor.getBehavioursEnabled());
}

function saveOption(el, val) {
    if (!el.onchange && !el.onclick)
        return;

    if ("checked" in el) {
        if (val !== undefined)
            el.checked = val;

        localStorage && localStorage.setItem(el.id, el.checked ? 1 : 0);
    }
    else {
        if (val !== undefined)
            el.value = val;

        localStorage && localStorage.setItem(el.id, el.value);
    }
}

event.addListener(themeEl, "mouseover", function(e){
    this.desiredValue = e.target.value;
    if (!this.$timer)
        this.$timer = setTimeout(this.updateTheme);
})

event.addListener(themeEl, "mouseout", function(e){
    this.desiredValue = null;
    if (!this.$timer)
        this.$timer = setTimeout(this.updateTheme, 20);
})

themeEl.updateTheme = function(){
    env.split.setTheme(themeEl.desiredValue || themeEl.selectedValue);
    themeEl.$timer = null;
}

bindDropdown("theme", function(value) {
    if (!value)
        return;
    env.editor.setTheme(value);
    themeEl.selectedValue = value;
});

bindDropdown("keybinding", function(value) {
    env.editor.setKeyboardHandler(keybindings[value]);
});

bindDropdown("fontsize", function(value) {
    env.split.setFontSize(value);
});

bindDropdown("folding", function(value) {
    env.editor.getSession().setFoldStyle(value);
    env.editor.setShowFoldWidgets(value !== "manual");
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

bindCheckbox("animate_scroll", function(checked) {
    env.editor.setAnimatedScroll(checked);
});

bindCheckbox("soft_tab", function(checked) {
    env.editor.getSession().setUseSoftTabs(checked);
});

bindCheckbox("enable_behaviours", function(checked) {
    env.editor.setBehavioursEnabled(checked);
});

bindCheckbox("fade_fold_widgets", function(checked) {
    env.editor.setFadeFoldWidgets(checked);
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
            sp.setOrientation(sp.BELOW);
        } else {
            sp.setOrientation(sp.BESIDE);
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
    if (localStorage && localStorage.getItem(id))
        el.checked = localStorage.getItem(id) == "1";

    var onCheck = function() {
        callback(!!el.checked);
        saveOption(el);
    };
    el.onclick = onCheck;
    onCheck();
}

function bindDropdown(id, callback) {
    var el = document.getElementById(id);
    if (localStorage && localStorage.getItem(id))
        el.value = localStorage.getItem(id);

    var onChange = function() {
        callback(el.value);
        saveOption(el);
    };

    el.onchange = onChange;
    onChange();
}

function fillDropdown(list, el) {
    list.forEach(function(item) {
        var option = document.createElement("option");
        option.setAttribute("value", item.name);
        option.innerHTML = item.desc;
        el.appendChild(option);
    });
}


/************** dragover ***************************/
event.addListener(container, "dragover", function(e) {
    return event.preventDefault(e);
});

event.addListener(container, "drop", function(e) {
    var file;
    try {
        file = e.dataTransfer.files[0];
    } catch(err) {
        return event.stopEvent();
    }

    if (window.FileReader) {
        var reader = new FileReader();
        reader.onload = function() {
            var mode = getModeFromPath(file.name);

            env.editor.session.doc.setValue(reader.result);
            modeEl.value = mode.name;
            env.editor.session.setMode(mode.mode);
            env.editor.session.modeName = mode.name;
        };
        reader.readAsText(file);
    }

    return event.preventDefault(e);
});

// add multiple cursor support to editor
require("ace/multi_select").MultiSelect(env.editor);



function singleLineEditor(el) {
    var renderer = new Renderer(el);
    renderer.scrollBar.element.style.display = "none";
    renderer.scrollBar.width = 0;
    renderer.content.style.height = "auto";

    renderer.screenToTextCoordinates = function(x, y) {
        var pos = this.pixelToScreenCoordinates(x, y);
        return this.session.screenToDocumentPosition(
            Math.min(this.session.getScreenLength() - 1, Math.max(pos.row, 0)),
            Math.max(pos.column, 0)
        );
    };
    // todo size change event
    renderer.$computeLayerConfig = function() {
        var longestLine = this.$getLongestLine();
        var firstRow = 0;
        var lastRow = this.session.getLength();
        var height = this.session.getScreenLength() * this.lineHeight;

        this.scrollTop = 0;
        var config = this.layerConfig;
        config.width = longestLine;
        config.padding = this.$padding;
        config.firstRow = 0;
        config.firstRowScreen = 0;
        config.lastRow = lastRow;
        config.lineHeight = this.lineHeight;
        config.characterWidth = this.characterWidth;
        config.minHeight = height;
        config.maxHeight = height;
        config.offset = 0;
        config.height = height;

        this.$gutterLayer.element.style.marginTop = 0 + "px";
        this.content.style.marginTop = 0 + "px";
        this.content.style.width = longestLine + 2 * this.$padding + "px";
        this.content.style.height = height + "px";
        this.scroller.style.height = height + "px";
        this.container.style.height = height + "px";
    };
    renderer.isScrollableBy=function(){return false};

    var editor = new Editor(renderer);
    new MultiSelect(editor);
    editor.session.setUndoManager(new UndoManager());

    editor.setHighlightActiveLine(false);
    editor.setShowPrintMargin(false);
    editor.renderer.setShowGutter(false);
    // editor.renderer.setHighlightGutterLine(false);
    return editor;
};


});

