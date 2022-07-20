var oop = require("../lib/oop");
var TextMode = require("../mode/text").Mode;
var MysqlHighlightRules = require("./mysql_highlight_rules").MysqlHighlightRules;

var Mode = function() {
    this.HighlightRules = MysqlHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {       
    this.lineCommentStart = ["--", "#"]; // todo space
    this.blockComment = {start: "/*", end: "*/"};

    this.$id = "ace/mode/mysql";
}).call(Mode.prototype);

exports.Mode = Mode;
