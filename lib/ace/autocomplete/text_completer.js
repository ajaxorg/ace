/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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

define(function(require, exports, module) {
    var completeUtil = require("./complete_util");
    var SPLIT_REGEX = /[^a-zA-Z_0-9\$]+/;
    var MAX_SCORE = 1000000;

    var completer = module.exports;

    // For the current document, gives scores to identifiers not on frequency, but on distance from the current prefix
    function wordDistanceAnalyzer(doc, pos, prefix, keywords) {
        var text = doc.getValue().trim();
        
        // Determine cursor's word index
        var textBefore = doc.getLines(0, pos.row - 1).join("\n") + "\n";
        var currentLine = doc.getLine(pos.row);
        textBefore += currentLine.substr(0, pos.column);
        var prefixPosition = textBefore.trim().split(SPLIT_REGEX).length - 1;
        
        // Split entire document into words
        var identifiers = text.split(SPLIT_REGEX);
        var identDict = {};
        
        // Find prefix to find other identifiers close it
        for (var i = 0; i < identifiers.length; i++) {
            if (i === prefixPosition)
                continue;
            var ident = identifiers[i];
            if (ident.length === 0)
                continue;
            var distance = Math.max(prefixPosition, i) - Math.min(prefixPosition, i);
            // Score substracted from MAX to force descending ordering
            if (Object.prototype.hasOwnProperty.call(identDict, ident))
                identDict[ident] = Math.max(MAX_SCORE - distance, identDict[ident]);
            else
                identDict[ident] = MAX_SCORE - distance;
            
        }

        for (var k = 0, l = keywords.length; k < l; k++) {
            identDict[keywords[k]] = MAX_SCORE;
        }

        return identDict;
    }

    completer.complete = function(doc, pos, keywords, callback) {
        var line = doc.getLine(pos.row);
        var identifier = completeUtil.retrievePrecedingIdentifier(line, pos.column);
        
        // there's nothing to autocomplete
        if (identifier === "")
            return callback(null);

        // we don't have keywords
        if (!keywords)
            return callback(null);

        var identDict = wordDistanceAnalyzer(doc, pos, identifier, keywords);

        var allIdentifiers = [];
        for (var ident in identDict) {
            allIdentifiers.push(ident);
        }

        allIdentifiers = completeUtil.removeDuplicateWords(allIdentifiers);

        // find fuzzy matches based on text in doc, as well as mode keywords
        var matches = completeUtil.findCompletions(identifier, identDict, allIdentifiers);

        callback(identifier, matches);
    };
});
