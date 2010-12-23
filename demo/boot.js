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
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Kevin Dangoor (kdangoor@mozilla.com)
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

/*
setupPlugins(function(plugin_manager, settings) {
  var data = { env: { settings: settings } };
  plugin_manager.catalog.startupPlugins(data, plugin_manager.REASONS.APP_STARTUP).then(function() {
    var demo_startup = require("demo_startup");
    demo_startup.launch(data.env);
  });
});

// TODO: Yuck! A global function
var setupPlugins = function(callback) {
    var config = {
      pluginDirs: {
        "../demo": {
          singleFiles: ["demo_startup"]
        }
      }
    };

    if (!config.pluginDirs) {
        config.pluginDirs = {};
    }
    // config.pluginDirs["../lib"] = {
    //     packages: ["ace"]
    // };
    config.pluginDirs["../support/cockpit/support/pilot/lib"] = {
        packages: [ "pilot" ]
    };
    config.pluginDirs["../support/cockpit/lib"] = {
        packages: [ "cockpit" ]
    };

    var knownPlugins = [];

    var pluginPackageInfo = {
        "../lib": [
            {
                name: "ace",
                lib: "."
            }
        ]
    };

    var paths = {};
    var i;
    var location;

    // we need to ensure that the core plugin directory is loaded first
    var pluginDirs = [];
    var pluginDir;
    for (pluginDir in config.pluginDirs) {
        pluginDirs.push(pluginDir);
    }
    pluginDirs.sort(function(a, b) {
        if (a == "../plugins") {
            return -1;
        } else if (b == "../plugins") {
            return 1;
        } else if (a < b) {
            return -1;
        } else if (b < a) {
            return 1;
        } else {
            return 0;
        }
    });

    // set up RequireJS to know that our plugins all have a main module called "index"
    for (var dirNum = 0; dirNum < pluginDirs.length; dirNum++) {
        pluginDir = pluginDirs[dirNum];
        var dirInfo = config.pluginDirs[pluginDir];
        if (dirInfo.packages) {
            location = pluginPackageInfo[pluginDir];
            if (location === undefined) {
                pluginPackageInfo[pluginDir] = location = [];
            }
            var packages = dirInfo.packages;
            for (i = 0; i < packages.length; i++) {
                location.push({
                    name: packages[i],
                    main: "index",
                    lib: "."
                });
                knownPlugins.push(packages[i] + "/index");
            }
        }
        if (dirInfo.singleFiles) {
            for (i = 0; i < dirInfo.singleFiles.length; i++) {
                var pluginName = dirInfo.singleFiles[i];
                paths[pluginName] = pluginDir + "/" + pluginName;
                knownPlugins.push(pluginName);
            }
        }
    }
    require({
        packagePaths: pluginPackageInfo,
        paths: paths
    });
    require(["pilot/fixoldbrowsers", "pilot/plugin_manager", "pilot/settings"], function() {
        var pluginsModule = require("pilot/plugin_manager");
        var settings = require("pilot/settings").settings;
        var catalog = pluginsModule.catalog;
        catalog.registerPlugins(knownPlugins).then(function() {
            if (callback) {
                callback(pluginsModule, settings);
            }
        });
    });
};
*/

var config = {
    packagePaths: {
        "../lib": [
            { name:"ace", lib: "." }
        ],
        "../support/cockpit/lib": [
            { name: "cockpit", main: "index", lib: "." }
        ],
        "../support/cockpit/support/pilot/lib": [
            { name: "pilot", main: "index", lib: "." }
        ]
    },
    paths: { demo_startup: "../demo/demo_startup" }
};

var deps = [ "pilot/fixoldbrowsers", "pilot/plugin_manager", "pilot/settings",
             "pilot/environment", "demo_startup" ];

require(config, deps, function() {
    var catalog = require("pilot/plugin_manager").catalog;
    var REASON_START = require("pilot/plugin_manager").REASONS.APP_STARTUP;
    var settings = require("pilot/settings").settings;

    catalog.registerPlugins([ "pilot/index", "cockpit/index" ]).then(function() {
        var env = require("pilot/environment").create();
        catalog.startupPlugins({ env:env }, REASON_START).then(function() {
          require("demo_startup").launch(env);
        });
    });
});
