var fs = require("fs");
var path = require("path");
var panino = require("panino");
var srcPath = __dirname + "/../lib/ace";

var options = {
  title       : "Ace API",
  linkFormat  : function(linkHtml) {
      var href = linkHtml.href;
      var o = href.match(/(.+)\.html(#.+)/);
      var c = href.match(/#(.+)/);
      
      if ( o !== null ) {
          href = href.replace(href, '#nav=api&api=' + o[1]);// + '&section=' + o[2]);
      }
      /*else if (c != null) {
          var fileLoc =  path.basename(linkHtml.originalFile, path.extname(linkHtml.originalFile));
          var sectionLoc = c[1];
          if (fileLoc.toUpperCase() !== sectionLoc.toUpperCase()) {
              href = href.replace(href, '#nav=api&api=' + fileLoc + '&section=' + sectionLoc);
          }
          else {
              //href = href.replace(href, '#nav=api&api=' + fileLoc);
          }
      }*/
      linkHtml.href = href;
      
      return linkHtml;
  },
  output      : "../api/",
  outputAssets : "../api/resources",
  skin        : "./resources/ace/templates/layout.jade",
  assets      : "./resources/ace/skeleton",
  additionalObjs : "./additionalObjs.json",
  exclude     : ["**/*_test.js", "**/mode/**", "**/test/**", "**/theme/**", "**/worker/**"],
  index       : "./index.md",
  disableTests: true
};

files = [srcPath];

panino.parse(files, options, function (err, ast) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  
  panino.render('html', ast, options, function (err) {
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