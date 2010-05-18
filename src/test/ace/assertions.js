assertPosition = function(row, column, cursor) {
    assertEquals(row, cursor.row);
    assertEquals(column, cursor.column);
};

assertRange = function(startRow, startColumn, endRow, endColumn, range) {
    assertPosition(startRow, startColumn, range.start);
    assertPosition(endRow, endColumn, range.end);
};

assertJsonEquals = function(expectedJson, foundJson) {
    assertEquals(JSON.stringify(expectedJson), JSON.stringify(foundJson));
};