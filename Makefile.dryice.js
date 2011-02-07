#!/usr/bin/env node
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var copy = require('dryice').copy;

var aceHome = __dirname;

console.log('# ace ---------');

var project = copy.createCommonJsProject([
    aceHome + '/support/pilot/lib',
    aceHome + '/lib',
    aceHome + '/demo'
]);

copy({
    source: "build_support/editor.html",
    dest: 'build/editor.html'
});

var ace = copy.createDataObject();
copy({
    source: [
        'build_support/mini_require.js'
    ],
    dest: ace
});
copy({
    source: [
        copy.source.commonjs({
            project: project,
            require: [
                "pilot/fixoldbrowsers",
                "pilot/index",
                "pilot/plugin_manager",
                "pilot/environment",
                "ace/editor",
                "ace/edit_session",
                "ace/undomanager",
                "ace/theme/textmate",
                "ace/mode/text",
                "ace/mode/matching_brace_outdent",
                "ace/virtual_renderer"
            ]
        })
    ],
    filter: [ copy.filter.moduleDefines ],
    dest: ace
});
copy({
    source: {
        root: project,
        include: /.*\.css$|.*\.html$/,
        exclude: /tests?\//
    },
    filter: [ copy.filter.addDefines ],
    dest: ace
});
copy({
    source: {
        root: project,
        include: /.*\.png$|.*\.gif$/,
        exclude: /tests?\//
    },
    filter: [ copy.filter.base64 ],
    dest: ace
});
copy({
    source: [
        'build_support/boot.js'    
    ],
    dest: ace
});


// Create the compressed and uncompressed output files
copy({
    source: ace,
    filter: copy.filter.uglifyjs,
    dest: 'build/src/ace.js'
});
copy({
    source: ace,
    dest: 'build/src/ace-uncompressed.js'
});

console.log('# cockpit ---------');

project.assmeAllFilesLoaded();
project.addRoot(aceHome + '/support/cockpit/lib');

var cockpit = copy.createDataObject();
copy({
    source: [
        copy.source.commonjs({
            project: project,
            require: [ 'cockpit/index' ]
        })
    ],
    filter: [ copy.filter.moduleDefines ],
    dest: cockpit
});
copy({
    source: {
        root: aceHome + '/support/cockpit/lib',
        include: /.*\.css$|.*\.html$/,
        exclude: /tests?\//
    },
    filter: [ copy.filter.addDefines ],
    dest: cockpit
});
copy({
    source: {
        root: aceHome + '/support/cockpit/lib',
        include: /.*\.png$|.*\.gif$/,
        exclude: /tests?\//
    },
    filter: [ copy.filter.base64 ],
    dest: cockpit
});

// Create the compressed and uncompressed output files
copy({
    source: cockpit,
    filter: copy.filter.uglifyjs,
    dest: 'build/src/cockpit.js'
});
copy({
    source: cockpit,
    dest: 'build/src/cockpit-uncompressed.js'
});


// create modes
project.assmeAllFilesLoaded();

["css", "html", "javascript", "php", "python", "xml", "ruby", "java", "c_cpp"].forEach(function(mode) {
    copy({
        source: [
            copy.source.commonjs({
                project: project,
                require: [ 'ace/mode/' + mode ]
            })
        ],
        filter: [ copy.filter.moduleDefines, copy.filter.uglifyjs ],
        dest: "build/src/mode-" + mode + ".js"
    });
});

// create worker
console.log('# worker ---------');

var jsWorker = copy.createDataObject();
var workerProject = copy.createCommonJsProject([
    aceHome + '/support/pilot/lib',
    aceHome + '/lib'
]);
copy({
    source: [
        copy.source.commonjs({
            project: workerProject,
            require: [
                'pilot/fixoldbrowsers',
                'pilot/event_emitter',
                'pilot/oop',
                'ace/mode/javascript_worker'
            ]
        })
    ],
    filter: [ copy.filter.moduleDefines],
    dest: jsWorker
});
copy({
    source: [
        aceHome + "/lib/ace/worker/worker.js",
        jsWorker
    ],
    filter: [ copy.filter.uglifyjs ],
    dest: "build/src/worker-javascript.js"
});

// create themes
var eclipseTheme = copy.createDataObject();
copy({
    source: [{
        root: aceHome + '/lib',
        include: "ace/theme/eclipse.js"
    }],
    filter: [ copy.filter.moduleDefines ],
    dest: eclipseTheme
});
copy({
    source: [{
        root: aceHome + '/lib',
        include: "ace/theme/eclipse.css"
    }],
    filter: [ copy.filter.addDefines ],
    dest: eclipseTheme
});
copy({
    source: eclipseTheme,
    filter: [ copy.filter.uglifyjs ],
    dest: 'build/src/theme-eclipse.js'
});

[
    "clouds", "clouds_midnight", "cobalt", "dawn", "idle_fingers", "kr_theme", 
    "mono_industrial", "monokai", "pastel_on_dark", "twilight"
].forEach(function(theme) {
    copy({
        source: [{
            root: aceHome + '/lib',
            include: "ace/theme/" + theme + ".js"
        }],
        filter: [ copy.filter.moduleDefines, copy.filter.uglifyjs ],
        dest: "build/src/theme-" + theme + ".js"
    });
});

// copy key bindings
["vim", "emacs"].forEach(function(keybinding) {
    project.assmeAllFilesLoaded();
    copy({
        source: [
            copy.source.commonjs({
                project: project,
                require: [ 'ace/keyboard/keybinding/' + keybinding ]
            })
        ],
        filter: [ copy.filter.moduleDefines, copy.filter.uglifyjs ],
        dest: "build/src/keybinding-" + keybinding + ".js"
    });
});


// copy text files
copy({
    source: aceHome + "/LICENSE",
    dest: 'build/LICENSE'
});
copy({
    source: aceHome + "/Readme.md",
    dest: 'build/Readme.md'
});
copy({
    source: aceHome + "/ChangeLog.txt",
    dest: 'build/ChangeLog.txt'
});

// copy complex demo
//copy({
//    source: aceHome + "/editor.html",
//    filter: [ function(data) {
//        var includes = [
//            "ace", "cockpit",
//            "keybinding-vim", "keybinding-emacs",
//            "mode-javascript", "mode-css", "mode-html", "mode-php", "mode-python",
//            "mode-xml", 
//            "theme-clouds", "theme-clouds_midnight", "theme-cobalt",
//            "theme-dawn", "theme-idle_fingers", "theme-kr_theme", 
//            "theme-mono_industrial", "theme-monokai", "theme-pastel_on_dark",
//            "theme-twilight"
//        ].map(function(module) {
//            return '<script src="src/' + module + '.js" type="text/javascript"></script>';
//        }).join("\n");
//        return (
//            data.replace('<script src="demo/require.js" type="text/javascript" charset="utf-8"></script>', includes)
//                .replace('<script src="demo/boot.js" type="text/javascript"></script>', '<script src="demo/demo.js" type="text/javascript"></script>\n<script>require("demo").launch()</script>')
//        )
//    } ],
//    dest: "build/editor-demo.html"
//});
//copy({    
//    source: [{
//        root: aceHome + '/demo',
//        include: "demo.js"
//    }],
//    filter: [ copy.filter.moduleDefines ],
//    dest: "build/demo/demo.js"
//});
//copy({    
//    source: aceHome + '/demo/styles.css',
//    dest: "build/demo/styles.css"
//});
//copy({    
//    source: aceHome + '/demo/logo.png',
//    dest: "build/demo/logo.png"
//});
