define(function(require, exports, module) {
    var dom = require("pilot/dom");
    var cssText = %css%;

    // import CSS once
    dom.importCssString(cssText);

    return {
        cssClass: "%cssClass%"
    };
})