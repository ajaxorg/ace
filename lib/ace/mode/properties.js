"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var PropertiesHighlightRules = require("./properties_highlight_rules").PropertiesHighlightRules;

var Mode = function() {
    this.HighlightRules = PropertiesHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.$id = "ace/mode/properties";
}).call(Mode.prototype);

exports.Mode = Mode;
