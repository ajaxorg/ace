"use strict";

import ace from '../../build'
import {Range} from '../../build/'

import jsWorkerUrl from "file-loader!../../build/src-noconflict/worker-javascript";
import jsModeUrl from "file-loader!../../build/src-noconflict/worker-javascript";
ace.config.setModuleUrl("ace/mode/javascript_worker", jsWorkerUrl)
ace.config.setModuleUrl("ace/mode/javascript", jsModeUrl)

import {Mode as JSMode} from "../../build/src-noconflict/mode-javascript"

console.log(Range.fromPoints({row: 0, column: 0}, {row: 0, column: 1}))
console.log(new Range(0,0,0,1))

var editor = ace.edit(null, {
    maxLines: 50,
    minLines: 10,
    value: "var hello = 'world'" + "\n",
    // mode: new JSMode(),
    mode: "ace/mode/javascript",
    bug: 1
})

document.body.appendChild(editor.container)