import * as ace from "ace-code";
import {Range} from "ace-code";
import {Autocomplete, FilteredList} from "ace-code/src/autocomplete";
import {beautify} from "ace-code/src/ext/beautify";
import {registerCodeLensProvider, setLenses} from "ace-code/src/ext/code_lens";
import {CommandBarTooltip} from "ace-code/src/ext/command_bar";
import {ElasticTabstopsLite} from "ace-code/src/ext/elastic_tabstops_lite";
import {MarkerGroup, MarkerGroupItem} from "ace-code/src/marker_group";
import {HoverTooltip} from "ace-code/src/tooltip";
import {hardWrap} from "ace-code/src/ext/hardwrap";
import {SearchBox} from "ace-code/src/ext/searchbox";

import("ace-code/src/ext/language_tools");
import "../../src/test/mockdom.js";
import {tokenize} from "ace-code/src/ext/simple_tokenizer";
import {JavaScriptHighlightRules} from "ace-code/src/mode/javascript_highlight_rules";
import {highlight} from "ace-code/src/ext/static_highlight";

// TODO this does not work in node
// import "ace-code/esm-resolver";
import { config } from "ace-code";
import {AcePopup} from "ace-code/src/autocomplete/popup";
config.setLoader(async function(moduleName, cb) {
    moduleName = moduleName.replace("ace/", "ace-code/src/")
    let module = await import(moduleName);
    cb(null, module);
});

const editor = ace.edit(null); // should not be an error
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

function configure(config: ace.Ace.Config) {
    config.setDefaultValues("editor", {
        fontSize: 14,
        showPrintMargin: false,
    })
}

configure(ace.config) // should not be a error

Autocomplete.for(editor).getCompletionProvider() // should not be an error

const markerGroup = new MarkerGroup(editor.session);
const markers: MarkerGroupItem[] = [
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

const hover = new HoverTooltip();
hover.setDataProvider((e, editor) => {
    const domNode = document.createElement("div");
    hover.showForRange(editor, new Range(1, 3, 3, 1), domNode, e);
});
hover.addToEditor(editor);

beautify(editor.session);

registerCodeLensProvider(editor, {
    provideCodeLenses: function (session, callback) {
        const lenses = [{
            start: {row: 2, column: 1},
            command: {title: "2"}
        }];
        setTimeout(function () {
            callback(null, [{
                start: {row: 2, column: 1},
                command: {title: "2"}
            }]);

            setLenses(session, lenses);
        });
    }
});

var commandBar = new CommandBarTooltip(editor.container);
var command: ace.Ace.TooltipCommand = {
    name: "test",
    exec: function (editor: ace.Editor) {
        alert(editor.getValue());
    },
    type: "checkbox"
}
commandBar.registerCommand("test", command);

const elasticTabStopLite = new ElasticTabstopsLite(editor);
elasticTabStopLite.processRows([1, 2, 4]);


hardWrap(editor, {
    startRow: 1,
    endRow: 2,
});


const searchBox = new SearchBox(editor);

searchBox.show("Test", true);

tokenize("some content", new JavaScriptHighlightRules());
highlight(editor.container, {
    mode: "ace/mode/abap",
    showGutter: true
})

setTimeout(function() {
    editor.destroy();
}, 20)

function createPopup() {
    const popup = new AcePopup();

    popup.container.style.width = "100%";
    popup.renderer.textarea.setAttribute("tabindex", "-1");
    popup.setSelectOnHover(true);
    return popup;
}

const acePopup = createPopup();
const activeCommand = acePopup.getData(acePopup.getRow());
if (activeCommand && activeCommand.command && activeCommand.command.name) {
    acePopup.setData([]);
}
acePopup.destroy();

const filter = new FilteredList([]);
filter.setFilter("test");

editor.session.startOperation();
editor.session.endOperation();