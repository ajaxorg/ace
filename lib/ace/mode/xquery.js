/*
 *  eXide - web-based XQuery IDE
 *  
 *  Copyright (C) 2011 Wolfgang Meier
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
define("ace/mode/xquery", function(require, exports, module) {

var oop = require("ace/lib/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var XQueryHighlightRules = require("ace/mode/xquery_highlight_rules").XQueryHighlightRules;
var XQueryBehaviour = require("ace/mode/behaviour/xquery").XQueryBehaviour;
var Range = require("ace/range").Range;

var Mode = function(parent) {
    this.$tokenizer = new Tokenizer(new XQueryHighlightRules().getRules());
    this.$behaviour = new XQueryBehaviour(parent);
};

oop.inherits(Mode, TextMode);

(function() {

    this.getNextLineIndent = function(state, line, tab) {
      var indent = this.$getIndent(line);
      var match = line.match(/\s*(?:then|else|return|[{\(]|<\w+>)\s*$/);
      if (match)
        indent += tab;
        return indent;
    };
    
    this.checkOutdent = function(state, line, input) {
      if (! /^\s+$/.test(line))
            return false;

        return /^\s*[\}\)]/.test(input);
    };
    
    this.autoOutdent = function(state, doc, row) {
      var line = doc.getLine(row);
        var match = line.match(/^(\s*[\}\)])/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        var match = line.match(/^(\s+)/);
        if (match) {
            return match[1];
        }

        return "";
    };
    
    this.toggleCommentLines = function(state, doc, startRow, endRow) {
        var i, line;
        var outdent = true;
        var re = /^\s*\(:(.*):\)/;

        for (i=startRow; i<= endRow; i++) {
            if (!re.test(doc.getLine(i))) {
                outdent = false;
                break;
            }
        }

        var range = new Range(0, 0, 0, 0);
        for (i=startRow; i<= endRow; i++) {
            line = doc.getLine(i);
            range.start.row  = i;
            range.end.row    = i;
            range.end.column = line.length;

            doc.replace(range, outdent ? line.match(re)[1] : "(:" + line + ":)");
        }
    };
}).call(Mode.prototype);

exports.Mode = Mode;
});

define("ace/mode/behaviour/xml", function(require, exports, module) {

  var oop = require("ace/lib/oop");
  var Behaviour = require('ace/mode/behaviour').Behaviour;
  var CstyleBehaviour = require('ace/mode/behaviour/cstyle').CstyleBehaviour;
  var XQueryBehaviour = require('ace/mode/behaviour/xquery').XQueryBehaviour;
  
  var XMLBehaviour = function (parent) {
      
    this.inherit(CstyleBehaviour, ["braces", "parens", "string_dquotes"]); // Get string behaviour
      this.parent = parent;
      
      this.add("brackets", "insertion", function (state, action, editor, session, text) {
          if (text == "\n") {
              var cursor = editor.getCursorPosition();
              var line = session.doc.getLine(cursor.row);
              var rightChars = line.substring(cursor.column, cursor.column + 2);
              if (rightChars == '</') {
                  var indent = this.$getIndent(session.doc.getLine(cursor.row)) + session.getTabString();
                  var next_indent = this.$getIndent(session.doc.getLine(cursor.row));

                  return {
                      text: '\n' + indent + '\n' + next_indent,
                      selection: [1, indent.length, 1, indent.length]
                  }
              }
          }
          return false;
      });

      // Check for open tag if user enters / and auto-close it.
      this.add("slash", "insertion", function (state, action, editor, session, text) {
        if (text == "/") {
          var cursor = editor.getCursorPosition();
        var line = session.doc.getLine(cursor.row);
        if (cursor.column > 0 && line.charAt(cursor.column - 1) == "<") {
          line = line.substring(0, cursor.column) + "/" + line.substring(cursor.column);
          var lines = session.doc.getAllLines();
          lines[cursor.row] = line;
          // call mode helper to close the tag if possible
                    parent.exec("closeTag", lines.join(session.doc.getNewLineCharacter()), cursor.row);
        }
        }
      return false;
      });
  }
  oop.inherits(XMLBehaviour, Behaviour);

  exports.XMLBehaviour = XMLBehaviour;
});

define("ace/mode/xml", function(require, exports, module) {

  var oop = require("ace/lib/oop");
  var XmlMode = require("ace/mode/xml").Mode;
  var Tokenizer = require("ace/tokenizer").Tokenizer;
  var XmlHighlightRules = require("ace/mode/xml_highlight_rules").XmlHighlightRules;
  var XMLBehaviour = require("ace/mode/behaviour/xml").XMLBehaviour;
  var Range = require("ace/range").Range;

  var Mode = function(parent) {
      this.$tokenizer = new Tokenizer(new XmlHighlightRules().getRules());
      this.$behaviour = new XMLBehaviour(parent);
  };

  oop.inherits(Mode, XmlMode);

  (function() {
        
        this.toggleCommentLines = function(state, doc, startRow, endRow) {
            var i, line;
            var outdent = true;
            var re = /^\s*<!--(.*)-->/;
    
            for (i=startRow; i<= endRow; i++) {
                if (!re.test(doc.getLine(i))) {
                    outdent = false;
                    break;
                }
            }
    
            var range = new Range(0, 0, 0, 0);
            for (i=startRow; i<= endRow; i++) {
                line = doc.getLine(i);
                range.start.row  = i;
                range.end.row    = i;
                range.end.column = line.length;
    
                doc.replace(range, outdent ? line.match(re)[1] : "<!--" + line + "-->");
            }
        };
        
  }).call(Mode.prototype);

  exports.Mode = Mode;
});

define("ace/mode/html", function(require, exports, module) {

    var oop = require("ace/lib/oop");
  var HtmlMode = require("ace/mode/html").Mode;
  var Tokenizer = require("ace/tokenizer").Tokenizer;
  var HtmlHighlightRules = require("ace/mode/html_highlight_rules").HtmlHighlightRules;
  var XMLBehaviour = require("ace/mode/behaviour/xml").XMLBehaviour;
  var Range = require("ace/range").Range;

  var Mode = function(parent) {
      this.$tokenizer = new Tokenizer(new HtmlHighlightRules().getRules());
      this.$behaviour = new XMLBehaviour(parent);
  };

  oop.inherits(Mode, HtmlMode);

  (function() {
        
        this.toggleCommentLines = function(state, doc, startRow, endRow) {
            var i, line;
            var outdent = true;
            var re = /^\s*<!--(.*)-->/;
    
            for (i=startRow; i<= endRow; i++) {
                if (!re.test(doc.getLine(i))) {
                    outdent = false;
                    break;
                }
            }
    
            var range = new Range(0, 0, 0, 0);
            for (i=startRow; i<= endRow; i++) {
                line = doc.getLine(i);
                range.start.row  = i;
                range.end.row    = i;
                range.end.column = line.length;
    
                doc.replace(range, outdent ? line.match(re)[1] : "<!--" + line + "-->");
            }
        };
  }).call(Mode.prototype);

  exports.Mode = Mode;
});

