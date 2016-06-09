
define(function (require, exports, module) {
"use strict";

		var oop = require("../lib/oop");
		var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;


		var ClifHighlightRules = function () {


		     var Reservedtokens = ("=|and|or|iff|if|forall|exists|not|roleset:|cl:text|cl:imports|cl:excludes|cl:module");

			 var commentedsentence = ("cl:comment");

			 var keywordMapper = this.createKeywordMapper({
			     "keyword": Reservedtokens,
                 "constant.language": commentedsentence
             }, "identifier");
		
		
		this.$rules = {
            'start': [
                
				{
				   token: "variable.language",    //sequencemarker
				   regex: '\\.\\.\\.[a-zA-Z0-9]*'
					
				}, {
				    token: "string",
				    regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
				}, {
				    token: "string",
				    regex: '[\'](?:(?:\\\\.)|(?:[^"\\\\]))*?[\']'
				}, {
                    token: keywordMapper,
                    regex: "[a-zA-Z_$][a-zA-Z0-9_$:]*"
                }

            ]
        };

			this.normalizeRules();

		};

		oop.inherits(ClifHighlightRules, TextHighlightRules);

		exports.ClifHighlightRules = ClifHighlightRules;
});