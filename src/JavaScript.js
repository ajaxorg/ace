if (!window.ace)
    ace = {};

(function() {

    ace.JavaScript = {};

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

    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used

    ace.JavaScript.RULES = {
        start : [ {
            token : "comment",
            regex : "\\/\\/.*$"
        }, {
            token : "comment", // multi line comment in one line
            regex : "\\/\\*.*?\\*\\/"
        }, {
            token : "comment", // multi line comment start
            regex : "\\/\\*.*$",
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
            token : function(value) {
                // return parens[value];
            return "text";
        },
        regex : "[\\[\\]\\(\\)\\{\\}]"
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

})();