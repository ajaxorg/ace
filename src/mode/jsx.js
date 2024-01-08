"use strict";

var oop = require("../lib/oop");
var jsMode = require("./javascript").Mode;

function Mode() {
    jsMode.call(this);
    this.$highlightRuleConfig = {jsx: true};
}
oop.inherits(Mode, jsMode);

(function() {
    // disable jshint
    this.createWorker = function() {
        return null;
    };
    this.$id = "ace/mode/jsx";
}).call(Mode.prototype);

exports.Mode = Mode;
