"use strict";

var assert = require("../test/assertions");
var Worker = require("./css_worker").Worker;


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
        var worker = new Worker(this.sender);
        worker.setValue("Juhu Kinners");
        worker.deferredUpdate.call();
        assert.equal(this.sender.events[0][1][0].type, "error");
    }
};
if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
