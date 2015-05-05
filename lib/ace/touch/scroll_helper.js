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
 
/*!
 * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
 
define(function(require, exports, module) {
'use strict';

var util = require('./util');
var cubic_bezier = require('./cubic_bezier');
var element = require('./element');

//
var doc = document;
var html = $$(doc.documentElement);
var math = Math;
var transform = element.parseCssName('transform');
var easeInOut = new cubic_bezier.CubicBezier(0.3, 0.3, 0.3, 1);

var nextFrame = (function() {
  return global.requestAnimationFrame ||
	global.webkitRequestAnimationFrame ||
	global.mozRequestAnimationFrame ||
	global.oRequestAnimationFrame ||
	global.msRequestAnimationFrame ||
	function(callback) { return setTimeout(callback, 1000 / 60); };
})();
var cancelFrame = (function () {
	return global.cancelRequestAnimationFrame ||
		global.webkitCancelAnimationFrame ||
		global.webkitCancelRequestAnimationFrame ||
		global.mozCancelRequestAnimationFrame ||
		global.oCancelRequestAnimationFrame ||
		global.msCancelRequestAnimationFrame ||
		clearTimeout;
})();

function unBindEvent(self){
	self.off('touchmove', move);
	self.off('touchend', end);
	self.off('touchcancel', unBindEvent);
	self.off('longpress', unBindEvent);
}

function momentum(self, dist, time, maxDistUpper, maxDistLower, size) {
  var deceleration = 0.001 * self.friction,
	speed = math.abs(dist) / time,
	newDist = (speed * speed) / (2 * deceleration),
	newTime = 0, outsideDist = 0;

	// Proportinally reduce speed if we are outside of the boundaries
	if (dist > 0 && newDist > maxDistUpper) {
		outsideDist = size / (6 / (newDist / speed * deceleration));
		maxDistUpper = maxDistUpper + outsideDist;
		speed = speed * maxDistUpper / newDist;
		newDist = maxDistUpper;
	} 
  else if (dist < 0 && newDist > maxDistLower) {
		outsideDist = size / (6 / (newDist / speed * deceleration));
		maxDistLower = maxDistLower + outsideDist;
		speed = speed * maxDistLower / newDist;
		newDist = maxDistLower;
	}

	newDist = newDist * (dist < 0 ? -1 : 1);
	newTime = speed / deceleration;

	return { dist: newDist, time: math.round(newTime) };
}

function getOffset(self, el) {
  
  var left = -el.offsetLeft,
	top = -el.offsetTop;
	
  while ((el = el.offsetParent)) {
		left -= el.offsetLeft;
		top -= el.offsetTop;
	}
	
	return { left: left, top: top };
}

function hScrollbar(self) {
    
  var atts = self.mAtts;
  var wrapper = atts.hScrollbarWrapper;

  if (!atts.hScrollbar) {
  	if (wrapper) {
      wrapper.remove();
      atts.hScrollbarWrapper = null;
      atts.hScrollbarIndicator = null;
  	}
  	return;
  }

  var bar = atts.hScrollbarIndicator;

	if (!wrapper) {
		// Create the scrollbar wrapper
		wrapper = $$({
		  style:{
        'position' : 'absolute',
        'z-index'  : '100',
        'height'   : '7px',
        'bottom'   : '1px',
        'left'     : '2px',
        'right'    : atts.vScrollbar ? '7px' : '2px',
      
        //'transform-style': 'preserve-3d',
        'pointer-events': 'none',
        'transition-property': 'opacity',
        'transition-duration': '350ms',
        'overflow': 'hidden',
        'opacity': 0
		  }
		});
		
    self.append(wrapper);
    atts.hScrollbarWrapper = wrapper;

		// Create the scrollbar indicator
		bar = $$({
		  
      style: {
        'position': 'absolute',
        'z-index' : '100', 
        'background': 'rgba(0,0,0,0.5)',
        'border': '1px solid rgba(255,255,255,0.3)',
        'background-clip': 'padding-box',
        'box-sizing': 'border-box',
        'border-radius': '4px',
        'height': '100%',
        //'transform-style': 'preserve-3d',
        //'backface-visibility': 'hidden',
        'pointer-events': 'none',
        'transform': 'translate(0,0)'
      }
		});
    
    bar.appendTo(wrapper);
    atts.hScrollbarIndicator = bar;
	}

	var hScrollbarSize = wrapper.dom.clientWidth;

	atts.hScrollbarIndicatorSize = 
    math.max(math.round(math.pow(hScrollbarSize, 2) / atts.scrollerW), 8);

	atts.hScrollbarMaxScroll = hScrollbarSize - atts.hScrollbarIndicatorSize;
	atts.hScrollbarProp = atts.hScrollbarMaxScroll / atts.maxScrollX;
	// Reset position
	hScrollbarPos(self);
}

function vScrollbar(self) {
    
  var atts = self.mAtts;
  var wrapper = atts.vScrollbarWrapper;

  if (!atts.vScrollbar) {
  	if (wrapper) {
      wrapper.remove();
      atts.vScrollbarWrapper = null;
      atts.vScrollbarIndicator = null;
  	}
  	return;
  }

  var bar = atts.vScrollbarIndicator;

	if (!wrapper) {
	  
		// Create the scrollbar wrapper
		wrapper = $$({
		  style: {
        'position' : 'absolute',
        'z-index'  : '100',
        'width' : '7px',
        'top' : '2px',
        'right' : '1px',
        'bottom' : atts.hScrollbar ? '7px' : '2px',
        //'transform-style': 'preserve-3d',
        'pointer-events': 'none',
        'transition-property': 'opacity',
        'transition-duration': '350ms',
        'overflow': 'hidden',
        'opacity': 0
      }
		});

    self.append(wrapper);
    atts.vScrollbarWrapper = wrapper;

		// Create the scrollbar indicator
		bar = $$({
		 style: {
        'position': 'absolute',
        'z-index' : '100', 
        'background': 'rgba(0,0,0,0.5)',
        'border': '1px solid rgba(255,255,255,0.3)',
        'background-clip': 'padding-box',
        'box-sizing': 'border-box',
        'border-radius': '4px',
        'width': '100%',
        //'transform-style': 'preserve-3d', 
        //'backface-visibility': 'hidden',
        'pointer-events': 'none',
        'transform': 'translate(0,0)'
      }
		});

    bar.appendTo(wrapper);
    atts.vScrollbarIndicator = bar;
	}
	
	var vScrollbarSize = wrapper.dom.clientHeight;

	atts.vScrollbarIndicatorSize = 
    math.max(math.round(math.pow(vScrollbarSize, 2) / atts.scrollerH), 8);
  
	atts.vScrollbarMaxScroll = vScrollbarSize - atts.vScrollbarIndicatorSize;
	atts.vScrollbarProp = atts.vScrollbarMaxScroll / atts.maxScrollY;
	// Reset position
	vScrollbarPos(self);
}

function hScrollbarPos(self) {
  
  var atts = self.mAtts;
  
  if (!atts.hScrollbar) 
    return;
  
  var bar = atts.hScrollbarIndicator;
  var pos = atts.x * atts.hScrollbarProp;
  var size = atts.hScrollbarIndicatorSize;

	if (pos < 0) {
	  
		size = atts.hScrollbarIndicatorSize + math.round(pos * 3);
		
		if (size < 8)
      size = 8;
		pos = 0;
	}
  else if (pos > atts.hScrollbarMaxScroll) {

		size = atts.hScrollbarIndicatorSize - math.round((pos - atts.hScrollbarMaxScroll) * 3);
      
		if (size < 8) {
      size = 8;
		}
		pos = atts.hScrollbarMaxScroll + atts.hScrollbarIndicatorSize - size;
	}
	
  atts.hScrollbarWrapper.style = { 'transition-delay': '0', 'opacity': '1' };
  bar.style = {
    width: size + 'px',
    transform: 'translate(' + pos + 'px,0)'
  }; 
}

function vScrollbarPos(self) {
    
  var atts = self.mAtts;
  
  if (!atts.vScrollbar)
    return;
  
  var bar = atts.vScrollbarIndicator;
  var pos = atts.y * atts.vScrollbarProp;
  var size = atts.vScrollbarIndicatorSize;

	if (pos < 0) {
	  
		size = atts.vScrollbarIndicatorSize + math.round(pos * 3);
		
		if (size < 8)
      size = 8;
		pos = 0;
	}
  else if (pos > atts.vScrollbarMaxScroll) {

		size = atts.vScrollbarIndicatorSize - math.round((pos - atts.vScrollbarMaxScroll) * 3);
      
		if (size < 8) {
      size = 8;
		}
		pos = atts.vScrollbarMaxScroll + atts.vScrollbarIndicatorSize - size;
	}
	
  atts.vScrollbarWrapper.style = { 'transition-delay': '0', 'opacity': '1' };
  bar.style = {
    height: size + 'px',
    transform: 'translate(0,' + pos + 'px)'
  }; 
}

function setPos(self, x, y){
  
  var atts = self.mAtts;
  
  x = atts.hScroll ? x : 0;
  y = atts.vScroll ? y : 0;
  
  // 发送消息到 ace editor
  var mContentTranslateX = x;
  var mContentTranslateY = y;
  var mGutterTranslateY = y;
  
  if(y > 0){
    self.mSession.setScrollTop(0);
  }
  else if(y < atts.maxScrollY){
    mGutterTranslateY = mContentTranslateY = y - atts.maxScrollY;
    self.mSession.setScrollTop(-atts.maxScrollY);
  }
  else {
    mGutterTranslateY = mContentTranslateY = 0;
    self.mSession.setScrollTop(-y);
  }
  
  if(x > 0){
    self.mSession.setScrollLeft(0);
  }
  else if(x < atts.maxScrollX){
    mContentTranslateX = x - atts.maxScrollX;
    self.mSession.setScrollLeft(-atts.maxScrollX);
  }
  else{
    mContentTranslateX = 0;
    self.mSession.setScrollLeft(-x);
  }
  
  self.mContentEl.css('transform', 
    'translate(' + mContentTranslateX + 'px,' + mContentTranslateY + 'px)');
  self.mGutterEl.css('transform', 'translate(0px,' + mGutterTranslateY + 'px)');
  
  atts.x = x;
  atts.y = y;
  
  self.mHost._signal('touchscroll');
  
	hScrollbarPos(self);
	vScrollbarPos(self);
}

function resetData(self, x, y){

  var atts = self.mAtts;
  
  var maxScrollX = atts.wrapperW - atts.scrollerW;
  var maxScrollY = atts.wrapperH - atts.scrollerH;

  var resetX = x >= 0 ? 0 : x < maxScrollX ? maxScrollX : x;
	var resetY = y >= 0 ? 0 : y < maxScrollY ? maxScrollY : y;

  return { 
    x: math.round(resetX), 
    y: math.round(resetY), 
    maxScrollX: maxScrollX,
    maxScrollY: maxScrollY,
  };
}

function startAni(self) {
  
  var atts = self.mAtts;
  
  if (atts.animating) 
    return;
  
  var startX = atts.x; 
  var startY = atts.y;
	var startTime = Date.now();
	var step;
  var y;
  
	if (!atts.steps.length) {
		resetPos(self, 300, 'ease-in-out');
		return;
	}
  
	step = atts.steps.shift();
  atts.curstep = step;
	
	if (step.x == startX && step.y == startY) 
    step.time = 0;
  
	atts.animating = true;
  
  function nextFrameBack(){
    
    var now = Date.now();
		var newX;
		var newY;
  
  	if (now >= startTime + step.time) {
    
  		setPos(self, step.x, step.y);
  		atts.animating = false;
      atts.curstep = null;
      
  		startAni(self);
  		return;
  	}
    
    if(step.curve == 'ease-in-out'){ //ease-in
      y = easeInOut.solve((now - startTime) / step.time, 0.01);
    }
    else{ //ease-out
      now = (now - startTime) / step.time - 1;
      y = math.sqrt(1 - now * now);
    }
    
  	newX = (step.x - startX) * y + startX;
  	newY = (step.y - startY) * y + startY;
  	setPos(self, newX, newY);
    
  	if (atts.animating)
      atts.aniTime = nextFrame(nextFrameBack);
  }
  
  nextFrameBack();
}

function scrollTo(self, x, y, time, curve){

  var steps = x, i, l;
  var atts = self.mAtts;

  stopScroll(self);

	if (!steps.length) {
    steps = [{ x: x, y: y, time: time, curve: curve }];
	}

	for (i=0, l = steps.length; i < l; i++) {
    var step = steps[i];

    step.time = step.time || 0;
    step.curve = step.curve || 'ease-out';
    atts.steps.push(step);
	}
  
	startAni(self);
}

function stopScroll(self) {
    
  var atts = self.mAtts;

  if(atts.animating){
    
    cancelFrame(atts.aniTime);
    atts.steps = [];
    atts.animating = false;
  }
}

function resetPos(self, time, curve) {

  var atts = self.mAtts;
  var data = resetData(self, atts.x, atts.y);
  var catchX = self.catchX;
  var catchY = self.catchY;
  
  //捕获位置
  var x = math.round(data.x / catchX) * catchX;
  if(x < data.maxScrollX){
    x += catchX;
  }
  var y = math.round(data.y / catchY) * catchY;
  if(y < data.maxScrollY){
    y += catchY;
  }
    
	if (x == atts.x && y == atts.y) {
    
    var style = { 'transition-delay': '50ms', 'opacity': '0' };

		if (atts.hScrollbar) {
      atts.hScrollbarWrapper.style = style;
		}

		if (atts.vScrollbar) {
      atts.vScrollbarWrapper.style = style;
		}

		return;
	}

	scrollTo(self, x, y, time, curve);
}

function refresh(self) {
  
  var offset;
  var atts = self.mAtts;
  var config = self.mConfig;
  
	var wrapperW = math.min(self.dom.clientWidth, config.width) || 1;
	var wrapperH = config.height || 1;
  
	var scrollerW = config.width;
	var scrollerH = config.maxHeight;
	
	if(atts.wrapperW == wrapperW && 
	  atts.wrapperH == wrapperH &&
	  atts.scrollerW == scrollerW &&
	  atts.scrollerH == scrollerH){
    return;
	}
	
	atts.wrapperW = wrapperW;
	atts.wrapperH = wrapperH;
	atts.scrollerW = scrollerW;
	atts.scrollerH = scrollerH;
	
	atts.maxScrollX = atts.wrapperW - atts.scrollerW;
	atts.maxScrollY = atts.wrapperH - atts.scrollerH;
	atts.dirX = 0;
	atts.dirY = 0;
  
	atts.hScroll = atts.maxScrollX < 0;
	atts.vScroll = (!self.bounceLock && !atts.hScroll || atts.scrollerH > atts.wrapperH);

	atts.hScrollbar = atts.hScroll && self.hScrollbar;
	atts.vScrollbar = 
    atts.vScroll && self.vScrollbar && atts.scrollerH > atts.wrapperH;

	offset = getOffset(self, self.dom);
	atts.wrapperOffsetLeft = -offset.left;
	atts.wrapperOffsetTop = -offset.top;
	
	// Prepare the scrollbars
  hScrollbar(self);
  vScrollbar(self);
  
  if(!atts.animating){
    resetPos(self, 300);
  }
}

function start(self, e) {
  
  stopScroll(self); //停止动画
  
  if(!self.mSession || e.data.touches.length > 1){
    resetPos(self, 200);
    unBindEvent(self);
    return;
  }
  
  var atts = self.mAtts;
  var	point = e.data.touches[0];
  
  atts.x = -self.mSession.getScrollLeft();
  atts.y = -self.mSession.getScrollTop();
  
	atts.distX = 0;
	atts.distY = 0;
	atts.absDistX = 0;
	atts.absDistY = 0;
	atts.dirX = 0;
	atts.dirY = 0;

	atts.startX = atts.x;
	atts.startY = atts.y;
	atts.pointX = point.pageX;
	atts.pointY = point.pageY;
  
	atts.startTime = e.data.timeStamp || Date.now();

  //绑定事件
  self.$on('touchmove', move);
  self.$on('touchend', end);
  self.$on('touchcancel', unBindEvent);
  self.$on('longpress', unBindEvent);
}

function move(self, e) {
  
  e.data.preventDefault();
  
	var atts = self.mAtts;
	var	point = e.data.touches[0];
	var deltaX = point.pageX - atts.pointX;
	var deltaY = point.pageY - atts.pointY;
	var newX = atts.x + deltaX;
	var newY = atts.y + deltaY;
	var timestamp = e.data.timeStamp || Date.now();
  
	atts.pointX = point.pageX;
	atts.pointY = point.pageY;
  
	// Slow down if outside of the boundaries
	if (newX > 0 || newX < atts.maxScrollX) {
		newX = 
      self.bounce ? 
      atts.x + (deltaX / 2) : 
      newX >= 0 || atts.maxScrollX >= 0 ? 0 : atts.maxScrollX;
	}
	if (newY > 0 || newY < atts.maxScrollY) {
		newY =
      self.bounce ? 
      atts.y + (deltaY / 2) : 
      newY >= 0 || atts.maxScrollY >= 0 ? 0 : atts.maxScrollY;
	}
  
	atts.distX += deltaX;
	atts.distY += deltaY;
	atts.absDistX = math.abs(atts.distX);
	atts.absDistY = math.abs(atts.distY);

	if (atts.absDistX < 6 && atts.absDistY < 6) {
		return;
	}
  
	// Lock direction
	if (self.lockDirection) {
    
    if(atts.lockY){
		  newY = atts.y;
	    deltaY = 0;
    }
    else if(atts.lockX){
  		newX = atts.x;
  	  deltaX = 0;       
    }
    else if (atts.absDistX > atts.absDistY + 5) {
    	newY = atts.y;
    	deltaY = 0;
      if(self.lockDirection == 2){
        atts.lockY = true;
      }
    }
    else if (atts.absDistY > atts.absDistX + 5) {
    	newX = atts.x;
    	deltaX = 0;
      if(self.lockDirection == 2){
        atts.lockX = true;
      }
		}
	}
  
	atts.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
	atts.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

	if (timestamp - atts.startTime > 300) {
		atts.startTime = timestamp;
		atts.startX = atts.x;
		atts.startY = atts.y;
	}
    
  setPos(self, newX, newY);
}

function end(self, e) {
  
	if (e.data.touches.length !== 0)
    return;
  
  var atts = self.mAtts;
	var	point = e.data.changedTouches[0];
	var target;
  var ev;
	var momentumX = { dist: 0, time: 0 };
	var momentumY = { dist: 0, time: 0 };
	var duration = (e.data.timeStamp || Date.now()) - atts.startTime;
	var newPosX = atts.x;
	var newPosY = atts.y;
	var distX;
  var distY;
	var newDuration;
	
	unBindEvent(self);
  
  atts.lockX = false;
  atts.lockY = false;
  
    //计算惯性
	if (duration < 300) {

    if(self.momentum){
  
  		momentumX = 
        newPosX ? 
        momentum(self,
          newPosX - atts.startX, duration, -atts.x, 
          atts.scrollerW - atts.wrapperW + atts.x, 
          self.bounce ? atts.wrapperW / 2 : 0) : momentumX;
  
  		momentumY = 
        newPosY ? 
        momentum(self, 
          newPosY - atts.startY, duration, -atts.y, 
          atts.scrollerH - atts.wrapperH + atts.y, 
          self.bounce ? atts.wrapperH / 2 : 0) : momentumY;
  
  		newPosX = atts.x + momentumX.dist;
  		newPosY = atts.y + momentumY.dist;
  
  		if ((atts.x > 0 && newPosX > 0) || 
        (atts.x < atts.maxScrollX && newPosX < atts.maxScrollX)){
        momentumX = { dist: 0, time: 0 };
      }

  		if ((atts.y > 0 && newPosY > 0) || 
        (atts.y < atts.maxScrollY && newPosY < atts.maxScrollY)) {
          momentumY = { dist: 0, time: 0 };
      }
    }
    
    //捕获位置   
    newPosX = math.round(newPosX);
    newPosY = math.round(newPosY);
    
    var catchX = self.catchX;
    var catchY = self.catchY;
    var modX = newPosX % catchX;
    var modY = newPosY % catchY;

    if(newPosX < 0 && newPosX > atts.maxScrollX && modX !== 0){

      if(atts.x - atts.startX < 0){
        distX = catchX + modX;
      }
      else{
        distX = modX;
      }
      newPosX -= distX;
      momentumX.time = 
      math.max(momentumX.time, math.min(math.abs(distX) * 10, 300));
    }

    if(newPosY < 0 && newPosY > atts.maxScrollY && modY !== 0){
        
      if(atts.y - atts.startY < 0){
        distY = catchY + modY;
      }
      else{
        distY = modY;
      }
      newPosY -= distY;
      momentumY.time = 
      math.max(momentumY.time, math.min(math.abs(distY) * 10, 300));
    }
	}

  //****************************************************************

	if (momentumX.time || momentumY.time) {
		newDuration = math.max(math.max(momentumX.time, momentumY.time), 10);
		scrollTo(self, newPosX, newPosY, newDuration);
		return;
	}
	
	resetPos(self, 200);
}

var TouchScrollHelper = util.class(element.Element, {
  
  //public:
  /**
   * 滑动摩擦力
   * @type {Number}
   */
  friction: 1,
  
  /**
   * X轴捕捉尺寸,为0时自动为视口宽度
   * @type {Number}
   */
  get catchX(){
    return this.mAtts.catchX || this.dom.clientWidth;
  },
  
  /**
   * Y轴捕捉尺寸,为0时自动为视口高度
   * @type {Number}
   */
  get catchY(){
    return this.mAtts.catchY || this.dom.clientHeight;
  },
  
  set catchX(val){
    this.mAtts.catchX = val;
  },
  
  set catchY(val){
    this.mAtts.catchY = val;
  },
  
  /**
   * 是否使用回弹
   * @type {Boolean}
   */
	bounce: true,
  
  /**
   * 是否锁定回弹
   * @type {Boolean}
   */
	bounceLock: true,
  
  /**
   * 是否使用惯性
   * @type {Boolean}
   */
  momentum: true,
  
  /**
   * 是否滚动锁定方向 0|1|2
   * 0 不锁定方向
   * 1 锁定方向
   * 2 完全锁定方向
   * @type {Number}
   */
	lockDirection: 1,
  
  /**
   * 是否显示水平滚动条
   * @type {Boolean}
   */
	hScrollbar: true,
  
  /**
   * 是否显示垂直滚动条
   * @type {Boolean}
   */
	vScrollbar: true,
	
  // private:
  mAtts: null,
	mSession: null,
	mConfig: null,
	mHost: null,
	mContentEl: null,
	mGutterEl: null,
  
  // public:
  /**
   * @constructor
   */
  constructor: function(renderer){
    
    element.Element.call(this, renderer.scroller);
    
    this.mContentEl = $$(renderer.content);
    this.mGutterEl = $$(renderer.$gutter);
    this.css('box-shadow', 'none');
    
    this.mAtts = {
      steps: [],
      x: 0,
      y: 0,
      aniTime: null,
      catchX: 1,
      catchY: 1,
    };
    
    var self = this;
    
    this.mChangeEditorHandle = function(evt){
      if(evt.editor){
        self.mHost = evt.editor;
      }
    };
    
    this.$on('touchstart', start);
  },
  
  setPadding: function(value){
    //
  },
  
  setSession: function(session){
    
    if(this.mSession === session){
      return;
    }
    
    if(this.mSession){
      this.mSession.off('changeEditor', this.mChangeEditorHandle);
    }
    
    this.mSession = session;
    
    if(this.mSession){
      this.mAtts.x = -session.getScrollLeft();
      this.mAtts.y = -session.getScrollTop();
      this.mSession.on('changeEditor', this.mChangeEditorHandle);
    }
  },
  
  update: function(config){
    this.mConfig = config;
    refresh(this);
  }
  
});

exports.TouchScrollHelper = TouchScrollHelper;

});