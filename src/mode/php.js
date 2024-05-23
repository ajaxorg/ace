"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var PhpHighlightRules = require("./php_highlight_rules").PhpHighlightRules;
var PhpLangHighlightRules = require("./php_highlight_rules").PhpLangHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var WorkerClient = require("../worker/worker_client").WorkerClient;
var PhpCompletions = require("./php_completions").PhpCompletions;
var PhpFoldMode = require("./folding/php").FoldMode;
var unicode = require("../unicode");
var MixedFoldMode = require("./folding/mixed").FoldMode;
var HtmlFoldMode = require("./folding/html").FoldMode;
var CstyleFoldMode = require("./folding/cstyle").FoldMode;
var HtmlMode = require("./html").Mode;
var JavaScriptMode = require("./javascript").Mode;
var CssMode = require("./css").Mode;

var PhpMode = function(opts) {
    this.HighlightRules = PhpLangHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = this.$defaultBehaviour;
    this.$completer = new PhpCompletions();
    this.foldingRules = new MixedFoldMode(new HtmlFoldMode(), {
        "js-": new CstyleFoldMode(),
        "css-": new CstyleFoldMode(),
        "php-": new PhpFoldMode()
    });
};
oop.inherits(PhpMode, TextMode);

(function() {

    this.tokenRe = new RegExp("^[" + unicode.wordChars + "_]+", "g");
    this.nonTokenRe = new RegExp("^(?:[^" + unicode.wordChars + "_]|\\s])+", "g");

    this.lineCommentStart = ["//", "#"];
    this.blockComment = {start: "/*", end: "*/"};

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[:]\s*$/);
            if (match) {
                indent += tab;
            }
        } else if (state == "doc-start") {
            if (endState != "doc-start") {
                return "";
            }
            var match = line.match(/^\s*(\/?)\*/);
            if (match) {
                if (match[1]) {
                    indent += " ";
                }
                indent += "* ";
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

    this.getCompletions = function(state, session, pos, prefix) {
        return this.$completer.getCompletions(state, session, pos, prefix);
    };

    this.$id = "ace/mode/php-inline";
}).call(PhpMode.prototype);

var Mode = function(opts) {
    if (opts && opts.inline) {
        var mode = new PhpMode();
        mode.createWorker = this.createWorker;
        mode.inlinePhp = true;
        return mode;
    }
    HtmlMode.call(this);
    this.HighlightRules = PhpHighlightRules;
    this.createModeDelegates({
        "js-": JavaScriptMode,
        "css-": CssMode,
        "php-": PhpMode
    });
    this.foldingRules = new MixedFoldMode(new HtmlFoldMode(), {
        "js-": new CstyleFoldMode(),
        "css-": new CstyleFoldMode(),
        "php-": new PhpFoldMode()
    });
};
oop.inherits(Mode, HtmlMode);

(function() {

    this.createWorker = function(session) {
        var worker = new WorkerClient(["ace"], "ace/mode/php_worker", "PhpWorker");
        worker.attachToDocument(session.getDocument());

        if (this.inlinePhp)
            worker.call("setOptions", [{inline: true}]);

        worker.on("annotate", function(e) {
            session.setAnnotations(e.data);
        });

        worker.on("terminate", function() {
            session.clearAnnotations();
        });

        return worker;
    };

    this.$id = "ace/mode/php";
    this.snippetFileId = "ace/snippets/php";
}).call(Mode.prototype);

exports.Mode = Mode;
