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
var Range = require('ace/range').Range;

var Autocomplete = function(editor) {
    var self = this;
    this.$editor = editor;

    this.originalGoLineUp = editor.commands.commands.golineup.exec;
    this.originalGoLineDown = editor.commands.commands.golinedown.exec;
    this.originalIndent = editor.commands.commands.indent.exec;
    this.originalOnTextInput = editor.onTextInput;

    // Create the suggest list
    this.autocompleteContainer = document.createElement('div');
    this.autocompleteContainer.className = 'ace_autocomplete';

    this.selection = this.autocompleteContainer.appendChild(document.createElement("select"));
};


(function() {

    this.current = function() {
      var children = this.selection.childNodes;
      for (var i = 0; i < children.length; i++) {
        var li = children[i];
        if (li.className == 'ace_autocomplete_selected') {
          return li;
        }
      };
    }

    this.focusNext = function() {
      var curr = this.current();
      curr.className = '';
      var focus = curr.nextSibling || curr.parentNode.firstChild;
      focus.className = 'ace_autocomplete_selected';
      focus.selected = true;
    }

    this.focusPrev = function() {
      var curr = this.current();
      curr.className = '';
      var focus = curr.previousSibling || curr.parentNode.lastChild;
      focus.className = 'ace_autocomplete_selected';
      focus.selected = true;
    }

    this.ensureFocus = function() {
      if(!this.current()) {
        this.selection.firstChild.className = 'ace_autocomplete_selected';
      }
    }

    this.replace = function() {
        var _self = this;

        var range = new Range(this.row, this.column, this.row, this.column + 1000);

        var selectedValue;
        if (document.all) {
          selectedValue = this.current().innerText;
        } else {
          selectedValue = this.current().textContent;
        }

        this.$editor.session.replace(range, selectedValue);
        // Deactivate asynchrounously, so that in case of ENTER - we don't reactivate immediately.
        setTimeout(function() {
          _self.deactivate();
        }, 0);
    };

    this.deactivate = function() {
        this.autocompleteContainer.parentNode.removeChild(this.autocompleteContainer);

        this.$editor.commands.commands.golineup.exec = this.originalGoLineUp;
        this.$editor.commands.commands.golinedown.exec = this.originalGoLineDown;
        this.$editor.commands.commands.indent.exec = this.originalIndent;
        this.$editor.onTextInput = this.originalOnTextInput;
        
        this.active = false;
    };
    
    // Shows the list and reassigns keys
    this.activate = function(row, column) {
        if (this.active) return;

        var _self = this;

        this.active = true;
        this.row = row;
        this.column = column;

        // Position the list
        var coords = this.$editor.renderer.textToScreenCoordinates(row, column);
        this.autocompleteContainer.style.top = coords.pageY + 18 + "px";
        this.autocompleteContainer.style.left = coords.pageX + -2 + "px";
        this.autocompleteContainer.style.display = "block";

        this.$editor.commands.commands.golinedown.exec = function(env, args, request) { _self.focusNext(); };
        this.$editor.commands.commands.golineup.exec   = function(env, args, request) { _self.focusPrev(); };
        this.$editor.commands.commands.indent.exec   = function(env, args, request) { _self.replace(); };

        this.$editor.onTextInput = function(text) {
          if (text == "\n") {
            _self.replace();
          } else {
            _self.originalOnTextInput.call(_self.$editor, text);
          }
        };
    };
    
    // Sets the text the suggest should be based on.
    // afterText indicates the position where the suggest box should start.
    this.suggest = function(text) {
      var options = ["FUNK", "frunk", "blunk", "frunk", "blunk", "frunk", "blunk", "frunk", "blunk", "frunk", "blunk", "frunk", "blunk"];
      if (options.length == 0) {
        return deactivate();
      }

      for (var n = 0; n < options.length; n++) {
        var opt = this.selection.appendChild(document.createElement("option"));
        opt.appendChild(document.createTextNode(options[n]));
      }

      this.selection.firstChild.selected = true;
      this.selection.size = Math.min(5, options.length);

      document.body.appendChild(this.autocompleteContainer);
      this.ensureFocus();
    };

    this.isActive = function() {
        return this.active;
    };
    
}).call(Autocomplete.prototype);

exports.Autocomplete = Autocomplete;
});
