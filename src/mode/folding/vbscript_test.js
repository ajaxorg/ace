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


if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
