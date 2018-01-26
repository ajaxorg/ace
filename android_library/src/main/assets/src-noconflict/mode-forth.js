ace.define("ace/mode/forth_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var ForthHighlightRules = function() {

    this.$rules = { start: [ { include: '#forth' } ],
      '#comment':
       [ { token: 'comment.line.double-dash.forth',
           regex: '(?:^|\\s)--\\s.*$',
           comment: 'line comments for iForth' },
         { token: 'comment.line.backslash.forth',
           regex: '(?:^|\\s)\\\\[\\s\\S]*$',
           comment: 'ANSI line comment' },
         { token: 'comment.line.backslash-g.forth',
           regex: '(?:^|\\s)\\\\[Gg] .*$',
           comment: 'gForth line comment' },
         { token: 'comment.block.forth',
           regex: '(?:^|\\s)\\(\\*(?=\\s|$)',
           push:
            [ { token: 'comment.block.forth',
                regex: '(?:^|\\s)\\*\\)(?=\\s|$)',
                next: 'pop' },
              { defaultToken: 'comment.block.forth' } ],
           comment: 'multiline comments for iForth' },
         { token: 'comment.block.documentation.forth',
           regex: '\\bDOC\\b',
           caseInsensitive: true,
           push:
            [ { token: 'comment.block.documentation.forth',
                regex: '\\bENDDOC\\b',
                caseInsensitive: true,
                next: 'pop' },
              { defaultToken: 'comment.block.documentation.forth' } ],
           comment: 'documentation comments for iForth' },
         { token: 'comment.line.parentheses.forth',
           regex: '(?:^|\\s)\\.?\\( [^)]*\\)',
           comment: 'ANSI line comment' } ],
      '#constant':
       [ { token: 'constant.language.forth',
           regex: '(?:^|\\s)(?:TRUE|FALSE|BL|PI|CELL|C/L|R/O|W/O|R/W)(?=\\s|$)',
           caseInsensitive: true},
         { token: 'constant.numeric.forth',
           regex: '(?:^|\\s)[$#%]?[-+]?[0-9]+(?:\\.[0-9]*e-?[0-9]+|\\.?[0-9a-fA-F]*)(?=\\s|$)'},
         { token: 'constant.character.forth',
           regex: '(?:^|\\s)(?:[&^]\\S|(?:"|\')\\S(?:"|\'))(?=\\s|$)'}],
      '#forth':
       [ { include: '#constant' },
         { include: '#comment' },
         { include: '#string' },
         { include: '#word' },
         { include: '#variable' },
         { include: '#storage' },
         { include: '#word-def' } ],
      '#storage':
       [ { token: 'storage.type.forth',
           regex: '(?:^|\\s)(?:2CONSTANT|2VARIABLE|ALIAS|CONSTANT|CREATE-INTERPRET/COMPILE[:]?|CREATE|DEFER|FCONSTANT|FIELD|FVARIABLE|USER|VALUE|VARIABLE|VOCABULARY)(?=\\s|$)',
           caseInsensitive: true}],
      '#string':
       [ { token: 'string.quoted.double.forth',
           regex: '(ABORT" |BREAK" |\\." |C" |0"|S\\\\?" )([^"]+")',
           caseInsensitive: true},
         { token: 'string.unquoted.forth',
           regex: '(?:INCLUDE|NEEDS|REQUIRE|USE)[ ]\\S+(?=\\s|$)',
           caseInsensitive: true}],
      '#variable':
       [ { token: 'variable.language.forth',
           regex: '\\b(?:I|J)\\b',
           caseInsensitive: true } ],
      '#word':
       [ { token: 'keyword.control.immediate.forth',
           regex: '(?:^|\\s)\\[(?:\\?DO|\\+LOOP|AGAIN|BEGIN|DEFINED|DO|ELSE|ENDIF|FOR|IF|IFDEF|IFUNDEF|LOOP|NEXT|REPEAT|THEN|UNTIL|WHILE)\\](?=\\s|$)',
           caseInsensitive: true},
         { token: 'keyword.other.immediate.forth',
           regex: '(?:^|\\s)(?:COMPILE-ONLY|IMMEDIATE|IS|RESTRICT|TO|WHAT\'S|])(?=\\s|$)',
           caseInsensitive: true},
         { token: 'keyword.control.compile-only.forth',
           regex: '(?:^|\\s)(?:-DO|\\-LOOP|\\?DO|\\?LEAVE|\\+DO|\\+LOOP|ABORT\\"|AGAIN|AHEAD|BEGIN|CASE|DO|ELSE|ENDCASE|ENDIF|ENDOF|ENDTRY\\-IFERROR|ENDTRY|FOR|IF|IFERROR|LEAVE|LOOP|NEXT|RECOVER|REPEAT|RESTORE|THEN|TRY|U\\-DO|U\\+DO|UNTIL|WHILE)(?=\\s|$)',
           caseInsensitive: true},
         { token: 'keyword.other.compile-only.forth',
           regex: '(?:^|\\s)(?:\\?DUP-0=-IF|\\?DUP-IF|\\)|\\[|\\[\'\\]|\\[CHAR\\]|\\[COMPILE\\]|\\[IS\\]|\\[TO\\]|<COMPILATION|<INTERPRETATION|ASSERT\\(|ASSERT0\\(|ASSERT1\\(|ASSERT2\\(|ASSERT3\\(|COMPILATION>|DEFERS|DOES>|INTERPRETATION>|OF|POSTPONE)(?=\\s|$)',
           caseInsensitive: true},
         { token: 'keyword.other.non-immediate.forth',
           regex: '(?:^|\\s)(?:\'|<IS>|<TO>|CHAR|END-STRUCT|INCLUDE[D]?|LOAD|NEEDS|REQUIRE[D]?|REVISION|SEE|STRUCT|THRU|USE)(?=\\s|$)',
           caseInsensitive: true},
         { token: 'keyword.other.warning.forth',
           regex: '(?:^|\\s)(?:~~|BREAK:|BREAK"|DBG)(?=\\s|$)',
           caseInsensitive: true}],
      '#word-def':
       [ { token:
            [ 'keyword.other.compile-only.forth',
              'keyword.other.compile-only.forth',
              'meta.block.forth',
              'entity.name.function.forth' ],
           regex: '(:NONAME)|(^:|\\s:)(\\s)(\\S+)(?=\\s|$)',
           caseInsensitive: true,
           push:
            [ { token: 'keyword.other.compile-only.forth',
                regex: ';(?:CODE)?',
                caseInsensitive: true,
                next: 'pop' },
              { include: '#constant' },
              { include: '#comment' },
              { include: '#string' },
              { include: '#word' },
              { include: '#variable' },
              { include: '#storage' },
              { defaultToken: 'meta.block.forth' } ] } ] };
    
    this.normalizeRules();
};

ForthHighlightRules.metaData = { fileTypes: [ 'frt', 'fs', 'ldr', 'fth', '4th' ],
      foldingStartMarker: '/\\*\\*|\\{\\s*$',
      foldingStopMarker: '\\*\\*/|^\\s*\\}',
      keyEquivalent: '^~F',
      name: 'Forth',
      scopeName: 'source.forth' };


oop.inherits(ForthHighlightRules, TextHighlightRules);

exports.ForthHighlightRules = ForthHighlightRules;
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

ace.define("ace/mode/forth",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/forth_highlight_rules","ace/mode/folding/cstyle"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var ForthHighlightRules = require("./forth_highlight_rules").ForthHighlightRules;
var FoldMode = require("./folding/cstyle").FoldMode;

var Mode = function() {
    this.HighlightRules = ForthHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "--";
    this.blockComment = null;
    this.$id = "ace/mode/forth";
}).call(Mode.prototype);

exports.Mode = Mode;
});
