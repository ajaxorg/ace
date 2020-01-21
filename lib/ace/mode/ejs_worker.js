define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var ejsLint = require("./ejs/ejs-lint");
var jsLint = require("./javascript/jshint").JSHINT;


var EjsWorker = exports.EjsWorker = function (sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
    this.setOptions();
};

oop.inherits(EjsWorker, Mirror);

(function() {

    //Copied and modified this from javascript_worker
    this.setOptions = function(options) {
        this.options = options || {
            maxerr: 100,
            eqeqeq: false,
            noempty: false,
            nonbsp: false,
            undef: false,
            unused: false,
            devel: false,
            mocha: false
        };
    };  

    this.onUpdate = function () {
        var text = this.doc.getValue();
        var errors = [];
        //Handle the case of empty text
        if (!text)
            return this.sender.emit("annotate", errors);
        
        var ejsResults = ejsLint(text);
        var ejsErrors = ejsResults.errors;

        for (var i = 0; i < ejsErrors.length; i++) {
            var ejsError = ejsErrors[i];
            if(!ejsError) {
                continue;
            }

            errors.push({
                row: ejsError.line,
                column: ejsError.character - 1,
                text: ejsError.message,
                type: ejsError.errorType
            });

        }

        var parsedJs = ejsResults.parsed;
        jsLint(parsedJs, this.options);
        var jsErrors = jsLint.errors;

        for (var j = 0; j < jsErrors.length; j++) {
            var jsError = jsErrors[i];
            if (!jsError) {
                continue;
            }

            errors.push({
                row: jsError.line - 1,
                column: jsError.character - 1,
                text: "Check out this line for a javascript error!",
                type: "error",
                raw : jsError.raw
            });

        }
        
        this.sender.emit("annotate", errors);
    };

}).call(EjsWorker.prototype);

});