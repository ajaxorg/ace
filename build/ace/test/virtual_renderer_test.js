/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require("../../../support/paths");
var Document = "../document", VirtualRenderer = "../virtual_renderer", assert = "../assertions", Test = {"test: screen2text the column should be rounded to the next character edge":function() {
  var b = document.createElement("div");
  b.style.left = "0px";
  b.style.top = "0px";
  b.style.width = "100px";
  b.style.height = "100px";
  document.body.style.margin = "0px";
  document.body.style.padding = "0px";
  document.body.appendChild(b);
  var a = new VirtualRenderer(b);
  a.setDocument(new Document("1234"));
  a.characterWidth = 10;
  a.lineHeight = 15;
  assert.position(a.screenToTextCoordinates(0, 0), 0, 0);
  assert.position(a.screenToTextCoordinates(4, 0), 0, 0);
  assert.position(a.screenToTextCoordinates(5, 0), 0, 1);
  assert.position(a.screenToTextCoordinates(9, 0), 0, 1);
  assert.position(a.screenToTextCoordinates(10, 0), 0, 1);
  assert.position(a.screenToTextCoordinates(14, 0), 0, 1);
  assert.position(a.screenToTextCoordinates(15, 0), 0, 2);
  document.body.removeChild(b)
}};
module.exports = require("async/test").testcase(Test);
module === require.main && module.exports.exec();