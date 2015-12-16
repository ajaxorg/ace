/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var TokenIterator = require("../token_iterator").TokenIterator;

var commonAttributes = [
    "accesskey",
    "class",
    "contenteditable",
    "contextmenu",
    "dir",
    "draggable",
    "dropzone",
    "hidden",
    "id",
    "inert",
    "itemid",
    "itemprop",
    "itemref",
    "itemscope",
    "itemtype",
    "lang",
    "spellcheck",
    "style",
    "tabindex",
    "title",
    "translate"
];

var eventAttributes = [
    "onabort",
    "onblur",
    "oncancel",
    "oncanplay",
    "oncanplaythrough",
    "onchange",
    "onclick",
    "onclose",
    "oncontextmenu",
    "oncuechange",
    "ondblclick",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "ondurationchange",
    "onemptied",
    "onended",
    "onerror",
    "onfocus",
    "oninput",
    "oninvalid",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onload",
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "onmousedown",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onmousewheel",
    "onpause",
    "onplay",
    "onplaying",
    "onprogress",
    "onratechange",
    "onreset",
    "onscroll",
    "onseeked",
    "onseeking",
    "onselect",
    "onshow",
    "onstalled",
    "onsubmit",
    "onsuspend",
    "ontimeupdate",
    "onvolumechange",
    "onwaiting"
];

var globalAttributes = commonAttributes.concat(eventAttributes);

var attributeMap = {
    "html": {"manifest": 1},
    "head": {},
    "title": {},
    "base": {"href": 1, "target": 1},
    "link": {"href": 1, "hreflang": 1, "rel": {"stylesheet": 1, "icon": 1}, "media": {"all": 1, "screen": 1, "print": 1}, "type": {"text/css": 1, "image/png": 1, "image/jpeg": 1, "image/gif": 1}, "sizes": 1},
    "meta": {"http-equiv": {"content-type": 1}, "name": {"description": 1, "keywords": 1}, "content": {"text/html; charset=UTF-8": 1}, "charset": 1},
    "style": {"type": 1, "media": {"all": 1, "screen": 1, "print": 1}, "scoped": 1},
    "script": {"charset": 1, "type": {"text/javascript": 1}, "src": 1, "defer": 1, "async": 1},
    "noscript": {"href": 1},
    "body": {"onafterprint": 1, "onbeforeprint": 1, "onbeforeunload": 1, "onhashchange": 1, "onmessage": 1, "onoffline": 1, "onpopstate": 1, "onredo": 1, "onresize": 1, "onstorage": 1, "onundo": 1, "onunload": 1},
    "section": {},
    "nav": {},
    "article": {"pubdate": 1},
    "aside": {},
    "h1": {},
    "h2": {},
    "h3": {},
    "h4": {},
    "h5": {},
    "h6": {},
    "header": {},
    "footer": {},
    "address": {},
    "main": {},
    "p": {},
    "hr": {},
    "pre": {},
    "blockquote": {"cite": 1},
    "ol": {"start": 1, "reversed": 1},
    "ul": {},
    "li": {"value": 1},
    "dl": {},
    "dt": {},
    "dd": {},
    "figure": {},
    "figcaption": {},
    "div": {},
    "a": {"href": 1, "target": {"_blank": 1, "top": 1}, "ping": 1, "rel": {"nofollow": 1, "alternate": 1, "author": 1, "bookmark": 1, "help": 1, "license": 1, "next": 1, "noreferrer": 1, "prefetch": 1, "prev": 1, "search": 1, "tag": 1}, "media": 1, "hreflang": 1, "type": 1},
    "em": {},
    "strong": {},
    "small": {},
    "s": {},
    "cite": {},
    "q": {"cite": 1},
    "dfn": {},
    "abbr": {},
    "data": {},
    "time": {"datetime": 1},
    "code": {},
    "var": {},
    "samp": {},
    "kbd": {},
    "sub": {},
    "sup": {},
    "i": {},
    "b": {},
    "u": {},
    "mark": {},
    "ruby": {},
    "rt": {},
    "rp": {},
    "bdi": {},
    "bdo": {},
    "span": {},
    "br": {},
    "wbr": {},
    "ins": {"cite": 1, "datetime": 1},
    "del": {"cite": 1, "datetime": 1},
    "img": {"alt": 1, "src": 1, "height": 1, "width": 1, "usemap": 1, "ismap": 1},
    "iframe": {"name": 1, "src": 1, "height": 1, "width": 1, "sandbox": {"allow-same-origin": 1, "allow-top-navigation": 1, "allow-forms": 1, "allow-scripts": 1}, "seamless": {"seamless": 1}},
    "embed": {"src": 1, "height": 1, "width": 1, "type": 1},
    "object": {"param": 1, "data": 1, "type": 1, "height" : 1, "width": 1, "usemap": 1, "name": 1, "form": 1, "classid": 1},
    "param": {"name": 1, "value": 1},
    "video": {"src": 1, "autobuffer": 1, "autoplay": {"autoplay": 1}, "loop": {"loop": 1}, "controls": {"controls": 1}, "width": 1, "height": 1, "poster": 1, "muted": {"muted": 1}, "preload": {"auto": 1, "metadata": 1, "none": 1}},
    "audio": {"src": 1, "autobuffer": 1, "autoplay": {"autoplay": 1}, "loop": {"loop": 1}, "controls": {"controls": 1}, "muted": {"muted": 1}, "preload": {"auto": 1, "metadata": 1, "none": 1 }},
    "source": {"src": 1, "type": 1, "media": 1},
    "track": {"kind": 1, "src": 1, "srclang": 1, "label": 1, "default": 1},
    "canvas": {"width": 1, "height": 1},
    "map": {"name": 1},
    "area": {"shape": 1, "coords": 1, "href": 1, "hreflang": 1, "alt": 1, "target": 1, "media": 1, "rel": 1, "ping": 1, "type": 1},
    "svg": {},
    "math": {},
    "table": {"summary": 1},
    "caption": {},
    "colgroup": {"span": 1},
    "col": {"span": 1},
    "tbody": {},
    "thead": {},
    "tfoot": {},
    "tr": {},
    "td": {"headers": 1, "rowspan": 1, "colspan": 1},
    "th": {"headers": 1, "rowspan": 1, "colspan": 1, "scope": 1},
    "form": {"accept-charset": 1, "action": 1, "autocomplete": 1, "enctype": {"multipart/form-data": 1, "application/x-www-form-urlencoded": 1}, "method": {"get": 1, "post": 1}, "name": 1, "novalidate": 1, "target": {"_blank": 1, "top": 1}},
    "fieldset": {"disabled": 1, "form": 1, "name": 1},
    "legend": {},
    "label": {"form": 1, "for": 1},
    "input": {
        "type": {"text": 1, "password": 1, "hidden": 1, "checkbox": 1, "submit": 1, "radio": 1, "file": 1, "button": 1, "reset": 1, "image": 31, "color": 1, "date": 1, "datetime": 1, "datetime-local": 1, "email": 1, "month": 1, "number": 1, "range": 1, "search": 1, "tel": 1, "time": 1, "url": 1, "week": 1},
        "accept": 1, "alt": 1, "autocomplete": {"on": 1, "off": 1}, "autofocus": {"autofocus": 1}, "checked": {"checked": 1}, "disabled": {"disabled": 1}, "form": 1, "formaction": 1, "formenctype": {"application/x-www-form-urlencoded": 1, "multipart/form-data": 1, "text/plain": 1}, "formmethod": {"get": 1, "post": 1}, "formnovalidate": {"formnovalidate": 1}, "formtarget": {"_blank": 1, "_self": 1, "_parent": 1, "_top": 1}, "height": 1, "list": 1, "max": 1, "maxlength": 1, "min": 1, "multiple": {"multiple": 1}, "pattern": 1, "placeholder": 1, "readonly": {"readonly": 1}, "required": {"required": 1}, "size": 1, "src": 1, "step": 1, "width": 1, "files": 1, "value": 1},
    "button": {"autofocus": 1, "disabled": {"disabled": 1}, "form": 1, "formaction": 1, "formenctype": 1, "formmethod": 1, "formnovalidate": 1, "formtarget": 1, "name": 1, "value": 1, "type": {"button": 1, "submit": 1}},
    "select": {"autofocus": 1, "disabled": 1, "form": 1, "multiple": {"multiple": 1}, "name": 1, "size": 1, "readonly":{"readonly": 1}},
    "datalist": {},
    "optgroup": {"disabled": 1, "label": 1},
    "option": {"disabled": 1, "selected": 1, "label": 1, "value": 1},
    "textarea": {"autofocus": {"autofocus": 1}, "disabled": {"disabled": 1}, "form": 1, "maxlength": 1, "name": 1, "placeholder": 1, "readonly": {"readonly": 1}, "required": {"required": 1}, "rows": 1, "cols": 1, "wrap": {"on": 1, "off": 1, "hard": 1, "soft": 1}},
    "keygen": {"autofocus": 1, "challenge": {"challenge": 1}, "disabled": {"disabled": 1}, "form": 1, "keytype": {"rsa": 1, "dsa": 1, "ec": 1}, "name": 1},
    "output": {"for": 1, "form": 1, "name": 1},
    "progress": {"value": 1, "max": 1},
    "meter": {"value": 1, "min": 1, "max": 1, "low": 1, "high": 1, "optimum": 1},
    "details": {"open": 1},
    "summary": {},
    "command": {"type": 1, "label": 1, "icon": 1, "disabled": 1, "checked": 1, "radiogroup": 1, "command": 1},
    "menu": {"type": 1, "label": 1},
    "dialog": {"open": 1}
};

var elements = Object.keys(attributeMap);

function is(token, type) {
    return token.type.lastIndexOf(type + ".xml") > -1;
}

function findTagName(session, pos) {
    var iterator = new TokenIterator(session, pos.row, pos.column);
    var token = iterator.getCurrentToken();
    while (token && !is(token, "tag-name")){
        token = iterator.stepBackward();
    }
    if (token)
        return token.value;
}

function findAttributeName(session, pos) {
    var iterator = new TokenIterator(session, pos.row, pos.column);
    var token = iterator.getCurrentToken();
    while (token && !is(token, "attribute-name")){
        token = iterator.stepBackward();
    }
    if (token)
        return token.value;
}

var HtmlCompletions = function() {

};

(function() {

    this.getCompletions = function(state, session, pos, prefix) {
        var token = session.getTokenAt(pos.row, pos.column);

        if (!token)
            return [];

        // tag name
        if (is(token, "tag-name") || is(token, "tag-open") || is(token, "end-tag-open"))
            return this.getTagCompletions(state, session, pos, prefix);

        // tag attribute
        if (is(token, "tag-whitespace") || is(token, "attribute-name"))
            return this.getAttributeCompletions(state, session, pos, prefix);
            
        // tag attribute values
        if (is(token, "attribute-value"))
            return this.getAttributeValueCompletions(state, session, pos, prefix);
            
        // HTML entities
        var line = session.getLine(pos.row).substr(0, pos.column);
        if (/&[A-z]*$/i.test(line))
            return this.getHTMLEntityCompletions(state, session, pos, prefix);

        return [];
    };

    this.getTagCompletions = function(state, session, pos, prefix) {
        return elements.map(function(element){
            return {
                value: element,
                meta: "tag",
                score: Number.MAX_VALUE
            };
        });
    };

    this.getAttributeCompletions = function(state, session, pos, prefix) {
        var tagName = findTagName(session, pos);
        if (!tagName)
            return [];
        var attributes = globalAttributes;
        if (tagName in attributeMap) {
            attributes = attributes.concat(Object.keys(attributeMap[tagName]));
        }
        return attributes.map(function(attribute){
            return {
                caption: attribute,
                snippet: attribute + '="$0"',
                meta: "attribute",
                score: Number.MAX_VALUE
            };
        });
    };

    this.getAttributeValueCompletions = function(state, session, pos, prefix) {
        var tagName = findTagName(session, pos);
        var attributeName = findAttributeName(session, pos);
        
        if (!tagName)
            return [];
        var values = [];
        if (tagName in attributeMap && attributeName in attributeMap[tagName] && typeof attributeMap[tagName][attributeName] === "object") {
            values = Object.keys(attributeMap[tagName][attributeName]);
        }
        return values.map(function(value){
            return {
                caption: value,
                snippet: value,
                meta: "attribute value",
                score: Number.MAX_VALUE
            };
        });
    };

    this.getHTMLEntityCompletions = function(state, session, pos, prefix) {
        var values = ['Aacute;', 'aacute;', 'Acirc;', 'acirc;', 'acute;', 'AElig;', 'aelig;', 'Agrave;', 'agrave;', 'alefsym;', 'Alpha;', 'alpha;', 'amp;', 'and;', 'ang;', 'Aring;', 'aring;', 'asymp;', 'Atilde;', 'atilde;', 'Auml;', 'auml;', 'bdquo;', 'Beta;', 'beta;', 'brvbar;', 'bull;', 'cap;', 'Ccedil;', 'ccedil;', 'cedil;', 'cent;', 'Chi;', 'chi;', 'circ;', 'clubs;', 'cong;', 'copy;', 'crarr;', 'cup;', 'curren;', 'Dagger;', 'dagger;', 'dArr;', 'darr;', 'deg;', 'Delta;', 'delta;', 'diams;', 'divide;', 'Eacute;', 'eacute;', 'Ecirc;', 'ecirc;', 'Egrave;', 'egrave;', 'empty;', 'emsp;', 'ensp;', 'Epsilon;', 'epsilon;', 'equiv;', 'Eta;', 'eta;', 'ETH;', 'eth;', 'Euml;', 'euml;', 'euro;', 'exist;', 'fnof;', 'forall;', 'frac12;', 'frac14;', 'frac34;', 'frasl;', 'Gamma;', 'gamma;', 'ge;', 'gt;', 'hArr;', 'harr;', 'hearts;', 'hellip;', 'Iacute;', 'iacute;', 'Icirc;', 'icirc;', 'iexcl;', 'Igrave;', 'igrave;', 'image;', 'infin;', 'int;', 'Iota;', 'iota;', 'iquest;', 'isin;', 'Iuml;', 'iuml;', 'Kappa;', 'kappa;', 'Lambda;', 'lambda;', 'lang;', 'laquo;', 'lArr;', 'larr;', 'lceil;', 'ldquo;', 'le;', 'lfloor;', 'lowast;', 'loz;', 'lrm;', 'lsaquo;', 'lsquo;', 'lt;', 'macr;', 'mdash;', 'micro;', 'middot;', 'minus;', 'Mu;', 'mu;', 'nabla;', 'nbsp;', 'ndash;', 'ne;', 'ni;', 'not;', 'notin;', 'nsub;', 'Ntilde;', 'ntilde;', 'Nu;', 'nu;', 'Oacute;', 'oacute;', 'Ocirc;', 'ocirc;', 'OElig;', 'oelig;', 'Ograve;', 'ograve;', 'oline;', 'Omega;', 'omega;', 'Omicron;', 'omicron;', 'oplus;', 'or;', 'ordf;', 'ordm;', 'Oslash;', 'oslash;', 'Otilde;', 'otilde;', 'otimes;', 'Ouml;', 'ouml;', 'para;', 'part;', 'permil;', 'perp;', 'Phi;', 'phi;', 'Pi;', 'pi;', 'piv;', 'plusmn;', 'pound;', 'Prime;', 'prime;', 'prod;', 'prop;', 'Psi;', 'psi;', 'quot;', 'radic;', 'rang;', 'raquo;', 'rArr;', 'rarr;', 'rceil;', 'rdquo;', 'real;', 'reg;', 'rfloor;', 'Rho;', 'rho;', 'rlm;', 'rsaquo;', 'rsquo;', 'sbquo;', 'Scaron;', 'scaron;', 'sdot;', 'sect;', 'shy;', 'Sigma;', 'sigma;', 'sigmaf;', 'sim;', 'spades;', 'sub;', 'sube;', 'sum;', 'sup;', 'sup1;', 'sup2;', 'sup3;', 'supe;', 'szlig;', 'Tau;', 'tau;', 'there4;', 'Theta;', 'theta;', 'thetasym;', 'thinsp;', 'THORN;', 'thorn;', 'tilde;', 'times;', 'trade;', 'Uacute;', 'uacute;', 'uArr;', 'uarr;', 'Ucirc;', 'ucirc;', 'Ugrave;', 'ugrave;', 'uml;', 'upsih;', 'Upsilon;', 'upsilon;', 'Uuml;', 'uuml;', 'weierp;', 'Xi;', 'xi;', 'Yacute;', 'yacute;', 'yen;', 'Yuml;', 'yuml;', 'Zeta;', 'zeta;', 'zwj;', 'zwnj;'];

        return values.map(function(value){
            return {
                caption: value,
                snippet: value,
                meta: "html entity",
                score: Number.MAX_VALUE
            };
        });
    };

}).call(HtmlCompletions.prototype);

exports.HtmlCompletions = HtmlCompletions;
});
