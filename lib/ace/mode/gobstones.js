define(function(require, exports) {
"use strict";

var oop = require("../lib/oop");
var JavaScriptMode = require("./javascript").Mode;
var GobstonesHighlightRules = require("./gobstones_highlight_rules").GobstonesHighlightRules;

var Mode = function() {
    JavaScriptMode.call(this);
    this.HighlightRules = GobstonesHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, JavaScriptMode);

(function() {

    this.createWorker = function() {
        return null;
    };

    this.$id = "ace/mode/gobstones";
    this.snippetFileId = "ace/snippets/gobstones";
}).call(Mode.prototype);

exports.Mode = Mode;
});

