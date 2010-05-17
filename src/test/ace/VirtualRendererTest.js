var VirtualRendererTest = new TestCase("VirtualRendererTest", {

    "test: convert document to screen coordinates" : function() {
        var el = document.createElement("div");
        var renderer = new ace.VirtualRenderer(el);

        var doc = new ace.Document("01234\t567890\t1234");
        doc.setTabSize(4);
        renderer.setDocument(doc);

        assertEquals(0, renderer.$documentToScreenColumn(0, 0));
        assertEquals(4, renderer.$documentToScreenColumn(0, 4));
        assertEquals(5, renderer.$documentToScreenColumn(0, 5));
        assertEquals(9, renderer.$documentToScreenColumn(0, 6));
        assertEquals(15, renderer.$documentToScreenColumn(0, 12));
        assertEquals(19, renderer.$documentToScreenColumn(0, 13));

        doc.setTabSize(2);

        assertEquals(0, renderer.$documentToScreenColumn(0, 0));
        assertEquals(4, renderer.$documentToScreenColumn(0, 4));
        assertEquals(5, renderer.$documentToScreenColumn(0, 5));
        assertEquals(7, renderer.$documentToScreenColumn(0, 6));
        assertEquals(13, renderer.$documentToScreenColumn(0, 12));
        assertEquals(15, renderer.$documentToScreenColumn(0, 13));
    },

    "test: convert document to scrren coordinates with leading tabs": function() {
        var el = document.createElement("div");
        var renderer = new ace.VirtualRenderer(el);

        var doc = new ace.Document("\t\t123");
        doc.setTabSize(4);
        renderer.setDocument(doc);
        assertEquals(0, renderer.$documentToScreenColumn(0, 0));
        assertEquals(4, renderer.$documentToScreenColumn(0, 1));
        assertEquals(8, renderer.$documentToScreenColumn(0, 2));
        assertEquals(9, renderer.$documentToScreenColumn(0, 3));
    },

    "test: convert screen to document coordinates" : function() {
        var el = document.createElement("div");
        var renderer = new ace.VirtualRenderer(el);

        var doc = new ace.Document("01234\t567890\t1234");
        doc.setTabSize(4);
        renderer.setDocument(doc);

        assertEquals(0, renderer.$screenToDocumentColumn(0, 0));
        assertEquals(4, renderer.$screenToDocumentColumn(0, 4));
        assertEquals(5, renderer.$screenToDocumentColumn(0, 5));
        assertEquals(5, renderer.$screenToDocumentColumn(0, 6));
        assertEquals(5, renderer.$screenToDocumentColumn(0, 7));
        assertEquals(5, renderer.$screenToDocumentColumn(0, 8));
        assertEquals(6, renderer.$screenToDocumentColumn(0, 9));
        assertEquals(12, renderer.$screenToDocumentColumn(0, 15));
        assertEquals(13, renderer.$screenToDocumentColumn(0, 19));
    },

    "test: screen2text the column should be rounded to the next character edge" : function() {
        var el = document.createElement("div");
        el.style.left = "0px";
        el.style.top = "0px";
        el.style.width = "100px";
        el.style.height = "100px";
        document.body.style.margin = "0px";
        document.body.style.padding = "0px";
        document.body.appendChild(el);

        var renderer = new ace.VirtualRenderer(el);
        renderer.setDocument(new ace.Document("1234"));

        renderer.characterWidth = 10;
        renderer.lineHeight = 15;

        assertPosition(0, 0, renderer.screenToTextCoordinates(0, 0));
        assertPosition(0, 0, renderer.screenToTextCoordinates(4, 0));
        assertPosition(0, 1, renderer.screenToTextCoordinates(5, 0));
        assertPosition(0, 1, renderer.screenToTextCoordinates(9, 0));
        assertPosition(0, 1, renderer.screenToTextCoordinates(10, 0));
        assertPosition(0, 1, renderer.screenToTextCoordinates(14, 0));
        assertPosition(0, 2, renderer.screenToTextCoordinates(15, 0));
        document.body.removeChild(el);
    }


    // change tab size after setDocument (for text layer)
});