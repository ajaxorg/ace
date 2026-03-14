

module.exports = function(testModule) {
    if (testModule === require.main) {
        require("asyncjs").test.testcase(testModule.exports).exec();
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
};