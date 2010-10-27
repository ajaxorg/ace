require.def("ace/theme/Eclipse",
    ["ace/lib/dom", "text!ace/theme/eclipse.css"], function(dom, cssText) {
        
    // import CSS once
    dom.importCssString(cssText);

    return {
        cssClass: "ace-eclipse"
    };
})