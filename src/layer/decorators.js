"use strict";
var dom = require("../lib/dom");
var oop = require("../lib/oop");
var EventEmitter = require("../lib/event_emitter").EventEmitter;

class Decorator {
    constructor(parent, renderer) {
        this.parentEl = parent;
        this.canvas = dom.createElement("canvas");
        this.renderer = renderer;
        this.pixelRatio = 1;
        this.maxHeight = renderer.layerConfig.maxHeight;
        this.lineHeight = renderer.layerConfig.lineHeight;
        this.minDecorationHeight = (2 * this.pixelRatio) | 0;
        this.halfMinDecorationHeight = (this.minDecorationHeight / 2) | 0;
        this.canvas.style.top = 0 + "px";
        this.canvas.style.right = 0 + "px";
        this.canvas.style.zIndex = "7";
        this.canvas.style.position = "absolute";
        this.colors = {};
        this.colors.dark = {
            "error": "rgba(255, 18, 18, 1)",
            "warning": "rgba(18, 136, 18, 1)",
            "info": "rgba(18, 18, 136, 1)",
            "delete": "rgba(255, 18, 18, 1)", //for diff decorators
            "insert": "rgba(18, 136, 18, 1)" //for diff decorators
        };

        this.colors.light = {
            "error": "rgb(255,51,51)",
            "warning": "rgb(32,133,72)",
            "info": "rgb(35,68,138)",
            "delete": "rgb(255,51,51)", // for diff decorators
            "insert": "rgb(32,133,72)" // for diff decorators
        };

        this.zones = [];

        this.setDimensions();

        parent.element.appendChild(this.canvas);
    }

    addZone(startRow, endRow, type, logicalLines) {
        this.zones.push({
            startRow,
            endRow,
            type,
            logicalLines
        });
    }

    $updateDecorators(config) {
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
                item.priority = priorities[item.type] || null;
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
        if (this.zones.length > 0) {
            this.$setDiffDecorators(ctx, colors);
        }
        var cursor = this.renderer.session.selection.getCursor();
        if (cursor) {
            let currentY = Math.round(this.getVerticalOffsetForRow(cursor.row) * this.heightRatio);
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, currentY, this.canvasWidth, 2);
        }

    }

    $setDiffDecorators(ctx, colors) {
        function compare(a, b) {
            if (a.from === b.from) {
                return a.to - b.to;
            }
            return a.from - b.from;
        }

        var zones = this.zones;
        if (zones) {
            var resolvedZones = [];

            const deleteZones = zones.filter(z => z.type === "delete");
            const insertZones = zones.filter(z => z.type === "insert");

            [deleteZones, insertZones].forEach((typeZones, columnIndex) => {
                typeZones.forEach((zone, i) => {
                    const offset1 = this.getVerticalOffsetForRow(zone.startRow);
                    const offset2 = this.getVerticalOffsetForRow(zone.endRow) + this.lineHeight;

                    const y1 = Math.round(this.heightRatio * offset1);
                    const y2 = Math.round(this.heightRatio * offset2);

                    const padding = 1;

                    let ycenter = Math.round((y1 + y2) / 2);
                    let halfHeight = (y2 - ycenter);

                    if (halfHeight < this.halfMinDecorationHeight) {
                        halfHeight = this.halfMinDecorationHeight;
                    }

                    const previousZone = resolvedZones[resolvedZones.length - 1];

                    if (i > 0 && previousZone && previousZone.type === zone.type && ycenter - halfHeight < previousZone.to + padding) {
                        ycenter = resolvedZones[resolvedZones.length - 1].to + padding + halfHeight;
                    }

                    if (ycenter - halfHeight < 0) {
                        ycenter = halfHeight;
                    }
                    if (ycenter + halfHeight > this.canvasHeight) {
                        ycenter = this.canvasHeight - halfHeight;
                    }

                    resolvedZones.push({
                        type: zone.type,
                        from: ycenter - halfHeight,
                        to: ycenter + halfHeight,
                        color: colors[zone.type] || null
                    });
                });
            });

            resolvedZones = resolvedZones.sort(compare);

            for (const zone of resolvedZones) {
                ctx.fillStyle = zone.color || null;

                const zoneFrom = zone.from;
                const zoneTo = zone.to;
                const zoneHeight = zoneTo - zoneFrom;

                if (zone.type == "delete") {
                    ctx.fillRect(this.oneZoneWidth, zoneFrom, this.oneZoneWidth, zoneHeight);
                }
                else {
                    ctx.fillRect(2 * this.oneZoneWidth, zoneFrom, this.oneZoneWidth, zoneHeight);
                }
            }

        }
    }


    compensateFoldRows(row) {
        let foldData = this.renderer.session.$foldData;
        let compensateFold = 0;
        if (foldData && foldData.length > 0) {
            for (let j = 0; j < foldData.length; j++) {
                if (row > foldData[j].start.row && row < foldData[j].end.row) {
                    compensateFold += row - foldData[j].start.row;
                }
                else if (row >= foldData[j].end.row) {
                    compensateFold += foldData[j].end.row - foldData[j].start.row;
                }
            }
        }
        return compensateFold;
    }

    compensateLineWidgets(row) {
        const widgetManager = this.renderer.session.widgetManager;
        if (widgetManager && widgetManager.lineWidgets && widgetManager.lineWidgets.length > 0) {
            let delta = 0;
            widgetManager.lineWidgets.forEach((el, index) => {
                if (row > index) {
                    delta += el.rowCount || 0;
                }
            });
            return delta - 1;
        }
        return 0;
    }

    getVerticalOffsetForRow(row) {
        row = row | 0;

        const baseHeight = this.lineHeight * row;
        const foldComp   = this.compensateFoldRows(row);
        const widgetComp = this.compensateLineWidgets(row);

        const maxOff = this.maxHeight - this.lineHeight;
        const rawOff = baseHeight + foldComp + widgetComp;
        const offset = Math.min(Math.max(rawOff, 0), maxOff);

        return offset;
    }

    setDimensions(config) {
        config = config || this.renderer.layerConfig;
        this.maxHeight = config.maxHeight;
        this.lineHeight = config.lineHeight;
        this.canvasHeight = config.height;
        this.canvasWidth = this.parentEl.width || this.canvasWidth;
        this.oneZoneWidth = Math.round(this.canvasWidth / 3);

        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        if (this.maxHeight < this.canvasHeight) {
            this.heightRatio = 1;
        }
        else {
            this.heightRatio = this.canvasHeight / this.maxHeight;
        }
    }
}

oop.implement(Decorator.prototype, EventEmitter);

exports.Decorator = Decorator;
