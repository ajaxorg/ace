define(function(require, exports, module) {
    var dom = require("./lib/dom");
    var cssText = %css%;
    
    // import CSS once
    dom.importCssString(cssText);
    
    return {
        cssClass: "%cssClass%"
    };
})