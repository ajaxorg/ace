var SearchTest = new TestCase("SearchTest", {

    "test: configure the search object" : function() {
        var search = new ace.Search();
        search.set({
            needle: "juhu",
            scope: ace.Search.ALL
        });
    },

    "test: find simple text in document" : function() {
        var doc = new ace.Document(["juhu kinners 123", "456"]);
        var search = new ace.Search().set({
            needle: "kinners"
        });

        var range = search.find(doc);
        assertPosition(0, 5, range.start);
        assertPosition(0, 12, range.end);
    },

    "test: find simple text in next line" : function() {
        var doc = new ace.Document(["abc", "juhu kinners 123", "456"]);
        var search = new ace.Search().set({
            needle: "kinners"
        });

        var range = search.find(doc);
        assertPosition(1, 5, range.start);
        assertPosition(1, 12, range.end);
    },

    "test: find text starting at cursor position" : function() {
        var doc = new ace.Document(["juhu kinners", "juhu kinners 123"]);
        doc.getSelection().moveCursorTo(0, 6);
        var search = new ace.Search().set({
            needle: "kinners"
        });

        var range = search.find(doc);
        assertPosition(1, 5, range.start);
        assertPosition(1, 12, range.end);
    },

    "test: wrap search is off by default" : function() {
        var doc = new ace.Document(["abc", "juhu kinners 123", "456"]);
        doc.getSelection().moveCursorTo(2, 1);

        var search = new ace.Search().set({
            needle: "kinners"
        });

        assertEquals(null, search.find(doc));
    },

    "test: wrap search should wrap at file end" : function() {
        var doc = new ace.Document(["abc", "juhu kinners 123", "456"]);
        doc.getSelection().moveCursorTo(2, 1);

        var search = new ace.Search().set({
            needle: "kinners",
            wrap: true
        });

        var range = search.find(doc);
        assertPosition(1, 5, range.start);
        assertPosition(1, 12, range.end);
    },

    "test: wrap search with no match should return 'null'": function() {
        var doc = new ace.Document(["abc", "juhu kinners 123", "456"]);
        doc.getSelection().moveCursorTo(2, 1);

        var search = new ace.Search().set({
            needle: "xyz",
            wrap: true
        });

        assertEquals(null, search.find(doc));
    },

    "test: case sensitive is by default off": function() {
        var doc = new ace.Document(["abc", "juhu kinners 123", "456"]);

        var search = new ace.Search().set({
            needle: "JUHU"
        });

        assertEquals(null, search.find(doc));
    },

    "test: case sensitive search": function() {
        var doc = new ace.Document(["abc", "juhu kinners 123", "456"]);

        var search = new ace.Search().set({
            needle: "KINNERS",
            caseSensitive: true
        });

        var range = search.find(doc);
        assertPosition(1, 5, range.start);
        assertPosition(1, 12, range.end);
    },

    "test: whole word search should not match inside of words": function() {
        var doc = new ace.Document(["juhukinners", "juhu kinners 123", "456"]);

        var search = new ace.Search().set({
            needle: "kinners",
            wholeWord: true
        });

        var range = search.find(doc);
        assertPosition(1, 5, range.start);
        assertPosition(1, 12, range.end);
    },

    "test: find backwards": function() {
        var doc = new ace.Document(["juhu juhu juhu juhu"]);
        doc.getSelection().moveCursorTo(0, 10);
        var search = new ace.Search().set({
            needle: "juhu",
            backwards: true
        });

        var range = search.find(doc);
        assertPosition(0, 5, range.start);
        assertPosition(0, 9, range.end);
    }
});