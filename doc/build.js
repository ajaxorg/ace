var fs = require("fs");
var path = require("path");
var panino = require("panino");
var srcPath = __dirname + "/../lib/ace";
var buildType = process.argv.splice(2)[0];

var options = {
  title       : "Ace API",
  parseType   : "jsd",
  linkFormat  : function(linkHtml) {
      var href = linkHtml.href;
      var o = href.match(/(.+)\.html(#.+)/);
      var c = href.match(/#(.+)/);
      
      if ( o !== null ) {
          href = href.replace(href, '#nav=api&api=' + o[1]);// + '&section=' + o[2]);
      }
      
      linkHtml.href = href;
      
      return linkHtml;
  },
  output      : "../api/",
  outputAssets : "../api/resources",
  skin        : "./template/jade/layout.jade",
  assets      : "./template/resources",
  additionalObjs : "./additionalObjs.json",
  exclude     : ["**/*_test.js", "**/mode/**", "default_commands.js", "multi_select_commands.js", "**/test/**", "**/theme/**", "**/worker/**"],
  index       : "./index.md"
};

files = [srcPath];

panino.parse(files, options, function (err, ast) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  
  panino.render(buildType || 'html', ast, options, function (err) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    
    /*fs.readdir(options.output, function (err, files) {
        files.forEach(function(file) {
            if (file.match(/\.html$/)) {
                var outFile = options.output + "/" + file;
                fs.readFile(outFile, "utf8", function(err, data) {
                    var otherPageRegExp = new RegExp('<a href="(.+?.html)(#.+?)?"', "g");
                    var m;
                    
                    if ( (m = data.match(otherPageRegExp)) ) {
                        console.log(m)
                        data = data.replace(otherPageRegExp, '<a href="#nav=api&api=' + m[1] + '&section=' + m[2] + '"')
                    }
                    
                    fs.writeFile(outFile, data, function (err) {
                      if (err) throw err;
                    });
                });
            }
        });
    });*/
  });
});