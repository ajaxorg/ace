require.def(["require", "exports", "module", "rangeutils/tests/plugindev", "rangeutils/tests/utils/range"], function(f, c, g, a, b) {
  c.testAddPositions = function() {
    a.deepEqual(b.addPositions({row:0, col:0}, {row:0, col:0}), {row:0, col:0}, "0,0 + 0,0 and 0,0");
    a.deepEqual(b.addPositions({row:1, col:0}, {row:2, col:0}), {row:3, col:0}, "1,0 + 2,0 and 3,0");
    a.deepEqual(b.addPositions({row:0, col:1}, {row:0, col:1}), {row:0, col:2}, "0,1 + 0,1 and 0,2");
    a.deepEqual(b.addPositions({row:1, col:2}, {row:-1, col:-2}), {row:0, col:0}, "1,2 + -1,-2 and 0,0")
  };
  c.testCloneRange = function() {
    var d = {start:{row:1, col:2}, end:{row:3, col:4}}, e = b.cloneRange(d);
    a.deepEqual(d, e, "the old range and the new range");
    a.ok(d.start !== e.start, "the old range's start position is distinct from the new range's start position");
    a.ok(d.end !== e.end, "the old range's end position is distinct from the new range's end position");
    a.ok(d !== e, "the old range is distinct from the new range")
  };
  c.testComparePositions = function() {
    a.equal(b.comparePositions({row:0, col:0}, {row:0, col:0}), 0, "0,0 = 0,0");
    a.ok(b.comparePositions({row:0, col:0}, {row:1, col:0}) < 0, "0,0 < 1,0");
    a.ok(b.comparePositions({row:0, col:0}, {row:0, col:1}) < 0, "0,0 < 0,1");
    a.ok(b.comparePositions({row:1, col:0}, {row:0, col:0}) > 0, "1,0 > 0,0");
    a.ok(b.comparePositions({row:0, col:1}, {row:0, col:0}) > 0, "0,1 > 0,0")
  };
  c.testExtendRange = function() {
    a.deepEqual(b.extendRange({start:{row:1, col:2}, end:{row:3, col:4}}, {row:5, col:6}), {start:{row:1, col:2}, end:{row:8, col:10}}, "[ 1,2 3,4 ] extended by 5,6 = [ 1,2 8,10 ]");
    a.deepEqual(b.extendRange({start:{row:7, col:8}, end:{row:9, col:10}}, {row:0, col:0}), {start:{row:7, col:8}, end:{row:9, col:10}}, "[ 7,8 9,10 ] extended by 0,0 remains the same")
  };
  c.testMaxPosition = function() {
    a.deepEqual(b.maxPosition({row:0, col:0}, {row:0, col:0}), {row:0, col:0}, "max(0,0 0,0) = 0,0");
    a.deepEqual(b.maxPosition({row:0, col:0}, {row:1, col:0}), {row:1, col:0}, "max(0,0 1,0) = 1,0");
    a.deepEqual(b.maxPosition({row:0, col:0}, {row:0, col:1}), {row:0, col:1}, "max(0,0 0,1) = 0,1");
    a.deepEqual(b.maxPosition({row:1, col:0}, {row:0, col:0}), {row:1, col:0}, "max(1,0 0,0) = 1,0");
    a.deepEqual(b.maxPosition({row:0, col:1}, {row:0, col:0}), {row:0, col:1}, "max(0,1 0,0) = 0,1")
  };
  c.testNormalizeRange = function() {
    a.deepEqual(b.normalizeRange({start:{row:0, col:0}, end:{row:0, col:0}}), {start:{row:0, col:0}, end:{row:0, col:0}}, "normalize(0,0 0,0) and (0,0 0,0)");
    a.deepEqual(b.normalizeRange({start:{row:1, col:2}, end:{row:3, col:4}}), {start:{row:1, col:2}, end:{row:3, col:4}}, "normalize(1,2 3,4) and (1,2 3,4)");
    a.deepEqual(b.normalizeRange({start:{row:4, col:3}, end:{row:2, col:1}}), {start:{row:2, col:1}, end:{row:4, col:3}}, "normalize(4,3 2,1) and (2,1 4,3)")
  };
  c.testUnionRanges = function() {
    a.deepEqual(b.unionRanges({start:{row:1, col:2}, end:{row:3, col:4}}, {start:{row:5, col:6}, end:{row:7, col:8}}), {start:{row:1, col:2}, end:{row:7, col:8}}, "[ 1,2 3,4 ] union [ 5,6 7,8 ] = [ 1,2 7,8 ]");
    a.deepEqual(b.unionRanges({start:{row:4, col:4}, end:{row:5, col:5}}, {start:{row:3, col:3}, end:{row:4, col:5}}), {start:{row:3, col:3}, end:{row:5, col:5}}, "[ 4,4 5,5 ] union [ 3,3 4,5 ] = [ 3,3 5,5 ]")
  }
});