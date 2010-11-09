define(function() {
  var c = function(a, b, d, e) {
    this.start = {row:a, column:b};
    this.end = {row:d, column:e}
  };
  (function() {
    this.toString = function() {
      return"Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]"
    };
    this.contains = function(a, b) {
      return this.compare(a, b) == 0
    };
    this.compare = function(a, b) {
      if(!this.isMultiLine()) {
        if(a === this.start.row) {
          return b < this.start.column ? -1 : b > this.end.column ? 1 : 0
        }
      }if(a < this.start.row) {
        return-1
      }if(a > this.end.row) {
        return 1
      }if(this.start.row === a) {
        return b >= this.start.column ? 0 : -1
      }if(this.end.row === a) {
        return b <= this.end.column ? 0 : 1
      }return 0
    };
    this.clipRows = function(a, b) {
      if(this.end.row > b) {
        var d = {row:b + 1, column:0}
      }if(this.start.row > b) {
        var e = {row:b + 1, column:0}
      }if(this.start.row < a) {
        e = {row:a, column:0}
      }if(this.end.row < a) {
        d = {row:a, column:0}
      }return c.fromPoints(e || this.start, d || this.end)
    };
    this.extend = function(a, b) {
      var d = this.compare(a, b);
      if(d == 0) {
        return this
      }else {
        if(d == -1) {
          var e = {row:a, column:b}
        }else {
          var f = {row:a, column:b}
        }
      }return c.fromPoints(e || this.start, f || this.end)
    };
    this.isEmpty = function() {
      return this.start.row == this.end.row && this.start.column == this.end.column
    };
    this.isMultiLine = function() {
      return this.start.row !== this.end.row
    };
    this.clone = function() {
      return c.fromPoints(this.start, this.end)
    };
    this.toScreenRange = function(a) {
      return new c(this.start.row, a.documentToScreenColumn(this.start.row, this.start.column), this.end.row, a.documentToScreenColumn(this.end.row, this.end.column))
    }
  }).call(c.prototype);
  c.fromPoints = function(a, b) {
    return new c(a.row, a.column, b.row, b.column)
  };
  return c
});