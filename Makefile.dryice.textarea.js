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
 *      Julian Viereck <julian.viereck@gmail.com>
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

function shadow(input) {
    if (typeof input !== 'string') {
        input = input.toString();
    }

    return input.replace(/define\(/g, "__ace_shadowed__.define(");
}

console.log('# ace ---------');

var project = copy.createCommonJsProject([
    aceHome + '/support/pilot/lib',
    aceHome + '/lib'
]);

copy({
    source: "build_support/editor_textarea.html",
    dest: 'build/textarea/editor.html'
});

var ace = copy.createDataObject();
copy({
    source: [
        'build_support/mini_require_textarea.js'
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
        'build_support/boot_textarea.js'
    ],
    dest: ace
});

// Create the compressed and uncompressed output files
copy({
    source: ace,
    filter: [
        shadow,
        copy.filter.uglifyjs
    ],
    dest: 'build/textarea/src/ace.js'
});
copy({
    source: ace,
    filter: [
        shadow
    ],
    dest: 'build/textarea/src/ace-uncompressed.js'
});

console.log('# ace modes ---------');

// create modes
project.assumeAllFilesLoaded();
[
    "css", "html", "javascript", "php", "python", "xml", "ruby", "java", "c_cpp",
    "coffee", "perl", "svg"
].forEach(function(mode) {
    console.log("mode " + mode);
    copy({
        source: [
            copy.source.commonjs({
                project: project.clone(),
                require: [ 'ace/mode/' + mode ]
            })
        ],
        filter: [
            copy.filter.moduleDefines,
            shadow,
            copy.filter.uglifyjs
        ],
        dest: "build/textarea/src/mode-" + mode + ".js"
    });
});

console.log('# ace themes ---------');

// create themes
[
    "clouds", "clouds_midnight", "cobalt", "dawn", "idle_fingers", "kr_theme",
    "mono_industrial", "monokai", "pastel_on_dark", "twilight", "eclipse",
    "merbivore", "merbivore_soft", "vibrant_ink"
].forEach(function(theme) {
    console.log("theme " + theme);
    copy({
        source: [{
            root: aceHome + '/lib',
            include: "ace/theme/" + theme + ".js"
        }],
        filter: [
            copy.filter.moduleDefines,
            shadow,
            copy.filter.uglifyjs
        ],
        dest: "build/textarea/src/theme-" + theme + ".js"
    });
});

console.log('# License | Readme | Changelog ---------');
