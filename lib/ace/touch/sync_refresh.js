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

var util = require('./util');
var Delegate = require('./delegate').Delegate;

var syncList = [];
var syncTime = 0;

function eachSyncList(time){
  
  exports.onsync.emit(time);

  syncTime = time;

	for(var i = syncList.length - 1 ;i > -1; i--){
		var item = syncList[i];
		var st = item.time - syncTime;

		if(st < 8){
			syncList.splice(i, 1);
			var self = item.self;
			self.$sync = false;
			item.cb(self, st);
		}
	}
}

if(util.env.ios){
  setInterval(function(){
    eachSyncList(Date.now());
  }, 1000 / 60);
}
else{

  var requestAnimationFrame =
      global.requestAnimationFrame ||
      global.oRequestAnimationFrame ||
      global.msRequestAnimationFrame ||
      global.mozRequestAnimationFrame ||
      global.webkitRequestAnimationFrame;

  var mat = navigator.userAgent.match(/(Android|Adr) (\d)/);
	if(mat && mat[2] == 4){

		//修复 Android 4.x 触控后 css transform 屬性过渡动画失灵 BUG
		var num = 0;
		var div = document.createElement('div');
		document.body.appendChild(div);
		div.style.top = '-100px';
		div.style.position = 'absolute';
		div.style.fontSize = '1px';
        
    if(requestAnimationFrame){
        
      var requestFn = function(evt){
        requestAnimationFrame(requestFn);
        div.innerHTML = num++;
        eachSyncList(evt);
      };
      requestAnimationFrame(requestFn);
    }
    else{
      setInterval(function(){
        div.innerHTML = num++;
        eachSyncList(Date.now());
      }, 1000 / 60);
    }
	}
	else{
    if(requestAnimationFrame){
      
      var requestFn = function(evt){
        requestAnimationFrame(requestFn);
        eachSyncList(evt);
      };
      requestAnimationFrame(requestFn);
    }
    else{
      setInterval(function(){
        eachSyncList(Date.now());
      }, 1000 / 60);
    }
	}
}

exports.onsync = new Delegate(exports, 'sync');

/**
 * 延时同步屏幕
 * @param {Function} cb
 * @param {Object}   self
 * @param {Number}   time
 */
exports.delay = function(cb, self, time){
	self.$sync = true;
	syncList.push({ self: self, cb: cb, time: syncTime + time });
};

/**
 * 清除屏幕同步
 * @param {Object} self
 */
exports.clear = function(self){
	if(self.$sync){
		for(var i = syncList.length - 1 ;i > -1; i--){
			var item = syncList[i];
			if(item.self === self){
				item.$sync = false;
				syncList.splice(i, 1);
				return;
			}
		}
	}
};

});