var xml = require("../support/node-o3-xml-v4/lib/o3-xml");
var fs = require("fs");

function plistToJson(el) {
    if (el.tagName != "plist")
        throw new Error("not a plist!");

    return $plistParse(el.selectSingleNode("dict"));
};

function $plistParse(el) {            
    if (el.tagName == "dict") {
        var dict = {};
        var key;
        var childNodes = el.childNodes;
        for (var i=0, l=childNodes.length; i<l; i++) {
            var child = childNodes[i];
            if (child.nodeType !== 1) 
                continue;
                
            if (child.tagName == "key") {
                key = child.nodeValue;
            } else {
                if (!key)
                    throw new Error("missing key");
                dict[key] = $plistParse(child);
                key = null;
            }
        }
        return dict;
    }
    else if (el.tagName == "array") {
        var arr = [];
                var childNodes = el.childNodes;
        for (var i=0, l=childNodes.length; i<l; i++) {
            var child = childNodes[i];
            if (child.nodeType !== 1) 
                continue;
                
            arr.push($plistParse(child));
        }
        return arr;
    }
    else if (el.tagName == "string") {
        return el.nodeValue;
    } else {
        throw new Error("unsupported node type " + el.tagName);
    }
}

function parseTheme(themeXml) {
    try {
        return plistToJson(xml.parseFromString(themeXml).documentElement);
    } catch(e) { return }
}
 
var supportedScopes = {
   "keyword": "keyword",
   "keyword.operator": "keyword.operator",
   
   "constant": "constant",
   "constant.language": "constant.language",
   "constant.library": "constant.library",
   "constant.numeric": "constant.numeric",
   
   "support": "support",
   "support.function": "support.function",

   "function": "function",
   "function.buildin": "function.buildin",
   
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
   
   "meta.tag.sgml.doctype": "xml_pe",
   
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
    }
    
    for (var i=1; i<theme.settings.length; i++) {
        var element = theme.settings[i];
        if (!element.scope)
            continue;
        var scopes = element.scope.split(/\s*[|,]\s*/g);
        for (var j=0; j<scopes.length; j++) {
            var scope = scopes[j];
            if (supportedScopes[scope]) {
                colors[supportedScopes[scope]] = parseStyles(element.settings);
            }
        }
    }

    return colors;
};

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

function createTheme(name, styles, cssTemplate, jsTemplate) {
    styles.cssClass = "ace-" + hyphenate(name);
    var css = fillTemplate(cssTemplate, styles);
    return fillTemplate(jsTemplate, {
        name: name,
        css: '"' + css.replace(/\\/, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\\n") + '"',
        cssClass: "ace-" + hyphenate(name)
    });
};

function hyphenate(str) {
    return str.replace(/([A-Z])/g, "-$1").replace("_", "-").toLowerCase();
}

var cssTemplate = fs.readFileSync(__dirname + "/Theme.tmpl.css", "utf8");
var jsTemplate = fs.readFileSync(__dirname + "/Theme.tmpl.js", "utf8");

var themes = {
    "dawn": "Dawn",
    "idle_fingers": "idleFingers",
    "twilight": "Twilight",
    "monokai": "Monokai",
    "cobalt": "Cobalt",
    "mono_industrial": "monoindustrial",
    "clouds": "Clouds",
    "clouds_midnight": "Clouds Midnight",
    "kr_theme": "krTheme",
	"solarized_light": "Solarized-light",
	"solarized_dark": "Solarized-dark"
}

for (var name in themes) {
    console.log("Converting " + name);
    var tmTheme = fs.readFileSync(__dirname + "/tmthemes/" + themes[name] + ".tmTheme", "utf8");

    var styles = extractStyles(parseTheme(tmTheme));
    fs.writeFileSync(__dirname + "/../lib/ace/theme/" + name + ".js", createTheme(name, styles, cssTemplate, jsTemplate));
}
