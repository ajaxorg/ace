
define(function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var OwlMode = require("./owl").Mode;
    var ClifMode = require("./clif").Mode;
    var DolMode = require("./dol").Mode;
    var DolAllHighlightRules = require("./dolall_highlight_rules").DolAllHighlightRules;
    var TextMode = require("./text").Mode;

    var Mode = function () {
        this.HighlightRules = DolAllHighlightRules;

        //ClifMode.call(this);

        //this.$tokenizer = new Tokenizer(highlighter.getRules());
        //this.$embeds = highlighter.getEmbeds();
        //this.createModeDelegates({
        //    "owl-": OwlMode
        //});
        // this.createModeDelegates({
        // "js-": JavaScriptMode,
        // "css-": CssMode
        //});
    };
    oop.inherits(Mode, TextMode);

    (function () {


        this.$id = "ace/mode/DolAll";
    }).call(Mode.prototype);


    exports.Mode = Mode;
});