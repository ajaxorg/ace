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
         "ace/lib/lang",
         "ace/mode/DocCommentHighlightRules",
         "ace/mode/TextHighlightRules"
     ], function(oop, lang, DocCommentHighlightRules, TextHighlightRules) {


JavaScriptHighlightRules = function() {

    var docComment = new DocCommentHighlightRules();

    var keywords = lang.arrayToMap(
        ("break|case|catch|continue|default|delete|do|else|finally|for|function|\
        if|in|instanceof|new|return|switch|throw|try|typeof|var|while|with").split("|")
    );
    
    var buildinConstants = lang.arrayToMap(
        ("true|false|null|undefined|Infinity|NaN|undefined").split("|")
    );
    
    var futureReserved = lang.arrayToMap(
        ("class|enum|extends|super|const|export|import|implements|let|private|\
        public|yield|interface|package|protected|static").split("|")
    );

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
                if (value == "this")
                    return "variable";
                else if (keywords[value])
                    return "keyword";
                else if (buildinConstants[value])
                    return "buildin-constant";
                else if (futureReserved[value] || value == "debugger")
                    return "invalid";
                else
                    return "identifier";
            },
            regex : "[a-zA-Z_][a-zA-Z0-9_]*\\b"
        }, {
            token : "operator",
            regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(in|instanceof|new|delete|typeof|void)"
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