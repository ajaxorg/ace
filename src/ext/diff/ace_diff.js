var Range = require("../../range").Range;

class AceDiff {
    /**
     * @param {Range} originalRange
     * @param {Range} modifiedRange
     * @param {{originalStartLineNumber: number, originalStartColumn: number,
     * originalEndLineNumber: number, originalEndColumn: number, modifiedStartLineNumber: number,
     * modifiedStartColumn: number, modifiedEndLineNumber: number, modifiedEndColumn: number}[]} [charChanges]
     */
    constructor(originalRange, modifiedRange, charChanges) {
        this.old = originalRange;
        this.new = modifiedRange;
        this.charChanges = charChanges && charChanges.map(m => new AceDiff(
            new Range(m.originalStartLineNumber, m.originalStartColumn,
                m.originalEndLineNumber, m.originalEndColumn
            ), new Range(m.modifiedStartLineNumber, m.modifiedStartColumn,
                m.modifiedEndLineNumber, m.modifiedEndColumn
            )));
    }

    /**
     *
     * @param {string} dir
     * @return {Range}
     */
    getChangeRange(dir) {
        return this[dir];
    }

    padCenter(str, length) {
        const totalPadding = length - str.length;
        const leftPadding = Math.floor(totalPadding / 2);
        const rightPadding = totalPadding - leftPadding;
        return ' '.repeat(leftPadding) + str + ' '.repeat(rightPadding);
    }

    rangeToString(range, columnWidths) {
        const startRow = this.padCenter(String(range.start.row), columnWidths[0]);
        const startColumn = this.padCenter(String(range.start.column), columnWidths[1]);
        const endRow = this.padCenter(String(range.end.row), columnWidths[2]);
        const endColumn = this.padCenter(String(range.end.column), columnWidths[3]);
        return `${startRow}${startColumn}${endRow}${endColumn}`;
    }

    toString() {
        const columnWidths = [12, 14, 12, 14];
        let result = "Original Range                                       | Modified Range\n";
        result += " Start Row    Start Column    End Row    End Column   | Start Row    Start Column    End Row    End Column\n";
        result += "-----------------------------------------------------|----------------------------------------------------\n";
        result += `${this.rangeToString(this.old, columnWidths)} | ${this.rangeToString(this.new, columnWidths)}\n`;

        if (this.charChanges) {
            result += "\nCharacter Changes:\n";
            result += " Start Row    Start Column    End Row    End Column   | Start Row    Start Column    End Row    End Column\n";
            result += "-----------------------------------------------------|----------------------------------------------------\n";
            for (const change of this.charChanges) {
                result += `${this.rangeToString(change.old, columnWidths)} | ${this.rangeToString(
                    change.new, columnWidths)}\n`;
            }
        }
        result += "-----------------------------------------------------|----------------------------------------------------\n";
        result += "\n\n";
        return result;
    }
}

class DiffHighlight {
    /**
     * @param {import("./base_diff_view").BaseDiffView} diffView
     * @param type
     */
    constructor(diffView, type) {
        /**@type{number}*/this.id;
        this.diffView = diffView;
        this.type = type;
    }

    static MAX_RANGES = 500;

    update(html, markerLayer, session, config) {
        let dir, operation, opOperation;
        var diffView = this.diffView;
        if (this.type === -1) {// original editor
            dir = "old";
            operation = "delete";
            opOperation = "insert";
        }
        else { //modified editor
            dir = "new";
            operation = "insert";
            opOperation = "delete";
        }

        var ignoreTrimWhitespace = diffView.options.ignoreTrimWhitespace;
        var lineChanges = diffView.chunks;

        if (session.lineWidgets && !diffView.inlineDiffEditor) {
            let ranges = session.lineWidgets.reduce((allRanges, lineWidget, row) => {
                if (!lineWidget) {
                    console.log("Shouldn't get here");
                    return allRanges;
                }

                if (lineWidget.hidden)
                    return allRanges;

                let start = session.documentToScreenRow(row, 0);

                if (lineWidget.rowsAbove > 0) {
                    start -= lineWidget.rowsAbove;
                } else {
                    start++;
                }
                let end = start + lineWidget.rowCount - 1;

                allRanges.push(new Range(start, 0, end, 1 << 30));
                return allRanges;
            }, []);

            ranges.forEach((range) => {
                markerLayer.drawFullLineMarker(html, range, "ace_diff aligned_diff inline", config);
            })
        }

        lineChanges.forEach((lineChange) => {
            let startRow = lineChange[dir].start.row;
            let endRow = lineChange[dir].end.row;
            let range = new Range(startRow, 0, endRow - 1, 1 << 30);
            if (startRow !== endRow) {
                range = range.toScreenRange(session);
                markerLayer.drawFullLineMarker(html, range, "ace_diff " + operation + " inline", config);
            }

            if (lineChange.charChanges) {
                for (var i = 0; i < lineChange.charChanges.length; i++) {
                    var changeRange = lineChange.charChanges[i][dir]
                    if (changeRange.end.column == 0 && changeRange.end.row > changeRange.start.row && changeRange.end.row == lineChange[dir].end.row ) {
                        changeRange.end.row --
                        changeRange.end.column = Number.MAX_VALUE
                    }
                        
                    if (ignoreTrimWhitespace) {
                        for (let lineNumber = changeRange.start.row;
                             lineNumber <= changeRange.end.row; lineNumber++) {
                            let startColumn;
                            let endColumn;
                            let sessionLineStart = session.getLine(lineNumber).match(/^\s*/)[0].length;
                            let sessionLineEnd = session.getLine(lineNumber).length;

                            if (lineNumber === changeRange.start.row) {
                                startColumn = changeRange.start.column;
                            }
                            else {
                                startColumn = sessionLineStart;
                            }
                            if (lineNumber === changeRange.end.row) {
                                endColumn = changeRange.end.column;
                            }
                            else {
                                endColumn = sessionLineEnd;
                            }
                            let range = new Range(lineNumber, startColumn, lineNumber, endColumn);
                            var screenRange = range.toScreenRange(session);

                            if (sessionLineStart === startColumn && sessionLineEnd === endColumn) {
                                continue;
                            }

                            let cssClass = "inline " + operation;
                            if (range.isEmpty() && startColumn !== 0) {
                                cssClass = "inline " + opOperation + " empty";
                            }

                            markerLayer.drawSingleLineMarker(html, screenRange, "ace_diff " + cssClass, config);
                        }
                    }
                    else {
                        let range = new Range(changeRange.start.row, changeRange.start.column,
                            changeRange.end.row, changeRange.end.column
                        );
                        var screenRange = range.toScreenRange(session);
                        let cssClass = "inline " + operation;
                        if (range.isEmpty() && changeRange.start.column !== 0) {
                            cssClass = "inline empty " + opOperation;
                        }

                        if (screenRange.isMultiLine()) {
                            markerLayer.drawTextMarker(html, screenRange, "ace_diff " + cssClass, config);
                        }
                        else {
                            markerLayer.drawSingleLineMarker(html, screenRange, "ace_diff " + cssClass, config);
                        }
                    }
                }
            }
        });
    }
}


exports.AceDiff = AceDiff;
exports.DiffHighlight = DiffHighlight;