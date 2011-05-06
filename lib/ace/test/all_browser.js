define(function(require, exports, module) {

require("pilot/fixoldbrowsers");
var AsyncTest = require("asyncjs/test");
var async = require("asyncjs");
var dom = require("pilot/dom");

var passed = 0
var failed = 0
var log = document.getElementById("log")

var tests = [
     require("ace/editor_change_document_test"),
     require("ace/editor_navigation_test"),
     require("ace/editor_highlight_selected_word_test"),
     require("ace/editor_text_edit_test"),
     require("ace/document_test"),
     require("ace/edit_session_test"),
     require("ace/test/event_emitter_test"),
     require("ace/range_test"),
     require("ace/search_test"),
     require("ace/selection_test"),
     require("ace/virtual_renderer_test"),
     require("ace/anchor_test"),
     require("ace/mode/css_test"),
     require("ace/mode/css_tokenizer_test"),
     require("ace/mode/html_test"),
     require("ace/mode/html_tokenizer_test"),
     require("ace/mode/javascript_test"),
     require("ace/mode/javascript_tokenizer_test"),
     require("ace/mode/text_test"),
     require("ace/mode/xml_test"),
     require("ace/mode/xml_tokenizer_test")
]

async.list(tests)
    .expand(function(test) {
        return AsyncTest.testcase(test)
    }, AsyncTest.TestGenerator)
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

            console.error(msg);
            console.error(err);
            msg += "<pre class='error'>" + err + "</pre>";
        } else {
            console.log(msg);
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
        console.log("Total number of tests: " + (passed + failed));
        console.log("Passed tests: " + passed);
        console.log("Failed tests: " + failed);
    })

});
