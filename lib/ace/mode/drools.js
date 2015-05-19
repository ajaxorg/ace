define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var JavaMode = require("./java").Mode;
var JavaScriptMode = require("./javascript").Mode;
var DroolsHighlightRules = require("./drools_highlight_rules").DroolsHighlightRules;

var Mode = function() {
    JavaScriptMode.call(this);
    this.HighlightRules = DroolsHighlightRules;
};
oop.inherits(Mode, JavaMode, JavaScriptMode);

(function() {
    
    this.createWorker = function(session) {
        return null;
    };

    this.$id = "ace/mode/drools";
}).call(Mode.prototype);

exports.Mode = Mode;
});
