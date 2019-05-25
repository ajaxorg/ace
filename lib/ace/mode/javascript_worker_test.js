"use strict";

var assert = require("../test/assertions");
var JavaScriptWorker = require("./javascript_worker").JavaScriptWorker;


module.exports = {
    setUp : function() {
        this.sender = {
            on: function() {},
            callback: function(data, id) {
                this.data = data;
            },
            events: [],
            emit: function(type, e) {
                this.events.push([type, e]);
            }
        };
    },

    "test check for syntax error": function() {
        var worker = new JavaScriptWorker(this.sender);
        worker.setValue("Juhu Kinners");
        worker.deferredUpdate.call();

        var error = this.sender.events[0][1][0];
        assert.equal(error.text, 'Missing ";" before statement');
        assert.equal(error.type, "error");
        assert.equal(error.row, 0);
        assert.equal(error.column, 4);
    },

    "test invalid multi line string": function() {
        var worker = new JavaScriptWorker(this.sender);
        worker.setValue('"a\n\\nn"');
        worker.deferredUpdate.call();

        var error = this.sender.events[0][1][0];
        assert.equal(error.text, "Unclosed string.");
        assert.equal(error.type, "error");
        assert.equal(error.row, 0);
        assert.equal(error.column, 2);
    },

    "test another invalid string": function() {
        var worker = new JavaScriptWorker(this.sender);
        worker.setValue("if('");
        worker.deferredUpdate.call();
        
        var error = this.sender.events[0][1][0];
        assert.equal(error.text, "Unclosed string.");
        assert.equal(error.type, "error");
        assert.equal(error.row, 0);
        assert.equal(error.column, 4);
    },
    
    "test for each": function() {
        var worker = new JavaScriptWorker(this.sender);
        worker.setValue("for each(var i in x)");
        worker.deferredUpdate.call();
        
        var error = this.sender.events[0][1][0];
        assert.equal(error.text, "Unexpected early end of program.");
    }
};
if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
