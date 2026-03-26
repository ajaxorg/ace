"use strict";

require("ace/lib/fixoldbrowsers");

var runner = require("./run");
var mockdom = require("../test/mockdom");
var buildDom = require("../lib/dom").buildDom;
var escapeRegExp = require("ace/lib/lang").escapeRegExp;

var useMockdom = location.search.indexOf("mock=1") != -1;
var forceShow = location.search.indexOf("show=1") != -1;

var documentElement = document.documentElement;
var log = buildDom(["div", {id: "log"}], documentElement);

var undef = window.requirejs.undef;
// change buildDom to use real document in mockdom 
var createElement = document.createElement.bind(document);
var createTextNode = document.createTextNode.bind(document);
var buildDom = eval("(" + buildDom.toString().replace(/document\./g, "") + ")");

window.onerror = function name(...params) {
};
window.addEventListener('unhandledrejection', (event) => {
    var currentStep = runner.getCurrentStep();
    currentStep.error = event.reason instanceof Error ? event.reason : new Error("Unhandled promise rejection: " + event.reason);
    if (!currentStep.running) {
        runner.resume();
    }
});

var testNames = require("./test_list").filter(name => !/_test\/highlight_rules_test/.test(name));

var html = [
    ["div", {ref: "summary"}],
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
function testHref(suiteName, name) {
    var href = '?' + suiteName + (useMockdom ? "&mock=1" : "");
    if (name) href += "#" + escapeRegExp(name.replace(/^test\s*/, ""));
    return href;
}
function testLink(name) {
    return ["a", {href: testHref(name)}, name.replace(/^ace\//, "") + ".js"];
}
function normalizeHref(str) {
    return str.replace(/([?&])&+/g, "$1");
}

var refs = {};
var nav = buildDom(["div", {id: "sidebar"}, html], documentElement, refs);


if (forceShow) {
    // @ts-ignore
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
    undef("ace/lib/", true);
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

var failed = 0;
var passed = 0;
var skipped = 0;
var reporter = {
    beforeEach: function(test) {
        if (!test.name) return;
        var isScrolled = log.scrollTop - (log.scrollHeight - log.clientHeight) > -1;
        var messageHeader =  "[" + test.index + "/" + test.count + "]";
        var node = buildDom(["div", {class: test.skip ? "skipped" : "waiting"}, 
            ["a", {href: testHref(test.testSuite.href, test.name)}, messageHeader],
            " ",
            test.name,
            ["span", (test.skip ? " SKIP" : " ...")],
        ], log);
        test.reportNode = node;
        console.log(messageHeader + test.name);
        if (isScrolled) log.scrollTop = log.scrollHeight;
    },
    afterEach: function(test) {
        if (!log.parentElement) {
            documentElement.appendChild(log);
        }
        if (!test.name) return;
        if (test.skip) {
            skipped++;
            return;
        } else if (test.passed) {
            passed++;
        } else {
            failed++;
        }
        var isScrolled = log.scrollTop - (log.scrollHeight - log.clientHeight) > -1;
        
        test.reportNode.className = test.passed ? "passed" : "failed";
        test.reportNode.lastChild.remove();
        buildDom(["span", (test.passed ? " OK" : " FAIL") + "  " + test.time + "ms"], test.reportNode);
        if (test.error && test.error != true)
            buildDom(["pre", {class: "error"}, test.error + "\n" + test.error.stack.replace(/^\w*Error/, "")], log);

        refs.summary.innerText = "Passed: " + passed + ", Failed: " + failed + ", Skipped: " + skipped;
        if (isScrolled) log.scrollTop = log.scrollHeight;
    },
    before: function(testSuite) {
        var isScrolled = log.scrollTop - (log.scrollHeight - log.clientHeight) > -1;
        var counter = " [" + testSuite.index + "/" + testSuite.count + "]";
        var href = testSuite.href;
        buildDom(["div", {}, testLink(href), counter], log);
        console.log(href, counter);
        if (isScrolled) log.scrollTop = log.scrollHeight;
    },
    after: function(testSuite) {

    },
    done: function() {
        var isScrolled = log.scrollTop - (log.scrollHeight - log.clientHeight) > -1;
        if (!log.parentElement) {
            documentElement.appendChild(log);
        }
        var node = buildDom(["div", {class: "summary"},
            ["br"], "Summary:", ["br"], ["br"],
            "Total number of tests: " + (passed + failed + skipped), ["br"],
            (passed && [null, "Passed tests: " + passed, ["br"]]),
            (passed && [null, "Passed tests: " + skipped, ["br"]]),
            (failed && [null, "Failed tests: " + failed])
        ], log);
        console.log(node.innerText);
        if (isScrolled) log.scrollTop = log.scrollHeight;
    },
    beforeStep: function(step) {
        if (step.type == "before") {
            reporter.before(step.testSuite);
        } else  {
            reporter.beforeEach(step);
        }
    },
    afterStep: function(step) {
        if (step.type == "after") {
            reporter.after(step.testSuite);
        } else if (step.type == "done") {
            reporter.done();
        } else  {
            reporter.afterEach(step);
        }
    },
};


// @ts-ignore
require(selectedTests, async function() {
    var testSuites = selectedTests.map(function(x) {
        var module = require(x);
        module.href = x;
        return module;
    });

    runner.setReporter(reporter);
    runner.prepareSteps(testSuites, filter);
    runner.runSteps();
});
