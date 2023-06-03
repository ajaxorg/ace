exports.isDark = false;
exports.cssClass = "ace-kuroir";
exports.cssText = require("./kuroir-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
