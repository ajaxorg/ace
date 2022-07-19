if (typeof process !== "undefined") {
    require("amd-loader");
}

"use strict";

var assert = require("../../test/assertions");
var coffee = require("./coffee");

function assertLocation(e, sl, sc, el, ec) {
    var l = e.location;
    assert.equal(
        l.first_line + ":" + l.first_column + "->"  + l.last_line + ":" + l.last_column,
        sl + ":" + sc + "->"  + el + ":" + ec
    );
}

function parse(str) {
    try {
        coffee.compile(str);
    } catch (e) {
        return e;
    }
}

module.exports = {
    "test parse valid coffee script": function() {
        coffee.compile("square = (x) -> x * x");
    },
    
    "test parse invalid coffee script": function() {
        var e = parse("a = 12 f");
        assert.equal(e.message, "unexpected identifier");
        assertLocation(e, 0, 7, 0, 7);
    },
    
    "test parse missing bracket": function() {
        var e = parse("a = 12 f {\n\n");
        assert.equal(e.message, "missing }");
        assertLocation(e, 0, 9, 0, 9);
    },
    "test unexpected indent": function() {
        var e = parse("a\n  a\n");
        assert.equal(e.message, "unexpected indentation");
        assertLocation(e, 1, 0, 1, 1);
    },
    "test invalid destructuring": function() {
        var e = parse("\n{b: 5} = {}");
        assert.equal(e.message, "'5' can't be assigned");
        assertLocation(e, 1, 4, 1, 4);
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
