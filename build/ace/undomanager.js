define(function() {
  var b = function() {
    this.$undoStack = [];
    this.$redoStack = []
  };
  (function() {
    this.execute = function(a) {
      var c = a.args[0];
      this.$doc = a.args[1];
      this.$undoStack.push(c)
    };
    this.undo = function() {
      var a = this.$undoStack.pop();
      if(a) {
        this.$doc.undoChanges(a);
        this.$redoStack.push(a)
      }
    };
    this.redo = function() {
      var a = this.$redoStack.pop();
      if(a) {
        this.$doc.redoChanges(a);
        this.$undoStack.push(a)
      }
    }
  }).call(b.prototype);
  return b
});