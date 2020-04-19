if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

require("../test/mockdom");
var Mode = require("../mode/html").Mode;
var ace = require("../ace");
var assert = require("assert");
require("./emmet");

module.exports = {
    "test doesn't break tab when emmet is not loaded": function() {
        var editor = ace.edit(null, {
            mode: new Mode(),
            enableEmmet: true,
            useSoftTabs: false
        });
        
        window.emmet = null;
        editor.onCommandKey({}, 0, 9);
        assert.equal(editor.getValue(), "\t");
        
        try {
            var called = 0;
            window.emmet = {
                actions: {
                    run: function() {
                        called++;
                    }
                },
                resources: {
                    setVariable: function() {
                        called++;
                    }
                }
            };
            editor.onCommandKey({}, 0, 9);
            assert.equal(called, 2);
        } finally {
            window.emmet = null;
        }
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
