define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var JavaScriptMode = require("./javascript").Mode;
var GobstonesHighlightRules = require("./gobstones_highlight_rules").GobstonesHighlightRules;

var Mode = function() {
    JavaScriptMode.call(this);
    this.HighlightRules = GobstonesHighlightRules;
};
oop.inherits(Mode, JavaScriptMode);

(function() {
    
    this.createWorker = function(session) {
        return null;
    };

    this.$id = "ace/mode/gobstones";
}).call(Mode.prototype);

exports.Mode = Mode;
});

