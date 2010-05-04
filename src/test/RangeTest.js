RangeTest = new TestCase("RangeTest", {

    "test: create range": function() {
        var range = new ace.Range(1,2,3,4);

        assertEquals(1, range.start.row);
        assertEquals(2, range.start.column);
        assertEquals(3, range.end.row);
        assertEquals(4, range.end.column);
    },

    "test: create from points": function() {
        var range = ace.Range.fromPoints({row: 1, column: 2}, {row:3, column:4});

        assertEquals(1, range.start.row);
        assertEquals(2, range.start.column);
        assertEquals(3, range.end.row);
        assertEquals(4, range.end.column);
    },

    "test: clip to rows": function() {
        var range = new ace.Range(0, 20, 100, 30);
        range.clipRows(10, 30);

        assertPosition(10, 0, range.start);
        assertPosition(31, 0, range.end);

        var range = new ace.Range(0, 20, 30, 10);
        range.clipRows(10, 30);

        assertPosition(10, 0, range.start);
        assertPosition(30, 10, range.end);

        var range = new ace.Range(0, 20, 3, 10);
        range.clipRows(10, 30);

        assertTrue(range.isEmpty());
        assertPosition(10, 0, range.start);
        assertPosition(10, 0, range.end);
    },

    "test: isEmpty": function() {
        var range = new ace.Range(1, 2, 1, 2);
        assertTrue(range.isEmpty());

        var range = new ace.Range(1, 2, 1, 6);
        assertFalse(range.isEmpty());
    },

    "test: is multi line": function() {
        var range = new ace.Range(1, 2, 1, 6);
        assertFalse(range.isMultiLine());

        var range = new ace.Range(1, 2, 2, 6);
        assertTrue(range.isMultiLine());
    },

    "test: clone": function() {
        var range = new ace.Range(1, 2, 3, 4);
        var clone = range.clone();

        assertPosition(1, 2, clone.start);
        assertPosition(3, 4, clone.end);

        clone.start.column = 20;
        assertPosition(1, 2, range.start);

        clone.end.column = 20;
        assertPosition(3, 4, range.end);
    }
});