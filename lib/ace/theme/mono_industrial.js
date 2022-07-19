exports.isDark = true;
exports.cssClass = "ace-mono-industrial";
exports.cssText = require("../requirejs/text!./mono_industrial.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
