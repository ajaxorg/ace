var https = require("https")
  , http = require("http")
  , url = require("url")
  , fs = require("fs")

var rootDir = __dirname + "/../lib/ace/"

var deps = [{
	path: "mode/javascript/jshint.js",
	url: "https://raw.github.com/jshint/jshint/master/src/stable/jshint.js",
	needsFixup: true,
	postProcess: function(t) {
		return t.replace(
			/"Expected a conditional expression and instead saw an assignment."/g,
			'"Assignment in conditional expression"'
		);
	}
}, {
	path: "mode/css/csslint.js",
	url: "https://raw.github.com/stubbornella/csslint/master/release/csslint-node.js",
	needsFixup: true
}, {
	path: "../../demo/kitchen-sink/require.js",
	url: "https://raw.github.com/jrburke/requirejs/master/require.js",
	needsFixup: false
}, {
	path: "mode/lua/luaparse.js",
	url: "https://raw.github.com/oxyc/luaparse/master/lib/luaparse.js",
	needsFixup: true
}]

var download = function(href, callback) {
	var options = url.parse(href);   
	protocol = options.protocol === "https:" ? https : http;
	console.log("connecting to " + options.host + " " + options.path)
	var request = protocol.get(options, function(res) {
		var data = ""
		res.setEncoding("utf-8")

		res.on("data", function(chunk){
			data += chunk
		})

		res.on("end", function(){
			callback(data)
		})
	})
}

var getDep = function(dep) {
	download(dep.url, function(data) {
		if (dep.needsFixup)
			data = "define(function(require, exports, module) {\n"
				+ data
				+ "\n});"
		if (dep.postProcess)
			data = dep.postProcess(data)
			
		fs.writeFile(rootDir + dep.path, data, "utf-8", function(err){
			if (err) throw err
			console.log("File " + dep.path + " saved.")
		})
	})
}

deps.forEach(getDep)

// coffee-script
void function(){
	var rootHref = "https://raw.github.com/jashkenas/coffee-script/master/"
	var path = "mode/coffee/"
	
	var subDir = "lib/coffee-script/"
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
		}
	});
	deps.push({name:"LICENSE", href: rootHref + "LICENSE"})
	
	var downloads = {}, counter = 0
	
	deps.forEach(function(x) {
		download(x.href, function(data) {
			counter++
			downloads[x.name] = data
			if (counter == deps.length)
				allDone()			
		})
	})
	function allDone() {
		deps.pop()
		var license = downloads["LICENSE"].split('\n')
		license = "/**\n * " + license.join("\n * ") + "\n */"
		
		deps.forEach(function(x) {
			var data = downloads[x.name]
			console.log(x.name)
			console.log(!data)
			if (!data)
				return
			if (x.name == "parser.js") {
				data = data.replace("var parser = (function(){", "")
					.replace(/\nreturn (new Parser)[\s\S]*$/, "\n\nmodule.exports = $1;\n\n")
			} else {
				data = data.replace("(function() {", "")
					.replace(/}\).call\(this\);\s*$/, "")
			}
			data = license
				+ "\n\n"
				+ "define(function(require, exports, module) {\n"
				+ data
				+ "\n});"
				
			fs.writeFile(x.path, data, "utf-8", function(err){
				if (err) throw err
				console.log("File " + x.name + " saved.")
                console.warn("mode/coffee/coffee-script file needs to updated manually")
                console.warn("mode/coffee/parser.js: parseError function needs to be modified")
			})
		})
	}
}()
