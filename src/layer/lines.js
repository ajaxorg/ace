"use strict";
/**
 * @typedef {import("../edit_session").EditSession} EditSession
 * @typedef {import("../../ace-internal").Ace.LayerConfig} LayerConfig
 */
var dom = require("../lib/dom");

class Lines {
    /**
     * @param {HTMLElement} element
     * @param {number} [canvasHeight]
     */
    constructor(element, canvasHeight) {
        this.element = element;
        this.canvasHeight = canvasHeight || 500000;
        this.element.style.height = (this.canvasHeight * 2) + "px";

        this.cells = [];
        this.cellCache = [];
        this.$offsetCoefficient = 0;
    }

    /**
     * @param {LayerConfig} config
     */
    moveContainer(config) {
        dom.translate(this.element, 0, -((config.firstRowScreen * config.lineHeight) % this.canvasHeight) - config.offset * this.$offsetCoefficient);
    }

    /**
     * @param {LayerConfig} oldConfig
     * @param {LayerConfig} newConfig
     */
    pageChanged(oldConfig, newConfig) {
        return (
            Math.floor((oldConfig.firstRowScreen * oldConfig.lineHeight) / this.canvasHeight) !==
            Math.floor((newConfig.firstRowScreen * newConfig.lineHeight) / this.canvasHeight)
        );
    }

    /**
     * @param {number} row
     * @param {Partial<LayerConfig>} config
     * @param {EditSession} session
     */
    computeLineTop(row, config, session) {
        var screenTop = config.firstRowScreen * config.lineHeight;
        var screenPage = Math.floor(screenTop / this.canvasHeight);
        var lineTop = session.documentToScreenRow(row, 0) * config.lineHeight;
        return lineTop - (screenPage * this.canvasHeight);
    }

    /**
     * @param {number} row
     * @param {LayerConfig} config
     * @param {EditSession} session
     */
    computeLineHeight(row, config, session) {
        return config.lineHeight * session.getRowLineCount(row);
    }
    
    getLength() {
        return this.cells.length;
    }

    /**
     * @param {number} index
     */
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
