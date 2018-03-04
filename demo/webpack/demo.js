"use strict";


import ace from '../../build/src-noconflict/ace.js'
import {Range} from '../../build/src-noconflict/ace.js'
console.log(Range)

console.log(ace)


var editor = ace.edit(null, {
    maxLines: 50,
    minLines: 10,
    value: "hello world",
    mode: "ace/mode/javascript"
})

document.body.appendChild(editor.container)

console.log("12345")