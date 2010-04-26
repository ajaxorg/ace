assertPosition = function(row, column, cursor) {
    assertEquals(row, cursor.row);
    assertEquals(column, cursor.column);
};
