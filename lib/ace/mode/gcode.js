"use strict";

    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var GcodeHighlightRules = require("./gcode_highlight_rules").GcodeHighlightRules;
    var Range = require("../range").Range;

    var Mode = function() {
        this.HighlightRules = GcodeHighlightRules;
        this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        this.$id = "ace/mode/gcode";
    }).call(Mode.prototype);

    exports.Mode = Mode;
