exports.isDark = true;
  exports.cssClass = "ace-cloud9-night";
  exports.cssText = require("./cloud9_night-css");

  var dom = require("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
