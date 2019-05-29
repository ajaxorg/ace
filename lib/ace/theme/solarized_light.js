exports.isDark = false;
exports.cssClass = "ace-solarized-light";
exports.cssText = require("./solarized_light.css.js");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
