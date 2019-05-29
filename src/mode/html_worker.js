"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var Mirror = require("../worker/mirror").Mirror;
var SAXParser = require("./html/saxparser").SAXParser;

var errorTypes = {
    "expected-doctype-but-got-start-tag": "info",
    "expected-doctype-but-got-chars": "info",
    "non-html-root": "info"
};

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
        var value = this.doc.getValue();
        if (!value)
            return;
        var parser = new SAXParser();
        var errors = [];
        var noop = function(){};
        parser.contentHandler = {
           startDocument: noop,
           endDocument: noop,
           startElement: noop,
           endElement: noop,
           characters: noop
        };
        parser.errorHandler = {
            error: function(message, location, code) {
                errors.push({
                    row: location.line,
                    column: location.column,
                    text: message,
                    type: errorTypes[code] || "error"
                });
            }
        };
        if (this.context)
            parser.parseFragment(value, this.context);
        else
            parser.parse(value);
        this.sender.emit("error", errors);
    };

}).call(Worker.prototype);
