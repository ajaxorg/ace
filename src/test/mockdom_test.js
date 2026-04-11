/*global CustomEvent*/

if (typeof process !== "undefined") {
    require("./mockdom");
}

"use strict";

var assert = require("./assertions");

module.exports = {
    tearDown: function() {
        document.body.innerHTML = "";
    },
    "test: selectors": function() {
        document.body.insertAdjacentHTML("afterbegin", `<div x=1 y='2'>
            <span z=dd>span1</span>
            xxx
            <span class=x>some text </span>
            <a x=3></a>
        </div>`);
        var div = document.querySelector("div[x]");

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

        div.remove();
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
        div.style.background = "red";
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
        assert.equal(Math.round(rect.width), Math.round(parentWidth * (1 - 0.12) - 40));
        assert.equal(rect.height, window.innerHeight - 40);
        assert.equal(Math.round(rect.right), Math.round(parentWidth * (1 - 0.12)));
        assert.equal(rect.bottom, window.innerHeight - 20);
        
        div.style.width = "40px";
        rect = div.getBoundingClientRect();
        assert.equal(rect.width, 40);
        assert.equal(rect.right, 80);
        
        div.style.height = "150%";
        rect = div.getBoundingClientRect();
        assert.equal(rect.height, window.innerHeight * 1.5);
    },
    "test: getBoundingClientRect with transform" : function() {
        var parent = document.createElement("div");
        parent.style.position = "absolute";
        parent.style.top = "50px";
        parent.style.left = "400px";
        parent.style.width = "200px";
        parent.style.height = "200px";
        parent.style.background = "yellow";
        document.body.appendChild(parent);
        
        var div = document.createElement("div");
        parent.appendChild(div);
        div.style.transformOrigin = "0 0";
        div.style.background = "red";
        div.style.position = "absolute";
        div.style.top = "30px";
        div.style.left = "40px";
        div.style.width = "100px";
        div.style.height = "100px";
        var expected = {
            left: 440,
            top: 80,
            width: 100,
            height: 100,
        };
        var rect = div.getBoundingClientRect();
        assertRect(rect, expected);

        div.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -100, -10, 0, 1)";
        expected.left += -100;
        expected.top += -10;
        rect = div.getBoundingClientRect();
        assertRect(rect, expected);

        div.style.transform = "matrix3d(0.5, 0, 0, 0, 0, 0.8, 0, 0, 0, 0, 1, 0, -100, -10, 0, 1)";
        expected.width *= 0.5;
        expected.height *= 0.8;
        rect = div.getBoundingClientRect();
        assertRect(rect, expected);

        parent.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -100, -10, 0, 1)";
        parent.style.transformOrigin = "0 0";
        expected.left += -100;
        expected.top += -10;
        rect = div.getBoundingClientRect();
        assertRect(rect, expected); 

        parent.style.transform = "matrix3d(0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 1, 0, -100, -20, 0, 1)";
        expected.width *= 0.5;
        expected.height *= 0.5;
        expected.left = (400 - 100) + (40-100) / 2;
        expected.top = (50 - 20) + (30-10) / 2;
        rect = div.getBoundingClientRect();
        assertRect(rect, expected);

 
        parent.style.transform = "";
        div.style.transform = "matrix3d(0.7, 0.3, 0, -0.00066, 0, 0.82, 0, -0.001, 0, 0, 1, 0, -100, -10, 10, 1)";
        expected = {
            left: 328.8888854980469,
            top: 70,
            width: 78.9912109375,
            height: 132.30215454101562,
        };
        rect = div.getBoundingClientRect();
        assertRect(rect, expected);


        parent.style.transform = "matrix3d(0.7, 0.3, 0, -0.00066, 0, 0.82, 0, -0.001, 0, 0, 1, 0, -100, -20, 10, 1)";
        expected = {
            left: 240.14041137695312,
            top: 28.815221786499023,
            width: 59.70550537109375,
            height: 146.73687744140625,
        };
        rect = div.getBoundingClientRect();
        assertRect(rect, expected);

        function assertRect(rect, expected) {
            for (var key in expected) {
                assert.equal(Math.round(rect[key]), Math.round(expected[key]));
            }
        }
    },
    
    "test: getBoundingClientRect for inline elements": function() {
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.fontFamily = "monospace";
        div.style.top = "20px";
        div.style.left = "40px";
        document.body.appendChild(div);
        
        div.innerHTML = "\tぁ-<span>a</span> <span>def<span>xyz</span></span>";
        var span1 = div.children[0];
        var span2 = div.children[1];
        var span3 = span2.children[0];

        var rect1 = span1.getBoundingClientRect();
        var rect2 = span2.getBoundingClientRect();
        var rect3 = span3.getBoundingClientRect();
        
        assert.equal((rect3.left - rect2.left) / rect1.width, 3);

        var range = document.createRange();
        range.setStart(span1.firstChild, 1);
        range.setEnd(span2.firstChild, 1);
        var rect = range.getBoundingClientRect();
        assert.equal(rect.left, rect1.left + rect1.width);
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


require("../test/run")(module);