define(function (require, exports, module) {
	"use strict";

	var oop = require("../lib/oop");
	var HtmlMode = require("./html").Mode;
	var RazorHighlightRules = require("./razor_highlight_rules").RazorHighlightRules;

	var Mode = function () {
		this.HighlightRules = RazorHighlightRules;
	};
	oop.inherits(Mode, HtmlMode);

	(function () {
		this.createWorker = function (session) {
			return null;
		};

		this.$id = "ace/mode/razor";
	}).call(Mode.prototype);

	exports.Mode = Mode;
});
