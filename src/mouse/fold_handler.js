"use strict";
var dom = require("../lib/dom");

class FoldHandler {
    constructor(editor) {

        editor.on("click", function(e) {
            var position = e.getDocumentPosition();
            var session = editor.session;

            // If the user clicked on a fold, then expand it.
            var fold = session.getFoldAt(position.row, position.column, 1);
            if (fold) {
                if (e.getAccelKey())
                    session.removeFold(fold);
                else
                    session.expandFold(fold);

                e.stop();
            }

            var target = e.domEvent && e.domEvent.target;
            if (target && dom.hasCssClass(target, "ace_inline_button")) {
                if (dom.hasCssClass(target, "ace_toggle_wrap")) {
                    session.setOption("wrap", !session.getUseWrapMode());
                    editor.renderer.scrollCursorIntoView();
                }
            }
        });

        editor.on("gutterclick", function(e) {
            var gutterRegion = editor.renderer.$gutterLayer.getRegion(e);

            if (gutterRegion == "foldWidgets") {
                var row = e.getDocumentPosition().row;
                var session = editor.session;
                if (session.foldWidgets && session.foldWidgets[row])
                    editor.session.onFoldWidgetClick(row, e);
                if (!editor.isFocused())
                    editor.focus();
                e.stop();
            }
        });

        editor.on("gutterdblclick", function(e) {
            var gutterRegion = editor.renderer.$gutterLayer.getRegion(e);

            if (gutterRegion == "foldWidgets") {
                var row = e.getDocumentPosition().row;
                var session = editor.session;
                var data = session.getParentFoldRangeData(row, true);
                var range = data.range || data.firstRange;

                if (range) {
                    row = range.start.row;
                    var fold = session.getFoldAt(row, session.getLine(row).length, 1);

                    if (fold) {
                        session.removeFold(fold);
                    } else {
                        session.addFold("...", range);
                        editor.renderer.scrollCursorIntoView({row: range.start.row, column: 0});
                    }
                }
                e.stop();
            }
        });
    }
}

exports.FoldHandler = FoldHandler;
