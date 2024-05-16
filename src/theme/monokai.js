exports.isDark = true;
exports.cssClass = "ace-monokai";
exports.cssText = require("./monokai-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
