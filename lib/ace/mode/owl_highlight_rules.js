
define(function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;


    var OwlHighlightRules = function () {


        var keywords = (
             "AnnotationProperty|Class|DataProperty|datatype|DifferentIndividuals|DisjointClasses|" +
             "DisjointProperties|EquivalentClasses|EquivalentProperties|Import|Individual|" +
             "namedindividual|namespace|ObjectProperty|Ontology|SameIndividual|Prefix|rdf|RDF|owl|"+
             "integer|decimal|float|string|0|1|2|3|4|5|6|7|8|9|+|-|f|F|e|E|{|}|(|)|[|]|,|rdfs|o"               //new

        );

        var propertyKeywords = (
            "Annotations|Characteristics|DisjointUnionOf|DisjointWith|Domain|EquivalentTo|" +
            "Facts|HasKey|InverseOf|Range|SameAs|SubClassOf|SubPropertyChain|SubPropertyOf|Types|"+
            "DifferentFrom"                                                                            //new

        );

        var buildinConstants = (
            "and|Asymmetric|exactly|Functional|has|InverseFunctional|Irreflexive|max|min|not|" +
            "only|or|Reflexive|self|some|Symmatric|that|Transitive|value"

        );

        var keywordMapper = this.createKeywordMapper({
            "keyword": keywords,
            "constant.language": buildinConstants,
            "variable.language": propertyKeywords
        }, "identifier");



        this.$rules = {
            'start': [

                {
                    token: "string.regexp",
                    regex: "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
                }, {
                    token: "string", // single line
                    regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                }, {
                    token: "string", // multi line string start
                    regex: '["].*\\\\$',
                    next: "qqstring"
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
                    token: 'comment',
                    regex: '\\*\\/',
                    next: 'start'
                }, {
                    token: 'comment',
                    regex: '.+'
                }
            ]
        };

        this.normalizeRules();

    };

    oop.inherits(OwlHighlightRules, TextHighlightRules);

    exports.OwlHighlightRules = OwlHighlightRules;
});