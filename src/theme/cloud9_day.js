"use strict";

  exports.isDark = false;
  exports.cssClass = "ace-cloud9-day";
  exports.cssText = require("./cloud9_day-css");

  var dom = require("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
