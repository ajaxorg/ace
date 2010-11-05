/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([
     "ace/Document",
     "ace/VirtualRenderer"
 ], function(
     Document,
     VirtualRenderer
 ) {

var VirtualRendererTest = new TestCase("VirtualRendererTest", {

    "test: screen2text the column should be rounded to the next character edge" : function() {
        var el = document.createElement("div");
        el.style.left = "0px";
        el.style.top = "0px";
        el.style.width = "100px";
        el.style.height = "100px";
        document.body.style.margin = "0px";
        document.body.style.padding = "0px";
        document.body.appendChild(el);

        var renderer = new VirtualRenderer(el);
        renderer.setDocument(new Document("1234"));

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

});