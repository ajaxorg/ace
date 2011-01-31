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

//require("long-stack-traces");
var copy = require('dryice').copy;

var aceHome = __dirname;

console.log('# ace ---------');

var project = copy.createCommonJsProject([
    aceHome + '/support/pilot/lib',
    aceHome + '/lib',
    aceHome + '/demo'
]);

var ace = copy.createDataObject();
copy({
    source: [
        copy.source.commonjs({
            project: project,
            require: [
                'pilot/plugin_manager',
                'pilot/environment',
                'pilot/index',
                'startup',
            ]
        }),
        'build_support/mini_require.js',
        'build_support/boot.js'
    ],
    filter: [ copy.filter.debug, copy.filter.moduleDefines ],
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

// Create the compressed and uncompressed output files
copy({
    source: ace,
    filter: copy.filter.uglifyjs,
    dest: 'build/ace.js'
});
copy({
    source: ace,
    dest: 'build/ace-uncompressed.js'
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
        }),
    ],
    filter: [ copy.filter.debug, copy.filter.moduleDefines ],
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
    dest: 'build/cockpit.js'
});
copy({
    source: cockpit,
    dest: 'build/cockpit-uncompressed.js'
});

console.log('# conventional ---------');

// Pilot sources
var pilotData = copy.createDataObject();
copy({
    source: {
        root: aceHome + '/support/pilot/lib',
        include: /.*\.js$/,
        exclude: /tests?\//
    },
    filter: [ copy.filter.debug, copy.filter.moduleDefines ],
    dest: pilotData
});

// Cockpit sources
var cockpitData = copy.createDataObject();
copy({
    source: {
        root: aceHome + '/support/cockpit/lib',
        include: /.*\.js$/,
        exclude: /tests?\//
    },
    filter: [ copy.filter.moduleDefines ],
    dest: cockpitData
});
copy({
    source: {
        root: aceHome + '/support/cockpit/lib',
        include: /.*\.css$|.*\.html$/,
        exclude: /tests?\//
    },
    filter: [ copy.filter.addDefines ],
    dest: cockpitData
});
copy({
    source: {
        root: aceHome + '/support/cockpit/lib',
        include: /.*\.png$|.*\.gif$/,
        exclude: /tests?\//
    },
    filter: [ copy.filter.base64 ],
    dest: cockpitData
});

// Ace sources
var aceData = copy.createDataObject();
copy({
    source: [
        // Exclude all themes/modes so we can just include textmate/js
        {
            root: aceHome + '/lib',
            include: /.*\.js$/,
            exclude: /tests?\/|theme\/|mode\/|ace\/worker\/worker\.js/
        },
        { base: aceHome + '/lib/', path: 'ace/theme/textmate.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/text.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/javascript.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/javascript_worker.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/text_highlight_rules.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/javascript_highlight_rules.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/doc_comment_highlight_rules.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/matching_brace_outdent.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/javascript_highlight_rules.js' }
    ],
    filter: [ copy.filter.moduleDefines ],
    dest: aceData
});
copy({
    source: {
        root: aceHome + '/lib',
        include: /tm\.css|editor\.css/,
        exclude: /tests?\//
    },
    filter: [ copy.filter.addDefines ],
    dest: aceData
});

// Piece together the parts that we want
var data = copy.createDataObject();
copy({
    source: [
        'build_support/mini_require.js',
        pilotData,
        // cockpitData,
        aceData,
        'build_support/boot.js'
    ],
    dest: data
});

// Create the compressed and uncompressed output files
copy({
    source: data,
    filter: copy.filter.uglifyjs,
    dest: 'build/old-ace.js'
});
//copy({
//    source: data,
//    dest: 'build/ace-uncompressed.js'
//});

copy({
    source: data,
    dest: 'build/old-ace-uncompressed.js'
});