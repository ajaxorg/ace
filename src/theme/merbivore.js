exports.isDark = true;
exports.cssClass = "ace-merbivore";
exports.cssText = require("./merbivore-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
