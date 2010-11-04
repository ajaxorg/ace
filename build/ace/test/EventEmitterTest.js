/*
 LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
*/
require.def(["ace/lib/oop", "ace/MEventEmitter"], function(d, e) {
  var a = function() {
  };
  d.implement(a.prototype, e);
  new TestCase("EventEmitterTest", {"test: dispatch event with no data":function() {
    var b = new a, c = false;
    b.addEventListener("juhu", function(f) {
      c = true;
      assertEquals("juhu", f.type)
    });
    b.$dispatchEvent("juhu");
    assertTrue(c)
  }})
});