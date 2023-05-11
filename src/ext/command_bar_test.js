/* global Promise */
if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

"use strict";

var TOOLTIP_CLASS_NAME = require("./command_bar").TOOLTIP_CLASS_NAME;
var BUTTON_CLASS_NAME = require("./command_bar").BUTTON_CLASS_NAME;
var CommandBarTooltip = require("./command_bar").CommandBarTooltip;
var Editor = require("../ace").Editor;
var EditSession = require("../ace").EditSession;
var VirtualRenderer = require("../ace").VirtualRenderer;
var assert = require("../test/assertions");
var useragent = require("../lib/useragent");

function simulateClick(node) {
    node.dispatchEvent(new window.CustomEvent("click", { bubbles: true }));
}

function simulateMouseEvent(type, opts, node) {
    var target = node || editor.renderer.getMouseEventTarget();
    var e = new window.CustomEvent("mouse" + type, {bubbles: true, cancelable: true});
    Object.defineProperties(e, Object.getOwnPropertyDescriptors(opts));
    target.dispatchEvent(e);
}


var editor;
var counters = {};
var commandBarTooltip;
var testValues = {};
var wrapperEl;
var editorPx = 500;

function getActiveLinePosition() {
    var cursorPosition = editor.getCursorPosition();
    return editor.renderer.textToScreenCoordinates(cursorPosition.row, cursorPosition.column);
}


var testFunction = function(name, defaultValue) {
    return function(editor) {
        if (!editor) {
            return;
        }
        if (!counters[name]) {
            counters[name] = 0;
        }
        counters[name]++;
        return testValues[name] === undefined ? defaultValue : testValues[name];
    };
};

var commands = {
    "testCommand1": {
        name: "testCommand1",
        bindKey: { win: "Alt-K", mac: "Cmd-K" },
        exec: testFunction("testCommand1"),
        enabled: testFunction("testEnabled1", true),
        type: "button"
    },
    "testCommand2": {
        name: "testCommand2",
        bindKey: "Ctrl-L",
        exec: testFunction("testCommand2"),
        enabled: testFunction("testEnabled2", true),
        type: "button"
    }
};

var createTooltip = function(options, additionalCommands) {
    commandBarTooltip = new CommandBarTooltip(document.body, options);
    Object.keys(commands).forEach(function(key) {
        commandBarTooltip.registerCommand(key, commands[key]);
    });
    (additionalCommands || []).forEach(function(commandEntry) {
        commandBarTooltip.registerCommand(commandEntry[0], commandEntry[1]);
    });
    commandBarTooltip.setAlwaysShow(true);
    // Workaround: non-standard width and height hints for mock dom (which does not work well with flex elements)
    // When running in the browser, these are ignored
    commandBarTooltip.tooltip.getElement().style.widthHint = 150;
    commandBarTooltip.tooltip.getElement().style.heightHint = editor.renderer.lineHeight * 2;
    commandBarTooltip.moreOptions.getElement().style.widthHint = 150;
    commandBarTooltip.moreOptions.getElement().style.heightHint = editor.renderer.lineHeight * 2;commandBarTooltip.moreOptions.getElement().style.heightHint = editor.renderer.lineHeight * 2;commandBarTooltip.moreOptions.getElement().style.heightHint = editor.renderer.lineHeight * 2;commandBarTooltip.moreOptions.getElement().style.heightHint = editor.renderer.lineHeight * 2;commandBarTooltip.moreOptions.getElement().style.heightHint = editor.renderer.lineHeight * 2;
};

var isElementVisible = function(elem) {
    return !((elem.position !== "fixed" && elem.offsetParent === null) ||
        window.getComputedStyle(elem).display === 'none' || elem.clientHeight === 0);
};

var tooltipVisibilityCheck = function(tooltipVisible = false, moreOptionsVisible = false) {
    moreOptionsVisible = tooltipVisible && moreOptionsVisible;
    assert.strictEqual(commandBarTooltip.isShown(), tooltipVisible);
    assert.strictEqual(commandBarTooltip.isMoreOptionsShown(), moreOptionsVisible);
    var tooltipDomElements = document.querySelectorAll("." + TOOLTIP_CLASS_NAME);
    assert.strictEqual(tooltipDomElements.length, 2);
    assert.strictEqual(isElementVisible(tooltipDomElements[0]), tooltipVisible);
    assert.strictEqual(isElementVisible(tooltipDomElements[1]), moreOptionsVisible);
};

module.exports = {
    setUp: function() {
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
        counters = {};
        testValues = {};
        editor.getSelection().moveCursorFileEnd();
        editor.renderer.$loop._flush();
    },
    "test: displays command bar tooltip above cursor with commands immediately in 'always show' mode": function(done) {
        createTooltip();
        tooltipVisibilityCheck(false, false);

        commandBarTooltip.attach(editor);
        tooltipVisibilityCheck(true, false);
        done();
    },
    "test: commands are disabled when enable check is falsy": function(done) {
        createTooltip();
        commandBarTooltip.attach(editor);
        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        var disabledButtonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME + ".ace_disabled"));
        assert.strictEqual(buttonElements.length, 2);
        assert.strictEqual(disabledButtonElements.length, 0);
        assert.strictEqual(buttonElements.filter(function (button) { return !button.disabled; }).length, 2);
        assert.strictEqual(counters["testEnabled1"], 1);
        assert.strictEqual(counters["testEnabled2"], 1);

        testValues.testEnabled2 = false;
        commandBarTooltip.update();
        buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        disabledButtonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME + ".ace_disabled"));
        assert.strictEqual(buttonElements.length, 2);
        assert.strictEqual(disabledButtonElements.length, 1);
        assert.strictEqual(disabledButtonElements.filter(function (button) { return button.disabled; }).length, 1);
        assert.strictEqual(buttonElements.filter(function (button) { return !button.disabled; }).length, 1);
        assert.strictEqual(counters["testEnabled1"], 2);
        assert.strictEqual(counters["testEnabled2"], 2);
        done();
    },
    "test: enabled commands are clickable": function(done) {
        createTooltip();
        commandBarTooltip.attach(editor);
        assert.strictEqual(commandBarTooltip.isShown(), true);
        assert.strictEqual(counters["testCommand1"], undefined);
        assert.strictEqual(counters["testCommand2"], undefined);
        testValues.testEnabled2 = false;
        commandBarTooltip.update();
        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        assert.strictEqual(buttonElements.length, 2);
        var disabledButtonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME + ".ace_disabled"));
        assert.strictEqual(disabledButtonElements.length, 1);
        simulateClick(buttonElements[0]);
        simulateClick(buttonElements[1]);
        simulateClick(disabledButtonElements[0]);
        assert.strictEqual(counters["testCommand1"], 1);
        assert.strictEqual(counters["testCommand2"], undefined);
        done();
    },
    "test: tooltip is displayed on hover with the tooltip delay": function(done) {
        var delay = 10;
        var waitFor = function(ms) {
            return new Promise(function(resolve) { setTimeout(resolve, ms); });
        };
        var waitForDelay = function() { return waitFor(delay); };
        var waitForHalfDelay = function() { return waitFor(delay / 2); };
        createTooltip({ showDelay: delay, hideDelay: delay, maxElementsOnTooltip: 1 });
        commandBarTooltip.setAlwaysShow(false);
        editor.getSelection().moveCursorTo(1, 1);
        editor.renderer.$loop._flush();
        var activeLinePos = getActiveLinePosition();
        var mainTooltipEl = commandBarTooltip.tooltip.getElement();
        var moreOptionsEl = commandBarTooltip.moreOptions.getElement();
        var moveToActiveLineCursor = { clientX: activeLinePos.pageX + 1, clientY: activeLinePos.pageY + 1 };
        var moveAway = { clientX: activeLinePos.pageX + 1, clientY: activeLinePos.pageY + 100 };
        new Promise(function(resolve) {
            commandBarTooltip.attach(editor);
            simulateMouseEvent("move", moveToActiveLineCursor);
            tooltipVisibilityCheck(false);
            resolve();
        }).then(waitForDelay).then(function() {
            tooltipVisibilityCheck(true, false);

            var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
            assert.strictEqual(buttonElements.length, 3);

            var moreOptionsButton = buttonElements[1];

            var moveToMoreOptionsButton = { clientX: moreOptionsButton.left + 1, clientY: moreOptionsButton.right + 1 };

            simulateMouseEvent("move", moveToMoreOptionsButton);
            simulateMouseEvent("enter", moveToMoreOptionsButton, mainTooltipEl);

            simulateClick(moreOptionsButton);

            tooltipVisibilityCheck(true, true);

            var leaveMainTooltip = { clientX: mainTooltipEl.right + 10, clientY: mainTooltipEl.top - 10 };
            simulateMouseEvent("move", leaveMainTooltip);
            simulateMouseEvent("leave", leaveMainTooltip, mainTooltipEl);
        }).then(waitForHalfDelay).then(function() {
            var moreOptionsRect = moreOptionsEl.getBoundingClientRect();
            var enterMoreOptions = { clientX: moreOptionsRect.left + 1, clientY: moreOptionsRect.top + 1 };
            simulateMouseEvent("move", enterMoreOptions);
            simulateMouseEvent("enter", enterMoreOptions, moreOptionsEl);
        }).then(waitForDelay).then(function() {
            tooltipVisibilityCheck(true, true);
            var moreOptionsRect = moreOptionsEl.getBoundingClientRect();
            var leaveWholeTooltip = { clientX: moreOptionsRect.right + 10, clientY: moreOptionsRect.top - 10 };
            simulateMouseEvent("move", leaveWholeTooltip);
            simulateMouseEvent("leave", leaveWholeTooltip, mainTooltipEl);
        }).then(waitForHalfDelay).then(function() {
            simulateMouseEvent("move", moveToActiveLineCursor);
        }).then(waitForDelay).then(function() {
            tooltipVisibilityCheck(true, true);
            simulateMouseEvent("move", moveAway);
        }).then(waitForDelay).then(function() {
            tooltipVisibilityCheck(false);
            simulateMouseEvent("move", moveToActiveLineCursor);
        }).then(waitForDelay).then(function() {
            tooltipVisibilityCheck(true);
            done();
        }).catch(function(err) {
            assert.strictEqual(err, undefined);
            done(err);
        });
    },
    "test: tooltip supports checkbox buttons": function(done) {
        createTooltip();
        testValues.testCheckboxValue1 = true;
        commandBarTooltip.registerCommand("testCheckbox1", {
            name: "testCheckbox1",
            bindKey: "Alt-C",
            exec: function() {
                testValues.testCheckboxValue1 = !testValues.testCheckboxValue1;
            },
            enabled: testFunction("testCheckboxEnabled1", true),
            getValue: testFunction("testCheckboxValue1"),
            type: "checkbox"
        });

        commandBarTooltip.attach(editor);
        assert.strictEqual(commandBarTooltip.isShown(), true);
        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        assert.strictEqual(buttonElements.length, 3);
        var checkboxElement = buttonElements[2];
        assert.strictEqual(checkboxElement.classList.contains("ace_selected"), true);
        assert.strictEqual(checkboxElement.ariaChecked.toString(), "true");

        testValues.testCheckboxValue1 = false;
        commandBarTooltip.update();
        assert.strictEqual(checkboxElement.classList.contains("ace_selected"), false);
        assert.strictEqual(checkboxElement.ariaChecked.toString(), "false");

        simulateClick(checkboxElement);
        assert.strictEqual(checkboxElement.classList.contains("ace_selected"), true);
        assert.strictEqual(checkboxElement.ariaChecked.toString(), "true");
        
        done();
    },
    "test: tooltip supports checkbox menu items": function(done) {
        createTooltip({ maxElementsOnTooltip: 2 });
        testValues.testCheckboxValue1 = true;
        commandBarTooltip.registerCommand("testCheckbox1", {
            name: "testCheckbox1",
            bindKey: "Alt-C",
            exec: function() {
                testValues.testCheckboxValue1 = !testValues.testCheckboxValue1;
            },
            enabled: testFunction("testCheckboxEnabled1", true),
            getValue: testFunction("testCheckboxValue1"),
            type: "checkbox"
        });

        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        commandBarTooltip.attach(editor);
        assert.strictEqual(commandBarTooltip.isShown(), true);
        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        assert.strictEqual(buttonElements.length, 4);
        var moreOptionsElement = buttonElements[2];
        var checkboxElement = buttonElements[3];
        assert.strictEqual(checkboxElement.parentElement, commandBarTooltip.moreOptionsEl);
        assert.strictEqual(checkboxElement.firstChild.classList.contains("ace_checkmark"), true);
        assert.strictEqual(checkboxElement.ariaChecked.toString(), "true");

        testValues.testCheckboxValue1 = false;
        commandBarTooltip.update();
        assert.strictEqual(checkboxElement.firstChild.classList.contains("ace_checkmark"), false);
        assert.strictEqual(checkboxElement.ariaChecked.toString(), "false");

        assert.strictEqual(commandBarTooltip.isMoreOptionsShown(), false);
        simulateClick(moreOptionsElement);
        assert.strictEqual(commandBarTooltip.isMoreOptionsShown(), true);
        simulateClick(checkboxElement);
        assert.strictEqual(commandBarTooltip.isMoreOptionsShown(), false);

        assert.strictEqual(checkboxElement.firstChild.classList.contains("ace_checkmark"), true);
        assert.strictEqual(checkboxElement.ariaChecked.toString(), "true");
        done();
    },
    "test: tooltip supports icon buttons": function(done) {
        createTooltip();
        commandBarTooltip.registerCommand("testIcon1", {
            name: "testIcon1",
            bindKey: "Alt-I",
            exec: testFunction("testIcon1"),
            enabled: testFunction("testIconEnabled1", true),
            iconCssClass: "ace_info",
            type: "button"
        });

        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        commandBarTooltip.attach(editor);
        assert.strictEqual(commandBarTooltip.isShown(), true);
        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        assert.strictEqual(buttonElements.length, 3);
        var iconButtonElement = buttonElements[2];
        assert.strictEqual(iconButtonElement.firstChild.classList.contains("ace_info"), true);
        assert.strictEqual(iconButtonElement.firstChild.classList.contains("ace_icon_svg"), true);
        assert.strictEqual(counters["testIcon1"], undefined);

        simulateClick(iconButtonElement);

        assert.strictEqual(counters["testIcon1"], 1);
        done();
    },
    "test: tooltip supports text elements": function(done) {
        createTooltip();
        testValues.testTextValue1 = "test";
        commandBarTooltip.registerCommand("testText1", {
            name: "testText1",
            bindKey: "Alt-I",
            enabled: testFunction("testTextEnabled1", true),
            getValue: testFunction("testTextValue1"),
            type: "text"
        });

        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        commandBarTooltip.attach(editor);
        assert.strictEqual(commandBarTooltip.isShown(), true);
        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        assert.strictEqual(buttonElements.length, 3);
        var textButtonElement = buttonElements[2];
        assert.strictEqual(textButtonElement.textContent, "test");
        assert.strictEqual(counters["testText1"], undefined);

        simulateClick(textButtonElement);
        assert.strictEqual(textButtonElement.textContent, "test");
        assert.strictEqual(counters["testText1"], undefined);

        testValues.testTextValue1 = "updatedTest";
        commandBarTooltip.update();
        assert.strictEqual(textButtonElement.textContent, "updatedTest");
        assert.strictEqual(counters["testText1"], undefined);
        done();
    },
    "test: tooltip creates more options menu for overflow options": function(done) {
        createTooltip({ maxElementsOnTooltip: 2 });

        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        assert.strictEqual(buttonElements.length, 2);
        assert.strictEqual(buttonElements[0].parentElement, commandBarTooltip.tooltipEl);
        assert.strictEqual(buttonElements[1].parentElement, commandBarTooltip.tooltipEl);

        commandBarTooltip.attach(editor);

        commandBarTooltip.registerCommand("testText1", {
            name: "testText1",
            enabled: testFunction("testTextEnabled1", true),
            getValue: testFunction("testTextValue1"),
            type: "text"
        });

        buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        assert.strictEqual(buttonElements.length, 4);
        assert.strictEqual(buttonElements[2].parentElement, commandBarTooltip.tooltipEl);
        assert.strictEqual(buttonElements[3].parentElement, commandBarTooltip.moreOptionsEl);

        var moreOptionsButton = buttonElements[2];

        assert.strictEqual(commandBarTooltip.isMoreOptionsShown(), false);
        simulateClick(moreOptionsButton);
        assert.strictEqual(commandBarTooltip.isMoreOptionsShown(), true);
        simulateClick(moreOptionsButton);
        assert.strictEqual(commandBarTooltip.isMoreOptionsShown(), false);
        simulateClick(moreOptionsButton);
        assert.strictEqual(commandBarTooltip.isMoreOptionsShown(), true);
        simulateClick(buttonElements[3]);
        assert.strictEqual(commandBarTooltip.isMoreOptionsShown(), false);
        done();
    },
    "test: more options opens below main tooltip, above only if there is no space below": function(done) {
        createTooltip({ maxElementsOnTooltip: 1 });

        wrapperEl.style.top = (window.innerHeight - editorPx) + "px";
        wrapperEl.style.left = (window.innerWidth - editorPx) + "px";

        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        assert.strictEqual(buttonElements.length, 3);

        var moreOptionsButton = buttonElements[1];
        var tooltipEl = commandBarTooltip.tooltip.getElement();
        var moreOptionsEl = commandBarTooltip.moreOptions.getElement();
        var charWidth = editor.renderer.$textLayer.getCharacterWidth();
        var testString = "\n".repeat(editorPx / editor.renderer.lineHeight + 3) +
             "b".repeat(editorPx / charWidth);


        editor.execCommand("insertstring", testString);
        editor.getSelection().moveCursorFileStart();
        editor.renderer.scrollTo(0,0);
        editor.renderer.$loop._flush();

        commandBarTooltip.attach(editor);

        tooltipVisibilityCheck(true);
        simulateClick(moreOptionsButton);
        tooltipVisibilityCheck(true, true);

        assert.ok(tooltipEl.getBoundingClientRect().top < moreOptionsEl.getBoundingClientRect().top);

        commandBarTooltip.detach();

        editor.getSelection().moveCursorFileEnd();
        editor.renderer.scrollCursorIntoView(editor.getCursorPosition());
        editor.renderer.$loop._flush();

        commandBarTooltip.attach(editor);

        tooltipVisibilityCheck(true);
        simulateClick(moreOptionsButton);
        tooltipVisibilityCheck(true, true);

        assert.ok(tooltipEl.getBoundingClientRect().top > moreOptionsEl.getBoundingClientRect().top);
        done();
    },
    "test: keeps the editor in focus after the tooltip is clicked": function(done) {
        createTooltip({ maxElementsOnTooltip: 1 });

        var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
        assert.strictEqual(buttonElements.length, 3);

        var moreOptionsButton = buttonElements[1];
        var tooltipEl = commandBarTooltip.tooltip.getElement();
        var moreOptionsEl = commandBarTooltip.moreOptions.getElement();

        commandBarTooltip.attach(editor);

        tooltipVisibilityCheck(true);
        simulateClick(tooltipEl);
        assert.strictEqual(editor.isFocused(), true);
        simulateClick(moreOptionsButton);
        assert.strictEqual(editor.isFocused(), true);
        tooltipVisibilityCheck(true, true);
        simulateClick(moreOptionsEl);
        assert.strictEqual(editor.isFocused(), true);
        simulateClick(buttonElements[2]);
        assert.strictEqual(editor.isFocused(), true);
        
        commandBarTooltip.detach();

        assert.strictEqual(editor.isFocused(), true);
        
        done();
    },
    "test: shows windows keybindings when available": function(done) {
        var origIsWin = useragent.isWin;
        var origIsMac = useragent.isMac;
        try {
            useragent.isWin = true;
            useragent.isMac = false;
            createTooltip({ maxElementsOnTooltip: 1 });

            commandBarTooltip.registerCommand("testButton3", {
                name: "testButton",
                bindKey: { win: "Shift-Right", mac: "Option-Right" },
                exec: testFunction("testButton3"),
                enabled: testFunction("testButtonEnabled3", true),
                type: "button"
            });

            var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
            assert.strictEqual(buttonElements.length, 4);

            var extractTextContent = function(el) {
                return el.textContent;
            };

            var keyBindings1 = Array.from(buttonElements[0].lastChild.childNodes).map(extractTextContent);
            var keyBindings2 = Array.from(buttonElements[2].lastChild.childNodes).map(extractTextContent);
            var keyBindings3 = Array.from(buttonElements[3].lastChild.childNodes).map(extractTextContent);
            assert.deepEqual(keyBindings1, ["Alt", "K"]);
            assert.deepEqual(keyBindings2, ["Ctrl", "L"]);
            assert.deepEqual(keyBindings3, ["⇧", "→"]);

            done();
        } finally {
            useragent.isWin = origIsWin;
            useragent.isMac = origIsMac;
        }
    },
    "test: shows mac keybindings when available": function(done) {
        var origIsWin = useragent.isWin;
        var origIsMac = useragent.isMac;
        try {
            useragent.isWin = false;
            useragent.isMac = true;
            createTooltip({ maxElementsOnTooltip: 1 });

            commandBarTooltip.registerCommand("testButton3", {
                name: "testButton",
                bindKey: { win: "Shift-Right", mac: "Option-Right" },
                exec: testFunction("testButton3"),
                enabled: testFunction("testButtonEnabled3", true),
                type: "button"
            });

            var buttonElements = Array.from(document.querySelectorAll("." + BUTTON_CLASS_NAME));
            assert.strictEqual(buttonElements.length, 4);

            var extractTextContent = function(el) {
                return el.textContent;
            };

            var keyBindings1 = Array.from(buttonElements[0].lastChild.childNodes).map(extractTextContent);
            var keyBindings2 = Array.from(buttonElements[2].lastChild.childNodes).map(extractTextContent);
            var keyBindings3 = Array.from(buttonElements[3].lastChild.childNodes).map(extractTextContent);
            assert.deepEqual(keyBindings1, ["⌘", "K"]);
            assert.deepEqual(keyBindings2, ["^", "L"]);
            assert.deepEqual(keyBindings3, ["⌥", "→"]);

            done();
        } finally {
            useragent.isWin = origIsWin;
            useragent.isMac = origIsMac;
        }
    },
    "test: does not display if the editor cursor is not visible": function(done) {
        createTooltip();

        var charWidth = editor.renderer.$textLayer.getCharacterWidth();

        var testString = "a".repeat(100) +
             "\n".repeat(editorPx / editor.renderer.lineHeight + 3) +
             "b".repeat(100);

        editor.execCommand("insertstring", testString);
        editor.renderer.$loop._flush();

        editor.getSelection().moveCursorFileStart();
        editor.renderer.scrollTo(0,0);
        editor.renderer.$loop._flush();

        commandBarTooltip.attach(editor);
        tooltipVisibilityCheck(true);

        editor.renderer.scrollToLine(1);
        editor.renderer.$loop._flush();
        tooltipVisibilityCheck(false);

        editor.renderer.scrollToLine(0);
        editor.renderer.$loop._flush();
        tooltipVisibilityCheck(true);

        editor.renderer.scrollBy(charWidth * 2);
        editor.renderer.$loop._flush();
        tooltipVisibilityCheck(false);

        editor.renderer.scrollBy(-charWidth * 2);
        editor.renderer.$loop._flush();
        tooltipVisibilityCheck(true);
        commandBarTooltip.detach();

        editor.getSelection().moveCursorFileEnd();
        editor.renderer.scrollCursorIntoView(editor.getCursorPosition());
        editor.renderer.$loop._flush();
        commandBarTooltip.attach(editor);
        tooltipVisibilityCheck(true);

        editor.renderer.scrollToLine(editor.renderer.getScrollTopRow() - 2);
        editor.renderer.$loop._flush();
        tooltipVisibilityCheck(false);

        editor.renderer.scrollToLine(editor.renderer.getScrollTopRow() + 2);
        editor.renderer.$loop._flush();
        tooltipVisibilityCheck(true);

        editor.renderer.scrollBy(-charWidth * 10);
        editor.renderer.$loop._flush();
        tooltipVisibilityCheck(false);

        editor.renderer.scrollBy(charWidth * 10);
        editor.renderer.$loop._flush();
        tooltipVisibilityCheck(true);
        commandBarTooltip.detach();
        done();
    },
    "test: does not display if the tooltip does not fit into the screen": function(done) {
        createTooltip();

        var testString = "a".repeat(100) +
             "\n".repeat(editorPx / editor.renderer.lineHeight + 3) +
             "b".repeat(100);

        editor.execCommand("insertstring", testString);
        editor.renderer.$loop._flush();

        wrapperEl.style.top = "10px";

        commandBarTooltip.attach(editor);
        tooltipVisibilityCheck(true);

        commandBarTooltip.detach();

        tooltipVisibilityCheck(false);

        editor.getSelection().moveCursorFileStart();
        editor.renderer.scrollCursorIntoView(editor.getCursorPosition());
        editor.renderer.$loop._flush();

        commandBarTooltip.attach(editor);
        tooltipVisibilityCheck(false);

        done();
    },
    "test: detaches when session changes": function(done) {
        createTooltip();
        commandBarTooltip.attach(editor);
        tooltipVisibilityCheck(true);

        var currentSession = editor.getSession();
        editor.setSession(null);
        tooltipVisibilityCheck(false);

        editor.setSession(currentSession);
        tooltipVisibilityCheck(false);

        commandBarTooltip.attach(editor);
        tooltipVisibilityCheck(true);
        done();
    },
    "test: verify detach": function(done) {
        createTooltip();
        commandBarTooltip.attach(editor);
        tooltipVisibilityCheck(true);

        commandBarTooltip.detach();
        tooltipVisibilityCheck(false);

        commandBarTooltip.detach();
        tooltipVisibilityCheck(false);
        done();
    },
    "test: verify destroy": function(done) {
        createTooltip();
        commandBarTooltip.attach(editor);
        tooltipVisibilityCheck(true);

        commandBarTooltip.destroy();
        assert.strictEqual(commandBarTooltip.isShown(), false);
        assert.strictEqual(commandBarTooltip.isMoreOptionsShown(), false);
        var tooltipDomElements = document.querySelectorAll("." + TOOLTIP_CLASS_NAME);
        assert.strictEqual(tooltipDomElements.length, 0);

        // Intentionally called twice
        commandBarTooltip.destroy();
        assert.strictEqual(commandBarTooltip.isShown(), false);
        assert.strictEqual(commandBarTooltip.isMoreOptionsShown(), false);
        tooltipDomElements = document.querySelectorAll("." + TOOLTIP_CLASS_NAME);
        assert.strictEqual(tooltipDomElements.length, 0);
        done();
    },
    tearDown: function() {
        commandBarTooltip.destroy();
        editor.destroy();
        wrapperEl.parentElement.removeChild(wrapperEl);
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
