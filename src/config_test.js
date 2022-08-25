if (typeof process !== "undefined") {
    require("amd-loader");
}

"use strict";

var dom = require("./config");
var config = require("./config");
var assert = require("./test/assertions");

module.exports = {

    "test: path resolution" : function() {
        config.set("packaged", "true");
        var url = config.moduleUrl("kr_theme", "theme");
        assert.equal(url, "theme-kr_theme.js");
        
        config.set("basePath", "a/b");
        url = config.moduleUrl("m/theme", "theme");
        assert.equal(url, "a/b/theme-m.js");
        
        url = config.moduleUrl("m/theme", "ext");
        assert.equal(url, "a/b/ext-theme.js");
        
        config.set("workerPath", "c/");
        url = config.moduleUrl("foo/1", "worker");
        assert.equal(url, "c/worker-1.js");
        
        config.setModuleUrl("foo/1", "a/b1.js");
        url = config.moduleUrl("foo/1", "theme");
        assert.equal(url, "a/b1.js");
        
        url = config.moduleUrl("snippets/js");
        assert.equal(url, "a/b/snippets/js.js");
        
        config.setModuleUrl("snippets/js", "_.js");
        url = config.moduleUrl("snippets/js");
        assert.equal(url, "_.js");
        
        url = config.moduleUrl("ace/ext/textarea");
        assert.equal(url, "a/b/ext-textarea.js");        
    },
    "test: define options" : function() {
        var o = {};
        config.defineOptions(o, "test_object", {
            opt1: {
                set: function(val) {
                    this.x = val;
                },
                value: 7
            },
            initialValue: {
                set: function(val) {
                    this.x = val;
                },
                initialValue: 8
            },
            opt2: {
                get: function(val) {
                    return this.x;
                }
            },
            forwarded: "model"
        });
        o.model = {};
        config.defineOptions(o.model, "model", {
            forwarded: {value: 1}
        });
        
        config.resetOptions(o);
        config.resetOptions(o.model);
        assert.equal(o.getOption("opt1"), 7);
        assert.equal(o.getOption("opt2"), 7);
        o.setOption("opt1", 8);
        assert.equal(o.getOption("opt1"), 8);
        assert.equal(o.getOption("opt2"), 8);
        
        assert.equal(o.getOption("forwarded"), 1);
        
        assert.equal(o.getOption("new"), undefined);
        o.setOption("new", 0);
        assert.equal(o.getOption("new"), undefined);
        

        assert.equal(o.getOption("initialValue"), 8);
        o.setOption("initialValue", 7);
        assert.equal(o.getOption("opt2"), 7);
        
        config.setDefaultValues("test_object", {
            opt1: 1,
            forwarded: 2
        });
        config.resetOptions(o);
        assert.equal(o.getOption("opt1"), 1);
        assert.equal(o.getOption("forwarded"), 2);
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
