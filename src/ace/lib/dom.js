/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

if (!require.def) require.def = require("requireJS-node")(module);

require.def("ace/lib/dom", ["ace/lib/lang"], function(lang) {

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