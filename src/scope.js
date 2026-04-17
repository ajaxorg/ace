"use strict";

class Scope {
    /**
     * @param {string} name
     * @param {Scope} [parent]
     */
    constructor(name, parent) {
        this.name = name;
        this.parent = parent || null;
        this.children = Object.create(null);
    }

    /**
     * @param {string} name
     * @returns {Scope}
     */
    get(name) {
        name = name || "text";
        return this.children[name] || (this.children[name] = new Scope(name, this));
    }

    /**
     * @returns {string[]}
     */
    getAllScopeNames() {
        var scopeNames = [];
        var scope = this;
        while (scope) {
            scopeNames.push(scope.name);
            scope = scope.parent;
        }
        return scopeNames.reverse();
    }

    toString() {
        return this.name;
    }
}

exports.Scope = Scope;
