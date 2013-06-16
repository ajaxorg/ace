var path = require('path')
  , fs = require('fs');

var modeDir = path.join(__dirname, "..", "lib", "ace", "mode");

require("amd-loader");

var SPECIAL_REGEXES = {
  "javascript": "(?:javascript|js)"
}

var SHIM_START = 'define(function(require, exports, module) {\
"use strict";\
module.exports = function(){ return {\n\n';
var SHIM_END = '\n\n}}});'

modeStrings = [];
var modes = fs.readdirSync(modeDir).filter(function(x){
      return !/^_/.test(x) && !/(_highlight_rules|behaviour|worker)\.js$/.test(x) && /\.js$/.test(x);
  }).map(function(x) {
      return x.replace(/\.js$/, "");
  }).forEach(function(moduleName){
  var fullPath = path.join(modeDir, moduleName);
  var Mode = require(fullPath).Mode;
  if (Mode) {
      var highlightPath = fullPath+ "_highlight_rules";
      if (fs.existsSync(highlightPath+".js")) {
        var highlight = require(highlightPath);
        for (var expKey in highlight) {
          if (expKey.match(/HighlightRules$/)) {
            var modeName = moduleName;
            var highlightExportName = expKey;
            var highlightModuleName = path.basename(highlightPath);
            var regex = SPECIAL_REGEXES[modeName]?('"'+SPECIAL_REGEXES[modeName]+'"'):null; 
            modeStrings.push('"'+modeName+'": {mode: require("./'+moduleName+'").Mode, highlightRules:require("./'+highlightModuleName+'").'+highlightExportName+', regex:'+regex+'}'); 
            break;
          }
        }

      }
  }
});

var allModesPath = path.join(modeDir, "_all_modes.js");
fs.writeFileSync(allModesPath, SHIM_START+modeStrings.join(",\n")+SHIM_END);
console.log(allModesPath + " written.");
