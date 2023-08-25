"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import ace
var build_1 = require("../../build");
// import Range from ace (it is also available as ace.Range)
var build_2 = require("../../build/");
// import modes that you want to include into your main bundle
require("../../build/src-noconflict/mode-javascript");
// import webpack resolver to dynamically load modes, you need to install file-loader for this to work!
require("../../build/webpack-resolver");
// if you want to allow dynamic loading of only a few modules use setModuleUrl for each of them manually
/*
import jsWorkerUrl from "file-loader!../../build/src-noconflict/worker-javascript";
ace.config.setModuleUrl("ace/mode/javascript_worker", jsWorkerUrl)
*/
var editor = build_1.default.edit(null, {
    maxLines: 50,
    minLines: 10,
    value: "var hello = 'world'" + "\n",
    mode: "ace/mode/javascript",
    bug: 1
});
editor.selection.setRange(new build_2.Range(0, 0, 0, 3));
document.body.appendChild(editor.container);
