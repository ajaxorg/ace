require.def("ace/theme/%name%",
    ["ace/lib/dom"], function(dom) {

    var cssText = %css%;
    
    // import CSS once
    dom.importCssString(cssText);
    
    return {
        cssClass: "%cssClass%"
    };
})