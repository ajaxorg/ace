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

define(function(require, exports, module) {
"use strict";

var config = require("../config");
var oop = require('../lib/oop');
var event = require('./event');
var DefaultHandlers = require("./default_handlers").DefaultHandlers;
var DefaultGutterHandler = require("./default_gutter_handler").GutterHandler;
var MouseEvent = require("../mouse/mouse_event").MouseEvent;
var TouchEvent = require("./touch_event").TouchEvent;
var MouseHandler = require("../mouse/mouse_handler").MouseHandler;

var TouchHandler = function(editor) {
  this.editor = editor;
  
  new DefaultHandlers(this);
  new DefaultGutterHandler(this);
  
  editor.renderer.forceCursorHighlight();
  //
  
  var touchTarget = editor.renderer.getMouseEventTarget();
  event.addListener(touchTarget, 'touchstart', this.onTouchEvent.bind(this, "touchstart"));
  event.addListener(touchTarget, "touchmove", this.onTouchEvent.bind(this, "touchmove"));
  event.addListener(touchTarget, "touchend", this.onTouchEvent.bind(this, "touchend"));
  event.addListener(touchTarget, 'longpress', this.onTouchEvent.bind(this, "longpress"));
  event.addListener(touchTarget, "click", this.onMouseEvent.bind(this, "click"));
  event.addListener(touchTarget, 'dblclick', this.onMouseEvent.bind(this, "dblclick"));
  event.addListener(touchTarget, 'tripleclick', this.onMouseEvent.bind(this, "tripleclick"));
  event.addListener(touchTarget, 'quadclick', this.onMouseEvent.bind(this, "quadclick"));
  
  var gutterEl = editor.renderer.$gutter;
  event.addListener(gutterEl, "touchstart", this.onTouchEvent.bind(this, "guttertouchstart"));
  event.addListener(gutterEl, "touchmove", this.onTouchEvent.bind(this, "guttertouchmove"));
  event.addListener(gutterEl, "touchend", this.onTouchEvent.bind(this, "guttertouchend"));
  event.addListener(gutterEl, "click", this.onMouseEvent.bind(this, "gutterclick"));
  event.addListener(gutterEl, "dblclick", this.onMouseEvent.bind(this, "gutterdblclick"));
};

oop.implement(TouchHandler, MouseHandler);

(function() {

  this.onMouseEvent = function(name, e) {
    this.editor._emit(name, new MouseEvent(e, this.editor));
  };
  
  this.onTouchEvent = function(name, e) {
    this.editor._emit(name, new TouchEvent(e, this.editor));
  };

}).call(TouchHandler.prototype);


config.defineOptions(TouchHandler.prototype, "touchHandler", {
  immediateFocus: { initialValue: true },
  clipboardData: { initialValue: null },
});

//clipboard

exports.TouchHandler = TouchHandler;

});
