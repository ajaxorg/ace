/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/Document", "ace/VirtualRenderer"], function(c, d) {
  new TestCase("VirtualRendererTest", {"test: screen2text the column should be rounded to the next character edge":function() {
    var b = document.createElement("div");
    b.style.left = "0px";
    b.style.top = "0px";
    b.style.width = "100px";
    b.style.height = "100px";
    document.body.style.margin = "0px";
    document.body.style.padding = "0px";
    document.body.appendChild(b);
    var a = new d(b);
    a.setDocument(new c("1234"));
    a.characterWidth = 10;
    a.lineHeight = 15;
    assertPosition(0, 0, a.screenToTextCoordinates(0, 0));
    assertPosition(0, 0, a.screenToTextCoordinates(4, 0));
    assertPosition(0, 1, a.screenToTextCoordinates(5, 0));
    assertPosition(0, 1, a.screenToTextCoordinates(9, 0));
    assertPosition(0, 1, a.screenToTextCoordinates(10, 0));
    assertPosition(0, 1, a.screenToTextCoordinates(14, 0));
    assertPosition(0, 2, a.screenToTextCoordinates(15, 0));
    document.body.removeChild(b)
  }})
});