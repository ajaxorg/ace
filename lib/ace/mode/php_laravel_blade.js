"use strict";

    var oop = require("../lib/oop");
    var PHPLaravelBladeHighlightRules = require("./php_laravel_blade_highlight_rules").PHPLaravelBladeHighlightRules;
    var PHPMode = require("./php").Mode;
    var JavaScriptMode = require("./javascript").Mode;
    var CssMode = require("./css").Mode;
    var HtmlMode = require("./html").Mode;

    var Mode = function() {
        PHPMode.call(this);

        this.HighlightRules = PHPLaravelBladeHighlightRules;
        this.createModeDelegates({
            "js-": JavaScriptMode,
            "css-": CssMode,
            "html-": HtmlMode
        });
    };
    oop.inherits(Mode, PHPMode);

    (function() {

        this.$id = "ace/mode/php_laravel_blade";
    }).call(Mode.prototype);

    exports.Mode = Mode;
