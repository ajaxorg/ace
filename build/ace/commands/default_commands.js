define(function(b) {
  b = b("../plugin_manager");
  b.registerCommand("selectall", function(a, c) {
    c.selectAll()
  });
  b.registerCommand("removeline", function(a) {
    a.removeLines()
  });
  b.registerCommand("gotoline", function(a) {
    var c = parseInt(prompt("Enter line number:"));
    isNaN(c) || a.gotoLine(c)
  });
  b.registerCommand("togglecomment", function(a) {
    a.toggleCommentLines()
  });
  b.registerCommand("findnext", function(a) {
    a.findNext()
  });
  b.registerCommand("findprevious", function(a) {
    a.findPrevious()
  });
  b.registerCommand("find", function(a) {
    var c = prompt("Find:");
    a.find(c)
  });
  b.registerCommand("undo", function(a) {
    a.undo()
  });
  b.registerCommand("redo", function(a) {
    a.redo()
  });
  b.registerCommand("redo", function(a) {
    a.redo()
  });
  b.registerCommand("overwrite", function(a) {
    a.toggleOverwrite()
  });
  b.registerCommand("copylinesup", function(a) {
    a.copyLinesUp()
  });
  b.registerCommand("movelinesup", function(a) {
    a.moveLinesUp()
  });
  b.registerCommand("selecttostart", function(a, c) {
    c.selectFileStart()
  });
  b.registerCommand("gotostart", function(a) {
    a.navigateFileStart()
  });
  b.registerCommand("selectup", function(a, c) {
    c.selectUp()
  });
  b.registerCommand("golineup", function(a) {
    a.navigateUp()
  });
  b.registerCommand("copylinesdown", function(a) {
    a.copyLinesDown()
  });
  b.registerCommand("movelinesdown", function(a) {
    a.moveLinesDown()
  });
  b.registerCommand("selecttoend", function(a, c) {
    c.selectFileEnd()
  });
  b.registerCommand("gotoend", function(a) {
    a.navigateFileEnd()
  });
  b.registerCommand("selectdown", function(a, c) {
    c.selectDown()
  });
  b.registerCommand("godown", function(a) {
    a.navigateDown()
  });
  b.registerCommand("selectwordleft", function(a, c) {
    c.selectWordLeft()
  });
  b.registerCommand("gotowordleft", function(a) {
    a.navigateWordLeft()
  });
  b.registerCommand("selecttolinestart", function(a, c) {
    c.selectLineStart()
  });
  b.registerCommand("gotolinestart", function(a) {
    a.navigateLineStart()
  });
  b.registerCommand("selectleft", function(a, c) {
    c.selectLeft()
  });
  b.registerCommand("gotoleft", function(a) {
    a.navigateLeft()
  });
  b.registerCommand("selectwordright", function(a, c) {
    c.selectWordRight()
  });
  b.registerCommand("gotowordright", function(a) {
    a.navigateWordRight()
  });
  b.registerCommand("selecttolineend", function(a, c) {
    c.selectLineEnd()
  });
  b.registerCommand("gotolineend", function(a) {
    a.navigateLineEnd()
  });
  b.registerCommand("selectright", function(a, c) {
    c.selectRight()
  });
  b.registerCommand("gotoright", function(a) {
    a.navigateRight()
  });
  b.registerCommand("selectpagedown", function(a) {
    a.selectPageDown()
  });
  b.registerCommand("pagedown", function(a) {
    a.scrollPageDown()
  });
  b.registerCommand("gotopagedown", function(a) {
    a.gotoPageDown()
  });
  b.registerCommand("selectpageup", function(a) {
    a.selectPageUp()
  });
  b.registerCommand("pageup", function(a) {
    a.scrollPageUp()
  });
  b.registerCommand("gotopageup", function(a) {
    a.gotoPageUp()
  });
  b.registerCommand("selectlinestart", function(a, c) {
    c.selectLineStart()
  });
  b.registerCommand("gotolinestart", function(a) {
    a.navigateLineStart()
  });
  b.registerCommand("selectlineend", function(a, c) {
    c.selectLineEnd()
  });
  b.registerCommand("gotolineend", function(a) {
    a.navigateLineEnd()
  });
  b.registerCommand("del", function(a) {
    a.removeRight()
  });
  b.registerCommand("backspace", function(a) {
    a.removeLeft()
  });
  b.registerCommand("outdent", function(a) {
    a.blockOutdent()
  });
  b.registerCommand("indent", function(a) {
    a.indent()
  })
});