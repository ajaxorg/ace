"use strict";

exports.isDark = false;
exports.cssText = require("./eclipse.css.js");

exports.cssClass = "ace-eclipse";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
