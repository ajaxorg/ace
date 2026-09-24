"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var lintXml = require("./xml/lint").lintXml;

var Worker = exports.Worker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(400);
    this.context = null;
};

oop.inherits(Worker, Mirror);

(function() {

    this.setOptions = function(options) {
        this.context = options.context;
    };

    this.onUpdate = function() {
        this.sender.emit("error", lintXml(this.doc.getValue()));
    };

}).call(Worker.prototype);
