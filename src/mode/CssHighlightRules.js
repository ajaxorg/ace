ace.provide("ace.mode.CssHighlightRules");

ace.mode.CssHighlightRules = function() {

    var properties = {
        "width": 1,
        "height": 1,
        "top": 1,
        "left": 1,
        "right": 1,
        "bottom": 1,
        "overflow": 1,
        "overflow-x": 1,
        "overflow-y": 1,
        "background": 1,
        "font": 1,
        "font-style": 1,
        "font-family": 1,
        "font-size": 1,
        "text-align": 1,
        "white-space": 1,
        "color": 1,
        "z-index": 1,
        "position": 1,
        "cursor": 1,
        "box-sizing": 1,
        "-webkit-box-sizing": 1,
        "-moz-box-sizing": 1,
        "margin": 1,
        "padding": 1,
        "padding-top": 1,
        "padding-right": 1,
        "padding-bottom": 1,
        "padding-left": 1,
        "border": 1,
        "border-top": 1,
        "border-right": 1,
        "border-left": 1,
        "border-bottom": 1
    };

    var functions = {
        "rgb": 1,
        "rgba": 1
    };

    var constants = {
        "absolute": 1,
        "relative": 1,
        "fixed": 1,
        "solid": 1,
        "hidden": 1,
        "scroll": 1,
        "no-wrap": 1
    };

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

    this.$rules = {
        "start" : [ {
            token : "comment", // multi line comment
            regex : "\\/\\*",
            next : "comment"
        }, {
            token : "string", // single line
            regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
        }, {
            token : "string", // single line
            regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
        }, {
            token : "number",
            regex : numRe + ic("em")
        }, {
            token : "number",
            regex : numRe + ic("ex")
        }, {
            token : "number",
            regex : numRe + ic("px")
        }, {
            token : "number",
            regex : numRe + ic("cm")
        }, {
            token : "number",
            regex : numRe + ic("mm")
        }, {
            token : "number",
            regex : numRe + ic("in")
        }, {
            token : "number",
            regex : numRe + ic("pt")
        }, {
            token : "number",
            regex : numRe + ic("pc")
        }, {
            token : "number",
            regex : numRe + ic("deg")
        }, {
            token : "number",
            regex : numRe + ic("rad")
        }, {
            token : "number",
            regex : numRe + ic("grad")
        }, {
            token : "number",
            regex : numRe + ic("ms")
        }, {
            token : "number",
            regex : numRe + ic("s")
        }, {
            token : "number",
            regex : numRe + ic("hz")
        }, {
            token : "number",
            regex : numRe + ic("khz")
        }, {
            token : "number",
            regex : numRe + "%"
        }, {
            token : "number",
            regex : numRe
        }, {
            token : "number",  // hex6 color
            regex : "#[a-fA-F0-9]{6}"
        }, {
            token : "number", // hex3 color
            regex : "#[a-fA-F0-9]{3}"
        }, {
            token : "lparen",
            regex : "\{"
        }, {
            token : "rparen",
            regex : "\}"
        }, {
            token : function(value) {
                if (properties[value.toLowerCase()]) {
                    return "buildin-constant";
                }
                else if (functions[value.toLowerCase()]) {
                    return "buildin-function";
                }
                else if (constants[value.toLowerCase()]) {
                    return "library-constant";
                }
                else {
                    return "identifier";
                }
            },
            regex : "\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"
        }],
        "comment" : [{
            token : "comment", // closing comment
            regex : ".*?\\*\\/",
            next : "start"
        }, {
            token : "comment", // comment spanning whole line
            regex : ".+"
        }]
    };
};

(function() {

    this.getRules = function() {
        return this.$rules;
    };

}).call(ace.mode.CssHighlightRules.prototype);