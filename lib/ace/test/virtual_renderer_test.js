/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
 
require("../../../support/paths");
     
var Document        = "../document",
    VirtualRenderer = "../virtual_renderer",
    assert          = "../assertions";

var Test = {
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

        assert.position(renderer.screenToTextCoordinates(0, 0), 0, 0);
        assert.position(renderer.screenToTextCoordinates(4, 0), 0, 0);
        assert.position(renderer.screenToTextCoordinates(5, 0), 0, 1);
        assert.position(renderer.screenToTextCoordinates(9, 0), 0, 1);
        assert.position(renderer.screenToTextCoordinates(10, 0), 0, 1);
        assert.position(renderer.screenToTextCoordinates(14, 0), 0, 1);
        assert.position(renderer.screenToTextCoordinates(15, 0), 0, 2);
        document.body.removeChild(el);
    }

    // change tab size after setDocument (for text layer)
};

module.exports = require("async/test").testcase(Test);

if (module === require.main)
    module.exports.exec()