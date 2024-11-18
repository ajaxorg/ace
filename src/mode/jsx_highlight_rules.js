"use strict";

var oop = require("../lib/oop");
var JavaScriptHighlightRules = require("./javascript_highlight_rules").JavaScriptHighlightRules;


var JsxHighlightRules = function () {
  JavaScriptHighlightRules.call(this, {
    jsx: true
  });
};
oop.inherits(JsxHighlightRules, JavaScriptHighlightRules);

exports.JsxHighlightRules = JsxHighlightRules;