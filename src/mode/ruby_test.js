"use strict";

var EditSession = require("../edit_session").EditSession;
var Mode = require("./ruby").Mode;
var assert = require("../test/assertions");

module.exports = {
    setUp : function() {
        this.mode = new Mode();
    },

    "test getNextLineIndent": function() {
        assert.equal(this.mode.getNextLineIndent("start", "class Foo", "  "), "  ");
        assert.equal(this.mode.getNextLineIndent("start", "  def thing(wut)", "  "), "    ");
        assert.equal(this.mode.getNextLineIndent("start", "  fork do", "  "), "    ");
        assert.equal(this.mode.getNextLineIndent("start", "  fork do |wut| ", "  "), "    ");
        assert.equal(this.mode.getNextLineIndent("start", "  something = :ruby", "  "), "  ");
        assert.equal(this.mode.getNextLineIndent("start", "  if something == 3", "  "), "    ");
        assert.equal(this.mode.getNextLineIndent("start", "  else", "  "), "    ");
    },

    "test: checkOutdent": function() {
        assert.ok(this.mode.checkOutdent("start", "        en", "d"));
        assert.ok(this.mode.checkOutdent("start", "        els", "e"));
        assert.ok(this.mode.checkOutdent("start", "        ", "}"));
        assert.equal(this.mode.checkOutdent("start", "  end", "\n"), false);
        assert.equal(this.mode.checkOutdent("start", "foo = ba", "r"), false);
    },

    "test: auto outdent" : function() {
        var session = new EditSession(["class Phil", "  Foo = 'bar'", "  end"]);
        this.mode.autoOutdent("start", session, 2);
        assert.equal("  end", session.getLine(2));
    }

};
if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
