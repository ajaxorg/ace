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
     * @param {string|string[]|null|undefined} names
     * @returns {Scope}
     */
    append(names) {
        var scope = this;
        Scope.toNames(names).forEach(function(name) {
            scope = scope.get(name);
        });
        return scope;
    }

    /**
     * @param {string|string[]|null|undefined} ruleScope
     * @returns {Scope}
     */
    prepend(ruleScope) {
        return this.getRoot().append(Scope.toNames(ruleScope).concat(this.getAllScopeNames().slice(1)));
    }

    /**
     * @param {Scope} childScope
     * @returns {Scope}
     */
    merge(childScope) {
        if (!childScope)
            return this;
        var parentNames = this.getAllScopeNames().slice(1);
        var childNames = childScope.getAllScopeNames().slice(1);
        var overlap = 0;
        for (var size = Math.min(parentNames.length, childNames.length); size > 0; size--) {
            var matches = true;
            for (var i = 0; i < size; i++) {
                if (parentNames[parentNames.length - size + i] !== childNames[i]) {
                    matches = false;
                    break;
                }
            }
            if (matches) {
                overlap = size;
                break;
            }
        }
        return this.getRoot().append(parentNames.concat(childNames.slice(overlap)));
    }

    /**
     * @param {import("../ace-internal").Ace.Token} token
     * @returns {import("../ace-internal").Ace.Token}
     */
    attachTo(token) {
        Object.defineProperty(token, "scope", {
            value: this,
            configurable: true,
            writable: true
        });
        return token;
    }

    /**
     * @returns {Scope}
     */
    getRoot() {
        var scope = this;
        while (scope.parent)
            scope = scope.parent;
        return scope;
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

    /**
     * @param {string|string[]|null|undefined} names
     * @returns {string[]}
     */
    static toNames(names) {
        if (!Array.isArray(names))
            names = names ? [names] : [];
        var result = [];
        names.forEach(function(name) {
            if (!name)
                return;
            String(name).split(/\s+/).forEach(function(part) {
                if (part)
                    result.push(part);
            });
        });
        return result;
    }

    /**
     * @param {string[]|string|null|undefined} names
     * @param {string[]|string|null|undefined} prefix
     * @returns {boolean}
     */
    static startsWith(names, prefix) {
        names = Scope.toNames(names);
        prefix = Scope.toNames(prefix);
        if (names.length < prefix.length)
            return false;
        for (var i = 0; i < prefix.length; i++) {
            if (names[i] !== prefix[i])
                return false;
        }
        return !!prefix.length;
    }

    /**
     * @param {string[]|string|null|undefined} names
     * @param {string[]|string|null|undefined} prefix
     * @returns {string[]}
     */
    static tail(names, prefix) {
        names = Scope.toNames(names);
        return Scope.startsWith(names, prefix) ? names.slice(Scope.toNames(prefix).length) : names;
    }

    /**
     * @param {string[]|string|null|undefined} names
     * @param {string[]|string|null|undefined} outerScope
     * @param {string[]|string|null|undefined} innerScope
     * @param {boolean} excludeInner
     * @returns {string[]}
     */
    static trimActivePrefix(names, outerScope, innerScope, excludeInner) {
        names = Scope.toNames(names);
        outerScope = Scope.toNames(outerScope);
        innerScope = Scope.toNames(innerScope);
        if (!names.length)
            return names;
        if (!excludeInner && Scope.startsWith(names, innerScope))
            return names.slice(innerScope.length);
        if (Scope.startsWith(names, outerScope))
            return names.slice(outerScope.length);
        if (innerScope.length && names.length === 1 && innerScope[innerScope.length - 1] === names[0])
            return names.slice(1);
        return names;
    }

    /**
     * @param {string|string[]|null|undefined} scope
     * @param {string[]|undefined} captures
     * @returns {string|string[]|null|undefined}
     */
    static expandBackrefs(scope, captures) {
        if (Array.isArray(scope))
            return scope.map(function(part) {
                return Scope.expandBackrefs(part, captures);
            });
        if (typeof scope != "string")
            return scope;
        return scope.replace(/\$(\d+)/g, function(_, index) {
            return captures && captures[Number(index) - 1] || "";
        });
    }
}

exports.Scope = Scope;
