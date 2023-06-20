exports.isDark = true;
exports.cssClass = "ace-merbivore-soft";
exports.cssText = require("./merbivore_soft-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
