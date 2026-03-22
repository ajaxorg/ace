var oop = require("../lib/oop");
var TextMode = require("../mode/text").Mode;
var MariadbHighlightRules = require("./mariadb_highlight_rules").MariadbHighlightRules;

var Mode = function() {
    this.HighlightRules = MariadbHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {       
    this.lineCommentStart = ["--", "#"]; // todo space
    this.blockComment = {start: "/*", end: "*/"};

    this.$id = "ace/mode/mariadb";
}).call(Mode.prototype);

exports.Mode = Mode;
