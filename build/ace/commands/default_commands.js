define(function(b) {
  b = b("pilot/canon");
  b.addCommand({name:"selectall", exec:function(a) {
    a.editor.getSelection().selectAll()
  }});
  b.addCommand({name:"removeline", exec:function(a) {
    a.editor.removeLines()
  }});
  b.addCommand({name:"gotoline", exec:function(a) {
    var c = parseInt(prompt("Enter line number:"));
    isNaN(c) || a.editor.gotoLine(c)
  }});
  b.addCommand({name:"togglecomment", exec:function(a) {
    a.editor.toggleCommentLines()
  }});
  b.addCommand({name:"findnext", exec:function(a) {
    a.editor.findNext()
  }});
  b.addCommand({name:"findprevious", exec:function(a) {
    a.editor.findPrevious()
  }});
  b.addCommand({name:"find", exec:function(a) {
    var c = prompt("Find:");
    a.editor.find(c)
  }});
  b.addCommand({name:"undo", exec:function(a) {
    a.editor.undo()
  }});
  b.addCommand({name:"redo", exec:function(a) {
    a.editor.redo()
  }});
  b.addCommand({name:"redo", exec:function(a) {
    a.editor.redo()
  }});
  b.addCommand({name:"overwrite", exec:function(a) {
    a.editor.toggleOverwrite()
  }});
  b.addCommand({name:"copylinesup", exec:function(a) {
    a.editor.copyLinesUp()
  }});
  b.addCommand({name:"movelinesup", exec:function(a) {
    a.editor.moveLinesUp()
  }});
  b.addCommand({name:"selecttostart", exec:function(a) {
    a.editor.getSelection().selectFileStart()
  }});
  b.addCommand({name:"gotostart", exec:function(a) {
    a.editor.navigateFileStart()
  }});
  b.addCommand({name:"selectup", exec:function(a) {
    a.editor.getSelection().selectUp()
  }});
  b.addCommand({name:"golineup", exec:function(a) {
    a.editor.navigateUp()
  }});
  b.addCommand({name:"copylinesdown", exec:function(a) {
    a.editor.copyLinesDown()
  }});
  b.addCommand({name:"movelinesdown", exec:function(a) {
    a.editor.moveLinesDown()
  }});
  b.addCommand({name:"selecttoend", exec:function(a) {
    a.editor.getSelection().selectFileEnd()
  }});
  b.addCommand({name:"gotoend", exec:function(a) {
    a.editor.navigateFileEnd()
  }});
  b.addCommand({name:"selectdown", exec:function(a) {
    a.editor.getSelection().selectDown()
  }});
  b.addCommand({name:"godown", exec:function(a) {
    a.editor.navigateDown()
  }});
  b.addCommand({name:"selectwordleft", exec:function(a) {
    a.editor.getSelection().selectWordLeft()
  }});
  b.addCommand({name:"gotowordleft", exec:function(a) {
    a.editor.navigateWordLeft()
  }});
  b.addCommand({name:"selecttolinestart", exec:function(a) {
    a.editor.getSelection().selectLineStart()
  }});
  b.addCommand({name:"gotolinestart", exec:function(a) {
    a.editor.navigateLineStart()
  }});
  b.addCommand({name:"selectleft", exec:function(a) {
    a.editor.getSelection().selectLeft()
  }});
  b.addCommand({name:"gotoleft", exec:function(a) {
    a.editor.navigateLeft()
  }});
  b.addCommand({name:"selectwordright", exec:function(a) {
    a.editor.getSelection().selectWordRight()
  }});
  b.addCommand({name:"gotowordright", exec:function(a) {
    a.editor.navigateWordRight()
  }});
  b.addCommand({name:"selecttolineend", exec:function(a) {
    a.editor.getSelection().selectLineEnd()
  }});
  b.addCommand({name:"gotolineend", exec:function(a) {
    a.editor.navigateLineEnd()
  }});
  b.addCommand({name:"selectright", exec:function(a) {
    a.editor.getSelection().selectRight()
  }});
  b.addCommand({name:"gotoright", exec:function(a) {
    a.editor.navigateRight()
  }});
  b.addCommand({name:"selectpagedown", exec:function(a) {
    a.editor.selectPageDown()
  }});
  b.addCommand({name:"pagedown", exec:function(a) {
    a.editor.scrollPageDown()
  }});
  b.addCommand({name:"gotopagedown", exec:function(a) {
    a.editor.gotoPageDown()
  }});
  b.addCommand({name:"selectpageup", exec:function(a) {
    a.editor.selectPageUp()
  }});
  b.addCommand({name:"pageup", exec:function(a) {
    a.editor.scrollPageUp()
  }});
  b.addCommand({name:"gotopageup", exec:function(a) {
    a.editor.gotoPageUp()
  }});
  b.addCommand({name:"selectlinestart", exec:function(a) {
    a.editor.getSelection().selectLineStart()
  }});
  b.addCommand({name:"gotolinestart", exec:function(a) {
    a.editor.navigateLineStart()
  }});
  b.addCommand({name:"selectlineend", exec:function(a) {
    a.editor.getSelection().selectLineEnd()
  }});
  b.addCommand({name:"gotolineend", exec:function(a) {
    a.editor.navigateLineEnd()
  }});
  b.addCommand({name:"del", exec:function(a) {
    a.editor.removeRight()
  }});
  b.addCommand({name:"backspace", exec:function(a) {
    a.editor.removeLeft()
  }});
  b.addCommand({name:"outdent", exec:function(a) {
    a.editor.blockOutdent()
  }});
  b.addCommand({name:"indent", exec:function(a) {
    a.editor.indent()
  }})
});