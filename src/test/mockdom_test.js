/*global CustomEvent*/

if (typeof process !== "undefined") {
    require("amd-loader");
    require("./mockdom");
}

"use strict";

var assert = require("./assertions");

module.exports = {
    "test: selectors": function() {
        document.body.innerHTML = `<div x=1 y='2'>
            <span z=dd>span1</span>
            xxx
            <span class=x>some text </span>
            <a x=3></a>
        </div>`;
        var spans = document.querySelectorAll("span");
        assert.equal(spans[0].matches("[z=dd]"), true);
        assert.equal(spans[0].matches("[z=dde]"), false);
        assert.equal(spans[1].matches("div>[class=x]"), true);
        assert.equal(spans[1].matches("body>[class=x]"), false);
        assert.equal(spans[0].matches("body [z=dd]"), true);
        
        assert.equal(document.querySelectorAll("body     [x]").length, 2);
        assert.equal(document.querySelectorAll("html *>  [x]").length, 2);
        assert.equal(document.querySelectorAll("html * * [x]").length, 1);
        assert.equal(document.querySelectorAll(" * * * * [x]").length, 0);

    },
    "test: getBoundingClientRect" : function() {
        var span = document.createElement("span");
        span.textContent = "x";
        
        assert.equal(span.offsetWidth, 0);
        assert.equal(span.offsetHeight, 0);
        
        document.body.appendChild(span);
        
        var w = span.offsetWidth;
        var h = span.offsetHeight;
        
        assert.ok(h != 0);
        assert.ok(w != 0);
        
        span.textContent = "xxx";
        assert.equal(span.offsetWidth, w * 3);
        assert.equal(span.offsetHeight, h);
        
        var div = document.createElement("div");
        document.body.appendChild(div);
        div.style.position = "absolute";
        div.style.top = "20px";
        div.style.left = "40px";
        div.style.bottom = "20px";
        div.style.right = "12%";
        var rect = div.getBoundingClientRect();
        var parentWidth = div.parentElement.clientWidth;
        assert.ok(parentWidth != 0);
        assert.equal(rect.top, 20);
        assert.equal(rect.left, 40);
        assert.equal(rect.width, parentWidth * (1 - 0.12) - 40);
        assert.equal(rect.height, window.innerHeight - 40);
        assert.equal(rect.right, parentWidth * (1 - 0.12));
        assert.equal(rect.bottom, window.innerHeight - 20);
        
        div.style.width = "40px";
        rect = div.getBoundingClientRect();
        assert.equal(rect.width, 40);
        assert.equal(rect.right, 80);
        
        div.style.height = "150%";
        rect = div.getBoundingClientRect();
        assert.equal(rect.height, window.innerHeight * 1.5);
    },
    
   "test: eventListener" : function() {
        var div = document.createElement("div");
        document.body.appendChild(div);
        
        var windowMousedown = 0;
        window.addEventListener("mousedown", function onWindowMousedown() {
            windowMousedown++;
            window.removeEventListener("mousedown", onWindowMousedown);
        });
        
        var divMousedown = 0;
        div.addEventListener("mousedown", function() {
            divMousedown++;
        });
        
        div.dispatchEvent(new CustomEvent("mousedown"));
        assert.equal(divMousedown, 1);
        assert.equal(windowMousedown, 0);
        
        var event = new CustomEvent("mousedown", {bubbles: true});
        div.dispatchEvent(event);
        assert.equal(divMousedown, 2);
        assert.equal(windowMousedown, 1);
        
        var event = new CustomEvent("mousedown", {bubbles: true});
        div.dispatchEvent(event);
        assert.equal(divMousedown, 3);
        assert.equal(windowMousedown, 1);
    }
};


if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
