define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var pdms_pmlHighlightRules = function() {



    var keywords =  "add|any|as|and|all|alpha|auto|array|autocon|append|"+
                    "aspect|after|alert|about|apply|break|boolean|bran|"+
                    "backward|backwards|before|by|block|call|close|"+
                    "closefile|collect|ce|callback|colour|current|conn|"+
                    "connect|compose|clock|cancel|copy|define|do|descend|"+
                    "database|draft|design|else|elseif|end|enddo|endmethod|"+
                    "endif|explicit|external|endhandle|eq|eval|elsehandle|"+
                    "endfunction|evar|enhance|evaluate|exists|for|function|"+
                    "false|from|forward|forwards|first|file|fullname|free"+
                    "golabel|gt|ge|goto|gadget|handle|hide|href|hpos|height|"+
                    "horizontal|if|implements|is|indices|icontitle|initcall|"+
                    "include|kill|let|lineinput|lock|lset|lt|le|label|last|"+
                    "len|length|lines|load|lowcase|method|member|mem|"+
                    "multiple|name|namn|next|ne|numeric|none|not|new|noalert|"+
                    "onerror|on|openfile|open|or|overwrite|of|owner|object|"+
                    "orientation|prev|pipe|paragon|plot|pairs|pml|return|"+
                    "real|replace|ref|resize|reindex|reload|rotate|rename|"+
                    "savepicture|savesetting|sendkeys|setattr|static|sub|"+
                    "string|send|start|substring|sort|show|skip|same|split|"+
                    "session|size|savework|spaces|then|true|to|tref|tpos|"+
                    "time|type|through|unlock|unenhance|update|upcase|var|"+
                    "valign|values|while|width|with|write|writefile|zone|"+
                    "SortedIndices|SetEditable|SetFocus";

  
    var storageType =   "at|abs|button|bar|channel|down|exit|frame|form|hdist|"+
                        "init|initcall|list|left|menu|option|para|paragraph|"+
                        "path|position|radio|rgroup|right|selector|setup|"+
                        "this|text|toggle|title|up|view|vdist|wrt|world";
    
    var storageModifiers = "array|constant";

    var keywordOperators = "defined|error|match|part|unset|undefined|trim";
    
    
    var builtinConstants = (
        "true|false|null"
    );


    var keywordMapper = this.createKeywordMapper({
        "keyword.operator": keywordOperators,
        "keyword": keywords,
        "constant.language": builtinConstants,
        "storage.modifier": storageModifiers,
        "storage.type": storageType
    }, "identifier", true);

    this.$rules = {
        "start" : [ {
            token : "comment",
            regex : "--.*$"
        }, {
            token : "string",           // " string
            regex : '".*?"'
        }, {
            token : "string",           // ' string
            regex : "'.*?'"
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : "keyword", // pre-compiler directives
            regex : "\\s*(?:library|package|use)\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "&|\\*|\\+|\\-|\\$|\\!|\\/|<|=|>|\\||=>|\\*\\*|:=|\\/=|>=|<=|<>" 
        }, {
              token : "punctuation.operator",
              regex : "\\'|\\:|\\,|\\;|\\."
        },{
            token : "paren.lparen",
            regex : "[[(]"
        }, {
            token : "paren.rparen",
            regex : "[\\])]"
        }, {
            token : "text",
            regex : "\\s+"
        } ]

       
    };
};

oop.inherits(pdms_pmlHighlightRules, TextHighlightRules);

exports.pdms_pmlHighlightRules = pdms_pmlHighlightRules;
});
