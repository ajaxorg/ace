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

var get = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback({
                content: xhr.responseText,
                status: +(xhr.status == 200 || xhr.status == 0)
            });
        }
    };
    xhr.send(null);
};

var LatexWorker = exports.LatexWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(20);
    this.setOptions();
    var myHighlighter = new LatexHighlightRules();
    this.$myBgTokenizer = new BackgroundTokenizer(new Tokenizer(myHighlighter.getRules()));
    this.$myBgTokenizer.setDocument(this.doc);
    this.$myBgTokenizer.start(0);
    this.parser = new LatexParser(this.$myBgTokenizer);
};

oop.inherits(LatexWorker, Mirror);

(function() {

    this.$setDictionary = function(language) {
        var _url = "/demo/typojs/dictionaries/" + language + "/" + language;
        var dicPath = _url + ".dic";
        var affPath = _url + ".aff";
        var _self = this;
        get(dicPath, function(data){
            if (data.status) {
                var dicData = data.content;

                get(affPath, function(data){
                    if (data.status) {
                        var affData = data.content;
                        dictionary = new Typo(language, affData, dicData);
                        _self.onUpdate();
                    }
                });

            }
        });
    };

    this.setOptions = function(options) {
        this.options = options || {};
        if (this.options.language) {            
            this.$setDictionary(this.options.language);
        }
        this.doc.getValue() && this.deferredUpdate.schedule(20);
    };

    this.changeOptions = function(newOptions) {
        var toSetNewDictionary = newOptions.language != this.options.language;
        oop.mixin(this.options, newOptions);
        if (toSetNewDictionary) {
            this.$setDictionary(this.options.language);
        }
        this.doc.getValue() && this.deferredUpdate.schedule(20);
    };

    this.onUpdate = function() {
        if (!this.doc.getValue()) {
            this.sender.emit("spellcheck", []);
            return;
        }

        this.$myBgTokenizer.setDocument(this.doc);
        this.parser.go(this.doc, dictionary);
        this.sender.emit("spellcheck", this.parser.getErrors());
    };

}).call(LatexWorker.prototype);

});
