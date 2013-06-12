define(function(require, exports, module) {
"use strict";

var getAllModesAndHighlightRules = function(opts){
  var result = require("./_all_modes")();

  if (opts.exclude) {
    for (var i=0; i<opts.exclude.length; i++){
      delete result[opts.exclude[i]];
    }
  }

  return result;
}

var delegateNameForModeName = function(modeName) {
  return modeName + "-";
}

var modeDelegates = function(opts){
  var result = {};
  var allModes = getAllModesAndHighlightRules(opts);
  for (var modeName in allModes) {
    result[delegateNameForModeName(modeName)] = allModes[modeName].mode;
  }
  return result;
}

exports.getAllModesAndHighlightRules = getAllModesAndHighlightRules;
exports.modeDelegates = modeDelegates;
exports.delegateNameForModeName = delegateNameForModeName;
});
