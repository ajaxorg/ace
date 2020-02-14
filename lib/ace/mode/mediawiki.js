define("ace/mode/mediawiki", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/css", "ace/mode/javascript", "ace/mode/lua", "ace/mode/xml", "ace/mode/html", "ace/mode/mediawiki_highlight_rules"], function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var MediaWikiHighlightRules = require("./mediawiki_highlight_rules").MediaWikiHighlightRules;

    var Mode = function() {
        this.HighlightRules = MediaWikiHighlightRules;
        // this.createModeDelegates({});
        this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        this.type = "text";
        this.blockComment = {start: "<!--", end: "-->"};
        this.$id = "ace/mode/mediawiki"
    }).call(Mode.prototype);

    exports.Mode = Mode;
});