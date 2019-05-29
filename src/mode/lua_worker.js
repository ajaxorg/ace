"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var luaparse = require("../mode/lua/luaparse");

var Worker = exports.Worker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
};

oop.inherits(Worker, Mirror);

(function() {

    this.onUpdate = function() {
        var value = this.doc.getValue();
        var errors = [];
        
        // var t=Date.now()
        try {
            luaparse.parse(value);
        } catch(e) {
            if (e instanceof SyntaxError) {
                errors.push({
                    row: e.line - 1,
                    column: e.column,
                    text: e.message,
                    type: "error"
                });
            }
        }
        // console.log( t-Date.now())
        this.sender.emit("annotate", errors);
    };

}).call(Worker.prototype);
