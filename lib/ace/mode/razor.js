define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var HtmlMode = require("./html").Mode;
var RazorHighlightRules = require("./razor_highlight_rules").RazorHighlightRules;
var RazorCompletions = require("./razor_completions").RazorCompletions;
var HtmlCompletions = require("./html_completions").HtmlCompletions;

var Mode = function() {
    HtmlMode.call(this);
    this.$highlightRules = new RazorHighlightRules();
    this.$completer = new RazorCompletions();
    this.$htmlCompleter = new HtmlCompletions();
};
oop.inherits(Mode, HtmlMode);

(function() {
    this.getCompletions = function(state, session, pos, prefix) {
        var razorToken = this.$completer.getCompletions(state, session, pos, prefix);
        var htmlToken = this.$htmlCompleter.getCompletions(state, session, pos, prefix);
        return razorToken.concat(htmlToken);
    };
    
    this.createWorker = function(session) {
        return null;
    };

    this.$id = "ace/mode/razor";
}).call(Mode.prototype);

exports.Mode = Mode;
});
