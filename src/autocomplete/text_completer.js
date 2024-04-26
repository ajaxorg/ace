var Range = require("../range").Range;

var splitRegex = /[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;
var identifierRe = /[a-zA-Z\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*/;

function getWordIndex(doc, pos) {
    var textBefore = doc.getTextRange(Range.fromPoints({
        row: 0,
        column: 0
    }, pos));
    return textBefore.split(splitRegex).length - 1;
}

/**
 * Does a distance analysis of the word `prefix` at position `pos` in `doc`.
 * @return Map
 */
function wordDistance(doc, pos) {
    var prefixPos = getWordIndex(doc, pos);
    var words = doc.getValue().split(splitRegex);
    var wordScores = Object.create(null);

    var currentWord = words[prefixPos];

    words.forEach(function (word, idx) {
        if (!word || word === currentWord) return;

        var distance = Math.abs(prefixPos - idx);
        var score = words.length - distance;
        if (wordScores[word]) {
            wordScores[word] = Math.max(score, wordScores[word]);
        }
        else {
            wordScores[word] = score;
        }
    });
    return wordScores;
}

function getWordScoresForFilteredStrings(session, pos) {
    var filterRegExp = /string|comment|^comment\.doc.*/;
    var lines = session.bgTokenizer.lines;
    var exclude = lines[pos.row] && lines[pos.row].find(el => el.start === pos.column - el.value.length);
    var wordScores = Object.create(null);

    var flatLines = lines.flat();
    var linesLength = flatLines.length;
    for (var i = 0; i < linesLength; i++) {
        var token = flatLines[i];
        if (!token || exclude && token.value === exclude.value) {
            continue;
        }
        if (!filterRegExp.test(token.type) && identifierRe.test(token.value)) {
            wordScores[token.value] = 0;
        }
    }

    return wordScores;
}

exports.getCompletions = function (editor, session, pos, prefix, callback) {
    var wordScore = editor.$filterStringsCompletions ? getWordScoresForFilteredStrings(session, pos) : wordDistance(
        session, pos);
    var wordList = Object.keys(wordScore);

    callback(null, wordList.map(function (word) {
        return {
            caption: word,
            value: word,
            score: wordScore[word],
            meta: "local"
        };
    }));
};
