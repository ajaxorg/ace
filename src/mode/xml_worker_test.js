"use strict";

var assert = require("../test/assertions");
var lintXml = require("./xml/lint").lintXml;

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
