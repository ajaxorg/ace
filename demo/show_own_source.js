if (typeof ace == "undefined" && typeof require == "undefined") {
    document.body.innerHTML = "<p style='padding: 20px 50px;'>couldn't find ace.js file, <br>"
        + "to build it run <code>node Makefile.dryice.js full<code>"
} else if (typeof ace == "undefined" && typeof require != "undefined") {
    require(["ace/ace"], function() {
        setValue();
        var config = require("ace/config");
        config.setLoader(function(moduleName, cb) {
            require([moduleName], function(module) {
                cb(null, module);
            });
        });
    })
} else {
    require = ace.require;
    setValue()
}

function setValue() {
    require("ace/lib/net").get(document.baseURI, function(text) {
        var el = document.getElementById("editor");
        el.env.editor.session.setValue(text);
    })
}
