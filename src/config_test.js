if (typeof process !== "undefined") {
    require("amd-loader");
}

"use strict";

var config = require("./config");
var assert = require("./test/assertions");

module.exports = {

    "test: path resolution" : function(done) {
        config.set("packaged", true);
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
        config.set("packaged", false);
        
        /* global Promise*/
        var callback = () => Promise.resolve("success");
        config.setModuleLoader("ace/test-module", callback);
        assert.equal(config.dynamicModules["ace/test-module"], callback);
        config.loadModule("ace/test-module", (module) => {
            assert.equal(module, "success");
            done();
        });
    },
    "test: nls": function() {
        var nls = config.nls;
        config.setMessages({
            foo: "hello world of $1",
            test_key: "hello world for test key",
            test_with_curly_brackets: "hello world $0 of {1} and $2 to the {3} degree"
        });
        assert.equal(nls("untranslated_key","bar $1"), "bar $1");
        assert.equal(nls("untranslated_key", "bar"), "bar");
        assert.equal(nls("untranslated_key_but_translated_default_string", "foo"), "hello world of $1");
        assert.equal(nls("untranslated_key_but_translated_default_string", "foo", {1: "goo"}), "hello world of goo");
        assert.equal(nls("untranslated_key", "$0B is $1$$", [0.11, 22]), "0.11B is 22$");
        assert.equal(nls("untranslated_key_but_translated_default_string", "foo", {1: "goo"}), "hello world of goo");
        assert.equal(nls("test_key", "this text should not appear"), "hello world for test key");
        assert.equal(nls("test_with_curly_brackets", "hello world $0 of {1} and $2 to the {3} degree", ["foo", "bar", "yay", "third"]), "hello world foo of bar and yay to the third degree");
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
