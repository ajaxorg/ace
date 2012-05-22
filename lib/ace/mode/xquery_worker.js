/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      William Candillon <wcandillon AT gmail DOT com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
 
define(function(require, exports, module) {
"use strict";
    
var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var xquery = require("../mode/xquery/xquery");
var Tokenizer = require("../tokenizer").Tokenizer;
var XQueryHighlightRules = require("./xquery_highlight_rules").XQueryHighlightRules;

window.addEventListener = function() {};


var XQueryWorker = exports.XQueryWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(200);
};

oop.inherits(XQueryWorker, Mirror);

(function() {
    
  this.onUpdate = function() {
    this.sender.emit("start");
    var value = this.doc.getValue();    
    var parser = xquery.getParser(value);
    var ast = parser.p_Module();
    if(parser.hasErrors()) {
		  var errors = parser.getErrors();
	    var i = 0;
      for(i in errors) {
	      var error = errors[i];
	      this.sender.emit("error", {
	        row: error.line,
          column: error.column,
	        text: error.message,
	        type: "error"
       });
      }	
    } else {
     this.sender.emit("ok");
    }
    parser.highlighter.tokenizer = new Tokenizer(new XQueryHighlightRules().getRules());
    var tokens = parser.highlighter.getTokens();
    this.sender.emit("highlight", tokens);
  };
    
}).call(XQueryWorker.prototype);

});
