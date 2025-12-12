"use strict";

var LuaMode = require("../lua").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {
    "test: lua multi-line comment and string folding": function () {
        var session = new EditSession([
            '--[[This is a multi-line comment in Lua', 'It can span multiple lines until it encounters', ']]--', '',
            'local title = [[This is a multi-line string in Lua',
            'It can also span multiple lines until it encounters ]]'
        ]);

        var luaMode = new LuaMode();
        session.setFoldStyle("markbeginend");
        session.setMode(luaMode);
        session.bgTokenizer.$worker();

        assert.equal(session.getFoldWidget(0), "start"); // Comment starts
        assert.equal(session.getFoldWidget(1), "");
        assert.equal(session.getFoldWidget(2), "end");
        assert.equal(session.getFoldWidget(3), "");
        assert.equal(session.getFoldWidget(4), "start"); // String starts
        assert.equal(session.getFoldWidget(5), "end");

        assert.range(session.getFoldWidgetRange(0), 0, 4, 2, 0);
        assert.range(session.getFoldWidgetRange(2), 0, 4, 2, 0);
        assert.range(session.getFoldWidgetRange(4), 4, 16, 5, 52);
        assert.range(session.getFoldWidgetRange(5), 4, 16, 5, 52);
    }

};

if (typeof module !== "undefined" && module === require.main) require("asyncjs").test.testcase(module.exports).exec();
