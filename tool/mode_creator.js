define(function(require, exports, module) {

/** creates globals intentionally to make things easily accessible from console **/

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
    var hp = "./lib/ace/mode/" + value + "_highlight_rules.js";
    net.get(hp, function(text) {
        text = util.stripLeadingComments(text);

        var session = new EditSession(text);
        session.setUndoManager(new UndoManager());
        modeSessions[value] = session;
        session.setMode("ace/mode/javascript");

        editor1.setSession(modeSessions[value]);
        schedule();
    });
});

document.getElementById("syncToMode").onclick = function() {
    docEl.value = modelist.modesByName[modeEl.value].desc;
    docEl.onchange();
    run();
}
document.getElementById("perfTest").onclick = function() {
    var lines = editor2.session.doc.getAllLines()
    if (!lines.length)
        return
    while (lines.length < 1000) {
        lines = lines.concat(lines)
    }

    var tk = new Tokenizer(currentRules);
    var testPerf = function(lines, tk){
        var state = "start"
        for (var i=0, l = lines.length; i <l; i++) {
            state = tk.getLineTokens(lines[i], state).state
        }
    }

    var t = performance.now();
    testPerf(lines, tk);
    t = t - performance.now(t);
    log("tokenized " + lines.length + " lines in " + t + " ms");
}

util.fillDropdown("themeEl", {
    bright: [
        "chrome", "clouds", "crimson_editor", "dawn", "dreamweaver", "eclipse", "github",
        "solarized_light", "textmate", "tomorrow", "xcode"],
    dark: [ "clouds_midnight", "cobalt", "idle_fingers", "kr_theme", "merbivore", "merbivore_soft",
        "mono_industrial", "monokai", "pastel_on_dark", "solarized_dark",  "terminal", "tomorrow_night",
        "tomorrow_night_blue", "tomorrow_night_bright", "tomorrow_night_eighties", "twilight", "vibrant_ink"]
});

util.bindDropdown("themeEl", function(value) {
    if (!value)
        return;
    editor1.setTheme("ace/theme/" + value);
    editor2.setTheme("ace/theme/" + value);
});


function getDeps(src, path) {
    var deps = [];
    src.replace(/require\((['"])(.*?)\1/g, function(a,b,c){
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
    window.require.undef(path)
    src = src.replace("define(", 'define("' + path +'", ["require","exports","module",' + deps +'],');    
    try {
        eval(src);
        require(["ace/mode/new"], function(e) {
            try{
                continueRun(e)
            }catch(e){
                log(e)
            }
        }, function(e) {
            log(e);
            window.require.undef(path)
        });
        hideLog()
    } catch(e) {
        log(e);
    }
}
var currentRules
var continueRun = function(rules) {
    rules = rules[Object.keys(rules)[0]];
    currentRules = new rules().getRules()
    var Tokenizer = DebugTokenizer;

    var tk = new Tokenizer(currentRules);
    editor2.session.$mode.$tokenizer = tk;
    editor2.session.bgTokenizer.setTokenizer(tk);
    editor2.renderer.updateText();
};

editor1.commands.bindKey("ctrl-Return", run);

var logEditor
function log(e) {
    console.log(e)
    if (!logEditor) {
        logEditor = util.createEditor(document.getElementById("consoleEditor"));
        logEditor.session.setMode("ace/mode/javascript")
        logEditor.session.setUseWorker(false)
    }
    logEditor.container.parentNode.style.display = '';
    logEditor.resize()
    logEditor.navigateFileEnd(e);
    logEditor.insert(e + "\n");
}
function hideLog() {
    if (logEditor)
        logEditor.container.parentNode.style.display = 'none';
}

});

