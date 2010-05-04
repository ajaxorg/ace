ace.provide("ace.Range");

ace.Range = function(startRow, startColumn, endRow, endColumn) {
    this.start = {
        row: startRow,
        column: startColumn
    };

    this.end = {
        row: endRow,
        column: endColumn
    };
};

(function() {

    this.clipRows = function(firstRow, lastRow) {
        if (this.end.row > lastRow) {
            this.end = {
                row: lastRow+1,
                column: 0
            };
        }

        if (this.start.row > lastRow) {
            this.start = {
                row: lastRow+1,
                column: 0
            };
        }

        if (this.start.row < firstRow) {
            this.start = {
                row: firstRow,
                column: 0
            };
        }

        if (this.end.row < firstRow) {
            this.end = {
                row: firstRow,
                column: 0
            };
        }
        return this;
    };

    this.isEmpty = function() {
        return (this.start.row == this.end.row && this.start.column == this.end.column);
    };

    this.isMultiLine = function() {
        return (this.start.row !== this.end.row);
    };

    this.clone = function() {
        return ace.Range.fromPoints(this.start, this.end);
    };

}).call(ace.Range.prototype);


ace.Range.fromPoints = function(start, end) {
    return new ace.Range(start.row, start.column, end.row, end.column);
};