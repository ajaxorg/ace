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

var dom = require("../lib/dom");
var oop = require("../lib/oop");
var lang = require("../lib/lang");
var EventEmitter = require("../lib/event_emitter").EventEmitter;

var Gutter = function(parentEl) {
    this.element = dom.createElement("div");
    this.element.className = "ace_layer ace_gutter-layer";
    parentEl.appendChild(this.element);
    this.setShowFoldWidgets(this.$showFoldWidgets);
    
    this.gutterWidth = 0;

    this.$annotations = [];
    this.$updateAnnotations = this.$updateAnnotations.bind(this);
    
    this.$cells = [];
};

(function() {

    oop.implement(this, EventEmitter);

    this.setSession = function(session) {
        if (this.session)
            this.session.removeEventListener("change", this.$updateAnnotations);
        this.session = session;
        if (session)
            session.on("change", this.$updateAnnotations);
    };

    this.addGutterDecoration = function(row, className){
        if (window.console)
            console.warn && console.warn("deprecated use session.addGutterDecoration");
        this.session.addGutterDecoration(row, className);
    };

    this.removeGutterDecoration = function(row, className){
        if (window.console)
            console.warn && console.warn("deprecated use session.removeGutterDecoration");
        this.session.removeGutterDecoration(row, className);
    };

    this.setAnnotations = function(annotations) {
        // iterate over sparse array
        this.$annotations = [];
        for (var i = 0; i < annotations.length; i++) {
            var annotation = annotations[i];
            var row = annotation.row;
            var rowInfo = this.$annotations[row];
            if (!rowInfo)
                rowInfo = this.$annotations[row] = {text: []};
           
            var annoText = annotation.text;
            annoText = annoText ? lang.escapeHTML(annoText) : annotation.html || "";

            if (rowInfo.text.indexOf(annoText) === -1)
                rowInfo.text.push(annoText);

            var type = annotation.type;
            if (type == "error")
                rowInfo.className = " ace_error";
            else if (type == "warning" && rowInfo.className != " ace_error")
                rowInfo.className = " ace_warning";
            else if (type == "info" && (!rowInfo.className))
                rowInfo.className = " ace_info";
        }
    };

    this.$updateAnnotations = function (delta) {
        if (!this.$annotations.length)
            return;
        var firstRow = delta.start.row;
        var len = delta.end.row - firstRow;
        if (len === 0) {
            // do nothing
        } else if (delta.action == 'remove') {
            this.$annotations.splice(firstRow, len + 1, null);
        } else {
            var args = new Array(len + 1);
            args.unshift(firstRow, 1);
            this.$annotations.splice.apply(this.$annotations, args);
        }
    };

    this.update = function(config) {
        this.config = config;
        var session = this.session;
        
        var firstRow = config.firstRow;
        var lastRow = Math.min(config.lastRow + config.gutterOffset,  // needed to compensate for hor scollbar
            session.getLength() - 1);
        var fold = session.getNextFoldLine(firstRow);
        var foldStart = fold ? fold.start.row : Infinity;
        var foldWidgets = this.$showFoldWidgets && session.foldWidgets;
        var breakpoints = session.$breakpoints;
        var decorations = session.$decorations;
        var firstLineNumber = session.$firstLineNumber;
        
        var gutterRenderer = session.gutterRenderer || this.$renderer;
        var lastLineNumber = 0;

        var cell = null;
        var index = -1;
        var row = firstRow;
        
        var cells = Array.prototype.slice.call(this.element.childNodes, 0);
        
        while (true) {
            if (row > foldStart) {
                row = fold.end.row + 1;
                fold = session.getNextFoldLine(row, fold);
                foldStart = fold ? fold.start.row : Infinity;
            }
            if (row > lastRow) {
                while (cells.length > index + 1) {
                    cell = cells.pop();
                    this.$cacheCell(cell);
                }
                break;
            }

            cell = cells[++index];
            if (!cell) {
                cell = this.$createCell();
                this.element.appendChild(cell);
            }

            this.$renderCell(cell, config, fold, row);
            
            row++;
        }

        this.element.style.height = config.minHeight + "px";
        this.$updateGutterWidth(config);
    };
    
    this.$updateGutterWidth = function(config) {
        var session = this.session;
        
        var gutterRenderer = session.gutterRenderer || this.$renderer;
        
        var firstLineNumber = session.$firstLineNumber;
        var lastLineNumber = this.element.lastChild.firstChild.data;
        
        if (this.$fixedWidth || session.$useWrapMode)
            lastLineNumber = session.getLength() + firstLineNumber;
            
        var gutterWidth = gutterRenderer 
            ? gutterRenderer.getWidth(session, lastLineNumber, config)
            : lastLineNumber.toString().length * config.characterWidth;
        
        var padding = this.$padding || this.$computePadding();
        gutterWidth += padding.left + padding.right;
        if (gutterWidth !== this.gutterWidth && !isNaN(gutterWidth)) {
            this.gutterWidth = gutterWidth;
            this.element.style.width = Math.ceil(this.gutterWidth) + "px";
            this._emit("changeGutterWidth", gutterWidth);
        }
    };
    
    this.scrollLines = function(config) {
        var oldConfig = this.config;
        this.config = config;

        if (!oldConfig || oldConfig.lastRow < config.firstRow)
            return this.update(config);

        if (config.lastRow < oldConfig.firstRow)
            return this.update(config);

        var el = this.element;
        if (oldConfig.firstRow < config.firstRow)
            for (var row=this.session.getFoldedRowCount(oldConfig.firstRow, config.firstRow - 1); row>0; row--)
                this.$cacheCell(el.firstChild);

        if (oldConfig.lastRow > config.lastRow)
            for (var row=this.session.getFoldedRowCount(config.lastRow + 1, oldConfig.lastRow); row>0; row--)
                this.$cacheCell(el.lastChild);

        if (config.firstRow < oldConfig.firstRow) {
            var fragment = this.$renderLinesFragment(config, config.firstRow, oldConfig.firstRow - 1);
            if (el.firstChild)
                el.insertBefore(fragment, el.firstChild);
            else
                el.appendChild(fragment);
        }

        if (config.lastRow > oldConfig.lastRow) {
            var fragment = this.$renderLinesFragment(config, oldConfig.lastRow + 1, config.lastRow);
            el.appendChild(fragment);
        }
        
        this.$updateGutterWidth(config);
    };

    this.$renderLinesFragment = function(config, firstRow, lastRow) {
        var fragment = dom.createFragment(this.element);
        var row = firstRow;
        var foldLine = this.session.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                row = foldLine.end.row+1;
                foldLine = this.session.getNextFoldLine(row, foldLine);
                foldStart = foldLine ? foldLine.start.row : Infinity;
            }
            if (row > lastRow)
                break;

            var cell = this.$createCell();
            fragment.appendChild(this.$renderCell(cell, config, foldLine, row));

            row++;
        }
        return fragment;
    };
    
    this.$cacheCell = function(cell) {
        this.element.removeChild(cell);
        this.$cells.push(cell);
    };
    
    this.$createCell = function() {
        var cell = this.$cells.pop();
        if (!cell) {
            cell = dom.createElement("div");
            cell.textNode = document.createTextNode('');
            cell.appendChild(cell.textNode);
            
            cell.foldWidget = dom.createElement("span");
            cell.appendChild(cell.foldWidget);
        }
        this.element.appendChild(cell);
        return cell;
    };
    
    this.$renderCell = function(element, config, fold, row) {
        var session = this.session;
        
        var foldWidget = element.childNodes[1];
        var textNode = element.childNodes[0];
        
        var firstLineNumber = session.$firstLineNumber;
        
        var session = this.session;
        var breakpoints = session.$breakpoints;
        var decorations = session.$decorations;
        var gutterRenderer = session.gutterRenderer || this.$renderer;
        var foldWidgets = this.$showFoldWidgets && session.foldWidgets;
        var foldStart = fold ? fold.start.row : Infinity;
        
        var className = "ace_gutter-cell ";
        if (breakpoints[row])
            className += breakpoints[row];
        if (decorations[row])
            className += decorations[row];
        if (this.$annotations[row])
            className += this.$annotations[row].className;
        if (element.className != className)
            element.className = className;

        var height = session.getRowLength(row) * config.lineHeight + "px";
        if (height != element.style.height)
            element.style.height = height;

        if (foldWidgets) {
            var c = foldWidgets[row];
            // check if cached value is invalidated and we need to recompute
            if (c == null)
                c = foldWidgets[row] = session.getFoldWidget(row);
        }

        if (c) {
            var className = "ace_fold-widget ace_" + c;
            if (c == "start" && row == foldStart && row < fold.end.row)
                className += " ace_closed";
            else
                className += " ace_open";
            if (foldWidget.className != className)
                foldWidget.className = className;

            var height = config.lineHeight + "px";
            if (foldWidget.style.height != height)
                foldWidget.style.height = height;
                
            if (foldWidget.style.display != "inline-block")
                foldWidget.style.display = "inline-block";
        } else {
            if (foldWidget) {
                if (foldWidget.style.display != "none")
                    foldWidget.style.display = "none";
            }
        }
        
        var text = (gutterRenderer
            ? gutterRenderer.getText(session, row)
            : row + firstLineNumber).toString();
            
        if (text !== textNode.data) {
            textNode.data = text;
        }
        
        return element;
    };

    this.$fixedWidth = false;
    
    this.$showLineNumbers = true;
    this.$renderer = "";
    this.setShowLineNumbers = function(show) {
        this.$renderer = !show && {
            getWidth: function() {return "";},
            getText: function() {return "";}
        };
    };
    
    this.getShowLineNumbers = function() {
        return this.$showLineNumbers;
    };
    
    this.$showFoldWidgets = true;
    this.setShowFoldWidgets = function(show) {
        if (show)
            dom.addCssClass(this.element, "ace_folding-enabled");
        else
            dom.removeCssClass(this.element, "ace_folding-enabled");

        this.$showFoldWidgets = show;
        this.$padding = null;
    };
    
    this.getShowFoldWidgets = function() {
        return this.$showFoldWidgets;
    };

    this.$computePadding = function() {
        if (!this.element.firstChild)
            return {left: 0, right: 0};
        var style = dom.computedStyle(this.element.firstChild);
        this.$padding = {};
        this.$padding.left = parseInt(style.paddingLeft) + 1 || 0;
        this.$padding.right = parseInt(style.paddingRight) || 0;
        return this.$padding;
    };

    this.getRegion = function(point) {
        var padding = this.$padding || this.$computePadding();
        var rect = this.element.getBoundingClientRect();
        if (point.x < padding.left + rect.left)
            return "markers";
        if (this.$showFoldWidgets && point.x > rect.right - padding.right)
            return "foldWidgets";
    };

}).call(Gutter.prototype);

exports.Gutter = Gutter;

});
