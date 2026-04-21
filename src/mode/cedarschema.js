"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var CedarSchemaHighlightRules = require("./cedarschema_highlight_rules").CedarSchemaHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = CedarSchemaHighlightRules;
    this.foldingRules = new CStyleFoldMode();
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "//";
    this.$id = "ace/mode/cedarschema";
    this.snippetFileId = "ace/snippets/cedarschema";

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);
        if (/[\{\[]\s*$/.test(line)) {
            indent += tab;
        }
        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };
}).call(Mode.prototype);

exports.Mode = Mode;
