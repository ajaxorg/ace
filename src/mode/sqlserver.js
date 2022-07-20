"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var SqlServerHighlightRules = require("./sqlserver_highlight_rules").SqlHighlightRules;
var SqlServerFoldMode = require("./folding/sqlserver").FoldMode;

var Mode = function() {
    this.HighlightRules = SqlServerHighlightRules;
    this.foldingRules = new SqlServerFoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "--";
    this.blockComment = {start: "/*", end: "*/"};
    
    /**
     * Override keyword completions using list created in highlight rules
     */
    this.getCompletions = function(state, session, pos, prefix) {
        return session.$mode.$highlightRules.completions;
    };
    
    this.$id = "ace/mode/sqlserver";
    this.snippetFileId = "ace/snippets/sqlserver";
}).call(Mode.prototype);

exports.Mode = Mode;
