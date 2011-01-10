define(function(j, c) {
  var g = j("util/util");
  c.addPositions = function(a, b) {
    return{row:a.row + b.row, col:a.col + b.col}
  };
  c.cloneRange = function(a) {
    var b = a.start;
    a = a.end;
    return{start:{row:b.row, col:b.col}, end:{row:a.row, col:a.col}}
  };
  c.comparePositions = function(a, b) {
    var f = a.row - b.row;
    return f === 0 ? a.col - b.col : f
  };
  c.equal = function(a, b) {
    return c.comparePositions(a.start, b.start) === 0 && c.comparePositions(a.end, b.end) === 0
  };
  c.extendRange = function(a, b) {
    var f = a.end;
    return{start:a.start, end:{row:f.row + b.row, col:f.col + b.col}}
  };
  c.intersectRangeSets = function(a, b) {
    a = g.clone(a);
    b = g.clone(b);
    for(var f = [];a.length > 0 && b.length > 0;) {
      var d = a.shift(), e = b.shift(), h = c.comparePositions(d.start, e.start), i = c.comparePositions(d.end, e.end);
      if(c.comparePositions(d.end, e.start) < 0) {
        f.push(d);
        b.unshift(e)
      }else {
        if(c.comparePositions(e.end, d.start) < 0) {
          f.push(e);
          a.unshift(d)
        }else {
          if(h < 0) {
            f.push({start:d.start, end:e.start});
            a.unshift({start:e.start, end:d.end});
            b.unshift(e)
          }else {
            if(h === 0) {
              if(i < 0) {
                b.unshift({start:d.end, end:e.end})
              }else {
                i > 0 && a.unshift({start:e.end, end:d.end})
              }
            }else {
              if(h > 0) {
                f.push({start:e.start, end:d.start});
                a.unshift(d);
                b.unshift({start:d.start, end:e.end})
              }
            }
          }
        }
      }
    }return f.concat(a, b)
  };
  c.isZeroLength = function(a) {
    return a.start.row === a.end.row && a.start.col === a.end.col
  };
  c.maxPosition = function(a, b) {
    return c.comparePositions(a, b) > 0 ? a : b
  };
  c.normalizeRange = function(a) {
    return this.comparePositions(a.start, a.end) < 0 ? a : {start:a.end, end:a.start}
  };
  c.rangeSetBoundaries = function(a) {
    return{start:a[0].start, end:a[a.length - 1].end}
  };
  c.toString = function(a) {
    var b = a.start;
    a = a.end;
    return"[ " + b.row + ", " + b.col + " " + a.row + "," + +a.col + " ]"
  };
  c.unionRanges = function(a, b) {
    return{start:a.start.row < b.start.row || a.start.row === b.start.row && a.start.col < b.start.col ? a.start : b.start, end:a.end.row > b.end.row || a.end.row === b.end.row && a.end.col > b.end.col ? a.end : b.end}
  };
  c.isPosition = function(a) {
    return!g.none(a) && !g.none(a.row) && !g.none(a.col)
  };
  c.isRange = function(a) {
    return!g.none(a) && c.isPosition(a.start) && c.isPosition(a.end)
  }
});