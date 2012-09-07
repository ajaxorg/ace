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
 *      Garen J. Torikian <gjtorikian AT gmail DOT com>
 *      Alexander Hanhikoski <https://github.com/alexhanh>
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
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

// var JavaScriptHighlightRules = require("ace/mode/javascript_highlight_rules").JavaScriptHighlightRules;
// var CssHighlightRules = require("ace/mode/css_highlight_rules").CssHighlightRules;

var JadeHighlightRules = function() {

    this.$rules = {
      start: [
        {
          token : ["keyword.control.import.include.jade"],
          regex : "(?:^\\s*\\b)(include)(?:\\b)"
        },
        {
          token : "keyword.other.doctype.jade",
          regex : "^(?:!!!)(?:\\s*[a-zA-Z0-9-_]+)?"
        },
        {
          token : "comment",
          regex : "\\/\\/.*$"
        },
        // match stuff like: mixin dialog-title-desc(title, desc)
        {
          token : ["storage.type.function.jade", "text", "entity.name.function.jade", "punctuation.definition.parameters.begin.jade", "variable.parameter.function.jade", "punctuation.definition.parameters.end.jade"],
          regex : "(mixin)( )([\\w\\-]+)\\s*(\\()(.*?)(\\))"
        },   
        // match stuff like: mixin dialog-title-desc
        {
          token : ["storage.type.function.jade", "text", "entity.name.function.jade"],
          regex : "(mixin)( )(\\w\\-]+)"
        },  
        // Jade's iteration: 'each foo in foos'
        {
          token : ["keyword", "text", "variable", "text", "keyword", "text", "variable"],
          regex : "(each|for)(\\s+)([\\w-]+)(\\s+)(in)(\\s+)([\\w-]+)"
        }, 
        // Jade's iteration: 'each foo, bar in foos'
        {
          token : ["keyword", "text", "variable", "text", "variable", "text", "keyword", "text", "variable"],
          regex : "(each|for)(\\s+)([\\w-]+)(\\s*,\\s*)([\\w-]+)(\\s+)(in)(\\s+)([\\w-]+)"
        }, 
        {
          token : "string.interpolated.jade",
          regex : "[#!]\\{[^\\}]+\\}"
        },
        {
          token : ["text", "meta.tag.any.jade", "meta.tag.any.jade"],
          regex : "(^\\s*)(?:(([\w]+))|(?=\.|#))"
        },
        {
          token : "text",
          regex : "\\|.*$"
        }
      ],
      parentheses: [ 
        {
          token : "meta.tag.attribute.class.jade",
          regex : "\\.[\\w-]+<"
        }, 
        {
          token : "meta.tag.attribute.id.jade",
          regex : "#[\\w-]+<"
        },
        {
          token : "text",
          regex : "$",
          next : "start"
        }
      ]
    }

    // this.embedRules(JavaScriptHighlightRules, "js-", {
    //   start: [{
    //     token: "string",
    //     regex: "^$"
    //   }]
    // });
    
    // this.embedRules(CssHighlightRules, "css-", [{
    //   token: "keyword",
    //   regex: "style",
    //   next: "start"
    // }]);
};

oop.inherits(JadeHighlightRules, TextHighlightRules);

exports.JadeHighlightRules = JadeHighlightRules;
});