"use strict";

    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var FSharpHighlightRules = require("./fsharp_highlight_rules").FSharpHighlightRules;
    var CStyleFoldMode = require("./folding/cstyle").FoldMode;

    var Mode = function () {
        TextMode.call(this);
        this.HighlightRules = FSharpHighlightRules;
        this.foldingRules = new CStyleFoldMode();
    };

    oop.inherits(Mode, TextMode);


    (function () {
        this.lineCommentStart = "//";
        this.blockComment = {start: "(*", end: "*)", nestable: true};


        this.$id = "ace/mode/fsharp";
    }).call(Mode.prototype);

    exports.Mode = Mode;
