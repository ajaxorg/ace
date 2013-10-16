define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var LaTeXParser = require("./latex/latex_parser").LaTeXParser;

var LatexWorker = exports.LatexWorker = function(sender) {
    Mirror.call(this, sender);
    this.parser = new LaTeXParser("en_US", "/demo/typojs/dictionaries/en_US/en_US.dic", "/demo/typojs/dictionaries/en_US/en_US.aff");
    this.setTimeout(400);
    this.setOptions();
};

oop.inherits(LatexWorker, Mirror);

(function() {

    this.setOptions = function(options) {
        this.options = options || {};
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.changeOptions = function(newOptions) {
        oop.mixin(this.options, newOptions);
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.onUpdate = function() {
        var value = this.doc.getValue();
        if (!value) {
            this.sender.emit("spellcheck", []);
            return;
        }

        this.parser.go(value);
        var errors = this.parser.getErrors();
        
        this.sender.emit("spellcheck", errors);
    };

}).call(LatexWorker.prototype);

});
