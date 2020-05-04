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

var RubyMode = require("../ruby").Mode;
var EditSession = require("../../edit_session").EditSession;
var assert = require("../../test/assertions");

module.exports = {
    setUp : function() {
        this.mode = new RubyMode();
    },

    "test: opening/ending tags matching/folding": function() {
        var session = new EditSession([
            'def Name(n)',
            '   if i == 0',
            '      ...',
            '   else',
            '      ...',
            '   end',
            'end'
        ]);

        session.setFoldStyle("markbeginend");
        session.setMode(this.mode);

        var ranges = this.mode.getMatching(session, 0, 0);
        assert.range(ranges[0], 0, 0, 0, 3);
        assert.range(ranges[1], 6, 0, 6, 3);

        ranges = this.mode.getMatching(session, 6, 1);
        assert.range(ranges[1], 0, 0, 0, 3);
        assert.range(ranges[0], 6, 0, 6, 3);

        ranges = this.mode.getMatching(session, 1, 4);
        assert.range(ranges[0], 1, 3, 1, 5);
        assert.range(ranges[1], 3, 3, 3, 7);

        ranges = this.mode.getMatching(session, 5, 4);
        assert.range(ranges[1], 3, 3, 3, 7);
        assert.range(ranges[0], 5, 3, 5, 6);

        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(2), "");
        assert.equal(session.getFoldWidget(3), "start");
        assert.equal(session.getFoldWidget(4), "");
        assert.equal(session.getFoldWidget(5), "end");
        assert.equal(session.getFoldWidget(6), "end");

        assert.range(session.getFoldWidgetRange(0), 0, 11, 5, 6);
        assert.equal(session.getFoldWidgetRange(2), null);
        assert.equal(session.getFoldWidgetRange(4), null);
        assert.range(session.getFoldWidgetRange(5), 3, 7, 4, 9);
    },

    "test: if/unless/while/until used as modifier shouldn't have matching tag and start/end fold": function() {
        var session = new EditSession([
            'if i == 0',
            '   a += 1 if a.zero?',
            'else',
            '   a += 1 unless a.zero?',
            'end'
        ]);

        session.setMode(this.mode);
    },

    "test: brackets folding": function() {
        var session = new EditSession([
            'def to_json(*a)',
            '{',
            '"json_class"   => self.class.name, # = "Range"',
            '"data"         => [ first, last, exclude_end? ]',
            '}.to_json(*a)',
            'end'
        ]);

        session.setFoldStyle("markbeginend");
        session.setMode(this.mode);

        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "start");
        assert.equal(session.getFoldWidget(2), "");
        assert.equal(session.getFoldWidget(4), "end");
        assert.equal(session.getFoldWidget(5), "end");

        assert.range(session.getFoldWidgetRange(1), 1, 1, 4, 0);
        assert.range(session.getFoldWidgetRange(4), 1, 1, 4, 0);
    },

    "test: multiline comments matching and folding": function() {
        var session = new EditSession([
            '=begin',
            'text line 1',
            'text line 2',
            'text line 3',
            '=end'
        ]);

        session.setFoldStyle("markbeginend");
        session.setMode(this.mode);

        var ranges = this.mode.getMatching(session, 0, 2);
        assert.range(ranges[0], 0, 0, 0, 6);
        assert.range(ranges[1], 4, 0, 4, 4);

        ranges = this.mode.getMatching(session, 4, 2);
        assert.range(ranges[1], 0, 0, 0, 6);
        assert.range(ranges[0], 4, 0, 4, 4);

        assert.equal(session.getFoldWidget(0), "start");
        assert.equal(session.getFoldWidget(1), "");
        assert.equal(session.getFoldWidget(4), "end");

        assert.range(session.getFoldWidgetRange(0), 0,6,3,11);
        assert.range(session.getFoldWidgetRange(4), 0,6,3,11);
    },

    "test: `case` with multiline `when` expressions matchings and foldings": function() {
        var session = new EditSession([
            'case',
            'when a == 1',
            ' puts "a is one"',
            'when a == 2',
            ' puts "a is two"',
            'else',
            ' puts "a is not one or two"',
            'end'
        ]);

        session.setFoldStyle("markbeginend");
        session.setMode(this.mode);

        var ranges = this.mode.getMatching(session, 0, 2);

        //`case` should always be closed with `end`
        assert.range(ranges[0], 0, 0, 0, 4);
        assert.range(ranges[1], 7, 0, 7, 3);

        assert.equal(session.getFoldWidget(0), "start");
        assert.range(session.getFoldWidgetRange(0), 0,4,6,27);

        //`end` should close last block
        ranges = this.mode.getMatching(session, 7, 2);
        assert.range(ranges[0], 7, 0, 7, 3);
        assert.range(ranges[1], 5, 0, 5, 4);

        assert.equal(session.getFoldWidget(7), "end");
        assert.range(session.getFoldWidgetRange(7), 5,4,6,27);

        //`else` should be closed with `end`
        ranges = this.mode.getMatching(session, 5, 2);
        assert.range(ranges[1], 7, 0, 7, 3);
        assert.range(ranges[0], 5, 0, 5, 4);

        assert.equal(session.getFoldWidget(5), "start");
        assert.range(session.getFoldWidgetRange(5), 5,4,6,27);

        //first `when` should close by next `when`
        ranges = this.mode.getMatching(session, 1, 2);
        assert.range(ranges[0], 1, 0, 1, 4);
        assert.range(ranges[1], 3, 0, 3, 4);

        assert.equal(session.getFoldWidget(1), "start");
        assert.range(session.getFoldWidgetRange(1), 1,11,2,16);
    },

    "test: `case` with single line `when` expressions matchings and foldings": function() {
        var session = new EditSession([
            'kind = case year',
            '       when 1850..1889 then "Blues"',
            '       when 1890..1909 then "Ragtime"',
            '       when 1910..1929 then "New Orleans Jazz"',
            '       when 1930..1939 then "Swing"',
            '       when 1940..1950 then "Bebop"',
            '       else "Jazz"',
            '       end'
        ]);

        session.setMode(this.mode);

        var ranges = this.mode.getMatching(session, 0, 9);

        //`case` should always be closed with `end`
        assert.range(ranges[0], 0, 7, 0, 11);
        assert.range(ranges[1], 7, 7, 7, 10);

        //`end` should close `case`
        ranges = this.mode.getMatching(session, 7, 9);
        assert.range(ranges[1], 0, 7, 0, 11);
        assert.range(ranges[0], 7, 7, 7, 10);

        //`when` shouldn't have any matchings in single line form
        ranges = this.mode.getMatching(session, 1, 8);
        assert.equal(ranges, undefined);

        assert.equal(session.getFoldWidget(1), undefined);
        assert.equal(session.getFoldWidgetRange(1), null);

        //`else` shouldn't have any matchings in single line form
        ranges = this.mode.getMatching(session, 6, 8);
        assert.equal(ranges, undefined);

        assert.equal(session.getFoldWidget(6), undefined);
        assert.equal(session.getFoldWidgetRange(6), null);
    },

    "test: loops `while` and `until` including `do` keyword and `do` loops should properly highlight": function() {
        var session = new EditSession([
            'while a < 10 do',
            '   p a',
            '   a += 1',
            '   0.upto 5 do |value|',
            '       selected << value if value==2...value==2',
            '   end',
            'end'
        ]);

        session.setMode(this.mode);

        var ranges = this.mode.getMatching(session, 0, 3);
        assert.range(ranges[0], 0, 0, 0, 5);
        assert.range(ranges[1], 6, 0, 6, 3);

        ranges = this.mode.getMatching(session, 6, 1);
        assert.range(ranges[1], 0, 0, 0, 5);
        assert.range(ranges[0], 6, 0, 6, 3);

        //for `do` keyword we also returns proper `end` from `while` loop
        ranges = this.mode.getMatching(session, 0, 14);
        assert.range(ranges[0], 0, 13, 0, 15);
        assert.range(ranges[1], 6, 0, 6, 3);

        ranges = this.mode.getMatching(session, 3, 13);
        assert.range(ranges[0], 3, 12, 3, 14);
        assert.range(ranges[1], 5, 3, 5, 6);

        ranges = this.mode.getMatching(session, 5, 4);
        assert.range(ranges[1], 3, 12, 3, 14);
        assert.range(ranges[0], 5, 3, 5, 6);
    }
};

});

if (typeof module !== "undefined" && module === require.main)
    require("asyncjs").test.testcase(module.exports).exec();
