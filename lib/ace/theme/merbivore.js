exports.isDark = true;
exports.cssClass = "ace-merbivore";
exports.cssText = require("../requirejs/text!./merbivore.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
