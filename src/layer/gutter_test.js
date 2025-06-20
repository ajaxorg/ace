if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}

var keys = require("../lib/keys");

("use strict");

require("../multi_select");
require("../theme/textmate");
var Editor = require("../editor").Editor;
var Mode = require("../mode/java").Mode;
var VirtualRenderer = require("../virtual_renderer").VirtualRenderer;
var assert = require("../test/assertions");

function emit(keyCode) {
    var data = {bubbles: true, keyCode};
    var event = new KeyboardEvent("keydown", data);

    var el = document.activeElement;
    el.dispatchEvent(event);
}

module.exports = {
    setUp: function (done) {
        this.editor = new Editor(new VirtualRenderer());
        this.editor.container.style.position = "absolute";
        this.editor.container.style.height = "500px";
        this.editor.container.style.width = "500px";
        this.editor.container.style.left = "50px";
        this.editor.container.style.top = "10px";
        document.body.appendChild(this.editor.container);
        done();
    },
    "test: custom icon replaces the fold icon sucessfully": function (done) {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}\n";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.setOption("enableKeyboardAccessibility", true);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;

        // Set focus to the gutter div.
        editor.renderer.$gutter.focus();
        assert.equal(document.activeElement, editor.renderer.$gutter);

        // Focus on the fold widget.
        emit(keys["enter"]);
        editor.renderer.$gutterLayer.$addCustomWidget(13, {
            className: "ace_users_css",
            label: "Open_label",
            title: "Open_title"
        });

        setTimeout(function () {
            setTimeout(function () {
                // Check that custom widget is shown
                editor.renderer.$loop._flush();
                console.log(lines.cells[13].element.children[2].className);
                assert.ok(/ace_users_css/.test(lines.cells[13].element.children[3].className));
                // fold widget is not shown
                assert.equal(lines.cells[13].element.children[1].style.display, "none");

                // After escape focus should be back to the gutter.
                emit(keys["escape"]);
                assert.equal(document.activeElement, editor.renderer.$gutter);

                done();
            }, 20);
        }, 20);
    },
    "test: after hiding custom icon fold icon is visible automatically": function (done) {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}\n";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.setOption("enableKeyboardAccessibility", true);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;

        // Set focus to the gutter div.
        editor.renderer.$gutter.focus();
        assert.equal(document.activeElement, editor.renderer.$gutter);

        // Focus on the custom widget.
        emit(keys["enter"]);
        editor.renderer.$gutterLayer.$addCustomWidget(0, {
            className: "ace_users_css",
            label: "Open_label",
            title: "Open_title"
        });
        editor.renderer.$gutterLayer.$removeCustomWidget(0);

        setTimeout(function () {
            assert.equal(document.activeElement, lines.cells[0].element.childNodes[1]);

            setTimeout(function () {
                // Check that custom widget is hidden.
                editor.renderer.$loop._flush();
                assert.equal(lines.cells[0].element.children[3], undefined);
                assert.equal(lines.cells[0].element.children[1].style.display, "inline-block");
                assert.ok(/ace_open/.test(lines.cells[0].element.children[1].className));

                // After escape focus should be back to the gutter.
                emit(keys["escape"]);
                assert.equal(document.activeElement, editor.renderer.$gutter);

                done();
            }, 20);
        }, 20);
    },

    "test: folding is kept consistent when custom widget is shown first and then hidden": function (done) {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}\n";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.setOption("enableKeyboardAccessibility", true);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;

        // Set focus to the gutter div.
        editor.renderer.$gutter.focus();
        assert.equal(document.activeElement, editor.renderer.$gutter);

        // Focus on the fold widget.
        emit(keys["enter"]);

        setTimeout(function () {
            assert.equal(document.activeElement, lines.cells[0].element.childNodes[1]);

            // Click the fold widget to fold the lines.
            emit(keys["enter"]);
            editor.renderer.$gutterLayer.$addCustomWidget(0, {
                className: "ace_users_css",
                label: "Open_label",
                title: "Open_title"
            });
            editor.renderer.$gutterLayer.$removeCustomWidget(0);

            setTimeout(function () {
                // Check that custom widget is hidden.
                editor.renderer.$loop._flush();
                assert.equal(lines.cells[0].element.children[3], undefined);
                assert.ok(/ace_closed/.test(lines.cells[0].element.children[1].className));

                // After escape focus should be back to the gutter.
                emit(keys["escape"]);
                assert.equal(document.activeElement, editor.renderer.$gutter);

                done();
            }, 20);
        }, 20);
    },

    "test: onClick callback is getting called and updated when updating the custom widget": function (done) {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}\n";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.setOption("enableKeyboardAccessibility", true);
        editor.renderer.$loop._flush();

        var lines = editor.renderer.$gutterLayer.$lines;

        // Set focus to the gutter div.
        editor.renderer.$gutter.focus();
        assert.equal(document.activeElement, editor.renderer.$gutter);

        // Focus on the fold widget.
        emit(keys["enter"]);

        let firstCallbackCalledCount=0;
        const firstCallback = () =>{ 
            firstCallbackCalledCount++;
        };
        let secondCallbackCalledCount=0;
        const secondCallback = () =>{
            secondCallbackCalledCount++;
        };
        editor.renderer.$gutterLayer.$addCustomWidget(0, {
            className: "ace_users_css",
            label: "Open_label",
            title: "Open_title",
            callbacks: {
                onClick: firstCallback
            }
        });
        editor.renderer.$gutterLayer.$addCustomWidget(0, {
            className: "ace_users_css",
            label: "Open_label",
            title: "Open_title",
            callbacks: {
                onClick: secondCallback
            }
        });
        // clicking the custom widget
        lines.cells[0].element.children[3].dispatchEvent(new CustomEvent("click"));
        setTimeout(function () {

            setTimeout(function () {
                // Check that custom widget is hidden.
                editor.renderer.$loop._flush();
                assert.equal(firstCallbackCalledCount,0);
                assert.equal(secondCallbackCalledCount,1);
                // After escape focus should be back to the gutter.
                emit(keys["escape"]);
                assert.equal(document.activeElement, editor.renderer.$gutter);

                done();
            }, 20);
        }, 20);
    },

    tearDown: function () {
        this.editor.destroy();
        document.body.removeChild(this.editor.container);
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
