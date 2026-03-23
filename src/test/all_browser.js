"use strict";

require("ace/lib/fixoldbrowsers");

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
    currentStep.error = event.reason instanceof Error ? event.reason : new Error("Unhandled promise rejection: " + event.reason);
    if (!currentStep.running) {
        resume();
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


var currentStep;
var waitForStepCallback;
var watchdog;
var steps = [];
function resume() {
    if (currentStep) {
        var step = currentStep;
        currentStep = null;
        reporter.afterStep(step);
    }
    waitForStepCallback(); 
}
async function runSteps() {
    watchdog = setInterval(() => {
        if (!currentStep) return;
        currentStep.interactiveTime = (currentStep.interactiveTime || 0) + 50;
        if (currentStep.interactiveTime >= currentStep.timeout) {
            if (currentStep.error == undefined)
                currentStep.error = new Error("Source did not respond after " + (currentStep.timeout || 0) + "ms!");
            resume();
        }
    }, 50);
    while (currentStep = steps.shift()) {
        currentStep.timeout = (currentStep.testSuite?.timeout || 3000);
        var waitForStep = new Promise(resolve => { waitForStepCallback = resolve; });
        setTimeout(runOne, 0);
        await waitForStep;
    }
    clearInterval(watchdog);
}
async function runOne() {
    var step = currentStep;
    var doneCalled = false;
    var done = function(error) {
        if (doneCalled) return;
        if (error) step.error = error;
        step.passed = !step.error;
        step.time = Date.now() - t;
        doneCalled = true;
        resume();
    };
    var t = Date.now();

    step.passed = false;
    reporter.beforeStep(step);

    if (!step.fn) return done();
    step.running = true;
    try {
        if (step.skip) {
            return done();
        }
        if (step.fn.length) {
            await step.fn.call(step.testSuite, done);
        } else {
            await step.fn.call(step.testSuite);
            done();
        }
    } finally {
        step.time = Date.now() - t;
        step.running = false;
    }
}

// @ts-ignore
require(selectedTests, async function() {
    var testSuites = selectedTests.map(function(x) {
        var module = require(x);
        module.href = x;
        return module;
    });

    steps = [];
    for (var i = 0; i < testSuites.length; i++) {
        var testSuite = testSuites[i];
        testSuite.index = i + 1;
        testSuite.count = testSuites.length;

        var testArray = [];
        Object.keys(testSuite).forEach(name => {
            if (!name.match(/^>?test/))
                return;
            var test = {name, testSuite, fn: testSuite[name]};
            if (filter && !test.name.match(filter)) {
                test.skip = true;
            }
            testArray.push(test);
        });

        if (!testArray.length) continue;

        steps.push({type: "before", testSuite, fn: testSuite.setUpSuite});
        for (var j = 0; j < testArray.length; j++) {
            var test = testArray[j];
            test.index = j + 1;
            test.count = testArray.length;
            test.skip || steps.push({type: "beforeEach", testSuite, fn: testSuite.setUp});
            steps.push(test);
            test.skip || steps.push({type: "afterEach", testSuite, fn: testSuite.tearDown});
        } 
        steps.push({type: "after", testSuite, fn: testSuite.tearDownSuite});
    }

    steps.push({type: "done"});

    runSteps();
});
