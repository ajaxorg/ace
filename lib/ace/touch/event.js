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

var global = window;
var doc  = document;
var body = doc.body;

if(!body){
  doc.write('<div></div>');
  body = doc.body;
}

var event = require('../lib/event');
var oop = require('../lib/oop');
var util = require('./util');

oop.mixin(exports, event);

var event_addListener = exports.addListener;
var event_removeListener = exports.removeListener;

var env = util.env;
var nextTick = util.nextTick;

exports.env = util.env;
exports.nextTick = nextTick;

var custom_mouse_events = {
  click: { name: '_click', type: 'MouseEvents' },       // 单击
  dblclick: { name: '_dblclick', type: 'MouseEvents' }, // 双击
  tripleclick: { name: 'tripleclick', type: 'MouseEvents' },  // 三击
  quadclick: { name: 'quadclick', type: 'MouseEvents' },      // 四击
  longpress: { name: 'longpress', type: 'TouchEvent' },      // 长按
};

var multi_click_event_names = {
  2: 'dblclick',
  3: 'tripleclick',
  4: 'quadclick'
};

var multi_click_event_timeouts = [ 0, 400, 300, 250, 250 ];

function emitCustomMouseClickEvent(self, type, msg){
  
  msg = msg || { };
  var custom = custom_mouse_events[type];
  
  var evt = doc.createEvent(custom.type);
  
  if(custom.type == 'MouseEvents'){
    
    evt.initMouseEvent(
      custom.name,
      true, 
      true, 
      doc.defaultView, 
      msg.detail || 0,
      msg.screenX || 0, 
      msg.screenY || 0, 
      msg.clientX || 0, 
      msg.clientY || 0, 
      msg.ctrlKey || false, 
      msg.altKey || false, 
      msg.shiftKey || false, 
      msg.metaKey || false, 
      msg.button || 0, 
      msg.relatedTarget || null);
  }
  else if(custom.type == 'TouchEvent'){
    
    evt.initTouchEvent(
      custom.name,
      true, 
      true, 
      doc.defaultView, 
      msg.detail || 0,
      msg.screenX || 0, 
      msg.screenY || 0, 
      msg.clientX || 0, 
      msg.clientY || 0, 
      msg.ctrlKey || false, 
      msg.altKey || false, 
      msg.shiftKey || false, 
      msg.metaKey || false, 
      msg.touches || [],
      msg.targetTouches || [],
      msg.changedTouches || [],
      msg.scale || 1,
      msg.rotation || 0);
  }
  else {
    throw 'Error';
  }

  self.dom.dispatchEvent(evt);
  
  return evt;
}

function CustomMouseEventHandle(dom){
  
  this.dom = dom;
  
  var self = this;
  var startX = 0;
  var startY = 0;
  var curX = 0;
  var curY = 0;
  var clicks = 0;
  var timer = 0;
  var timer_longpress = 0;
  var timer_longpress_ok = false;
  
  function reset(){
    reset_multi_click_event();
    cancel_longpress();
  }
  
  function reset_multi_click_event(){
    clicks = 0;
    if(timer){
      clearTimeout(timer);
      timer = 0;
    }
  }
  
  function cancel_longpress(){
    
    timer_longpress_ok = false;
    if(timer_longpress){
      clearTimeout(timer_longpress);
      timer_longpress = 0;
    }
  }
  
  function complete_longpress(evt){
    
    timer_longpress = 0;
    timer_longpress_ok = true;
    var w = Math.abs(curX - startX);
    var h = Math.abs(curY - startY);
    var s = Math.sqrt(w * w + h * h);
    
    if(s > 20){ //移动超过20px取消事件
      return cancel_longpress();
    }
    
    nextTick(emitCustomMouseClickEvent, self, 'longpress', evt);
  }
  
  function touchstart(evt){

    if(evt._complete){ // 用过后不能在用
      return;
    }
    evt._complete = true;
    
    // 只能是一个触点,否则取消
    if(evt.touches.length != 1){
      return reset();
    }
    
    var touche = evt.changedTouches[0];
    curX = touche.pageX - body.scrollLeft;
    curY = touche.pageY - body.scrollTop;
    // 长按1秒触发事件
    cancel_longpress(); // 先取消
    timer_longpress = setTimeout(complete_longpress.bind(null, evt), 800);
    
    clicks++;
    
    if(timer){
      clearTimeout(timer);
    }
    timer = setTimeout(reset_multi_click_event, multi_click_event_timeouts[clicks]);
    
    if(clicks == 1){
      startX = curX;
      startY = curY;
      return;
    }
    
    var w = Math.abs(curX - startX);
    var h = Math.abs(curY - startY);
    var s = Math.sqrt(w * w + h * h);
    
    if(s > 20){ //移动超过20px不认为是click事件
      return reset();
    }
    
    var name = multi_click_event_names[clicks];

    nextTick(emitCustomMouseClickEvent, self, name, {
      detail: evt.detail,
      screenX: curX,
      screenY: curY,
      clientX: curX,
      clientY: curY
    });
    
    if(!multi_click_event_names[clicks + 1]){
      clicks = 0;
    }
  }
  
  function touchmove(evt){

    if(evt._complete){ // 用过后不能在用
      return;
    }
    evt._complete = true;

    if(evt.touches.length != 1){
      return;
    }
    var touche = evt.changedTouches[0];
    curX = touche.pageX - body.scrollLeft;
    curY = touche.pageY - body.scrollTop;
  }

  function touchend(evt) {
      
    if(evt._complete){ // 用过后不能在用
      return;
    }
    evt._complete = true;
    
    if(timer_longpress_ok){
      // 已经触发了长按事件,取消点击事件
      timer_longpress_ok = false;
      return;
    }
    
    cancel_longpress(); // 取消长按
    
    if(evt.touches.length){ // 当前必需没有任何触点
      return;
    }
    
    var touche = evt.changedTouches[0];
    var x = touche.pageX - body.scrollLeft;
    var y = touche.pageY - body.scrollTop;
    var w = Math.abs(x - startX);
    var h = Math.abs(y - startY);
    var s = Math.sqrt(w * w + h * h);
    
    if(s > 20){ //移动超过20px不认为是click事件
      return;
    }
    
    nextTick(emitCustomMouseClickEvent, self, 'click', {
      detail : evt.detail,
      screenX: touche.screenX,
      screenY: touche.screenY,
      clientX: touche.clientX,
      clientY: touche.clientY
    });
  }

  event_addListener(dom, 'touchstart', touchstart);
  event_addListener(dom, 'touchmove', touchmove);
  event_addListener(dom, 'touchend', touchend);
}

if(env.mobile){
  
  exports.addListener = function (elem, type, callback){
    
    if(type in custom_mouse_events){
      if(!elem.custom_mouse_event_handle){
        elem.custom_mouse_event_handle = new CustomMouseEventHandle(elem);
      }
      return event_addListener(elem, custom_mouse_events[type].name, callback);
    }
    return event_addListener(elem, type, callback);
  };
  
  exports.removeListener = function(elem, type, callback){
    if(type in custom_mouse_events){
      return event_removeListener(elem, custom_mouse_events[type].name, callback);
    }
    return event_removeListener(elem, type, callback);
  };
  
  // extends touch event
  event.addListener = exports.addListener;
  event.removeListener = exports.removeListener;
}

exports.on = exports.addListener;
exports.off = exports.removeListener;

});
