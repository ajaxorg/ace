"use strict";

var assert = require("../../test/assertions");
require("../../test/mockdom");

var {InlineDiffView} = require("./inline_diff_view");
var {SideBySideDiffView} = require("./sidebyside_diff_view");

var ace = require("../../ace");
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

module.exports = {
    setUpSuite: function() {
        ace.config.setLoader(function(moduleName, cb) {
            if (moduleName == "ace/ext/error_marker")
                return cb(null, require("../ext/error_marker"));
        });
        editorA = createEditor();
        editorB = createEditor();
        editorA.focus();
    },
    tearDownSuite: function() {
        if (editor) {
            editor.destroy();
            editor.container.remove();
            editor = null;
        }
    },
    tearDown: function() {
        if (diffView) {
            diffView.detach();
            diffView = null;
        }
    },
    "test: go to next error": function() {
        var values = [
            ["a"],
            ["b"],
            ["c"],
            [, "inserted1"],
            [, "inserted2"],
            ["e"],
            ["f"],
            ["g", "edited g"],
            ["h"],
            ["i"],
        ];

        editorA.session.setValue(
            values.map(function(v) {
                return v[0]; 
            }).filter(function(x) {
                return x != null;
            }).join("\n")
        );

        editorB.session.setValue(
            values.map(function(v) {
                return v.length == 2 ? v[1] : v[0]; 
            }).filter(function(x) {
                return x != null;
            }).join("\n")
        );

        var uid = 0;
        var saved = {};
        function saveEventRegistry(object) {
            var id = object.id;
            if (!id) {
                id = object.id = "unknown" + (uid++)
            }
            var eventRegistry = {};
            for (var key in object._eventRegistry) {
                var handlers = object._eventRegistry[key];
                eventRegistry[key] = handlers
            }
            saved[id] = [eventRegistry, object];
        }
        function checkEventRegistry() {
            for (var i in saved) {
                var object = saved[i][1];
                var eventRegistry = saved[i][0];
                for (var key in eventRegistry) {
                    var handlers = object._eventRegistry[key];
                    assert.equal(handlers.length, eventRegistry[key].length);
                    for (var j = 0; j < handlers.length; j++) {
                        assert.equal(handlers[j], eventRegistry[key][j]);
                    }
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
            showSideA: true
        });
        editorA.session.addFold("---", new Range(0, 0, 2, 0));
        
        console.log(editorA.session.$foldData.length);
        console.log(editorB.session.$foldData.length);
        
        diffView.detach();
        checkEventRegistry();

        diffView = new SideBySideDiffView({editorA, editorB});
        editorB.session.addFold("---", new Range(5, 0, 7, 0));
        editorB.renderer.$loop._flush();
        editorA.renderer.$loop._flush();
        console.log(editorA.session.$foldData.length);
        console.log(editorB.session.$foldData.length);
        diffView.detach();
        checkEventRegistry();
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
