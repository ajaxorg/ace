"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var SlimHighlightRules = require("./slim_highlight_rules").SlimHighlightRules;

var Mode = function() {
    TextMode.call(this);
    this.HighlightRules = SlimHighlightRules;
    this.createModeDelegates({
        javascript: require("./javascript").Mode,
        markdown: require("./markdown").Mode,
        coffee: require("./coffee").Mode,
        scss: require("./scss").Mode,
        sass: require("./sass").Mode,
        less: require("./less").Mode,
        ruby: require("./ruby").Mode,
        css: require("./css").Mode
    });
};

oop.inherits(Mode, TextMode);

(function() {

    this.$id = "ace/mode/slim";
}).call(Mode.prototype);

exports.Mode = Mode;
