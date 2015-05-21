var fs = require('fs')
var plist = require('plist')

var snippets = [];
var path = process.argv[2] || process.cwd();
function readSnippet(path, name) {
    if (name)
        path += name
    console.log(name)
    if (!/\.(tmSnippet|sublime-snippet|plist)$/i.test(path))
        return
    console.log(name)
    var plistString = fs.readFileSync(path, "utf8");
    plist.parseString(plistString, function(_, plist){
        snippets.push(plist)
    })
}

// read
function readDir(path) {
    if (fs.statSync(path).isDirectory()) {
        path += "/"
        fs.readdirSync(path).forEach(function(name) {        
            if (/snippets/i.test(name))
                readSnippetsInDir(path + name)
            else
                readDir(path + name)
        })
    }
}
function readSnippetsInDir(path) {
    if (fs.statSync(path).isDirectory()) {
        path += "/"
        snippets.push(path)
        fs.readdirSync(path).forEach(function(name) {
            readSnippet(path, name)
        })
    } else {
        readSnippet(path)
    }
}
readDir(path) 
// transform
snippets = snippets.map(function(s) {
    if (s.length == 1)
        s = s[0]
    if (s.scope)
        s.scope = s.scope.replace(/source\./g, "")
    delete s.uuid
    return s
})

// stringify
var indent = ""
var text = JSON.stringify(snippets, null, 1)
    // .replace(/(\n\s*)"(\w+)"\:/g, "$1$2:")
    .replace(/(\n\s*)\},\n\s*{/g, "$1}, {")
    .replace(/\[\n\s*\{\n/g, "[{\n").replace(/(\n\s*)\}\n\s*\]/g, "$1}]")
    .replace(/\[\n\s*[^\[\{\}\]]{0,100}\]/g, function(x){return x.replace(/\n\s*/g, " ")})
    .replace(/\:\s*\{\n\s*(.*)\n\s*\}/g, ": {$1}")
    .split(/\n\s*/).map(function(x){
        if (x[0] == "}" || x[0] == "]")
            indent = indent.substr(1)
            
        if (x.slice(-1) == "{" || x.slice(-1) == "[") {        
            indent += "\t"
            return  indent.substr(1) + x
        }
        return indent +x
    }).join("\n")
    .replace(/\\[\\tnr]/g, function(a){
        if (a[1] == "\\")
            return a
        else if (a[1] == "t")
            return "\t"
        else
            return "\\n"+"\\" + "\n"
    })

fs.writeFileSync(path += "/./ace.snippets.js", text)

console.log(path)