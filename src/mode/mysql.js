var oop = require("../lib/oop");
var TextMode = require("../mode/text").Mode;
var MysqlHighlightRules = require("./mysql_highlight_rules").MysqlHighlightRules;
var DocCommentBehaviour = require("../mode/behaviour/doc_comment").DocCommentBehaviour;

var Mode = function() {
    this.HighlightRules = MysqlHighlightRules;
    this.$behaviour = new DocCommentBehaviour();
};
oop.inherits(Mode, TextMode);

(function() {       
    this.lineCommentStart = ["--", "#"]; // todo space
    this.blockComment = {start: "/*", end: "*/"};

    this.$id = "ace/mode/mysql";
}).call(Mode.prototype);

exports.Mode = Mode;
