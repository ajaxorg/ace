/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */
define(function(require, exports, module) {
"use strict";

var WorkerClient = require("../worker/worker_client").WorkerClient;
var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var XQueryLexer = require("./xquery/XQueryLexer").XQueryLexer;
var Range = require("../range").Range;
var XQueryBehaviour = require("./behaviour/xquery").XQueryBehaviour;
var CStyleFoldMode = require("./folding/cstyle").FoldMode;
var Anchor = require("../anchor").Anchor;
var SnippetManager = require("../snippets").snippetManager;
var Editor = require("../editor").Editor;

var Mode = function() {
    this.$tokenizer   = new XQueryLexer();
    //this.$behaviour   = new XQueryBehaviour();
    this.foldingRules = new CStyleFoldMode();

    SnippetManager.register({ 
        content: 'import module namespace ${1:ns} = "${2:http://www.example.com/}";',
        tabTrigger: "import",
        name: "ImportModule"
    });

    SnippetManager.register({ 
        content: 'some $${1:var} in ${2:expr} satisfies ${3:expr}',
        tabTrigger: "some",
        name: "SomeQuantifiedExpr"
    });

    SnippetManager.register({ 
        content: 'every $${1:var} in ${2:expr} satisfies ${3:expr}',
        tabTrigger: "every",
        name: "EveryQuantifiedExpr"
    });

    SnippetManager.register({ 
        content: 'if(${1:true}) then ${2:expr} else ${3:true}',
        tabTrigger: "if",
        name: "IfExpr"
    });

    SnippetManager.register({ 
        content: 'switch(${1:"foo"})\n  case ${2:"foo"}\n  return ${3:true}\ndefault return ${4:false}',
        tabTrigger: "switch",
        name: "SwitchExpr"
    });

    SnippetManager.register({ 
      content: 'try { ${1:expr} } catch ${2:*} { ${3:expr} }',
        tabTrigger: "try",
        name: "TryExpr"
    });

    SnippetManager.register({ 
      content: 'for $${1:var} in ${2:expr}\nreturn ${3:expr}',
      tabTrigger: "for",
      name: "ForClause"
    });

    SnippetManager.register({ 
      content: 'for tumbling window $${1:var} in ${2:expr}\nstart at $${3:start} when ${4:expr}\nend at $${5:end} when ${6:expr}\nreturn ${7:expr}',
      tabTrigger: "tumbling",
      name: "TumblingWindow"
    });

    SnippetManager.register({ 
      content: 'for sliding window $${1:var} in ${2:expr}\nstart at $${3:start} when ${4:expr}\nend at $${5:end} when ${6:expr}\nreturn ${7:expr}',
      tabTrigger: "sliding",
      name: "SlidingWindow"
    });

    SnippetManager.register({ 
      content: 'let $${1:var} := ${2:expr}',
      tabTrigger: "let",
      name: "LetClause"
    });

    SnippetManager.register({ 
      content: 'group by $${1:var} := ${2:expr}',
      tabTrigger: "group",
      name: "GroupByClause"
    });

    SnippetManager.register({ 
      content: 'order by ${1:expr} ${2:descending}',
      tabTrigger: "order",
      name: "OrderByClause"
    });

    SnippetManager.register({ 
      content: 'stable order by ${1:expr}',
      tabTrigger: "stable",
      name: "StableOrderByClause"
    });

    //SnippetManager.register({
    //  content: 'collation "${1:collationURI}"',
    //  tabTrigger: "collation",
    //  name: "Collation"
    //});

    SnippetManager.register({ 
      content: 'count $${1:var}',
      tabTrigger: "count",
      name: "CountByClause"
    });
 
    //SnippetManager.register({ 
    //  content: '${1:expr} ! ${2:expr}',
    //  tabTrigger: "map",
    //  name: "MapOperator"
    //});
     
    SnippetManager.register({ 
      content: 'ordered { ${1:expr} }',
      tabTrigger: "ordered",
      name: "OrderedExpr"
    });
     
    SnippetManager.register({ 
      content: 'unordered { ${1:expr} }',
      tabTrigger: "unordered",
      name: "UnorderedExpr"
    });
     
    SnippetManager.register({ 
      content: 'treat as ${1:expr}',
      tabTrigger: "treat",
      name: "TreatAs"
    });

    SnippetManager.register({ 
      content: 'castable as ${1:atomicType}',
      tabTrigger: "castable",
      name: "CastableAs"
    });

    SnippetManager.register({ 
      content: 'cast as ${1:atomicType}',
      tabTrigger: "cast",
      name: "CastAs"
    });

    SnippetManager.register({ 
      content: 'typeswitch(${1:expr})\ncase ${2:type}\n  return ${3:expr}\ndefault return ${4:expr}',
        tabTrigger: "typeswitch",
        name: "SwitchExpr"
    });

    SnippetManager.register({ 
      content: 'declare variable $${1:varname} := ${2:expr};',
      tabTrigger: "var",
      name: "VariableDecl"
    });

    SnippetManager.register({ 
      content: 'declare function ${1:ns}:${2:name}(){\n  ${3:expr}\n};',
      tabTrigger: "fn",
      name: "FunctionDecl"
    });

    SnippetManager.register({ 
      content: 'module namespace ${1:ns} = "${2:http://www.example.com}";',
      tabTrigger: "module",
      name: "ModuleDecl"
    });


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
        
      var worker = new WorkerClient(["ace"], "ace/mode/xquery_worker", "XQueryWorker");
        var that = this;

        worker.attachToDocument(session.getDocument());
        
        worker.on("markers", function(e) {
          session.clearAnnotations();
          that.addMarkers(e.data, session);
        });
        
        //worker.on("ok", function(e) {
        //});
        
        worker.on("highlight", function(tokens) {
          that.$tokenizer.tokens = tokens.data.tokens;
          that.$tokenizer.lines  = session.getDocument().getAllLines();
          
          var rows = Object.keys(that.$tokenizer.tokens);
          for(var i=0; i < rows.length; i++) {
            var row = parseInt(rows[i]);
            delete session.bgTokenizer.lines[row];
            delete session.bgTokenizer.states[row];
            session.bgTokenizer.fireUpdateEvent(row, row);
          }
        });
        
        return worker;
    };

    this.removeMarkers = function(session) {
        var markers = session.getMarkers(false);
        for (var id in markers) {
            // All language analysis' markers are prefixed with language_highlight
            if (markers[id].clazz.indexOf('language_highlight_') === 0) {
                session.removeMarker(id);
            }
        }
        for (var i = 0; i < session.markerAnchors.length; i++) {
            session.markerAnchors[i].detach();
        }
        session.markerAnchors = [];
    };

    this.addMarkers = function(annos, mySession) {
        var _self = this;
        
        if (!mySession.markerAnchors) mySession.markerAnchors = [];
        this.removeMarkers(mySession);
        mySession.languageAnnos = [];
        annos.forEach(function(anno) {
            // Certain annotations can temporarily be disabled
            //if (_self.disabledMarkerTypes[anno.type])
            //    return;
            // Multi-line markers are not supported, and typically are a result from a bad error recover, ignore
            //if(anno.pos.el && anno.pos.sl !== anno.pos.el)
            //    return;
            // Using anchors here, to automaticaly move markers as text around the marker is updated
            var anchor = new Anchor(mySession.getDocument(), anno.pos.sl, anno.pos.sc || 0);
            mySession.markerAnchors.push(anchor);
            var markerId;
            var colDiff = anno.pos.ec - anno.pos.sc;
            var rowDiff = anno.pos.el - anno.pos.sl;
            var gutterAnno = {
                guttertext: anno.message,
                type: anno.level || "warning",
                text: anno.message
                // row will be filled in updateFloat()
            };

            function updateFloat(single) {
                if (markerId)
                    mySession.removeMarker(markerId);
                gutterAnno.row = anchor.row;
                if (anno.pos.sc !== undefined && anno.pos.ec !== undefined) {
                    var range = new Range(anno.pos.sl, anno.pos.sc, anno.pos.el, anno.pos.ec);
                    //var range = Range.fromPoints(anchor.getPosition(), {
                    //    row: anchor.row + rowDiff,
                    //    column: anchor.column + colDiff
                    //});
                    markerId = mySession.addMarker(range, "language_highlight_" + (anno.type ? anno.type : "default"));
                }
                if (single) mySession.setAnnotations(mySession.languageAnnos);
            }
            updateFloat();
            anchor.on("change", function() {
                updateFloat(true);
            });
            if (anno.message) mySession.languageAnnos.push(gutterAnno);
        });
        mySession.setAnnotations(mySession.languageAnnos);
    };
    
}).call(Mode.prototype);

exports.Mode = Mode;
});
