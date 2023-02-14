"use strict";

var Scope = function (name, parent) {
    this.name = name.toString();
    this.children = {};
    this.parent = parent;
};
(function () {
    Scope.prototype.toString = function () {
        return this.name;
    };
    Scope.prototype.get = function (name, extraId = '') {
        return this.children[name.toString() + extraId] || (this.children[name.toString() + extraId] = new Scope(
            name, this));
    };
    Scope.prototype.find = function (states) {
        var s = this;
        while (s && !states[s.name]) {
            s = s.parent;
        }
        return states[s ? s.name : "start"];
    };
    Scope.prototype.replace = function (a, b) {
        return this.name.replace(a, b);
    };
    Scope.prototype.indexOf = function (a, b) {
        return this.name.indexOf(a, b);
    };
    Scope.prototype.hasParent = function (states) {
        var s = this;
        while (s && states !== s.name) {
            s = s.parent;
        }
        return s ? 1 : -1;
    };
    Scope.prototype.count = function () {
        var s = 1;
        for (var i in this.children) s += this.children[i].count();
        return s;
    };
    /**
     *
     * @returns {string[]}
     */
    Scope.prototype.getAllScopeNames = function () {
        var scopeNames = [];
        var self = this;
        do {
            scopeNames.push(self.name);
        } while (self = self.parent);
        return scopeNames;
    };
}).call(Scope.prototype);

exports.Scope = Scope;