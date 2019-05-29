"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var parse = require("./json/json_parse");

var JsonWorker = exports.JsonWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(200);
};

oop.inherits(JsonWorker, Mirror);

(function() {

    this.onUpdate = function() {
        var value = this.doc.getValue();
        var errors = [];
        try {
            if (value)
                parse(value);
        } catch (e) {
            var pos = this.doc.indexToPosition(e.at-1);
            errors.push({
                row: pos.row,
                column: pos.column,
                text: e.message,
                type: "error"
            });
        }
        this.sender.emit("annotate", errors);
    };

}).call(JsonWorker.prototype);
