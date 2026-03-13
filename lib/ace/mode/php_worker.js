define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var globalObj = typeof globalThis !== "undefined" ? globalThis : self;
var processShim = globalObj.process = globalObj.process || {};
processShim.arch = processShim.arch || "x64";
var Engine = require("php-parser");

var PhpWorker = exports.PhpWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
    this.parser = new Engine({
        parser: {
            extractDoc: false,
            suppressErrors: true,
        },
        ast: {
            withPositions: false,
            withSource: false,
        },
        lexer: {
            all_tokens: false,
            comment_tokens: false,
            mode_eval: false,
            asp_tags: false,
            short_tags: true,
        },
    });
};

oop.inherits(PhpWorker, Mirror);

(function() {
    this.setOptions = function(opts) {
        this.inlinePhp = opts && opts.inline;
    };
    
    this.onUpdate = function() {
        var value = this.doc.getValue();
        var errors = [];

        try {
            let result = this.parser.parseCode(value, 'foo.php');
            if (this.inlinePhp) {
                result = this.parser.parseEval(value);
            } else {
                result = this.parser.parseCode(value, 'foo.php');
            }
            if (result && result.errors) {
                errors = result.errors.map((el) => {
                    return {
                        row: el.line - 1,
                        column: null,
                        text: el.message,
                        type: "error"
                    };
                });
            }
        } catch (e) {
            console.error(e);
        }

        this.sender.emit("annotate", errors);
    };

}).call(PhpWorker.prototype);

});
