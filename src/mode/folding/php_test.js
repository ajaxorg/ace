if (typeof process !== "undefined") require("amd-loader");

"use strict";

var PHPMode = require("../php").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {
    setUp: function () {
        this.mode = new PHPMode();
    },

    "test: php folding with alternative syntax": function () {
        var session = new EditSession([
            '<?php', 'function checkNumber($number)', '{', '   switch ($number) {', '       case 0:',
            '       echo "Number is zero again";', '           if ($number == 0):',
            '               echo "Number is zero";', '           elseif ($number > 0):',
            '               echo "Number is positive";', '           else:',
            '               echo "Number is negative";', 'endif;', '       break;', '       default:',
            '           echo "Number is not zero";', '       }', 'foreach (array(1, 2, 3) as $num):',
            '       echo "Num: $num";', '   endforeach;', '}', '?>'
        ]);

        session.setFoldStyle("markbeginend");
        session.setMode(this.mode);
        session.bgTokenizer.$worker();

        assert.equal(session.getFoldWidget(0), "");
        assert.equal(session.getFoldWidget(1), "");
        assert.equal(session.getFoldWidget(2), "start");
        assert.equal(session.getFoldWidget(3), "start");
        assert.equal(session.getFoldWidget(4), "");
        assert.equal(session.getFoldWidget(5), "");
        assert.equal(session.getFoldWidget(6), "start");
        assert.equal(session.getFoldWidget(7), "");
        assert.equal(session.getFoldWidget(8), "start");
        assert.equal(session.getFoldWidget(10), "start");
        assert.equal(session.getFoldWidget(12), "end");
        assert.equal(session.getFoldWidget(16), "end");
        assert.equal(session.getFoldWidget(17), "start");
        assert.equal(session.getFoldWidget(19), "end");
        assert.equal(session.getFoldWidget(20), "end");

        assert.range(session.getFoldWidgetRange(2), 2, 1, 20, 0); // Range for the function's foldable section
        assert.range(session.getFoldWidgetRange(3), 3, 21, 16, 7); // Range for the 'switch' statement
        assert.range(session.getFoldWidgetRange(6), 6, 29, 8, 11); // Range for the 'if' block
        assert.range(session.getFoldWidgetRange(8), 8, 32, 10, 11); // Range for the 'elseif' block
        assert.range(session.getFoldWidgetRange(10), 10, 16, 12, 0); // Range for the 'else' block
        assert.range(session.getFoldWidgetRange(12), 10, 16, 12, 0); // Range for the 'endif' line
        assert.range(session.getFoldWidgetRange(17), 17, 33, 19, 3);
        assert.range(session.getFoldWidgetRange(19), 17, 33, 19, 3);
    }
};


if (typeof module !== "undefined" && module === require.main) require("asyncjs").test.testcase(module.exports).exec();
