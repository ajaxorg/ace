define(function(require, exports, module) {
    var completeUtil = require("./complete_util");
    var SPLIT_REGEX = /[^a-zA-Z_0-9\$]+/;

    var completer = module.exports;
        
    this.handlesLanguage = function(language) {
        return true;
    };

    // For the current document, gives scores to identifiers not on frequency, but on distance from the current prefix
    function wordDistanceAnalyzer(doc, pos, prefix) {
        var text = doc.getValue().trim();
        
        // Determine cursor's word index
        var textBefore = doc.getLines(0, pos.row-1).join("\n") + "\n";
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
            // Score substracted from 100000 to force descending ordering
            if (Object.prototype.hasOwnProperty.call(identDict, ident))
                identDict[ident] = Math.max(1000000-distance, identDict[ident]);
            else
                identDict[ident] = 1000000-distance;
            
        }
        return identDict;
    }

    function analyze(doc, pos) {
        var line = doc.getLine(pos.row);
        var identifier = completeUtil.retrievePrecedingIdentifier(line, pos.column);
        
        var analysisCache = wordDistanceAnalyzer(doc, pos, identifier);
        return analysisCache;
    }
        
    completer.complete = function(doc, fullAst, pos, currentNode, callback) {
        var identDict = analyze(doc, pos);
        var line = doc.getLine(pos.row);
        var identifier = completeUtil.retrievePrecedingIdentifier(line, pos.column);
        
        var allIdentifiers = [];
        for (var ident in identDict) {
            allIdentifiers.push(ident);
        }
        var matches = completeUtil.findCompletions(identifier, allIdentifiers);

        callback(matches);
        /*callback(matches.map(function(m) {
            return {
              name        : m,
              replaceText : m,
              icon        : null,
              score       : identDict[m],
              meta        : "",
              priority    : 1
            };
        }));*/
    };
});