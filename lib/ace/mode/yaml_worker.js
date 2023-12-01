define(function(require, exports) {
"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var lint = require("./yaml/yaml-lint").lint;

var YamlWorker = exports.YamlWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
    this.setOptions();
};

oop.inherits(YamlWorker, Mirror);

(function() {
    this.setOptions = function() {
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.changeOptions = function(newOptions) {
        oop.mixin(this.options, newOptions);
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.onUpdate = function() {
        var _this = this;
        var value = this.doc.getValue();
        var errors = [];

        lint(value, {}, function(error) {
            if (!error) {
                _this.sender.emit("annotate", errors);
                return;
            }

            // error.mark is not always defined, if undefined we default to displaying the error at the top row of the document.
            var markDefined = !!error.mark;
            errors.push({
                row: markDefined ? error.mark.line : 0,
                column: markDefined ? error.mark.column : 0,
                text: error.reason,
                type: 'error',
                raw: error
            });

            _this.sender.emit("annotate", errors);
        });
    };

}).call(YamlWorker.prototype);

});
