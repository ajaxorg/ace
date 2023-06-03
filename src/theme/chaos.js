exports.isDark = true;
exports.cssClass = "ace-chaos";
exports.cssText = require("./chaos-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
