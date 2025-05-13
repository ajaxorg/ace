"use strict";

var assert = require("../../test/assertions");
require("../../test/mockdom");

var {InlineDiffView} = require("./inline_diff_view");
var {DiffView} = require("./diff_view");
var {DiffProvider} = require("./providers/default");

var ace = require("../../ace");
var Range = require("../../range").Range;
var editorA, editorB, diffView;

var DEBUG = false;

function createEditor() {
    var editor = ace.edit(null);
    document.body.appendChild(editor.container);
    editor.container.style.height = "200px";
    editor.container.style.width = "300px";
    editor.container.style.position = "absolute";
    editor.container.style.outline = "solid";
    return editor;
} 

function getValueA(lines) {
    return lines.map(function(v) {
        return v[0]; 
    }).filter(function(x) {
        return x != null;
    }).join("\n");
}
function getValueB(lines) {
    return lines.map(function(v) {
        return v.length == 2 ? v[1] : v[0]; 
    }).filter(function(x) {
        return x != null;
    }).join("\n");
}
var simpleDiff = [
    ["a"],
    ["b"],
    ["c"],
    [null, "inserted1"],
    [null, "inserted2"],
    ["e"],
    ["f"],
    ["g", "edited g"],
    ["h"],
    ["i"],
];
var diffAtEnds = [
    [null, "only new"],
    [null, "only new"],
    ["a"],
    ["b"],
    ["c"],
    ["d"],
    ["e"],
    ["f"],
    ["g"],
    ["h"],
    ["i"],
    ["j"],
    ["k"],
    ["only old", null],
    ["only old2", null],
];

module.exports = {
    setUpSuite: function() {
        ace.config.setLoader(function(moduleName, cb) {
            if (moduleName == "ace/ext/error_marker")
                return cb(null, require("../error_marker"));
        });
        editorA = createEditor();
        editorB = createEditor();
        editorB.container.style.left = "301px";
        editorA.focus();
    },
    tearDownSuite: function() {
        if (DEBUG) return;
        [editorA, editorB].forEach(function(editor) {
            if (editor) {
                editor.destroy();
                editor.container.remove();
                editor = null;
            }
        });
    },
    tearDown: function() {
        if (DEBUG) return;
        if (diffView) {
            diffView.detach();
            diffView = null;
        }
    },
    "test: clean detach": function() {
        var diffProvider = new DiffProvider();

        editorA.session.setValue(getValueA(simpleDiff));
        editorB.session.setValue(getValueB(simpleDiff));

        assert.ok(!!editorA.session.widgetManager);
        assert.ok(!!editorB.session.widgetManager);

        var uid = 0;
        var saved = {};
        function saveEventRegistry(object) {
            var id = object.id;
            if (!id) {
                id = object.id = "unknown" + (uid++);
            }
            var eventRegistry = {};
            for (var key in object._eventRegistry) {
                var handlers = object._eventRegistry[key];
                eventRegistry[key] = handlers.slice(0);
            }
            saved[id] = {eventRegistry, object};
            if (/session/.test(id)) {
                saved[id].$frontMarkers = Object.keys(object.$frontMarkers);
            }
        }
        function checkEventRegistry() {
            for (var id in saved) {
                var object = saved[id].object;
                var eventRegistry = saved[id].eventRegistry;
                for (var eventName in object._eventRegistry) {
                    var handlers = object._eventRegistry[eventName];
                    var savedHandlers = eventRegistry[eventName] || [];
                    assert.notEqual(handlers, savedHandlers);
                    assert.equal(handlers.length, savedHandlers.length, id + ":" + eventName);
                    for (var j = 0; j < handlers.length; j++) {
                        assert.equal(handlers[j], eventRegistry[eventName][j], id + ":" + eventName);
                    }
                }
                if (saved[id].$frontMarkers) {
                    var frontMarkers = Object.keys(object.$frontMarkers);
                    assert.equal(frontMarkers + "", saved[id].$frontMarkers + "", id);
                }
            }
        }
        saveEventRegistry(editorA);
        saveEventRegistry(editorB);
        saveEventRegistry(editorA.session);
        saveEventRegistry(editorB.session);
        saveEventRegistry(editorA.renderer);
        saveEventRegistry(editorB.renderer);

        var diffView = new InlineDiffView({
            editorA, editorB,
            showSideA: true,
            diffProvider,
        });
        editorA.session.addFold("---", new Range(0, 0, 2, 0));
        diffView.onInput();
        diffView.resize(true);
        
        assert.equal(editorA.session.$foldData.length, 1);
        assert.equal(editorB.session.$foldData.length, 1);
        
        diffView.detach();
        var sessionB = editorB.session;
        sessionB.widgetManager.attach(editorB);
        checkEventRegistry();

        diffView = new DiffView({editorA, editorB, diffProvider});
        editorB.session.addFold("---", new Range(5, 0, 7, 0));
        editorB.renderer.$loop._flush();
        editorA.renderer.$loop._flush();
        assert.equal(editorA.session.$foldData.length, 2);
        assert.equal(editorB.session.$foldData.length, 2);
        
        diffView.onInput();
        diffView.resize(true);

        diffView.detach();
        checkEventRegistry();


        var diffView = new InlineDiffView({
            editorB, valueA: editorA.getValue(),
            showSideB: true,
            diffProvider,
        });

        diffView.onInput();
        diffView.resize(true);

        diffView.detach();
        checkEventRegistry();
        
    },
    "test: diff at ends": function() {
        var diffProvider = new DiffProvider();

        var valueA = getValueA(diffAtEnds);
        var valueB = getValueB(diffAtEnds);

        diffView = new InlineDiffView({
            valueA,
            valueB,
            showSideA: true,
            diffProvider,
        }, document.body);
        diffView.onInput();
        diffView.resize(true);
        assert.equal(diffView.chunks.length, 2);
        diffView.detach();

        diffView = new DiffView({
            valueA,
            valueB,
            diffProvider,
        }, document.body);
        diffView.onInput();
        diffView.resize(true);
        assert.equal(diffView.chunks.length, 2);

        diffView.detach();

        diffView = new InlineDiffView({
            valueA,
            valueB,
            showSideA: false,
        }, document.body);
        diffView.onInput();
        diffView.resize(true);
        assert.equal(diffView.chunks.length, 0);
        diffView.detach();
    },
    "test scroll": function() {
        var diffProvider = new DiffProvider();

        var valueA = getValueA(diffAtEnds);
        var valueB = getValueB(diffAtEnds);

        editorA.session.setValue(valueA);
        editorB.session.setValue(valueB);

        diffView = new DiffView({
            editorA, editorB,
            diffProvider,
        });


        diffView.onInput();
        diffView.resize(true);
        assert.equal(diffView.chunks.length, 2);

        diffView.setDiffSession({
            sessionA: ace.createEditSession(valueA.repeat(20)),
            sessionB: ace.createEditSession(valueB.repeat(20)),
        });

        diffView.onInput();
        diffView.resize(true);
        assert.equal(diffView.chunks.length, 21);
        diffView.editorA.setOption("animatedScroll", false);
        diffView.editorB.setOption("animatedScroll", false);

        diffView.editorA.execCommand("gotoend");
        diffView.editorB.renderer.$loop._flush();
        diffView.editorA.renderer.$loop._flush();

        assert.ok(diffView.sessionB.$scrollTop > 100);
        assert.ok(diffView.sessionA.$scrollTop == diffView.sessionB.$scrollTop);

        diffView.foldUnchanged();
        assert.equal(diffView.sessionA.$foldData.length, 20);
        assert.equal(diffView.sessionA.$foldData.length, 20);

    },

    "test: restore options": function() {
        var diffProvider = new DiffProvider();

        editorA.session.setValue(getValueA(simpleDiff));
        editorB.session.setValue(getValueB(simpleDiff));

        diffView = new InlineDiffView({
            editorA, editorB,
            showSideA: true,
            diffProvider,
        });
        diffView.onInput();
        diffView.setOptions({
            wrap: true,
            folding: false,
            showOtherLineNumbers: false,
        });
        diffView.resize(true);
        assert.equal(diffView.chunks.length, 2);
        assert.equal(editorA.getOption("wrap"), "free");
        assert.equal(diffView.editorB.getOption("wrap"), "free");

        assert.equal(editorA.getOption("fadeFoldWidgets"), true);
        assert.equal(diffView.editorB.getOption("fadeFoldWidgets"), true);

        assert.equal(diffView.editorA.getOption("showFoldWidgets"), false);
        assert.equal(diffView.editorB.getOption("showFoldWidgets"), false);

        assert.ok(!!diffView.editorB.renderer.$gutterLayer.$renderer);

        diffView.detach();

        assert.equal(editorA.getOption("wrap"), "free");
        assert.equal(editorA.getOption("fadeFoldWidgets"), false);
        assert.equal(editorA.getOption("showFoldWidgets"), true);

        assert.equal(editorB.getOption("wrap"), "free");
        assert.equal(editorB.getOption("fadeFoldWidgets"), false);
        assert.equal(editorB.getOption("showFoldWidgets"), true);
        assert.ok(!editorB.renderer.$gutterLayer.$renderer);
    },
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
