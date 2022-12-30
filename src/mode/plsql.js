"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var PlsqlHighlightRules = require("./plsql_highlight_rules").PlsqlHighlightRules;
var SqlFoldMode = require("./folding/sql").FoldMode;

var Mode = function() {
    this.HighlightRules = PlsqlHighlightRules;
    this.foldingRules = new SqlFoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "--";
    this.blockComment = {start: "/*", end: "*/"};

    this.$id = "ace/mode/plsql";
    this.snippetFileId = "ace/snippets/sql";
}).call(Mode.prototype);

exports.Mode = Mode;
