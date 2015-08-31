var https = require("https");
var http = require("http");
var url = require("url");
var fs = require("fs");

var Path = require("path");
var spawn = require("child_process").spawn;
var async = require("asyncjs");
var rootDir = __dirname + "/../lib/ace/";

var SKIP_NPM = false;

var deps = {
    csslint: {
        path: "mode/css/csslint.js",
        // url: "https://raw.github.com/stubbornella/csslint/master/release/csslint.js",
        browserify: {
            npmModule: "git+https://github.com/CSSLint/csslint.git#master",
            path: "jshint/src/jshint.js",
            exports: "jshint"
        },
        fetch: browserify,
        wrapAmd: true
    }, 
    requirejs: {
        path: "../../demo/kitchen-sink/require.js",
        url: "https://raw.github.com/jrburke/requirejs/master/require.js",
        wrapAmd: false
    },
    luaparse: {
        path: "mode/lua/luaparse.js",
        url: "https://raw.github.com/oxyc/luaparse/master/luaparse.js",
        wrapAmd: true,
        postProcess: function(src) {
            return src.replace(
                /\(function\s*\(root,\s*name,\s*factory\)\s*{[\s\S]*?}\(this,\s*'luaparse',/,
                "(function (root, name, factory) {\n   factory(exports)\n}(this, 'luaparse',"
            )
        }
    },
    html5: {
        path: "mode/html/saxparser.js",
        browserify: {
            npmModule: "git+https://github.com/aredridel/html5.git#master",
            path: "html5/lib/sax/SAXParser.js",  
            exports: "SAXParser"
        },
        fetch: browserify,
        wrapAmd: true,
        postProcess: function(src) {
            return src;
        }
    },
    xquery: {
       path: "mode/xquery/xquery_lexer.js",
       browserify: {
           npmModule: "git+https://github.com/wcandillon/xqlint.git#master",
           path: "xqlint/lib/lexers/xquery_lexer.js",
           exports: "XQueryLexer"
       },
       fetch: browserify,
       wrapAmd: true,
       postProcess: function(src){
           return src;
       }
    },
    jsoniq: {
       path: "mode/xquery/jsoniq_lexer.js",
       browserify: {
           npmModule: "git+https://github.com/wcandillon/xqlint.git#master",
           path: "xqlint/lib/lexers/jsoniq_lexer.js",
           exports: "JSONiqLexer"
       },
       fetch: browserify,
       wrapAmd: true,
       postProcess: function(src){
           return src;
       }
    },
    xqlint: {
       path: "mode/xquery/xqlint.js",
       browserify: {
           npmModule: "git+https://github.com/wcandillon/xqlint.git#master",
           path: "xqlint/lib/xqlint.js",
           exports: "XQLint"
       },
       fetch: browserify,
       wrapAmd: true,
       postProcess: function(src){
           return src;
       }
    },
    jshint: {
        path: "mode/javascript/jshint.js",
        browserify: {
            npmModule: "git+https://github.com/ajaxorg/jshint.git#master",
            path: "jshint/src/jshint.js",
            exports: "jshint"
        },
        fetch: browserify,
        wrapAmd: true,
        postProcess: function(src) {
            src = src.replace(
                /"Expected a conditional expression and instead saw an assignment."/g,
                '"Assignment in conditional expression"'
            );
            src = src.replace(/var defaultMaxListeners = 10;/, function(a) {return a.replace("10", "200")});
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
    vim: {
        fetch: function(){
            var rootHref = "https://raw.githubusercontent.com/codemirror/CodeMirror/master/"
            var fileMap = {"keymap/vim.js": "keyboard/vim.js", "test/vim_test.js": "keyboard/vim_test.js"};
            async.forEach(Object.keys(fileMap), function(x, next) {
                download(rootHref + x, function(e, d) {
                    d = d.replace(/^\(function.*{[^{}]+^}[^{}]+{/m, "define(function(require, exports, module) {");
                    d = d.replace(/^\s*return vimApi;\s*};/gm, "  //};")
                        .replace("var Vim = function() {", "$& return vimApi; } //{")
                    fs.writeFile(rootDir + fileMap[x], d, next)
                })
            }, function() {
                console.log("done")
            });
        }
    },
    liveScript: {
        path: "mode/livescript.js",
        url: "https://raw.githubusercontent.com/gkz/LiveScript/master/lib/mode-ls.js"        
    },
    coffee: {
        path: "mode/coffee/coffee.js",
        url: "https://raw.githubusercontent.com/jashkenas/coffeescript/master/extras/coffee-script.js",    
        wrapAmd: true,
        postProcess: function(src){
            return "function define(f) { module.exports = f() }; define.amd = {};\n"
                + dereqire(src);
        }
    },
    xmldom: {
        fetch: function() {
            var rootHref = "https://raw.githubusercontent.com/iDeBugger/xmldom/master/"
            var fileMap = {
               "sax.js": "mode/xml/sax.js",
               "dom-parser.js": "mode/xml/dom-parser.js",
               "dom.js": "mode/xml/dom.js"
            };
            async.forEach(Object.keys(fileMap), function(x, next) {
                download(rootHref + x, function(e, d) {
                    fs.writeFile(rootDir + fileMap[x], d, next)
                })
            }, function() {
                console.log("XmlDOM updating done")
            });
        }
    },
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
        if (dep.wrapAmd)
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

function dereqire(src) {
    return require("derequire")(src, [
        {from: 'require', to: '_dereq_'},
        {from: 'define', to: '_defi_'}
    ]);
}

function browserify(_, cb) {
    var br = this.browserify;
    var path = Path.join("node_modules", br.path)
    process.chdir(__dirname);
    if (Path.sep == "\\" && !Path._relative) {
        Path._relative = Path.relative;
        Path.relative = function() {
            var v = Path._relative.apply(this, arguments);
            return v.replace(/\\/g, "/");
        }
    }
    function done() {
        var browserify = require('browserify');
        var absPath = require.resolve(__dirname + "/" + path);
        var defaultPreludePath = Path.join(require.resolve("browser-pack"), "../prelude.js");
        var defaultPrelude = "module.exports = " + fs.readFileSync(defaultPreludePath, 'utf8')
            .replace(/^[ \t]*\/\/.*/gm, "")
            .replace(/^\s*\n\r?/gm, "")
            .replace(/return newRequire;/, "return newRequire(entry[0]);")
        var opts = {
            expose: br.exports,
            prelude: defaultPrelude,
            exposeAll: true
        }
        var b = browserify(opts);
        b.plugin(require("deps-sort"), opts);
        b.add(absPath);
        var p = b.bundle();
        var buffer = "";
        p.on("data", function(e) { buffer += e; });
        p.on("end", function() {
            var src = dereqire(buffer);
            cb(null, src);
        });
    }
    if (SKIP_NPM) return done();
    run("npm install " + br.npmModule,  done);
}

var args = process.argv.slice(2);
SKIP_NPM = args.indexOf("--skip-npm") != -1;
args = args.filter(function(x) {return x[0] != "-" });
if (!args.length)
    args = Object.keys(deps);
    
args.forEach(function(key) {
    getDep(deps[key])
});

