"use strict";

var oop = require("../../lib/oop");
var XmlBehaviour = require("../behaviour/xml").XmlBehaviour;

/**@type {(new() => Partial<import("../../../interfaces").Behaviour>)}*/
var HtmlBehaviour = function () {

    XmlBehaviour.call(this);

};

oop.inherits(HtmlBehaviour, XmlBehaviour);

exports.HtmlBehaviour = HtmlBehaviour;
