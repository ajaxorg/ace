var dom = require("../../lib/dom");

class MinimalGutterDiffDecorator {
    /**
     * @param {import("../../editor").Editor} editor
     * @param {number} type
     */
    constructor(editor, type) {
        this.gutterClass ="ace_mini-diff_gutter-enabled";
        this.gutterCellsClasses = {
            add: "mini-diff-added",
            delete: "mini-diff-deleted",
        };

        this.editor = editor;
        this.type = type;
        this.chunks = [];
        this.attachToEditor();
    }

    attachToEditor() {
        this.renderGutters = this.renderGutters.bind(this);

        dom.addCssClass(
            this.editor.renderer.$gutterLayer.element,
            this.gutterClass
        );
        this.editor.renderer.$gutterLayer.on(
            "afterRender",
            this.renderGutters
        );
    }

    renderGutters(e, gutterLayer) {
        const cells = this.editor.renderer.$gutterLayer.$lines.cells;
        cells.forEach((cell) => {
            cell.element.classList.remove(Object.values(this.gutterCellsClasses));
        });
        const dir = this.type === -1 ? "old" : "new";
        const diffClass = this.type === -1 ? this.gutterCellsClasses.delete : this.gutterCellsClasses.add;
        this.chunks.forEach((lineChange) => {
            let startRow = lineChange[dir].start.row;
            let endRow = lineChange[dir].end.row - 1;

            cells.forEach((cell) => {
                if (cell.row >= startRow && cell.row <= endRow) {
                    cell.element.classList.add(diffClass);
                }
            });
        });
    }

    setDecorations(changes) {
        this.chunks = changes;
        this.renderGutters();
    }

    dispose() {
        dom.removeCssClass(
            this.editor.renderer.$gutterLayer.element,
            this.gutterClass
        );
        this.editor.renderer.$gutterLayer.off(
            "afterRender",
            this.renderGutters
        );
    }
}

exports.MinimalGutterDiffDecorator = MinimalGutterDiffDecorator;
