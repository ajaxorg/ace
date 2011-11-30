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

var oop = require("../lib/oop");
var CssHighlightRules = require("./css_highlight_rules").CssHighlightRules;
var JavaScriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var HtmlHighlightRules = function() {

    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used
    function string(state) {
        return [{
            token : "string",
            regex : '".*?"'
        }, {
            token : "meta.tag", // multi line string start
            merge : true,
            regex : '["].*$',
            next : state + "-qqstring"
        }, {
            token : "string",
            regex : "'.*?'"
        }, {
            token : "meta.tag", // multi line string start
            merge : true,
            regex : "['].*$",
            next : state + "-qstring"
        }]
    }
    
    function multiLineString(quote, state) {
        return [{
            token : "meta.tag",
            merge : true,
            regex : ".*" + quote,
            next : state
        }, {
            token : "string",
            merge : true,
            regex : '.+'
        }]
    }
    
    function tag(states, name, nextState) {
        states[name] = [{
            token : "text",
            regex : "\\s+"
        }, {
            token : "meta.tag",
            regex : "[-_a-zA-Z0-9:]+",
            next : name + "embed-attribute-list" 
        }, {
            token: "empty",
            regex: "",
            next : name + "embed-attribute-list"
        }];

        states[name + "-qstring"] = multiLineString("'", name);
        states[name + "-qqstring"] = multiLineString("\"", name);
        
        states[name + "embed-attribute-list"] = [{
            token : "meta.tag",
            regex : ">",
            next : nextState
        }, {
            token : "meta.tag",
            regex : "="
        }, {
            token : "entity.other.attribute-name",
            regex : "[-_a-zA-Z0-9:]+"
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : "text",
            regex : "\\s+"
        }].concat(string(name));
    };

    this.$rules = {
        start : [ {
            token : "meta.tag",
            merge : true,
            regex : "<\\!\\[CDATA\\[",
            next : "cdata"
        }, {
            token : "xml_pe",
            regex : "<\\?.*?\\?>"
        }, {
            token : "comment",
            merge : true,
            regex : "<\\!--",
            next : "comment"
        }, {
            token : "meta.tag",
            regex : "<(?=\s*script)",
            next : "script"
        }, {
            token : "meta.tag",
            regex : "<(?=\s*style)",
            next : "css"
        }, {
            token : "meta.tag", // opening tag
            regex : "<\\/?",
            next : "tag"
        }, {
            token : "text",
            regex : "\\s+"
        }, {
            token : "text",
            regex : "[^<]+"
        } ],
    
        cdata : [ {
            token : "text",
            regex : "\\]\\]>",
            next : "start"
        }, {
            token : "text",
            merge : true,
            regex : "\\s+"
        }, {
            token : "text",
            merge : true,
            regex : ".+"
        } ],

        comment : [ {
            token : "comment",
            regex : ".*?-->",
            next : "start"
        }, {
            token : "comment",
            merge : true,
            regex : ".+"
        } ]
    };
    
    tag(this.$rules, "tag", "start");
    tag(this.$rules, "css", "css-start");
    tag(this.$rules, "script", "js-start");
    
    this.embedRules(JavaScriptHighlightRules, "js-", [{
        token: "meta.tag",
        regex: "\\/\\/.*(?=<\\/script>)",
        next: "tag"
    }, {
        token: "meta.tag",
        regex: "<\\/(?=script)",
        next: "tag"
    }]);
    
    this.embedRules(CssHighlightRules, "css-", [{
        token: "meta.tag",
        regex: "<\\/(?=style)",
        next: "tag"
    }]);
};

oop.inherits(HtmlHighlightRules, TextHighlightRules);

exports.HtmlHighlightRules = HtmlHighlightRules;
});
