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
    require("../test/mockdom");
}

define(function(require, exports, module) {
"use strict";

require("../multi_select");
require("../theme/textmate");
var Editor = require("../editor").Editor;
var Mode = require("../mode/java").Mode;
var VirtualRenderer = require("../virtual_renderer").VirtualRenderer;
var assert = require("../test/assertions");
var MouseEvent = function(type, opts){
    var e = document.createEvent("MouseEvents");
    e.initMouseEvent(/click|DOM/.test(type) ? type : "mouse" + type,
        true, true, window,
        opts.detail,
        opts.x, opts.y, opts.x, opts.y,
        opts.ctrl, opts.alt, opts.shift, opts.meta,
        opts.button || 0, opts.relatedTarget);
    return e;
};
function sendTouchEvent(type, opts, editor) {
    var e = new window.Event("touch" + type, {bubbles: true, cancelable: true});
    Object.defineProperties(e, Object.getOwnPropertyDescriptors(opts));
    editor.container.dispatchEvent(e);
}

function touchPos(row, column) {
    var pos = editor.renderer.textToScreenCoordinates(row, column);
    var h = editor.renderer.lineHeight / 2;
    return {clientX: pos.pageX, clientY: pos.pageY + h};
}

var editor;

module.exports = {

    setUp : function(next) {
        this.editor = new Editor(new VirtualRenderer());
        this.editor.session.setValue("Juhu kinners!");
        this.editor.container.style.position = "absolute";
        this.editor.container.style.height = "500px";
        this.editor.container.style.width = "500px";
        this.editor.container.style.left = "50px";
        this.editor.container.style.top = "10px";
        document.body.appendChild(this.editor.container);
        editor = this.editor;
        next();
    },

    "test: double tap. issue #956" : function() {
        // mouse up fired immediately after mouse down
        this.editor.resize(true);
        var pos = this.editor.renderer.textToScreenCoordinates(0, 1);
        var target = this.editor.renderer.getMouseEventTarget();
        target.dispatchEvent(MouseEvent("down", {x: pos.pageX, y: pos.pageY}));
        target.dispatchEvent(MouseEvent("up", {x: pos.pageX, y: pos.pageY}));
        target.dispatchEvent(MouseEvent("down", {x: pos.pageX, y: pos.pageY, detail: 2}));
        target.dispatchEvent(MouseEvent("up", {x: pos.pageX, y: pos.pageY, detail: 2}));
        
        assert.equal(this.editor.getSelectedText(), "Juhu");
        
        target.dispatchEvent(MouseEvent("down", {x: pos.pageX, y: pos.pageY}));
        target.dispatchEvent(MouseEvent("up", {x: pos.pageX, y: pos.pageY}));
        assert.equal(this.editor.getSelectedText(), "");
    },
    "test: multiselect" : function() {
        var target = this.editor.renderer.getMouseEventTarget();
        this.editor.session.setValue("xyz\n\nabc efg");
        this.editor.resize(true);
        
        var pos = this.editor.renderer.textToScreenCoordinates(0, 1);
        
        target.dispatchEvent(MouseEvent("down", {x: pos.pageX, y: pos.pageY}));
        target.dispatchEvent(MouseEvent("up", {x: pos.pageX, y: pos.pageY}));
        
        pos = this.editor.renderer.textToScreenCoordinates(0, 2);
        
        target.dispatchEvent(MouseEvent("down", {x: pos.pageX, y: pos.pageY, ctrl: true}));
        target.dispatchEvent(MouseEvent("up", {x: pos.pageX, y: pos.pageY}));
        
        var selection = "Range: [0/2] -> [0/2],Range: [0/1] -> [0/1]";
        assert.equal(this.editor.selection.toJSON() + "", selection);
        
        pos = this.editor.renderer.textToScreenCoordinates(2, 2);
        
        target.dispatchEvent(MouseEvent("down", {x: pos.pageX, y: pos.pageY, detail: 2, ctrl: true}));
        target.dispatchEvent(MouseEvent("up", {x: pos.pageX, y: pos.pageY, detail: 2, ctrl: true}));
        
        selection = "Range: [2/0] -> [2/3]," + selection;
        assert.equal(this.editor.selection.toJSON() + "", selection);
        
        var pos = this.editor.renderer.textToScreenCoordinates(0, 1);
        
        target.dispatchEvent(MouseEvent("down", {x: pos.pageX, y: pos.pageY, ctrl: true}));
        target.dispatchEvent(MouseEvent("up", {x: pos.pageX, y: pos.pageY, ctrl: true}));
        selection = selection.split(",").slice(0, -1).join(",");
        assert.equal(this.editor.selection.toJSON() + "", selection);
        
        var pos1 = this.editor.renderer.textToScreenCoordinates(0, 2);
        var pos2 = this.editor.renderer.textToScreenCoordinates(2, 2);
        
        target.dispatchEvent(MouseEvent("down", {x: pos1.pageX, y: pos1.pageY, alt: true}));
        target.dispatchEvent(MouseEvent("move", {x: pos2.pageX, y: pos2.pageY + 1, alt: true}));
        target.dispatchEvent(MouseEvent("up", {x: pos2.pageX, y: pos2.pageY + 1, alt: true}));
        assert.equal(this.editor.selection.toJSON() + "", "Range: [2/2] -> [2/2],Range: [1/0] -> [1/0],Range: [0/2] -> [0/2]");
    },
    "test: gutter" : function() {
        var editor = this.editor;
        var value = "x {" + "\n".repeat(50) + "}";
        value = value.repeat(50);
        editor.session.setMode(new Mode());
        editor.setValue(value, -1);
        editor.renderer.$loop._flush();
        var lines = editor.renderer.$gutterLayer.$lines;
        var toggler = lines.cells[0].element.lastChild;
        var rect = toggler.getBoundingClientRect();
        if (!rect.left) rect.left = 100; // for mockdom
        toggler.dispatchEvent(MouseEvent("down", {x: rect.left, y: rect.top}));
        toggler.dispatchEvent(MouseEvent("up", {x: rect.left, y: rect.top}));
        toggler.dispatchEvent(MouseEvent("click", {x: rect.left, y: rect.top}));
        editor.renderer.$loop._flush();
        
        assert.ok(/ace_gutter-active-line/.test(lines.cells[0].element.className));
        assert.ok(/ace_closed/.test(toggler.className));
        editor.execCommand("golinedown");
        editor.renderer.$loop._flush();
        assert.notOk(/ace_gutter-active-line/.test(lines.cells[0].element.className));
        assert.ok(/ace_gutter-active-line/.test(lines.cells[1].element.className));
        assert.equal(lines.cells[1].element.textContent, "51");
        
        var e;
        if ("onmousewheel" in toggler) {
            e = MouseEvent("wheel", {});
            e.wheelDelta = -500;
        }
        else {
            e = MouseEvent("DOMMouseScroll", {detail: 100});
        }
        toggler.dispatchEvent(e);
        editor.renderer.$loop._flush();
        assert.ok(parseInt(lines.cells[0].element.textContent) > 1);
    },
    
    "test: touch" : function(done) {
        var editor = this.editor;
        var value = "x {" + "\n  abc".repeat(10) + "\n}";
        value = value.repeat(10);
        editor.setValue(value, -1);
        editor.setOption("maxLines", 10);
        editor.renderer.$loop._flush();
        window.editor = editor;
        window.sendTouchEvent = sendTouchEvent;
        
        // single tap moves cursor
        sendTouchEvent("start", {touches: [touchPos(2, 1)]}, editor);
        sendTouchEvent("end", {touches: [touchPos(2, 1)]}, editor);
        editor.renderer.$loop._flush();
        assert.position(editor.getCursorPosition(), 2, 1);
        
        // two finger tap allows to zoom
        sendTouchEvent("start", {touches: [touchPos(5, 5), touchPos(6, 6)]}, editor);
        sendTouchEvent("end", {touches: [touchPos(5, 5)]}, editor);
        editor.renderer.$loop._flush();
        assert.position(editor.getCursorPosition(), 2, 1);
        
        // tap and drag near cursor selects
        sendTouchEvent("start", {touches: [touchPos(2, 1)]}, editor);
        sendTouchEvent("move", {touches: [touchPos(2, 3)]}, editor);
        sendTouchEvent("move", {touches: [touchPos(2, 4)]}, editor);
        sendTouchEvent("end", {touches: [touchPos(2, 3)]}, editor);
        editor.renderer.$loop._flush();
        assert.equal(editor.getSelectedText(), " ab");
        
        // double tap selects the word
        sendTouchEvent("start", {touches: [touchPos(3, 3)]}, editor);
        sendTouchEvent("move", {touches: [touchPos(3, 3)]}, editor);
        sendTouchEvent("end", {touches: [touchPos(3, 3)]}, editor);
        sendTouchEvent("start", {touches: [touchPos(3, 3)]}, editor);
        sendTouchEvent("move", {touches: [touchPos(3, 3)]}, editor);
        sendTouchEvent("end", {touches: [touchPos(3, 3)]}, editor);
        editor.renderer.$loop._flush();
        assert.equal(editor.getSelectedText(), "abc");
        
        // mobile menu works
        var menu = editor.container.querySelector(".ace_mobile-menu");
        sendTouchEvent("start", {touches: [touchPos(3, 3)]}, {container: menu});
        sendTouchEvent("end", {touches: [touchPos(3, 3)]}, {container: menu});
        var button = editor.container.querySelectorAll(".ace_mobile-button")[1];
        sendTouchEvent("start", {touches: [touchPos(3, 3)]}, {container: button});
        sendTouchEvent("end", {touches: [touchPos(3, 3)]}, {container: button});
        assert.equal(editor.getSelectedText(), "");
        
        // tap and drag in other places scrolls
        sendTouchEvent("start", {touches: [touchPos(8, 3)]}, editor);
        sendTouchEvent("move", {touches: [touchPos(8, 3)]}, editor);
        setTimeout(function() {
            sendTouchEvent("move", {touches: [touchPos(1, 3)]}, editor);
            sendTouchEvent("end", {touches: [touchPos(1, 3)]}, editor);
            editor.renderer.$loop._flush();
            assert.equal(editor.renderer.getFirstFullyVisibleRow(), 7);
            
            // editor animates scrolling
            setTimeout(function() {
                assert.notOk(menu.clientHeight);
                assert.ok(editor.renderer.getFirstFullyVisibleRow() > 7);
                done();
            }, 50);
        }, 2);
    },
    
    "test: touch selection with scrollMargin" : function() {
        editor.renderer.setScrollMargin(50, 50, 0, 15);
        editor.setValue("Juhu Kinners!");
        editor.renderer.$loop._flush();
        
        var pos = editor.renderer.textToScreenCoordinates(0, 0);
        
        assert.equal(pos.pageY - editor.container.getBoundingClientRect().top, 50);
        
        sendTouchEvent("start", {touches: [touchPos(0, 0)]}, editor);
        sendTouchEvent("move", {touches: [touchPos(0, 5)]}, editor);
        editor.renderer.$loop._flush();
        sendTouchEvent("end", {touches: [touchPos(0, 5)]}, editor);
        editor.renderer.$loop._flush();
        
        sendTouchEvent("start", {touches: [touchPos(0, 12)]}, editor);
        sendTouchEvent("move", {touches: [touchPos(0, 8)]}, editor);
        editor.renderer.$loop._flush();
        sendTouchEvent("end", {touches: [touchPos(0, 8)]}, editor);
        
        assert.equal(editor.getSelectedText(), "Kin");
    },
    
    "test: destroy while mouse is pressed": function() {
        assert.ok(!this.editor.$mouseHandler.releaseMouse);
        var target = this.editor.renderer.getMouseEventTarget();
        target.dispatchEvent(MouseEvent("down", {x: 0, y: 0}));
        assert.ok(this.editor.$mouseHandler.releaseMouse);
        this.editor.destroy();
        assert.ok(!this.editor.$mouseHandler.releaseMouse);
    },
    tearDown : function() {
        this.editor.destroy();
        document.body.removeChild(this.editor.container);
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
