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
   "keyword.other.unit": "keyword.other.unit",

   "constant": "constant",
   "constant.language": "constant.language",
   "constant.library": "constant.library",
   "constant.numeric": "constant.numeric",
   "constant.character" : "constant.character",
   "constant.character.escape" : "constant.character.escape",
   "constant.character.entity": "constant.character.entity",
   "constant.other" : "constant.other",

   "support": "support",
   "support.function": "support.function",
   "support.function.dom": "support.function.dom",
   "support.function.firebug": "support.firebug",
   "support.function.constant": "support.function.constant",
   "support.constant": "support.constant",
   "support.constant.property-value": "support.constant.property-value",
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
   "meta.tag.sgml.doctype": "xml-pe",
   "meta.tag": "meta.tag",
   "meta.selector": "meta.selector",
   
   "entity.other.attribute-name": "entity.other.attribute-name",
   "entity.name.function": "entity.name.function",
   "entity.name": "entity.name",
   "entity.name.tag": "entity.name.tag",

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

var fallbackScopes = {
    "keyword": "meta",
    "support.type": "storage.type",
    "variable": "entity.name.function"
};

// Taken from .ace-tm
var defaultGlobals = {
    "printMargin": "#e8e8e8",
    "background": "#ffffff",
    "foreground": "#000000",
    "gutter": "#f0f0f0",
    "selection": "rgb(181, 213, 255)",
    "step": "rgb(198, 219, 174)",
    "bracket": "rgb(192, 192, 192)",
    "active_line": "rgba(0, 0, 0, 0.07)",
    "cursor": "#000000",
    "invisible": "rgb(191, 191, 191)",
    "fold": "#6b72e6"
};

function extractStyles(theme) {
    var globalSettings = theme.settings[0].settings;

    var colors = {
        "printMargin": defaultGlobals.printMargin,
        "background": parseColor(globalSettings.background) || defaultGlobals.background,
        "foreground": parseColor(globalSettings.foreground) || defaultGlobals.foreground,
        "gutter": defaultGlobals.gutter,
        "selection": parseColor(globalSettings.selection) || defaultGlobals.selection,
        "step": defaultGlobals.step,
        "bracket": parseColor(globalSettings.invisibles) || defaultGlobals.bracket,
        "active_line": parseColor(globalSettings.lineHighlight) || defaultGlobals.active_line,
        "cursor": parseColor(globalSettings.caret) || defaultGlobals.cursor,
        "invisible": "color: " + (parseColor(globalSettings.invisibles) || defaultGlobals.invisible) + ";"
    };

    for (var i=1; i<theme.settings.length; i++) {
        var element = theme.settings[i];
        if (!element.scope || !element.settings)
            continue;
        var scopes = element.scope.split(/\s*[|,]\s*/g);
        for (var j = 0; j < scopes.length; j++) {
            var scope = scopes[j];
            var style = parseStyles(element.settings);
        
            var aceScope = supportedScopes[scope];
            if (aceScope) {
                colors[aceScope] = style;
            }
            else if (style) {
                unsupportedScopes[scope] = (unsupportedScopes[scope] || 0) + 1;
            }
        }        
    }
    
    for (var i in fallbackScopes) {
        if (!colors[i])
            colors[i] = colors[fallbackScopes[i]];
    }

    if (!colors.fold) {
        var foldSource = colors["entity.name.function"] || colors.keyword;
        if (foldSource) {
            colors.fold = foldSource.match(/\:([^;]+)/)[1];
        } else {
            colors.fold = defaultGlobals.fold;
        }
    }
    
    colors.gutterBg = colors.background
    colors.gutterFg = mix(colors.foreground, colors.background, 0.5)

    if (!colors.selected_word_highlight)
        colors.selected_word_highlight =  "border: 1px solid " + colors.selection + ";";

    colors.isDark = (luma(colors.background) < 0.5) + "";
    
    return colors;
};

function mix(c1, c2, a1, a2) {
    c1 = rgbColor(c1);
    c2 = rgbColor(c2);
    if (a2 === undefined)
        a2 = 1 - a1
    return "rgb(" + [
        Math.round(a1*c1[0] + a2*c2[0]),
        Math.round(a1*c1[1] + a2*c2[1]),
        Math.round(a1*c1[2] + a2*c2[2])
    ].join(",") + ")";
}

function rgbColor(color) {
    if (typeof color == "object")
        return color;
    if (color[0]=="#")
        return color.match(/^#(..)(..)(..)/).slice(1).map(function(c) {
            return parseInt(c, 16);
        });
    else
        return color.match(/\(([^,]+),([^,]+),([^,]+)/).slice(1).map(function(c) {
            return parseInt(c, 10);
        });
}
function luma(color) {
    var rgb = rgbColor(color);
    return (0.21 * rgb[0] + 0.72 * rgb[1] + 0.07 * rgb[2]) / 255;
}

function parseColor(color) {
    if (!color.length) return null;
    if (color.length == 4)
        color = color.replace(/[a-fA-F\d]/g, "$&$&");
    if (color.length == 7)
        return color;
    else {
        if (!color.match(/^#(..)(..)(..)(..)$/))
            console.error("can't parse color", color);
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

var cssTemplate = fs.readFileSync(__dirname + "/templates/theme.css", "utf8");
var jsTemplate = fs.readFileSync(__dirname + "/templates/theme.js", "utf8");

function normalizeStylesheet(rules) {
    for (var i = rules.length; i--; ) {
        var s = JSON.stringify(rules[i].declarations);
        for (var j = i; j --; ) {
            if (s == JSON.stringify(rules[j].declarations)) {
            console.log(rules[j].selectors, rules[i].selectors)
            console.log(i, j)
                rules[j].selectors = rules[i].selectors.concat(rules[j].selectors);
                rules.splice(i, 1);
                break;
            }
        }
    }
    for (var i = rules.length; i--; ) {
        var s = rules[i].selectors.sort();
        rules[i].selectors = s.filter(function(x, i) {
            return x && x != s[i + 1];
        });                
    }
    return rules;
}

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
    "nord_dark": "Nord Dark",
    "one_dark": "One Dark",
    "pastel_on_dark": "Pastels on Dark",
    "solarized_dark": "Solarized-dark",
    "solarized_light": "Solarized-light",
    "katzenmilch": "Katzenmilch",
    "kuroir": "Kuroir Theme",
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

function convertBuiltinTheme(name) {
    return convertTheme(name, __dirname + "/tmthemes/" + themes[name] + ".tmTheme", __dirname + "/../lib/ace/theme");
}

function convertTheme(name, tmThemePath, outputDirectory) {
    console.log("Converting " + name);
    var tmTheme = fs.readFileSync(tmThemePath, "utf8");
    parseTheme(tmTheme, function(theme) {
        var styles = extractStyles(theme);

        styles.cssClass = "ace-" + hyphenate(name);
        styles.uuid = theme.uuid;
        var css = fillTemplate(cssTemplate, styles);
        css = css.replace(/[^\{\}]+{\s*}/g, "");
        
        for (var i in supportedScopes) {
            if (!styles[i])
                continue;
            css += "." + styles.cssClass + " " +
                i.replace(/^|\./g, ".ace_") + "{" + styles[i] + "}";
        }

        // we're going to look for NEW rules in the parsed content only
        // if such a rule exists, add it to the destination file
        // this way, we preserve all hand-modified rules in the <theme>.css rules,
        // (because some exist, for collab1 and ace_indentation_guide
        try {
            var outThemeCss = fs.readFileSync(outputDirectory + "/" + name + ".css");
            var oldRules = cssParse(outThemeCss).stylesheet.rules;
            var newRules = cssParse(css).stylesheet.rules;


            for (var i = 0; i < newRules.length; i++) {
                var newSelectors = newRules[i].selectors;

                for (var j = 0; j < oldRules.length; j++) {
                    var oldSelectors = oldRules[j].selectors;
                    newSelectors = newSelectors.filter(function(s) {
                        return oldSelectors.indexOf(s) == -1;
                    })
                    if (!newSelectors.length)
                        break;
                }
                if (newSelectors.length) {
                    newRules[i].selectors = newSelectors;
                    console.log("Adding NEW rule: ", newRules[i])
                    oldRules.splice(i, 0, newRules[i]);
                }
            }
            
            oldRules = normalizeStylesheet(oldRules);
            
            css = cssStringify({stylesheet: {rules: oldRules}}, { compress: false });
        } catch(e) {
            console.log("Creating new file: " +  name + ".css")
            css = cssStringify(cssParse(css), { compress: false });
        }
        
        var js = fillTemplate(jsTemplate, {
            name: name,
            css: 'require("../requirejs/text!./' + name + '.css")', // quoteString(css), //
            cssClass: "ace-" + hyphenate(name),
            isDark: styles.isDark
        });

        fs.writeFileSync(outputDirectory + "/" + name + ".js", js);
        fs.writeFileSync(outputDirectory + "/" + name + ".css", css);
    })
}

if (process.argv.length > 2) {
    var args = process.argv.splice(2);
    if (args.length < 3) {
        console.error("Usage: node tmtheme.js [theme_name, path/to/theme.tmTheme path/to/output/directory]");
        process.exit(1);
    }
    var name = args[0];
    var themePath = args[1];
    var outputDirectory = args[2];
    convertTheme(name, themePath, outputDirectory);
} else {
    for (var name in themes) {
        convertBuiltinTheme(name);
    }
}

if (Object.keys(unsupportedScopes).length > 0) {
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
    console.log("Refer to the docs on ace.c9.io for information on how to add a scope to the CSS generator.");
}


/*** TODO: generate images for indent guides in node

var indentGuideColor = "#2D2D2D"
var canvas = document.createElement("canvas")
canvas.width = 1; canvas.height = 2;
var ctx = canvas.getContext("2d")
imageData = ctx.getImageData(0,0,1,2)

function getColor(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0,0,1,2);
    return Array.slice(ctx.getImageData(0,0,1,2).data).slice(0,4)    
}
bgColor = getComputedStyle(ace.renderer.scroller).backgroundColor
var a = [].concat(getColor(bgColor), getColor(indentGuideColor));
a.forEach(function(val,i){imageData.data[i] = val})

ctx.putImageData(imageData,0,0)
image = canvas.toDataURL("png")

var rule = "."+ace.renderer.$theme +" .ace_indent-guide {\n\
  background: url(" + image +") right repeat-y;\n\
}"
console.log(rule)
require("ace/lib/dom").importCssString(rule)

*/
