"use strict";
/*global Uint8ClampedArray*/

var dom = require("../lib/dom");

var CHAR_HEIGHT = 10;
var CHAR_WIDTH = 6;
var WINDOW_HEIGHT = 768;
var WINDOW_WIDTH = 1024;

function Style() {
    
}
Style.prototype.getPropertyValue = function() { return ""; };
Style.prototype.__defineGetter__("cssText", function() {
    var cssText = "";
    Object.keys(this).forEach(function(key) {
        if (this[key])
            cssText += (cssText ? " " : "") +  key + ": " + this[key] + ";";
    }, this);
    return cssText;
});
Style.prototype.__defineSetter__("cssText", function(value) {
    Object.keys(this).forEach(function(key) {
        delete this[key];
    }, this);
    value.split(";").forEach(function(key) {
        var parts = key.split(":");
        if (parts.length == 2)
            this[parts[0].trim()] = parts[1].trim();
    }, this);
});

function ClassList(node) {
    this.el = node;
}
(function() {
    this.add = function(str) {
       dom.addCssClass(this.el, str);
    };
    this.remove = function(str) {
       dom.removeCssClass(this.el, str);
    };
    this.toggle = function(str) {
       return dom.toggleCssClass(this.el, str);
    };
    this.contains = function(str) {
       return dom.hasCssClass(this.el, str);
    };
}).call(ClassList.prototype);


function Attr(name, value) {
    this.name = name;
    this.value = value;
}
(function() {
    this.__defineGetter__("nodeValue", function() {
        return this.value;
    });
}).call(Attr.prototype);

var initializers = {
    textarea: function() {
        this.selectionStart = this.selectionEnd = 0;
        this.setSelectionRange = function(start, end) {
            this.selectionStart = Math.min(start, this.value.length, end);
            this.selectionEnd = Math.min(end, this.value.length);
        };
        var value = "";
        this.__defineGetter__("value", function() {
            return value;
        });
        this.__defineSetter__("value", function(newValue) {
            if (typeof newValue != "string") newValue = newValue.toString();
            if (newValue != value) {
                value = newValue;
                this.selectionStart = this.selectionEnd = value.length;
            }
        });
        this.oncut = this.oncopy = this.onpaste = null;
        this.select = function() {
            this.setSelectionRange(0, Infinity);
        };
    },
    input: function() {
        initializers.textarea.call(this);
    },
    style: function() {
       this.sheet = {
           insertRule: function() {},
           cssRules: []
       };
    },
    a: function() {
        this.__defineGetter__("href", function() {
            return this.getAttribute("href");
        });
        this.__defineSetter__("href", function(v) {
            return this.setAttribute("href", v);
        });
    },
    canvas: function() {
        this.getContext = function (contextId, options) {
            if (this._contextMock !== undefined) return this._contextMock;
            return this._contextMock = new Context2d(this.width, this.height);
        };
    }
};

function Context2d(w, h) {
    this.width = w;
    this.height = h;
    this.points = new Uint8ClampedArray(4 * this.width * this.height);
    this.fillStyle = [0, 0, 0, 0];
}
(function() {
    this.clearRect = function(x, y, w, h) {
        var fillStyle = this.fillStyle;
        this.fillStyle = [0, 0, 0, 0];
        this.fillRect(x, y, w, h);
        this.fillStyle = fillStyle;
    };
    this.fillRect = function(x, y, w, h) {
        var fillStyle = this.fillStyle;
        if (typeof fillStyle == "string")
            fillStyle = this.fillStyle = this.$parseColor(this.fillStyle);
        for (var i = x; i < w + x; i++) {
            for (var j = y; j < h + y; j++) {
                var index = (this.width * j + i) * 4;
                for (var k = 0; k < 4; k++)
                    this.points[index++] = fillStyle[k];
            }
        }
    };
    this.getImageData = function(sx, sy, sw, sh) {
        var data = new Uint8ClampedArray(sw * sh * 4);
        var newIndex = 0;
        for (var i = sx; i < sw + sy; i++) {
            for (var j = sy; j < sh + sy; j++) {
                var index = (this.width * j + i) * 4;
                for (var k = 0; k < 4; k++)
                    data[newIndex++] = this.points[index++];
            }
        }
        return {
            data: data
        };
    };
    this.$parseColor = function(str) {
        var color = str.match(/\(([^,)]+),([^,)]+),([^,)]+)(?:,([^,)]+))?/).slice(1);
        color[3] = Math.round((color[3] ? parseFloat(color[3]) : 1) * 255);
        for (var i = 0; i < 3; i++) {
            color[i] = parseInt(color[i]);
        }
        return color;
    };
}).call(Context2d.prototype);



function getItem(i) { return this[i]; }

function Node(name) {
    this.localName = name;
    this.value = "";
    this.children = this.childNodes = [];
    this.childNodes.item = getItem;
    this.ownerDocument = window.document || this;
    this.$attributes = {};
    this.style = new Style();
    if (initializers.hasOwnProperty(name))
        initializers[name].call(this);
}
(function() {
    this.nodeType = 1;
    this.ELEMENT_NODE = 1;
    this.TEXT_NODE = 1;
    this.cloneNode = function(recursive) {
        var clone = new Node(this.localName);
        for (var i in this.$attributes) {
            clone.setAttribute(i, this.$attributes[i]);
        }
        if (recursive) {
            this.childNodes.forEach(function(ch) {
                clone.appendChild(ch.cloneNode(true));
            }, this);
        }
        return clone;
    };
    this.appendChild = function(node) {
        return this.insertBefore(node, null);
    };
    this.removeChild = function(node) {
        var i = this.childNodes.indexOf(node);
        if (i == -1)
            throw new Error("not a child");
        node.parentNode = node.nextSibling = node.previousSibling = null;
        this.childNodes.splice(i, 1);
        if (!document.contains(document.activeElement))
            document.activeElement = document.body;
    };
    this.remove = function() {
        this.parentNode && this.parentNode.removeChild(this);
    };
    this.replaceChild = function(node, oldNode) {
        this.insertBefore(node, oldNode);
        this.removeChild(oldNode);
        return oldNode;
    };
    this.insertBefore = function(node, before) {
        if (node.parentNode)
            node.parentNode.removeChild(node);
        var i = this.childNodes.indexOf(before);
        if (i == -1) i = this.childNodes.length + 1;
        if (node.localName == "#fragment") {
            var children = node.childNodes.slice();
            for (var j = 0; j < children.length; j++)
                this.insertBefore(children[j], before);
        }
        else {
            this.childNodes.splice(i, 0, node);
            node.nextSibling = this.childNodes[i];
            node.previousSibling = this.childNodes[i - 2];
            if (node.nextSibling)
                node.nextSibling.previousSibling = node;
            if (node.previousSibling)
                node.previousSibling.nextSibling = node;
            node.parentNode = this;
        }
        
        return node;
    };
    this.before = function(node) {
        if (this.parentNode) this.parentNode.insertBefore(node, this);
    };
    this.hasChildNodes = function() {
        return this.childNodes.length > 0;
    };
    this.__defineGetter__("childElementCount", function() {
        return this.children.length;
    });
    this.hasAttribute = function(x) {
        return this.$attributes.hasOwnProperty(x);
    };
    this.hasAttributes = function() {
        return Object.keys(this.$attributes).length > 0;
    };
    this.querySelectorAll = function(selector) {
        return querySelector(this, selector, true);
    };
    this.querySelector = function(selector) {
        return querySelector(this, selector, false)[0];
    };
    function querySelector(node, selector, all) {
        var parts = parseSelector(selector);
        
        var nodes = [];
        walk(node, function(node) {
            if (node.matches && node.matches(parts)) {
                nodes.push(node);
                if (!all) return true;
            }
        });
        return nodes;
    }
    this.getElementsByTagName = function(s) {
        var nodes = [];
        walk(this, function(node) {
            if (node.localName == s)
                nodes.push(node);
        });
        return nodes;
    };
    this.matches = function(selector) {
        var parts = parseSelector(selector);
        var node = this;
        var operator = parts.pop();
        var tests = parts.pop();
        while (node && node.nodeType != 9) {
            if (!tests) return true;
            var isAMatch = tests.every(function(t) {return t(node);});
            if (!isAMatch) {
                if (!operator || operator === ">")
                    return false;
            } else {
                operator = parts.pop();
                tests = parts.pop();
            }
            node = node.parentNode;
        }
        return !tests;
    };
    this.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el != null && el.nodeType === 1);
        return null;
    };
    this.removeAttribute = function(a) {
        delete this.$attributes[a];
    };
    this.setAttribute = function(a, v) {
        this.$attributes[a] = v;
    };
    this.getAttribute = function(a, v) {
        return String(this.$attributes[a] || "");
    };
    this.__defineGetter__("nodeName", function() {
        return this.localName;
    });
    this.__defineGetter__("tagName", function() {
        return this.localName;
    });
    this.__defineGetter__("attributes", function() {
        var style = this.style.cssText;
        if (style)
            this.$attributes.style = style;
        var attributes = Object.keys(this.$attributes).map(function(key) {
            return new Attr(key, this.$attributes[key]);
        }, this);
        attributes.item = getItem;
        return attributes;
    });
    this.__defineGetter__("classList", function() {
        return this.$classList || (this.$classList = new ClassList(this));
    });
    this.__defineGetter__("className", function() {
        return this.$attributes.class || "";
    });
    this.__defineSetter__("className", function(v) {
        this.$attributes.class = v;
    });
    this.__defineGetter__("textContent", function() {
        var v = "";
        walk(this, function(node) {
            if (node instanceof TextNode)
                v += node.data;
        });
        return v;
    });
    this.__defineSetter__("textContent", function(v) {
        removeAllChildren(this);
        this.appendChild(new TextNode(v));
    });
    this.__defineGetter__("innerText", function() {
        if (!this.documentElement)
            throw new Error("use textContent");
    });
    this.__defineSetter__("innerText", function(v) {
        throw new Error("use textContent");
    });
    
    this.__defineGetter__("id", function() {
        return this.getAttribute("id");
    });
    this.__defineSetter__("id", function(v) {
        this.setAttribute("id", v);
    });
    this.__defineGetter__("parentElement", function() {
        return this.parentNode == document ? null : this.parentNode;
    });
    this.__defineGetter__("innerHTML", function() {
        return this.childNodes.map(function(ch) {
            return "outerHTML" in ch ? ch.outerHTML : escapeHTML(ch.data);
        }).join("");
    });
    this.__defineGetter__("outerHTML", function() {
        var attributes = this.attributes.map(function(attr) {
            return attr.name + "=" + JSON.stringify(attr.value + "");
        }, this).join(" ");
        return "<" + this.localName + (attributes ? " " + attributes : "") + ">" + this.innerHTML + "</" + this.localName + ">";
    });
    this.__format = function(indent) {
        if (!indent) indent = "";
        var attributes = this.attributes.map(function(attr) {
            return attr.name + "=" + JSON.stringify(attr.value);
        }, this).join(" ");
        return indent + "<" + this.localName + (attributes ? " " + attributes : "") + ">" + 
            this.childNodes.map(function(ch) {
                return "__format" in ch ? "\n" + ch.__format(indent + "    ") : escapeHTML(ch.data);
            }).join("")
            + "\n" + indent + "</" + this.localName + ">";
    };
    this.__defineSetter__("innerHTML", function(v) {
        removeAllChildren(this);
        setInnerHTML(v, this);
    });
    this.insertAdjacentHTML = function(position, markup) {
        var element = document.createDocumentFragment();
        setInnerHTML(markup, element);
        this.insertAdjacentElement(position, element);
    };
    this.insertAdjacentElement = function(position, element) {
        position = position.toLowerCase();
        if (position === "beforeend") this.appendChild(element);
        if (position === "afterend") this.parentElement.insertBefore(element, this.nextSibling);
        if (position === "afterbegin") this.insertBefore(element, this.firstChild);
        if (position === "beforebegin") this.parentElement.insertBefore(element, this);
    };
    this.getBoundingClientRect = function(fromChild) {
        var width = 0;
        var height = 0;
        var top = 0;
        var left = 0;
        if (this == document.documentElement) {
            width = WINDOW_WIDTH;
            height = WINDOW_HEIGHT;
        }
        else if (!document.contains(this) || this.style.display == "none") {
            width = height = 0;
        }
        else if (this.style.width == "auto" || this.localName == "span" || /^inline/.test(this.style.display)) {
            width = this.textContent.length * CHAR_WIDTH;
            var node = this;
            while (node) {
                if (node.style.fontSize) {
                    height = parseInt(node.style.fontSize);
                    break;
                }
                node = node.parentNode;
            }
            if (!height) height = CHAR_HEIGHT;
        }
        else if (this.parentNode) {
            // prevent recursion by passing -1
            var rect = fromChild == -1 
                ? {top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0} 
                : this.parentNode.getBoundingClientRect();
            
            left = parseCssLength(this.style.left || "0", rect.width);
            top = parseCssLength(this.style.top || "0", rect.height);
            var right = parseCssLength(this.style.right || "0", rect.width);
            var bottom = parseCssLength(this.style.bottom || "0", rect.width);

            if (this.style.width)
                width = parseCssLength(this.style.width || "100%", rect.width);
            else if (this.style.widthHint)
                width = this.style.widthHint;
            else
                width = rect.width - right - left;
            
            if (this.style.height)
                height = parseCssLength(this.style.height || "100%", rect.height);
            else if (this.style.heightHint)
                height = this.style.heightHint;
            else
                height = rect.height - top - bottom;

            var maxWidth = this.style.maxWidth && parseCssLength(this.style.maxWidth, rect.width);
            var maxHeight = this.style.maxHeight && parseCssLength(this.style.maxHeight, rect.height);
            
            if (maxWidth >= 0) width = Math.min(width, maxWidth);
            if (maxHeight >= 0) height = Math.min(height, maxHeight);
            
            if (!height && !this.style.height && this.firstChild && this.firstChild.getBoundingClientRect && !fromChild) {
                height = this.firstChild.getBoundingClientRect(-1).height;
            }
            
            top += rect.top;
            bottom += rect.bottom;
        }
        return {top: top, left: left, width: width, height: height, right: left + width, bottom: top + height};
    };

    function parseCssLength(styleString, parentSize) {
        // TODO support calc
        var size = parseFloat(styleString) || 0;
        if (/%/.test(styleString))
            size = parentSize * size / 100;
        return size;
    }

    this.__defineGetter__("clientHeight", function() {
        return this.getBoundingClientRect().height;
    });
    this.__defineGetter__("clientWidth", function() {
        return this.getBoundingClientRect().width;
    });
    this.__defineGetter__("offsetHeight", function() {
        return this.getBoundingClientRect().height;
    });
    this.__defineGetter__("offsetWidth", function() {
        return this.getBoundingClientRect().width;
    });

    this.__defineGetter__("lastChild", function() {
        return this.childNodes[this.childNodes.length - 1];
    });
    this.__defineGetter__("firstChild", function() {
        return this.childNodes[0];
    });
    // TODO this is a waorkaround for scrollHeight usage in virtualRenderer
    this.scrollHeight = 1;


    this.addEventListener = function(name, listener, capturing) {
        if (!listener) {
            console.trace();
            throw new Error("attempting to add empty listener");
        }
        if (!this._events) this._events = {};
        if (!this._events[name]) this._events[name] = [];
        var i = this._events[name].indexOf(listener);
        if (i == -1)
            this._events[name][capturing ? "unshift" : "push"](listener);
    };
    this.removeEventListener = function(name, listener) {
        if (!this._events) return;
        if (!this._events[name]) return;
        var i = this._events[name].indexOf(listener);
        if (i !== -1)
            this._events[name].splice(i, 1);
    };
    this.createEvent = function(v) {
        return new Event();
    };
    this.dispatchEvent = function(e) {
        if (!e.target) e.target = this;
        if (!e.timeStamp) e.timeStamp = Date.now();
        e.currentTarget = this;
        var events = this._events && this._events[e.type];
        events && events.slice().forEach(function(listener) {
            listener.call(this, e);
        }, this);
        if (this["on" + e.type])
            this["on" + e.type](e);
        if (!e.bubbles || e.stopped) return;
        if (this.parentNode)
            this.parentNode.dispatchEvent(e);
        else if (this != window)
            window.dispatchEvent(e);
    };
    this.contains = function(node) {
        while (node) {
            if (node == this) return true;
            node = node.parentNode;
        }
    };
    this.focus = function() {
        if (document.activeElement == this)
            return;
        var oldFocused = document.activeElement;
        document.activeElement = this;
        if (oldFocused)
            oldFocused.dispatchEvent({type: "blur"});
        this.dispatchEvent({type: "focus"});
    };
    this.blur = function() {
        if (document.activeElement == this)
            document.body.focus();
    };
    function removeAllChildren(node) {
        node.childNodes.forEach(function(node) {
            node.parentNode = null;
        });
        node.childNodes.length = 0;
        if (!document.contains(document.activeElement))
            document.activeElement = document.body;
    }
}).call(Node.prototype);

function parseSelector(selector) {
    if (Array.isArray(selector)) return selector.slice();
    var parts = selector.split(/((?:[^\s>"[]|"[^"]+"?|\[[^\]]*\]?)+)/);
    for (var i = 1; i < parts.length; i += 2) {
        parts[i] = parseSimpleSelector(parts[i]);
        if (/^ +$/.test(parts[i + 1])) parts[i + 1] = " ";
    }
    return parts;
}
function parseSimpleSelector(selector) {
    var tests = [];
    selector.replace(
        /([#.])?([\w-]+)|\[\s*([\w-]+)\s*(?:=\s*["']?([\w-]+)["']?\s*)?\]|\*|./g,
        function(_, hash, name, attr, attrValue) {
            if (hash == "#") {
                tests.push(function(node) { return node.id == name; });
            }
            else if (hash == ".") {
                var re = new RegExp("(^|\\s)" + name + "($|\\s)");
                tests.push(function(node) { return re.test(node.className); });
            }
            else if (name) {
                tests.push(function(node) { return node.localName == name; });
            }
            else if (attr) {
                tests.push(attrValue != undefined ? function(node) {
                    return node.getAttribute && node.getAttribute(attr) == attrValue;
                } : function(node) {
                    return node.hasAttribute && node.hasAttribute(attr);
                });
            }
            else if (_ == "*") {
                tests.push(function(node) {
                    return true;
                });
            }
            else {
                throw new Error("Error parsing selector " + selector + "|" + _);
            }
        }
    );
    return tests;
}

function setInnerHTML(markup, parent, strict) {
    var root = parent;
    var tagRe = /<(\/?[\w:\-]+|!)|&(?:(#?\w+);)|$/g;
    var skipped = "";

    for (var m, lastIndex = 0; m = tagRe.exec(markup);) {
        skipped += markup.substring(lastIndex, m.index);
        var encoded = m[2];
        if (encoded) {
            skipped += parseCharacterEntity(encoded);
            lastIndex = tagRe.lastIndex;
        } else {
            if (m[1] == "!") {
                skipped += parseDocType(markup, tagRe, strict);
                lastIndex = tagRe.lastIndex;
                continue;
            }
            if (skipped) {
                root.appendChild(document.createTextNode(skipped));
                skipped = "";
            }
            var end = markup.indexOf(">", tagRe.lastIndex);
            var selfClosing = markup[end - 1] === "/" ? 1 : 0;
            var attributes = markup.slice(tagRe.lastIndex, end - selfClosing).trim();
            
            tagRe.lastIndex = lastIndex = end < 0 ? markup.length : end + 1;
        
            if (!m[1]) {
                if (strict && root != parent)
                    throw new Error("Invalid XML message:");
                return;
            }
            if (m[1][0] !== "/") {
                var tagName = m[1];
                if (/:/.test(tagName)) {
                    var i = tagName.indexOf(":");
                    var prefix = tagName.slice(0, i);
                    tagName = tagName.slice(i+1);
                    root = root.appendChild(document.createElement(tagName));
                    root.prefix = prefix;
                } else {
                    root = root.appendChild(document.createElement(tagName));
                }
                attributes && attributes.replace(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\w+))/g, function(_, key, v1,v2,v3) {
                    root.setAttribute(key, v1 || v2 || v3 || key);
                });
            } 
            if (m[1][0] === "/" || selfClosing) {
                if (root != parent)
                    root = root.parentNode;
            }
        }
    }
    if (strict && root != parent)
        throw new Error("Invalid XML message:");
}
function parseCharacterEntity(encoded) {
    if (encoded[0] == "#") {
        var charCode = encoded.slice(1);
        if (charCode[0] == "x")
            return String.fromCharCode(parseInt(charCode.slice(1), 16));
        return String.fromCharCode(parseInt(charCode, 10));
    }
    if (encoded == "gt") return ">";
    if (encoded == "lt") return "<";
    if (encoded == "amp") return "&";
    if (encoded == "quot") return '"';
    
    console.error("Skipping unsupported character entity", encoded);
    return "";
}
function parseDocType(markup, tagRe, strict) {
    var start = tagRe.lastIndex;
    var end = -1;
    var text = "";
    if (markup[start] == "-" && markup[start + 1] == "-") {
        end = markup.indexOf("-->", start + 2);
        if (end != -1) end += 3;
    } else if (strict && markup.substr(start, 7) == "[CDATA[") {
        end = markup.indexOf("]]>", start);
        text = markup.slice(start + 7, end);
        end += 3;
    } else {
        end = markup.indexOf(">", start);
        if (end != -1) end += 1;
    }
    if (end == -1) end = markup.length;
    tagRe.lastIndex = end;
    return text;
}
function escapeHTML(str) {
    return str.replace(/[<>&]/g, function(char) {
        if (char == "<") return "&lt;";
        if (char == ">") return "&gt;";
        if (char == "&") return "&amp;";
    });
}

function Event(type, options) {
    this.type = type;
    Object.assign(this, options);
}
(function() {
    this.initMouseEvent = function(
        type, _1, _2, window,
        detail, x, y, _x, _y,
        ctrl, alt, shift, meta,
        button, relatedTarget
    ) {
        this.bubbles = true;
        this.type = type;
        this.detail = detail || 0;
        this.clientX = x;
        this.clientY = y;
        this.button = button;
        this.relatedTarget = relatedTarget;
        this.ctrlKey = ctrl;
        this.altKey = alt;
        this.shiftKey = shift;
        this.metaKey = meta;
    };
    this.preventDefault = function() {
        this.defaultPrevented = true;
    };
    this.stopPropagation = function() {
        this.stopped = true;
    };
}).call(Event.prototype);

function walk(node, fn) {
    var children = node.childNodes || [];
    for (var i = 0; i < children.length; i++) {
        var result = fn(children[i]) || walk(children[i], fn);
        if (result)
            return result;
    }
}

function TextNode(value) {
    this.data = value || "";
}
(function() {
    this.nodeType = 3;
    this.ELEMENT_NODE = 1;
    this.TEXT_NODE = 1;
    this.cloneNode = function() {
        return new TextNode(this.data);
    };
    this.__defineGetter__("nodeValue", function() {
        return this.data;
    });
}).call(TextNode.prototype);

var window = {
    get innerHeight() {
        return WINDOW_HEIGHT;
    },
    get innerWidth() {
        return WINDOW_WIDTH;
    }
};
window.navigator = {userAgent: "node", platform: "win", appName: ""};
window.HTMLDocument = window.XMLDocument = window.Document = function() {
    var document = this;
    if (!window.document) window.document = document;
    Node.call(this, "#document");
    this.nodeType = 9;
    document.navigator = window.navigator;
    document.styleSheets = [];
    document.createElementNS = function(ns, t) {
        return new Node(t);
    };
    document.createElement = function(t) {
        return new Node(t);
    };
    document.createComment =
    document.createTextNode = function(v) {
        return new TextNode(v);
    };
    document.createDocumentFragment = function() {
        return new Node("#fragment");
    };
    document.hasFocus = function() {
        return true;
    };
    document.execCommand = function() {};
    document.documentElement = document.appendChild(new Node("html"));
    document.body = new Node("body");
    document.activeElement = document.body;
    document.head = new Node("head");
    document.documentElement.appendChild(document.head);
    document.documentElement.appendChild(document.body);
    return document;
};
window.Document.prototype = Object.create(Node.prototype);
(function() {
    this.getElementById = function(s) {
        return walk(this, function(node) {
            if (node.getAttribute && node.getAttribute("id") == s)
                return node;
        });
    };
}.call(window.Document.prototype));

window.DOMParser = function() {
    this.parseFromString = function(str, mode) {
        var document = new window.Document({});
        if (mode == "text/xml" || mode == "application/xml") {
            var markup = str.replace(/<\?([^?]|\?[^>])+\?>/g, "").trim();
            document.innerHTML = "";
            setInnerHTML(markup, document, true);
            document.documentElement = document.firstChild;
        } else {
            document.body.innerHTML = str;
        }
        return document;
    };
};

var document = new window.Document();
window.__defineGetter__("document", function() {return document;});
window.document.defaultView = window;

window.setTimeout = setTimeout;
window.clearTimeout = clearTimeout;
window.getComputedStyle = function(node) {
    return node.style;
};
window.addEventListener = document.addEventListener.bind(window);
window.removeEventListener = document.removeEventListener.bind(window);
window.dispatchEvent = document.dispatchEvent.bind(window);
window.name = "nodejs";
window.focus = function() {};

window.Node = window.Element = Node;
window.Text = window.TextNode = TextNode;
window.Attr = Attr;
window.window = window;
window.CustomEvent = window.Event = window.KeyboardEvent = Event;
window.requestAnimationFrame = function(callback) {
    return setTimeout(function() {
        callback();
    });
};

/*global Buffer*/
if (typeof Buffer != "undefined") {
    window.btoa = function(str) {
        return Buffer.from(str.toString(), "binary").toString("base64");
    };
    window.atob = function(str) {
        return Buffer.from(str, "base64").toString("binary");
    };
}

var originalProperties = {};
var overriddenValues = {};
var loaded = false;
var overridableProperties = ["setTimeout", "clearTimeout", "getComputedStyle"];
exports.load = function() {
    if (loaded || typeof global == "undefined") return;
    window.window = global;
    Object.keys(window).forEach(function(i) {
        var desc = Object.getOwnPropertyDescriptor(global, i);
        originalProperties[i] = desc;
        global.__defineGetter__(i, function() {
            return overriddenValues[i] || window[i];
        });
        global.__defineSetter__(i, function(value) {
            if (!overridableProperties.includes(i)) {
                console.log("attempt to set " + i);
            } else if (value === window[i]) {
                delete overriddenValues[i];
                if (!loaded) {
                    unloadProperty(i);
                }
            } else {
                overriddenValues[i] = value;
            }
        });
    });
    loaded = true;
};

exports.loadInBrowser = function(global) {
    delete global.ResizeObserver;
    global.__origRoot__ = global.document.documentElement;
    global.__origBody__ = global.document.body;
    Object.keys(window).forEach(function(i) {
        if (i != "document" && i != "window") {
            delete global[i];
            global[i] = window[i];
        }
    });
    for (var i in window.document) {
        var val = window.document[i];
        if (typeof val == "function") {
            if (i == "createElement") {
                global.document.createElementOrig = global.document.createElement;
                val = function(n) {
                    if (n == "script")
                        return global.document.createElementOrig(n);
                    return window.document.createElement(n);
                };
            }
            val = val.bind(window.document);
            Object.defineProperty(
                global.document, 
                i, 
                {
                    value: val,
                    enumerable: true,
                    configurable: true
                }
            );
        } else {
            Object.defineProperty(
                global.document, 
                i, 
                {
                    get: function(name) {
                        return window.document[name];
                    }.bind(null, i),
                    enumerable: true,
                    configurable: true
                }
            );
        }
    }
    loaded = true;
};

function unloadProperty(name) {
    if (global[name] === window[name]) {
        delete global[name];
        if (originalProperties[name]) {
            Object.defineProperty(global, name, originalProperties[name]);
            delete originalProperties[name];
        }
    }
}

exports.unload = function() {
    if (typeof global == "undefined") return;
    var req = require;
    var cache = req("module")._cache;
    delete cache[__filename];
    Object.keys(originalProperties).forEach(function(name) {
        unloadProperty(name);
    });
    loaded = false;
};

exports.load();
