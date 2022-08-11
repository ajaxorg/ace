"use strict";
var dom = require("../lib/dom");
var oop = require("../lib/oop");
var EventEmitter = require("../lib/event_emitter").EventEmitter;

var Decorator = function (parent, renderer) {
    this.canvas = dom.createElement("canvas");
    this.renderer = renderer;
    this.pixelRatio = 1;
    this.maxHeight = renderer.layerConfig.maxHeight;
    this.lineHeight = renderer.layerConfig.lineHeight;
    this.canvasHeight = parent.parent.scrollHeight;
    this.heightRatio = this.canvasHeight / this.maxHeight;
    this.canvasWidth = parent.width;
    this.minDecorationHeight = (2 * this.pixelRatio) | 0;
    this.halfMinDecorationHeight = (this.minDecorationHeight / 2) | 0;

    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.canvas.style.top = 0  + "px";
    this.canvas.style.right = 0 + "px";
    this.canvas.style.zIndex = 7 + "px";
    this.canvas.style.position = "absolute";
    this.colors = {};
    this.colors.dark = {
        "error": "rgba(255, 18, 18, 1)",
        "warning": "rgba(18, 136, 18, 1)",
        "info": "rgba(18, 18, 136, 1)"
    };

    this.colors.light = {
        "error": "rgba(255, 18, 18, 0.7)",
        "warning": "rgba(18, 136, 18, 0.7)",
        "info": "rgba(18, 18, 136, 0.7)"
    };

    parent.element.appendChild(this.canvas);

};

(function () {
    oop.implement(this, EventEmitter);

    this.$updateDecorators = function (config) {
        var colors = (this.renderer.theme.isDark === true) ? this.colors.dark : this.colors.light;
        if (config) {
            this.maxHeight = config.maxHeight;
            this.lineHeight = config.lineHeight;
            this.heightRatio = this.canvasHeight / this.maxHeight;
        }
        var ctx = this.canvas.getContext("2d");

        function compare(a, b) {
            if (a.typeNumber < b.typeNumber) return -1;
            if (a.typeNumber > b.typeNumber) return 1;
            return 0;
        }

        var annotations = this.renderer.session.$annotations;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (annotations) {
            annotations.forEach(function (item) {
                switch (item.type) {
                    case "info":
                        item.typeNumber = 1;
                        break;
                    case "warning":
                        item.typeNumber = 2;
                        break;
                    case "error":
                        item.typeNumber = 3;
                        break;
                }
            });
            annotations = annotations.sort(compare);
            var foldData = this.renderer.session.$foldData;

            let prevY1 = 0;
            let prevY2 = 0;
            for (let i = 0; i < annotations.length; i++) {
                let currentRow = annotations[i].row;
                let compensateFold = this.compensateFoldRows(currentRow, foldData);
                let currentY = Math.round((currentRow - compensateFold) * this.lineHeight * this.heightRatio);
                let y1 = ((currentRow - compensateFold) * this.lineHeight * this.heightRatio) | 0;
                let y2 = (((currentRow - compensateFold) * this.lineHeight + this.lineHeight) * this.heightRatio) | 0;
                const height = y2 - y1;
                if (height < this.minDecorationHeight) {
                    let yCenter = ((y1 + y2) / 2) | 0;
                    if (yCenter < this.halfMinDecorationHeight) {
                        yCenter = this.halfMinDecorationHeight;
                    }
                    else if (yCenter + this.halfMinDecorationHeight > this.canvasHeight) {
                        yCenter = this.canvasHeight - this.halfMinDecorationHeight;
                    }
                    y1 = yCenter - this.halfMinDecorationHeight;
                    y2 = yCenter + this.halfMinDecorationHeight;
                }

                if (y1 > prevY2 + 1) {
                    prevY1 = y1;
                    prevY2 = y2;
                }
                else {
                    if (y2 > prevY2) {
                        prevY2 = y2;
                    }
                }

                switch (annotations[i].type) {
                    case "info":
                        ctx.fillStyle = colors.info;
                        break;
                    case "warning":
                        ctx.fillStyle = colors.warning;
                        break;
                    case "error":
                        ctx.fillStyle = colors.error;
                        break;
                }
                ctx.fillRect(0, currentY, this.canvasWidth, prevY2 - prevY1);
            }
        }
        var cursor = this.renderer.session.selection.getCursor();
        if (cursor) {
            let compensateFold = this.compensateFoldRows(cursor.row, foldData);
            let currentY = Math.round((cursor.row - compensateFold) * this.lineHeight * this.heightRatio);
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, currentY, this.canvasWidth, 2);
        }

    };

    this.compensateFoldRows = function (currentRow, foldData) {
        let compensateFold = 0;
        if (foldData && foldData.length > 0) {
            for (let j = 0; j < foldData.length; j++) {
                if (currentRow > foldData[j].start.row && currentRow < foldData[j].end.row) {
                    compensateFold += currentRow - foldData[j].start.row;
                }
                else if (currentRow >= foldData[j].end.row) {
                    compensateFold += foldData[j].end.row - foldData[j].start.row;
                }
            }
        }
        return compensateFold;
    }
}.call(Decorator.prototype));

exports.Decorator = Decorator;