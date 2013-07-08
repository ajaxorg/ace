var https = require("https")
  , http = require("http")
  , url = require("url")
  , fs = require("fs");

var rootDir = __dirname + "/../lib/ace/";

var deps = [{
	path: "mode/css/csslint.js",
	url: "https://raw.github.com/stubbornella/csslint/master/release/csslint-node.js",
	needsFixup: true
}, {
	path: "../../demo/kitchen-sink/require.js",
	url: "https://raw.github.com/jrburke/requirejs/master/require.js",
	needsFixup: false
}, {
	path: "mode/lua/luaparse.js",
	url: "https://raw.github.com/oxyc/luaparse/master/luaparse.js",
	needsFixup: true,
	postProcess: function(src) {
		return src.replace(
			/\(function\s*\(root,\s*name,\s*factory\)\s*{[\s\S]*?}\(this,\s*'luaparse',/,
			"(function (root, name, factory) {\n   factory(exports)\n}(this, 'luaparse',"
		)
	}
}];

var download = function(href, callback) {
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
			callback(data);
		});
	});
};

var getDep = function(dep) {
	download(dep.url, function(data) {
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

deps.forEach(getDep);

// coffee-script
void function(){
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
		download(x.href, function(data) {
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
}();




var spawn = require("child_process").spawn;

var run = function(cmd, cb) {
	var proc = spawn("cmd", ["/c " + cmd]);

	proc.stderr.setEncoding("utf8");
	proc.stderr.on('data', function (data) {
        // console.error(data);
	});

	proc.stdout.setEncoding("utf8");
	proc.stdout.on('data', function (data) {
        //console.log(data);
	});

	proc.on('exit', done);
    proc.on('close', done);
    function done(code) {
        if (code !== 0) {
            console.error(cmd + '::: process exited with code :::' + code);
        }
        cb()
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

run("npm install jshint", function() {
    var jshintDist = fs.readFileSync("node_modules/jshint/dist/jshint.js", "utf8");
    
    jshintDist = jshintDist.replace(
        /(require.define.*)Function\(\[([^\]]*?)\],\s*"(.*)"\s*\)/g, 
        function(a, def, args, content) {
            return def + "function("+args.replace(/["']/g, "") + ") {\n"
                + unquote(content)
                + "\n}";
        }
    );
    jshintDist = jshintDist.replace(
        /"Expected a conditional expression and instead saw an assignment."/g,
        '"Assignment in conditional expression"'
    );
    
    jshintDist = jshintDist.replace(/\brequire\(["']|\(require,|\(require\)/g, function(r){
        return r.replace("require", "req");
    }).replace(/\brequire.define(\(|\s*=)/g, function(d){
        return d.replace("define", "def");
    });
    
    jshintDist = jshintDist.replace(/var defaultMaxListeners = 10;/, function(a) {return a.replace("10", "200")});
    
    jshintDist = 'define(function(require, exports, module) {\n'
        + jshintDist + '\n'
        + 'function req() {return require.apply(this, arguments)}\n'
        + 'module.exports = req("/src/stable/jshint.js");\n'
        +'});';
    fs.writeFileSync(rootDir + "mode/javascript/jshint.js", jshintDist);
});