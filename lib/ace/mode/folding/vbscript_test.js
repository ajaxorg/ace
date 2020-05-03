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

if (typeof process !== "undefined")
    require("amd-loader");

define(function(require, exports, module) {
"use strict";

var VBScriptMode = require("../vbscript").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {
    setUp : function() {
        this.mode = new VBScriptMode();
    },

    "test: visual basic script indentation based folding": function() {
        var session = new EditSession([
            'Sub MakeHelloWorldFile (FileName)',
            '   \'Create a new file in C: drive or overwrite existing file',
            '   Set FSO = CreateObject("Scripting.FileSystemObject")',
            '   If FSO.FileExists(FileName) Then \'comment ',
            '      Answer = MsgBox ("File " & FileName & " exists ... OK to overwrite?", vbOKCancel)',
            '      \'If button selected is not OK, then quit now',
            '      \'vbOK is a language constant',
            '      If Answer <> vbOK Then Exit Sub',
            '   Else',
            '      \'Confirm OK to create',
            '      Answer = MsgBox ("File " & FileName & " ... OK to create?", vbOKCancel)',
            '      If Answer <> vbOK Then Exit Sub',
            '   End If',
            '   \'Create new file (or replace an existing file)',
            '   Set FileObject = FSO.CreateTextFile (FileName)',
            '   FileObject.WriteLine "Time ... " & Now()',
            '   FileObject.WriteLine "Hello World"',
            '   FileObject.Close()',
            '   MsgBox "File " & FileName & " ... updated."',
            'End Sub'
        ]);

        session.setFoldStyle("markbegin");
        session.setMode(this.mode);

        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "");
        assert.equal(session.getFoldWidget(2), "");
        assert.equal(session.getFoldWidget(3), "start");
        assert.equal(session.getFoldWidget(4), "");
        assert.equal(session.getFoldWidget(8), "start");
        assert.equal(session.getFoldWidget(9), "");

        assert.range(session.getFoldWidgetRange(0), 0, 33, 18, 46);
        assert.range(session.getFoldWidgetRange(3), 3, 45, 11, 37);
        assert.range(session.getFoldWidgetRange(12), 3, 45, 11, 37);
    }
};

});

if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
