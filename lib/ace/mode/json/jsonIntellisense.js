/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(function(require, exports, module) {
"use strict";

var JsonIntellisense = function() {
};

(function() {
    this.suggest = function (jsonDocument, jsonSchema, doc, pos, prefix, callback) {
        var suggestions = [];
        var result = {
            currentWord: prefix,
            incomplete: false,
            suggestions: []
        };

        var overwriteBefore
        var overwriteAfter
        var proposed = {}
        var collector = {
            add: function (suggestion) {
                if (!proposed[suggestion.caption]) {
                    proposed[suggestion.caption] = true;

                    suggestion.overwriteBefore = overwriteBefore;
                    suggestion.overwriteAfter = overwriteAfter;
                    suggestions.push(suggestion);
                }
            }
        };

        var offset = doc.positionToIndex(pos)
        var node = jsonDocument.getNodeFromOffsetEndInclusive(offset)
        var addValue = true;
        var currentKey = prefix;
        var currentProperty = null;
        if (node && node.type === 'string') {
            var stringNode = node;
            if (stringNode.isKey) {
                //var nodeRange = modelMirror.getRangeFromOffsetAndLength(node.start, node.end - node.start);
                //overwriteBefore = position.column - nodeRange.startColumn;
                //overwriteAfter = nodeRange.endColumn - position.column;
                overwriteBefore = offset - node.start - prefix.length
                overwriteAfter = node.end - offset
                addValue = !(node.parent && node.parent.value);
                currentProperty = node.parent ? node.parent : null;
                //currentKey = modelMirror.getValueInRange({ startColumn: nodeRange.startColumn + 1, startLineNumber: nodeRange.startLineNumber, endColumn: position.column, endLineNumber: position.lineNumber });
                currentKey = stringNode.value
                if (node.parent) {
                    node = node.parent.parent;
                }
            }
        }

        // proposals for properties
        // don't suggest keys when the cursor is just before the opening curly brace
        if (node && node.type === 'object' && node.start !== offset) {
            // don't suggest properties that are already present
            var properties = node.properties;
            properties.forEach(function (p) {
                if (!currentProperty || currentProperty !== p) {
                    proposed[p.key.value] = true;
                }
            });
            if (jsonSchema) {
                var isLast = properties.length === 0 || offset >= properties[properties.length - 1].start;
                this.getPropertySuggestions(jsonSchema, jsonDocument, node, currentKey, addValue, isLast, collector);
            } else if (node.parent) {
                // property proposals without schema
                //this.getSchemaLessPropertySuggestions(doc, node, collector);
            }

            //var location = node.getNodeLocation();
            //this.contributions.forEach((contribution) => {
            //    var collectPromise = contribution.collectPropertySuggestions(resource, location, currentWord, addValue, isLast, collector);
            //    if (collectPromise) {
            //        collectionPromises.push(collectPromise);
            //    }
            //});
        }

        // proposals for values
        if (node && (node.type === 'string' || node.type === 'number' || node.type === 'integer' || node.type === 'boolean' || node.type === 'null')) {
            //var nodeRange = modelMirror.getRangeFromOffsetAndLength(node.start, node.end - node.start);
            //overwriteBefore = position.column - nodeRange.startColumn;
            //overwriteAfter = nodeRange.endColumn - position.column;
            overwriteBefore = offset - node.start - prefix.length
            overwriteAfter = node.end - offset
            node = node.parent;
        }

        if (jsonSchema) {
            // value proposals with schema
            this.getValueSuggestions(jsonSchema, jsonDocument, node, offset, collector);
        } else {
            // value proposals without schema
            //this.getSchemaLessValueSuggestions(doc, node, offset, modelMirror, collector);
        }

        //if (!node) {
        //    this.contributions.forEach((contribution) => {
        //        var collectPromise = contribution.collectDefaultSuggestions(resource, collector);
        //        if (collectPromise) {
        //            collectionPromises.push(collectPromise);
        //        }
        //    });
        //} else {
        //    if ((node.type === 'property') && offset > node.colonOffset) {
        //        var parentKey = node.key.value;

        //        var valueNode = node.value;
        //        if (!valueNode || offset <= valueNode.end) {
        //            var location = node.parent.getNodeLocation();
        //            this.contributions.forEach((contribution) => {
        //                var collectPromise = contribution.collectValueSuggestions(resource, location, parentKey, collector);
        //                if (collectPromise) {
        //                    collectionPromises.push(collectPromise);
        //                }
        //            });
        //        }
        //    }
        //}
        callback(suggestions)
    }

    this.getPropertySuggestions = function (jsonSchema, jsonDocument, node, currentKey, addValue, isLast, collector) {
        var matchingSchemas = [],
            that = this;
        jsonDocument.validate(jsonSchema, matchingSchemas, node.start)

        matchingSchemas.forEach(function (s) {
            if (s.node === node && !s.inverted) {
                var schemaProperties = s.schema.properties;
                if (schemaProperties) {
                    for (var key in schemaProperties) {
                        var propertySchema = schemaProperties[key];
                        var codeSnippet = that.getSnippetForProperty(key, propertySchema, addValue, isLast) || ''
                        collector.add({
                            caption: key,
                            meta: 'property',
                            label: key,
                            snippet: codeSnippet,
                            docHTML: propertySchema.description
                        });
                    }
                }
            }
        });
    }

    this.getValueSuggestions = function (jsonSchema, jsonDocument, node, offset, collector) {
        if (!node) {
            this.addDefaultSuggestion(jsonSchema, collector);
        } else {
            var parentKey = null;
            if (node && (node.type === 'property') && offset > node.colonOffset) {
                var valueNode = node.value;
                if (valueNode && offset > valueNode.end) {
                    return; // we are past the value node
                }
                parentKey = node.key.value;
                node = node.parent;
            }
            if (node && (parentKey !== null || node.type === 'array')) {
                var matchingSchemas = [],
                    that = this;
                jsonDocument.validate(jsonSchema, matchingSchemas, node.start);

                matchingSchemas.forEach(function (s) {
                    if (s.node === node && !s.inverted && s.schema) {
                        if (s.schema.items) {
                            that.addDefaultSuggestion(s.schema.items, collector);
                            that.addEnumSuggestion(s.schema.items, collector);
                        }
                        if (s.schema.properties) {
                            var propertySchema = s.schema.properties[parentKey];
                            if (propertySchema) {
                                that.addDefaultSuggestion(propertySchema, collector);
                                that.addEnumSuggestion(propertySchema, collector);
                            }
                        }
                    }
                });

            }
        }
    }

    this.addBooleanSuggestion = function (value, collector) {
        collector.add({
            caption: value ? 'true' : 'false',
            meta: this.getSuggestionType('boolean'),
            snippet: this.getSnippetForValue(value),
            docHTML: ''
        });
    };

    this.addEnumSuggestion = function (schema, collector) {
        var that = this;
        if (Array.isArray(schema.enum)) {
            schema.enum.forEach(function (enm) {
                collector.add({
                    caption: that.getLabelForValue(enm),
                    meta: that.getSuggestionType(schema.type),
                    snippet: that.getSnippetForValue(enm),
                    docHTML: ''
                });
            })
        } else if (schema.type === 'boolean') {
            this.addBooleanSuggestion(true, collector);
            this.addBooleanSuggestion(false, collector);
        }
        if (Array.isArray(schema.allOf)) {
            schema.allOf.forEach(function (s) { that.addEnumSuggestion(s, collector) });
        }
        if (Array.isArray(schema.anyOf)) {
            schema.anyOf.forEach(function (s) { that.addEnumSuggestion(s, collector) });
        }
        if (Array.isArray(schema.oneOf)) {
            schema.oneOf.forEach(function (s) { that.addEnumSuggestion(s, collector) });
        }
    }

    this.addDefaultSuggestion = function (schema, collector) {
        var that = this;
        if (schema.default) {
            collector.add({
                caption: that.getLabelForValue(schema.default),
                meta: 'Default value',
                snippet: that.getSnippetForValue(schema.default),
            });
        }
        if (Array.isArray(schema.allOf)) {
            schema.allOf.forEach((s) => that.addDefaultSuggestion(s, collector));
        }
        if (Array.isArray(schema.anyOf)) {
            schema.anyOf.forEach((s) => that.addDefaultSuggestion(s, collector));
        }
        if (Array.isArray(schema.oneOf)) {
            schema.oneOf.forEach((s) => that.addDefaultSuggestion(s, collector));
        }
    }

    this.getLabelForValue = function (value) {
        var label = JSON.stringify(value);
        //label = label.replace('{{', '').replace('}}', '');
        if (label.length > 57) {
            return label.substr(0, 57).trim() + '...';
        }
        return label;
    }

    this.getSnippetForProperty = function (key, propertySchema, addValue, isLast) {
        var result = '"' + key + '"';
        if (!addValue) {
            return result;
        }
        result += ': ';

        var defaultVal = propertySchema.default;
        if (typeof (defaultVal) != "undefined") {
            result += this.getSnippetForValue(defaultVal);
        } else if (propertySchema.enum && propertySchema.enum.length > 0) {
            result += this.getSnippetForValue(propertySchema.enum[0]);
        } else {
            switch (propertySchema.type) {
                case 'boolean':
                    result += '${0:false}';
                    break;
                case 'string':
                    result += '"${0}"';
                    break;
                case 'object':
                    result += '{\n\t${0}\n}';
                    break;
                case 'array':
                    result += '[\n\t${0}\n]';
                    break;
                case 'number':
                case 'integer':
                    result += '${0:0}';
                    break;
                case 'null':
                    result += 'null';
                    break;
                default:
                    return result;
            }
        }
        if (!isLast) {
            result += ',';
        }
        return result;
    }

    this.getSnippetForValue = function (value) {
        var snippet = JSON.stringify(value, null, '\t');
        switch (typeof value) {
            case 'object':
                if (value === null) {
                    return '${0:null}';
                }
                return snippet;
            case 'string':
                return '"${0:' + snippet.substr(1, snippet.length - 2) + '}"';
            case 'number':
            case 'integer':
            case 'boolean':
                return '${0:' + snippet + '}';
        }
        return snippet;
    }

    this.getSuggestionType = function (type) {
        if (Array.isArray(type)) {
            var array = type;
            type = array.length > 0 ? array[0] : null;
        }
        if (!type) {
            return 'text';
        }
        switch (type) {
            case 'string': return 'text';
            case 'object': return 'module';
            case 'property': return 'property';
            default: return 'value';
        }
    }

}).call(JsonIntellisense.prototype);

exports.JsonIntellisense = JsonIntellisense;

});