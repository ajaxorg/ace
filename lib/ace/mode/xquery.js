/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Wolfgang Meier
 *      William Candillon <wcandillon AT gmail DOT com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
define(function(require, exports, module) {
"use strict";

var WorkerClient = require("../worker/worker_client").WorkerClient;
var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var XQueryHighlightRules = require("./xquery_highlight_rules").XQueryHighlightRules;
var XQueryBehaviour = require("./behaviour/xquery").XQueryBehaviour;
//var XQueryBackgroundHighlighter = require("./xquery_background_highlighter").XQueryBackgroundHighlighter;
var Range = require("../range").Range;

var Mode = function(parent) {
    this.$tokenizer   = new Tokenizer(new XQueryHighlightRules().getRules());
    this.$behaviour   = new XQueryBehaviour(parent);
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
    
    this.createWorker = function(session) {
        this.$deltas = [];
        var worker = new WorkerClient(["ace"], "ace/mode/xquery_worker", "XQueryWorker");
        var that = this;

        session.getDocument().on('change', function(evt){
          that.$deltas.push(evt.data);
        });

        worker.attachToDocument(session.getDocument());
        
        worker.on("start", function(e) {
          //console.log("start");
          that.$deltas = [];
        });

        worker.on("error", function(e) {
          session.setAnnotations([e.data]);
        });
        
        worker.on("ok", function(e) {
            session.clearAnnotations();
        });
        
        worker.on("highlight", function(tokens) {
          var firstRow = 0;
          var lastRow = session.getLength() - 1;
          
          var lines = tokens.data.lines;
          var states = tokens.data.states;
          
          for(var i=0; i < that.$deltas.length; i++)
          {
            var delta = that.$deltas[i];
         
            if (delta.action === "insertLines")
            {
              var newLineCount = delta.lines.length;
              for (var i = 0; i < newLineCount; i++) {
                lines.splice(delta.range.start.row + i, 0, undefined);
                states.splice(delta.range.start.row + i, 0, undefined);
              }
            }
            else if (delta.action === "insertText")
            {
              if (session.getDocument().isNewLine(delta.text))
              {
                lines.splice(delta.range.end.row, 0, undefined);
                states.splice(delta.range.end.row, 0, undefined);
              } else {
                lines[delta.range.start.row] = undefined;
                states[delta.range.start.row] = undefined;
              } 
            } else if (delta.action === "removeLines") {
              var oldLineCount = delta.lines.length;
              lines.splice(delta.range.start.row, oldLineCount);
              states.splice(delta.range.start.row, oldLineCount);
            } else if (delta.action === "removeText") {
              if (session.getDocument().isNewLine(delta.text))
              {
                lines[delta.range.start.row] = undefined;
                lines.splice(delta.range.end.row, 1);
                states[delta.range.start.row] = undefined;
                states.splice(delta.range.end.row, 1);
              } else {
                lines[delta.range.start.row] = undefined;
                states[delta.range.start.row] = undefined;
              }
            }           
          }
          session.bgTokenizer.lines = lines;
          session.bgTokenizer.states = states;
          session.bgTokenizer.fireUpdateEvent(firstRow, lastRow);
        });
        
        return worker;
    };
    
}).call(Mode.prototype);

exports.Mode = Mode;
});
