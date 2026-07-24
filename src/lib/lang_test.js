/*global Intl*/
"use strict";

var lang = require("./lang");
var assert = require("../test/assertions");

module.exports = {
    "test: mayContainGraphemeClusters": function() {
        assert.equal(lang.mayContainGraphemeClusters("plain ascii"), false);
        assert.equal(lang.mayContainGraphemeClusters("中文"), false);
        assert.equal(lang.mayContainGraphemeClusters("\u{1F600}"), true); // astral
        assert.equal(lang.mayContainGraphemeClusters("à"), true); // combining mark
        assert.equal(lang.mayContainGraphemeClusters("ำ"), true); // thai sara am
        assert.equal(lang.mayContainGraphemeClusters("1️⃣"), true); // keycap
    },

    "test: getGraphemeBoundaries": function() {
        assert.equal(lang.getGraphemeBoundaries("").join(","), "0");
        assert.equal(lang.getGraphemeBoundaries("ab").join(","), "0,1,2");
        assert.equal(lang.getGraphemeBoundaries("a\u{1F600}b").join(","), "0,1,3,4");
        assert.equal(lang.getGraphemeBoundaries("àé").join(","), "0,2,4");
        // repeated calls return the memoized array
        var text = "memo \u{1F600} me";
        var first = lang.getGraphemeBoundaries(text);
        assert.ok(first === lang.getGraphemeBoundaries(text));
        // cache eviction keeps results correct
        for (var i = 0; i < 12; i++)
            lang.getGraphemeBoundaries("evict" + i + "\u{1F600}");
        assert.equal(lang.getGraphemeBoundaries(text).join(","), "0,1,2,3,4,5,7,8,9,10");
    },

    "test: getGraphemeCluster": function() {
        var cluster = lang.getGraphemeCluster("a\u{1F600}b", 2);
        assert.equal(cluster.start, 1);
        assert.equal(cluster.end, 3);
        assert.equal(lang.getGraphemeCluster("ab", 5), null);
    },

    "test: forEachGrapheme visits clusters and honors early exit": function() {
        var visited = [];
        lang.forEachGrapheme("a\u{1F600}b", function(start, end) {
            visited.push(start + "-" + end);
        });
        assert.equal(visited.join(","), "0-1,1-3,3-4");

        visited = [];
        lang.forEachGrapheme("abcdef", function(start, end) {
            visited.push(start);
            if (visited.length == 2) return false;
        });
        assert.equal(visited.join(","), "0,1");
    },

    "test: countGraphemes": function() {
        assert.equal(lang.countGraphemes(""), 0);
        assert.equal(lang.countGraphemes("abc"), 3);
        assert.equal(lang.countGraphemes("\u{1F600}\u{1F600}"), 2);
        assert.equal(lang.countGraphemes("\u{1F468}‍\u{1F469}‍\u{1F467}‍\u{1F466}"), 1);
    },

    "test: fallback paths without Intl.Segmenter": function() {
        var segmenter = Intl["Segmenter"];
        delete Intl["Segmenter"];
        var path = require.resolve("./lang");
        var cached = require.cache[path];
        delete require.cache[path];
        try {
            var fallbackLang = require("./lang");
            // surrogate pairs still form single clusters
            assert.equal(fallbackLang.getGraphemeBoundaries("a\u{1F600}b").join(","), "0,1,3,4");
            assert.equal(fallbackLang.countGraphemes("\u{1F600}\u{1F600}c"), 3);
            assert.equal(fallbackLang.getGraphemeCluster("ab", 1), null);
            var visited = [];
            fallbackLang.forEachGrapheme("a\u{1F600}b", function(start, end) {
                visited.push(start + "-" + end);
                if (visited.length == 2) return false;
            });
            assert.equal(visited.join(","), "0-1,1-3");
        } finally {
            Intl["Segmenter"] = segmenter;
            delete require.cache[path];
            require.cache[path] = cached;
        }
    }
};

require("../test/run")(module);
