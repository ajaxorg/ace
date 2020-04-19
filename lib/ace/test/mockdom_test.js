/*global CustomEvent*/

if (typeof process !== "undefined") {
    require("amd-loader");
    require("./mockdom");
}

define(function(require, exports, module) {
"use strict";

var assert = require("./assertions");

module.exports = {
   "test: getBoundingClientRect" : function() {
        var span = document.createElement("span");
        span.textContent = "xxx";
        
        assert.equal(span.clientWidth, 0);
        assert.equal(span.clientHeight, 0);
        
        document.body.appendChild(span);
        assert.equal(span.clientWidth, 6 * 3);
        assert.equal(span.clientHeight, 10);
        
        var div = document.createElement("div");
        document.body.appendChild(div);
        div.style.position = "absolute";
        div.style.top = "20px";
        div.style.left = "40px";
        div.style.bottom = "20px";
        div.style.right = "12.5%";
        var rect = div.getBoundingClientRect();
        assert.deepEqual(rect, { top: 40, left: 20, width: 876, height: 708, right: 896, bottom: 748 });
        
        div.style.width = "40px";
        rect = div.getBoundingClientRect();
        assert.equal(rect.width, 40);
        assert.equal(rect.right, 60);
        
        div.style.height = "150%";
        rect = div.getBoundingClientRect();
        assert.equal(rect.height, 1152);
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

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
