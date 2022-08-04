"use strict";

require("amd-loader");
var test = require("asyncjs").test;
test.walkTestCases(__dirname + "/..").exec();
