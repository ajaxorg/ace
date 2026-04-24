"use strict";

const Scope = require("./scope").Scope;

/**
 * Maintains scope-aware state frames for the tokenizer.
 *
 * Ace's persisted tokenizer state must stay simple and serializable because it is cached by the background tokenizer
 * and compared between rows. A scoped frame is therefore stored in that state as a plain object with string/array
 * fields, while this manager derives and caches runtime Scope objects for it.
 *
 * This is the bridge between legacy state stack and TextMate-like scope stacks: transitions create frames, frames
 * expose name/content scopes for token emission, and the tokenizer can still return ordinary Ace states.
 */
class ScopedFrameManager {
    /**
     * @param {Scope} rootScope
     */
    constructor(rootScope) {
        this.rootScope = rootScope;
        this.scopes = new WeakMap();
    }

    /**
     * @param {any[]} stack
     * @returns {any[]}
     */
    getAll(stack) {
        var frames = [];
        for (var i = 1; i < stack.length; i++) {
            var item = stack[i];
            if (item && item.kind === "scope")
                frames.push(item);
        }
        return frames.reverse();
    }

    /**
     * @param {string} currentState
     * @param {any[]} stack
     */
    getActive(currentState, stack) {
        if (stack[0] === currentState && stack[1] && stack[1].kind === "scope")
            return stack[1];
        return null;
    }

    same(a, b) {
        if (!a || !b)
            return false;
        if (a.state !== b.state || a.outerScope !== b.outerScope || a.innerScope !== b.innerScope)
            return false;
        if (a.source !== b.source || a.type !== b.type)
            return false;
        var aCaptures = a.captures || [];
        var bCaptures = b.captures || [];
        if (aCaptures.length !== bCaptures.length)
            return false;
        for (var i = 0; i < aCaptures.length; i++) {
            if (aCaptures[i] !== bCaptures[i])
                return false;
        }
        return true;
    }

    /**
     * @param {any} frame
     * @param {Scope} [parentContentScope]
     */
    getScopes(frame, parentContentScope) {
        var cached = this.scopes.get(frame);
        if (cached)
            return cached;
        var nameScope = (parentContentScope || this.rootScope).append(frame.outerScope);
        var contentScope = nameScope.append(Scope.tail(frame.innerScope, frame.outerScope));
        cached = {
            nameScope: nameScope,
            contentScope: contentScope
        };
        this.scopes.set(frame, cached);
        return cached;
    }

    /**
     * @param {any[]} stack
     * @param {boolean} [excludeActiveInnerScope]
     * @returns {Scope}
     */
    getContentScope(stack, excludeActiveInnerScope) {
        var scope = this.rootScope;
        var frames = this.getAll(stack || []);
        frames.forEach(function(frame, index) {
            var frameScopes = this.getScopes(frame, scope);
            scope = excludeActiveInnerScope && index === frames.length - 1
                ? frameScopes.nameScope
                : frameScopes.contentScope;
        }, this);
        return scope;
    }

    /**
     * @param {any} scopeRule
     * @param {string} value
     * @param {any[]} stack
     * @param {string} contentToken
     */
    create(scopeRule, value, stack, contentToken) {
        var match = scopeRule.beginRegex.exec(value);
        var scopeMatch = scopeRule.nameRegex
            ? scopeRule.nameRegex.exec(value)
            : match;
        var captures = scopeMatch ? scopeMatch.slice(1) : [];
        var endMatchCaptures = match ? match.slice(1) : [];
        var outerScope = Scope.expandBackrefs(scopeRule.name, captures);
        var innerScope = Scope.expandBackrefs(scopeRule.contentName || scopeRule.name, captures);
        var frame = {
            kind: "scope",
            type: scopeRule.type,
            state: scopeRule.state,
            outerScope: outerScope,
            contentToken: contentToken,
            innerScope: innerScope,
            source: scopeRule.source,
            flags: scopeRule.flags || "",
            token: scopeRule.token || scopeRule.name || "text",
            captures: endMatchCaptures
        };
        if (scopeRule.applyEndPatternLast)
            frame.applyEndPatternLast = true;
        if (scopeRule.merge === false)
            frame.merge = scopeRule.merge;
        if (scopeRule.ruleScope && scopeRule.ruleScope !== scopeRule.name)
            frame.ruleScope = Scope.expandBackrefs(scopeRule.ruleScope, captures);
        this.getScopes(frame, this.getContentScope(stack));
        return frame;
    }

    /**
     * @param {string} currentState
     * @param {any[]} stack
     */
    popActive(currentState, stack) {
        if (stack[0] === currentState)
            stack.shift();
        stack.shift();
        return stack.shift() || "start";
    }

    /**
     * @param {string} currentState
     * @param {any[]} stack
     * @param {any} frame
     */
    popThrough(currentState, stack, frame) {
        while (true) {
            var activeFrame = this.getActive(currentState, stack);
            if (!activeFrame)
                return currentState;
            currentState = this.popActive(currentState, stack);
            if (activeFrame === frame)
                return currentState;
        }
    }

    /**
     * @param {string} currentState
     * @param {any[]} stack
     * @param {any} frame
     */
    popSpecific(currentState, stack, frame) {
        if (!frame)
            return currentState;
        if (this.getActive(currentState, stack) === frame)
            return this.popActive(currentState, stack);

        for (var i = 1; i < stack.length; i++) {
            if (stack[i] !== frame)
                continue;
            if (typeof stack[i - 1] == "string")
                stack.splice(i - 1, 3);
            else
                stack.splice(i, 2);
            break;
        }
        return currentState;
    }
}

exports.ScopedFrameManager = ScopedFrameManager;
