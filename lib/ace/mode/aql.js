"use strict";

  var oop = require("../lib/oop");
  var TextMode = require("./text").Mode;
  var AqlHighlightRules = require("./aql_highlight_rules").AqlHighlightRules;

  var Mode = function() {
      this.HighlightRules = AqlHighlightRules;
      this.$behaviour = this.$defaultBehaviour;
  };
  oop.inherits(Mode, TextMode);

  (function() {

      this.lineCommentStart = "//";

      this.$id = "ace/mode/aql";
  }).call(Mode.prototype);

  exports.Mode = Mode;
