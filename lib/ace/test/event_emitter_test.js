/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require("../../../support/paths");

var oop             = require("../lib/oop");
    MEventEmitter   = require("../event_emitter"),
    assert          = require("./assertions");
        
    
var EventEmitter = function() {};

oop.implement(EventEmitter.prototype, MEventEmitter);

var Test = {
    "test: dispatch event with no data" : function() {
        var emitter = new EventEmitter();

        var called = false;
        emitter.addEventListener("juhu", function(e) {
           called = true;
           assert.equal(e.type, "juhu");
        });

        emitter.$dispatchEvent("juhu");
        assert.true(called);
    }
};

module.exports = require("async/test").testcase(Test)

if (module === require.main)
    module.exports.exec()