"use strict";

var oop = require("../lib/oop");
var JavaScriptMode = require("./javascript").Mode;
var GroovyHighlightRules = require("./groovy_highlight_rules").GroovyHighlightRules;
var CstyleBehaviour = require("../mode/behaviour/cstyle").CstyleBehaviour;

var Mode = function() {
    JavaScriptMode.call(this);
    this.HighlightRules = GroovyHighlightRules;
    this.$behaviour = new CstyleBehaviour({closeDocComment: true});
};
oop.inherits(Mode, JavaScriptMode);

(function() {

    this.createWorker = function(session) {
        return null;
    };

    this.$id = "ace/mode/groovy";
}).call(Mode.prototype);

exports.Mode = Mode;
