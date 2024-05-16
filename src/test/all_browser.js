"use strict";

require("ace/lib/fixoldbrowsers");
var mockdom = require("../test/mockdom");
var AsyncTest = require("asyncjs").test;
var async = require("asyncjs");
var buildDom = require("../lib/dom").buildDom;
var escapeRegExp = require("ace/lib/lang").escapeRegExp;

var useMockdom = location.search.indexOf("mock=1") != -1;
var forceShow = location.search.indexOf("show=1") != -1;

var passed = 0;
var failed = 0;
var log = document.getElementById("log");

// change buildDom to use real document in mockdom 
var createElement = document.createElement.bind(document);
var createTextNode = document.createTextNode.bind(document);
var buildDom = eval("(" + buildDom.toString().replace(/document\./g, "") + ")");

var testNames = [
    "ace/ace_test",
    "ace/anchor_test",
    "ace/autocomplete/popup_test",
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
    "ace/ext/command_bar_test",
    "ace/ext/hardwrap_test",
    "ace/ext/inline_autocomplete_test",
    "ace/ext/static_highlight_test",
    "ace/ext/whitespace_test",
    "ace/ext/error_marker_test",
    "ace/ext/code_lens_test",
    "ace/ext/beautify_test",
    "ace/ext/simple_tokenizer_test",
    "ace/incremental_search_test",
    "ace/keyboard/emacs_test",
    "ace/keyboard/textinput_test",
    "ace/keyboard/keybinding_test",
    "ace/keyboard/vim_test",
    "ace/keyboard/vim_ace_test",
    "ace/keyboard/sublime_test",
    "ace/keyboard/gutter_handler_test",
    "ace/layer/text_test",
    "ace/lib/event_emitter_test",
    "ace/mode/coldfusion_test",
    "ace/mode/css_test",
    "ace/mode/html_test",
    "ace/mode/javascript_test",
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
    "ace/mouse/default_gutter_handler_test",
    "ace/occur_test",
    "ace/placeholder_test",
    "ace/range_test",
    "ace/range_list_test",
    "ace/search_test",
    "ace/selection_test",
    "ace/snippets_test",
    "ace/marker_group_test",
    "ace/tooltip_test",
    "ace/token_iterator_test",
    "ace/tokenizer_test",
    "ace/test/mockdom_test",
    "ace/undomanager_test",
    "ace/virtual_renderer_test"
];

var html = [
    useMockdom
        ? ["a", {href: normalizeHref(location.search.replace('mock=1', '')) + location.hash}, "do not use mockdom"]
        : ["a", {href: normalizeHref(location.search + '&mock=1') + location.hash}, "use mockdom"],
    ["br"],
    forceShow
        ? ["a", {href: normalizeHref(location.search.replace('show=1', '')) + location.hash}, "hide mock renderer"]
        : ["a", {href: normalizeHref(location.search + '&show=1') + location.hash}, "show mock renderer"],
    ["br"],
    ["a", {href: '?runall' + (useMockdom ? "&mock=1" : "")}, "Run all tests"], ["br"],
    ["hr"]
];
for (var i in testNames) {    
    html.push(testLink(testNames[i]), ["br"]);
}

function testLink(name) {
    return ["a", {href:'?' + name + (useMockdom ? "&mock=1" : "")}, name.replace(/^ace\//, "")];
}
function normalizeHref(str) {
    return str.replace(/([?&])&+/g, "$1");
}

var nav = buildDom(["div", {style: "position:absolute;right:0;top:0"}, html], document.body);


if (forceShow) {
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

if (useMockdom) {
    mockdom.loadInBrowser(window);
}

var selectedTests = [];
if (location.search) {
    var parts = location.search.split(/[&?]|\w+=\w+/).filter(Boolean);
    if (parts[0] == "runall")
        selectedTests = testNames;
    else
        selectedTests = parts[0].split(",");
}
var filter = decodeURIComponent(location.hash.substr(1));
window.onhashchange = function() { location.reload(); };

require(selectedTests, function() {
    var tests = selectedTests.map(function(x) {
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
                buildDom(["div", {}, testLink(href)], log);
            }
            
            var messageHeader =  "[" + test.index + "/" + test.count + "]";
            
            var node = buildDom(["div", {class: test.passed ? "passed" : "failed"}, 
                ["a", {href: "#" + escapeRegExp(test.name.replace(/^test\s*/, ""))}, messageHeader],
                " ",
                (test.suiteName ? test.suiteName + ": " : ""),
                test.name,
                (test.passed ? " OK" : " FAIL")
            ], log);
            
            if (!test.passed) {
                if (test.err.stack)
                    var err = test.err.stack;
                else
                    var err = test.err;

                console.error(node.textContent);
                console.error(err);
                buildDom(["pre", {class: "error"}, err + ""], node);
            } else {
                console.log(node.textContent);
            }

            next();
        })
        .each(function(test) {
            if (test.passed)
                passed += 1;
            else
                failed += 1;
        })
        .end(function() {
            var node = buildDom(["div", {class: "summary"},
                ["br"], "Summary:", ["br"], ["br"],
                "Total number of tests: " + (passed + failed), ["br"],
                (passed && [null, "Passed tests: " + passed, ["br"]]),
                (failed && [null, "Failed tests: " + failed])
            ], log);
            console.log(node.innerText);
        });
});
