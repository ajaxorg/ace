"use strict";

import ace from '../../build'
import {Range} from '../../build/'

console.log(Range.fromPoints({row: 0, column: 0}, {row: 0, column: 1}))
console.log(new Range(0,0,0,1))

var editor = ace.edit(null, {
    maxLines: 50,
    minLines: 10,
    value: "hello world",
    mode: "ace/mode/javascript",
    bug: 1
})

document.body.appendChild(editor.container)