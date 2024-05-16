var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var HtmlMode = require("./html").Mode;
var JavascriptMode = require("./javascript").Mode;
var JsonMode = require("./json").Mode;
var CssMode = require("./css").Mode;
var LiquidHighlightRules = require("./liquid_highlight_rules").LiquidHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;

/* -------------------------------------------- */
/* FOLDS                                        */
/* -------------------------------------------- */

var FoldMode = require("./folding/cstyle").FoldMode;

/* -------------------------------------------- */
/* MODE                                         */
/* -------------------------------------------- */

var Mode = function () {

  JsonMode.call(this);
  HtmlMode.call(this);
  CssMode.call(this);
  JavascriptMode.call(this);
  this.HighlightRules = LiquidHighlightRules;
  this.foldingRules = new FoldMode();

};

oop.inherits(Mode, TextMode);

(function () {

    this.blockComment = {start: "<!--", end: "-->"};
    this.voidElements = new HtmlMode().voidElements;

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

    this.$id = "ace/mode/liquid";
    this.snippetFileId = "ace/snippets/liquid";

}.call(Mode.prototype));

exports.Mode = Mode;
