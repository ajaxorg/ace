exports.isDark = true;
exports.cssClass = "ace-vibrant-ink";
exports.cssText = require("./vibrant_ink-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
