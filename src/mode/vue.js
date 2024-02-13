"use strict";

var oop = require("../lib/oop");
var HTMLMode = require("./html").Mode;
var VueHighlightRules = require("./vue_highlight_rules").VueHighlightRules;

var Mode = function () {
    this.HighlightRules = VueHighlightRules;

};
oop.inherits(Mode, HTMLMode);

(function () {
    this.createWorker = function (session) {
        return null;
    };
    this.$id = "ace/mode/vue";
}).call(Mode.prototype);

exports.Mode = Mode;
