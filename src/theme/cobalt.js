exports.isDark = true;
exports.cssClass = "ace-cobalt";
exports.cssText = require("./cobalt-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
