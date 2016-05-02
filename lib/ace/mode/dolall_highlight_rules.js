
define(function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var lang = require("../lib/lang");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
   
   
    var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;
   
    var OwlHighlightRules = require("./owl_highlight_rules").OwlHighlightRules;
    var ClifHighlightRules = require("./clif_highlight_rules").ClifHighlightRules;
    var DolHighlightRules = require("./dol_highlight_rules").DolHighlightRules;

    function github_new(tag, prefix) {
        return { // Github style block
            token: "support.function",
            regex: tag,     // start of tag (clif or owl or dol) code
            push: prefix + "start"
        };
    }

    var DolAllHighlightRules = function () {
        HtmlHighlightRules.call(this);
      
        this.$rules["start"].unshift(
       
           github_new("lang:OWL2", "owl-"),
           github_new("ser:CommonLogic", "clif-"),
           github_new("(?:^%prefix)", "dol-")
        
        );
        this.embedRules(OwlHighlightRules, "owl-", [{
            token: "support.function",
            regex: "logic\\slog:C",
            next: "pop"
        }]);
        this.embedRules(DolHighlightRules, "dol-", [{
            token: "support.function",
            regex: "PropositionalMereology",
            next: "pop"
        }]);
        this.embedRules(ClifHighlightRules, "clif-", [{
            token: "support.function",
            regex: "^\\s*```",      //end of clif code
            next: "pop"
        }]);
        this.normalizeRules();
    };
    oop.inherits(DolAllHighlightRules, TextHighlightRules);

    exports.DolAllHighlightRules = DolAllHighlightRules;
});
