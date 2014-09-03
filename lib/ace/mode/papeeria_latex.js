define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var LatexHighlightRules = require("./latex_highlight_rules").LatexHighlightRules;
var LatexFoldMode = require("./folding/latex").FoldMode;
var Range = require("../range").Range;
var WorkerClient = require("../worker/worker_client").WorkerClient;
var EditSession = require("../edit_session").EditSession;

var Mode = function() {
    this.HighlightRules = LatexHighlightRules;
    this.foldingRules = new LatexFoldMode();
};
oop.inherits(Mode, TextMode);

EditSession.prototype.removeAllMarkersByType = function(type) {
    var markers = this.getMarkers(true);
    for (var i in markers) {
        if (markers[i].type === type) {
            this.removeMarker(markers[i].id);
        }
    }
};

(function() {
    this.lineCommentStart = "%";

    var mySettingsUpdateCallbacks = {
        onSuccess: null,
        onError: null
    };

    this.createWorker = function(session) {
        var worker = new WorkerClient(["ace"], "ace/mode/latex_worker", "LatexWorker");
        worker.attachToDocument(session.getDocument());

        worker.on("spellcheck", function(results) {
            session.removeAllMarkersByType("typo");
            for (var i = 0; i < results.data.length; ++i) {
                var word = results.data[i];
                session.addMarker(new Range(word.row, word.column, word.row, word.column + word.raw.length), "typo", "typo", true);
            }
        });

        worker.on("settingsUpdateSuccess", function(result) {
            mySettingsUpdateCallbacks.onSuccess();
        });

        worker.on("settingsUpdateError", function(result) {
            mySettingsUpdateCallbacks.onError(result.data);
        });

        worker.on("terminate", function() {
            session.removeAllMarkersByType("typo");
        });

        // turn off spell checker only if "enabled" parameter is false
        session.on("changeSpellingCheckSettings", function(data) {
            if (!data.enabled) {
                session.removeAllMarkersByType("typo");
            }
            mySettingsUpdateCallbacks = {
                onSuccess: data.onSettingsUpdateSuccess,
                onError: data.onSettingsUpdateError
            };
            // it's important to call changeOptions after success/error callbacks have been set
            worker.call("changeOptions", [{
                language: data.language,
                dicPath: data.dicPath,
                affPath: data.affPath,
                enabled: data.enabled
            }]);
        });

        return worker;
    };

}).call(Mode.prototype);

exports.Mode = Mode;

});
