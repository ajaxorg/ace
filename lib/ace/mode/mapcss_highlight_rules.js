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

var oop = require("pilot/oop");
var lang = require("pilot/lang");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var MapcssHighlightRules = function() {

	var properties = lang.arrayToMap( (function () {

	    var browserPrefix = ("-x-kot-|-x-mapnik-").split("|");

        var prefixProperties = ("icon|text|font").split("|");

        var properties = ("antialiasing|fill-color|fill-opacity|fill-image|width|color|opacity|dashes|linecap|linejoin|casing-width|casing-color|casing-opacity|casing-dashes|casing-linecap|casing-linejoin|extrude|extrude-edge-color|extrude-edge-opacity|extrude-face-opacity|extrude-face-color|icon-image|icon-width|icon-height|icon-opacity|font-family|font-size|font-weight|font-style|font-variant|text-decoration|text-transform|text-color|text-position|text-offset|text-opacity|text-allow-overlap|max-width|text-halo-color|text-halo-radius|sheild-color|sheild-opacity|sheild-frame-color|sheild-frame-width|sheild-casing-color|sheild-casing-width|sheild-text|sheild-image|sheild-shape|text|image|layer|min-distance|z-index").split("|");

        //The return array
        var ret = [];

        //All prefixProperties will get the browserPrefix in
        //the begning by join the prefixProperties array with the value of browserPrefix
        for (var i=0, ln=browserPrefix.length; i<ln; i++) {
        	Array.prototype.push.apply(
        		ret,
        		(( browserPrefix[i] + prefixProperties.join("|" + browserPrefix[i]) ).split("|"))
        	);
        }

        //Add also prefixProperties and properties without any browser prefix
        Array.prototype.push.apply(ret, prefixProperties);
        Array.prototype.push.apply(ret, properties);

		return ret;

	})() );



    var functions = lang.arrayToMap(
        ("eval|rgb|rgba|url").split("|")
    );

    var constants = lang.arrayToMap(
        ("bottom|top|true|false|text|none|full|round|square|miter|bevel|bold|italic|normal|small-caps|underline|uppercase|line|center|rounded|rectangular").split("|")
    );

    var colors = lang.arrayToMap(
        ("aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|" +
        "purple|red|silver|teal|white|yellow").split("|")
    );

    var keywords = lang.arrayToMap(
		("@mixin|@extend|@include|@import|@media|@debug|@warn|@if|@for|@each|@while|@else|@font-face|@-webkit-keyframes|if|and|!default|module|def|end|declare").split("|")
    )

    var tags = lang.arrayToMap(
    	("*|area|way|line|node|relation|canvas").split("|")
    );

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    var numRe = "\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))";

    function ic(str) {
        var re = [];
        var chars = str.split("");
        for (var i=0; i<chars.length; i++) {
            re.push(
                "[",
                chars[i].toLowerCase(),
                chars[i].toUpperCase(),
                "]"
            );
        }
        return re.join("");
    }


    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "\\/\\/.*$"
            },
            {
                token : "comment", // multi line comment
                regex : "\\/\\*",
                next : "comment"
            }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // multi line string start
                regex : '["].*\\\\$',
                next : "qqstring"
            }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "string", // multi line string start
                regex : "['].*\\\\$",
                next : "qstring"
            }, {
                token : "constant.numeric",
                regex : numRe + ic("em")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("ex")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("px")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("cm")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("mm")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("in")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("pt")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("pc")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("deg")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("rad")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("grad")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("ms")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("s")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("hz")
            }, {
                token : "constant.numeric",
                regex : numRe + ic("khz")
            }, {
                token : "constant.numeric",
                regex : numRe + "%"
            }, {
                token : "constant.numeric", // hex6 color
                regex : "#[a-fA-F0-9]{6}"
            }, {
                token : "constant.numeric", // hex3 color
                regex : "#[a-fA-F0-9]{3}"
            }, {
                token : "constant.numeric",
                regex : numRe
            }, {
                token : function(value) {
                	if (properties.hasOwnProperty(value.toLowerCase()))
                    	return "support.type";
                    if (keywords.hasOwnProperty(value))
                        return "keyword";
                    else if (constants.hasOwnProperty(value))
                        return "constant.language";
                    else if (functions.hasOwnProperty(value))
                        return "support.function";
                    else if (colors.hasOwnProperty(value.toLowerCase()))
                        return "support.constant.color";
                    else if (tags.hasOwnProperty(value.toLowerCase()))
                    	return "variable.language";
                    else
                    	return "text";
                },
                regex : "\\-?[@a-zA-Z_][@a-zA-Z0-9_\\-]*"
            }, {
                token : "variable",
                regex : "[a-zA-Z_\\-$][a-zA-Z0-9_\\-$]*\\b"
            }, {
                token: "variable.language",
                regex: "#[a-zA-Z0-9-_]+"
            }, {
                token: "constant.numeric",
                regex: "\\|z[0-9]*-?[0-9]*"
            }, {
                token: "variable.language",
                regex: "\\.[a-zA-Z0-9-_]+"
            }, {
                token: "variable.language", // subpart
                regex: "::[a-zA-Z0-9-_]+"
            }, {
                token: "constant",
                regex: "[a-zA-Z0-9-_]+"
            }, {
                token : "keyword.operator",
                regex : "<|>|<=|>=|==|!=|-|%|#|\\+|\\$|\\+|\\*"
            }, {
                token : "lparen", // [ building=yes
                regex : "[[]",
                next	: "tagselector"
            }, {
                token : "lparen",
                regex : "[[({]"
            }, {
                token : "rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "tagselector" : [
            {
                token : "keyword.operator",
                regex : "<|>|<=|>=|==|=|!=|-",
                next  : "tagselval"
            }, {
                token : "rparen", // closing comment
                regex : "[\\]]",
                next  : "start"
            }, {
                token: "keyword",
                regex: "[a-zA-Z-_]+"
            }, {
                token: "constant.numeric",
                regex: "[0-9]+"
            }, {
                token : "variable.language",
                regex : "."
            }
        ],
        "tagselval" : [
            {
                token : "rparen", // closing comment
                regex : "[\\]]",
                next : "start"
            }, {
                token : "variable.language", // comment spanning whole line
                regex : "."
            }
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : ".*?\\*\\/",
                next : "start"
            }, {
                token : "comment", // comment spanning whole line
                regex : ".+"
            }
        ],
        "qqstring" : [
            {
                token : "string",
                regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
                next : "start"
            }, {
                token : "string",
                regex : '.+'
            }
        ],
        "qstring" : [
            {
                token : "string",
                regex : "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
                next : "start"
            }, {
                token : "string",
                regex : '.+'
            }
        ]
    };

};

oop.inherits(MapcssHighlightRules, TextHighlightRules);

exports.MapcssHighlightRules = MapcssHighlightRules;

});
