"use strict";

var EditSession = require("../edit_session").EditSession;
var TextLayer = require("../layer/text").Text;
var baseStyles = require("./static-css");
var config = require("../config");
var dom = require("../lib/dom");
var escapeHTML = require("../lib/lang").escapeHTML;

class Element {
    /**
     * @param {string} type
     */
    constructor(type) {
        /** @type{string} */this.className;
        this.type = type;
        this.style = {};
        this.textContent = "";
    }

    cloneNode() {
        return this;
    }

    appendChild(child) {
        this.textContent += child.toString();
    }

    toString() {
        var stringBuilder = [];
        if (this.type != "fragment") {
            stringBuilder.push("<", this.type);
            if (this.className)
                stringBuilder.push(" class='", this.className, "'");
            var styleStr = [];
            for (var key in this.style) {
                styleStr.push(key, ":", this.style[key]);
            }
            if (styleStr.length)
                stringBuilder.push(" style='", styleStr.join(""), "'");
            stringBuilder.push(">");
        }

        if (this.textContent) {
            stringBuilder.push(this.textContent);
        }

        if (this.type != "fragment") {
            stringBuilder.push("</", this.type, ">");
        }

        return stringBuilder.join("");
    }
}


var simpleDom = {
    createTextNode: function(/** @type {string} */ textContent, /** @type {any} */ element) {
        return escapeHTML(textContent);
    },
    createElement: function(/** @type {string} */ type) {
        return new Element(type);
    },
    createFragment: function() {
        return new Element("fragment");
    }
};


/**@type {any}*/
var SimpleTextLayer = function() {
    this.config = {};
    this.dom = simpleDom;
};
SimpleTextLayer.prototype = TextLayer.prototype;

/**
 * 
 * @param {HTMLElement} el
 * @param opts
 * @param [callback]
 * @returns {boolean}
 */
var highlight = function(el, opts, callback) {
    var m = el.className.match(/lang-(\w+)/);
    var mode = opts.mode || m && ("ace/mode/" + m[1]);
    if (!mode)
        return false;
    var theme = opts.theme || "ace/theme/textmate";
    
    var data = "";
    var nodes = [];

    if (el.firstElementChild) {
        var textLen = 0;
        for (var i = 0; i < el.childNodes.length; i++) {
            /**@type {any}*/
            var ch = el.childNodes[i];
            if (ch.nodeType == 3) {
                textLen += ch.data.length;
                data += ch.data;
            } else {
                nodes.push(textLen, ch);
            }
        }
    } else {
        data = el.textContent;
        if (opts.trim)
            data = data.trim();
    }
    
    highlight.render(data, mode, theme, opts.firstLineNumber, !opts.showGutter, function (highlighted) {
        dom.importCssString(highlighted.css, "ace_highlight", true);
        el.innerHTML = highlighted.html;
        /** 
         * TODO: check if child exists
         * @type {any} 
         */
        var container = el.firstChild.firstChild;
        for (var i = 0; i < nodes.length; i += 2) {
            var pos = highlighted.session.doc.indexToPosition(nodes[i]);
            var node = nodes[i + 1];
            var lineEl = container.children[pos.row];
            lineEl && lineEl.appendChild(node);
        }
        callback && callback();
    });
};

/**
 * Transforms a given input code snippet into HTML using the given mode
 *
 * @param {string} input Code snippet
 * @param {string|import("../../ace-internal").Ace.SyntaxMode} mode String specifying the mode to load such as
 *  `ace/mode/javascript` or, a mode loaded from `/ace/mode`
 *  (use 'ServerSideHiglighter.getMode').
 * @param {string} theme String specifying the theme to load such as
 *  `ace/theme/twilight` or, a theme loaded from `/ace/theme`.
 * @param {number} lineStart A number indicating the first line number. Defaults
 *  to 1.
 * @param {boolean} disableGutter Specifies whether or not to disable the gutter.
 *  `true` disables the gutter, `false` enables the gutter. Defaults to `false`.
 * @param {function} [callback] When specifying the mode or theme as a string,
 *  this method has no return value and you must specify a callback function. The
 *  callback will receive the rendered object containing the properties `html`
 *  and `css`.
 * @returns {object} An object containing the properties `html` and `css`.
 */
highlight.render = function(input, mode, theme, lineStart, disableGutter, callback) {
    var waiting = 1;
    var modeCache = EditSession.prototype.$modes;

    // if either the theme or the mode were specified as objects
    // then we need to lazily load them.
    if (typeof theme == "string") {
        waiting++;
        config.loadModule(['theme', theme], function(m) {
            theme = m;
            --waiting || done();
        });
    }
    // allow setting mode options e.h {path: "ace/mode/php", inline:true}
    var modeOptions;
    if (mode && typeof mode === "object" && !mode.getTokenizer) {
        modeOptions = mode;
        mode = modeOptions.path;
    }
    if (typeof mode == "string") {
        waiting++;
        config.loadModule(['mode', mode], function(m) {
            if (!modeCache[/**@type{string}*/(mode)] || modeOptions)
                modeCache[/**@type{string}*/(mode)] = new m.Mode(modeOptions);
            mode = modeCache[/**@type{string}*/(mode)];
            --waiting || done();
        });
    }

    // loads or passes the specified mode module then calls renderer
    function done() {
        var result = highlight.renderSync(input, mode, theme, lineStart, disableGutter);
        return callback ? callback(result) : result;
    }
    return --waiting || done();
};

/**
 * Transforms a given input code snippet into HTML using the given mode
 * @param {string} input Code snippet
 * @param {import("../../ace-internal").Ace.SyntaxMode|string} mode Mode loaded from /ace/mode (use 'ServerSideHiglighter.getMode')
 * @param {any} theme
 * @param {any} lineStart
 * @param {boolean} disableGutter
 * @returns {object} An object containing: html, css
 */
highlight.renderSync = function(input, mode, theme, lineStart, disableGutter) {
    lineStart = parseInt(lineStart || 1, 10);

    var session = new EditSession("");
    session.setUseWorker(false);
    session.setMode(mode);

    /**@type {TextLayer}*/
    var textLayer = new SimpleTextLayer();
    textLayer.setSession(session);
    Object.keys(textLayer.$tabStrings).forEach(function(k) {
        if (typeof textLayer.$tabStrings[k] == "string") {
            var el = simpleDom.createFragment();
            el.textContent = textLayer.$tabStrings[k];
            textLayer.$tabStrings[k] = el;
        }
    });

    session.setValue(input);
    var length =  session.getLength();
    
    var outerEl = simpleDom.createElement("div");
    outerEl.className = theme.cssClass;
    
    var innerEl = simpleDom.createElement("div");
    innerEl.className = "ace_static_highlight" + (disableGutter ? "" : " ace_show_gutter");
    innerEl.style["counter-reset"] = "ace_line " + (lineStart - 1);

    for (var ix = 0; ix < length; ix++) {
        var lineEl = simpleDom.createElement("div");
        lineEl.className = "ace_line";
        
        if (!disableGutter) {
            var gutterEl = simpleDom.createElement("span");
            gutterEl.className ="ace_gutter ace_gutter-cell";
            gutterEl.textContent = ""; /*(ix + lineStart) + */
            lineEl.appendChild(gutterEl);
        }
        textLayer.$renderLine(lineEl, ix, false);
        lineEl.textContent += "\n";
        innerEl.appendChild(lineEl);
    }

    //console.log(JSON.stringify(outerEl, null, 2));
    //console.log(outerEl.toString());
    outerEl.appendChild(innerEl);

    return {
        css: baseStyles + theme.cssText,
        html: outerEl.toString(),
        session: session
    };
};

module.exports = highlight;
module.exports.highlight = highlight;
