
define(function(require, exports, module) {
    
var Document = require("ace/document").Document;
var lint = require("ace/worker/jslint").JSLINT;
var lang = require("pilot/lang");
    
var Mirror = exports.Mirror = function(sender) {
    this.sender = sender;
    var doc = this.doc = new Document("");
    
    var deferredUpdate = this.deferredUpdate = lang.deferredCall(this.onUpdate.bind(this));
    
    sender.on("change", function(e) {
        doc.applyDeltas([e.data]);        
        deferredUpdate.schedule(500);
    })
};

(function() {
    
    this.setValue = function(value) {
        this.doc.setValue(value);
        this.deferredUpdate.schedule(500);
    };
    
    this.getValue = function(callbackId) {
        this.sender.callback(this.doc.getValue(), callbackId);
    };
    
    this.onUpdate = function() {
        lint(this.doc.getValue(), {undef: false, onevar: false, passfail: false});
        this.sender.emit("jslint", lint.errors);
    }
    
}).call(Mirror.prototype);

});