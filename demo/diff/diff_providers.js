/**
 * @typedef {Object} DiffProvider
 * @property {(originalLines: string[], modifiedLines: string[], opts: {ignoreTrimWhitespace: boolean, maxComputationTimeMs: number}) => AceDiff[]} compute
 */

var computeDiff = require("./vscode-diff/index").computeDiff;
var computeDiffLegacy = require("./vscode-diff-legacy/index").computeDiff;
var {AceDiff} = require("ace/ext/diff/ace_diff");
var Range = require("ace/range").Range;

const {
    diff_match_patch
} = require("./diff_match_patch");
const {presentableDiff} = require("./codemirror-diff/diff");

/**
 * VSCode’s computeDiff provider
 * @implements {DiffProvider}
 */
class VscodeDiffProvider {
    /**
     * @param {string[]} originalLines
     * @param {string[]} modifiedLines
     * @param {{ignoreTrimWhitespace: boolean, maxComputationTimeMs: number}} opts
     * @returns {AceDiff[]}
     */
    compute(originalLines, modifiedLines, opts) {
        if (!opts) opts = {};
        if (!opts.maxComputationTimeMs) opts.maxComputationTimeMs = 500;
        const chunks = computeDiff(originalLines, modifiedLines, opts) || [];
        return chunks.map(
            c => new AceDiff(new Range(c.origStart, 0, c.origEnd, 0), new Range(c.editStart, 0, c.editEnd, 0),
                c.charChanges
            ));
    }
}

/**
 * VSCode’s legacy computeDiff provider
 * @implements {DiffProvider}
 */
class VscodeLegacyDiffProvider {
    /**
     * @param {string[]} originalLines
     * @param {string[]} modifiedLines
     * @param {{ignoreTrimWhitespace: boolean, maxComputationTimeMs: number}} opts
     * @returns {AceDiff[]}
     */
    compute(originalLines, modifiedLines, opts) {
        if (!opts) opts = {};
        if (!opts.maxComputationTimeMs) opts.maxComputationTimeMs = 500;
        const chunks = computeDiffLegacy(originalLines, modifiedLines, opts) || [];
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

class CodeMirrorsDiffProvider {
    /**
     * @param {string[]} originalLines
     * @param {string[]} modifiedLines
     * @param {{ignoreTrimWhitespace: boolean, maxComputationTimeMs: number}} opts
     * @returns {AceDiff[]}
     */
    compute(originalLines, modifiedLines, opts) {
        const originalString = originalLines.join("\n");
        const modifiedString = modifiedLines.join("\n");
        const trimWS = Boolean(opts.ignoreTrimWhitespace);

        const changes = presentableDiff(originalString, modifiedString) || []; //this is very slow on big changes

        function offsetToPos(text, offset) {
            const lines = text.slice(0, offset).split("\n");
            return {
                row: lines.length - 1,
                column: lines[lines.length - 1].length
            };
        }

        return changes.map(change => {
            let {
                fromA,
                toA,
                fromB,
                toB
            } = change;

            if (trimWS) {
                const blockA = originalString.slice(fromA, toA);
                const blockB = modifiedString.slice(fromB, toB);
                const tA = blockA.trim();
                const leadA = blockA.indexOf(tA);
                const trailA = blockA.length - tA.length - leadA;
                const tB = blockB.trim();
                const leadB = blockB.indexOf(tB);
                const trailB = blockB.length - tB.length - leadB;
                if (tA) {
                    fromA += leadA;
                    toA -= trailA;
                }
                if (tB) {
                    fromB += leadB;
                    toB -= trailB;
                }
            }

            const startA = offsetToPos(originalString, fromA);
            const endA = offsetToPos(originalString, toA);
            const startB = offsetToPos(modifiedString, fromB);
            const endB = offsetToPos(modifiedString, toB);

            const subOrig = originalString.slice(fromA, toA);
            const subMod = modifiedString.slice(fromB, toB);
            const charDiffs = presentableDiff(subOrig, subMod, opts) || [];
            const charChanges = charDiffs.map(cd => {
                const oS = offsetToPos(originalString, fromA + cd.fromA);
                const oE = offsetToPos(originalString, fromA + cd.toA);
                const mS = offsetToPos(modifiedString, fromB + cd.fromB);
                const mE = offsetToPos(modifiedString, fromB + cd.toB);
                return {
                    originalStartLineNumber: oS.row,
                    originalStartColumn: oS.column,
                    originalEndLineNumber: oE.row,
                    originalEndColumn: oE.column,
                    modifiedStartLineNumber: mS.row,
                    modifiedStartColumn: mS.column,
                    modifiedEndLineNumber: mE.row,
                    modifiedEndColumn: mE.column
                };
            });

            return new AceDiff(new Range(startA.row, startA.column, endA.row, endA.column),
                new Range(startB.row, startB.column, endB.row, endB.column), charChanges
            );
        });
    }
}

exports.VscodeDiffProvider = VscodeDiffProvider;
exports.DiffMatchPatchProvider = DiffMatchPatchProvider;
exports.VscodeLegacyDiffProvider = VscodeLegacyDiffProvider;
exports.CodeMirrorsDiffProvider = CodeMirrorsDiffProvider;