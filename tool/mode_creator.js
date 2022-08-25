define(function(require, exports, module) {

/** creates globals intentionally to make things easily accessible from console **/

require("ace/ext/language_tools");
var config = require("ace/config");
config.setDefaultValues("editor", {
    enableBasicAutocompletion: true,
    enableSnippets: true
});
config.setLoader(function(moduleName, cb) {
    require([moduleName], function(module) {
        cb(null, module);
    });
});

var net = require("ace/lib/net");
var Range = require("ace/range").Range;
var util = require("demo/kitchen-sink/util");
var layout = require("demo/kitchen-sink/layout");
var modelist = require("ace/ext/modelist");
var doclist = require("demo/kitchen-sink/doclist");
var TokenTooltip = require("demo/kitchen-sink/token_tooltip").TokenTooltip;

var EditSession = require("ace/edit_session").EditSession;
var UndoManager = require("ace/undomanager").UndoManager;

var DebugTokenizer = require("ace/tokenizer_dev").Tokenizer;
var Tokenizer = require("ace/tokenizer").Tokenizer;

var themelist = require("ace/ext/themelist");

// createEditor
var splitEditor = window.splitEditor = util.createSplitEditor("editor");

var editor1 = window.editor1 = splitEditor.editor0;
var editor2 = window.editor2 = splitEditor.editor1;
new TokenTooltip(editor2);

var timeout = null;
var schedule = function() {
    if (timeout != null) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(run, 800);
};


var setAutorunEnabled = function(val) {
    if (val)
        editor1.on('change', schedule);
    else
        editor1.removeEventListener('change', schedule);
};

util.bindCheckbox("autorunEl", setAutorunEnabled);


var docEl = document.getElementById("doc");
util.fillDropdown(docEl, doclist.docs);
util.bindDropdown("doc", function(value) {
    doclist.loadDoc(value, function(session) {
        if (session) {
            editor2.setSession(session);
            updateSaveButtonState(null, editor2);
        }
    });
});

var modeEl = document.getElementById("modeEl");
util.fillDropdown(modeEl, modelist.modes);
var modeSessions = {};

util.bindDropdown(modeEl, function(value) {
    if (modeSessions[value]) {
        editor1.setSession(modeSessions[value]);
        schedule();
        return;
    }
    var hp = "./src/mode/" + value + "_highlight_rules.js";
    net.get(hp, function(text) {
        var session = new EditSession(text);
        session.setUndoManager(new UndoManager());

        modeSessions[value] = session;
        session.setMode("ace/mode/javascript", function() {
            if (session.getLine(0).match(/^\s*\//))
                session.toggleFoldWidget(0); // fold licence comment
        });

        editor1.setSession(modeSessions[value]);
        updateSaveButtonState(null, editor1);
        schedule();
    });
});

document.getElementById("syncToMode").onclick = function() {
    docEl.value = modelist.modesByName[modeEl.value].desc;
    docEl.onchange();
    run();
};

editor1.saveButton = document.getElementById("saveButton1");
editor2.saveButton = document.getElementById("saveButton2");
editor1.saveButton.editor = editor1;
editor2.saveButton.editor = editor2;

editor1.saveButton.onclick = function() {
    doclist.saveDoc({
        path: "./lib/ace/mode/" + modeEl.value + "_highlight_rules.js",
        session: editor1.session
    }, function(err) {
        handleSaveResult(err, editor1);
    });
};
editor1.commands.bindKey({
    win: "Ctrl-S", mac: "Cmd-s"
}, editor1.saveButton.onclick);
editor2.saveButton.onclick = function() {
    doclist.saveDoc(docEl.value, function(err) {
        handleSaveResult(err, editor2);
    });
};
editor2.commands.bindKey({
    win: "Ctrl-S", mac: "Cmd-s"
}, editor2.saveButton.onclick);
function updateSaveButtonState(e, editor){
    editor.saveButton.disabled = editor.session.getUndoManager().isClean();
}
editor1.on("input", updateSaveButtonState);
editor2.on("input", updateSaveButtonState);

function handleSaveResult(err, editor) {
    if (err) {
        return log(
            "Write access to this file is disabled.\n"+
            "To enable saving your changes to disk, clone the Ace repository\n"+
            "and run the included web server with the --allow-save option\n"+
            "`node static.js --allow-save` or `static.py --puttable=*`"
        );
    }
    editor.session.getUndoManager().markClean();
    updateSaveButtonState(null, editor);
}

document.getElementById("perfTest").onclick = function() {
    var lines = editor2.session.doc.getAllLines();
    if (!lines.length)
        return;
    while (lines.length < 1000) {
        lines = lines.concat(lines);
    }

    var tk = new Tokenizer(currentRules);
    var testPerf = function(lines, tk) {
        var state = "start";
        for (var i=0, l = lines.length; i <l; i++) {
            state = tk.getLineTokens(lines[i], state).state;
        }
    };

    var t = performance.now();
    testPerf(lines, tk);
    t = t - performance.now(t);
    log("tokenized " + lines.length + " lines in " + t + " ms");
};

var themes = { Bright: [], Dark: [] };
themelist.themes.forEach(function(x) {
    themes[x.isDark ? "Dark" : "Bright"].push({ caption: x.caption, value: x.name });
});
util.fillDropdown("themeEl", themes);

util.bindDropdown("themeEl", function(value) {
    if (!value)
        return;
    editor1.setTheme("ace/theme/" + value);
    editor2.setTheme("ace/theme/" + value);
});


function getDeps(src, path) {
    var deps = [];
    src.replace(/require\((['"])(.*?)\1/g, function(a,b,c) {
        if (c[0] == ".") {
            var base = path.split("/");
            c.split("/").forEach(function(part) {
                if (part == ".") {
                    base.pop();
                } else if (part == "..") {
                    base.pop();
                    base.pop();
                } else {
                    base.push(part);
                }
            });
            c = base.join("/");
        }
        deps.push('"' + c + '"');
    });

    return deps;
}
function run() {
    var src = editor1.getValue();
    var path = "ace/mode/new";
    var deps = getDeps(src, path);
    window.require.undef(path);
    if (!/\bdefine\s*\(/.test(src)) {
        src = "define(function(require, exports, module) {" + src + "\n});";
    }
    src = src.replace("define(", 'define("' + path +'", ["require","exports","module",' + deps +'],');
    try {
        eval(src);
        require([path], function(e) {
            try {
                continueRun(e);
            } catch(e) {
                log(e);
            }
        }, function(e) {
            log(e);
            window.require.undef(path);
        });
        hideLog();
    } catch(e) {
        log(e);
    }
}
var currentRules;
var continueRun = function(rules) {
    for (var i in rules) {
        if (typeof rules[i] == "function" && /rules/i.test(i)) {
            rules = rules[i];
            break;
        }
    }
    currentRules = new rules().getRules();
    var Tokenizer = DebugTokenizer;
    var Mode = require(editor2.session.$mode.$id).Mode;
    editor2.session.$mode = new Mode();
    var tk = new Tokenizer(currentRules);
    editor2.session.$mode.$tokenizer = tk;
    editor2.session.bgTokenizer.setTokenizer(tk);
    editor2.renderer.updateText();
};

editor1.commands.bindKey("ctrl-Return", run);

var logEditor;
function log(e) {
    console.log(e);
    if (!logEditor) {
        logEditor = util.createEditor(document.getElementById("consoleEditor"));
        logEditor.session.setMode("ace/mode/javascript");
        logEditor.session.setUseWorker(false);
    }
    logEditor.container.parentNode.style.display = '';
    logEditor.resize();
    logEditor.navigateFileEnd(e);
    logEditor.insert(e + "\n");
}
function hideLog() {
    if (logEditor)
        logEditor.container.parentNode.style.display = 'none';
}

});

