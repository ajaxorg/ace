if (typeof ace == "undefined" && typeof require == "undefined") {
    document.body.innerHTML = "<p style='padding: 20px 50px;'>couldn't find ace.js file, <br>"
        + "to build it run <code>node Makefile.dryice.js full<code>"
} else if (typeof ace == "undefined" && typeof require != "undefined") {
    require(["ace/ace"], function() {
        setValue();
    });
    require(["ace/config"], function() {
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
    });
    loadAceLinters();
}

function loadAceLinters() {
    if (typeof  define == "function" && define.amd) {
         require([
            "https://mkslanc.github.io/ace-linters/build/ace-linters.js"
        ], function(m) {
            addLinters(m.LanguageProvider);
        });
    } else {
        require("ace/lib/net").loadScript(
            "https://mkslanc.github.io/ace-linters/build/ace-linters.js", 
            function() {
                addLinters(window.LanguageProvider);
            }
        ) 
    }
    function addLinters(LanguageProvider) {
        var languageProvider = LanguageProvider.fromCdn("https://mkslanc.github.io/ace-linters/build", {
            functionality: {
                hover: true,
                completion: {
                    overwriteCompleters: false
                },
                completionResolve: true,
                format: true,
                documentHighlights: true,
                signatureHelp: false
            }
        });
        window.languageProvider = languageProvider;
        document.querySelectorAll(".ace_editor").forEach(function(el) {
            var editor = el.env && el.env.editor;
            if (editor) {
                editor.setOption("enableBasicAutocompletion", true)
                languageProvider.registerEditor(editor);
            }
        });
    }
}

