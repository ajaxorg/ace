define(function(require, exports, module) {

require("pilot/fixoldbrowsers");
var async = require("asyncjs");
var dom = require("pilot/dom");

var passed = 0
var failed = 0
var log = document.getElementById("log")

async.concat(
    require("./anchor_test"),
    require("./change_document_test"),
    require("./document_test"),
    require("./edit_session_test"),
    require("./event_emitter_test"),
    require("./navigation_test"),
    require("./range_test"),
    require("./search_test"),
    require("./selection_test"),
    require("./text_edit_test"),
    require("./virtual_renderer_test"),
    require("./highlight_selected_word_test"),
    require("./mode/css_test"),
    require("./mode/css_tokenizer_test"),
    require("./mode/html_test"),
    require("./mode/html_tokenizer_test"),
    require("./mode/javascript_test"),
    require("./mode/javascript_tokenizer_test"),
    require("./mode/text_test"),
    require("./mode/xml_test"),
    require("./mode/xml_tokenizer_test")
)
    .run()
    .each(function(test, next) {
        var node = document.createElement("div");
        node.className = test.passed ? "passed" : "failed";
        
        var name = test.name
        if (test.suiteName)
            name = test.suiteName + ": " + test.name
            
        var msg = "[" + test.count + "/" + test.index + "] " + name + " " + (test.passed ? "OK" : "FAIL")
        if (!test.passed) {
            if (test.err.stack)
                var err = test.err.stack
            else
                var err = test.err
            
            msg += "<pre class='error'>" + err + "</pre>";
        }
        
        node.innerHTML = msg;
        log.appendChild(node);

        next()
    })
    .each(function(test) {
        if (test.passed)
            passed += 1
        else
            failed += 1
    })
    .end(function() {
        log.innerHTML += [
            "<div class='summary'>",
            "<br>",
            "Summary: <br>",
            "<br>",
            "Total number of tests: " + (passed + failed) + "<br>",
            (passed ? "Passed tests: " + passed + "<br>" : ""),
            (failed ? "Failed tests: " + failed + "<br>" : "")
        ].join("")
    })

});
