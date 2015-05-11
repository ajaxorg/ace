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

var util = require('./util');

var TextInputDelegate = util.class({
	focus: function(input){ },
	blur: function(input){ },
	set_can_delete: function(value){ },
});

var TouchNativeTextInput = function(parentNode, host) {
  var text = document.createElement("textarea");
  var inComposition = false;
	var isFocused = false;

  this.delegate = new TextInputDelegate();

  this.onblur = function(){
		host.onBlur({});
    isFocused = false;
  };

  this.onfocus = function(){
  	isFocused = true;
    host.onFocus({});
  };

  this.oninput = function(value){
    if (inComposition)
      return;
    sendText(value);
  };

  this.onbackspace = function(){
  	if(isFocused){
	  	if(!inComposition){
	      host.execCommand('backspace', { source: 'ace' });
	    }
  	}
  }

  this.oncomposition_start = function(value){
  	if(isFocused){
  		onCompositionStart(value);
  	}
  };

 	this.oncomposition_update = function(value){
 		if(isFocused){
 			onCompositionUpdate(value);
 		}
 	};

  this.oncomposition_end = function(value){
  	if(isFocused){
			onCompositionEnd(value);
		}
  };

  this.focus = function() {
    if(!host.$readOnly){
      if(!isFocused){
        this.delegate.focus(this);
      }
    }
  };
  this.blur = function() {
    if(isFocused){
  	 this.delegate.blur(this);
    }
  };

  this.isFocused = function() {
  	return isFocused;
  };

  this.setInputHandler = function(cb) { };
  this.getInputHandler = function() { return null; };
  
  var sendText = function(data) {
    if (data)
      host.onTextInput(data);
  };

  // COMPOSITION
  var onCompositionStart = function(value) {
    if (inComposition || !host.onCompositionStart || host.$readOnly) 
      return;
    inComposition = {};
    host.onCompositionStart();
    host.on('touchstart', onTouchCompositionEnd);

    if (!host.selection.isEmpty()) {
      host.insert("");
      host.session.markUndoGroup();
      host.selection.clearSelection();
    }

    host.session.markUndoGroup();

    onCompositionUpdate(value);
	};

  var onCompositionUpdate = function(value) {

    if (!inComposition || !host.onCompositionUpdate || host.$readOnly)
      return;

    if(value == ''){
    	return onCompositionEnd(value);
    }

    if (inComposition.lastValue === value) return;
    
    host.onCompositionUpdate(value);

		if (inComposition.lastValue) 
			host.undo();

    inComposition.lastValue = value;
    if (inComposition.lastValue) {
      var r = host.selection.getRange();
      host.insert(inComposition.lastValue);
      host.session.markUndoGroup();
      host.selection.clearSelection();
    }
  };

  function onTouchCompositionEnd(){
  	if(inComposition){
  		onCompositionEnd(inComposition.lastValue);
  		// force_end
  	}
  }

  var onCompositionEnd = function(value) {

    if (!inComposition || !host.onCompositionEnd || host.$readOnly) return;

    var c = inComposition;
    inComposition = false;

    host.onCompositionEnd();
    host.removeListener('touchstart', onTouchCompositionEnd);

    if(c.lastValue == value){
    	return;
    }

    if (c.lastValue)
      host.undo();
    sendText(value);
  };

  this.getElement = function() {
    return text;
  };
  
  this.setReadOnly = function(readOnly) {
    if(readOnly){
      this.blur();
    }
  };

  this.moveToMouse = function(e, bringToFront) {

  };
};

exports.TextInputDelegate 		= TextInputDelegate;
exports.TouchNativeTextInput 	= TouchNativeTextInput;
});
