/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof process !== "undefined") {
    require("amd-loader");
    require("./test/mockdom");
}

define(function(require, exports, module) {
"use strict";

var Editor = require("./editor").Editor;
var EditSession = require("./edit_session").EditSession;
var VirtualRenderer = require("./virtual_renderer").VirtualRenderer;
var assert = require("./test/assertions");
require("./ext/error_marker");

function setScreenPosition(node, rect) {
    node.style.left = rect[0] + "px";
    node.style.top = rect[1] + "px";
    node.style.width = rect[2] + "px";
    node.style.height = rect[3] + "px";
}

var editor = null;
module.exports = {
    setUp: function() {
        if (editor)
            editor.destroy();
        var el = document.createElement("div");

        el.style.left = "20px";
        el.style.top = "30px";
        el.style.width = "300px";
        el.style.height = "100px";
        document.body.appendChild(el);
        var renderer = new VirtualRenderer(el);
        editor = new Editor(renderer);
        editor.on("destroy", function() {
            document.body.removeChild(el);
        });
    },
    tearDown: function() {
        editor && editor.destroy();
        editor = null;
    },
    "test: screen2text the column should be rounded to the next character edge" : function(done) {
        var renderer = editor.renderer;

        renderer.setPadding(0);
        renderer.setSession(new EditSession("1234"));

        var r = renderer.scroller.getBoundingClientRect();
        function testPixelToText(x, y, row, column) {
            assert.position(renderer.screenToTextCoordinates(x+r.left, y+r.top), row, column);
        }

        renderer.characterWidth = 10;
        renderer.lineHeight = 15;

        testPixelToText(4, 0, 0, 0);
        testPixelToText(5, 0, 0, 1);
        testPixelToText(9, 0, 0, 1);
        testPixelToText(10, 0, 0, 1);
        testPixelToText(14, 0, 0, 1);
        testPixelToText(15, 0, 0, 2);
        done();
    },
    "test: handle css transforms" : function(done) {
        var renderer = editor.renderer;
        var fontMetrics = renderer.$fontMetrics;
        setScreenPosition(editor.container, [20, 30, 300, 100]);
        var measureNode = fontMetrics.$measureNode;
        setScreenPosition(measureNode, [0, 0, 10 * measureNode.textContent.length, 15]);
        setScreenPosition(fontMetrics.$main, [0, 0, 10 * measureNode.textContent.length, 15]);
        
        fontMetrics.$characterSize.width = 10;
        renderer.setPadding(0);
        renderer.onResize(true);
        
        assert.equal(fontMetrics.getCharacterWidth(), 1);
        
        renderer.characterWidth = 10;
        renderer.lineHeight = 15;
        
        renderer.gutterWidth = 40;
        editor.setOption("hasCssTransforms", true);
        editor.container.style.transform = "matrix3d(0.7, 0, 0, -0.00066, 0, 0.82, 0, -0.001, 0, 0, 1, 0, -100, -20, 10, 1)";
        editor.container.style.zoom = 1.5;
        var pos = renderer.pixelToScreenCoordinates(100, 200);
        
        var els = fontMetrics.els;
        var rects = [
            [0, 0],
            [-37.60084843635559, 161.62494659423828],
            [114.50254130363464, -6.890693664550781],
            [98.85665202140808, 179.16063690185547]
        ];
        rects.forEach(function(rect, i) {
            els[i].getBoundingClientRect = function() { 
                return { left: rect[0], top: rect[1] };
            };
        });
        
        var r0 = els[0].getBoundingClientRect();
        pos = renderer.pixelToScreenCoordinates(r0.left + 100, r0.top + 200);
        assert.position(pos, 10, 11);
        
        var pos1 = fontMetrics.transformCoordinates(null, [0, 200]);
        assert.ok(pos1[0] - rects[2][0] < 10e-6);
        assert.ok(pos1[1] - rects[2][1] < 10e-6);
        editor.renderer.$loop._flush();
        
        done();
    },
    
    "test scrollmargin + autosize": function(done) {
        editor.setOptions({
            maxLines: 100,
            wrap: true
        });        
        editor.renderer.setScrollMargin(10, 10);
        editor.setValue("\n\n");
        editor.setValue("\n\n\n\n");
        editor.renderer.once("afterRender", function() {
            setTimeout(function() {
                done();
            }, 0);
        });
    },
    
    "test invalid valus of minLines": function() {
        editor.setOptions({
            maxLines: Infinity,
            minLines: Infinity
        });
        editor.renderer.$loop._flush();
        editor.setOptions({
            maxLines: NaN,
            minLines: NaN
        });
        editor.renderer.$loop._flush();
        editor.setOptions({
            maxLines: Number.MAX_SAFE_INTEGER + 1,
            minLines: Number.MAX_SAFE_INTEGER + 1
        });
        editor.renderer.$loop._flush();
    },
    
    "test line widgets": function() {
        editor.session.setValue("a\nb|c\nd");
        editor.session.setAnnotations([{row: 1, column: 2, type: "error"}]);
        editor.execCommand(editor.commands.byName.goToNextError);
        assert.position(editor.getCursorPosition(), 1, 2);
        editor.renderer.$loop._flush();
        assert.ok(editor.session.lineWidgets[1]);
    },
    
    "test resize": function() {
        editor.setValue("Juhu kinners!");
        editor.resize(true);
    }

    // change tab size after setDocument (for text layer)
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
