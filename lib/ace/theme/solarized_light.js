exports.isDark = false;
exports.cssClass = "ace-solarized-light";
exports.cssText = require("../requirejs/text!./solarized_light.css");

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
