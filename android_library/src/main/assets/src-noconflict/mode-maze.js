ace.define("ace/mode/maze_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var MazeHighlightRules = function() {

    this.$rules = {
        start: [{
            token: "keyword.control",
            regex: /##|``/,
            comment: "Wall"
        }, {
            token: "entity.name.tag",
            regex: /\.\./,
            comment: "Path"
        }, {
            token: "keyword.control",
            regex: /<>/,
            comment: "Splitter"
        }, {
            token: "entity.name.tag",
            regex: /\*[\*A-Za-z0-9]/,
            comment: "Signal"
        }, {
            token: "constant.numeric",
            regex: /[0-9]{2}/,
            comment: "Pause"
        }, {
            token: "keyword.control",
            regex: /\^\^/,
            comment: "Start"
        }, {
            token: "keyword.control",
            regex: /\(\)/,
            comment: "Hole"
        }, {
            token: "support.function",
            regex: />>/,
            comment: "Out"
        }, {
            token: "support.function",
            regex: />\//,
            comment: "Ln Out"
        }, {
            token: "support.function",
            regex: /<</,
            comment: "In"
        }, {
            token: "keyword.control",
            regex: /--/,
            comment: "One use"
        }, {
            token: "constant.language",
            regex: /%[LRUDNlrudn]/,
            comment: "Direction"
        }, {
            token: [
                "entity.name.function",
                "keyword.other",
                "keyword.operator",
                "keyword.other",
                "keyword.operator",
                "constant.numeric",
                "keyword.operator",
                "keyword.other",
                "keyword.operator",
                "constant.numeric",
                "string.quoted.double",
                "string.quoted.single"
            ],
            regex: /([A-Za-z][A-Za-z0-9])( *-> *)(?:([-+*\/]=)( *)((?:-)?)([0-9]+)|(=)( *)(?:((?:-)?)([0-9]+)|("[^"]*")|('[^']*')))/,
            comment: "Assignment function"
        }, {
            token: [
                "entity.name.function",
                "keyword.other",
                "keyword.control",
                "keyword.other",
                "keyword.operator",
                "keyword.other",
                "keyword.operator",
                "constant.numeric",
                "entity.name.tag",
                "keyword.other",
                "keyword.control",
                "keyword.other",
                "constant.language",
                "keyword.other",
                "keyword.control",
                "keyword.other",
                "constant.language"
            ],
            regex: /([A-Za-z][A-Za-z0-9])( *-> *)(IF|if)( *)(?:([<>]=?|==)( *)((?:-)?)([0-9]+)|(\*[\*A-Za-z0-9]))( *)(THEN|then)( *)(%[LRUDNlrudn])(?:( *)(ELSE|else)( *)(%[LRUDNlrudn]))?/,
            comment: "Equality Function"
        }, {
            token: "entity.name.function",
            regex: /[A-Za-z][A-Za-z0-9]/,
            comment: "Function cell"
        }, {
            token: "comment.line.double-slash",
            regex: / *\/\/.*/,
            comment: "Comment"
        }]
    };

    this.normalizeRules();
};

MazeHighlightRules.metaData = {
    fileTypes: ["mz"],
    name: "Maze",
    scopeName: "source.maze"
};


oop.inherits(MazeHighlightRules, TextHighlightRules);

exports.MazeHighlightRules = MazeHighlightRules;
});

ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"], function(require, exports, module) {
"use strict";

var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;

var FoldMode = exports.FoldMode = function(commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(
            this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start)
        );
        this.foldingStopMarker = new RegExp(
            this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
        );
    }
};
oop.inherits(FoldMode, BaseFoldMode);

(function() {
    
    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe= /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    this._getFoldWidgetBase = this.getFoldWidget;
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
    
        if (this.singleLineBlockCommentRe.test(line)) {
            if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                return "";
        }
    
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
    
        if (!fw && this.startRegionRe.test(line))
            return "start"; // lineCommentRegionStart
    
        return fw;
    };

    this.getFoldWidgetRange = function(session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        
        if (this.startRegionRe.test(line))
            return this.getCommentRegionBlock(session, line, row);
        
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;

            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);
                
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
            
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                } else if (foldStyle != "all")
                    range = null;
            }
            
            return range;
        }

        if (foldStyle === "markbegin")
            return;

        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;

            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);

            return session.getCommentFoldRange(row, i, -1);
        }
    };
    
    this.getSectionRange = function(session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
            line = session.getLine(row);
            var indent = line.search(/\S/);
            if (indent === -1)
                continue;
            if  (startIndent > indent)
                break;
            var subRange = this.getFoldWidgetRange(session, "all", row);
            
            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                } else if (subRange.isMultiLine()) {
                    row = subRange.end.row;
                } else if (startIndent == indent) {
                    break;
                }
            }
            endRow = row;
        }
        
        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    this.getCommentRegionBlock = function(session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        
        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m) continue;
            if (m[1]) depth--;
            else depth++;

            if (!depth) break;
        }

        var endRow = row;
        if (endRow > startRow) {
            return new Range(startRow, startColumn, endRow, line.length);
        }
    };

}).call(FoldMode.prototype);

});

ace.define("ace/mode/maze",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/maze_highlight_rules","ace/mode/folding/cstyle"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var MazeHighlightRules = require("./maze_highlight_rules").MazeHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = MazeHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "//";
    this.$id = "ace/mode/maze";
}).call(Mode.prototype);

exports.Mode = Mode;
});
