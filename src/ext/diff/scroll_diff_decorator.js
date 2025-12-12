var Decorator = require("../../layer/decorators").Decorator;

class ScrollDiffDecorator extends Decorator {
    /**
     * @param {import("../../../ace-internal").Ace.VScrollbar} scrollbarV
     * @param {import("../../virtual_renderer").VirtualRenderer} renderer
     * @param {boolean} [forInlineDiff]
     */
    constructor(scrollbarV, renderer, forInlineDiff) {
        super(scrollbarV, renderer);

        this.colors.dark["delete"] = "rgba(255, 18, 18, 1)";
        this.colors.dark["insert"] = "rgba(18, 136, 18, 1)";
        this.colors.light["delete"] = "rgb(255,51,51)";
        this.colors.light["insert"] = "rgb(32,133,72)";

        this.$zones = [];
        this.$forInlineDiff = forInlineDiff;
    }

    /**
     * @param {number} startRow
     * @param {number} endRow
     * @param {"delete"|"insert"} type
     */
    addZone(startRow, endRow, type) {
        this.$zones.push({
            startRow,
            endRow,
            type
        });
    }

    /**
     * @param {import("../../edit_session").EditSession} sessionA
     * @param {import("../../edit_session").EditSession} sessionB
     */
    setSessions(sessionA, sessionB) {
        this.sessionA = sessionA;
        this.sessionB = sessionB;
    }

    $updateDecorators(config) {
        if (typeof this.canvas.getContext !== "function") {
            return;
        }
        super.$updateDecorators(config);
        if (this.$zones.length > 0) {
            var colors = (this.renderer.theme.isDark === true) ? this.colors.dark : this.colors.light;
            var ctx = this.canvas.getContext("2d");
            this.$setDiffDecorators(ctx, colors);
        }
    }

    /**
     * @param {number} row
     * @param {string} type
     */
    $transformPosition(row, type) {
        if (type == "delete") {
            return this.sessionA.documentToScreenRow(row, 0);
        } else {
            return this.sessionB.documentToScreenRow(row, 0);
        }
    }

    $setDiffDecorators(ctx, colors) {
        function compare(a, b) {
            if (a.from === b.from) {
                return a.to - b.to;
            }
            return a.from - b.from;
        }

        var zones = this.$zones;
        if (zones) {
            var resolvedZones = [];

            const deleteZones = zones.filter(z => z.type === "delete");
            const insertZones = zones.filter(z => z.type === "insert");

            [deleteZones, insertZones].forEach((typeZones) => {
                typeZones.forEach((zone, i) => {
                    const offset1 = this.$transformPosition(zone.startRow, zone.type) * this.lineHeight;
                    let offset2 = this.$transformPosition(zone.endRow, zone.type) * this.lineHeight + this.lineHeight;

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
                if (this.$forInlineDiff) {
                    ctx.fillRect(this.oneZoneWidth, zoneFrom, 2 * this.oneZoneWidth, zoneHeight);
                } else {
                    if (zone.type == "delete") {
                        ctx.fillRect(this.oneZoneWidth, zoneFrom, this.oneZoneWidth, zoneHeight);
                    }
                    else {
                        ctx.fillRect(2 * this.oneZoneWidth, zoneFrom, this.oneZoneWidth, zoneHeight);
                    }
                }
            }

        }
    }

    setZoneWidth() {
        this.oneZoneWidth = Math.round(this.canvasWidth / 3);
    }
}

exports.ScrollDiffDecorator = ScrollDiffDecorator;