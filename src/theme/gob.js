exports.isDark = true;
exports.cssClass = "ace-gob";
exports.cssText = require("./gob-css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
