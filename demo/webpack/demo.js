"use strict";

import ace from '../../build'
import {Range} from '../../build'
console.log(Range)

console.log(new ace.Range(0,0,1,1));


var editor = ace.edit(null, {
    maxLines: 50,
    minLines: 10,
    value: "hello world",
    mode: "ace/mode/javascript"
})

document.body.appendChild(editor.container)

console.log("12345")



