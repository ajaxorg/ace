var Range = require("../range").Range;

var splitRegex = /[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;

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

function completionsFromMode(session, pos) {
    var completerTokens = session.$mode.$completerTokens;
    var lines = JSON.parse(JSON.stringify(session.bgTokenizer.lines));

    lines[pos.row] = lines[pos.row].filter(el => el.start !== pos.column - el.value.length);

    var wordList = lines.flat()
        .filter(el => el && completerTokens.includes(el.type))
        .map(el => el.value);

    return [...new Set(wordList)];
}

exports.getCompletions = function (editor, session, pos, prefix, callback) {
    var wordList;
    if (session.$mode.$completerTokens) {
        wordList = completionsFromMode(session, pos);
    } else {
        var wordScore = wordDistance(session, pos);
        wordList = Object.keys(wordScore);
    }

    callback(null, wordList.map(function (word) {
        return {
            caption: word,
            value: word,
            score: wordScore ? wordScore[word] : 0,
            meta: "local"
        };
    }));
};
