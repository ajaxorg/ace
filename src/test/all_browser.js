"use strict";

require("ace/lib/fixoldbrowsers");
var mockdom = require("../test/mockdom");
var AsyncTest = require("asyncjs").test;
var async = require("asyncjs");

var passed = 0;
var failed = 0;
var log = document.getElementById("log");
var el = document.createElement.bind(document);

var testNames = [
    "ace/ace_test",
    "ace/anchor_test",
    "ace/autocomplete_test",
    "ace/background_tokenizer_test",
    "ace/commands/command_manager_test",
    "ace/config_test",
    "ace/document_test",
    "ace/edit_session_test",
    "ace/editor_change_document_test",
    "ace/editor_highlight_selected_word_test",
    "ace/editor_navigation_test",
    "ace/editor_text_edit_test",
    "ace/editor_commands_test",
    "ace/ext/hardwrap_test",
    "ace/ext/static_highlight_test",
    "ace/ext/whitespace_test",
    "ace/ext/error_marker_test",
    "ace/ext/code_lens_test",
    "ace/ext/beautify_test",
    "ace/incremental_search_test",
    "ace/keyboard/emacs_test",
    "ace/keyboard/textinput_test",
    "ace/keyboard/keybinding_test",
    "ace/keyboard/vim_test",
    "ace/keyboard/vim_ace_test",
    "ace/keyboard/sublime_test",
    "ace/layer/text_test",
    "ace/lib/event_emitter_test",
    "ace/mode/coffee/parser_test",
    "ace/mode/coldfusion_test",
    "ace/mode/css_test",
    "ace/mode/css_worker",
    "ace/mode/html_test",
    "ace/mode/javascript_test",
    "ace/mode/javascript_worker_test",
    "ace/mode/logiql_test",
    "ace/mode/python_test",
    "ace/mode/text_test",
    "ace/mode/xml_test",
    "ace/mode/folding/fold_mode_test",
    "ace/mode/folding/cstyle_test",
    "ace/mode/folding/html_test",
    "ace/mode/folding/pythonic_test",
    "ace/mode/folding/xml_test",
    "ace/mode/folding/coffee_test",
    "ace/mode/behaviour/behaviour_test",
    "ace/multi_select_test",
    "ace/mouse/mouse_handler_test",
    "ace/occur_test",
    "ace/placeholder_test",
    "ace/range_test",
    "ace/range_list_test",
    "ace/search_test",
    "ace/selection_test",
    "ace/snippets_test",
    "ace/token_iterator_test",
    "ace/tokenizer_test",
    "ace/test/mockdom_test",
    "ace/undomanager_test",
    "ace/virtual_renderer_test",
    "ace/mode/yaml_worker_test"
];

var html = ["<a href='?'>all tests</a><br>"];
for (var i in testNames) {
    var href = testNames[i];
    html.push("<a href='?", href, "'>", href.replace(/^ace\//, "") ,"</a><br>");
}

var nav = el("div");
nav.innerHTML = html.join("");
nav.style.cssText = "position:absolute;right:0;top:0";
document.body.appendChild(nav);


if (location.search.indexOf("show=1") != -1) {
    require(["ace/virtual_renderer", "ace/test/mockrenderer"], function(real, mock) {
        var VirtualRenderer = real.VirtualRenderer;
        mock.MockRenderer = function() {
            var el = document.createElement("div");
            el.style.position = "fixed";
            el.style.left = "20px";
            el.style.top = "30px";
            el.style.width = "500px";
            el.style.height = "300px";
            document.body.appendChild(el);
            
            return new VirtualRenderer(el);
        };
    });
}

if (location.search.indexOf("mock=1") != -1) {
    mockdom.loadInBrowser(window);
}


if (location.search) {
    var parts = location.search.split(/[&?]|\w+=\w+/).filter(Boolean);
    if (parts[0])
        testNames = parts[0].split(",");
}
var filter = location.hash.substr(1);
window.onhashchange = function() { location.reload(); };

require(testNames, function() {
    var tests = testNames.map(function(x) {
        var module = require(x);
        module.href = x;
        return module;
    });

    async.list(tests)
        .expand(function(test) {
            if (filter) {
                Object.keys(test).forEach(function(method) {
                    if (method.match(/^>?test/) && !method.match(filter))
                        test[method] = undefined;
                });
            }
            return AsyncTest.testcase(test);
        }, AsyncTest.TestGenerator)
        .run()
        .each(function(test, next) {
            if (test.index == 1 && test.context.href) {
                var href = test.context.href;
                var node = el("div");
                node.innerHTML = "<a href='?" + href + "'>" + href.replace(/^ace\//, "") + "</a>";
                log.appendChild(node);
            }
            var node = el("div");
            node.className = test.passed ? "passed" : "failed";

            var name = test.name;
            if (test.suiteName)
                name = test.suiteName + ": " + test.name;

            var msg = "[" + test.count + "/" + test.index + "] " + name + " " + (test.passed ? "OK" : "FAIL");
            if (!test.passed) {
                if (test.err.stack)
                    var err = test.err.stack;
                else
                    var err = test.err;

                console.error(msg);
                console.error(err);
                msg += "<pre class='error'>" + err + "</pre>";
            } else {
                console.log(msg);
            }

            node.innerHTML = msg;
            log.appendChild(node);

            next();
        })
        .each(function(test) {
            if (test.passed)
                passed += 1;
            else
                failed += 1;
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
            ].join("");
            console.log("Total number of tests: " + (passed + failed));
            console.log("Passed tests: " + passed);
            console.log("Failed tests: " + failed);
        });
});
