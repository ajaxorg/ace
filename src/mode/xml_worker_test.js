"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("../test/assertions");
var lintXml = require("./xml/lint").lintXml;

var kitchenSinkXml = fs.readFileSync(
    path.join(__dirname, "../../demo/kitchen-sink/docs/xml.xml"),
    "utf8"
);

function annotationRows(value) {
    return lintXml(value).map(function(e) {
        return e.row;
    });
}

module.exports = {
    "test: well-formed xml has no annotations": function() {
        assert.equal(lintXml('<root attr="ok"></root>\n').length, 0);
    },

    "test: extra character after attribute is annotated on that line": function() {
        var xml = '<root attr="ok"s></root>\n';
        var rows = annotationRows(xml);
        assert.ok(rows.length > 0, "expected a syntax annotation");
        rows.forEach(function(row) {
            assert.equal(row, 0);
        });
    },

    "test: extra character after attribute on a multi-line tag is annotated on the error line": function() {
        var xml = [
            "<root",
            '    attr="ok"s>',
            "</root>",
            ""
        ].join("\n");
        var anns = lintXml(xml);
        assert.ok(anns.length > 0, "expected a syntax annotation");
        anns.forEach(function(ann) {
            assert.equal(ann.row, 1);
            assert.ok(ann.column >= 4, "annotation should be on the attribute, not the tag-open line");
        });
    },

    "test: blank lines do not shift the annotation off the error line": function() {
        var xml = [
            "<root",
            "",
            '    attr="ok"s>',
            "</root>",
            ""
        ].join("\n");
        var rows = annotationRows(xml);
        assert.ok(rows.length > 0, "expected a syntax annotation");
        rows.forEach(function(row) {
            assert.equal(row, 2);
        });
    },

    "test: leading blank lines do not shift the annotation off the error line": function() {
        var xml = [
            "",
            "",
            '<root attr="ok"s></root>',
            ""
        ].join("\n");
        var rows = annotationRows(xml);
        assert.ok(rows.length > 0, "expected a syntax annotation");
        rows.forEach(function(row) {
            assert.equal(row, 2);
        });
    },

    "test: kitchen-sink query tag extra char (actual-single.gif) is annotated on that line": function() {
        var xml = kitchenSinkXml.replace(
            "xmlns:yahoo=\"http://www.yahooapis.com/v1/base.rng\"",
            "xmlns:yahoo=\"http://www.yahooapis.com/v1/base.rng\"s"
        );
        var trueRow = xml.slice(0, xml.indexOf("rng\"s")).split("\n").length - 1;
        assert.equal(trueRow, 1);
        var rows = annotationRows(xml);
        assert.ok(rows.indexOf(trueRow) !== -1, "expected an annotation on row " + trueRow + ", got " + rows);
    },

    "test: kitchen-sink place tag extra char (actual.gif) is annotated on that line": function() {
        var xml = kitchenSinkXml.replace(
            "<place xmlns=\"http://where.yahooapis.com/v1/schema.rng\"\n            xml:lang=\"en-US\" yahoo:uri=\"http://where.yahooapis.com/v1/place/24865672\">",
            "<place xmlns=\"http://where.yahooapis.com/v1/schema.rng\"s\n            xml:lang=\"en-US\" yahoo:uri=\"http://where.yahooapis.com/v1/place/24865672\">"
        );
        var trueRow = xml.slice(0, xml.indexOf("rng\"s")).split("\n").length - 1;
        assert.equal(trueRow, 41);
        var rows = annotationRows(xml);
        assert.ok(rows.indexOf(trueRow) !== -1, "expected an annotation on row " + trueRow + ", got " + rows);
    },

    "test: mismatched end tag after blank lines is annotated on the end tag line": function() {
        var xml = [
            "<root>",
            "",
            "</wrong>",
            ""
        ].join("\n");
        var errors = lintXml(xml).filter(function(e) {
            return e.type == "error";
        });
        assert.ok(errors.length > 0, "expected a syntax error annotation");
        assert.equal(errors[0].row, 2);
    }
};

require("../test/run")(module);
