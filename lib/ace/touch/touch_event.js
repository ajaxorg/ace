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

var event = require("./event");
var useragent = require("../lib/useragent");
var oop = require("../lib/oop");
var MouseEvent = require("../mouse/mouse_event").MouseEvent;

/*
 * Custom Ace mouse event
 */
var TouchEvent = exports.TouchEvent = function(domEvent, editor) {
    
    this.domEvent = domEvent;
    this.editor = editor;
    
    var touche = domEvent.changedTouches[0];
    
    //touche.clientX
    //touche.pageX
    
    this.x = this.clientX = touche.clientX;
    this.y = this.clientY = touche.clientY;
    
    if(domEvent.type == 'touchend'){
      this.x0 = this.x;
      this.y0 = this.y;
    }
    else{
      this.x0 = domEvent.touches[0].clientX;
      this.y0 = domEvent.touches[0].clientY;
    }

    this.$pos = null;
    this.$inSelection = null;
    
    this.propagationStopped = false;
    this.defaultPrevented = false;
};

oop.inherits(TouchEvent, MouseEvent);

(function() {  
  
    /*
     * Get the clicked mouse button
     * 
     * @return {Number} 0 for left button, 1 for middle button, 2 for right button
     */
    this.getButton = function() {
      return 0;
    };
    
    /*
     * @return {Boolean} whether the shift key was pressed when the event was emitted
     */
    this.getShiftKey = function() {
        return false;
    };
    
    this.getAccelKey = function (){
      return false;
    };
    
}).call(TouchEvent.prototype);

});
