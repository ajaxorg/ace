var InlineDiffView = require("./diff/inline_diff_view").InlineDiffView;
var DiffView = require("./diff/diff_view").DiffView;
var DiffProvider = require("./diff/providers/default").DiffProvider;

/**
 * Creates a diff view for comparing code.
 * @param {import("../../ace-internal").Ace.DiffModel} [diffModel] Model for the diff view
 * @param {boolean} [inline] Whether to use inline view instead of side-by-side
 * @param {DiffProvider} [provider] Custom diff provider
 * @returns {InlineDiffView|DiffView} Configured diff view instance
 */
function createDiffView(diffModel, inline, provider) {
    provider = provider || new DiffProvider();
    let diffView;
    if (inline) {
        diffView = new InlineDiffView(diffModel);
    }
    else {
        diffView = new DiffView(diffModel);
    }

    diffView.setProvider(provider);
    return diffView;
}

exports.InlineDiffView = InlineDiffView;
exports.DiffView = DiffView;
exports.DiffProvider = DiffProvider;
exports.createDiffView = createDiffView;
