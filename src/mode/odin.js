var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var OdinHighlightRules =
  require("./odin_highlight_rules").OdinHighlightRules;
var MatchingBraceOutdent =
  require("./matching_brace_outdent").MatchingBraceOutdent;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;

var Mode = function () {
  this.HighlightRules = OdinHighlightRules;
  this.$outdent = new MatchingBraceOutdent();
  this.foldingRules = new CStyleFoldMode();
  this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function () {
  this.lineCommentStart = "//";
  this.blockComment = { start: "/*", end: "*/" };

  this.getNextLineIndent = function (state, line, tab) {
    var indent = this.$getIndent(line);

    var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
    var tokens = tokenizedLine.tokens;

    if (tokens.length && tokens[tokens.length - 1].type == "comment") {
      return indent;
    }

    if (state == "start") {
      var match = line.match(/^.*[\{\(\[:]\s*$/);
      if (match) {
        indent += tab;
      }
    }

    return indent;
  }; //end getNextLineIndent

  this.checkOutdent = function (state, line, input) {
    return this.$outdent.checkOutdent(line, input);
  };

  this.autoOutdent = function (state, doc, row) {
    this.$outdent.autoOutdent(doc, row);
  };

  this.$id = "ace/mode/odin";
}).call(Mode.prototype);

exports.Mode = Mode;
