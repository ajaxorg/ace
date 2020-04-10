/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
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

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
