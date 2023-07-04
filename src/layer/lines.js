"use strict";

var dom = require("../lib/dom");

class Lines {
    constructor(element, canvasHeight) {
        this.element = element;
        this.canvasHeight = canvasHeight || 500000;
        this.element.style.height = (this.canvasHeight * 2) + "px";

        this.cells = [];
        this.cellCache = [];
        this.$offsetCoefficient = 0;
    }
    
    moveContainer(config) {
        dom.translate(this.element, 0, -((config.firstRowScreen * config.lineHeight) % this.canvasHeight) - config.offset * this.$offsetCoefficient);
    }    
    
    pageChanged(oldConfig, newConfig) {
        return (
            Math.floor((oldConfig.firstRowScreen * oldConfig.lineHeight) / this.canvasHeight) !==
            Math.floor((newConfig.firstRowScreen * newConfig.lineHeight) / this.canvasHeight)
        );
    }
    
    computeLineTop(row, config, session) {
        var screenTop = config.firstRowScreen * config.lineHeight;
        var screenPage = Math.floor(screenTop / this.canvasHeight);
        var lineTop = session.documentToScreenRow(row, 0) * config.lineHeight;
        return lineTop - (screenPage * this.canvasHeight);
    }
    
    computeLineHeight(row, config, session) {
        return config.lineHeight * session.getRowLineCount(row);
    }
    
    getLength() {
        return this.cells.length;
    }
    
    get(index) {
        return this.cells[index];
    }
    
    shift() {
        this.$cacheCell(this.cells.shift());
    }
    
    pop() {
        this.$cacheCell(this.cells.pop());
    }
    
    push(cell) {
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
    }
    
    unshift(cell) {
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
    }
    
    last() {
        if (this.cells.length)
            return this.cells[this.cells.length-1];
        else
            return null;
    }
    
    $cacheCell(cell) {
        if (!cell)
            return;
            
        cell.element.remove();
        this.cellCache.push(cell);
    }
    
    createCell(row, config, session, initElement) {
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
    }
    
}

exports.Lines = Lines;
