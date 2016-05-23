
define(function (require, exports, module) {
"use strict";

		var oop = require("../lib/oop");
		var OwlHighlightRules = require("./owl_highlight_rules").OwlHighlightRules;
		var CLifHighlightRules = require("./clif_highlight_rules").ClifHighlightRules;
		var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
	
	

		var DolHighlightRules = function (options) {
		 

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
		

		//if (!options) {
		//    this.$rules.start.unshift({
		//        regex: "[0-9a-zA-Z:_-]+", onMatch: function (val, state, stack) {
		//            //this.next = val == "document" ? stack.unshift(document) : "";
		//            var sta = "OMS" ? 1 : 2;
		//            if (sta == 1) {
		//                stack.unshift("OMS");
		//                sta = "OMS" ? sta = "OMSa" : "Extention";
		//                if (sta = "OMSa") {
                            
		//                }
		                

		//            }
		//            else if (sta == 2)
		//                stack.shift();
		//                stack.shift();
		//        }
		//    })
		//}


		if (!options) {
		    
		    this.$rules.start.unshift(
                //{ regex: "[0-9a-zA-Z:_-]+", onMacth: stack.unshift("OMS") }, 
                {
                    regex: "[0-9a-zA-Z:_-]+",
                    onMatch: function (value, state, stack) {                   // state and input are not used
                        stack.unshift("OMS");
                        while (stack[0]) {

                            if (stack[0] == "OMS") {
                                stack.shift();
                                stack.unshift("OMSa", "Extention");
                            } else if (stack[0] == "OMSa") {
                                stack.shift();
                                stack.unshift("OMSb", "Union");
                            } else if (stack[0] == "OMSb") {
                                stack.shift();
                                stack.unshift("OMSc", "Translation");
                            } else if (stack[0] == "OMSc") {

                                // i need to use single look ahead
                                if (value == [{ regex: "(?={)" }]) {
                                    stack.shift();
                                    stack.unshift("OMS", '}')
                                }
                                else {
                                    stack.shift();
                                    stack.unshift("QualOMS")
                                }
                                // i need to define a difference between a terminal and a non-terminal in the stack
                             
                                     //[{ token:"string", regex: "(?={)", onMatch: function (stack) { stack.shift(); stack.unshift("OMS", '}') } },
                                     //{ token: "string", regex: "(?=logic)", onMatch: function (stack) { stack.shift(); stack.unshift("QualOMS") } }]

                               
                             
                                //// maybe i can make a state which has a regex which decide
                                //// if it finds "{" or "logic" and goes depending on that.

                                //var stacktop = stack[0] == "OMSc" ? 2 : 1;
                                //if (stacktop == 1)   // "{"
                                //{
                                //    stack.shift();
                                //    stack.unshift("OMS", '}');

                                //}
                                //else if (stacktop == 2)   // "logic"
                                //{
                                //    stack.shift();
                                //    stack.unshift("QualOMS");

                                //}

                            } else if (stack[0] == "QualOMS") {

                              //  while (stack[0] == "QualOMS") {
                                    //[{ token: "string", regex: "(?=OWL)", onMatch: function (stack) { stack.shift(); stack.unshift("OWL-document", 'end') } },
                                    //{ token: "string", regex: "(?=CLIF)", onMatch: function (stack) { stack.shift(); stack.unshift("CLIF-document", 'end') } }]

                                    if (value == [{ regex: "(?=OWL)" }]) {
                                        stack.shift();
                                        stack.unshift("OWL-document", 'end')
                                    }
                                    else {
                                        stack.shift();
                                        stack.unshift("CLIF-document", 'end')
                                    }
                                //}

                                // same as previous comment
                                //var nextlogic = stack[0] == "QualOMS" ? 2 : 1;
                                //if (nextlogic = 1) //"OWL"
                                //{
                                //    stack.shift();
                                //    stack.unshift("OWL-document", 'end');
                                //}
                                //else if (nextlogic = 2) {
                                //    stack.shift();
                                //    stack.unshift("CLIF-document", 'end');
                                //}
                            } else if (stack[0] == "OWL-document") {
                                this.embedRules(OwlHighlightRules, "owl-",        // i guess we need to go to OWL and write the getendRule there too
                                     [OwlHighlightRules.getEndRule("start")]);
                            } else if (stack[0] == "CLIF-document") {
                                this.embedRules(CLifHighlightRules, "clif-",
                                     [CLifHighlightRules.getEndRule("start")]);
                            } else if (stack[0] == 'end') {
                                stack.shift();
                            } else if (stack[0] == '}') {
                                stack.shift();
                            } else if (stack[0] == "Transition") {
                                stack.shift();
                            } else if (stack[0] == "Union") {
                                stack.shift();
                            } else if (stack[0] == "Extention") {
                                stack.shift();
                            }
                            //var offset = val == "OMS" ? stack.unshift("OMS") : "";
                            //if (stack[0] == "OMS") 
                            //    stack.unshift("OMSa", "Extension");
                            //    if (stack[0] == "OMSa" && stack[1] == "Extention")
                            //        stack.unshift("OMSb", "Union", );

                        }
                      // return stack; 
                    }, nextState: "start"
		    });
		   
		}
		//this.embedRules(OwlHighlightRules, "owl-",
        //                     [OwlHighlightRules.getEndRule("start")]);
		
		//this.embedRules(CLifHighlightRules, "clif-",
        //                    [CLifHighlightRules.getEndRule("start")]);
		
		    //for (var i in this.$rules) {
		    //    this.$rules[i].unshift({
		    //        token: "keyword",
		    //        regex: "^",
		    //        next: "owl-start"
		    //    });
		    //}

		    //this.embedRules(OwlHighlightRules, "owl-", [
            //{
            //    token: "keyword",
            //    regex: "$",
            //    next: "start"
            //}]);
		

		    
		       
		  
	

	
		this.normalizeRules();
		};
  
		oop.inherits(DolHighlightRules, TextHighlightRules);

		exports.DolHighlightRules = DolHighlightRules;
});