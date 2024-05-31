"use strict";

var oop = require("../lib/oop");
var MarkdownBehaviour = require("./behaviour/markdown").MarkdownBehaviour;
var TextMode = require("./text").CustomMode;
var MarkdownHighlightRules = require("./markdown_highlight_rules").MarkdownHighlightRules;
var MarkdownFoldMode = require("./folding/markdown").FoldMode;

var Mode = function() {
    this.HighlightRules = MarkdownHighlightRules;

/*    this.createModeDelegates({
        javascript: require("./javascript").Mode,
        html: require("./html").Mode,
        bash: require("./sh").Mode,
        sh: require("./sh").Mode,
        xml: require("./xml").Mode,
        css: require("./css").Mode
    });*/

    this.foldingRules = new MarkdownFoldMode();
    this.$behaviour = new MarkdownBehaviour({braces: true});
};
oop.inherits(Mode, TextMode);

(function() {
    this.type = "text";
    this.$quotes = {'"': '"', "`": "`"};

    this.getNextLineIndent = function (scope, line, tab) {
        if (scope.parent && scope.parent.name === "listBlock") {
            var match = /^(\s*)(?:([-+*](?:\s\[[ x]\])?)|(\d+)\.)(\s+)/.exec(line);
            if (!match) return "";
            var marker = match[2];
            if (!marker) marker = parseInt(match[3], 10) + 1 + ".";
            return match[1] + marker + match[4];
        }
        else {
            return this.$getIndent(line);
        }
    };
    this.$id = "ace/mode/markdown";
    this.snippetFileId = "ace/snippets/markdown";
}).call(Mode.prototype);

exports.Mode = Mode;
