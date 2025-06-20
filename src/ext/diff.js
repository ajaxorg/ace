/**
 * ## Diff extension
 *
 * Provides side-by-side and inline diff view capabilities for comparing code differences between two versions.
 * Supports visual highlighting of additions, deletions, and modifications with customizable diff providers
 * and rendering options. Includes features for synchronized scrolling, line number alignment, and
 * various diff computation algorithms.
 *
 * **Components:**
 * - `InlineDiffView`: Single editor view showing changes inline with markers
 * - `SplitDiffView`: Side-by-side comparison view with two synchronized editors
 * - `DiffProvider`: Configurable algorithms for computing differences
 *
 * **Usage:**
 * ```javascript
 * const diffView = createDiffView({
 *   valueA: originalContent,
 *   valueB: modifiedContent,
 *   inline: false // or 'a'/'b' for inline view
 * });
 * ```
 *
 * @module
 */

var InlineDiffView = require("./diff/inline_diff_view").InlineDiffView;
var SplitDiffView = require("./diff/split_diff_view").SplitDiffView;
var DiffProvider = require("./diff/providers/default").DiffProvider;

/**
 * Interface representing a model for handling differences between two views or states.
 * @typedef {Object} DiffModel
 * @property {import("../editor").Editor} [editorA] - The editor for the original view.
 * @property {import("../editor").Editor} [editorB] - The editor for the edited view.
 * @property {import("../edit_session").EditSession} [sessionA] - The edit session for the original view.
 * @property {import("../edit_session").EditSession} [sessionB] - The edit session for the edited view.
 * @property {string} [valueA] - The original content.
 * @property {string} [valueB] - The modified content.
 * @property {"a"|"b"} [inline] - Whether to show the original view("a") or modified view("b") for inline diff view
 * @property {IDiffProvider} [diffProvider] - Provider for computing differences between original and modified content.
 */

/**
 * @typedef {Object} DiffViewOptions
 * @property {boolean} [showOtherLineNumbers=true] - Whether to show line numbers in the other editor's gutter
 * @property {boolean} [folding] - Whether to enable code folding widgets
 * @property {boolean} [syncSelections] - Whether to synchronize selections between both editors
 * @property {boolean} [ignoreTrimWhitespace] - Whether to ignore trimmed whitespace when computing diffs
 * @property {boolean} [wrap] - Whether to enable word wrapping in both editors
 * @property {number} [maxDiffs=5000] - Maximum number of diffs to compute before failing silently
 * @property {string|import("../../ace-internal").Ace.Theme} [theme] - Theme to apply to both editors
 */

/**
 * @typedef {Object} IDiffProvider
 * @property {(originalLines: string[], modifiedLines: string[], opts?: any) => import("./diff/base_diff_view").DiffChunk[]} compute - Computes differences between original and modified lines
 */


/**
 * Creates a diff view for comparing code.
 * @param {DiffModel} [diffModel] model for the diff view
 * @param {DiffViewOptions} [options] options for the diff view
 * @returns {InlineDiffView|SplitDiffView} Configured diff view instance
 */
function createDiffView(diffModel, options) {
    diffModel = diffModel || {};
    diffModel.diffProvider = diffModel.diffProvider || new DiffProvider(); //use default diff provider;
    let diffView;
    if (diffModel.inline) {
        diffView = new InlineDiffView(diffModel);
    }
    else {
        diffView = new SplitDiffView(diffModel);
    }
    if (options) {
        diffView.setOptions(options);
    }

    return diffView;
}

exports.InlineDiffView = InlineDiffView;
exports.SplitDiffView = SplitDiffView;
exports.DiffProvider = DiffProvider;
exports.createDiffView = createDiffView;
