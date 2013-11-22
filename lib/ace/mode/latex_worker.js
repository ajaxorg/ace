define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var Tokenizer = require("../tokenizer").Tokenizer;
var BackgroundTokenizer = require("../background_tokenizer").BackgroundTokenizer;

var LatexParser = require("./latex_parser").LatexParser;
var LatexHighlightRules = require("./latex_highlight_rules").LatexHighlightRules;
var Typo = require("../lib/typo").Typo;

var dictionary = null;
var WORKER_TIMEOUT_MS = 20;
var STATE_COMPLETE = 4;

var get = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === STATE_COMPLETE) {
            callback({
                content: xhr.responseText,
                status: xhr.status === 200
            });
        }
    };
    xhr.send(null);
};

var LatexWorker = exports.LatexWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(WORKER_TIMEOUT_MS);
    this.myOptions = {};
    var highlighter = new LatexHighlightRules();
    this.myBgTokenizer = new BackgroundTokenizer(new Tokenizer(highlighter.getRules()));
    this.myBgTokenizer.setDocument(this.doc);
    this.myBgTokenizer.start(0);
    this.myParser = new LatexParser(this.myBgTokenizer);
};

oop.inherits(LatexWorker, Mirror);

(function() {

    this.setDictionary = function(options, onSuccessCallback) {
        get(options.dicPath, function(data) {
            if (data.status) {
                var dicData = data.content;

                get(options.affPath, function(data) {
                    if (data.status) {
                        var affData = data.content;
                        dictionary = new Typo(options.language, affData, dicData);
                        onSuccessCallback();
                    }
                });

            }
        });
    };

    this.changeOptions = function(newOptions) {
        var isNewLanguage = newOptions.language != this.myOptions.language;
        oop.mixin(this.myOptions, newOptions);
        
        if (newOptions.enabled) {
            if (isNewLanguage) {
                this.setDictionary(this.myOptions, (function() {
                    this.doc.getValue() && this.deferredUpdate.schedule(WORKER_TIMEOUT_MS);
                }).bind(this));
            } else {
                this.deferredUpdate.schedule(WORKER_TIMEOUT_MS);    
            }
        }
    };

    this.onUpdate = function() {
        if (!this.doc.getValue() || !this.myOptions.enabled) {
            this.sender.emit("spellcheck", []);
            return;
        }

        this.myBgTokenizer.setDocument(this.doc);
        this.myParser.go(this.doc, dictionary);
        this.sender.emit("spellcheck", this.myParser.getErrors());
    };

}).call(LatexWorker.prototype);

});
