exports.isDark = true;
    exports.cssClass = "ace-one-dark";
    exports.cssText = require("../requirejs/text!./one_dark.css");
    
    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass, false);
