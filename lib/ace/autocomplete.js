/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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

var oop = require("./lib/oop");
var EventEmitter = require("./lib/event_emitter").EventEmitter;

var Autocomplete = function(editor) {
    var self = this;
    this.editor = editor;

    var originalOnTextInput = editor.onTextInput;
    var originalSoftTabs = editor.session.getUseSoftTabs();
    
    // Create the suggest list
    this.autocompleteContainer = document.createElement('div');
    this.autocompleteContainer.className = 'ace_autocomplete';

    this.selection = this.autocompleteContainer.appendChild(document.createElement("select"));
};


(function() {
    
    oop.implement(this, EventEmitter);

    this.current = function() {
      var children = element.childNodes;
      for (var i = 0; i < children.length; i++) {
        var li = children[i];
        if(li.className == 'ace_autocomplete_selected') {
          return li;
        }
      };
    }

    this.focusNext = function() {
      var curr = current();
      curr.className = '';
      var focus = curr.nextSibling || curr.parentNode.firstChild;
      focus.className = 'ace_autocomplete_selected';
    }

    this.focusPrev = function() {
      var curr = current();
      curr.className = '';
      var focus = curr.previousSibling || curr.parentNode.lastChild;
      focus.className = 'ace_autocomplete_selected';
    }

    this.ensureFocus = function() {
      if(!current()) {
        element.firstChild.className = 'ace_autocomplete_selected';
      }
    }

    this.replace = function() {
      var Range = require('ace/range').Range;
      var range = new Range(self.row, self.column, self.row, self.column + 1000);
      // Firefox does not support innerText property, don't know about IE
      // http://blog.coderlab.us/2005/09/22/using-the-innertext-property-with-firefox/
      var selectedValue;
      if(document.all){
        selectedValue = current().innerText;
      } else{
        selectedValue = current().textContent;
      }

      editor.session.replace(range, selectedValue);
      // Deactivate asynchrounously, so that in case of ENTER - we don't reactivate immediately.
      setTimeout(function() {
        deactivate();
      }, 0);
    }

    this.deactivate = function() {
      // Hide list
      element.style.display = 'none';
      
      // Restore keyboard
      editor.session.setUseSoftTabs(originalSoftTabs);
      editor.onTextInput = originalOnTextInput;

      self.active = false;
    }
    
    // Shows the list and reassigns keys
    this.activate = function(row, column) {
      if(this.active) return;
      this.active = true;
      this.row = row;
      this.column = column;

      // Position the list
      var coords = this.editor.renderer.textToScreenCoordinates(row, column);
      this.autocompleteContainer.style.top = coords.pageY + 18 + 'px';
      this.autocompleteContainer.style.left = coords.pageX + -2 + 'px';
      this.autocompleteContainer.style.display = 'block';
    };
    
    // Sets the text the suggest should be based on.
    // afterText indicates the position where the suggest box should start.
    this.suggest = function(text) {
      var options = ["FUNK", "frunk", "blunk", "frunk", "blunk", "frunk", "blunk", "frunk", "blunk", "frunk", "blunk", "frunk", "blunk"];//matches(text);
      if (options.length == 0) {
        return deactivate();
      }

      for (var n = 0; n < options.length; n++) {
        var opt = this.selection.appendChild(document.createElement("option"));
        opt.appendChild(document.createTextNode(options[n]));
      }
      this.selection.firstChild.selected = true;
      this.selection.size = Math.min(10, options.length);

      document.body.appendChild(this.autocompleteContainer);
      //ensureFocus();
    };
}).call(Autocomplete.prototype);

exports.Autocomplete = Autocomplete;
});
