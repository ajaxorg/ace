"use strict";

var Rules = require("./abap_highlight_rules").AbapHighlightRules;
var FoldMode = require("./folding/coffee").FoldMode;
var Range = require("../range").Range;
var TextMode = require("./text").Mode;
var oop = require("../lib/oop");

function Mode() {
    this.HighlightRules = Rules;
    this.foldingRules = new FoldMode();
}

oop.inherits(Mode, TextMode);

(function() {
    
    this.lineCommentStart = '"';
    
    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);
        return indent;
    };    
    
    this.$id = "ace/mode/abap";
}).call(Mode.prototype);

exports.Mode = Mode;
