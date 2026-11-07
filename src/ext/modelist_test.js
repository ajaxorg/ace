"use strict";

var assert = require("assert");
var modelist = require("./modelist");

module.exports = {
    "test modelist includes existing syntax modes": function() {
        ["applescript", "csp", "plain_text", "redshift"].forEach(function(name) {
            var mode = modelist.modesByName[name];
            assert.ok(mode, name + " should be present in modesByName");
            assert.equal(mode.mode, "ace/mode/" + name);
            assert.ok(modelist.modes.indexOf(mode) !== -1, name + " should be present in modes");
        });
    }
};

require("../test/run")(module);
