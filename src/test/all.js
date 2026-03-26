"use strict";
var runner = require("./run");

var testSuites = [];
var root = require("path").normalize(__dirname + "/..") + "/";
require("./test_list").forEach(function(name) {
    var path = name.replace(/^ace\//, root) + ".js";
    
    var testSuite = require(path);
    testSuite.name = path;
    testSuites.push(testSuite);
});

runner.watchErrors();
runner.prepareSteps(testSuites, "");
runner.runSteps();