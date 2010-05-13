(function() {

    var self = this;

    this.setText = function(elem, text) {
        if (elem.innerText !== undefined) {
            elem.innerText = text;
        }
        if (elem.textContent !== undefined) {
            elem.textContent = text;
        }
    };

    this.hasCssClass = function(el, name) {
        var classes = el.className.split(/\s+/g);
        return ace.arrayIndexOf(classes, name) !== -1;
    };


    this.addCssClass = function(el, name) {
        if (!this.hasCssClass(el, name)) {
            el.className += " " + name;
        }
    };

    this.removeCssClass = function(el, name) {
        var classes = el.className.split(/\s+/g);
        while (true) {
            var index = ace.arrayIndexOf(classes, name);
            if (index == -1) {
                break;
            }
            classes.splice(index, 1);
        }
        el.className = classes.join(" ");
    };

    this.getInnerWidth = function(element) {
        return (parseInt(self.computedStyle(element, "paddingLeft"))
                + parseInt(self.computedStyle(element, "paddingRight")) + element.clientWidth);
    };

    this.getInnerHeight = function(element) {
        return (parseInt(this.computedStyle(element, "paddingTop"))
                + parseInt(this.computedStyle(element, "paddingBottom")) + element.clientHeight);
    };

    this.computedStyle = function(element, style) {
        if (window.getComputedStyle) {
            return (window.getComputedStyle(element, "") || {})[style] || "";
        }
        else {
            return element.currentStyle[style];
        }
    };

    this.scrollbarWidth = function() {

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

}).call(ace);