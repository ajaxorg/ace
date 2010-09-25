/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/mode/JavaScriptHighlightRules",
     [
         "ace/lib/oop",
         "ace/mode/DocCommentHighlightRules",
         "ace/mode/TextHighlightRules"
     ], function(oop, DocCommentHighlightRules, TextHighlightRules) {


JavaScriptHighlightRules = function() {

    var docComment = new DocCommentHighlightRules();

    var keywords = {
        "break" : 1,
        "case" : 1,
        "catch" : 1,
        "continue" : 1,
        "default" : 1,
        "delete" : 1,
        "do" : 1,
        "else" : 1,
        "finally" : 1,
        "for" : 1,
        "function" : 1,
        "if" : 1,
        "in" : 1,
        "instanceof" : 1,
        "new" : 1,
        "return" : 1,
        "switch" : 1,
        "throw" : 1,
        "try" : 1,
        "typeof" : 1,
        "var" : 1,
        "while" : 1,
        "with" : 1
    };

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [ {
            token : "comment",
            regex : "\\/\\/.*$"
        },
        docComment.getStartRule("doc-start"),
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
            token : "number", // hex
            regex : "0[xX][0-9a-fA-F]+\\b"
        }, {
            token : "number", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : function(value) {
                if (keywords[value]) {
                    return "keyword";
                }
                else {
                    return "identifier";
                }
            },
            regex : "[a-zA-Z_][a-zA-Z0-9_]*\\b"
        }, {
            token : "lparen",
            regex : "[\\[\\(\\{]"
        }, {
            token : "rparen",
            regex : "[\\]\\)\\}]"
        }, {
            token : "text",
            regex : "\\s+"
        } ],
        "comment" : [ {
            token : "comment", // closing comment
            regex : ".*?\\*\\/",
            next : "start"
        }, {
            token : "comment", // comment spanning whole line
            regex : ".+"
        } ],
        "qqstring" : [ {
            token : "string",
            regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
            next : "start"
        }, {
            token : "string",
            regex : '.+'
        } ],
        "qstring" : [ {
            token : "string",
            regex : "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
            next : "start"
        }, {
            token : "string",
            regex : '.+'
        } ]
    };

    this.addRules(docComment.getRules(), "doc-");
    this.$rules["doc-start"][0].next = "start";
};

oop.inherits(JavaScriptHighlightRules, TextHighlightRules);

return JavaScriptHighlightRules;
});