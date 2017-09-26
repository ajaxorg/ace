define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");

var CsoundOrchestraHighlightRules = require("./csound_orchestra_highlight_rules").CsoundOrchestraHighlightRules;
var CsoundScoreHighlightRules = require("./csound_score_highlight_rules").CsoundScoreHighlightRules;
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var CsoundDocumentHighlightRules = function() {

    this.$rules = {
        "start": [
            {
                token : ["meta.tag.punctuation.tag-open.csound-document", "entity.name.tag.begin.csound-document", "meta.tag.punctuation.tag-close.csound-document"],
                regex : /(<)(CsoundSynthesi[sz]er)(>)/,
                next  : "synthesizer"
            },
            {defaultToken : "text.csound-document"}
        ],

        "synthesizer": [
            {
                token : ["meta.tag.punctuation.end-tag-open.csound-document", "entity.name.tag.begin.csound-document", "meta.tag.punctuation.tag-close.csound-document"],
                regex : "(</)(CsoundSynthesi[sz]er)(>)",
                next  : "start"
            }, {
                token : ["meta.tag.punctuation.tag-open.csound-document", "entity.name.tag.begin.csound-document", "meta.tag.punctuation.tag-close.csound-document"],
                regex : "(<)(CsInstruments)(>)",
                next  : "csound-start"
            }, {
                token : ["meta.tag.punctuation.tag-open.csound-document", "entity.name.tag.begin.csound-document", "meta.tag.punctuation.tag-close.csound-document"],
                regex : "(<)(CsScore)(>)",
                next  : "csound-score-start"
            }, {
                token : ["meta.tag.punctuation.tag-open.csound-document", "entity.name.tag.begin.csound-document", "meta.tag.punctuation.tag-close.csound-document"],
                regex : "(<)([Hh][Tt][Mm][Ll])(>)",
                next  : "html-start"
            }
        ]
    };

    this.embedRules(CsoundOrchestraHighlightRules, "csound-", [{
        token : ["meta.tag.punctuation.end-tag-open.csound-document", "entity.name.tag.begin.csound-document", "meta.tag.punctuation.tag-close.csound-document"],
        regex : "(</)(CsInstruments)(>)",
        next  : "synthesizer"
    }]);
    this.embedRules(CsoundScoreHighlightRules, "csound-score-", [{
        token : ["meta.tag.punctuation.end-tag-open.csound-document", "entity.name.tag.begin.csound-document", "meta.tag.punctuation.tag-close.csound-document"],
        regex : "(</)(CsScore)(>)",
        next  : "synthesizer"
    }]);
    this.embedRules(HtmlHighlightRules, "html-", [{
        token : ["meta.tag.punctuation.end-tag-open.csound-document", "entity.name.tag.begin.csound-document", "meta.tag.punctuation.tag-close.csound-document"],
        regex : "(</)([Hh][Tt][Mm][Ll])(>)",
        next  : "synthesizer"
    }]);

    this.normalizeRules();
};

oop.inherits(CsoundDocumentHighlightRules, TextHighlightRules);

exports.CsoundDocumentHighlightRules = CsoundDocumentHighlightRules;
});
