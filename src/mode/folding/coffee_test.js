"use strict";

var CoffeeMode = require("../coffee").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");
function testFoldWidgets(array) {
    var session = array.filter(function(_, i){return i % 2 == 1;});
    session = new EditSession(session);
    var mode = new CoffeeMode();
    session.setFoldStyle("markbeginend");
    session.setMode(mode);

    var widgets = array.filter(function(_, i){return i % 2 == 0;});
    widgets.forEach(function(w, i){
        session.foldWidgets[i] = session.getFoldWidget(i);
    });
    widgets.forEach(function(w, i){
        w = w.split(",");
        var type = w[0] == ">" ? "start" : w[0] == "<" ? "end" : "";
        assert.equal(session.foldWidgets[i], type);
        if (!type)
            return;
        var range = session.getFoldWidgetRange(i);
        if (!w[1]) {
            assert.equal(range, null);
            return;
        }
        assert.equal(range.start.row, i);
        assert.equal(range.end.row - range.start.row, parseInt(w[1]));
        testColumn(w[2], range.start);
        testColumn(w[3], range.end);
    });

    function testColumn(w, pos) {
        if (!w)
            return;
        if (w == "l")
            w = session.getLine(pos.row).length;
        else
            w = parseInt(w);
        assert.equal(pos.column, w);
    }
}
module.exports = {
    "test: coffee script indentation based folding": function() {
       testFoldWidgets([
            '>,1,l,l',         ' ## indented comment',
            '',                '  # ',
            '',                '',
            '>,1,l,l',         ' # plain comment',
            '',                ' # ',
            '>,2',             ' function (x)=>',
            '',                '  ',
            '',                '  x++',
            '',                '  ',
            '',                '  ',
            '>,2',             ' bar = ',
            '',                '   foo: 1',
            '',                '   baz: lighter'
        ]);
    }
};


if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
