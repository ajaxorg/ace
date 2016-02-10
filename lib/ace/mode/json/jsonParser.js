/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

define(function (require, exports) {
'use strict';

var Json = require('./json')
var jsonLocation_1 = require('./jsonLocation')

function isNumber(obj) {
    if ((typeof (obj) === 'number' || obj instanceof Number) && !isNaN(obj)) {
        return true;
    }
    return false;
}

function isUndefined(obj) {
    return typeof (obj) === 'undefined';
}

function isObject(obj) {
    // Needed for IE8
    if (typeof obj === 'undefined' || obj === null) {
        return false;
    }
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function contains(array, item) {
    return array.indexOf(item) >= 0;
}

function localize(info, message) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return message.replace(/{(\d+)}/g, function (match, number) { return typeof args[number] !== 'undefined' ? args[number] : match; });
}

var ASTNode = (function () {
    function ASTNode(parent, type, name, start, end) {
        this.type = type;
        this.name = name;
        this.start = start;
        this.end = end;
        this.parent = parent;
    }
    ASTNode.prototype.getNodeLocation = function () {
        var path = this.parent ? this.parent.getNodeLocation() : new jsonLocation_1.JSONLocation([]);
        if (this.name) {
            path = path.append(this.name);
        }
        return path;
    };
    ASTNode.prototype.getChildNodes = function () {
        return [];
    };
    ASTNode.prototype.getValue = function () {
        // override in children
        return;
    };
    ASTNode.prototype.contains = function (offset, includeRightBound) {
        if (includeRightBound === void 0) { includeRightBound = false; }
        return offset >= this.start && offset < this.end || includeRightBound && offset === this.end;
    };
    ASTNode.prototype.visit = function (visitor) {
        return visitor(this);
    };
    ASTNode.prototype.getNodeFromOffset = function (offset) {
        var findNode = function (node) {
            if (offset >= node.start && offset < node.end) {
                var children = node.getChildNodes();
                for (var i = 0; i < children.length && children[i].start <= offset; i++) {
                    var item = findNode(children[i]);
                    if (item) {
                        return item;
                    }
                }
                return node;
            }
            return null;
        };
        return findNode(this);
    };
    ASTNode.prototype.getNodeFromOffsetEndInclusive = function (offset) {
        var findNode = function (node) {
            if (offset >= node.start && offset <= node.end) {
                var children = node.getChildNodes();
                for (var i = 0; i < children.length && children[i].start <= offset; i++) {
                    var item = findNode(children[i]);
                    if (item) {
                        return item;
                    }
                }
                return node;
            }
            return null;
        };
        return findNode(this);
    };
    ASTNode.prototype.validate = function (schema, validationResult, matchingSchemas, offset) {
        var _this = this;
        if (offset === void 0) { offset = -1; }
        if (offset !== -1 && !this.contains(offset)) {
            return;
        }
        if (Array.isArray(schema.type)) {
            if (contains(schema.type, this.type) === false) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('typeArrayMismatchWarning', 'Incorrect type. Expected one of {0}', schema.type.join())
                });
            }
        }
        else if (schema.type) {
            if (this.type !== schema.type) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('typeMismatchWarning', 'Incorrect type. Expected "{0}"', schema.type)
                });
            }
        }
        if (Array.isArray(schema.allOf)) {
            schema.allOf.forEach(function (subSchema) {
                _this.validate(subSchema, validationResult, matchingSchemas, offset);
            });
        }
        if (schema.not) {
            var subValidationResult = new ValidationResult();
            var subMatchingSchemas = [];
            this.validate(schema.not, subValidationResult, subMatchingSchemas, offset);
            if (!subValidationResult.hasErrors()) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('notSchemaWarning', "Matches a schema that is not allowed.")
                });
            }
            if (matchingSchemas) {
                subMatchingSchemas.forEach(function (ms) {
                    ms.inverted = !ms.inverted;
                    matchingSchemas.push(ms);
                });
            }
        }
        var testAlternatives = function (alternatives, maxOneMatch) {
            var matches = [];
            // remember the best match that is used for error messages
            var bestMatch = null;
            alternatives.forEach(function (subSchema) {
                var subValidationResult = new ValidationResult();
                var subMatchingSchemas = [];
                _this.validate(subSchema, subValidationResult, subMatchingSchemas);
                if (!subValidationResult.hasErrors()) {
                    matches.push(subSchema);
                }
                if (!bestMatch) {
                    bestMatch = { schema: subSchema, validationResult: subValidationResult, matchingSchemas: subMatchingSchemas };
                }
                else {
                    if (!maxOneMatch && !subValidationResult.hasErrors() && !bestMatch.validationResult.hasErrors()) {
                        // no errors, both are equally good matches
                        bestMatch.matchingSchemas.push.apply(bestMatch.matchingSchemas, subMatchingSchemas);
                        bestMatch.validationResult.propertiesMatches += subValidationResult.propertiesMatches;
                        bestMatch.validationResult.propertiesValueMatches += subValidationResult.propertiesValueMatches;
                    }
                    else {
                        var compareResult = subValidationResult.compare(bestMatch.validationResult);
                        if (compareResult > 0) {
                            // our node is the best matching so far
                            bestMatch = { schema: subSchema, validationResult: subValidationResult, matchingSchemas: subMatchingSchemas };
                        }
                        else if (compareResult === 0) {
                            // there's already a best matching but we are as good
                            bestMatch.matchingSchemas.push.apply(bestMatch.matchingSchemas, subMatchingSchemas);
                        }
                    }
                }
            });
            if (matches.length > 1 && maxOneMatch) {
                validationResult.warnings.push({
                    location: { start: _this.start, end: _this.start + 1 },
                    message: localize('oneOfWarning', "Matches multiple schemas when only one must validate.")
                });
            }
            if (bestMatch !== null) {
                validationResult.merge(bestMatch.validationResult);
                validationResult.propertiesMatches += bestMatch.validationResult.propertiesMatches;
                validationResult.propertiesValueMatches += bestMatch.validationResult.propertiesValueMatches;
                if (matchingSchemas) {
                    matchingSchemas.push.apply(matchingSchemas, bestMatch.matchingSchemas);
                }
            }
            return matches.length;
        };
        if (Array.isArray(schema.anyOf)) {
            testAlternatives(schema.anyOf, false);
        }
        if (Array.isArray(schema.oneOf)) {
            testAlternatives(schema.oneOf, true);
        }
        if (Array.isArray(schema.enum)) {
            if (contains(schema.enum, this.getValue()) === false) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('enumWarning', 'Value is not an accepted value. Valid values: {0}', JSON.stringify(schema.enum))
                });
            }
            else {
                validationResult.enumValueMatch = true;
            }
        }
        if (matchingSchemas !== null) {
            matchingSchemas.push({ node: this, schema: schema });
        }
    };
    return ASTNode;
})();
exports.ASTNode = ASTNode;
var NullASTNode = (function (_super) {
    __extends(NullASTNode, _super);
    function NullASTNode(parent, name, start, end) {
        _super.call(this, parent, 'null', name, start, end);
    }
    NullASTNode.prototype.getValue = function () {
        return null;
    };
    return NullASTNode;
})(ASTNode);
exports.NullASTNode = NullASTNode;
var BooleanASTNode = (function (_super) {
    __extends(BooleanASTNode, _super);
    function BooleanASTNode(parent, name, value, start, end) {
        _super.call(this, parent, 'boolean', name, start, end);
        this.value = value;
    }
    BooleanASTNode.prototype.getValue = function () {
        return this.value;
    };
    return BooleanASTNode;
})(ASTNode);
exports.BooleanASTNode = BooleanASTNode;
var ArrayASTNode = (function (_super) {
    __extends(ArrayASTNode, _super);
    function ArrayASTNode(parent, name, start, end) {
        _super.call(this, parent, 'array', name, start, end);
        this.items = [];
    }
    ArrayASTNode.prototype.getChildNodes = function () {
        return this.items;
    };
    ArrayASTNode.prototype.getValue = function () {
        return this.items.map(function (v) { return v.getValue(); });
    };
    ArrayASTNode.prototype.addItem = function (item) {
        if (item) {
            this.items.push(item);
            return true;
        }
        return false;
    };
    ArrayASTNode.prototype.visit = function (visitor) {
        var ctn = visitor(this);
        for (var i = 0; i < this.items.length && ctn; i++) {
            ctn = this.items[i].visit(visitor);
        }
        return ctn;
    };
    ArrayASTNode.prototype.validate = function (schema, validationResult, matchingSchemas, offset) {
        var _this = this;
        if (offset === void 0) { offset = -1; }
        if (offset !== -1 && !this.contains(offset)) {
            return;
        }
        _super.prototype.validate.call(this, schema, validationResult, matchingSchemas, offset);
        if (Array.isArray(schema.items)) {
            var subSchemas = schema.items;
            subSchemas.forEach(function (subSchema, index) {
                var itemValidationResult = new ValidationResult();
                var item = _this.items[index];
                if (item) {
                    item.validate(subSchema, itemValidationResult, matchingSchemas, offset);
                    validationResult.mergePropertyMatch(itemValidationResult);
                }
                else if (_this.items.length >= schema.items.length) {
                    validationResult.propertiesValueMatches++;
                }
            });
            if (schema.additionalItems === false && this.items.length > subSchemas.length) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('additionalItemsWarning', 'Array has too many items according to schema. Expected {0} or fewer', subSchemas.length)
                });
            }
            else if (this.items.length >= schema.items.length) {
                validationResult.propertiesValueMatches += (this.items.length - schema.items.length);
            }
        }
        else if (schema.items) {
            this.items.forEach(function (item) {
                var itemValidationResult = new ValidationResult();
                item.validate(schema.items, itemValidationResult, matchingSchemas, offset);
                validationResult.mergePropertyMatch(itemValidationResult);
            });
        }
        if (schema.minItems && this.items.length < schema.minItems) {
            validationResult.warnings.push({
                location: { start: this.start, end: this.end },
                message: localize('minItemsWarning', 'Array has too few items. Expected {0} or more', schema.minItems)
            });
        }
        if (schema.maxItems && this.items.length > schema.maxItems) {
            validationResult.warnings.push({
                location: { start: this.start, end: this.end },
                message: localize('maxItemsWarning', 'Array has too many items. Expected {0} or fewer', schema.minItems)
            });
        }
        if (schema.uniqueItems === true) {
            var values = this.items.map(function (node) {
                return node.getValue();
            });
            var duplicates = values.some(function (value, index) {
                return index !== values.lastIndexOf(value);
            });
            if (duplicates) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('uniqueItemsWarning', 'Array has duplicate items')
                });
            }
        }
    };
    return ArrayASTNode;
})(ASTNode);
exports.ArrayASTNode = ArrayASTNode;
var NumberASTNode = (function (_super) {
    __extends(NumberASTNode, _super);
    function NumberASTNode(parent, name, start, end) {
        _super.call(this, parent, 'number', name, start, end);
        this.isInteger = true;
        this.value = Number.NaN;
    }
    NumberASTNode.prototype.getValue = function () {
        return this.value;
    };
    NumberASTNode.prototype.validate = function (schema, validationResult, matchingSchemas, offset) {
        if (offset === void 0) { offset = -1; }
        if (offset !== -1 && !this.contains(offset)) {
            return;
        }
        // work around type validation in the base class
        var typeIsInteger = false;
        if (schema.type === 'integer' || (Array.isArray(schema.type) && contains(schema.type, 'integer'))) {
            typeIsInteger = true;
        }
        if (typeIsInteger && this.isInteger === true) {
            this.type = 'integer';
        }
        _super.prototype.validate.call(this, schema, validationResult, matchingSchemas, offset);
        this.type = 'number';
        var val = this.getValue();
        if (isNumber(schema.multipleOf)) {
            if (val % schema.multipleOf !== 0) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('multipleOfWarning', 'Value is not divisible by {0}', schema.multipleOf)
                });
            }
        }
        if (!isUndefined(schema.minimum)) {
            if (schema.exclusiveMinimum && val <= schema.minimum) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('exclusiveMinimumWarning', 'Value is below the exclusive minimum of {0}', schema.minimum)
                });
            }
            if (!schema.exclusiveMinimum && val < schema.minimum) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('minimumWarning', 'Value is below the minimum of {0}', schema.minimum)
                });
            }
        }
        if (!isUndefined(schema.maximum)) {
            if (schema.exclusiveMaximum && val >= schema.maximum) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('exclusiveMaximumWarning', 'Value is above the exclusive maximum of {0}', schema.maximum)
                });
            }
            if (!schema.exclusiveMaximum && val > schema.maximum) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('maximumWarning', 'Value is above the maximum of {0}', schema.maximum)
                });
            }
        }
    };
    return NumberASTNode;
})(ASTNode);
exports.NumberASTNode = NumberASTNode;
var StringASTNode = (function (_super) {
    __extends(StringASTNode, _super);
    function StringASTNode(parent, name, isKey, start, end) {
        this.isKey = isKey;
        this.value = '';
        _super.call(this, parent, 'string', name, start, end);
    }
    StringASTNode.prototype.getValue = function () {
        return this.value;
    };
    StringASTNode.prototype.validate = function (schema, validationResult, matchingSchemas, offset) {
        if (offset === void 0) { offset = -1; }
        if (offset !== -1 && !this.contains(offset)) {
            return;
        }
        _super.prototype.validate.call(this, schema, validationResult, matchingSchemas, offset);
        if (schema.minLength && this.value.length < schema.minLength) {
            validationResult.warnings.push({
                location: { start: this.start, end: this.end },
                message: localize('minLengthWarning', 'String is shorter than the minimum length of ', schema.minLength)
            });
        }
        if (schema.maxLength && this.value.length > schema.maxLength) {
            validationResult.warnings.push({
                location: { start: this.start, end: this.end },
                message: localize('maxLengthWarning', 'String is shorter than the maximum length of ', schema.maxLength)
            });
        }
        if (schema.pattern) {
            var regex = new RegExp(schema.pattern);
            if (!regex.test(this.value)) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: schema.errorMessage || localize('patternWarning', 'String does not match the pattern of "{0}"', schema.pattern)
                });
            }
        }
    };
    return StringASTNode;
})(ASTNode);
exports.StringASTNode = StringASTNode;
var PropertyASTNode = (function (_super) {
    __extends(PropertyASTNode, _super);
    function PropertyASTNode(parent, key) {
        _super.call(this, parent, 'property', null, key.start);
        this.key = key;
        key.parent = this;
        key.name = key.value;
        this.colonOffset = -1;
    }
    PropertyASTNode.prototype.getChildNodes = function () {
        return this.value ? [this.key, this.value] : [this.key];
    };
    PropertyASTNode.prototype.setValue = function (value) {
        this.value = value;
        return value !== null;
    };
    PropertyASTNode.prototype.visit = function (visitor) {
        return visitor(this) && this.key.visit(visitor) && this.value && this.value.visit(visitor);
    };
    PropertyASTNode.prototype.validate = function (schema, validationResult, matchingSchemas, offset) {
        if (offset === void 0) { offset = -1; }
        if (offset !== -1 && !this.contains(offset)) {
            return;
        }
        if (this.value) {
            this.value.validate(schema, validationResult, matchingSchemas, offset);
        }
    };
    return PropertyASTNode;
})(ASTNode);
exports.PropertyASTNode = PropertyASTNode;
var ObjectASTNode = (function (_super) {
    __extends(ObjectASTNode, _super);
    function ObjectASTNode(parent, name, start, end) {
        _super.call(this, parent, 'object', name, start, end);
        this.properties = [];
    }
    ObjectASTNode.prototype.getChildNodes = function () {
        return this.properties;
    };
    ObjectASTNode.prototype.addProperty = function (node) {
        if (!node) {
            return false;
        }
        this.properties.push(node);
        return true;
    };
    ObjectASTNode.prototype.getFirstProperty = function (key) {
        for (var i = 0; i < this.properties.length; i++) {
            if (this.properties[i].key.value === key) {
                return this.properties[i];
            }
        }
        return null;
    };
    ObjectASTNode.prototype.getKeyList = function () {
        return this.properties.map(function (p) { return p.key.getValue(); });
    };
    ObjectASTNode.prototype.getValue = function () {
        var value = {};
        this.properties.forEach(function (p) {
            var v = p.value && p.value.getValue();
            if (v) {
                value[p.key.getValue()] = v;
            }
        });
        return value;
    };
    ObjectASTNode.prototype.visit = function (visitor) {
        var ctn = visitor(this);
        for (var i = 0; i < this.properties.length && ctn; i++) {
            ctn = this.properties[i].visit(visitor);
        }
        return ctn;
    };
    ObjectASTNode.prototype.validate = function (schema, validationResult, matchingSchemas, offset) {
        var _this = this;
        if (offset === void 0) { offset = -1; }
        if (offset !== -1 && !this.contains(offset)) {
            return;
        }
        _super.prototype.validate.call(this, schema, validationResult, matchingSchemas, offset);
        var seenKeys = {};
        var unprocessedProperties = [];
        this.properties.forEach(function (node) {
            var key = node.key.value;
            seenKeys[key] = node.value;
            unprocessedProperties.push(key);
        });
        if (Array.isArray(schema.required)) {
            schema.required.forEach(function (propertyName) {
                if (!seenKeys[propertyName]) {
                    var key = _this.parent && _this.parent && _this.parent.key;
                    var location = key ? { start: key.start, end: key.end } : { start: _this.start, end: _this.start + 1 };
                    validationResult.warnings.push({
                        location: location,
                        message: localize('MissingRequiredPropWarning', 'Missing property "{0}"', propertyName)
                    });
                }
            });
        }
        var propertyProcessed = function (prop) {
            var index = unprocessedProperties.indexOf(prop);
            while (index >= 0) {
                unprocessedProperties.splice(index, 1);
                index = unprocessedProperties.indexOf(prop);
            }
        };
        if (schema.properties) {
            Object.keys(schema.properties).forEach(function (propertyName) {
                propertyProcessed(propertyName);
                var prop = schema.properties[propertyName];
                var child = seenKeys[propertyName];
                if (child) {
                    var propertyvalidationResult = new ValidationResult();
                    child.validate(prop, propertyvalidationResult, matchingSchemas, offset);
                    validationResult.mergePropertyMatch(propertyvalidationResult);
                }
            });
        }
        if (schema.patternProperties) {
            Object.keys(schema.patternProperties).forEach(function (propertyPattern) {
                var regex = new RegExp(propertyPattern);
                unprocessedProperties.slice(0).forEach(function (propertyName) {
                    if (regex.test(propertyName)) {
                        propertyProcessed(propertyName);
                        var child = seenKeys[propertyName];
                        if (child) {
                            var propertyvalidationResult = new ValidationResult();
                            child.validate(schema.patternProperties[propertyPattern], propertyvalidationResult, matchingSchemas, offset);
                            validationResult.mergePropertyMatch(propertyvalidationResult);
                        }
                    }
                });
            });
        }
        if (isObject(schema.additionalProperties)) {
            unprocessedProperties.forEach(function (propertyName) {
                var child = seenKeys[propertyName];
                if (child) {
                    var propertyvalidationResult = new ValidationResult();
                    child.validate(schema.additionalProperties, propertyvalidationResult, matchingSchemas, offset);
                    validationResult.mergePropertyMatch(propertyvalidationResult);
                }
            });
        }
        else if (schema.additionalProperties === false) {
            if (unprocessedProperties.length > 0) {
                unprocessedProperties.forEach(function (propertyName) {
                    var child = seenKeys[propertyName];
                    if (child) {
                        var propertyNode = child.parent;
                        validationResult.warnings.push({
                            location: { start: propertyNode.key.start, end: propertyNode.key.end },
                            message: localize('DisallowedExtraPropWarning', 'Property {0} is not allowed', propertyName)
                        });
                    }
                });
            }
        }
        if (schema.maxProperties) {
            if (this.properties.length > schema.maxProperties) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('MaxPropWarning', 'Object has more properties than limit of {0}', schema.maxProperties)
                });
            }
        }
        if (schema.minProperties) {
            if (this.properties.length < schema.minProperties) {
                validationResult.warnings.push({
                    location: { start: this.start, end: this.end },
                    message: localize('MinPropWarning', 'Object has fewer properties than the required number of {0}', schema.minProperties)
                });
            }
        }
        if (isObject(schema.dependencies)) {
            Object.keys(schema.dependencies).forEach(function (key) {
                var prop = seenKeys[key];
                if (prop) {
                    if (Array.isArray(schema.dependencies[key])) {
                        var valueAsArray = schema.dependencies[key];
                        valueAsArray.forEach(function (requiredProp) {
                            if (!seenKeys[requiredProp]) {
                                validationResult.warnings.push({
                                    location: { start: _this.start, end: _this.end },
                                    message: localize('RequiredDependentPropWarning', 'Object is missing property {0} required by property {1}', requiredProp, key)
                                });
                            }
                            else {
                                validationResult.propertiesValueMatches++;
                            }
                        });
                    }
                    else if (isObject(schema.dependencies[key])) {
                        var valueAsSchema = schema.dependencies[key];
                        var propertyvalidationResult = new ValidationResult();
                        _this.validate(valueAsSchema, propertyvalidationResult, matchingSchemas, offset);
                        validationResult.mergePropertyMatch(propertyvalidationResult);
                    }
                }
            });
        }
    };
    return ObjectASTNode;
})(ASTNode);
exports.ObjectASTNode = ObjectASTNode;
var JSONDocumentConfig = (function () {
    function JSONDocumentConfig() {
        this.ignoreDanglingComma = false;
    }
    return JSONDocumentConfig;
})();
exports.JSONDocumentConfig = JSONDocumentConfig;
var ValidationResult = (function () {
    function ValidationResult() {
        this.errors = [];
        this.warnings = [];
        this.propertiesMatches = 0;
        this.propertiesValueMatches = 0;
        this.enumValueMatch = false;
    }
    ValidationResult.prototype.hasErrors = function () {
        return !!this.errors.length || !!this.warnings.length;
    };
    ValidationResult.prototype.mergeAll = function (validationResults) {
        var _this = this;
        validationResults.forEach(function (validationResult) {
            _this.merge(validationResult);
        });
    };
    ValidationResult.prototype.merge = function (validationResult) {
        this.errors = this.errors.concat(validationResult.errors);
        this.warnings = this.warnings.concat(validationResult.warnings);
    };
    ValidationResult.prototype.mergePropertyMatch = function (propertyValidationResult) {
        this.merge(propertyValidationResult);
        this.propertiesMatches++;
        if (propertyValidationResult.enumValueMatch || !propertyValidationResult.hasErrors() && propertyValidationResult.propertiesMatches) {
            this.propertiesValueMatches++;
        }
    };
    ValidationResult.prototype.compare = function (other) {
        var hasErrors = this.hasErrors();
        if (hasErrors !== other.hasErrors()) {
            return hasErrors ? -1 : 1;
        }
        if (this.enumValueMatch !== other.enumValueMatch) {
            return other.enumValueMatch ? -1 : 1;
        }
        if (this.propertiesValueMatches !== other.propertiesValueMatches) {
            return this.propertiesValueMatches - other.propertiesValueMatches;
        }
        return this.propertiesMatches - other.propertiesMatches;
    };
    return ValidationResult;
})();
exports.ValidationResult = ValidationResult;
var JSONDocument = (function () {
    function JSONDocument(config) {
        this.config = config;
        this.validationResult = new ValidationResult();
    }
    Object.defineProperty(JSONDocument.prototype, "errors", {
        get: function () {
            return this.validationResult.errors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JSONDocument.prototype, "warnings", {
        get: function () {
            return this.validationResult.warnings;
        },
        enumerable: true,
        configurable: true
    });
    JSONDocument.prototype.getNodeFromOffset = function (offset) {
        return this.root && this.root.getNodeFromOffset(offset);
    };
    JSONDocument.prototype.getNodeFromOffsetEndInclusive = function (offset) {
        return this.root && this.root.getNodeFromOffsetEndInclusive(offset);
    };
    JSONDocument.prototype.visit = function (visitor) {
        if (this.root) {
            this.root.visit(visitor);
        }
    };
    JSONDocument.prototype.validate = function (schema, matchingSchemas, offset) {
        if (matchingSchemas === void 0) { matchingSchemas = null; }
        if (offset === void 0) { offset = -1; }
        if (this.root) {
            this.root.validate(schema, this.validationResult, matchingSchemas, offset);
        }
    };
    return JSONDocument;
})();
exports.JSONDocument = JSONDocument;
var JSONParser = (function () {
    function JSONParser() {
    }
    JSONParser.prototype.parse = function (text, config) {
        if (config === void 0) { config = new JSONDocumentConfig(); }
        var _doc = new JSONDocument(config);
        var _scanner = Json.createScanner(text, true);
        function _accept(token) {
            if (_scanner.getToken() === token) {
                _scanner.scan();
                return true;
            }
            return false;
        }
        function _error(message, node, skipUntilAfter, skipUntil) {
            if (node === void 0) { node = null; }
            if (skipUntilAfter === void 0) { skipUntilAfter = []; }
            if (skipUntil === void 0) { skipUntil = []; }
            if (_doc.errors.length === 0 || _doc.errors[0].location.start !== _scanner.getTokenOffset()) {
                // ignore multiple errors on the same offset
                var error = { message: message, location: { start: _scanner.getTokenOffset(), end: _scanner.getTokenOffset() + _scanner.getTokenLength() } };
                _doc.errors.push(error);
            }
            if (node) {
                _finalize(node, false);
            }
            if (skipUntilAfter.length + skipUntil.length > 0) {
                var token = _scanner.getToken();
                while (token !== Json.SyntaxKind.EOF) {
                    if (skipUntilAfter.indexOf(token) !== -1) {
                        _scanner.scan();
                        break;
                    }
                    else if (skipUntil.indexOf(token) !== -1) {
                        break;
                    }
                    token = _scanner.scan();
                }
            }
            return node;
        }
        function _checkScanError() {
            switch (_scanner.getTokenError()) {
                case Json.ScanError.InvalidUnicode:
                    _error(localize('InvalidUnicode', 'Invalid unicode sequence in string'));
                    return true;
                case Json.ScanError.InvalidEscapeCharacter:
                    _error(localize('InvalidEscapeCharacter', 'Invalid escape character in string'));
                    return true;
                case Json.ScanError.UnexpectedEndOfNumber:
                    _error(localize('UnexpectedEndOfNumber', 'Unexpected end of number'));
                    return true;
                case Json.ScanError.UnexpectedEndOfComment:
                    _error(localize('UnexpectedEndOfComment', 'Unexpected end of comment'));
                    return true;
                case Json.ScanError.UnexpectedEndOfString:
                    _error(localize('UnexpectedEndOfString', 'Unexpected end of string'));
                    return true;
            }
            return false;
        }
        function _finalize(node, scanNext) {
            node.end = _scanner.getTokenOffset() + _scanner.getTokenLength();
            if (scanNext) {
                _scanner.scan();
            }
            return node;
        }
        function _parseArray(parent, name) {
            if (_scanner.getToken() !== Json.SyntaxKind.OpenBracketToken) {
                return null;
            }
            var node = new ArrayASTNode(parent, name, _scanner.getTokenOffset());
            _scanner.scan(); // consume OpenBracketToken
            var count = 0;
            if (node.addItem(_parseValue(node, '' + count++))) {
                while (_accept(Json.SyntaxKind.CommaToken)) {
                    if (!node.addItem(_parseValue(node, '' + count++)) && !_doc.config.ignoreDanglingComma) {
                        _error(localize('ValueExpected', 'Value expected'));
                    }
                }
            }
            if (_scanner.getToken() !== Json.SyntaxKind.CloseBracketToken) {
                return _error(localize('ExpectedCloseBracket', 'Expected comma or closing bracket'), node);
            }
            return _finalize(node, true);
        }
        function _parseProperty(parent, keysSeen) {
            var key = _parseString(null, null, true);
            if (!key) {
                if (_scanner.getToken() === Json.SyntaxKind.Unknown) {
                    // give a more helpful error message
                    var value = _scanner.getTokenValue();
                    if (value.length > 0 && (value.charAt(0) === '\'' || Json.isLetter(value.charAt(0).charCodeAt(0)))) {
                        _error(localize('DoubleQuotesExpected', 'Property keys must be doublequoted'));
                    }
                }
                return null;
            }
            var node = new PropertyASTNode(parent, key);
            if (keysSeen[key.value]) {
                _doc.warnings.push({ location: { start: node.key.start, end: node.key.end }, message: localize('DuplicateKeyWarning', "Duplicate object key") });
            }
            keysSeen[key.value] = true;
            if (_scanner.getToken() === Json.SyntaxKind.ColonToken) {
                node.colonOffset = _scanner.getTokenOffset();
            }
            else {
                return _error(localize('ColonExpected', 'Colon expected'), node, [], [Json.SyntaxKind.CloseBraceToken, Json.SyntaxKind.CommaToken]);
            }
            _scanner.scan(); // consume ColonToken
            if (!node.setValue(_parseValue(node, key.value))) {
                return _error(localize('ValueExpected', 'Value expected'), node, [], [Json.SyntaxKind.CloseBraceToken, Json.SyntaxKind.CommaToken]);
            }
            node.end = node.value.end;
            return node;
        }
        function _parseObject(parent, name) {
            if (_scanner.getToken() !== Json.SyntaxKind.OpenBraceToken) {
                return null;
            }
            var node = new ObjectASTNode(parent, name, _scanner.getTokenOffset());
            _scanner.scan(); // consume OpenBraceToken
            var keysSeen = {};
            if (node.addProperty(_parseProperty(node, keysSeen))) {
                while (_accept(Json.SyntaxKind.CommaToken)) {
                    if (!node.addProperty(_parseProperty(node, keysSeen)) && !_doc.config.ignoreDanglingComma) {
                        _error(localize('PropertyExpected', 'Property expected'));
                    }
                }
            }
            if (_scanner.getToken() !== Json.SyntaxKind.CloseBraceToken) {
                return _error(localize('ExpectedCloseBrace', 'Expected comma or closing brace'), node);
            }
            return _finalize(node, true);
        }
        function _parseString(parent, name, isKey) {
            if (_scanner.getToken() !== Json.SyntaxKind.StringLiteral) {
                return null;
            }
            var node = new StringASTNode(parent, name, isKey, _scanner.getTokenOffset());
            node.value = _scanner.getTokenValue();
            _checkScanError();
            return _finalize(node, true);
        }
        function _parseNumber(parent, name) {
            if (_scanner.getToken() !== Json.SyntaxKind.NumericLiteral) {
                return null;
            }
            var node = new NumberASTNode(parent, name, _scanner.getTokenOffset());
            if (!_checkScanError()) {
                var tokenValue = _scanner.getTokenValue();
                try {
                    var numberValue = JSON.parse(tokenValue);
                    if (typeof numberValue !== 'number') {
                        return _error(localize('InvalidNumberFormat', 'Invalid number format'), node);
                    }
                    node.value = numberValue;
                }
                catch (e) {
                    return _error(localize('InvalidNumberFormat', 'Invalid number format'), node);
                }
                node.isInteger = tokenValue.indexOf('.') === -1;
            }
            return _finalize(node, true);
        }
        function _parseLiteral(parent, name) {
            var node;
            switch (_scanner.getToken()) {
                case Json.SyntaxKind.NullKeyword:
                    node = new NullASTNode(parent, name, _scanner.getTokenOffset());
                    break;
                case Json.SyntaxKind.TrueKeyword:
                    node = new BooleanASTNode(parent, name, true, _scanner.getTokenOffset());
                    break;
                case Json.SyntaxKind.FalseKeyword:
                    node = new BooleanASTNode(parent, name, false, _scanner.getTokenOffset());
                    break;
                default:
                    return null;
            }
            return _finalize(node, true);
        }
        function _parseValue(parent, name) {
            return _parseArray(parent, name) || _parseObject(parent, name) || _parseString(parent, name, false) || _parseNumber(parent, name) || _parseLiteral(parent, name);
        }
        _scanner.scan();
        _doc.root = _parseValue(null, null);
        if (!_doc.root) {
            _error(localize('Invalid symbol', 'Expected a JSON object, array or literal'));
        }
        else if (_scanner.getToken() !== Json.SyntaxKind.EOF) {
            _error(localize('End of file expected', 'End of file expected'));
        }
        return _doc;
    };
    return JSONParser;
})();
exports.JSONParser = JSONParser;
});
