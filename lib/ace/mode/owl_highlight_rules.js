
define(function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;


    var OwlHighlightRules = function () {


        var keywords = (
             "AnnotationProperty|Class|DataProperty|Datatype|DifferentIndividuals|DisjointClasses|" +
             "DisjointProperties|EquivalentClasses|EquivalentProperties|Import|Individual|" +
             "namedindividual|namespace|ObjectProperty|Ontology|SameIndividual|Prefix|owl|"+
             "integer|decimal|float|string"             

        );

        var propertyKeywords = (
            "Annotations|Characteristics|DisjointUnionOf|DisjointWith|Domain|EquivalentTo|" +
            "Facts|HasKey|InverseOf|Range|SameAs|SubClassOf|SubPropertyChain|SubPropertyOf|Types|"+
            "DifferentFrom"                                                                            

        );

        var buildinConstants = (
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
                    token: "string.regexp",
                    regex: "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
                }, {
                    token: "string", // single line string
                    regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                }, {
                    token: "string", // multi line string start
                    regex: '["].*\\\\$',
                    next: "qqstring"
                }, {
                    token: "string", // URL
                    regex: '[<](?:(?:\\\\.)|(?:[^"\\\\]))*?[>]'
                }, {
                    token: "comment.owl",
                    regex: "#",
                    next: "comment"
                }, {
                    token: keywordMapper,
                    regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
                }
            ],
            "qqstring": [
                {
                    token: "string",
                    regex: '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
                    next: "start"
                }, {
                    token: "string",
                    regex: '.+'
                }
            ],

            comment: [
                {
                    token: "comment",
                    regex: "$|^",
                    next: "end"
                }, {
                    defaultToken: "comment.owl"
                }
            ]
        };

        this.normalizeRules();

    };

    oop.inherits(OwlHighlightRules, TextHighlightRules);

    exports.OwlHighlightRules = OwlHighlightRules;
});