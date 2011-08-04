define(function(require, exports, module) {
    
var oop = require("ace/lib/oop");
var Mirror = require("ace/worker/mirror").Mirror;
var lint = require("ace/mode/javascript/jshint").JSHINT;
var Parser = require("ace/mode/javascript/jsparse");
    
var JavaScriptWorker = exports.JavaScriptWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
};

oop.inherits(JavaScriptWorker, Mirror);

(function() {
    
    this.onUpdate = function() {
        var value = this.doc.getValue();
        value = value.replace(/^#!.*\n/, "\n");
        
        try {
            Parser.parse(value);
        } catch(e) {
            this.sender.emit("narcissus", {
                row: e.lineno-1,
                column: null, // TODO convert e.cursor
                text: e.message,
                type: "error"
            });
            return;
        }
        
        lint(value, {undef: false, onevar: false, passfail: false});
        this.sender.emit("jslint", lint.errors);        
    }
    
}).call(JavaScriptWorker.prototype);

});