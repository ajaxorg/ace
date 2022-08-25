"use strict";

var assert = require("assert");
    
assert.position = function(cursor, row, column) {
    assert.equal(cursor.row, row);
    assert.equal(cursor.column, column);
};

assert.range = function(range, startRow, startColumn, endRow, endColumn) {
    assert.position(range.start, startRow, startColumn);
    assert.position(range.end, endRow, endColumn);
};

assert.notOk = function(value) {
    assert.equal(value, false);   
};

assert.jsonEquals = function(foundJson, expectedJson) {
    assert.equal(JSON.stringify(foundJson), JSON.stringify(expectedJson));
};

assert.domNode = function(foundDom, expectedDom) {
    if (!Array.isArray(foundDom))
        foundDom = serializeDom(foundDom);
    assert.deepEqual(foundDom, expectedDom);
};

function serializeDom(node) {
    var attributes = {};
    var attributeArray = node.attributes;
    if (!attributeArray)
        return node.data;
    if (typeof attributeArray.length == "number") {
        for (var i = 0; i < attributeArray.length; i++)
            attributes[attributeArray[i].name] = attributeArray[i].value;
    }
    var result = [node.localName, attributes];
    for (var i = 0; i < node.childNodes.length; i++) {
        var child = serializeDom(node.childNodes[i]);
        if (child)
            result.push(child);
    }
    return result;
}

module.exports = assert;
