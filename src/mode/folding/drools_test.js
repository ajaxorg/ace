"use strict";

const DroolsMode = require("../drools").Mode;
const EditSession = require("../../edit_session").EditSession;
const assert = require("../../test/assertions");

module.exports = {

  "test: drools folds": function () {
    const session = new EditSession([
      'package com.example.ace',
      'import java.math.BigDecimal',
      'import function my.package.Foo.hello',
      '',
      'global org.slf4j.Logger logger',
      'global java.lang.Boolean checkFlag',
      '',
      'declare trait GoldenCustomer',
      '    balance : long @Alias( "org.acme.foo.accountBalance" )',
      'end',
      'query isContainedIn( String x, String y )',
      '    Location( z, y; ) and isContainedIn( x, z;)',
      'end',
      'rule "go1"',
      '    String( this == "go1" )',
      '    isContainedIn("Office", "House"; )',
      'then',
      '    System.out.println( "office is in the house" );',
      'end'
    ]);

    const mode = new DroolsMode();
    session.setMode(mode);
    session.setFoldStyle("markbegin");

    assert.equal(session.getFoldWidget(0), "");
    assert.equal(session.getFoldWidget(1), "start"); // import
    assert.equal(session.getFoldWidget(2), "");
    assert.equal(session.getFoldWidget(3), "");
    assert.equal(session.getFoldWidget(4), "start"); // global
    assert.equal(session.getFoldWidget(5), "");
    assert.equal(session.getFoldWidget(6), "");
    assert.equal(session.getFoldWidget(7), "start"); // declare
    assert.equal(session.getFoldWidget(8), "");
    assert.equal(session.getFoldWidget(9), "");
    assert.equal(session.getFoldWidget(10), "start");  // query
    assert.equal(session.getFoldWidget(11), "");
    assert.equal(session.getFoldWidget(12), "");
    assert.equal(session.getFoldWidget(13), "start"); // rule
    assert.equal(session.getFoldWidget(14), "");
    assert.equal(session.getFoldWidget(15), "");
    assert.equal(session.getFoldWidget(16), "start"); // then
    assert.equal(session.getFoldWidget(17), "");
    assert.equal(session.getFoldWidget(18), "");

    assert.range(session.getFoldWidgetRange(1), 1, 7, 2, 36); // import
    assert.range(session.getFoldWidgetRange(4), 4, 7, 5, 34); // global
    assert.range(session.getFoldWidgetRange(7), 7, 28, 9, 0); // declare
    assert.range(session.getFoldWidgetRange(10), 10, 41, 12, 0); // query
    assert.range(session.getFoldWidgetRange(13), 13, 10, 18, 0); // rule
    assert.range(session.getFoldWidgetRange(16), 16, 4, 18, 0); // then
  }
};


if (typeof module !== "undefined" && module === require.main)
  require("asyncjs").test.testcase(module.exports).exec();
