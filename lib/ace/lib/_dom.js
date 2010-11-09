/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org Services B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {

var lang = require("ace/lib/lang");

    var dom = {};

    dom.setText = function(elem, text) {
        if (elem.innerText !== undefined) {
            elem.innerText = text;
        }
        if (elem.textContent !== undefined) {
            elem.textContent = text;
        }
    };

    dom.hasCssClass = function(el, name) {
        var classes = el.className.split(/\s+/g);
        return lang.arrayIndexOf(classes, name) !== -1;
    };

    dom.addCssClass = function(el, name) {
        if (!dom.hasCssClass(el, name)) {
            el.className += " " + name;
        }
    };

    dom.removeCssClass = function(el, name) {
        var classes = el.className.split(/\s+/g);
        while (true) {
            var index = lang.arrayIndexOf(classes, name);
            if (index == -1) {
                break;
            }
            classes.splice(index, 1);
        }
        el.className = classes.join(" ");
    };

    dom.importCssString = function(cssText, doc){
        doc = doc || document;        

        if (doc.createStyleSheet) {
            var sheet = doc.createStyleSheet();
            sheet.cssText = cssText;
        }
        else {
            var style = doc.createElement("style");
            style.appendChild(doc.createTextNode(cssText));
            doc.getElementsByTagName("head")[0].appendChild(style);
        }            
    };
    
    dom.getInnerWidth = function(element) {
        return (parseInt(dom.computedStyle(element, "paddingLeft"))
                + parseInt(dom.computedStyle(element, "paddingRight")) + element.clientWidth);
    };

    dom.getInnerHeight = function(element) {
        return (parseInt(dom.computedStyle(element, "paddingTop"))
                + parseInt(dom.computedStyle(element, "paddingBottom")) + element.clientHeight);
    };

    dom.computedStyle = function(element, style) {
        if (window.getComputedStyle) {
            return (window.getComputedStyle(element, "") || {})[style] || "";
        }
        else {
            return element.currentStyle[style];
        }
    };

    dom.scrollbarWidth = function() {

        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement("div");
        var style = outer.style;

        style.position = "absolute";
        style.left = "-10000px";
        style.overflow = "hidden";
        style.width = "200px";
        style.height = "150px";

        outer.appendChild(inner);
        document.body.appendChild(outer);
        var noScrollbar = inner.offsetWidth;

        style.overflow = "scroll";
        var withScrollbar = inner.offsetWidth;

        if (noScrollbar == withScrollbar) {
            withScrollbar = outer.clientWidth;
        }

        document.body.removeChild(outer);

        return noScrollbar-withScrollbar;
    };

    return dom;
});