function runner(testModule) {
    if (testModule === require.main) {
        runner.watchErrors();
        testModule.exports.name = testModule.path;
        prepareSteps([testModule.exports]);
        runSteps();
    }
    else if (typeof global == "object" && global.describe && (global.it || global.test)) {
        if (!global.it) global.it = global.test;
        global.describe("# file: " + testModule.id, function() {
            for (let i in testModule.exports) {
                if (/^test/.test(i)) {
                    let fn = testModule.exports[i];
                    if (fn.length > 0) {
                        global.it(i, async function() {
                            var done;
                            var p = new Promise(function(resolve) {
                                done = resolve;
                            });
                            await fn.call(testModule.exports, done);
                            return p;
                        });
                    } else {
                        global.it(i, testModule.exports[i].bind(testModule.exports));
                    }
                } if (/^!test/.test(i)) {
                    global.it.skip(i, testModule.exports[i].bind(testModule.exports));
                } else if (i == "setUp") {
                    global.beforeEach(testModule.exports[i].bind(testModule.exports));
                } else if (i == "tearDown") {
                    global.afterEach(testModule.exports[i].bind(testModule.exports));
                } else if (i == "setUpSuite") {
                    global.before(testModule.exports[i].bind(testModule.exports));
                } else if (i == "tearDownSuite") {
                    global.after(testModule.exports[i].bind(testModule.exports));
                }
            }
        });
    }
}

var failed = 0;
var passed = 0;
var skipped = 0;
var reporter = {
    beforeEach: function(test) {
        if (!test.name) return;
    },
    afterEach: function(test) {
        if (!test.name) return;
        if (test.skip) {
            skipped++;
        } else if (test.passed) {
            passed++;
        } else {
            failed++;
        }
        
        var color = test.skip ? "\x1b[33m" : (test.passed ? "\x1b[32m" : "\x1b[31m");
        var result = test.skip ? "SKIPPED" : (test.passed ? "OK" : "FAIL");
        var name = "[" + test.count + "/" + test.index + "] " + test.name;
        console.log(color + name + " " + result + "\x1b[0m  " + test.time + "ms");
        if (!test.passed) {
            if (test.error.stack)
                console.log(test.error.stack);
            else
                console.log(test.error);
        }
    },
    before: function(testSuite) {
        console.log("\x1b[33m# " + testSuite.name + "\x1b[0m");
    },
    after: function(testSuite) {

    },
    done: function() {
        console.log("");
        console.log("Summary:");
        console.log("");
        console.log("Total number of tests: " + (passed + failed + skipped));
        passed  && console.log("\x1b[32mPassed tests:          " + passed + "\x1b[0m");
        skipped && console.log("\x1b[33mSkipped tests:         " + skipped + "\x1b[0m");
        failed  && console.log("\x1b[31mFailed tests:          " + failed + "\x1b[0m");
        console.log("");
        process.exit(failed ? 1 : 0);
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
runner.pauseOnError = false;
var steps = [];
function resume() {
    if (currentStep) {
        var step = currentStep;
        currentStep = null;
        reporter.afterStep(step);

        if (step.error && runner.pauseOnError) {
            clearInterval(watchdog);
            watchdog = null;
            return;
        }
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
    var previousStep;
    while (currentStep = steps.shift()) {
        currentStep.timeout = (currentStep.testSuite?.timeout || 3000);
        var waitForStep = new Promise(resolve => { waitForStepCallback = resolve; });
        // do not use timeout between beforeEach and test to match mocha's behavior
        if (previousStep && previousStep.type == "beforeEach" || runner.alwaysUseSetImmediate) {
            setImmediate(runOne);
        } else {
            setTimeout(runOne, 0);
        }
        previousStep = currentStep;
        await waitForStep;
    }
    clearInterval(watchdog);
    watchdog = null;
}
function setImmediate(fn) {
    var resolve;
    new Promise(r => resolve = r).then(runOne);
    resolve();
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

function prepareSteps(testSuites, filter) {
    steps = runner.steps = [];
    for (var i = 0; i < testSuites.length; i++) {
        var testSuite = testSuites[i];
        testSuite.index = i + 1;
        testSuite.count = testSuites.length;

        var testArray = [];
        var hasOnly = false;
        Object.keys(testSuite).forEach(name => {
            if (!name.match(/^[!>]?test/))
                return;
            var test = {name, testSuite, fn: testSuite[name]};
            if (filter && !test.name.match(filter)) {
                test.skip = true;
            } else if (test.name[0] == "!") {
                test.skip = true;
            } else if (test.name[0] == ">") {
                hasOnly = true;
            }
            testArray.push(test);
        });

        if (!testArray.length) continue;

        if (hasOnly) testArray.forEach(test => {
            if (test.name[0] != ">") test.skip = true;
        });

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
}

runner.alwaysUseSetImmediate = false;
runner.runSteps = runSteps;
runner.prepareSteps = prepareSteps;
runner.resume = resume;
runner.setReporter = function(r) {
    reporter = r;
};
runner.getCurrentStep = function() {
    return currentStep;
};
runner.watchErrors = function() {
        process.on("unhandledRejection", (reason, promise) => {
        if (currentStep) {
            currentStep.error = reason instanceof Error ? reason : new Error("Unhandled promise rejection: " + reason);
            if (!currentStep.running) {
                runner.resume();
            }
        } else {
            console.error("Unhandled promise rejection:", reason);
            process.exit(1);
        }
    });
};
module.exports = runner;