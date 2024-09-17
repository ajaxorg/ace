"use strict";

class Scope {
    /**
     * @param {any} name
     * @param {Scope} [parent]
     */
    constructor(name, parent) {
        /**@type {Scope & String}*/
        // @ts-ignore 
        // eslint-disable-next-line no-new-wrappers
        let stringObj = new String(name); //TODO: can be removed when ace builds switches to classes
        stringObj.name = stringObj.toString(); // Assign the string representation to `name`
        stringObj.children = {}; // Initialize the children object
        stringObj.parent = parent; // Set the parent scope
        stringObj.data = name; // Store the original data

        stringObj.get = this.get;
        stringObj.find = this.find;
        stringObj.hasParent = this.hasParent;
        stringObj.count = this.count;
        stringObj.getAllScopeNames = this.getAllScopeNames;
        stringObj.toStack = this.toStack;
        stringObj.fromStack = this.fromStack;
        
        return stringObj;
    }

    /**
     * @param {any} name
     * @param {string|undefined} [extraId]
     */
    get(name, extraId) {
        var id = "" + name + (extraId || "");
        if (this.children[id]) {
            return this.children[id];
        }
        this.children[id] = new Scope(name, this);
        if (extraId) {
            this.children[id].data = extraId;
        }
        return this.children[id];
    }

    find(states) {
        /**@type{Scope}*/
        var s = this;
        while (s && !states[s.name]) {
            s = s.parent;
        }
        return states[s ? s.name : "start"];
    }

    hasParent(states) {
        /**@type{Scope}*/
        var s = this;
        while (s && states !== s.name) {
            s = s.parent;
        }
        return s != undefined;
    }

    count() {
        var s = 1;
        for (var i in this.children) s += this.children[i].count();
        return s;
    }

    /**
     *
     * @returns {string[]}
     */
    getAllScopeNames() {
        var scopeNames = [];
        /**@type{Scope}*/
        var self = this;
        do {
            scopeNames.push(self.name);
        } while (self = self.parent);
        return scopeNames;
    }

    toStack() {
        var stack = [];
        /**@type{Scope}*/
        var self = this;
        do {
            stack.push(self.data);
        } while (self = self.parent);
        return stack;
    }

    /**
     * Retrieves the scope for the given stack and current state.
     *
     * @param {string[]} stack - The stack of scopes.
     * @param {string | Scope} currentState - The current state.
     * @returns {Scope} The scope for the given stack and current state.
     */
    fromStack(stack, currentState) {
        /**@type{Scope}*/
        let scope = this;
        while (scope.parent) {
            scope = scope.parent;
        }

        if (stack.length === 0) {
            return scope.get(currentState); //the start state
        }
        for (var i = stack.length - 1; i >= 0; i--) {
            scope = scope.get(stack[i]);
        }
        if (stack[0] !== currentState) {
            scope = scope.get(currentState, "#tmp");
        }

        return scope;
    }
}


exports.Scope = Scope;
