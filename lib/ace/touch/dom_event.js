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

'use strict';

var event = require('./event');
var util = require('./util');
var Delegate = require('./delegate').Delegate;

var CSS_PREFIX =
    (util.env.trident ? 'ms' :
    util.env.presto ? 'o' :
    util.env.webkit ? 'webkit' :
    util.env.gecko ? 'moz' : ''); // CSS前缀

var EVENT = {
  animationstart: CSS_PREFIX + 'AnimationStart',
  animationiteration: CSS_PREFIX + 'AnimationIteration',
  animationend: CSS_PREFIX + 'AnimationEnd',
  transitionend: CSS_PREFIX + 'TransitionEnd',
  mousewheel: 'mousewheel',
};

if(util.env.gecko) {
  EVENT.animationstart 		= 'animationstart';
  EVENT.animationiteration 	= 'animationiteration';
  EVENT.animationend	 		= 'animationend';
  EVENT.transitionend	 		= 'transitionend';
  EVENT.mousewheel            = 'DOMMouseScroll';
}
else if(util.env.trident) {
  EVENT.animationstart 		= 'MSAnimationStart';
  EVENT.animationiteration 	= 'MSAnimationIteration';
  EVENT.animationend	 		= 'MSAnimationEnd';
  EVENT.transitionend	 		= 'MSTransitionEnd';
}

var doc  = document;
var body = doc.body;

/*
说明
该方法将创建一种新的事件类型，该类型由参数 eventType 指定。注意，该参数的值不是要创建的事件接口的名称，而是定义那个接口的 DOM 模块的名称。
下表列出了 eventType 的合法值和每个值创建的事件接口：
参数    事件接口	初始化方法
HTMLEvents	HTMLEvent	iniEvent()
UIEvents    UIEvent	iniUIEvent()
MouseEvents	MouseEvent	initMouseEvent()
TouchEvents    TouchEvent	initTouchEvent()
用该方法创建了 Event 对象以后，必须用上表中所示的初始化方法初始化对象。关于初始化方法的详细信息，请参阅 Event 对象参考。
该方法实际上不是由 Document 接口定义的，而是由 DocumentEvent 接口定义的。如果一个实现支持 Event 模块，那么 Document 对象就会实现 DocumentEvent 接口并支持该方法。
*/

//initEvent
/*
Summary

The initEvent method is used to initialize the value of an event created using document.createEvent.

Syntax

event.initEvent(type, bubbles, cancelable);
type
The type of event.
bubbles
A boolean indicating whether the event should bubble up through the event chain or not (see bubbles).
cancelable;
A boolean indicating whether the event can be canceled (see cancelable).
Example

1
2
3
// create a click event that bubbles up and 
// cannot be canceled 
event.initEvent("click", true, false);
The page on dispatchEvent has a more useful example.

Notes

Events initialized in this way must have been created with the document.createEvent method. initEvent must be called to set the event before it is dispatchEvent.


*/

//initUIEvent
/*
Summary

Initializes a UI event once it's been created.

Syntax

event.initUIEvent(type, canBubble, cancelable, view, detail) 
Parameters

type 
The type of event.
canBubble 
A boolean indicating whether the event should bubble up through the event chain or not (see bubbles).
cancelable 
A boolean indicating whether the event can be canceled (see cancelable).
view 
The AbstractView associated with the event.
detail 
A number specifying some detail information about the event, depending on the type of event. For mouse events, it indicates how many times the mouse has been clicked on a given screen location (usually 1).
Example

var e = document.createEvent("UIEvents");
// creates a click event that bubbles, can be cancelled,
// and with its view and detail property initialized to window and 1,
// respectively
e.initUIEvent("click", true, true, window, 1);
Specification

DOM Level 2 Events - method of UIEvent object
*/


//initMouseEvent
/*
Summary

Intializes the value of a mouse event once it's been created (normally using document.createEvent method).

Syntax

event.initMouseEvent(
    type, 
    canBubble, 
    cancelable, 
    view, 
    detail, 
    screenX, 
    screenY, 
    clientX, 
    clientY, 
    ctrlKey, 
    altKey, 
    shiftKey, 
    metaKey, 
    button, 
    relatedTarget);

type 
the string to set the event's type to. Possible types for mouse events include: click, mousedown, mouseup, mouseover, mousemove, mouseout.
canBubble 
whether or not the event can bubble. Sets the value of event.bubbles.
cancelable 
whether or not the event's default action can be prevented. Sets the value of event.cancelable.
view 
the Event's AbstractView. You should pass the window object here. Sets the value of event.view.
detail 
the Event's mouse click count. Sets the value of event.detail.
screenX 
the Event's screen x coordinate. Sets the value of event.screenX.
screenY 
the Event's screen y coordinate. Sets the value of event.screenY.
clientX 
the Event's client x coordinate. Sets the value of event.clientX.
clientY 
the Event's client y coordinate. Sets the value of event.clientY.
ctrlKey 
whether or not control key was depressed during the Event. Sets the value of event.ctrlKey.
altKey 
whether or not alt key was depressed during the Event. Sets the value of event.altKey.
shiftKey 
whether or not shift key was depressed during the Event. Sets the value of event.shiftKey.
metaKey 
whether or not meta key was depressed during the Event. Sets the value of event.metaKey.
button 
the Event's mouse event.button.
relatedTarget 
the Event's related EventTarget. Only used with some event types (e.g. mouseover and mouseout). In other cases, pass null.
*/

//initTouchEvent
/*
initTouchEvent
Initializes a newly created TouchEvent object.

void initTouchEvent (
    in DOMString type, 
    in boolean canBubble, 
    in boolean cancelable, 
    in DOMWindow view, 
    in long detail, 
    in long screenX, 
    in long screenY, 
    in long clientX, 
    in long clientY, 
    in boolean ctrlKey, 
    in boolean altKey, 
    in boolean shiftKey, 
    in boolean metaKey, 
    in TouchList touches, 
    in TouchList targetTouches, 
    in TouchList changedTouches, 
    in float scale, 
    in float rotation);

Parameters
type
The type of event that occurred.
canBubble
Indicates whether an event can bubble. If true, the event can bubble; otherwise, it cannot.
cancelable
Indicates whether an event can have its default action prevented. If true, the default action can be prevented; otherwise, it cannot.
view
The view (DOM window) in which the event occurred.
detail
Specifies some detail information about the event depending on the type of event.
screenX
The x-coordinate of the event’s location in screen coordinates.
screenY
The y-coordinate of the event’s location in screen coordinates.
clientX
The x-coordinate of the event’s location relative to the window’s viewport.
clientY
The y-coordinate of the event’s location relative to the window’s viewport.
ctrlKey
If true, the control key is pressed; otherwise, it is not.
altKey
If true, the alt key is pressed; otherwise, it is not.
shiftKey
If true, the shift key is pressed; otherwise, it is not.
metaKey
If true, the meta key is pressed; otherwise, it is not.
touches
A collection of Touch objects representing all touches associated with this event.
targetTouches
A collection of Touch objects representing all touches associated with this target.
changedTouches
A collection of Touch objects representing all touches that changed in this event.
scale
The distance between two fingers since the start of an event as a multiplier of the initial distance. The initial value is 1.0. If less than 1.0, the gesture is pinch close (to zoom out). If greater than 1.0, the gesture is pinch open (to zoom in).
rotation
The delta rotation since the start of an event, in degrees, where clockwise is positive and counter-clockwise is negative. The initial value is 0.0.
Discussion
Use this method to programmatically create a TouchEvent object.

Availability
Available in iOS 2.0 and later.
*/

function DOMMouseScrollHandler(self, del){
  
  //DOMMouseScroll
  
  //TODO ?
  function handler(evt) {

    //TODO ? change evt data 
    //
    //
    
    var val = -e.detail * 3 * 12;
    evt.wheelDelta = val;

    if(evt.shiftKey){
      evt.wheelDeltaX = val;
      evt.wheelDeltaY = 0;
    }
    else{
      evt.wheelDeltaX = 0;
      evt.wheelDeltaY = val;
    }

    var returnValue = del.emit(evt);
    if (returnValue === false) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    evt._return = returnValue;
  }

  event.addListener(self.dom, 'DOMMouseScroll', handler);
  self.events.push({ name: 'DOMMouseScroll', handler: handler });
}

var custom_mouse_events = {
  click: 'click',
  dblclick: 'dblclick',
  tripleclick: 'tripleclick',
  quadclick: 'quadclick',
  longpress: 'longpress',
};

function get_delegate(self, type) {

  var on = 'on' + type;
  var del = self[on];
  
  if (del){
    return del;
  }

  self[on] = del = new Delegate(self, type);
  if(!self.events){
    self.events = [];
  }
  
  type = EVENT[type] || type;
  
  if(type == 'DOMMouseScroll'){
    DOMMouseScrollHandler(self, del);
    return del;
  }
  
  var dom = self.dom;
  
  if('on' + type in dom || type in custom_mouse_events){
    
    var handler = function(evt) {
	    var returnValue = del.emit(evt);
	    if (returnValue === false) {
        evt.preventDefault();
        evt.stopPropagation();
	    }
	    evt._return = returnValue;
    };
    
    event.addListener(dom, type, handler);
    self.events.push({ name: type, handler: handler });
  }
  return del;
}

function on(self, call, types, listen, scope, name) {
  if (typeof types == 'string'){
    types = [types];
  }
  for (var i = 0, l = types.length; i < l; i++){
    get_delegate(self, types[i])[call](listen, scope, name);
  }
}

var EVENT_TYPES = [
  { name: 'ontouchstart' in global ? 'TouchEvent': 'UIEvents', 
    match: /touch|longpress/, init: 'initTouchEvent' },
  { name: 'MouseEvents', match: /mouse|click/ , init: 'initMouseEvent' },
  { name: 'UIEvents', 
    match: /load|unload|abort|error|select|resize|scroll/, init: 'initUIEvent' },
  { name: 'HTMLEvents', match: /./, init: 'initEvent' }
];

function emitDOMEvent(self, type, msg){
  
  msg = msg || {};

  var name = 'HTMLEvents';

  for(var i = 0; i < 4; i++){
    var item = EVENT_TYPES[i];
    if(item.match.test(type)){
      name = item.name;
      break;
    }
  }

  var evt = doc.createEvent(name);

  switch(name){
    case 'TouchEvent':
      evt.initTouchEvent(
        type, 
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
      break;
    case 'MouseEvents':
      evt.initMouseEvent(
        type, 
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
      break;
    case 'UIEvents':
      evt.initUIEvent(type, false, true, doc.defaultView, msg.detail || 0);
      break;
    default:
      evt.initEvent(type, true, true);
      break;
  }
  
  util.extend(evt, msg)._return = true;

  self.dom.dispatchEvent(evt);
  return evt;
}

var DOMEvent = util.class({

  /**
   * event list
   * @type {Array}
   */
  events: null,

  /*
   * 文档元素
   * @type {HTMLElement}
   */
  dom: null,

  /**
   * 添加事件监听器(函数)
   * @param {Object}   types                事件名称或者事件名称列表
   * @param {Function} listen               侦听器函数
   * @param {Object}   scope     (Optional) 重新指定侦听器函数this
   * @param {name}     name      (Optional) 侦听器别名,在删除时,可直接传入该名称
   */
  on: function(types, listen, scope, name) {
    on(this, 'on', types, listen, scope, name);
    return this;
  },

  /**
   * 添加事件监听器(函数),消息触发一次立即移除
   * @param {Object}   types                事件名称或者事件名称列表
   * @param {Function} listen               侦听器函数
   * @param {Object}   scope     (Optional) 重新指定侦听器函数this
   * @param {name}     name      (Optional) 侦听器别名,在删除时,可直接传入该名称
   */
  once: function(types, listen, scope, name) {
    on(this, 'once', types, listen, scope, name);
    return this;
  },

  /**
   * Bind an event listener (function),
   * and "on" the same processor of the method to
   * add the event trigger to receive two parameters
   * @param {Object}   types                事件名称或者事件名称列表
   * @param {Function} listen               侦听函数
   * @param {Object}   scope     (Optional) 重新指定侦听函数this
   * @param {name}     name      (Optional) 侦听器别名,在删除时,可直接传入该名称
   */
  $on: function(types, listen, scope, name) {
    on(this, '$on', types, listen, scope, name);
    return this;
  },

  /**
   * Bind an event listener (function),
   * And to listen only once and immediately remove
   * and "on" the same processor of the method to add the event trigger to
   * receive two parameters
   * @param {Object}   types                事件名称或者事件名称列表
   * @param {Function} listen               侦听函数
   * @param {Object}   scope     (Optional) 重新指定侦听函数this
   * @param {name}     name      (Optional) 侦听器别名,在删除时,可直接传入该名称
   */
  $once: function(types, listen, scope, name) {
    on(this, '$once', types, listen, scope, name);
    return this;
  },

  /**
   * 卸载事件监听器(函数)
   * @param {String} type                事件名称
   * @param {Object} listen (Optional)
   * 可以是侦听器函数值,也可是侦听器别名,如果不传入参数卸载所有侦听器
   * @param {Object} scope  (Optional) scope
   */
  off: function(type, listen, scope) {
    var del = this['on' + type];
    if (del)
      del.unon(listen, scope);
    return this;
  },
  
  unon: function(type, listen, scope){
    return this.off(type, listen, scope);
  },

  /**
   * 发射事件
   * @method emit
   * @param  {Object} type      事件名称
   * @param  {Object} msg       要发送的消息
   * @return {Object}
   */
  emit: function(type, msg) {

    type = EVENT[type] || type;
    
    if ('on' + type in this.dom || type in custom_mouse_events) {
      return emitDOMEvent(this, type, msg)._return;
    }
    var del = this['on' + type];
    return del ? del.emit(msg) : true;
  }
});

exports.DOMEvent = DOMEvent;
exports.CSS_PREFIX = CSS_PREFIX;

});