"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var coffee = require("../mode/coffee/coffee");

window.addEventListener = function() {};


var Worker = exports.Worker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(250);
};

oop.inherits(Worker, Mirror);

(function() {

    this.onUpdate = function() {
        var value = this.doc.getValue();
        var errors = [];
        try {
            coffee.compile(value);
        } catch(e) {
            var loc = e.location;
            if (loc) {
                errors.push({
                    row: loc.first_line,
                    column: loc.first_column,
                    endRow: loc.last_line,
                    endColumn: loc.last_column,
                    text: e.message,
                    type: "error"
                });
            }
        }
        this.sender.emit("annotate", errors);
    };

}).call(Worker.prototype);
