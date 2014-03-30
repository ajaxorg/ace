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

var useragent = require("./lib/useragent");
var EditSession = require("./edit_session").EditSession;
var VirtualRenderer = require("./virtual_renderer").VirtualRenderer;
var TextInput = require("./keyboard/textinput").TextInput;
var assert = require("./test/assertions");

var el, outerEl, renderer;

module.exports = {

    setUp: function(next) {
        outerEl = document.createElement("div");
        el = document.createElement("div");

        el.style.left = "20px";
        el.style.top = "30px";
        el.style.width = "300px";
        el.style.height = "100px";
        document.body.appendChild(outerEl);
        outerEl.appendChild(el);

        if (!el.getBoundingClientRect) { /*see below*/ next(); return; }
        renderer = new VirtualRenderer(el);
        renderer.setPadding(0);
        var editorMock = {addEventListener: function() {}, onCommandKey: function() {}, renderer: renderer};
        var textInput  = new TextInput(renderer.getTextAreaContainer(), editorMock);
        renderer.textarea = textInput.getElement();

        next();
    },

    tearDown : function(next) {
        document.body.removeChild(outerEl);
        next();
    },

    "test: screen2text the column should be rounded to the next character edge" : function() {

        if (!el.getBoundingClientRect) {
            console.log("Skipping test: This test only runs in the browser");
            return;
        }

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
    },

    "test: correct text measuring with CSS transformations": function() {
        if (!el.getBoundingClientRect || !useragent.isWebKit) {
            console.log("Skipping test: This test only runs in the webkit browsers");
            return;
        }

        renderer.setSession(new EditSession("xxx"));
        renderer.updateFull(true);

        var charHeight = renderer.lineHeight;
        var charWidth = renderer.characterWidth;

        outerEl.style["-webkit-transform"] =
            outerEl.style["-o-transform"] =
            outerEl.style["transform"] = "rotate(10deg) scale(1.2,1.2)";

        el.style["-webkit-transform"] =
            el.style["-o-transform"] =
            el.style["transform"] = "rotate(10deg)";

        renderer.$fontMetrics.checkForSizeChanges()

        var charHeightTransform = renderer.lineHeight;
        var charWidthTransform = renderer.characterWidth;

        assert.equal(charHeightTransform, charHeight,
            'measured char height was changed by transform: '
            + charHeightTransform + ' vs. ' + charHeight);
        assert.equal(charWidthTransform, charWidth,
            'measured char width was changed by transform'
            + charHeightTransform + ' vs. ' + charHeight);
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec()
}
