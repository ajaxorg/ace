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

var timeoutid = 0;

event.on(global, util.env.mobile ? 'orientationchange': 'resize', function(evt){
  
  exports.onchange.emit(exports.size);
  
  if(util.env.ios){
    
    if(timeoutid){
      Function.undelay(timeoutid);
    }
    
    timeoutid = (function(){
      timeoutid = 0;
      exports.onchange.emit(exports.size); 
    }).delay(400);
  }
});

module.exports = exports = {
  
  /**
   * 
   */
  fixedScreenSizeInfo: function(width, height, orientation){
    exports.width = width;
    exports.height = height;
    exports.orientation = orientation;
    exports.onchange.emit(exports.size);
  },

  /**
   * 
   */
  cancelFixedScreenSizeInfo: function(){
    delete exports.width;
    delete exports.height;
    delete exports.orientation;
    exports.onchange.emit(exports.size);
  },
  
  /**
   * 屏幕变化事件
   * @event onscreenchange
   */
  onchange: new Delegate(null, 'change'),
  
  /**
   * 获取屏幕尺寸信息,信任屏幕宽度
   * @return {Object}
   */
  get size(){
    return {
      orientation: 'orientation' in exports ? exports.orientation : global.orientation || 0,
      width: 'width' in exports ? exports.width : global.innerWidth || 0,
      height: 'height' in exports ? exports.height : global.innerHeight || 0,
    };
  }
};

});