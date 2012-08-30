/*
 * 
 * Based on json_worker.js
 * Worker function checks the xml document for errors.
 * 
 * Luis Bustamante <luis.bustamante AT outlook.com>
 * 
 */


define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var parse = require("./xml/xml_lexer");

var XmlWorker = exports.XmlWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(200);
};

oop.inherits(XmlWorker, Mirror);

(function() {

    this.onUpdate = function() {
        var value = this.doc.getValue();

        try {
            var result = parse(value);
        } catch (e) {
            var pos = this.charToDocumentPosition(e.at-1);
            this.sender.emit("error", {
                row: pos.row,
                column: pos.column,
                text: e.message,
                type: "error"
            });
            return;
        }
        this.sender.emit("ok");
    };

    this.charToDocumentPosition = function(charPos) {
        var i = 0;
        var len = this.doc.getLength();
        var nl = this.doc.getNewLineCharacter().length;

        if (!len) {
            return { row: 0, column: 0};
        }

        var lineStart = 0;
        while (i < len) {
            var line = this.doc.getLine(i);
            var lineLength = line.length + nl;
            if (lineStart + lineLength > charPos)
                return {
                    row: i,
                    column: charPos - lineStart
                };

            lineStart += lineLength;
            i += 1;
        }

        return {
            row: i-1,
            column: line.length
        };
    };

}).call(XmlWorker.prototype);




});