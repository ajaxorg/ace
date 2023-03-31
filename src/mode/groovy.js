"use strict";

var oop = require("../lib/oop");
var JavaScriptMode = require("./javascript").Mode;
var GroovyHighlightRules = require("./groovy_highlight_rules").GroovyHighlightRules;
var DocCommentBehaviour = require("../mode/behaviour/doc_comment").DocCommentBehaviour;

var Mode = function() {
    JavaScriptMode.call(this);
    this.HighlightRules = GroovyHighlightRules;
    this.$behaviour = new DocCommentBehaviour();
};
oop.inherits(Mode, JavaScriptMode);

(function() {

    this.createWorker = function(session) {
        return null;
    };

    this.$id = "ace/mode/groovy";
}).call(Mode.prototype);

exports.Mode = Mode;
