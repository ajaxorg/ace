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

define(function (require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var JSONParser = require('./json/jsonParser').JSONParser;
var Json = require('./json/json');
var JsonIntellisense = require('./json/jsonIntellisense').JsonIntellisense;

var JsonWorker = exports.JsonWorker = function (sender) {
    Mirror.call(this, sender);
    this.setTimeout(200);
    this.jsonParser = new JSONParser();
    this.jsonIntellisense = new JsonIntellisense();
};

oop.inherits(JsonWorker, Mirror);

(function () {
    this.setOptions = function (opts) {
        var schemaText = opts && opts.jsonSchema;
        this.jsonSchema = schemaText && Json.parse(schemaText);
        this.delayedCompletions = []
    };

    this.getCompletionsCore = function (pos, prefix, callbackIds) {
        var jsonDocument = this.jsonDocument,
            jsonSchema = this.jsonSchema,
            doc = this.doc,
            that = this;

        if (!jsonDocument)
            return false;

        this.jsonIntellisense.suggest(jsonDocument, jsonSchema, doc, pos, prefix, function (suggestions) {
            for (var i = 0; i < callbackIds.length; i++) {
                that.sender.callback(suggestions, callbackIds[i]);
            }
        })
    };

    this.getCompletions = function (pos, prefix, callbackId) {
        if (this.isPending()) {
            this.delayedCompletions.push({ pos: pos, prefix: prefix, callbackId: callbackId });
        } else {
            this.getCompletionsCore(pos, prefix, [callbackId]);
        }
    };

    this.onUpdate = function () {
        var jsonSchema = this.jsonSchema,
            doc = this.doc,
            value = doc.getValue(),
            errors = [],
            delayedCompletions = this.delayedCompletions;
        this.jsonDocument = null;
        if (value) {
            var document = this.jsonParser.parse(value, {
                ignoreDanglingComma: false
            });
            if (jsonSchema) {
                document.validate(jsonSchema);
            }
            document.errors.forEach(function (error) {
                var pos = doc.indexToPosition(error.location.start);
                errors.push({
                    row: pos.row,
                    column: pos.column,
                    text: error.message,
                    type: "error"
                });
            })
            document.warnings.forEach(function (error) {
                var pos = doc.indexToPosition(error.location.start);
                errors.push({
                    row: pos.row,
                    column: pos.column,
                    text: error.message,
                    type: "warning"
                });
            })
            //TODO: Add custom validation
            this.jsonDocument = document;

            if (delayedCompletions.length) {
                var callbackIds = delayedCompletions.map(function (x) { return x.callbackId })
                var currentCompletion = delayedCompletions[delayedCompletions.length - 1];
                this.getCompletionsCore(currentCompletion.pos, currentCompletion.prefix, callbackIds)
                this.delayedCompletions = []
            }
        }
        this.sender.emit("annotate", errors);
    };

}).call(JsonWorker.prototype);

});