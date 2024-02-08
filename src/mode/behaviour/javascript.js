"use strict";

var oop = require("../../lib/oop");
var CstyleBehaviour = require("../behaviour/cstyle").CstyleBehaviour;
var XmlBehaviour = require("../behaviour/xml").XmlBehaviour;
var JavaScriptBehaviour = function () {
    this.inherit(CstyleBehaviour);
    this.inherit(XmlBehaviour);
};

oop.inherits(JavaScriptBehaviour, CstyleBehaviour);

exports.JavaScriptBehaviour = JavaScriptBehaviour;
