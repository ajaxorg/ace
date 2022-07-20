"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var AsciidocHighlightRules = require("./asciidoc_highlight_rules").AsciidocHighlightRules;
var AsciidocFoldMode = require("./folding/asciidoc").FoldMode;

var Mode = function() {
    this.HighlightRules = AsciidocHighlightRules;
    
    this.foldingRules = new AsciidocFoldMode();    
};
oop.inherits(Mode, TextMode);

(function() {
    this.type = "text";
    this.getNextLineIndent = function(state, line, tab) {
        if (state == "listblock") {
            var match = /^((?:.+)?)([-+*][ ]+)/.exec(line);
            if (match) {
                return new Array(match[1].length + 1).join(" ") + match[2];
            } else {
                return "";
            }
        } else {
            return this.$getIndent(line);
        }
    };
    this.$id = "ace/mode/asciidoc";
}).call(Mode.prototype);

exports.Mode = Mode;
