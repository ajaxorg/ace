var https = require("https")
  , http = require("http")
  , url = require("url")
  , fs = require("fs");

var Path = require("path");
var spawn = require("child_process").spawn;
var async = require("asyncjs");
var rootDir = __dirname + "/../lib/ace/";

var deps = {
    csslint: {
        path: "mode/css/csslint.js",
        url: "https://raw.github.com/stubbornella/csslint/master/release/csslint.js",
        needsFixup: true
    }, 
    requirejs: {
        path: "../../demo/kitchen-sink/require.js",
        url: "https://raw.github.com/jrburke/requirejs/master/require.js",
        needsFixup: false
    },
    luaparse: {
        path: "mode/lua/luaparse.js",
        url: "https://raw.github.com/oxyc/luaparse/master/luaparse.js",
        needsFixup: true,
        postProcess: function(src) {
            return src.replace(
                /\(function\s*\(root,\s*name,\s*factory\)\s*{[\s\S]*?}\(this,\s*'luaparse',/,
                "(function (root, name, factory) {\n   factory(exports)\n}(this, 'luaparse',"
            )
        }
    },
    jshint: {
        path: "mode/javascript/jshint.js",
        url: "http://jshint.com/get/jshint-2.1.9.js",
        fetch: function(_, cb) {
            //run("npm install jshint@latest", function() {
                var base = Path.join(__dirname, "/node_modules/jshint/")
                var path = Path.join(base, "/src/stable/jshint")
                run('browserify ' + path + ' -i console-browserify -r jshint', function(err, src) {
                    src = replaceConsoleBrowserify(src);
                    var version = JSON.parse(fs.readFileSync(base + "package.json")).version
                    src = [ "// " + version,
                        "var JSHINT;",
                        "(function () {",
                        "require = null;",
                        src,
                        "JSHINT = require('jshint').JSHINT;",
                        "}());"
                    ].join("\n")
                    cb(err, src);
                })
            //});
        },
        needsFixup: true,
        postProcess: function(src) {
            src = src.replace(/(\],|\{)((?:\d+|"\w+"):\[)/g, "$1\n$2")
                .replace(/^(\},)(\{[^{}\[\]]*?\}\])/gm, "$1\n$2")

            src = src.replace(
                /"Expected a conditional expression and instead saw an assignment."/g,
                '"Assignment in conditional expression"'
            );

            src = src.replace(/\brequire\(["']|\(require,|\(require\)/g, function(r){
                return r.replace("require", "req");
            })

            src = src.replace(/var defaultMaxListeners = 10;/, function(a) {return a.replace("10", "200")});

            src = src.replace(/var JSHINT;\s*\(function[\s()]+\{\s*/, "")
                .replace(/JSHINT = .*\n\s*\}\(\)\);\s*/, "");
            src += '\n'
                + 'function req() {return require.apply(this, arguments)}\n'
                + 'module.exports = req("jshint");\n';
            return src;
        }
    }, 
    emmet: {
        path: "ext/emmet core.js",
        url: [
            "https://raw.github.com/sergeche/emmet-sublime/master/emmet/emmet-app.js",
            "https://raw.github.com/sergeche/emmet-sublime/master/emmet/snippets.json"
        ],
        postProcess: function(data) {
            return data[0]
                .replace("define(emmet)", "define('emmet', [], emmet)")
                .replace(/(emmet.define\('bootstrap'.*)[\s\S]*$/, function(_, x) {
                    return x + "\n" +
                        "var snippets = " + data[1] + ";\n" +
                        "var res = require('resources');\n" +
                        "var userData = res.getVocabulary('user') || {};\n" +
                        "res.setVocabulary(require('utils').deepMerge(userData, snippets), 'user');\n" +
                        "});";
            });
        }
    },
    coffee: {
        fetch: function(){
            var rootHref = "https://raw.github.com/jashkenas/coffee-script/master/";
            var path = "mode/coffee/";

            var subDir = "lib/coffee-script/";
            var deps = [
                "helpers.js",
                "lexer.js",
                "nodes.js",
                "parser.js",
                "rewriter.js",
                "scope.js"
            ].map(function(x) {
                return {
                    name: x,
                    href: rootHref + subDir + x,
                    path: rootDir + path + x
                };
            });
            deps.push({name:"LICENSE", href: rootHref + "LICENSE"});

            var downloads = {}, counter = 0;

            deps.forEach(function(x) {
                download(x.href, function(err, data) {
                    counter++;
                    downloads[x.name] = data;
                    if (counter == deps.length)
                        allDone();
                });
            });
            function allDone() {
                deps.pop();
                var license = downloads.LICENSE.split('\n');
                license = "/**\n * " + license.join("\n * ") + "\n */";

                deps.forEach(function(x) {
                    var data = downloads[x.name];
                    console.log(x.name);
                    console.log(!data);
                    if (!data)
                        return;
                    if (x.name == "parser.js") {
                        data = data.replace("var parser = (function(){", "")
                            .replace(/\nreturn (new Parser)[\s\S]*$/, "\n\nmodule.exports = $1;\n\n");
                    } else {
                        data = data.replace("(function() {", "")
                            .replace(/\}\).call\(this\);\s*$/, "");
                    }
                    data = license
                        + "\n\n"
                        + "define(function(require, exports, module) {\n"
                        + data
                        + "\n});";

                    fs.writeFile(x.path, data, "utf-8", function(err){
                        if (err) throw err;
                        console.log("File " + x.name + " saved.");
                        console.warn("mode/coffee/coffee-script file needs to updated manually");
                        console.warn("mode/coffee/parser.js: parseError function needs to be modified");
                    });
                });
            }
        }
    }
};

var download = function(href, callback) {
    if (Array.isArray(href))
        return async.map(href, download, callback);

    var options = url.parse(href);
    var protocol = options.protocol === "https:" ? https : http;
    console.log("connecting to " + options.host + " " + options.path);
    protocol.get(options, function(res) {
        var data = "";
        res.setEncoding("utf-8");

        res.on("data", function(chunk){
            data += chunk;
        });

        res.on("end", function(){
            callback(null, data);
        });
    });
};

var getDep = function(dep) {
    if (!dep.fetch)
        dep.fetch = download
    dep.fetch(dep.url, function(err, data) {
        if (dep.postProcess)
            data = dep.postProcess(data);
        if (dep.needsFixup)
            data = "define(function(require, exports, module) {\n"
                + data
                + "\n});";

        fs.writeFile(rootDir + dep.path, data, "utf-8", function(err){
            if (err) throw err;
            console.log("File " + dep.path + " saved.");
        });
    });
};

function run(cmd, cb) {
	var proc = process.platform == "win32"
        ? spawn("cmd", ["/c", cmd], {cwd: __dirname})
        : spawn("bash", ["-c", cmd], {cwd: __dirname});

    var result = "", err = "";
	proc.stderr.setEncoding("utf8");    
	proc.stderr.on('data', function (data) {
        err += data;
	});

	proc.stdout.setEncoding("utf8");
	proc.stdout.on('data', function (data) {
        result += data;
	});

    proc.on('exit', done);
    proc.on('close', done);
    function done(code) {
        if (code !== 0) {
            console.error(cmd + '::: process exited with code :::' + code);
            console.error(err)
        }
        cb(err, result)
    }
}

function unquote(str) {
    return str.replace(/\\(.)/g, function(x, a) {
        return a == "n" ? "\n" 
            : a == "t" ? "\t" 
            : a == "r" ? "\r"
            : a
    });
}

function replaceConsoleBrowserify(str) {
    var simpleConsole = function(req,module,exports){
        ["log", "info", "warn", "error", 
        "time","timeEnd", "trace", "dir", "assert"
        ].forEach(function(x) {exports[x] = nop;});
        function nop() {}
    }
    var m = /"console-browserify":(\d+)/.exec(str);
    name = m && m[1];
    if (name) {
        str = str.replace(
            "{1:[",
            "{" + name + ":[" + simpleConsole + ",{}],\n1:["
        )
    }
    return str;
}


getDep(deps.jshint)