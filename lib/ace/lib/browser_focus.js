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

var oop = require("./oop");
var event = require("./event");
var EventEmitter = require("./event_emitter").EventEmitter;

/*
 * This class keeps track of the focus state of the given window.
 * Focus changes for example when the user switches a browser tab,
 * goes to the location bar or switches to another application.
 */ 
var BrowserFocus = function(win) {
    win = win || window;
    
    this.lastFocus = new Date().getTime();
    this._isFocused = true;
    
    var _self = this;

    // IE < 9 supports focusin and focusout events
    if ("onfocusin" in win.document) {
        event.addListener(win.document, "focusin", function(e) {
            _self._setFocused(true);
        });

        event.addListener(win.document, "focusout", function(e) {
            _self._setFocused(!!e.toElement);
        });
    }
    else {
        event.addListener(win, "blur", function(e) {
            _self._setFocused(false);
        });

        event.addListener(win, "focus", function(e) {
            _self._setFocused(true);
        });
    }
};

(function(){

    oop.implement(this, EventEmitter);
    
    this.isFocused = function() {
        return this._isFocused;
    };
    
    this._setFocused = function(isFocused) {
        if (this._isFocused == isFocused)
            return;
            
        if (isFocused)
            this.lastFocus = new Date().getTime();
            
        this._isFocused = isFocused;
        this._emit("changeFocus");
    };

}).call(BrowserFocus.prototype);


exports.BrowserFocus = BrowserFocus;
});
