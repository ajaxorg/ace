"use strict";
var dom = require("../lib/dom");
var oop = require("../lib/oop");
var EventEmitter = require("../lib/event_emitter").EventEmitter;

class Decorator {
    /**
     * @param {import("../../ace-internal").Ace.VScrollbar} scrollbarV
     * @param {import("../virtual_renderer").VirtualRenderer} renderer
     */
    constructor(scrollbarV, renderer) {
        this.renderer = renderer;

        this.pixelRatio = 1;
        this.maxHeight = renderer.layerConfig.maxHeight;
        this.lineHeight = renderer.layerConfig.lineHeight;
        this.minDecorationHeight = (2 * this.pixelRatio) | 0;
        this.halfMinDecorationHeight = (this.minDecorationHeight / 2) | 0;
        this.colors = {};
        this.colors.dark = {
            "error": "rgba(255, 18, 18, 1)",
            "warning": "rgba(18, 136, 18, 1)",
            "info": "rgba(18, 18, 136, 1)",
        };

        this.colors.light = {
            "error": "rgb(255,51,51)",
            "warning": "rgb(32,133,72)",
            "info": "rgb(35,68,138)",
        };

        this.setScrollBarV(scrollbarV);
    }

    $createCanvas() {
        this.canvas = dom.createElement("canvas");
        this.canvas.style.top = 0 + "px";
        this.canvas.style.right = 0 + "px";
        this.canvas.style.zIndex = "7";
        this.canvas.style.position = "absolute";
    }

    setScrollBarV(scrollbarV) {
        this.$createCanvas();
        this.scrollbarV = scrollbarV;
        scrollbarV.element.appendChild(this.canvas);
        this.setDimensions();
    }

    $updateDecorators(config) {
        if (typeof this.canvas.getContext !== "function") {
            return;
        }
        var colors = (this.renderer.theme.isDark === true) ? this.colors.dark : this.colors.light;
        this.setDimensions(config);

        var ctx = this.canvas.getContext("2d");

        function compare(a, b) {
            if (a.priority < b.priority) return -1;
            if (a.priority > b.priority) return 1;
            return 0;
        }

        var annotations = this.renderer.session.$annotations;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (annotations) {
            var priorities = {
                "info": 1,
                "warning": 2,
                "error": 3
            };
            annotations.forEach(function (item) {
                item["priority"] = priorities[item.type] || null;
            });
            annotations = annotations.sort(compare);

            for (let i = 0; i < annotations.length; i++) {
                let row = annotations[i].row;
                const offset1 = this.getVerticalOffsetForRow(row);
                const offset2 = offset1 + this.lineHeight;

                const y1 = Math.round(this.heightRatio * offset1);
                const y2 = Math.round(this.heightRatio * offset2);
                let ycenter = Math.round((y1 + y2) / 2);
                let halfHeight = (y2 - ycenter);

                if (halfHeight < this.halfMinDecorationHeight) {
                    halfHeight = this.halfMinDecorationHeight;
                }
                if (ycenter - halfHeight < 0) {
                    ycenter = halfHeight;
                }
                if (ycenter + halfHeight > this.canvasHeight) {
                    ycenter = this.canvasHeight - halfHeight;
                }

                const from =  ycenter - halfHeight;
                const to = ycenter + halfHeight;
                const zoneHeight = to - from;

                ctx.fillStyle = colors[annotations[i].type] || null;
                ctx.fillRect(0, from, Math.round(this.oneZoneWidth - 1), zoneHeight);
            }
        }
        var cursor = this.renderer.session.selection.getCursor();
        if (cursor) {
            let currentY = Math.round(this.getVerticalOffsetForRow(cursor.row) * this.heightRatio);
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, currentY, this.canvasWidth, 2);
        }

    }

    getVerticalOffsetForRow(row) {
        row = row | 0;
        const offset = this.renderer.session.documentToScreenRow(row, 0) * this.lineHeight;
        return offset;
    }

    setDimensions(config) {
        config = config || this.renderer.layerConfig;
        this.maxHeight = config.maxHeight;
        this.lineHeight = config.lineHeight;
        this.canvasHeight = config.height;
        this.canvasWidth = this.scrollbarV.width || this.canvasWidth;

        this.setZoneWidth();

        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        if (this.maxHeight < this.canvasHeight) {
            this.heightRatio = 1;
        }
        else {
            this.heightRatio = this.canvasHeight / this.maxHeight;
        }
    }

    setZoneWidth() {
        this.oneZoneWidth = this.canvasWidth;
    }

    destroy() {
        this.canvas.parentNode.removeChild(this.canvas);
    }
}

oop.implement(Decorator.prototype, EventEmitter);

exports.Decorator = Decorator;
