"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var SqlHighlightRules = require("./sql_highlight_rules").SqlHighlightRules;
var SqlFoldMode = require("./folding/sql").FoldMode;

var Mode = function() {
    this.HighlightRules = SqlHighlightRules;
    this.foldingRules = new SqlFoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "--";
    this.blockComment = {start: "/*", end: "*/"};

    this.$id = "ace/mode/sql";
    this.snippetFileId = "ace/snippets/sql";
}).call(Mode.prototype);

exports.Mode = Mode;
