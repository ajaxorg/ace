/*
 * Extremely simplified version of the requireJS text plugin
 */
 
(function() {

var globalRequire = typeof require != "undefined" && require;
if (typeof define !== "function" || (!define.amd && typeof XMLHttpRequest == "undefined")) { // running in webpack
    return module.exports = globalRequire("./text_loader_webpack");
}
define(function (require, exports, module) {
    "use strict";
    if (globalRequire && globalRequire.nodeRequire) {
        module.exports = globalRequire.nodeRequire(require.toUrl("./text_build"));
    } else {
        exports.load = function(name, req, onLoad, config) {
            require("../lib/net").get(req.toUrl(name), onLoad);
        };
    }
});

})();
