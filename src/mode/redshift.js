var oop = require("../lib/oop");
var TextMode = require("../mode/text").Mode;
var RedshiftHighlightRules = require("./redshift_highlight_rules").RedshiftHighlightRules;
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = RedshiftHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "--";
    this.blockComment = {start: "/*", end: "*/"};

    this.getNextLineIndent = function(state, line, tab) { 
        if (state == "start" || state == "keyword.statementEnd") {
            return "";
        } else {
            return this.$getIndent(line); // Keep whatever indent the previous line has
        }
    };

    this.$id = "ace/mode/redshift";
}).call(Mode.prototype);

exports.Mode = Mode;
