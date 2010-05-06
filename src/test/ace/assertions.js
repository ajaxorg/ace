assertPosition = function(row, column, cursor) {
    assertEquals(row, cursor.row);
    assertEquals(column, cursor.column);
};

assertJsonEquals = function(expectedJson, foundJson) {
    assertEquals(JSON.stringify(expectedJson), JSON.stringify(foundJson));
};