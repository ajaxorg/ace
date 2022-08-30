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

# update_deps.js
To update `jshint` to new version:
1. Clone last version from https://github.com/jshint/jshint
2. Replace all `lodash` with `underscore` in requires in `jshint/src/*.js`
3. Add `_.slice = require("lodash.slice");` to `src/scope-manager.js` after `var _ = ...`
4. Add `_.clone = require("lodash.clone");` to `src/jshint.js` after `var _ = ...`
5. Add ```  
   "underscore": latest
   "lodash.clone": "^4.5.0",
   "lodash.slice": "^4.2.0"
   ``` to `package.json`, remove `lodash` and run `npm i`
6. Change in `ace/tool/update_deps.js` jshint path `deps.jshint.browserify.path` with your path to changed jshint
7. Run `node update_deps.js jshint`