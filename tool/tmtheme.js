var xml = require("libxml");
var fs = require("fs");

function plistToJson(el) {
    if (el.tagName != "plist")
        throw new Error("not a plist!");

    return $plistParse(el.selectSingleNode("dict"));
}

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
    } catch(e) { return; }
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
            if (supportedScopes[scope]) {
                colors[supportedScopes[scope]] = parseStyles(element.settings);
            }
        }
    }

    if (!colors.fold)
        colors.fold = ((colors["entity.name.function"] || colors.keyword).match(/\:([^;]+)/)||[])[1];
    
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

function createTheme(name, styles, cssTemplate, jsTemplate) {
    styles.cssClass = "ace-" + hyphenate(name);
    var css = fillTemplate(cssTemplate, styles);
    
    css = css.replace(/[^\{\}]+{\s*}/g, "");
    return fillTemplate(jsTemplate, {
        name: name,
        css: '"' + css.replace(/\\/, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\\n") + '"',
        cssClass: "ace-" + hyphenate(name),
        isDark: styles.isDark
    });
}

function hyphenate(str) {
    return str.replace(/([A-Z])/g, "-$1").replace(/_/g, "-").toLowerCase();
}

var cssTemplate = fs.readFileSync(__dirname + "/Theme.tmpl.css", "utf8");
var jsTemplate = fs.readFileSync(__dirname + "/Theme.tmpl.js", "utf8");

var themes = {
    "dawn": "Dawn",
    "idle_fingers": "idleFingers",
    "twilight": "Twilight",
    "monokai": "Monokai",
    "merbivore": "Merbivore",
    "merbivore_soft": "Merbivore Soft",
    "pastel_on_dark": "Pastels on Dark",
    "cobalt": "Cobalt",
    "mono_industrial": "monoindustrial",
    "clouds": "Clouds",
    "clouds_midnight": "Clouds Midnight",
    "kr_theme": "krTheme",
    "solarized_light": "Solarized-light",
    "solarized_dark": "Solarized-dark",
    "tomorrow": "Tomorrow",
    "tomorrow_night": "Tomorrow-Night",
    "tomorrow_night_blue": "Tomorrow-Night-Blue",
    "tomorrow_night_bright": "Tomorrow-Night-Bright",
    "tomorrow_night_eighties": "Tomorrow-Night-Eighties",
    "vibrant_ink": "Vibrant Ink"
};

for (var name in themes) {
    console.log("Converting " + name);
    var tmTheme = fs.readFileSync(__dirname + "/tmthemes/" + themes[name] + ".tmTheme", "utf8");

    var styles = extractStyles(parseTheme(tmTheme));
    fs.writeFileSync(__dirname + "/../lib/ace/theme/" + name + ".js", createTheme(name, styles, cssTemplate, jsTemplate));
}
