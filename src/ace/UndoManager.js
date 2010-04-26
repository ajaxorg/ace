require.def("ace/UndoManager", function() {

var UndoManager = function() {
    this.$undoStack = [];
    this.$redoStack = [];
};

(function() {

    this.$doc = null;
    this.setDocument = function(doc) {
        this.$doc = doc;
    };

    this.notify = function(deltas) {
        this.$undoStack.push(deltas);
    };

    this.undo = function() {
        var deltas = this.$undoStack.pop();
        if (deltas) {
            this.$doc.undoChanges(deltas);
            this.$redoStack.push(deltas);
        }
    };

    this.redo = function() {
        var deltas = this.$redoStack.pop();
        if (deltas) {
            this.$doc.redoChanges(deltas);
            this.$undoStack.push(deltas);
        }
    };

}).call(UndoManager.prototype);

return UndoManager;
});