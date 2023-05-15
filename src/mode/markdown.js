"use strict";

var oop = require("../lib/oop");
var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;
var TextMode = require("./text").Mode;
var MarkdownHighlightRules = require("./markdown_highlight_rules").MarkdownHighlightRules;
var MarkdownFoldMode = require("./folding/markdown").FoldMode;

var Mode = function() {
    this.HighlightRules = MarkdownHighlightRules;

    this.createModeDelegates({
        javascript: require("./javascript").Mode,
        html: require("./html").Mode,
        bash: require("./sh").Mode,
        sh: require("./sh").Mode,
        xml: require("./xml").Mode,
        css: require("./css").Mode
    });

    this.foldingRules = new MarkdownFoldMode();
    this.$behaviour = new CstyleBehaviour({ braces: true });
};
oop.inherits(Mode, TextMode);

(function() {
    this.type = "text";
    this.blockComment = {start: "<!--", end: "-->"};
    this.$quotes = {'"': '"', "`": "`"};

    this.getNextLineIndent = function(state, line, tab) {
        if (state == "listblock") {
            var match = /^(\s*)(?:([-+*])|(\d+)\.)(\s+)/.exec(line);
            if (!match)
                return "";
            var marker = match[2];
            if (!marker)
                marker = parseInt(match[3], 10) + 1 + ".";
            return match[1] + marker + match[4];
        } else {
            return this.$getIndent(line);
        }
    };
    this.$id = "ace/mode/markdown";
    this.snippetFileId = "ace/snippets/markdown";
}).call(Mode.prototype);

exports.Mode = Mode;
