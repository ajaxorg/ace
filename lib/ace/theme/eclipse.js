define(["require", "exports", "module", "text!ace/theme/eclipse.css", "../lib/dom"], 
    function(require, exports, module, cssText) {

    var dom = require("../lib/dom");
        
    // import CSS once
    dom.importCssString(cssText);

    return {
        cssClass: "ace-eclipse"
    };
})