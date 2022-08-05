"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var GraphQLSchemaHighlightRules = require("./graphqlschema_highlight_rules").GraphQLSchemaHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = GraphQLSchemaHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "#";
    this.$id = "ace/mode/graphqlschema";
    this.snippetFileId = "ace/snippets/graphqlschema";
}).call(Mode.prototype);

exports.Mode = Mode;
