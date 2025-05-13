"use strict";

var assert = require("../../test/assertions");
require("../../test/mockdom");

var {InlineDiffView} = require("./inline_diff_view");
var {DiffView} = require("./diff_view");
var {DiffProvider} = require("./providers/default");

var ace = require("../../ace");
const { get } = require("../../config");
var Range = require("../../range").Range;
var editorA, editorB, diffView;

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
    }).join("\n")
}
function getValueB(lines) {
    return lines.map(function(v) {
        return v.length == 2 ? v[1] : v[0]; 
    }).filter(function(x) {
        return x != null;
    }).join("\n")
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
        [editorA, editorB].forEach(function(editor) {
            if (editor) {
                editor.destroy();
                editor.container.remove();
                editor = null;
            }
        });
    },
    tearDown: function() {
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
        
        diffView.detach();
        checkEventRegistry();


        var diffView = new InlineDiffView({
            editorB, valueA: editorA.getValue(),
            showSideB: true,
            diffProvider,
        });

        diffView.detach();
        checkEventRegistry();
        
    },
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
