if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

"use strict";

var Editor = require("../ace").Editor;
var EditSession = require("../ace").EditSession;
var VirtualRenderer = require("../ace").VirtualRenderer;
var assert = require("../test/assertions");
const {SearchBox} = require("./searchbox");
var {Range} = require("../range");
var {terminateWorker} = require("./search/async_search");

function simulateClick(node) {
    node.dispatchEvent(new window.CustomEvent("click", {bubbles: true}));
}

/**@type{Editor}*/var editor;
/**@type{SearchBox}*/var searchBox;
var wrapperEl;
var editorPx = 500;
/**@type{Editor}*/var searchInput;
/**@type{Editor}*/var searchReplace;

var isElementVisible = function (elem) {
    return !((elem.position !== "fixed" && elem.offsetParent === null) || window.getComputedStyle(elem).display
        === 'none' || elem.clientHeight === 0);
};

var searchBoxVisibilityCheck = function (searchBoxVisible = false) {
    var searchBoxDomElements = document.querySelectorAll(".ace_search");
    assert.ok(searchBoxDomElements.length > 0);
    assert.strictEqual(isElementVisible(searchBoxDomElements[0]), searchBoxVisible);
};

var createSearchBox = function () {
    searchBox = new SearchBox(editor);
    searchInput = searchBox.searchInput;
    searchReplace = searchBox.replaceInput;
};

function initTests() {
    wrapperEl = document.createElement("div");
    wrapperEl.style.position = "fixed";
    wrapperEl.style.left = "400px";
    wrapperEl.style.top = "100px";
    wrapperEl.style.width = editorPx + "px";
    wrapperEl.style.height = editorPx + "px";
    document.body.appendChild(wrapperEl);
    var renderer = new VirtualRenderer(wrapperEl);
    var session = new EditSession("abc123\n\nfunc");
    editor = new Editor(renderer, session);
    editor.renderer.$loop._flush();

    createSearchBox();
}

initTests();


module.exports = {
    timeout: 10000,
    "test: open/close search box": function (done) {
        searchBoxVisibilityCheck(true);
        var searchBoxCloseButton = document.querySelectorAll(".ace_searchbtn_close");
        assert.ok(searchBoxCloseButton.length > 0);
        simulateClick(searchBoxCloseButton[0]);
        searchBoxVisibilityCheck(false);
        searchBox.show(editor.session.getTextRange(), false);
        searchBoxVisibilityCheck(true);
        done();
    },
    "test: should open searchBox and select text": function (done) {
        var str = [];
        for (var i = 0; i < 100; i++) {
            str.push("a " + i + " b " + (i % 10));
        }
        editor.focus();
        editor.setValue(str.join("\n"));

        editor.selection.setRange(new Range(0, 0, 0, 1));

        searchBox.show(editor.session.getTextRange(), false);

        assert.equal(searchInput.getValue(), "a");
        editor.focus();

        editor.selection.setRange(new Range(0, 4, 0, 7));
        searchBox.show(editor.session.getTextRange(), false);

        assert.equal(searchInput.getValue(), "b 0");

        editor.once("changeSelection", function () {
            assert.equal(editor.selection.getRange().end.row, 10);
            done();
        });
        setTimeout(function () {
            searchBox.findNext();
        }, 100);
    },
    "test: should find again and again": function () {
        searchBox.findNext();
        assert.equal(editor.selection.getRange().end.row, 20);

        editor.selection.setRange(new Range(0, 0, 0, 7));

        searchBox.findNext();
        //assert.equal(editor.selection.getRange().start.column, 0); //TODO: ?

        var prev = searchBox.element.querySelector("[action=findPrev]");
        var next = searchBox.element.querySelector("[action=findNext]");

        editor.selection.setRange(new Range(10, 5, 10, 5));
        simulateClick(next);

        assert.deepEqual(editor.selection.getRange(), new Range(10, 5, 10, 8));

        searchReplace.setValue("b 0");
        searchBox.replaceAndFindNext();
        assert.deepEqual(editor.selection.getRange(), new Range(20, 5, 20, 8));
        /*findreplace.replace(true);
        expect(ace.selection.getRange()).to.deep.equal(new Range(10, 5, 10, 8));*/

        editor.selection.setRange(new Range(10, 8, 10, 8));
        simulateClick(prev);
        assert.deepEqual(editor.selection.getRange(), new Range(10, 5, 10, 8));

        editor.selection.setRange(new Range(10, 7, 10, 7));
        simulateClick(next);
        assert.deepEqual(editor.selection.getRange(), new Range(20, 5, 20, 8));

        editor.selection.setRange(new Range(20, 7, 20, 7));
        simulateClick(prev);
        assert.deepEqual(editor.selection.getRange(), new Range(10, 5, 10, 8));
    },
    "test: should remember replace history": function () {//TODO:
        // reset replace textbox history
        /*settings.setJson("state/search-history/" + txtReplace.session.listName, null);
        txtReplace.setValue("foo");

        commands.exec("replacenext");
        txtReplace.setValue("bar");
        commands.exec("replacenext");

        var kb = txtReplace.keyBinding.$handlers[1].commands;
        var prev = kb.Up;
        var next = kb.Down;

        txtReplace.execCommand(prev);
        expect(txtReplace.getValue()).equal("foo");
        txtReplace.execCommand(prev);
        expect(txtReplace.getValue()).equal("foo");

        txtReplace.execCommand(next);
        expect(txtReplace.getValue()).equal("bar");

        txtReplace.execCommand(next);
        expect(txtReplace.getValue()).equal("");

        txtReplace.setValue("baz");
        txtReplace.execCommand(next);
        expect(txtReplace.getValue()).equal("");
        txtReplace.execCommand(prev);
        expect(txtReplace.getValue()).equal("baz");
        txtReplace.execCommand(prev);
        expect(txtReplace.getValue()).equal("bar");*/
    },
    "test: should replace all in selection": function (done) {
        var range = new Range(5, 2, 7, 1);
        editor.selection.setRange(range);
        simulateClick(searchBox.searchOption);
        simulateClick(searchBox.regExpOption);

        searchInput.setValue("(a)|(b)");
        searchReplace.setValue("\\u$2x");

        searchBox.replaceAll(() => {
            assert.deepEqual(editor.selection.getRange(), range);
            assert.equal(editor.session.getTextRange(range), "5 Bx 5\nX 6 Bx 6\nX");
            done();
        });

    },
    "test: Support for regex lookaheads in search & replace. Issue #4006": function (done) {
        createSearchBox(); //reset search box

        editor.setValue("foobar\nfooqux\nfoobar1");

        searchInput.setValue("foo(?=bar)");
        searchReplace.setValue("baz");
        simulateClick(searchBox.regExpOption);

        searchBox.replaceAll(() => {
            assert.equal(editor.getValue(), "bazbar\nfooqux\nbazbar1");
            done();
        });
    },
    "test: Normalize line breaks in search & replace #yourTestCaseNumber. Issue #2869, #2059": function (done) {
        createSearchBox(); // Reset search box
        editor.setValue("This is a test.\n\nThis text contains\n\n\nmultiple lines and\n\nempty lines.");

        // This regex matches two or more newline characters
        searchInput.setValue("\\n{2,}");
        searchReplace.setValue("\\n"); // Replace with a single newline character
        simulateClick(searchBox.regExpOption);

        searchBox.replaceAll(() => {
            assert.equal(editor.getValue(), "This is a test.\nThis text contains\nmultiple lines and\nempty lines.");
            done();
        });
    },
    "test: Multiline search": function (done) {
        createSearchBox(); // Reset search box
        editor.setValue("First line.\n\ndifferent text\n\n\n\n\nline end.");

        searchInput.setValue("First line(.|\\n)*line");
        simulateClick(searchBox.regExpOption);


        editor.once("changeSelection", function () {
            assert.deepEqual(editor.selection.getRange(), new Range(0, 0, 7, 9));
            done();
        });
        setTimeout(function () {
            var next = searchBox.element.querySelector("[action=findNext]");
            simulateClick(next);
        }, 100);
        
    }

};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
