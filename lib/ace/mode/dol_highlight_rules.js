
define(function (require, exports, module) {
"use strict";

		var oop = require("../lib/oop");
		var OwlHighlightRules = require("./owl_highlight_rules").OwlHighlightRules;
		var CLifHighlightRules = require("./clif_highlight_rules").ClifHighlightRules;
		var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
		
	

		var DolHighlightRules = function () {
		 

		    var Keywords = ("alignment|along|assuming|and|by|closed-world|cofree|combine|cons-ext|ContextualizedDomain|end|entails|entailment|equivalence|"+
                            "excluding|extract|free|GlobalDomain|hide|import|in|for|forget|interpretation|interpreted|keep|language|library|logic|maximize|model|minimize|" +
                            "network|ni|of|oms|onto|ontology|refined|refinement|reject|relation|remove|result|reveal|"+
                            "select|separators|serialization|SingleDomain|spec|specification|substitution|then|to|translation|using|vars|via|view|" +
                            "where|with|%cons|%ccons|%complete|%consistent|%def|%implied|%inconsistent|%mcons|%mono|%notccons|%notmcons|%prefix|%satisfiable|%unsatisfiable|%wdef");
            
		   

			
			 var keywordMapper = this.createKeywordMapper({
			     "keyword": Keywords
        }, "identifier");
		
			 //ClifHighlightRules.call(this);
			
		this.$rules = {
		    'start': [
              //OwlHighlightRules.getStartRule("owl-start"),
              
                {
                    token: "string",                                                    //In case the inheretance done then the string and the url code would be removed i guess
                    regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                }, {
                    token: "string", 
                    regex: '[\'](?:(?:\\\\.)|(?:[^"\\\\]))*?[\']'
                }, {
                    token: "constant.numeric",
                    regex: '[<](?:(?:\\\\.)|(?:[^"\\\\]))*?[>]'
                }, {
                    token: "comment.dol",
                    regex: "%%",
                    next: "comment"
                }, {
                    token: keywordMapper,
                    regex: "[%]*[a-zA-Z_$][a-zA-Z0-9_$-]*",
                  //  next: "owl-start"
                }

		    ],
		    comment: [
               {
                   token: "comment",
                   regex: "$|^",
                   next: "start"
               }, {
                   defaultToken: "comment.dol"
               }
		    ]
		};

		
		//for (var i in this.$rules) {
		//    this.$rules[i].unshift({
		//        token: "keyword",
		//        regex: "(?:OWL\\sManchester\\ssyntax)",
		//        next: "owl-start"
		//    }, {
		//        token: "keyword",
		//        regex: "(?:translate\\sit)",
		//        next: "owl-start"
		//    });
		//}

		//this.embedRules(OwlHighlightRules, "owl-", [
        //{
        //    token: "keyword",
        //    regex: "(?:an\\satom)",
        //    next: "start"
        //},
        //{
        //    token: "keyword",
        //    regex: "(?:existence)",
        //    next: "start"
        //}
		//]);


		//this.embedRules(OwlHighlightRules, "owl-",
        //    [{
        //        token: "keyword",
        //        regex: "(?:ontology)",              // the problem is that the regex here should be a keyword that exist in the code and also
        //                                //there must be an end also where you would say that the code should switch to the other kind of code again
        //        next: "start"
        //    }]);

		
		    
		       
		  
	

		//for (var i in this.$rules) {
		//    this.$rules[i].unshift({
		//        token: "keyword",
		//        regex: "[%]*[a-zA-Z_$][a-zA-Z0-9_$-]*",
		//        next: "owl-start"
		//    }, {
		//        token: "keyword",
		//        regex: "[%]*[a-zA-Z_$][a-zA-Z0-9_$-]*",
		//        next: "owl-start"
		//    });
		//}

		//this.embedRules(OwlHighlightRules, "owl-",
        //    [OwlHighlightRules.getEndRule("start") ]);
		//this.normalizeRules();
    

		};
  
		oop.inherits(DolHighlightRules, TextHighlightRules);

		exports.DolHighlightRules = DolHighlightRules;
});