var TextDocumentTest = new TestCase("TextDocumentTest", {

   "test: find matching opening bracket" : function() {
        var doc = new ace.TextDocument(["(()(", "())))"].join("\n"));

        assertPosition(0, 1, doc.findMatchingBracket({row: 0, column: 3}));
        assertPosition(1, 0, doc.findMatchingBracket({row: 1, column: 2}));
        assertPosition(0, 3, doc.findMatchingBracket({row: 1, column: 3}));
        assertPosition(0, 0, doc.findMatchingBracket({row: 1, column: 4}));
        assertEquals(null, doc.findMatchingBracket({row: 1, column: 5}));
    },

    "test: find matching closing bracket" : function() {
        var doc = new ace.TextDocument(["(()(", "())))"].join("\n"));

        assertPosition(1, 1, doc.findMatchingBracket({row: 1, column: 1}));
        assertPosition(1, 1, doc.findMatchingBracket({row: 1, column: 1}));
        assertPosition(1, 2, doc.findMatchingBracket({row: 0, column: 4}));
        assertPosition(0, 2, doc.findMatchingBracket({row: 0, column: 2}));
        assertPosition(1, 3, doc.findMatchingBracket({row: 0, column: 1}));
        assertEquals(null, doc.findMatchingBracket({row: 0, column: 0}));
    },

    "test: match different bracket types" : function() {
        var doc = new ace.TextDocument(["({[", ")]}"].join("\n"));

        assertPosition(1, 0, doc.findMatchingBracket({row: 0, column: 1}));
        assertPosition(1, 2, doc.findMatchingBracket({row: 0, column: 2}));
        assertPosition(1, 1, doc.findMatchingBracket({row: 0, column: 3}));

        assertPosition(0, 0, doc.findMatchingBracket({row: 1, column: 1}));
        assertPosition(0, 2, doc.findMatchingBracket({row: 1, column: 2}));
        assertPosition(0, 1, doc.findMatchingBracket({row: 1, column: 3}));
    }
});