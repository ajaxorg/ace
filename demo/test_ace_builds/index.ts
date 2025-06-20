import * as ace from "ace-builds";
import {Range, Ace} from "ace-builds";
import "ace-builds/src-noconflict/ext-language_tools";
import "../../src/test/mockdom.js";

var HoverTooltip = ace.require("ace/tooltip").HoverTooltip;
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import {DiffViewOptions } from "ace-builds/src-noconflict/ext-diff";
import "ace-builds/src-noconflict/ext-diff";
const diff = ace.require("ace/ext/diff");

const MarkerGroup = ace.require("ace/marker_group").MarkerGroup;
const MouseEvent = ace.require("ace/mouse/mouse_event").MouseEvent;
var Tooltip = ace.require("ace/tooltip").Tooltip;
var popupManager = ace.require("ace/tooltip").popupManager;

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

const markerGroup: Ace.MarkerGroup = new MarkerGroup(editor.session);
const markers: Ace.MarkerGroupItem[] = [
    {
        range: new Range(0, 0, 10, 10),
        className: "test-class"
    }
]
markerGroup.setMarkers(markers);
markerGroup.markers.every(marker => {
    console.log(marker.range);
    return true;
});

const hover: Ace.HoverTooltip = new HoverTooltip();
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

editor.container.addEventListener('click', (e: MouseEvent) => {
    var mouseEvent: Ace.MouseEvent = new MouseEvent(e, editor);
    mouseEvent.x = e.x * 2;
});

var tooltip: Ace.Tooltip = new Tooltip(editor.container);
tooltip.show('hello');

popupManager.addPopup(tooltip);

editor.destroy && editor.destroy();

const diffViewOptions: DiffViewOptions =  {
    maxDiffs: 1000,
    folding: true
}

var diffView = diff.createDiffView({
    valueB: "test",
    inline: "b"
}, diffViewOptions);

diffView.setProvider(new diff.DiffProvider());
