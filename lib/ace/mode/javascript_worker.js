
define(function(require, exports, module) {
    
var oop = require("pilot/oop");
var Mirror = require("ace/worker/mirror").Mirror;
var lint = require("ace/worker/jslint").JSLINT;
    
var JavaScriptWorker = exports.JavaScriptWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
};

oop.inherits(JavaScriptWorker, Mirror);

(function() {
    
    this.onUpdate = function() {
        lint(this.doc.getValue(), {undef: false, onevar: false, passfail: false});
        this.sender.emit("jslint", lint.errors);
    }
    
}).call(JavaScriptWorker.prototype);

});