import * as ace from "ace-code";

(globalThis as {document: Object}).document = {}
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
