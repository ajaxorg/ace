define(function(require, exports, module) {
    var dom = require("ace/lib/dom");
    var cssText = %css%;
    
    // import CSS once
    dom.importCssString(cssText);
    
    return {
        cssClass: "%cssClass%"
    };
})