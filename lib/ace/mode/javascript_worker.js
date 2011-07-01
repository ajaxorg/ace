define(function(require, exports, module) {

var oop = require("pilot/oop");
var Mirror = require("ace/worker/mirror").Mirror;
//var lint = require("ace/worker/jslint").JSLINT;
var lint = require("ace/worker/jshint").JSHINT;

var JavaScriptWorker = exports.JavaScriptWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
};

oop.inherits(JavaScriptWorker, Mirror);

(function() {

    this.onUpdate = function() {
        var value = this.doc.getValue();
        value = value.replace(/^#!.*\n/, "\n");

//        var start = new Date();
//        console.log("jslint")
        lint(value, {undef: false, onevar: false, passfail: false});
        this.sender.emit("jslint", lint.errors);
//        console.log("lint time: " + (new Date() - start));
    }

}).call(JavaScriptWorker.prototype);

});