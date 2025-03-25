import * as ace from "ace-builds";
import {Range, Ace} from "ace-builds";
import "ace-builds/src-noconflict/ext-language_tools";
import "../../src/test/mockdom.js";
var HoverTooltip = ace.require("ace/tooltip").HoverTooltip;
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const editor = ace.edit(null); // should not be an error
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

function configure(config: Ace.Config) {
    config.setDefaultValues("editor", {
        fontSize: 14,
        showPrintMargin: false,
    })
}

configure(ace.config) // should not be a error

const hover = new HoverTooltip();
hover.setDataProvider((e: any, editor: Ace.Editor) => {
    const domNode = document.createElement("div");
    hover.showForRange(editor, new Range(1, 3, 3, 1), domNode, e);
});
hover.addToEditor(editor);

editor.commands.on('afterExec', ({editor, command}) => {
    console.log(editor.getValue(), command.name);
});

editor.commands.on('exec', ({editor, command}) => {
    console.log(editor.getValue(), command.name);
});

editor.destroy && editor.destroy();