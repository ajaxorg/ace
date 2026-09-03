"use strict";

var assert = require("../../test/assertions");
require("../../test/mockdom");

var {InlineDiffView} = require("./inline_diff_view");
var {SplitDiffView} = require("./split_diff_view");
var {DiffProvider} = require("./providers/default");
var {DiffChunk} = require("./base_diff_view");

var ace = require("../../ace");
var Range = require("../../range").Range;
var editorA, editorB, diffView;
const {Decorator} = require("../../layer/decorators");
const {ScrollDiffDecorator} = require("./scroll_diff_decorator");
var lang = require("../../lib/lang");


var DEBUG = false;

function createEditor() {
    var editor = ace.edit(null);
    document.body.appendChild(editor.container);
    setEditorPosition(editor);
    return editor;
}
function setEditorPosition(editor) {
    editor.container.style.height = "200px";
    editor.container.style.width = "300px";
    editor.container.style.position = "absolute";
    editor.container.style.outline = "solid";
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
var longLinesDiff = [
    [null, "0"],
    ["a"],
    ["b"],
    ["c", "edited c ".repeat(100)],
    ["e long ".repeat(100)],
    ["f"],
    ["g " + "to delete ".repeat(100), "edited g"],
    ["h"],
    ["i"],
];
module.exports = {
    setUpSuite: function() {
        ace.config.setLoader(function(moduleName, cb) {
            if (moduleName == "ace/ext/error_marker")
                return cb(null, require("../error_marker"));
            if (moduleName == "ace/theme/cloud_editor")
                return cb(null, require("../../theme/cloud_editor"));
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
            inline: "a",
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

        diffView = new SplitDiffView({editorA, editorB, diffProvider});
        editorB.session.addFold("---", new Range(5, 0, 7, 0));
        editorB.renderer.$loop._flush();
        editorA.renderer.$loop._flush();
        assert.equal(editorA.session.$foldData.length, 2);
        assert.equal(editorB.session.$foldData.length, 2);
        
        diffView.onInput();
        diffView.resize(true);

        diffView.setTheme("ace/theme/cloud_editor");
        assert.equal(diffView.editorA.getTheme(), "ace/theme/cloud_editor");
        assert.equal(diffView.editorB.getTheme(), "ace/theme/cloud_editor");

        diffView.editorB.setTheme("ace/theme/textmate");
        assert.equal(diffView.editorA.getTheme(), "ace/theme/textmate");
        assert.equal(diffView.editorB.getTheme(), "ace/theme/textmate");

        diffView.detach();
        checkEventRegistry();


        var diffView = new InlineDiffView({
            editorB, valueA: editorA.getValue(),
            inline: "b",
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
            inline: "a",
            diffProvider,
        }, document.body);
        setEditorPosition(diffView.editorA);
        diffView.onInput();
        diffView.resize(true);
        var lineHeight = diffView.editorA.renderer.lineHeight;
        assert.ok(diffView.editorA.renderer.lineHeight > 0);
        assert.equal(diffView.chunks.length, 2);
        assert.equal(diffView.editorA.renderer.layerConfig.offset, 0);
        diffView.sessionA.setScrollTop(lineHeight * 1.5);
        diffView.resize(true);
        assert.equal(diffView.editorA.renderer.layerConfig.offset, 0.5 * lineHeight);
        diffView.detach();

        diffView = new SplitDiffView({
            valueA,
            valueB,
            diffProvider,
        }, document.body);
        setEditorPosition(diffView.editorA);
        setEditorPosition(diffView.editorB);
        diffView.onInput();
        diffView.resize(true);
        assert.equal(diffView.chunks.length, 2);

        diffView.detach();

        diffView = new InlineDiffView({
            valueA,
            valueB,
            inline: "b",
        }, document.body);
        setEditorPosition(diffView.editorB);
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

        diffView = new SplitDiffView({
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

        diffView.toggleFoldUnchanged();
        assert.equal(diffView.sessionA.$foldData.length, 20);
        assert.equal(diffView.sessionA.$foldData.length, 20);
        diffView.toggleFoldUnchanged();
        assert.equal(diffView.sessionA.$foldData.length, 0);
        assert.equal(diffView.sessionA.$foldData.length, 0);

    },
    "test line widget at both sides of line": function() {
        var diffProvider = new DiffProvider();

        editorA.session.setValue("a\n");
        editorB.session.setValue("\n\na\n\n");

        diffView = new SplitDiffView({
            editorA, editorB,
            diffProvider,
        });
        diffView.onInput();
        diffView.resize(true);
        var markers = diffView.editorA.renderer.$markerBack.element.childNodes;
        assert.equal(markers[0].className, "ace_diff aligned_diff");
        assert.equal(markers[1].className, "ace_diff aligned_diff");
        // Full-range inline markers are redundant with the line marker.
        assert.equal(markers.length, 2);
    },

    "test provider refines one line chunk": function() {
        var diffProvider = new DiffProvider();
        var originalLines = ["const answer = 41;"];
        var modifiedLines = ["const answer = 42;"];
        var chunks = diffProvider.compute(
            originalLines,
            modifiedLines,
            {maxComputationTimeMs: 0, ignoreTrimWhitespace: false}
        );

        assert.equal(chunks.length, 1);
        assert.equal(chunks[0].charChanges, undefined);
        assert.equal(chunks[0].inlinePending, true);

        var result = diffProvider.refine(
            originalLines,
            modifiedLines,
            chunks[0],
            {maxComputationTimeMs: 0, ignoreTrimWhitespace: false}
        );

        assert.equal(result.hitTimeout, false);
        assert.equal(result.charChanges.length, 1);
        assert.equal(result.charChanges[0].old.start.column, 15);
        assert.equal(result.charChanges[0].old.end.column, 17);
        assert.equal(result.charChanges[0].new.start.column, 15);
        assert.equal(result.charChanges[0].new.end.column, 17);
    },

    "test rough diff whitespace and insertion semantics": function() {
        var diffProvider = new DiffProvider();
        var whitespaceChange = diffProvider.compute(
            ["  x"],
            ["    x"],
            {maxComputationTimeMs: 0, ignoreTrimWhitespace: false}
        );
        var ignoredWhitespaceChange = diffProvider.compute(
            ["  x"],
            ["    x"],
            {maxComputationTimeMs: 0, ignoreTrimWhitespace: true}
        );
        var insertion = diffProvider.compute(
            ["a", "c"],
            ["a", "b", "c"],
            {maxComputationTimeMs: 0, ignoreTrimWhitespace: false}
        );

        assert.equal(whitespaceChange.length, 1);
        assert.equal(whitespaceChange[0].inlinePending, true);
        assert.equal(ignoredWhitespaceChange.length, 0);
        assert.equal(insertion.length, 1);
        assert.equal(insertion[0].old.isEmpty(), true);
        assert.equal(insertion[0].inlinePending, false);
    },

    "test inline changes are refined as chunks enter the viewport": async function() {
        var originalLines = [];
        var modifiedLines = [];
        for (var row = 0; row < 80; row++) {
            originalLines.push("const value" + row + " = " + row + ";");
            modifiedLines.push("const value" + row + " = " + row + ";");
        }
        modifiedLines[2] = "const value2 = changedAtTop;";
        modifiedLines[70] = "const value70 = changedAtBottom;";

        editorA.session.setValue(originalLines.join("\n"));
        editorB.session.setValue(modifiedLines.join("\n"));
        editorA.renderer.$loop._flush();
        editorB.renderer.$loop._flush();

        diffView = new SplitDiffView({editorA, editorB, diffProvider: new DiffProvider()});
        diffView.onInput();

        assert.ok(editorA.getLastVisibleRow() < 70);
        assert.equal(diffView.chunks.length, 2);
        assert.equal(diffView.chunks[0].old.start.row, 2);
        assert.equal(diffView.chunks[0].inlinePending, false);
        assert.ok(diffView.chunks[0].charChanges.length > 0);
        assert.equal(diffView.chunks[1].old.start.row, 70);
        assert.equal(diffView.chunks[1].inlinePending, true);
        assert.equal(diffView.chunks[1].charChanges, undefined);

        var lineHeight = editorA.renderer.lineHeight;
        var scrollRender = editorA.renderer.once("afterRender");
        editorA.session.setScrollTop(lineHeight * 70);
        await scrollRender;
        assert.ok(editorA.getFirstVisibleRow() <= 70);
        assert.ok(editorA.getLastVisibleRow() >= 70);

        // The first render schedules refinement; refinement updates the
        // markers and causes this second render.
        await editorA.renderer.once("afterRender");
        assert.equal(diffView.chunks[1].inlinePending, false);
        assert.ok(diffView.chunks[1].charChanges.length > 0);
    },

    "test timed out refinement keeps partial inline changes": function() {
        editorA.session.setValue("changed value");
        editorB.session.setValue("modified value");
        editorA.renderer.$loop._flush();
        editorB.renderer.$loop._flush();

        var partialInlineChange = new DiffChunk(
            new Range(0, 0, 0, 7),
            new Range(0, 0, 0, 8)
        );
        var provider = {
            compute: function() {
                return [new DiffChunk(
                    new Range(0, 0, 1, 0),
                    new Range(0, 0, 1, 0),
                    undefined,
                    true
                )];
            },
            refine: function() {
                return {charChanges: [partialInlineChange], hitTimeout: true};
            }
        };

        diffView = new SplitDiffView({editorA, editorB, diffProvider: provider});
        diffView.onInput();

        assert.equal(diffView.chunks[0].inlinePending, false);
        assert.equal(diffView.chunks[0].inlineRefineHitTimeout, true);
        assert.equal(diffView.chunks[0].charChanges.length, 1);
        assert.equal(diffView.chunks[0].charChanges[0], partialInlineChange);
    },

    "test: wrap documents with fewer than 1700 combined lines": async function() {
        var diffProvider = new DiffProvider();

        var neutral = "x".repeat(500) + "\n";
        var delimiter = "";
        var valueA = ("aa" + neutral).repeat(100)
            + neutral.repeat(300)
            + delimiter
            + ("bb" + neutral).repeat(100);
        var valueB = (neutral).repeat(400) + delimiter + ("cc" + neutral).repeat(100);
        editorA.session.setValue(valueA);
        editorB.session.setValue(valueB);

        diffView = new SplitDiffView({
            editorA, editorB,
            diffProvider,
            wrap: true,
        });

        diffView.$maxComputationTimeMs = 0;
        diffView.$inlineRefineMaxComputationTimeMs = 1000;
        diffView.setOption("wrap", false);
        diffView.onInput();
        diffView.resize(true);
        await lang.sleep(0); // TODO test is failing without this, probably because rendering not refined diff the first time
        assert.ok(diffView.sessionA.getLength() + diffView.sessionB.getLength() < 1700);
        assert.ok(diffView.editorA.renderer.lineHeight > 0);
        assert.ok(diffView.editorB.renderer.lineHeight > 0);
        assert.equal(diffView.chunks.length, 2);
        assert.equal(diffView.chunks[0].old.start.row, 0);
        assert.equal(diffView.chunks[0].old.end.row, 100);
        assert.equal(diffView.chunks[0].new.start.row, 0);
        assert.equal(diffView.chunks[0].new.end.row, 100);
        assert.equal(diffView.chunks[0].charChanges.length, 100);
        
        diffView.resize(true);

        assert.ok(diffView.editorA.container.querySelectorAll(".ace_diff.inline.delete").length > 5);
        assert.ok(diffView.editorB.container.querySelectorAll(".ace_diff.inline.delete").length > 5);

        diffView.setOption("wrap", true);
        diffView.resize(true);
        assert.ok(diffView.editorA.container.querySelectorAll(".ace_diff.inline.delete").length < 5);
        assert.ok(diffView.editorB.container.querySelectorAll(".ace_diff.inline.delete").length < 5);
    },

    "test: wrap documents with more than 1700 lines": async function() {
        var diffProvider = new DiffProvider();

        var changed = "x".repeat(500) + "\n";
        var neutral = "x\n";
        var delimiter = "_".repeat(500) + "\n";
        var valueA = ("aa" + changed).repeat(30)
            + neutral.repeat(1700)
            + delimiter
            + ("bb" + changed).repeat(30);
        var valueB = changed.repeat(30)
            + neutral.repeat(1700)
            + delimiter
            + ("cc" + changed).repeat(30);
        editorA.session.setValue(valueA);
        editorB.session.setValue(valueB);

        diffView = new SplitDiffView({
            editorA, editorB,
            diffProvider,
            wrap: true,
        });

        diffView.$maxComputationTimeMs = 0;
        diffView.$inlineRefineMaxComputationTimeMs = 1000;
        diffView.setOption("wrap", false);
        diffView.onInput();
        diffView.resize(true);
        await lang.sleep(0);
        assert.ok(diffView.sessionA.getLength() > 1700);
        assert.ok(diffView.sessionB.getLength() > 1700);
        assert.ok(diffView.editorA.renderer.lineHeight > 0);
        assert.ok(diffView.editorB.renderer.lineHeight > 0);
        assert.equal(diffView.chunks.length, 2);

        diffView.resize(true);

        assert.ok(diffView.editorA.container.querySelectorAll(".ace_diff.inline.delete").length > 5);
        assert.ok(diffView.editorB.container.querySelectorAll(".ace_diff.inline.delete").length > 5);

        diffView.setOption("wrap", true);
        diffView.resize(true);
        assert.ok(diffView.editorA.container.querySelectorAll(".ace_diff.inline.delete").length < 5);
        assert.ok(diffView.editorB.container.querySelectorAll(".ace_diff.inline.delete").length < 5);
    },

    "test: toggle wrap": function() {
        var diffProvider = new DiffProvider();

        editorA.session.setValue(getValueA(longLinesDiff));
        editorB.session.setValue(getValueB(longLinesDiff));

        diffView = new SplitDiffView({
            editorA, editorB,
            diffProvider,
        });
        diffView.onInput();
        diffView.setOptions({
            wrap: 20,
            syncSelections: true,
        });
        diffView.resize(true);
        diffView.gotoNext(1);
        diffView.gotoNext(1);
        var posA = diffView.sessionA.documentToScreenPosition(diffView.editorA.getCursorPosition());
        var posB = diffView.sessionB.documentToScreenPosition(diffView.editorB.getCursorPosition());
        assert.equal(posA.row, posB.row);
    },

    "test: restore options": function() {
        var diffProvider = new DiffProvider();

        editorA.session.setValue(getValueA(simpleDiff));
        editorB.session.setValue(getValueB(simpleDiff));
        editorA.setOption("customScrollbar", true);

        diffView = new InlineDiffView({
            editorA, editorB,
            inline: "a",
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

        assert.ok(editorA.renderer.$scrollDecorator instanceof ScrollDiffDecorator);

        diffView.detach();

        assert.equal(editorA.getOption("wrap"), "free");
        assert.equal(editorA.getOption("fadeFoldWidgets"), false);
        assert.equal(editorA.getOption("showFoldWidgets"), true);

        assert.equal(editorB.getOption("wrap"), "free");
        assert.equal(editorB.getOption("fadeFoldWidgets"), false);
        assert.equal(editorB.getOption("showFoldWidgets"), true);
        assert.ok(!editorB.renderer.$gutterLayer.$renderer);

        assert.ok(editorA.renderer.$scrollDecorator instanceof Decorator);
    },
    "test split diff scroll decorators": async function(done) {
        editorA.session.setValue(["a", "b", "c"].join("\n"));
        editorB.session.setValue(["a", "c", "X"].join("\n"));

        diffView = new SplitDiffView({ editorA, editorB });
        diffView.setProvider(new DiffProvider());
        diffView.onInput();


        editorA.renderer.$loop._flush();
        editorB.renderer.$loop._flush();

        await lang.sleep(0);
        assertDecoratorsPlacement(editorA, false);
        done();
    },
    "test inline diff scroll decorators": async function(done) {
        editorA.session.setValue(["a", "b", "c"].join("\n"));
        editorB.session.setValue(["a", "c", "X"].join("\n"));

        diffView = new InlineDiffView({ editorA, editorB, inline: "a" });
        diffView.setProvider(new DiffProvider());
        diffView.onInput();

        editorA.renderer.$loop._flush();

        await lang.sleep(0);
        assertDecoratorsPlacement(editorA, true);
        done();
    },
    "test: second editor destroyed on detach in inline diff view": function() {
        editorA.setOption("wrap", "free");
        diffView = new InlineDiffView({ editorA, inline: "a" });

        assert.equal(diffView.editorB.getOption("wrap"), "free");

        assert.ok(!diffView.otherEditor.destroyed);
        diffView.detach();
        assert.ok(diffView.otherEditor.destroyed);
    },
    "test: wrap stays in sync": function() {
        editorA.setOption("wrap", "off");
        diffView = new InlineDiffView({ editorA, inline: "a" });

        assert.equal(diffView.editorB.getOption("wrap"), "off");
        assert.equal(diffView.editorA.getOption("wrap"), "off");

        editorA.setOption("wrap", "free");
        assert.equal(diffView.editorB.getOption("wrap"), "free");
        assert.equal(diffView.editorA.getOption("wrap"), "free");

        diffView.detach();


        editorB.setOption("wrap", 40);
        diffView = new InlineDiffView({ editorB, inline: "b" });

        assert.equal(diffView.editorB.getOption("wrap"), 40);
        assert.equal(diffView.editorA.getOption("wrap"), 40);

        editorB.setOption("wrap", "free");
        assert.equal(diffView.editorB.getOption("wrap"), "free");
        assert.equal(diffView.editorA.getOption("wrap"), "free");

        editorB.setOption("wrap", 50);
        assert.equal(diffView.editorB.getOption("wrap"), 50);
        assert.equal(diffView.editorA.getOption("wrap"), 50);

        diffView.detach();
    }
};

function findPointFillStyle(imageData, y) {
    const data = imageData.slice(4 * y, 4 * (y + 1));
    const a = Math.round(data[3] / 256 * 100);
    if (a === 100) return "rgb(" + data.slice(0, 3).join(",") + ")";
    return "rgba(" + data.slice(0, 3).join(",") + "," + (a / 100) + ")";
}

function assertDecoratorsPlacement(editor, inlineDiff) {
    const decoA = editor.renderer.$scrollDecorator;
    const ctxA = decoA.canvas.getContext("2d");
    const delRow = 1;
    const offA = decoA.sessionA.documentToScreenRow(delRow, 0) * decoA.lineHeight;
    const centerA = offA + decoA.lineHeight / 2;
    const yA = Math.round(decoA.heightRatio * centerA);
    let imgA = ctxA.getImageData(decoA.oneZoneWidth, 0, 1, decoA.canvasHeight).data;
    assert.equal(findPointFillStyle(imgA, yA), decoA.colors.light.delete);

    if (inlineDiff) {
        //make sure that in inline diff, markers fills the whole line (except error decorators part)
        imgA = ctxA.getImageData(decoA.canvasWidth - 1, 0, 1, decoA.canvasHeight).data;
        assert.equal(findPointFillStyle(imgA, yA), decoA.colors.light.delete);
    }

    const xB = decoA.oneZoneWidth * 2;
    const imgB = ctxA.getImageData(xB, 0, 1, decoA.canvasHeight).data;

    const insRow = 2;
    const offB = decoA.sessionB.documentToScreenRow(insRow, 0) * decoA.lineHeight;
    const centerB = offB + decoA.lineHeight / 2;
    const yB = Math.round(decoA.heightRatio * centerB);
    assert.equal(findPointFillStyle(imgB, yB), decoA.colors.light.insert);
}

require("../../test/run")(module);
