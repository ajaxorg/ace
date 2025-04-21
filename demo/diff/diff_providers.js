/**
 * @typedef {Object} DiffProvider
 * @property {(originalLines: string[], modifiedLines: string[], opts: {ignoreTrimWhitespace: boolean, maxComputationTimeMs: number}) => AceDiff[]} compute
 */

var computeDiff = require("./vscode-diff/index").computeDiff;
var {AceDiff} = require("ace/ext/diff/ace_diff");
var Range = require("ace/range").Range;

const {
    diff_match_patch
} = require("./diff_match_patch");

/**
 * Default wrapper around VSCode’s computeDiff
 * @implements {DiffProvider}
 */
class DefaultDiffProvider {
    /**
     * @param {string[]} originalLines
     * @param {string[]} modifiedLines
     * @param {{ignoreTrimWhitespace: boolean, maxComputationTimeMs: number}} opts
     * @returns {AceDiff[]}
     */
    compute(originalLines, modifiedLines, opts) {
        const chunks = computeDiff(originalLines, modifiedLines, opts) || [];
        return chunks.map(
            c => new AceDiff(new Range(c.origStart, 0, c.origEnd, 0), new Range(c.editStart, 0, c.editEnd, 0),
                c.charChanges
            ));
    }
}

/**
 * diff_match_patch provider
 * @implements {DiffProvider}
 */
class DiffMatchPatchProvider {
    constructor(transformPositionFunction) {
        this.$transformPositionFunction = transformPositionFunction;
    }

    /**
     * @param {string[]} originalLines
     * @param {string[]} modifiedLines
     * @param {{ignoreTrimWhitespace: boolean, maxComputationTimeMs: number}} opts
     * @returns {any}
     */
    compute(originalLines, modifiedLines, opts) {
        const dmp = new diff_match_patch();
        var a = this.$convertLinesToCharacterMap(originalLines, modifiedLines, opts.ignoreTrimWhitespace);
        var diff = dmp.diff_main(a.chars1, a.chars2, false);
        var chunks = [];
        var offset = {
            left: 0,
            right: 0
        };
        var lastChunk;
        diff.forEach(function (chunk) {
            var chunkType = chunk[0];
            var length = chunk[1].length;

            // oddly, occasionally the algorithm returns a diff with no changes made
            if (length === 0) {
                return;
            }
            if (chunkType === 0) {
                offset.left += length;
                offset.right += length;
                lastChunk = null;
            }
            else if (chunkType === -1) {
                if (lastChunk) {
                    lastChunk.origEnd = Math.max(offset.left + length, lastChunk.origEnd);
                    lastChunk.editEnd = Math.max(offset.right, lastChunk.editEnd);
                }
                else {
                    chunks.push((lastChunk = {
                        origStart: offset.left,
                        origEnd: offset.left + length,
                        editStart: offset.right,
                        editEnd: offset.right
                    }));
                }
                offset.left += length;
            }
            else if (chunkType === 1) {
                if (lastChunk) {
                    lastChunk.origEnd = Math.max(offset.left, lastChunk.origEnd);
                    lastChunk.editEnd = Math.max(offset.right + length, lastChunk.editEnd);
                }
                else {
                    chunks.push((lastChunk = {
                        origStart: offset.left,
                        origEnd: offset.left,
                        editStart: offset.right,
                        editEnd: offset.right + length
                    }));
                }
                offset.right += length;
            }
        });

        chunks.forEach((diff) => {
            var inlineChanges = [];
            var type = 0;
            if (diff.origStart == diff.origEnd) {
                type = 1;
            }
            else if (diff.editStart == diff.editEnd) {
                type = -1;
            }
            else {
                const DIFF_DELETE = -1, DIFF_INSERT = 1, DIFF_EQUAL = 0;

                let inlineDiff = dmp.diff_main(originalLines.slice(diff.origStart, diff.origEnd).join("\n"),
                    modifiedLines.slice(diff.editStart, diff.editEnd).join("\n"), false
                );
                dmp.diff_cleanupSemantic(inlineDiff);

                let origLine = diff.origStart, origCol = 0;

                inlineDiff.forEach(([changeType, text]) => {
                    if (!text) return;

                    const lines = text.split("\n");
                    const rowCount = lines.length - 1;
                    const colCount = lines[rowCount].length;

                    if (changeType === DIFF_DELETE || changeType === DIFF_INSERT) {
                        const originalEndLineNumber = changeType === DIFF_DELETE ? origLine + rowCount : origLine;
                        const originalEndColumn = changeType === DIFF_DELETE ? origCol + colCount : origCol;
                        const modifiedStartPos = this.$transformPositionFunction({
                            row: origLine,
                            column: origCol
                        }, true);
                        const modifiedEndPos = this.$transformPositionFunction({
                            row: originalEndLineNumber,
                            column: originalEndColumn
                        }, true);

                        inlineChanges.push({
                            originalStartLineNumber: origLine,
                            originalStartColumn: origCol,
                            originalEndLineNumber: originalEndLineNumber,
                            originalEndColumn: originalEndColumn,
                            modifiedStartLineNumber: modifiedStartPos.row,
                            modifiedStartColumn: modifiedStartPos.column,
                            modifiedEndLineNumber: modifiedEndPos.row,
                            modifiedEndColumn: modifiedEndPos.column
                        });
                    }

                    if (changeType !== DIFF_INSERT) {
                        origLine += rowCount;
                        origCol = rowCount ? colCount : (origCol + colCount);
                    }
                });

            }
            diff.inlineChanges = inlineChanges;
            diff.type = type;
        });
        return chunks.map(
            c => new AceDiff(new Range(c.origStart, 0, c.origEnd, 0), new Range(c.editStart, 0, c.editEnd, 0),
                c.inlineChanges
            ));
    }

    $convertLinesToCharacterMap(text1, text2, trimWhitespace) {
        var lineHash = Object.create(null);
        var lineCount = 1;

        function diff_linesToCharsMunge_(lines) {
            var chars = "";
            for (var i = 0; i < lines.length; i++) {
                var line = trimWhitespace ? lines[i].trim() : lines[i];
                if (typeof lineHash[line] === "number") {
                    chars += String.fromCharCode(lineHash[line]);
                }
                else {
                    chars += String.fromCharCode(lineCount);
                    lineHash[line] = lineCount++;
                }
            }
            return chars;
        }

        var chars1 = diff_linesToCharsMunge_(text1);
        var chars2 = diff_linesToCharsMunge_(text2);
        return {
            chars1: chars1,
            chars2: chars2
        };
    }
}

exports.DefaultDiffProvider = DefaultDiffProvider;
exports.DiffMatchPatchProvider = DiffMatchPatchProvider;