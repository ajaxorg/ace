"use strict";

var BasicMode = require("../basic").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {
    setUp: function() {
        this.mode = new BasicMode();
    },

    "test: ms-basic mode folding with markbeginend": function() {
        var session = new EditSession([
            '10 INPUT"HOW MANY DIGITS";N',
            '20 T=TIME',
            '30 L=INT(10*N/3)+1:DIM A(L)',
            '40 Z$="000000":T$="999999"',
            '50 FOR I=1TOL:A(I)=2:NEXT',
            '60 M=0:P=0',
            '70 FOR J=1TON:Q=0:K=2*L+1',
            '80 FOR I=L TO 1 STEP -1',
            'WHILE FLIPS',
            'FLIPS=0',
            'FOR I=1 TO J-1',
            'IF A$(I)>A$(I+1) THEN',
            'SWAP A$(I),',
            'A$(I+1):FLIPS=1',
            'NEXT I',
            'WEND',
            '90 K=K-2:X=10*A(I)+Q*I',
            '100 Q=INT(X/K):A(I)=X-Q*K',
            '110 NEXT',
            '120 Y=INT(Q/10):A(1)=Q-10*Y:Q=Y',
            '130 IF Q=9 THEN M=M+1:GOTO170',
            '140 IF Q>9 THEN PRINT CHR$(49+P);LEFT$(Z$,M);:GOTO170',
            '150 PRINT CHR$(48+P);LEFT$(T$,M);',
            '160 P=Q:M=0',
            '170 NEXT',
            '180 PRINT CHR$(48+P):PRINT (TIME-T)/59.98'
        ]);

        session.setFoldStyle("markbeginend");
        session.setMode(this.mode);

        // Assert fold widgets at the start of foldable regions
        assert.equal(session.getFoldWidget(6), "start");  // Line 6: FOR J=1TON
        assert.equal(session.getFoldWidget(7), "start");  // Line 7: FOR I=L TO 1 STEP -1
        assert.equal(session.getFoldWidget(8), "start");  // Line 8: WHILE FLIPS
        assert.equal(session.getFoldWidget(10), "start"); // Line10: FOR I=1 TO J-1

        // Assert fold widgets at the end of foldable regions
        assert.equal(session.getFoldWidget(14), "end");   // Line14: NEXT I
        assert.equal(session.getFoldWidget(15), "end");   // Line15: WEND
        assert.equal(session.getFoldWidget(18), "end");   // Line18: 110 NEXT
        assert.equal(session.getFoldWidget(24), "end");   // Line24: 170 NEXT

        // Lines without fold widgets
        for (var i = 0; i < session.getLength(); i++) {
            if ([0, 1, 2, 3, 4, 6, 7, 8, 10, 14, 15, 18, 24].indexOf(i) === -1) {
                assert.equal(session.getFoldWidget(i), "");
            }
        }

        // Check folding ranges from start lines
        var range;
        range = session.getFoldWidgetRange(6);
        assert.range(range, 6, 25, 24, 4);

        range = session.getFoldWidgetRange(7);
        assert.range(range, 7, 23, 18, 4);

        range = session.getFoldWidgetRange(8);
        assert.range(range, 8, 11, 15, 0);

        range = session.getFoldWidgetRange(10);
        assert.range(range, 10, 14, 14, 0);

        // Check folding ranges from end lines
        range = session.getFoldWidgetRange(14);
        assert.range(range, 10, 14, 14, 0);

        range = session.getFoldWidgetRange(15);
        assert.range(range, 8, 11, 15, 0);

        range = session.getFoldWidgetRange(18);
        assert.range(range, 7, 23, 18, 4);

        range = session.getFoldWidgetRange(24);
        assert.range(range, 6, 25, 24, 4);
    }
};

if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
