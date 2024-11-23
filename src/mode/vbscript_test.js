    "use strict";

    var EditSession = require("../edit_session").EditSession;
    var VBScriptMode = require("./vbscript").Mode;
    var assert = require("../test/assertions");

    module.exports = {
        setUp : function() {
            this.mode = new VBScriptMode();
        },

        "test: getNextLineIndent": function() {
            assert.equal(this.mode.getNextLineIndent("start", "Class ClassName", "  "), "  ");
            assert.equal(this.mode.getNextLineIndent("start", "  Public Default Function FunctionName(param)", "  "), "    ");
            assert.equal(this.mode.getNextLineIndent("start", "  If Answer <> vbOK Then Exit Sub", "  "), "  ");
            assert.equal(this.mode.getNextLineIndent("start", "  If Condition Then", "  "), "    ");
        },

        "test: checkOutdent": function() {
            assert.ok(this.mode.checkOutdent("start", "        End If", "\n"));
            assert.ok(this.mode.checkOutdent("start", "        Loop", "\n"));
            assert.equal(this.mode.checkOutdent("start", "  Class blabla", "\n"), false);
            assert.equal(this.mode.checkOutdent("start", "", "\r"), false);
        },

        "test: auto outdent" : function() {
            var session = new EditSession(["Class ClassName", "  some code", "  End Class"]);
            session.setMode(this.mode);
            this.mode.autoOutdent("start", session, 2);
            assert.equal("End Class", session.getLine(2));
        },

        "test: opening/ending tags matching": function() {
            var session = new EditSession([
                'Sub Name(attr)',
                '   If Condition Then ',
                '      some code',
                '   ElseIf condition2',
                '      another code',
                '   ElseIf condition3',
                '      another code',
                '   Else',
                '      another code',
                '   End If',
                'End Sub'
            ]);

            session.setMode(this.mode);

            var ranges = this.mode.getMatching(session, 0, 0);
            assert.range(ranges[0], 0, 0, 0, 3);
            assert.range(ranges[1], 10, 0, 10, 7);

            ranges = this.mode.getMatching(session, 10, 1);
            assert.range(ranges[1], 0, 0, 0, 3);
            assert.range(ranges[0], 10, 0, 10, 7);

            ranges = this.mode.getMatching(session, 1, 4);
            assert.range(ranges[0], 1, 3, 1, 5);
            assert.range(ranges[1], 9, 3, 9, 9);

            ranges = this.mode.getMatching(session, 9, 8);
            assert.range(ranges[1], 1, 3, 1, 5);
            assert.range(ranges[0], 9, 3, 9, 9);

            ranges = this.mode.getMatching(session, 3, 4);
            assert.range(ranges[0], 3, 3, 3, 9);
            assert.range(ranges[1], 5, 3, 5, 9);

            ranges = this.mode.getMatching(session, 5, 4);
            assert.range(ranges[0], 5, 3, 5, 9);
            assert.range(ranges[1], 7, 3, 7, 7);
        },

        "test: single line condition couldn't have closing tag": function() {
            var session = new EditSession([
                'Sub Name(attr)',
                '   If Condition Then ',
                '       If Condition Then Exit Sub',
                '   End If',
                'End Sub'
            ]);

            session.setMode(this.mode);

            var ranges = this.mode.getMatching(session, 2, 8);
            assert.equal(ranges, undefined);

            ranges = this.mode.getMatching(session, 1, 4);
            assert.range(ranges[0], 1, 3, 1, 5);
            assert.range(ranges[1], 3, 3, 3, 9);

            ranges = this.mode.getMatching(session, 3, 4);
            assert.range(ranges[1], 1, 3, 1, 5);
            assert.range(ranges[0], 3, 3, 3, 9);

            ranges = this.mode.getMatching(session, 4, 1);
            assert.range(ranges[1], 0, 0, 0, 3);
            assert.range(ranges[0], 4, 0, 4, 7);
        },

        "test: private and public properties/subs/functions should return matching tag": function() {
            var session = new EditSession([
                'Class ClassName',
                '   Public Property Get PropertyName',
                '       some code',
                '   End Property',
                '',
                '   Private Function FunctionName(value1, value2)',
                '       some code',
                '   End Function',
                'End Class'
            ]);

            session.setMode(this.mode);

            var ranges = this.mode.getMatching(session, 1, 11);
            assert.range(ranges[0], 1, 10, 1, 18);
            assert.range(ranges[1], 3, 3, 3, 15);

            ranges = this.mode.getMatching(session, 3, 5);
            assert.range(ranges[1], 1, 10, 1, 18);
            assert.range(ranges[0], 3, 3, 3, 15);

            ranges = this.mode.getMatching(session, 5, 14);
            assert.range(ranges[0], 5, 11, 5, 19);
            assert.range(ranges[1], 7, 3, 7, 15);

            ranges = this.mode.getMatching(session, 7, 4);
            assert.range(ranges[1], 5, 11, 5, 19);
            assert.range(ranges[0], 7, 3, 7, 15);
        },

        "test: wrong closing/opening tag": function() {
            var session = new EditSession([
                'Class ClassName',
                '   Public Property Get PropertyName',
                '       some code',
                '   End Class',
                '',
                '   Private Property FunctionName(value1, value2)',
                '       some code',
                '   End AnyWord',
                'End Class'
            ]);

            session.setMode(this.mode);

            var ranges = this.mode.getMatching(session, 1, 11);
            assert.equal(ranges.length, 1);
            assert.range(ranges[0], 3, 3, 3, 12);

            ranges = this.mode.getMatching(session, 7, 4);
            assert.equal(ranges.length, 1);
            assert.range(ranges[0], 5, 11, 5, 19);

            ranges = this.mode.getMatching(session, 0, 3);
            assert.range(ranges[0], 0, 0, 0, 5);
            assert.range(ranges[1], 8, 0, 8, 9);
        }
    };


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
