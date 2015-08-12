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
var HTTP_REQUEST_STATUS = {
    OK: 200,
    NOT_MODIFIED: 304
};

var get = function(url, onSuccessCallback, onErrorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === STATE_COMPLETE) {
            if (xhr.status === HTTP_REQUEST_STATUS.OK || xhr.status === HTTP_REQUEST_STATUS.NOT_MODIFIED) {
                onSuccessCallback({
                    content: xhr.responseText
                });
            } else {
                onErrorCallback({
                    status: xhr.status,
                    content: xhr.statusText
                });
            }
        }
    };
    xhr.send(null);
};

// Simple cache implementation
var cache = {
    map: {},
    load: function(id) {
        return (typeof this.map[id] !== "undefined") ? this.map[id] : null;
    },
    save: function(id, data) {
        this.map[id] = data;
    },
    clear: function() {
        this.map = {};
    }
};

var LatexWorker = exports.LatexWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(WORKER_TIMEOUT_MS);
    this.mySpellingCheckOptions = {};
    this.myDiscussionsOptions = {};
    var highlighter = new LatexHighlightRules();
    this.myBgTokenizer = new BackgroundTokenizer(new Tokenizer(highlighter.getRules()));
    this.myBgTokenizer.setDocument(this.doc);
    this.myBgTokenizer.start(0);
    this.myParser = new LatexParser(this.myBgTokenizer);
};

oop.inherits(LatexWorker, Mirror);

(function() {

    this.setDictionary = function(options, onSuccessCallback, onErrorCallback) {
        var affData = null,
            dicData = null;

        var onSuccessDownloadAffData = function(data) {
            affData = data.content;
            dictionary = new Typo(options.language, affData, dicData);
            onSuccessCallback();
        };

        var onSuccessDownloadDicData = function(data) {
            dicData = data.content;
            get(options.affPath, onSuccessDownloadAffData, onErrorCallback);
        };

        get(options.dicPath, onSuccessDownloadDicData, onErrorCallback);
    };

    this.changeSpellingCheckOptions = function(newOptions) {
        var isNewLanguage = newOptions.language !== this.mySpellingCheckOptions.language;
        oop.mixin(this.mySpellingCheckOptions, newOptions);

        var onSuccess = function() {
            cache.save(this.mySpellingCheckOptions.language, dictionary);
            this.sender.emit("settingsUpdateSuccess", []);
            this.doc.getValue() && this.deferredUpdate.schedule(WORKER_TIMEOUT_MS);
        };

        var onError = function(data) {
            this.sender.emit("settingsUpdateError", {
                content: data.content,
                status: data.status
            });
        };

        if (newOptions.enabled) {
            if (isNewLanguage) {
                dictionary = cache.load(this.mySpellingCheckOptions.language);
                if (!dictionary) {
                    this.setDictionary(this.mySpellingCheckOptions, onSuccess.bind(this), onError.bind(this));
                } else {
                    onSuccess.call(this);
                }
            } else {
                this.sender.emit("settingsUpdateSuccess", []);
                this.deferredUpdate.schedule(WORKER_TIMEOUT_MS);
            }
        } else {
            dictionary = null;
            cache.clear();
        }
    };

    this.changeDiscussionsOptions = function(newOptions) {
        this.myDiscussionsOptions = newOptions;
        this.sender.emit("discussionsSettingsUpdateSuccess", []);
        this.deferredUpdate.schedule(WORKER_TIMEOUT_MS);
    };

    this.onUpdate = function() {
        var doSpellcheck = false,
            doGetDiscussions = false;

        if (this.doc.getValue()) {
            doGetDiscussions = this.myDiscussionsOptions.enabled;

            if (this.mySpellingCheckOptions.enabled) {
                doSpellcheck = true;
                this.myParser.setSpellingCheckDictionary(dictionary, this.mySpellingCheckOptions.alphabet);
            } else {
                doSpellcheck = false;
                this.sender.emit("spellcheck", []);
            }

            this.myBgTokenizer.setDocument(this.doc);
            this.myParser.go(this.doc, {
                spellcheck: doSpellcheck,
                parseDiscussions: doGetDiscussions,
                lineCommentSymbol: this.myDiscussionsOptions.lineCommentSymbol
            });

            doSpellcheck && this.sender.emit("spellcheck", this.myParser.getErrors());
            doGetDiscussions && this.sender.emit("discussions", this.myParser.getDiscussions());
        }
    };

}).call(LatexWorker.prototype);

});
