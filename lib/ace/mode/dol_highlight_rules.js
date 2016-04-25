
define(function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
   

    var DolHighlightRules = function () {


        var Keywords = ("alignment|along|assuming|and|by|closed-world|cofree|combine|cons-ext|ContextualizedDomain|end|entails|entailment|equivalence|" +
                        "excluding|extract|free|GlobalDomain|hide|import|in|for|forget|interpretation|interpreted|keep|language|library|logic|maximize|model|minimize|" +
                        "network|ni|of|oms|onto|ontology|refined|refinement|reject|relation|remove|result|reveal|" +
                        "select|separators|serialization|SingleDomain|spec|specification|substitution|then|to|translation|using|vars|via|view|" +
                        "where|with|%cons|%ccons|%complete|%consistent|%def|%implied|%inconsistent|%mcons|%mono|%notccons|%notmcons|%prefix|%satisfiable|%unsatisfiable|%wdef");




        var keywordMapper = this.createKeywordMapper({
            "keyword": Keywords
        }, "identifier");


        this.$rules = {
            'start': [
                {
                    token: "string",                                        //In case the inheretance done then the string and the url code would be removed i guess
                    regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                }, {
                    token: "string",
                    regex: '[\'](?:(?:\\\\.)|(?:[^"\\\\]))*?[\']'
                }, {
                    token: "constant.numeric",
                    regex: '[<](?:(?:\\\\.)|(?:[^"\\\\]))*?[>]'
                }, {
                    token: keywordMapper,
                    regex: "[%]*[a-zA-Z_$][a-zA-Z0-9_$-]*"
                }

            ]
        };

        this.normalizeRules();

    };

    oop.inherits(DolHighlightRules, TextHighlightRules);

    exports.DolHighlightRules = DolHighlightRules;
});