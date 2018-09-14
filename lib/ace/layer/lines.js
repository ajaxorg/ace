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

var Lines = function(element, canvasHeight) {
    this.element = element;
    this.canvasHeight = canvasHeight || 500000;
    this.element.style.height = (this.canvasHeight * 2) + "px";
    
    this.cells = [];
    this.cellCache = [];
    this.$offsetCoefficient = 0;
};

(function() {
    
    this.moveContainer = function(config) {
        dom.translate(this.element, 0, -((config.firstRowScreen * config.lineHeight) % this.canvasHeight) - config.offset * this.$offsetCoefficient);
    };    
    
    this.pageChanged = function(oldConfig, newConfig) {
        return (
            Math.floor((oldConfig.firstRowScreen * oldConfig.lineHeight) / this.canvasHeight) !==
            Math.floor((newConfig.firstRowScreen * newConfig.lineHeight) / this.canvasHeight)
        );
    };
    
    this.computeLineTop = function(row, config, session) {
        var screenTop = config.firstRowScreen * config.lineHeight;
        var screenPage = Math.floor(screenTop / this.canvasHeight);
        var lineTop = session.documentToScreenRow(row, 0) * config.lineHeight;
        return lineTop - (screenPage * this.canvasHeight);
    };
    
    this.computeLineHeight = function(row, config, session) {
        return config.lineHeight * session.getRowLength(row);
    };
    
    this.getLength = function() {
        return this.cells.length;
    };
    
    this.get = function(index) {
        return this.cells[index];
    };
    
    this.shift = function() {
        this.$cacheCell(this.cells.shift());
    };
    
    this.pop = function() {
        this.$cacheCell(this.cells.pop());
    };
    
    this.push = function(cell) {
        if (Array.isArray(cell)) {
            this.cells.push.apply(this.cells, cell);
            var fragment = dom.createFragment(this.element);
            for (var i=0; i<cell.length; i++) {
                fragment.appendChild(cell[i].element);
            }
            this.element.appendChild(fragment);
         } else {
            this.cells.push(cell);
            this.element.appendChild(cell.element);
         }
    };
    
    this.unshift = function(cell) {
        if (Array.isArray(cell)) {
            this.cells.unshift.apply(this.cells, cell);
            var fragment = dom.createFragment(this.element);
            for (var i=0; i<cell.length; i++) {
                fragment.appendChild(cell[i].element);
            }
            if (this.element.firstChild)
                this.element.insertBefore(fragment, this.element.firstChild);
            else
                this.element.appendChild(fragment);
         } else {
            this.cells.unshift(cell);
            this.element.insertAdjacentElement("afterbegin", cell.element);
         }
    };
    
    this.last = function() {
        if (this.cells.length)
            return this.cells[this.cells.length-1];
        else
            return null;
    };
    
    this.$cacheCell = function(cell) {
        if (!cell)
            return;
            
        cell.element.remove();
        this.cellCache.push(cell);
    };
    
    this.createCell = function(row, config, session, initElement) {
        var cell = this.cellCache.pop();
        if (!cell) {
            var element = dom.createElement("div");
            if (initElement)
                initElement(element);
            
            this.element.appendChild(element);
            
            cell = {
                element: element,
                text: "",
                row: row
            };
        }
        cell.row = row;
        
        return cell;
    };
    
}).call(Lines.prototype);

exports.Lines = Lines;

});
