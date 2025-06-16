if (typeof process !== "undefined") {
    require("amd-loader");
    require("./test/mockdom");
}

"use strict";

var assert = require("./test/assertions");
var sendKey = require("./test/user").type;
var ace = require("./ace");

var editor;

function mouse(type, pos, properties) {
    var target = editor.renderer.getMouseEventTarget();
    var event = new CustomEvent("mouse" + type, {bubbles: true});

    if ("row" in pos) {
        var pagePos = editor.renderer.textToScreenCoordinates(pos.row, pos.column);
        event.clientX = pagePos.pageX;
        event.clientY = pagePos.pageY;
    }
    else {
        target = pos;
        var rect = target.getBoundingClientRect();
        event.clientX = rect.left + rect.width / 2;
        event.clientY = rect.top + rect.height / 2;
    }
    Object.assign(event, properties);
    target.dispatchEvent(event);
}

module.exports = {
    setUp: function () {
        editor = ace.edit(null, {
            value: "999"
        });
        document.body.appendChild(editor.container);
        editor.container.style.height = "200px";
        editor.container.style.width = "300px";
        editor.focus();

    },
    tearDown: function () {
        editor.destroy();
        editor = null;
    },
    "test readOnly Option": function (done) {
        let readOnly = editor.getOption("readOnly");
        assert.equal(editor.hoverTooltip, null);
        assert.equal(readOnly, false);
        editor.setOption("readOnly", true);
        readOnly = editor.getOption("readOnly");
        assert.equal(readOnly, true);
        sendKey("a");

        setTimeout(() => {
            assert.equal(editor.getValue(), "999");
            assert.ok(editor.hoverTooltip != null);

            var nodes = document.querySelectorAll(".ace_tooltip");
            assert.equal(nodes.length, 2);
            assert.equal(editor.hoverTooltip.isOpen, true);

            mouse("down", editor.container, {button: 0});

            setTimeout(() => {
                assert.equal(editor.hoverTooltip.isOpen, false);

                editor.setOption("readOnly", false);
                sendKey("a");
                setTimeout(() => {
                    assert.equal(editor.getValue(), "a999");
                    var nodes = document.querySelectorAll(".ace_tooltip");
                    assert.equal(nodes.length, 1);
                    done();
                }, 6);
            }, 6);
        }, 6);
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
