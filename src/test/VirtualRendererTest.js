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
    }
    // change tab size after setDocument (for text layer)
});