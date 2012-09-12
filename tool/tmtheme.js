var fs = require("fs");
var path = require("path");
var util = require("util");
var cssParse = require("css-parse");
var cssStringify = require("css-stringify");

var parseString = require("plist").parseString;
function parseTheme(themeXml, callback) {
    parseString(themeXml, function(_, theme) {
        callback(theme[0])
    });
}

var unsupportedScopes = { };

var supportedScopes = {
   "keyword": "keyword",
   "keyword.operator": "keyword.operator",

   "constant": "constant",
   "constant.language": "constant.language",
   "constant.library": "constant.library",
   "constant.numeric": "constant.numeric",
   "constant.character" : "constant.character",
   "constant.character.escape" : "constant.character.escape",
   "constant.other" : "constant.other",

   "support": "support",
   "support.function": "support.function",
   "support.function.dom": "support.function.dom",
   "support.function.firebug": "support.firebug",
   "support.function.constant": "support.function.constant",
   "support.constant": "support.constant",
   "support.class": "support.class",
   "support.type": "support.type",
   "support.other": "support.other",

   "function": "function",
   "function.buildin": "function.buildin",

   "storage": "storage",
   "storage.type": "storage.type",

   "invalid": "invalid",
   "invalid.illegal": "invalid.illegal",
   "invalid.deprecated": "invalid.deprecated",

   "string": "string",
   "string.regexp": "string.regexp",

   "comment": "comment",
   "comment.documentation": "comment.doc",
   "comment.documentation.tag": "comment.doc.tag",

   "variable": "variable",
   "variable.language": "variable.language",
   "variable.parameter": "variable.parameter",

   "meta": "meta",
   "meta.tag.sgml.doctype": "xml_pe",
   "meta.tag": "meta.tag",
   "meta.tag.form": "meta.tag.form",
   
   "entity.other.attribute-name": "entity.other.attribute-name",
   "entity.name.function": "entity.name.function",
   "entity.name": "entity.name",

   "markup.heading": "markup.heading",
   "markup.heading.1": "markup.heading.1",
   "markup.heading.2": "markup.heading.2",
   "markup.heading.3": "markup.heading.3",
   "markup.heading.4": "markup.heading.4",
   "markup.heading.5": "markup.heading.5",
   "markup.heading.6": "markup.heading.6",
   "markup.list": "markup.list",

   "collab.user1": "collab.user1"
};

function extractStyles(theme) {
    var globalSettings = theme.settings[0].settings;

    var colors = {
        "printMargin": "#e8e8e8",
        "background": parseColor(globalSettings.background),
        "foreground": parseColor(globalSettings.foreground),
        "overwrite": parseColor(globalSettings.caret),
        "gutter": "#e8e8e8",
        "selection": parseColor(globalSettings.selection),
        "step": "rgb(198, 219, 174)",
        "bracket": parseColor(globalSettings.invisibles),
        "active_line": parseColor(globalSettings.lineHighlight),
        "cursor": parseColor(globalSettings.caret),

        "invisible": "color: " + parseColor(globalSettings.invisibles) + ";"
    };

    for (var i=1; i<theme.settings.length; i++) {
      var element = theme.settings[i];
      if (!element.scope)
          continue;
      var scopes = element.scope.split(/\s*[|,]\s*/g);
      for (var j=0; j<scopes.length; j++) {
        var scope = scopes[j];
        var style = parseStyles(element.settings);

        if (supportedScopes[scope]) {
            colors[supportedScopes[scope]] = style;
        } 
        else if (style.length > 0) {
          if (unsupportedScopes[scope] === undefined) {
            unsupportedScopes[scope] = 1;
          }
          else {
            unsupportedScopes[scope] = unsupportedScopes[scope] + 1;
          }
        }
      }
    }

    if (!colors.fold) {
      var foldSource = colors["entity.name.function"] || colors.keyword;
      if (foldSource) {
        colors.fold = foldSource.match(/\:([^;]+)/)[1];
      }
    }

    if (!colors.selected_word_highlight)
        colors.selected_word_highlight =  "border: 1px solid " + colors.selection + ";";

    colors.isDark = (luma(colors.background) < 0.5) + "";

    return colors;
};

function luma(color) {
    if (color[0]=="#")
        var rgb = color.match(/^#(..)(..)(..)/).slice(1).map(function(c) {
            return parseInt(c, 16);
        });
    else
        var rgb = color.match(/\(([^,]+),([^,]+),([^,]+)/).slice(1).map(function(c) {
            return parseInt(c, 10);
        });

    return (0.21 * rgb[0] + 0.72 * rgb[1] + 0.07 * rgb[2]) / 255;
}

function parseColor(color) {
    if (color.length == 7)
        return color;
    else {
        var rgba = color.match(/^#(..)(..)(..)(..)$/).slice(1).map(function(c) {
            return parseInt(c, 16);
        });
        rgba[3] = (rgba[3] / 0xFF).toPrecision(2);
        return "rgba(" + rgba.join(", ") + ")";
    }
}

function parseStyles(styles) {
    var css = [];
    var fontStyle = styles.fontStyle || "";
    if (fontStyle.indexOf("underline") !== -1) {
        css.push("text-decoration:underline;");
    }
    if (fontStyle.indexOf("italic") !== -1) {
        css.push("font-style:italic;");
    }

    if (styles.foreground) {
        css.push("color:" + parseColor(styles.foreground) + ";");
    }
    if (styles.background) {
        css.push("background-color:" + parseColor(styles.background) + ";");
    }

    return css.join("\n");
}

function fillTemplate(template, replacements) {
    return template.replace(/%(.+?)%/g, function(str, m) {
        return replacements[m] || "";
    });
}

function hyphenate(str) {
    return str.replace(/([A-Z])/g, "-$1").replace(/_/g, "-").toLowerCase();
}

function quoteString(str) {
    return '"' + str.replace(/\\/, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\\n") + '"';
}

var cssTemplate = fs.readFileSync(__dirname + "/Theme.tmpl.css", "utf8");
var jsTemplate = fs.readFileSync(__dirname + "/Theme.tmpl.js", "utf8");

var themes = {
    //"chrome": "Chrome DevTools",
    "clouds": "Clouds",
    "clouds_midnight": "Clouds Midnight",
    "cobalt": "Cobalt",
    //"crimson_editor": "Crimson Editor",
    "dawn": "Dawn",
    //"dreamweaver": "Dreamweaver",
    //"eclipse": "Eclipse",
    //"github": "GitHub",
    "idle_fingers": "idleFingers",
    "kr_theme": "krTheme",
    "merbivore": "Merbivore",
    "merbivore_soft": "Merbivore Soft",
    "mono_industrial": "monoindustrial",
    "monokai": "Monokai",
    "pastel_on_dark": "Pastels on Dark",
    "solarized_dark": "Solarized-dark",
    "solarized_light": "Solarized-light",
    //"textmate": "Textmate (Mac Classic)",
    "tomorrow": "Tomorrow",
    "tomorrow_night": "Tomorrow-Night",
    "tomorrow_night_blue": "Tomorrow-Night-Blue",
    "tomorrow_night_bright": "Tomorrow-Night-Bright",
    "tomorrow_night_eighties": "Tomorrow-Night-Eighties",
    "twilight": "Twilight",
    "vibrant_ink": "Vibrant Ink",
    "xcode": "Xcode_default"
};

function convertTheme(name) {
    console.log("Converting " + name);
    var tmTheme = fs.readFileSync(__dirname + "/tmthemes/" + themes[name] + ".tmTheme", "utf8");
    parseTheme(tmTheme, function(theme) {
        var styles = extractStyles(theme);

        styles.cssClass = "ace-" + hyphenate(name);
        styles.uuid = theme.uuid;
        var css = fillTemplate(cssTemplate, styles);
        css = css.replace(/[^\{\}]+{\s*}/g, "");

        var js = fillTemplate(jsTemplate, {
            name: name,
            css: "require('ace/requirejs/text!./" + name + ".css')", // quoteString(css), //
            cssClass: "ace-" + hyphenate(name),
            isDark: styles.isDark
        });

        // we're going to look for NEW rules in the parsed content only
        // if such a rule exists, add it to the destination file
        // this way, we preserve all hand-modified rules in the <theme>.css rules,
        // (because some exist, for collab1 and ace_indentation_guide
        try {
          var outThemeCss = fs.readFileSync(__dirname + "/../lib/ace/theme/" + name + ".css");
          var parsedExistingFile = cssParse(outThemeCss);
          var parsedPotentialFile = cssParse(css);


          for (var r = 0; r < parsedPotentialFile.stylesheet.rules.length; r++) {
            var potentialSelectors = parsedPotentialFile.stylesheet.rules[r].selectors;
            var found = false;

            for (var e = 0; e < parsedExistingFile.stylesheet.rules.length; e++) {
              var existingSelectors = parsedExistingFile.stylesheet.rules[e].selectors;

              if (existingSelectors.join(",") === potentialSelectors.join(",")) {
                found = true;
                break;
              }
            }
            if (!found) {
              console.log("Adding NEW rule: ", parsedPotentialFile.stylesheet.rules[r])
              parsedExistingFile.stylesheet.rules.splice(r, 0, parsedPotentialFile.stylesheet.rules[r]);
            }
          }
          css = cssStringify(parsedExistingFile, { compress: false });
        } catch(e) {
          console.log("Creating new file: " +  name + ".css")
        }
        
        fs.writeFileSync(__dirname + "/../lib/ace/theme/" + name + ".js", js);
        fs.writeFileSync(__dirname + "/../lib/ace/theme/" + name + ".css", css);
    })
}

for (var name in themes) {
    convertTheme(name);
}

var sortedUnsupportedScopes = {};
for (var u in unsupportedScopes) {
  var value = unsupportedScopes[u];
  if (sortedUnsupportedScopes[value] === undefined) {
    sortedUnsupportedScopes[value] = [];
  }
  sortedUnsupportedScopes[value].push(u);
}

console.log("I found these unsupported scopes:");
console.log(sortedUnsupportedScopes);
console.log("It's safe to ignore these, but they may affect your syntax highlighting if your mode depends on any of these rules.");
console.log("Refer to the docs on ace.ajax.org for information on how to add a scope to the CSS generator.");