require("../../../support/paths");
var oop = require("pilot/oop");
EventEmitter = require("pilot/event_emitter").EventEmitter;
assert = require("./assertions");
var Emitter = function() {
};
oop.implement(Emitter.prototype, EventEmitter);
var Test = {"test: dispatch event with no data":function() {
  var a = new Emitter, b = false;
  a.addEventListener("juhu", function(c) {
    b = true;
    assert.equal(c.type, "juhu")
  });
  a._dispatchEvent("juhu");
  assert.ok(b)
}};
module.exports = require("async/test").testcase(Test);
module === require.main && module.exports.exec();