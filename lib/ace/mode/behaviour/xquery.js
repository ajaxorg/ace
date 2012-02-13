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
define(function(require, exports, module) {
"use strict";

  var oop = require("../../lib/oop");
  var Behaviour = require('../behaviour').Behaviour;
  var CstyleBehaviour = require('./cstyle').CstyleBehaviour;

  var XQueryBehaviour = function (parent) {
      
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
  oop.inherits(XQueryBehaviour, Behaviour);

  exports.XQueryBehaviour = XQueryBehaviour;
});
