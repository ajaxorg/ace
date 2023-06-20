"use strict";

exports.isDark = false;
exports.cssClass = "ace-tm";
exports.cssText = require("./textmate-css");
exports.$id = "ace/theme/textmate";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);
