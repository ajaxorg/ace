#!/usr/bin/env node
var x;
eval("x= " + require("fs").readFileSync(__dirname + "/package.json"))
console.log(x.version)