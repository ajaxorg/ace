"use strict";

require("../test/mockdom");
var trustedTypes = require("./trusted_types");
var assert = require("../test/assertions");

// records the policies created and marks what passed through them
function fakeTrustedTypes(created, refuse) {
    return {
        createPolicy: function(name, rules) {
            if (refuse)
                throw new TypeError("Policy " + name + " disallowed.");
            created.push(name);
            return {
                createHTML: function(html) { return {trustedHTML: rules.createHTML(html)}; },
                createScriptURL: function(url) { return {trustedScriptURL: rules.createScriptURL(url)}; }
            };
        }
    };
}

module.exports = {
    setUp: function() {
        trustedTypes.$resetPolicy();
    },

    tearDown: function() {
        delete window.trustedTypes;
        trustedTypes.$resetPolicy();
    },

    "test: strings pass through unchanged without Trusted Types": function() {
        delete window.trustedTypes;
        assert.equal(trustedTypes.createHTML("<b>x</b>"), "<b>x</b>");
        assert.equal(trustedTypes.createScriptURL("/ace/mode-php.js"), "/ace/mode-php.js");
    },

    "test: one 'ace' policy makes TrustedHTML and TrustedScriptURL values": function() {
        var created = [];
        window.trustedTypes = fakeTrustedTypes(created);
        assert.deepEqual(trustedTypes.createHTML("<b>x</b>"), {trustedHTML: "<b>x</b>"});
        assert.deepEqual(trustedTypes.createScriptURL("/ace/mode-php.js"), {trustedScriptURL: "/ace/mode-php.js"});
        trustedTypes.createHTML("<i>y</i>");
        assert.deepEqual(created, ["ace"]);
    },

    "test: strings pass through when the page doesn't allow the policy name": function() {
        var created = [];
        window.trustedTypes = fakeTrustedTypes(created, true);
        assert.equal(trustedTypes.createHTML("<b>x</b>"), "<b>x</b>");
        assert.equal(trustedTypes.createScriptURL("/ace/mode-php.js"), "/ace/mode-php.js");
        assert.deepEqual(created, []);
    }
};

require("../test/run")(module);
