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

define('ace/mode/liquid', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text', 'ace/tokenizer', 'ace/mode/liquid_highlight_rules', 'ace/mode/matching_brace_outdent', 'ace/range'], function(require, exports, module) {

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var LiquidHighlightRules = require("./liquid_highlight_rules").LiquidHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var Range = require("../range").Range;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new LiquidHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, TextMode);

(function() {

    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        var outdent = true;
        var outentedRows = [];
        var re = /^(\s*)#/;

        for (var i=startRow; i<= endRow; i++) {
            if (!re.test(doc.getLine(i))) {
                outdent = false;
                break;
            }
        }

        if (outdent) {
            var deleteRange = new Range(0, 0, 0, 0);
            for (var i=startRow; i<= endRow; i++)
            {
                var line = doc.getLine(i);
                var m = line.match(re);
                deleteRange.start.row = i;
                deleteRange.end.row = i;
                deleteRange.end.column = m[0].length;
                doc.replace(deleteRange, m[1]);
            }
        }
        else {
            doc.indentRows(startRow, endRow, "#");
        }
    };

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.$tokenizer.getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});

define('ace/mode/liquid_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/css_highlight_rules', 'ace/mode/javascript_highlight_rules', 'ace/lib/lang', 'ace/mode/xml_util', 'ace/mode/text_highlight_rules'], function(require, exports, module) {


var oop = require("../lib/oop");
var CssHighlightRules = require("./css_highlight_rules").CssHighlightRules;
var JavaScriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;
var lang = require("../lib/lang");
var xmlUtil = require("./xml_util");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var LiquidHighlightRules = function() {

    // see: https://developer.mozilla.org/en/Liquid/Reference/Global_Objects
    var functions = lang.arrayToMap(
      // Standard Filters
        ("date|capitalize|downcase|upcase|first|last|join|sort|map|size|escape|" +
         "escape_once|strip_html|strip_newlines|newline_to_br|replace|replace_first|" +
         "truncate|truncatewords|prepend|append|minus|plus|times|divided_by|split"
      ).split("|")
    );

    var keywords = lang.arrayToMap(
      // Standard Tags
        ("capture|endcapture|case|endcase|when|comment|endcomment|" +
        "cycle|for|endfor|in|reversed|if|endif|else|elsif|include|endinclude|unless|endunless|" +
     // Commonly used tags
        "style|text|image|widget|plugin|marker|endmarker|tablerow|endtablerow").split("|")
    );

    var builtinVariables = lang.arrayToMap(
        ['forloop']
        // ("forloop\\.(length|index|index0|rindex|rindex0|first|last)|limit|offset|range" +
        // "tablerowloop\\.(length|index|index0|rindex|rindex0|first|last|col|col0|"+
        // "col_first|col_last)").split("|")
    );

    var definitions = lang.arrayToMap(("assign").split("|"));

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
            start : [{
                token : "variable",
                regex : "{%",
                next : "liquid_start"
            }, {
                token : "variable",
                regex : "{{",
                next : "liquid_start"
            }, {
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
                regex : "<(?=\\s*script\\b)",
                next : "script"
            }, {
                token : "meta.tag",
                regex : "<(?=\\s*style\\b)",
                next : "style"
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
            } ] ,

            liquid_start : [{
                token: "variable",
                regex: "}}",
                next: "start"
            }, {
                token: "variable",
                regex: "%}",
                next: "start"
            }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "constant.numeric", // hex
                regex : "0[xX][0-9a-fA-F]+\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token : "constant.language.boolean",
                regex : "(?:true|false)\\b"
            }, {
                token : function(value) {
                    if (functions.hasOwnProperty(value))
                        return "support.function";
                    else if (keywords.hasOwnProperty(value))
                        return "keyword";
                    else if (builtinVariables.hasOwnProperty(value))
                        return "variable.language";
                    else if (definitions.hasOwnProperty(value))
                        return "keyword.definition";
                    else
                        return "identifier";
                },
                regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            }, {
                token : "keyword.operator",
                regex : "\/|\\*|\\-|\\+|=|!=|\\?\\:"
            }, {
                token : "paren.lparen",
                regex : /[\[\({]/
            }, {
                token : "paren.rparen",
                regex : /[\])}]/
            }, {
                token : "text",
                regex : "\\s+"
            }]
    };

    xmlUtil.tag(this.$rules, "tag", "start");
    xmlUtil.tag(this.$rules, "style", "css-start");
    xmlUtil.tag(this.$rules, "script", "js-start");

    this.embedRules(JavaScriptHighlightRules, "js-", [{
        token: "comment",
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
oop.inherits(LiquidHighlightRules, TextHighlightRules);

exports.LiquidHighlightRules = LiquidHighlightRules;
});

define('ace/mode/css_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/lang', 'ace/mode/text_highlight_rules'], function(require, exports, module) {


var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var CssHighlightRules = function() {

    var properties = lang.arrayToMap(
        ("animation-fill-mode|alignment-adjust|alignment-baseline|animation-delay|animation-direction|animation-duration|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|animation|appearance|azimuth|backface-visibility|background-attachment|background-break|background-clip|background-color|background-image|background-origin|background-position|background-repeat|background-size|background|baseline-shift|binding|bleed|bookmark-label|bookmark-level|bookmark-state|bookmark-target|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|border|bottom|box-align|box-decoration-break|box-direction|box-flex-group|box-flex|box-lines|box-ordinal-group|box-orient|box-pack|box-shadow|box-sizing|break-after|break-before|break-inside|caption-side|clear|clip|color-profile|color|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|content|counter-increment|counter-reset|crop|cue-after|cue-before|cue|cursor|direction|display|dominant-baseline|drop-initial-after-adjust|drop-initial-after-align|drop-initial-before-adjust|drop-initial-before-align|drop-initial-size|drop-initial-value|elevation|empty-cells|fit|fit-position|float-offset|float|font-family|font-size|font-size-adjust|font-stretch|font-style|font-variant|font-weight|font|grid-columns|grid-rows|hanging-punctuation|height|hyphenate-after|hyphenate-before|hyphenate-character|hyphenate-lines|hyphenate-resource|hyphens|icon|image-orientation|image-rendering|image-resolution|inline-box-align|left|letter-spacing|line-height|line-stacking-ruby|line-stacking-shift|line-stacking-strategy|line-stacking|list-style-image|list-style-position|list-style-type|list-style|margin-bottom|margin-left|margin-right|margin-top|margin|mark-after|mark-before|mark|marks|marquee-direction|marquee-play-count|marquee-speed|marquee-style|max-height|max-width|min-height|min-width|move-to|nav-down|nav-index|nav-left|nav-right|nav-up|opacity|orphans|outline-color|outline-offset|outline-style|outline-width|outline|overflow-style|overflow-x|overflow-y|overflow|padding-bottom|padding-left|padding-right|padding-top|padding|page-break-after|page-break-before|page-break-inside|page-policy|page|pause-after|pause-before|pause|perspective-origin|perspective|phonemes|pitch-range|pitch|play-during|position|presentation-level|punctuation-trim|quotes|rendering-intent|resize|rest-after|rest-before|rest|richness|right|rotation-point|rotation|ruby-align|ruby-overhang|ruby-position|ruby-span|size|speak-header|speak-numeral|speak-punctuation|speak|speech-rate|stress|string-set|table-layout|target-name|target-new|target-position|target|text-align-last|text-align|text-decoration|text-emphasis|text-height|text-indent|text-justify|text-outline|text-shadow|text-transform|text-wrap|top|transform-origin|transform-style|transform|transition-delay|transition-duration|transition-property|transition-timing-function|transition|unicode-bidi|vertical-align|visibility|voice-balance|voice-duration|voice-family|voice-pitch-range|voice-pitch|voice-rate|voice-stress|voice-volume|volume|white-space-collapse|white-space|widows|width|word-break|word-spacing|word-wrap|z-index").split("|")
    );

    var functions = lang.arrayToMap(
        ("rgb|rgba|url|attr|counter|counters").split("|")
    );

    var constants = lang.arrayToMap(
        ("absolute|after-edge|after|all-scroll|all|alphabetic|always|antialiased|armenian|auto|avoid-column|avoid-page|avoid|balance|baseline|before-edge|before|below|bidi-override|block-line-height|block|bold|bolder|border-box|both|bottom|box|break-all|break-word|capitalize|caps-height|caption|center|central|char|circle|cjk-ideographic|clone|close-quote|col-resize|collapse|column|consider-shifts|contain|content-box|cover|crosshair|cubic-bezier|dashed|decimal-leading-zero|decimal|default|disabled|disc|disregard-shifts|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ease-in|ease-in-out|ease-out|ease|ellipsis|end|exclude-ruby|fill|fixed|font-size|font|georgian|glyphs|grid-height|groove|hand|hanging|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|icon|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|ideographic|inactive|include-ruby|inherit|initial|inline-block|inline-box|inline-line-height|inline-table|inline|inset|inside|inter-ideograph|inter-word|invert|italic|justify|katakana-iroha|katakana|keep-all|last|left|lighter|line-edge|line-through|line|linear|list-item|local|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|mathematical|max-height|max-size|medium|menu|message-box|middle|move|n-resize|ne-resize|newspaper|no-change|no-close-quote|no-drop|no-open-quote|no-repeat|none|normal|not-allowed|nowrap|nw-resize|oblique|open-quote|outset|outside|overline|padding-box|page|pointer|pre-line|pre-wrap|pre|preserve-3d|progress|relative|repeat-x|repeat-y|repeat|replaced|reset-size|ridge|right|round|row-resize|rtl|s-resize|scroll|se-resize|separate|slice|small-caps|small-caption|solid|space|square|start|static|status-bar|step-end|step-start|steps|stretch|strict|sub|super|sw-resize|table-caption|table-cell|table-column-group|table-column|table-footer-group|table-header-group|table-row-group|table-row|table|tb-rl|text-after-edge|text-before-edge|text-bottom|text-size|text-top|text|thick|thin|top|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|use-script|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|z-index|zero").split("|")
    );

    var colors = lang.arrayToMap(
        ("aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|" +
        "purple|red|silver|teal|white|yellow").split("|")
    );

    var fonts = lang.arrayToMap(
        ("arial|century|comic|courier|garamond|georgia|helvetica|impact|lucida|" +
        "symbol|system|tahoma|times|trebuchet|utopia|verdana|webdings|sans-serif|" +
        "serif|monospace").split("|")
    );
    
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    var numRe = "\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))";
    var pseudoElements = "(\\:+)\\b(after|before|first-letter|first-line|moz-selection|selection)\\b";
    var pseudoClasses = "(:)\\b(active|checked|disabled|empty|enabled|first-child|first-of-type|focus|hover|indeterminate|invalid|last-child|last-of-type|link|not|nth-child|nth-last-child|nth-last-of-type|nth-of-type|only-child|only-of-type|required|root|target|valid|visited)\\b";
    
    var base_ruleset = [
        {
            token : "comment", // multi line comment
            merge : true,
            regex : "\\/\\*",
            next : "ruleset_comment"
        }, {
            token : "string", // single line
            regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
        }, {
            token : "string", // single line
            regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
        }, {
            token : ["constant.numeric", "keyword"],
            regex : "(" + numRe + ")(ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vm|vw|%)"
        }, {
            token : ["constant.numeric"],
            regex : "([0-9]+)"
        }, {
            token : "constant.numeric",  // hex6 color
            regex : "#[a-f0-9]{6}"
        }, {
            token : "constant.numeric", // hex3 color
            regex : "#[a-f0-9]{3}"
        }, {
            token : ["punctuation", "entity.other.attribute-name.pseudo-element.css"], 
            regex : pseudoElements
        }, {
            token : ["punctuation", "entity.other.attribute-name.pseudo-class.css"], 
            regex : pseudoClasses
        }, {
            token : function(value) {
                if (properties.hasOwnProperty(value.toLowerCase())) {
                    return "support.type";
                }
                else if (functions.hasOwnProperty(value.toLowerCase())) {
                    return "support.function";
                }
                else if (constants.hasOwnProperty(value.toLowerCase())) {
                    return "support.constant";
                }
                else if (colors.hasOwnProperty(value.toLowerCase())) {
                    return "support.constant.color";
                }
                else if (fonts.hasOwnProperty(value.toLowerCase())) {
                    return "support.constant.fonts";
                }
                else {
                    return "text";
                }
            },
            regex : "\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"
        } 
      ];

    var ruleset = lang.copyArray(base_ruleset);
    ruleset.unshift({
        token : "paren.rparen",
        regex : "\\}",
        next:   "start"
    });

    var media_ruleset = lang.copyArray( base_ruleset );
    media_ruleset.unshift({
        token : "paren.rparen",
        regex : "\\}",
        next:   "media"
    });

    var base_comment = [{
          token : "comment", // comment spanning whole line
          merge : true,
          regex : ".+"
    }];

    var comment = lang.copyArray(base_comment);
    comment.unshift({
          token : "comment", // closing comment
          regex : ".*?\\*\\/",
          next : "start"
    });

    var media_comment = lang.copyArray(base_comment);
    media_comment.unshift({
          token : "comment", // closing comment
          regex : ".*?\\*\\/",
          next : "media"
    });

    var ruleset_comment = lang.copyArray(base_comment);
    ruleset_comment.unshift({
          token : "comment", // closing comment
          regex : ".*?\\*\\/",
          next : "ruleset"
    });

    this.$rules = {
        "start" : [{
            token : "comment", // multi line comment
            merge : true,
            regex : "\\/\\*",
            next : "comment"
        }, {
            token: "paren.lparen",
            regex: "\\{",
            next:  "ruleset"
        }, {
            token: "string",
            regex: "@.*?{",
            next:  "media"
        },{
            token: "keyword",
            regex: "#[a-z0-9-_]+"
        },{
            token: "variable",
            regex: "\\.[a-z0-9-_]+"
        },{
            token: "string",
            regex: ":[a-z0-9-_]+"
        },{
            token: "constant",
            regex: "[a-z0-9-_]+"
        }],

        "media" : [ {
            token : "comment", // multi line comment
            merge : true,
            regex : "\\/\\*",
            next : "media_comment"
        }, {
            token: "paren.lparen",
            regex: "\\{",
            next:  "media_ruleset"
        },{
            token: "string",
            regex: "\\}",
            next:  "start"
        },{
            token: "keyword",
            regex: "#[a-z0-9-_]+"
        },{
            token: "variable",
            regex: "\\.[a-z0-9-_]+"
        },{
            token: "string",
            regex: ":[a-z0-9-_]+"
        },{
            token: "constant",
            regex: "[a-z0-9-_]+"
        }],

        "comment" : comment,

        "ruleset" : ruleset,
        "ruleset_comment" : ruleset_comment,

        "media_ruleset" : media_ruleset,
        "media_comment" : media_comment
    };
};

oop.inherits(CssHighlightRules, TextHighlightRules);

exports.CssHighlightRules = CssHighlightRules;

});

define('ace/mode/javascript_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/lib/lang', 'ace/unicode', 'ace/mode/doc_comment_highlight_rules', 'ace/mode/text_highlight_rules'], function(require, exports, module) {


var oop = require("../lib/oop");
var lang = require("../lib/lang");
var unicode = require("../unicode");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var JavaScriptHighlightRules = function() {

    // see: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects
    var globals = lang.arrayToMap(
      // Constructors
        ("Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|" +
      // E4X
         "Namespace|QName|XML|XMLList|" +
         "ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|" +
         "Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|" +
      // Errors
        "Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|" +
        "SyntaxError|TypeError|URIError|" +
      //  Non-constructor functions
        "decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|" +
        "isNaN|parseFloat|parseInt|" +
      // Other
        "JSON|Math|" +
      // Pseudo
        "this|arguments|prototype|window|document"
      ).split("|")
    );

    var keywords = lang.arrayToMap(
        ("break|case|catch|continue|default|delete|do|else|finally|for|function|" +
        "if|in|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|" +
        "const|yield|import|get|set").split("|")
    );

    // keywords which can be followed by regular expressions
    var kwBeforeRe = "case|do|else|finally|in|instanceof|return|throw|try|typeof|yield";

    var deprecated = lang.arrayToMap(
        ("__parent__|__count__|escape|unescape|with|__proto__").split("|")
    );

    var definitions = lang.arrayToMap(("const|let|var|function").split("|"));

    var buildinConstants = lang.arrayToMap(
        ("null|Infinity|NaN|undefined").split("|")
    );

    var futureReserved = lang.arrayToMap(
        ("class|enum|extends|super|export|implements|private|" +
        "public|interface|package|protected|static").split("|")
    );

    // TODO: Unicode escape sequences
    var identifierRe = "[" + unicode.packages.L + "\\$_]["
        + unicode.packages.L
        + unicode.packages.Mn + unicode.packages.Mc
        + unicode.packages.Nd
        + unicode.packages.Pc + "\\$_]*\\b";

    var escapedRe = "\\\\(?:x[0-9a-fA-F]{2}|" + // hex
        "u[0-9a-fA-F]{4}|" + // unicode
        "[0-2][0-7]{0,2}|" + // oct
        "3[0-6][0-7]?|" + // oct
        "37[0-7]?|" + // oct
        "[4-7][0-7]?|" + //oct
        ".)";

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : /\/\/.*$/
            },
            DocCommentHighlightRules.getStartRule("doc-start"),
            {
                token : "comment", // multi line comment
                merge : true,
                regex : /\/\*/,
                next : "comment"
            }, {
                token : "string",
                regex : "'(?=.)",
                next  : "qstring"
            }, {
                token : "string",
                regex : '"(?=.)',
                next  : "qqstring"
            }, {
                token : "constant.numeric", // hex
                regex : /0[xX][0-9a-fA-F]+\b/
            }, {
                token : "constant.numeric", // float
                regex : /[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
            }, { // match stuff like: Sound.prototype.play = function() { }
                token : [
                    "storage.type",
                    "punctuation.operator",
                    "support.function",
                    "punctuation.operator",
                    "entity.name.function",
                    "text",
                    "keyword.operator",
                    "text",
                    "storage.type",
                    "text",
                    "paren.lparen"
                ],
                regex : "(" + identifierRe + ")(\\.)(prototype)(\\.)(" + identifierRe +")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments"
            }, { // match stuff like: Sound.prototype.play = myfunc
                token : [
                    "storage.type",
                    "punctuation.operator",
                    "support.function",
                    "punctuation.operator",
                    "entity.name.function",
                    "text",
                    "keyword.operator",
                    "text"
                ],
                regex : "(" + identifierRe + ")(\\.)(prototype)(\\.)(" + identifierRe +")(\\s*)(=)(\\s*)",
                next: "function_arguments"
            }, { // match stuff like: Sound.play = function() {  }
                token : [
                    "storage.type",
                    "punctuation.operator",
                    "entity.name.function",
                    "text",
                    "keyword.operator",
                    "text",
                    "storage.type",
                    "text",
                    "paren.lparen"
                ],
                regex : "(" + identifierRe + ")(\\.)(" + identifierRe +")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments"
            }, { // match stuff like: play = function() {  }
                token : [
                    "entity.name.function",
                    "text",
                    "keyword.operator",
                    "text",
                    "storage.type",
                    "text",
                    "paren.lparen"
                ],
                regex : "(" + identifierRe +")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments"
            }, { // match regular function like: function myFunc(arg) { }
                token : [
                    "storage.type",
                    "text",
                    "entity.name.function",
                    "text",
                    "paren.lparen"
                ],
                regex : "(function)(\\s+)(" + identifierRe + ")(\\s*)(\\()",
                next: "function_arguments"
            }, { // match stuff like: foobar: function() { }
                token : [
                    "entity.name.function",
                    "text",
                    "punctuation.operator",
                    "text",
                    "storage.type",
                    "text",
                    "paren.lparen"
                ],
                regex : "(" + identifierRe + ")(\\s*)(:)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments"
            }, { // Attempt to match : function() { } (this is for issues with 'foo': function() { })
                token : [
                    "text",
                    "text",
                    "storage.type",
                    "text",
                    "paren.lparen"
                ],
                regex : "(:)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments"
            }, {
                token : "constant.language.boolean",
                regex : /(?:true|false)\b/
            }, {
                token : "keyword",
                regex : "(?:" + kwBeforeRe + ")\\b",
                next : "regex_allowed"
            }, {
                token : ["punctuation.operator", "support.function"],
                regex : /(\.)(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:opzzzz|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/
            }, {
                token : ["punctuation.operator", "support.function.dom"],
                regex : /(\.)(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/
            }, {
                token : ["punctuation.operator", "support.constant"],
                regex : /(\.)(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/
            }, {
                token : ["storage.type", "punctuation.operator", "support.function.firebug"],
                regex : /(console)(\.)(warn|info|log|error|time|timeEnd|assert)\b/
            }, {
                token : function(value) {
                    if (globals.hasOwnProperty(value))
                        return "variable.language";
                    else if (deprecated.hasOwnProperty(value))
                        return "invalid.deprecated";
                    else if (definitions.hasOwnProperty(value))
                        return "storage.type";
                    else if (keywords.hasOwnProperty(value))
                        return "keyword";
                    else if (buildinConstants.hasOwnProperty(value))
                        return "constant.language";
                    else if (futureReserved.hasOwnProperty(value))
                        return "invalid.illegal";
                    else if (value == "debugger")
                        return "invalid.deprecated";
                    else
                        return "identifier";
                },
                regex : identifierRe
            }, {
                token : "keyword.operator",
                regex : /!|\$|%|&|\*|\-\-|\-|\+\+|\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?\:|\*=|%=|\+=|\-=|&=|\^=|\b(?:in|instanceof|new|delete|typeof|void)/,
                next  : "regex_allowed"
            }, {
                token : "punctuation.operator",
                regex : /\?|\:|\,|\;|\./,
                next  : "regex_allowed"
            }, {
                token : "paren.lparen",
                regex : /[\[({]/,
                next  : "regex_allowed"
            }, {
                token : "paren.rparen",
                regex : /[\])}]/
            }, {
                token : "keyword.operator",
                regex : /\/=?/,
                next  : "regex_allowed"
            }, {
                token: "comment",
                regex: /^#!.*$/
            }, {
                token : "text",
                regex : /\s+/
            }
        ],
        // regular expressions are only allowed after certain tokens. This
        // makes sure we don't mix up regexps with the divison operator
        "regex_allowed": [
            DocCommentHighlightRules.getStartRule("doc-start"),
            {
                token : "comment", // multi line comment
                merge : true,
                regex : "\\/\\*",
                next : "comment_regex_allowed"
            }, {
                token : "comment",
                regex : "\\/\\/.*$"
            }, {
                token: "string.regexp",
                regex: "\\/",
                next: "regex",
                merge: true
            }, {
                token : "text",
                regex : "\\s+"
            }, {
                // immediately return to the start mode without matching
                // anything
                token: "empty",
                regex: "",
                next: "start"
            }
        ],
        "regex": [
            {
                token: "regexp.keyword.operator",
                regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
            }, {
                // flag
                token: "string.regexp",
                regex: "/\\w*",
                next: "start",
                merge: true
            }, {
                token: "string.regexp",
                regex: "[^\\\\/\\[]+",
                merge: true
            }, {
                token: "string.regexp.charachterclass",
                regex: "\\[",
                next: "regex_character_class",
                merge: true
            }, {
                token: "empty",
                regex: "",
                next: "start"
            }
        ],
        "regex_character_class": [
            {
                token: "regexp.keyword.operator",
                regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
            }, {
                token: "string.regexp.charachterclass",
                regex: "]",
                next: "regex",
                merge: true
            }, {
                token: "string.regexp.charachterclass",
                regex: "[^\\\\\\]]+",
                merge: true
            }, {
                token: "empty",
                regex: "",
                next: "start"
            }
        ],
        "function_arguments": [
            {
                token: "variable.parameter",
                regex: identifierRe,
            }, {
                token: "punctuation.operator",
                regex: "[, ]+",
                merge: true
            }, {
                token: "punctuation.operator",
                regex: "$",
                merge: true
            }, {
                token: "empty",
                regex: "",
                next: "start"
            }
        ],
        "comment_regex_allowed" : [
            {
                token : "comment", // closing comment
                regex : ".*?\\*\\/",
                merge : true,
                next : "regex_allowed"
            }, {
                token : "comment", // comment spanning whole line
                merge : true,
                regex : ".+"
            }
        ],
        "comment" : [
            {
                token : "comment", // closing comment
                regex : ".*?\\*\\/",
                merge : true,
                next : "start"
            }, {
                token : "comment", // comment spanning whole line
                merge : true,
                regex : ".+"
            }
        ],
        "qqstring" : [
            {
                token : "constant.language.escape",
                regex : escapedRe
            }, {
                token : "string",
                regex : '[^"\\\\]+',
                merge : true
            }, {
                token : "string",
                regex : "\\\\$",
                next  : "qqstring",
                merge : true
            }, {
                token : "string",
                regex : '"|$',
                next  : "start",
                merge : true
            }
        ],
        "qstring" : [
            {
                token : "constant.language.escape",
                regex : escapedRe
            }, {
                token : "string",
                regex : "[^'\\\\]+",
                merge : true
            }, {
                token : "string",
                regex : "\\\\$",
                next  : "qstring",
                merge : true
            }, {
                token : "string",
                regex : "'|$",
                next  : "start",
                merge : true
            }
        ]
    };

    this.embedRules(DocCommentHighlightRules, "doc-",
        [ DocCommentHighlightRules.getEndRule("start") ]);
};

oop.inherits(JavaScriptHighlightRules, TextHighlightRules);

exports.JavaScriptHighlightRules = JavaScriptHighlightRules;
});

define('ace/mode/doc_comment_highlight_rules', ['require', 'exports', 'module' , 'ace/lib/oop', 'ace/mode/text_highlight_rules'], function(require, exports, module) {


var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var DocCommentHighlightRules = function() {

    this.$rules = {
        "start" : [ {
            token : "comment.doc.tag",
            regex : "@[\\w\\d_]+" // TODO: fix email addresses
        }, {
            token : "comment.doc",
            merge : true,
            regex : "\\s+"
        }, {
            token : "comment.doc",
            merge : true,
            regex : "TODO"
        }, {
            token : "comment.doc",
            merge : true,
            regex : "[^@\\*]+"
        }, {
            token : "comment.doc",
            merge : true,
            regex : "."
        }]
    };
};

oop.inherits(DocCommentHighlightRules, TextHighlightRules);

DocCommentHighlightRules.getStartRule = function(start) {
    return {
        token : "comment.doc", // doc comment
        merge : true,
        regex : "\\/\\*(?=\\*)",
        next  : start
    };
};

DocCommentHighlightRules.getEndRule = function (start) {
    return {
        token : "comment.doc", // closing comment
        merge : true,
        regex : "\\*\\/",
        next  : start
    };
};


exports.DocCommentHighlightRules = DocCommentHighlightRules;

});

define('ace/mode/xml_util', ['require', 'exports', 'module' , 'ace/lib/lang'], function(require, exports, module) {


var lang = require("../lib/lang");

var formTags = lang.arrayToMap(
    ("button|form|input|label|select|textarea").split("|")
);

var tableTags = lang.arrayToMap(
    ("table|tbody|td|tfoot|th|tr").split("|")
);

function string(state) {
    return [{
        token : "string",
        regex : '".*?"'
    }, {
        token : "string", // multi line string start
        merge : true,
        regex : '["].*',
        next : state + "_qqstring"
    }, {
        token : "string",
        regex : "'.*?'"
    }, {
        token : "string", // multi line string start
        merge : true,
        regex : "['].*",
        next : state + "_qstring"
    }];
}

function multiLineString(quote, state) {
    return [{
        token : "string",
        merge : true,
        regex : ".*?" + quote,
        next : state
    }, {
        token : "string",
        merge : true,
        regex : '.+'
    }];
}

exports.tag = function(states, name, nextState) {
    states[name] = [{
        token : "text",
        regex : "\\s+"
    }, {
        //token : "meta.tag",
        
    token : function(value) {
            if ( value==='a' ) {
                return "meta.tag.anchor";
            }
            else if ( value==='img' ) {
                return "meta.tag.image";
            }
            else if ( value==='script' ) {
                return "meta.tag.script";
            }
            else if ( value==='style' ) {
                return "meta.tag.style";
            }
            else if (formTags.hasOwnProperty(value.toLowerCase())) {
                return "meta.tag.form";
            }
            else if (tableTags.hasOwnProperty(value.toLowerCase())) {
                return "meta.tag.table";
            }
            else {
                return "meta.tag";
            }
        },        
        merge : true,
        regex : "[-_a-zA-Z0-9:]+",
        next : name + "_embed_attribute_list" 
    }, {
        token: "empty",
        regex: "",
        next : name + "_embed_attribute_list"
    }];

    states[name + "_qstring"] = multiLineString("'", name + "_embed_attribute_list");
    states[name + "_qqstring"] = multiLineString("\"", name + "_embed_attribute_list");
    
    states[name + "_embed_attribute_list"] = [{
        token : "meta.tag",
        merge : true,
        regex : "\/?>",
        next : nextState
    }, {
        token : "keyword.operator",
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

});

define('ace/mode/matching_brace_outdent', ['require', 'exports', 'module' , 'ace/range'], function(require, exports, module) {


var Range = require("../range").Range;

var MatchingBraceOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        var match = line.match(/^(\s+)/);
        if (match) {
            return match[1];
        }

        return "";
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
});
