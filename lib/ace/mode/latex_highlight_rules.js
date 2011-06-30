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
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
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

var oop = require("pilot/oop");
var lang = require("pilot/lang");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var latexHighlightRules = function() {

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
    this.$rules = {
        "start" : [
						{
                token : "comment",                
								regex : "%.*$"
						},				
						{
								token : "constant.language.openingequation", //equations
								regex : "\\\$",
								next	: "equation"
            },
						{								
							token : "string.escaped", //escaped string
								regex : "\\\\\\w+\\s"
            },	
						{
								token : "keyword.openingCommand", //find opening command
								regex : "[\\\\]\\w*[^\\{\\s\\[]",
								next  : "command"
						},
				],
			  "command" : [
						{
                token : "constant.language.boolean", //opeing
                regex : "[\\{|\\[]",
								next	: "command"
            },
            {
                token : "constant.language", //closing with another opening
								regex : "[\\]|\\}][\\{|\\[]",
            },
            {
                token : "constant.language", //closing exit command
								regex : "[\\]|\\}]",
								next  : "start"
            },
            {
                token : "string.closing", //anything inbetween (values)
                regex : "[^\\]\\}]*"
            },
				],
				"equation":[
						{
                token : "string.inerequation",
                regex : "[^\\\\\\\$]",
            },
						{
                token : "constant.language.closingequation",
                regex : "[\\\\\\\$]",
								next  : "start"
            },
				
				]
    };
};

oop.inherits(latexHighlightRules, TextHighlightRules);

exports.latexHighlightRules = latexHighlightRules;
});

