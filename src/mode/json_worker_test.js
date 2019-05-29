"use strict";

var assert = require("../test/assertions");
var Worker = require("./json_worker").JsonWorker;


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

    "test check valid json": function() {
        var worker = new Worker(this.sender);
        worker.setValue("{}");
        worker.deferredUpdate.call();

        assert.equal(this.sender.events[0][1].length, 0);
    },

    "test check for syntax error": function() {
        var worker = new Worker(this.sender);
        worker.setValue([
            "{",
            "juhu: 12",
            "}"
        ].join("\n"));
        worker.deferredUpdate.call();

        var event = this.sender.events[0];
        assert.equal(event[0], "annotate");
        assert.equal(event[1].length, 1);
        assert.equal(event[1][0].type, "error");
        assert.equal(event[1][0].text, "Bad string");
        assert.equal(event[1][0].row, 1);
        assert.equal(event[1][0].column, 0);

    },

    "test check for syntax error at first char": function() {
        var worker = new Worker(this.sender);
        worker.setValue("x");
        worker.deferredUpdate.call();

        var event = this.sender.events[0];
        assert.equal(event[0], "annotate");
        assert.equal(event[1][0].type, "error");
        assert.equal(event[1][0].text, "Unexpected 'x'");
        assert.equal(event[1][0].row, 0);
        assert.equal(event[1][0].column, 0);
    }

};
if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
