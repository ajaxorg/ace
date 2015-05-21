Helper Scripts for Ace
======================

To use this you need to install node.js. and run `npm install` in this directory.


# add_mode.js

  Run 
```
node add_mode.js ModeName "extension1|extension2|^FullName"
```
  to create all the files needed for a new mode named `ModeName` 
  this adds stubs for:
    `ace/mode/mode_name.js`
    `ace/mode/mode_name_hightlight_rules.js`
    `ace/snippets/mode_name.js`
    `ace/demo/kitchen_sink/docs/mode_name.extension1`
  and adds entry for the new mode to `ace/ext/modelist.js`
 
 
# tmlanguage.js

```
node tmlanguage.js ./templates/dummy.JSON-tmLanguage
```