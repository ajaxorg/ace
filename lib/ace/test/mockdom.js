define(function(require, exports, module) {
"use strict";

var escapeHTML = require("../lib/lang").escapeHTML;
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
       dom.toggleCssClass(this.el, str);
    };
    this.contains = function(str) {
       dom.hasCssClass(this.el, str);
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
        this.setSelectionRange = function(start, end) {
            this.selectionStart = Math.min(start, this.value.length, end);
            this.selectionEnd = Math.min(end, this.value.length);
        };
        this.value = "";
        this.select = function() {
            this.setSelectionRange(0, Infinity);
        };
    },
    style: function() {
       this.sheet = {
           insertRule: function() {},
           cssRules: []
       };
    }
};

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
            this.children.forEach(function(ch) {
                clone.appendChild(ch.cloneNode(true));
            }, this);
        }
        return clone;
    };
    this.appendChild = function(node) {
        return this.insertBefore(node, null);
    };
    this.removeChild = function(node) {
        var i = this.children.indexOf(node);
        if (i == -1)
            throw new Error("not a child");
        node.parentNode = node.nextSibling = node.previousSibling = null;
        this.children.splice(i, 1);
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
        var i = this.children.indexOf(before);
        if (i == -1) i = this.children.length + 1;
        if (node.localName == "#fragment") {
            var children = node.children.slice();
            for (var j = 0; j < children.length; j++)
                this.insertBefore(children[j], before);
        }
        else {
            this.children.splice(i - 1, 0, node);
            node.nextSibling = this.children[i];
            node.previousSibling = this.children[i - 2];
            if (node.nextSibling)
                node.nextSibling.previousSibling = node;
            if (node.previousSibling)
                node.previousSibling.nextSibling = node;
            node.parentNode = this;
        }
        
        return node;
    };
    this.hasChildNodes = function() {
        return this.childNodes.length > 0;
    };
    this.__defineGetter__("childElementCount", function() {
        return this.childNodes.length;
    });
    this.hasAttributes = function() {
        return Object.keys(this.$attributes).length > 0;
    };
    this.querySelectorAll = function(selector) {
        var parts = selector.split(/((?:[^\s>"[]|"[^"]+"?|\[[^\]]*\]?)+)/);
        for (var i = 1; i < parts.length; i += 2) {
            parts[i] = parseSimpleSelector(parts[i]);
            if (/^ +$/.test(parts[i + 1])) parts[i + 1] = " ";
        }
        
        var nodes = [];
        function search(root, parts) {
            var operator = parts[0];
            var tests = parts[1];
            var iterator = operator == ">" ? walkShallow : walk;
            iterator(root, function(node) {
                var isAMatch = tests.every(function(t) {return t(node);});
                if (isAMatch) {
                    if (parts.length > 3) search(node, parts.slice(2));
                    else nodes.push(node);
                }
            });
        }
        search(this, parts);
        return nodes;
    };
    this.querySelector = function(s) {
        return this.querySelectorAll(s)[0];
    };
    this.getElementsByTagName = function(s) {
        var nodes = [];
        walk(this, function(node) {
            if (node.localName == s)
                nodes.push(node);
        });
        return nodes;
    };
    this.getElementById = function(s) {
        return walk(this, function(node) {
            // console.log(node.getAttribute && node.getAttribute("id"))
            if (node.getAttribute && node.getAttribute("id") == s)
                return node;
        });
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
        return this.children.map(function(ch) {
            return "outerHTML" in ch ? ch.outerHTML : escapeHTML(ch.data);
        }).join("");
    });
    this.__defineGetter__("outerHTML", function() {
        var attributes = this.attributes.map(function(attr) {
            return attr.name + "=" + JSON.stringify(attr.value);
        }, this).join(" ");
        return "<" + this.localName + (attributes ? " " + attributes : "") + ">" + this.innerHTML + "</" + this.localName + ">";
    });
    this.__format = function(indent) {
        if (!indent) indent = "";
        var attributes = this.attributes.map(function(attr) {
            return attr.name + "=" + JSON.stringify(attr.value);
        }, this).join(" ");
        return indent + "<" + this.localName + (attributes ? " " + attributes : "") + ">" + 
            this.children.map(function(ch) {
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
    this.getBoundingClientRect = function(v) {
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
        else if (this.style.width == "auto" || this.localName == "span") {
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
            var rect = this.parentNode.getBoundingClientRect();
            
            left = parseCssLength(this.style.left || "0", rect.width);
            top = parseCssLength(this.style.top || "0", rect.height);
            var right = parseCssLength(this.style.right || "0", rect.width);
            var bottom = parseCssLength(this.style.bottom || "0", rect.width);

            if (this.style.width)
                width = parseCssLength(this.style.width || "100%", rect.width);
            else
                width = rect.width - right - left;
            
            if (this.style.width)
                height = parseCssLength(this.style.height || "100%", rect.height);
            else
                height = rect.height - top - bottom;
            
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
        events && events.forEach(function(listener) {
            if (!e.stopped)
                listener.call(this, e);
        }, this);
        if (!e.stopped && this["on" + e.type])
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
        if (document.activeElement)
            document.activeElement.dispatchEvent({type: "blur"});
        document.activeElement = this;
        this.dispatchEvent({type: "focus"});
    };
    this.blur = function() {
        document.body.focus();
    };
    
    function removeAllChildren(node) {
        node.children.forEach(function(node) {
            node.parentNode = null;
        });
        node.children.length = 0;
        if (!document.contains(document.activeElement))
            document.activeElement = document.body;
    }
}).call(Node.prototype);

function parseSimpleSelector(selector) {
    var tests = [];
    selector.replace(
        /([#.])?([\w-]+)|\[\s*([\w-]+)\s*(?:=\s*([\w-]+)\s*)?\]|\*|./g,
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
                tests.push(function(node) {
                    return node.getAttribute(attr) == attrValue;
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
            if (encoded == "gt") {
                skipped += ">";
            } else if (encoded == "lt") {
                skipped += "<";
            } else if (encoded == "amp") {
                skipped += "&";
            }
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
                attributes && attributes.replace(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^"]*)'|(\w+))/g, function(_, key, v1,v2,v3) {
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
    var children = node.children || [];
    for (var i = 0; i < children.length; i++) {
        var result = fn(children[i]) || walk(children[i], fn);
        if (result)
            return result;
    }
}
function walkShallow(node, fn) {
    var children = node.children || [];
    for (var i = 0; i < children.length; i++) {
        var result = fn(children[i]);
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
    document.head = new Node("head");
    document.documentElement.appendChild(document.head);
    document.documentElement.appendChild(document.body);
    return document;
};
window.Document.prototype = Node.prototype;

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
if (typeof Buffer != undefined) {
    window.btoa = function(str) {
        return Buffer.from(str.toString(), "binary").toString("base64");
    };
    window.atob = function(str) {
        return Buffer.from(str, "base64").toString("binary");
    };
}

var addedProperties = [];
exports.load = function() {
    if (typeof global == "undefined") return;
    window.window = global;
    Object.keys(window).forEach(function(i) {
        if (!global[i]) {
            addedProperties.push(i);
            global.__defineGetter__(i, function() {
                return window[i];
            });
            global.__defineSetter__(i, function() {
            });
        }
    });
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
        }
        Object.defineProperty(
            global.document, 
            i, 
            {
                value: val,
                enumerable: true,
                configurable: true
            }
        );
    }
};

exports.unload = function() {
    if (typeof global == "undefined") return;
    var req = require;
    var cache = req("module")._cache;
    delete cache[__filename];
    addedProperties.forEach(function(i) {
        delete global[i];
    });
};

exports.load();

});
