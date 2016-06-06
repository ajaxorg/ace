
define(function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;


    var OwlHighlightRules = function () {

        //var qstr = exports.qstr = {
        //    token: "string",
        //    regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
        //};

        var keywords = (
             "AnnotationProperty:|Class:|DataProperty:|Datatype:|DifferentIndividuals:|DisjointClasses:|" +
             "DisjointProperties:|EquivalentClasses:|EquivalentProperties:|Import:|Individual:|" +
	          "namedindividual:|namespace:|ObjectProperty:|Ontology:|SameIndividual:|Prefix:|owl:|"+
             "integer|decimal|float|string"             

        );

        var propertyKeywords = (
            "Annotations:|Characteristics:|DisjointUnionOf:|DisjointWith:|Domain:|EquivalentTo:|" +
            "Facts:|HasKey:|InverseOf:|Range:|SameAs:|SubClassOf:|SubPropertyChain:|SubPropertyOf:|Types:|"+
            "DifferentFrom:"                                                                            

        );

        var builtinConstants = (
            "and|Asymmetric|exactly|Functional|has|InverseFunctional|Irreflexive|max|min|not|" +
            "only|or|Reflexive|self|some|Symmatric|that|Transitive|value"

        );

        var supp = ("o");

        var keywordMapper = this.createKeywordMapper({
            "keyword": keywords,
            "constant.language": buildinConstants,
            "variable.language": propertyKeywords,
            "constant.numeric": supp
        }, "identifier");



        this.$rules = {
            'start': [

                {
                    token : "support.function",
                    regex : '[a-zA-Z]+:[a-zA-Z]+'
                }, {
                    token: "string", 
                    regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                }, {
                    token: "string",
                    regex: '[\'](?:(?:\\\\.)|(?:[^"\\\\]))*?[\']'
                }, {
                    token: "constant.numeric", // URL
                    regex: '[<](?:(?:\\\\.)|(?:[^"\\\\]))*?[>]'
                }, {
                    token: "comment.owl",
                    regex: "#",
                    next: "comment"
                }, {
                    token: keywordMapper,
                    regex: "[a-zA-Z_$][a-zA-Z0-9_$:]*"
                }
				
            ],
       
            'comment': [
                {
                    token: "comment",
                    regex: "$|^",
                    next: "start"
                }, {
                    defaultToken: "comment.owl"
                }
            ]
        };

        this.normalizeRules();

    };

    oop.inherits(OwlHighlightRules, TextHighlightRules);

    //OwlHighlightRules.getStartRule = function (start) {
    //    return {
    //        token: "keyword",
    //        regex: "(?:ontology)",
    //        next: start
    //    };
    //};

    //OwlHighlightRules.getEndRule = function (start) {
    //    return {
    //        token: "keyword",
    //        regex: "end",
    //        next: start
    //    };
    //};

    exports.OwlHighlightRules = OwlHighlightRules;
});