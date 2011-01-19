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

//var copy = require('dryice').copy;
var copy = internalRequire('dryice').copy;

var aceHome = __dirname;

// Pilot sources
var pilot = copy.createDataObject();
copy({
    source: [ {
        root: aceHome + '/support/pilot/lib',
        include: /.*\.js$/,
        exclude: /tests?\//
    } ],
    filter: [ copy.filter.moduleDefines ],
    dest: pilot
});

// Cockpit sources
var cockpit = copy.createDataObject();
copy({
    source: [ {
        root: aceHome + '/support/cockpit/lib',
        include: /.*\.js$/,
        exclude: /tests?\//
    } ],
    filter: [ copy.filter.moduleDefines ],
    dest: cockpit
});
copy({
    source: [ {
        root: aceHome + '/support/cockpit/lib',
        include: /.*\.css$|.*\.html$/,
        exclude: /tests?\//
    } ],
    filter: [ copy.filter.addDefines ],
    dest: cockpit
});
copy({
    source: [ {
        root: aceHome + '/support/cockpit/lib',
        include: /.*\.png$|.*\.gif$/,
        exclude: /tests?\//
    } ],
    filter: [ copy.filter.base64 ],
    dest: cockpit
});

// Ace sources
var ace = copy.createDataObject();
copy({
    source: [
        // Exclude all themes/modes so we can just include textmate/js
        {
            root: aceHome + '/lib',
            include: /.*\.js$/,
            exclude: /tests?\/|theme\/|mode\//
        },
        { base: aceHome + '/lib/', path: 'ace/theme/textmate.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/text.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/javascript.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/text_highlight_rules.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/javascript_highlight_rules.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/doc_comment_highlight_rules.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/matching_brace_outdent.js' },
        { base: aceHome + '/lib/', path: 'ace/mode/javascript_highlight_rules.js' }
    ],
    filter: [ copy.filter.moduleDefines ],
    dest: ace
});
copy({
    source: [ {
            root: aceHome + '/lib',
            include: /tm\.css|editor\.css/,
            exclude: /tests?\//
    } ],
    filter: [ copy.filter.addDefines ],
    dest: ace
});

// Piece together the parts that we want
var data = copy.createDataObject();
copy({
    source: [
        'build_support/mini_require.js',
        pilot,
        // cockpit,
        ace,
        'build_support/boot.js'
    ],
    dest: data
});

copy({
    source: [
        'build_support/editor.html'
    ],
    dest: 'build/editor.html'
});

// Create the compressed and uncompressed output files
copy({
    source: data,
    filter: copy.filter.uglifyjs,
    dest: 'build/ace.js'
});
copy({
    source: data,
    dest: 'build/ace-uncompressed.js'
});





function internalRequire(ignore) {
var exports = {};



var fs = require("fs");
var ujs = require("uglify-js");

/**
 * Dryice is ant for javascript
 * @param obj An object that contains source, dest and (optionally) filter objects
 * source must be one of:
 * - string: a file to read (later a directory too)
 * - a data object like { value:OUTPUT_DATA }
 * - a findObj like { root:DIR, include:RegExp|[RegExp], exclude:RegExp|[RegExp] }
 * - a baseObj like { base:BASE, path:PATH } where BASE+PATH = filename
 *   (this method allows use of commonjs filters)
 * - an array containing entries like the 3 above
 * - a function which returns one of the 4 above
 * dest must be either a string (pointing to a file) or a data object
 */
function copy(obj) {
    // Gather a list of all the input sources
    addSource(obj, obj.source);

    // Concatenate all the input sources
    var value = '';
    obj.sources.forEach(function(source) {
        value += source.value;
    }, this);

    // Run filters where onRead=false
    value = runFilters(value, obj.filter, false);

    // Output
    // TODO: for now we're ignoring the concept of directory destinations.
    if (typeof obj.dest.value === 'string') {
        obj.dest.value += value;
    }
    else if (typeof obj.dest === 'string') {
        fs.writeFileSync(obj.dest, value);
    }
    else {
        throw new Error('Can\'t handle type of dest: ' + typeof obj.dest);
    }
}

function addName(currentName, newName) {
    return currentName === null ? currentName : newName;
}

function addSource(obj, source) {
    if (!obj.sources) {
        obj.sources = [];
    }

    if (typeof source === 'function') {
        addSource(obj, source());
    }
    else if (Array.isArray(source)) {
        source.forEach(function(s) {
            addSource(obj, s);
        }, this);
    }
    else if (source.root) {
        copy.findFiles(obj, source);
    }
    else if (source.base) {
        addSourceBase(obj, source);
    }
    else if (typeof source === 'string') {
        addSourceFile(obj, source);
    }
    else if (typeof source.value === 'string') {
        if (!source.filtered) {
            source.value = runFilters(source.value, obj.filter, true, source.name);
            source.filtered = true;
        }
        obj.sources.push(source);
    }
    else {
        throw new Error('Can\'t handle type of source: ' + typeof source);
    }
}

function addSourceFile(obj, filename) {
    var read = fs.readFileSync(filename);
    obj.sources.push({
        name: filename,
        value: runFilters(read, obj.filter, true, filename)
    });
}

function addSourceBase(obj, baseObj) {
    var read = fs.readFileSync(baseObj.base + baseObj.path);
    obj.sources.push({
        name: baseObj,
        value: runFilters(read, obj.filter, true, baseObj)
    });
}

function runFilters(value, filter, reading, name) {
    if (!filter) {
        return value;
    }

    if (Array.isArray(filter)) {
        filter.forEach(function(f) {
            value = runFilters(value, f, reading, name);
        }, this);
        return value;
    }

    if (filter.onRead == reading) {
        return filter(value, name);
    }
    else {
        return value;
    }
}

/**
 * A holder is an in-memory store of a result of a copy operation.
 * <pre>
 * var holder = copy.createDataObject();
 * copy({ source: 'x.txt', dest: holder });
 * copy({ source: 'y.txt', dest: holder });
 * copy({ source: holder, dest: 'z.txt' });
 * </pre>
 */
copy.createDataObject = function() {
    return { value: '' };
};

/**
 * An object that contains include and exclude object
 */
copy.findFiles = function(obj, findObj) {
    if (!findObj.filter) {
        findObj.filter = createFilterFromRegex(findObj);
    }
    if (!findObj.path) {
        findObj.path = '';
    }

    if (findObj.root.length > 0 && findObj.root.substr(-1) !== '/') {
        findObj.root += '/';
    }
    var path = findObj.path;
    if (path.length > 0 && path.substr(-1) !== '/') {
        path += '/';
    }

    fs.readdirSync(findObj.root + findObj.path).forEach(function(entry) {
        var stat = fs.statSync(findObj.root + path + entry);
        if (stat.isFile()) {
            if (findObj.filter(path + entry)) {
                addSourceBase(obj, {
                    base: findObj.root,
                    path: path + entry
                });
            }
        }
        else if (stat.isDirectory()) {
            findObj.path = path + entry;
            copy.findFiles(obj, findObj);
        }
    }, this);
};

function createFilterFromRegex(obj) {
    return function(path) {
        function noPathMatch(pattern) {
            return !pattern.test(path);
        }
        if (obj.include instanceof RegExp) {
            if (noPathMatch(obj.include)) {
                return false;
            }
        }
        if (typeof obj.include === 'string') {
            if (noPathMatch(new RegExp(obj.include))) {
                return false;
            }
        }
        if (Array.isArray(obj.include)) {
            if (obj.include.every(noPathMatch)) {
                return false;
            }
        }

        function pathMatch(pattern) {
            return pattern.test(path);
        }
        if (obj.exclude instanceof RegExp) {
            if (pathMatch(obj.exclude)) {
                return false;
            }
        }
        if (typeof obj.exclude === 'string') {
            if (pathMatch(new RegExp(obj.exclude))) {
                return false;
            }
        }
        if (Array.isArray(obj.exclude)) {
            if (obj.exclude.some(pathMatch)) {
                return false;
            }
        }

        return true;
    };
}

/**
 * File filters
 */
copy.filter = {};

/**
 * Compress the given input code using UglifyJS.
 *
 * @param string input
 * @return string output
 */
copy.filter.uglifyjs = function(input) {
    if (typeof input !== 'string') {
        input = input.toString();
    }

    var opt = copy.filter.uglifyjs.options;
    var ast = ujs.parser.parse(input, opt.parse_strict_semicolons);

    if (opt.mangle) {
        ast = ujs.uglify.ast_mangle(ast, opt.mangle_toplevel);
    }

    if (opt.squeeze) {
        ast = ujs.uglify.ast_squeeze(ast, opt.squeeze_options);
        if (opt.squeeze_more) {
            ast = ujs.uglify.ast_squeeze_more(ast);
        }
    }

    return ujs.uglify.gen_code(ast, opt.beautify);
};
copy.filter.uglifyjs.onRead = false;
/**
 * UglifyJS filter options.
 */
copy.filter.uglifyjs.options = {
    parse_strict_semicolons: false,

    /**
     * The beautify argument used for process.gen_code(). See the UglifyJS
     * documentation.
     */
    beautify: false,
    mangle: true,
    mangle_toplevel: false,
    squeeze: true,

    /**
     * The options argument used for process.ast_squeeze(). See the UglifyJS
     * documentation.
     */
    squeeze_options: {},

    /**
     * Tells if you want to perform potentially unsafe compression.
     */
    squeeze_more: false
};

/**
 * A filter to munge CommonJS headers
 */
copy.filter.addDefines = function(input, source) {
    if (typeof input !== 'string') {
        input = input.toString();
    }

    if (!source) {
        throw new Error('Missing filename for moduleDefines');
    }

    if (source.base) {
        source = source.path;
    }

    var module = source.replace(/\.css$/, '');

    input = input.replace(/"/g, '\\"');
    input = '"' + input.replace(/\n/g, '" +\n  "') + '"';

    return 'define("text!' + source.toString() + '", ' + input + ');\n\n';
};
copy.filter.addDefines.onRead = true;

/**
 *
 */
copy.filter.base64 = function(input, source) {
    if (typeof input === 'string') {
        throw new Error('base64 filter needs to be the first in a filter set');
    }

    if (!source) {
        throw new Error('Missing filename for moduleDefines');
    }

    if (source.base) {
        source = source.path;
    }

    if (source.substr(-4) === '.png') {
        input = 'data:image/png;base64,' + input.toString('base64');
    }
    else if (source.substr(-4) === '.gif') {
        input = 'data:image/gif;base64,' + input.toString('base64');
    }
    else {
        throw new Error('Only gif/png supported by base64 filter: ' + source);
    }

    return 'define("text!' + source + '", "' + input + '");\n\n';
};
copy.filter.base64.onRead = true;

/**
 *
 */
copy.filter.moduleDefines = function(input, source) {
    if (typeof input !== 'string') {
        input = input.toString();
    }

    if (!source) {
        throw new Error('Missing filename for moduleDefines');
    }

    if (source.base) {
        source = source.path;
    }
    source = source.replace(/\.js$/, '');

    return input.replace(/\bdefine\(\s*function\(require,\s*exports,\s*module\)\s*\{/,
        "define('" + source + "', function(require, exports, module) {");
};
copy.filter.moduleDefines.onRead = true;


exports.copy = copy;











return exports;
};





var sys = require("sys");
var fs = require("fs");
var path = require("path");
var util = require("util");
var Step = require("step");


function copy0(options, callback) {
    var source = options.source;
    var data = "";

    if (typeof source == "function") {
        source = source(options);
    }

    if (typeof source == "string") {
        source = [source];
    } else if (typeof options.source == "object") {
        data = source.value || "";
    }

    var filters = options.filter || [];
    if (typeof filters == "function") {
        filters = [filters];
    }

    if (typeof dest == "string") {
        var stat = fs.statSync();
    }

    // read the files
    if (Array.isArray(source)) {
        source.forEach(function(file) {
            var stat = fs.statSync(file);
            var result = fs.readFileSync(file);

            // execute the filters
            filters.forEach(function(filter) {
                filter(input, file);
            });

            data += result + "\n";
        });
    }

    // save the output
    var dest = options.dest;
    if (typeof dest == "string") {
        fs.writeFileSync(dest, data);
    } else {
        dest.value = data;
    }
}


var Builder = function Builder(appFolder) {
    this.appFolder = appFolder;
};

Builder.prototype = {
    DEBUG: false,

    /**
     * Web application folder - the location where scripts, styles and resources
     * are fetched from.
     */
    appFolder: ".",

    /**
     * Target build folder - the location where the packaged web application is
     * saved to.
     */
    buildFolder: "./build",

    /**
     * The default folder and file modes (permissions for chmod).
     */
    folderMode: 0755,
    fileMode: 0644,

    /**
     * Array holding regular expression patterns. When you add entire folders to
     * your build you might want to skip certain files.
     */
    ignoreFiles: [],

    log: sys.puts,

    debug: function(message) {
        if (this.DEBUG) {
            this.log(message);
        }
    },

    /**
     * Sets and creates the target build folder, asynchronously.
     *
     * @param string folder
     *        Tells the target folder where you want to save the packaged web
     *        application.
     *
     * @param function callback
     *        The callback you want executed after the folder is created.
     *        Callback arguments:
     *          string|Exception|Error error - Holds the error that occurred
     *          while trying to set the build folder. This is undefined|null
     *          when the operation was successful.
     *
     *          Builder build - holds a reference to the build instance.
     */
    setBuildFolder: function Builder_setBuildFolder(newFolder, callback)
    {
        var self = this;

        Step(
            function checkFolder() {
                path.exists(newFolder, this);
            },

            function makeFolder(exists) {
                if (!exists) {
                    fs.mkdir(newFolder, self.folderMode, this);
                } else {
                    return true;
                }
            },

            function folderReady(err) {
                if (!err) {
                    self.buildFolder = newFolder;
                }
                callback(err, self);
            }
        );
    },

    /**
     * Copy files from the web application folder to the target build folder.
     *
     * @param object|array|string aFiles
     *        Holds the list of files you want to copy to the target build
     *        folder. If this is a string, you copy only one file. If the
     *        argument is given as an object, keys are considered source files
     *        and values are considered target files - this allows you to copy
     *        files to different locations in the build folder, without
     *        maintaining the same structure as in the original folder.
     * @param function callback
     *        The callback you want executed after the files are copied. The
     *        callback arguments are the same as for setBuildFolder().
     * @returns void
     */
    copyFiles: function Builder_copyFiles(aFiles, callback)
    {
        var files = {};
        if (typeof aFiles == "string") {
            files[aFiles] = aFiles;
        } else if (Array.isArray(aFiles)) {
            aFiles.forEach(function(file) {
                files[file] = file;
            });
        } else {
            files = aFiles;
        }

        var self = this;

        Step(
            function copyFiles() {
                var group = this.group();
                for (var file in files) {
                    fs_copyFile(self.appFolder + "/" + file,
                                self.buildFolder + "/" + files[file],
                                group());
                }
            },

            function filesReady(err) {
                callback(err, self);
            }
        );
    },

    /**
     * Copy folders from the web application folder to the target build folder.
     *
     * @param object|array|string aFolders
     *        Holds the list of folders you want to copy to the target build
     *        folder. If this is a string, you copy only one folder. If the
     *        argument is given as an object, keys are considered source folders
     *        and values are considered target folders - this allows you to copy
     *        folders to different locations in the build folder, without
     *        maintaining the same structure as in the original folder.
     * @param function callback
     *        The callback you want executed after the folders are copied. The
     *        callback arguments are the same as for setBuildFolder().
     * @param boolean [recursive=true]
     *        (Optional) True if you want to copy subfolders as well, false if
     *        you want to copy only the files contained in the folders given.
     *        Default is true.
     * @returns void
     */
    copyFolders: function Builder_copyFolders(aFolders, callback, recursive)
    {
        var folders = {};
        if (typeof aFolders == "string") {
            folders[aFolders] = aFolders;
        } else if (Array.isArray(aFolders)) {
            folders.forEach(function(folder) {
                folders[folder] = folder;
            });
        } else {
            folders = aFolders;
        }
        if (typeof recursive == "undefined") {
            recursive = true;
        }

        var self = this;

        Step(
            function copyFolders() {
                var group = this.group();
                for (var folder in folders) {
                    self.copyFolder(folder, folders[folder], group(), recursive);
                }
            },
            function foldersReady(err) {
                callback(err, self);
            }
        );
    },

    /**
     * Copy one folder from the web application folder to the target build
     * folder.
     *
     * @param string source
     *        The folder you want to copy.
     * @param string [destination=source]
     *        The destination folder. By default this is the same as the source,
     *        but in the buildFolder. You can change the destination, relative
     *        to the buildFolder.
     * @param function callback
     *        The callback you want executed after the folder is copied. The
     *        callback arguments are the same as for setBuildFolder().
     * @param boolean [recursive=true]
     *        (Optional) True if you want to copy the subfolders as well, false
     *        if you want to copy only the files contained in the given source
     *        folder. Default is true.
     * @returns void
     */
    copyFolder: function Builder_copyFolder()
    {
        var source, destination, recursive, callback;
        switch (arguments.length) {
            case 2: // source, callback
                source = destination = arguments[0];
                callback = arguments[1];
                recursive = true;
                break;
            case 3:
                // source, callback, recursive
                // OR source, destination, callback
                source = arguments[0];
                if (typeof arguments[1] == "function") {
                    destination = source;
                    callback = arguments[1];
                    recursive = arguments[2];
                } else {
                    destination = arguments[1];
                    callback = arguments[2];
                    recursive = true;
                }
                break;
            case 4: // source, destination, callback, recursive
                source = arguments[0];
                destination = arguments[1];
                callback = arguments[2];
                recursive = arguments[3];
                break;
            default:
                throw new Error("Invalid arguments.");
        }

        var self = this;

        // result from fs.readdir(), without . and ..
        var readdir_files = [];

        var files = [];
        var subfolders = [];

        Step(
            function checkDestination() {
                path.exists(self.buildFolder + "/" + destination, this);
            },

            function mkdir_destination(exists) {
                if (!exists) {
                    fs.mkdir(self.buildFolder + "/" + destination, this);
                } else {
                    return true;
                }
            },

            function readdir_source(err) {
                if (err) {
                    throw err;
                }

                // find the files in the given source folder.
                fs.readdir(self.appFolder + "/" + source, this);
            },

            function statFiles(err, result) {
                if (err) {
                    throw err;
                }

                var group = this.group();
                result.forEach(function(file) {
                    if (file != "." && file != ".." &&
                        !self.shouldSkipFile("/" + source + "/" + file)) {
                        fs.stat(file, group());
                        readdir_files.push(file);
                    }
                });
            },

            function copyFiles(err, stats) {
                if (err) {
                    throw err;
                }

                // separate files out from folders
                stats.forEach(function(stat, index) {
                    if (stat.isDirectory()) {
                        subfolders.push(readdir_files[index]);
                    } else if (stat.isFile()) {
                        files.push(readdir_files[index]);
                    }
                });

                // copy the files
                var group = this.group();
                files.forEach(function(file) {
                    fs_copyFile(self.appFolder + "/" + source + "/" + file,
                                self.buildFolder + "/" + destination + "/" + file,
                                group());
                });
            },

            function copySubfolders(err) {
                if (err) {
                    throw err;
                }

                if (!recursive) {
                    return true;
                }

                var group = this.group();
                subfolders.forEach(function(folder) {
                    self.copyFolder(source + "/" + folder,
                                    destination + "/" + folder,
                                    group(), true);
                });
            },

            function copyDone(err) {
                callback(err, self);
            }
        );
    },

    /**
     * Tells if this builder should ignore a file, given the file name. The
     * this.ignoreFiles array of regular expression patterns is used.
     *
     * @param string filename
     * @returns boolean
     *          True if the file should be ignored, or false otherwise.
     */
    shouldSkipFile: function Builder_shouldSkipFile(filename)
    {
        return this.ignoreFiles.some(function(pattern) {
            return pattern.test(filename);
        });
    }
};

Builder.executeManifest = function Builder_executeManifest(manifest, callback) {
    return; // stub
};

var Script = function Script(build, filename) {
    if (!build) {
        throw new Error("The first argument must reference a dryice.Builder instance.");
    } else if (!filename) {
        throw new Error("The second argument must be the script file name.");
    }

    this.build = build;
    this.filename = filename;
};

Script.prototype = {
    inputEncoding: "utf8",
    outputEncoding: "utf8",

    /**
     * List of functions or filter names that process each input file.
     */
    inputFilters: [],

    /**
     * List of functions or filter names that process the concatenated output
     * file.
     */
    outputFilters: [],

    /**
     * Add files to the compiled script.
     *
     * @param array|string files
     * @param function callback
     * @returns void
     */
    addFiles: function Builder_addFiles(files, callback) {
        if (typeof files == "string") {
            files = [files];
        }

        var self = this;

        Step(
            function readFiles() {
                var group = this.group();

                files.forEach(function(file) {
                    fs.readFile(self.build.appFolder + "/" + file,
                                self.inputEncoding, group());
                });
            },

            function filterFiles(err, data) {
                if (err) {
                    throw err;
                }

                for (var i = 0; i < data.length; i++) {
                    data[i] = self.executeFilters(self.inputFilters, data[i],
                                                  files[i]);
                }

                self.output += data.join("\n");

                return self;
            },

            callback
        );
    },

    run: function Builder_run(buildCallback) {
        var self = this;

        Step(
            function readFiles() {
                var group = this.group();

                self.input_files.forEach(function(file) {
                    fs.readFile(self.basedir + "/" + file,
                                self.input_encoding, group());
                });
            },

            function filterInput(err, files) {
                if (err) {
                    throw err;
                }

                for (var i = 0; i < files.length; i++) {
                    files[i] = self.run_filters(self.input_filters, files[i],
                                                self.input_files[i]);
                }

                return files;
            },

            function postProcessOutput(err, output) {
                if (err) {
                    throw err;
                }

                output = output.join("\n");
                output = self.run_filters(self.output_filters, output);

                if (typeof self.output_file == "string") {
                    fs.writeFile(self.basedir + "/" + self.output_file,
                                 output, self.output_encoding, this);
                } else {
                    self.output_file.write(output);
                    self.output_file.end();
                    return 1;
                }
            },

            function buildComplete(err) {
                buildCallback(err, self);
            }
        );
    },

    /**
     * Given an array of filters (functions or filter names), invoke these
     * filters on the given input content.
     *
     * @param array filters
     * @param string input
     * @param string [filename]
     *        Optional filename, useful for some filters.
     * @return string
     *         Final filtered output.
     */
    executeFilters: function(filters, input, filename) {
        filters.forEach(function(filter) {
            if (typeof filter == "string") {
                input = input_filters[filter].call(this, input, filename);
            } else {
                input = filter.call(this, input, filename);
            }
        }, this);
        return input;
    }
};


