var Decorator = require("../../layer/decorators").Decorator;

class ScrollDiffDecorator extends Decorator {
    /**
     * @param {import("../../../ace-internal").Ace.VScrollbar} scrollbarV
     * @param {import("../../virtual_renderer").VirtualRenderer} renderer
     */
    constructor(scrollbarV, renderer) {
        super(scrollbarV, renderer);

        this.colors.dark["delete"] = "rgba(255, 18, 18, 1)";
        this.colors.dark["insert"] = "rgba(18, 136, 18, 1)";
        this.colors.light["delete"] = "rgb(255,51,51)";
        this.colors.light["insert"] = "rgb(32,133,72)";

        this.zones = [];
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
        super.$updateDecorators(config);
        if (this.zones.length > 0) {
            var colors = (this.renderer.theme.isDark === true) ? this.colors.dark : this.colors.light;
            var ctx = this.canvas.getContext("2d");
            this.$setDiffDecorators(ctx, colors);
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

    setZoneWidth() {
        this.oneZoneWidth = Math.round(this.canvasWidth / 3);
    }
}

exports.ScrollDiffDecorator = ScrollDiffDecorator;