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

            errors.push({
                row: error.mark.line,
                column: error.mark.column,
                text: error.reason,
                type: 'error',
                raw: error
            });

            _this.sender.emit("annotate", errors);
        });
    };

}).call(YamlWorker.prototype);

});
