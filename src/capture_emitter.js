"use strict";

var HAS_INDICES = false;
try {
    HAS_INDICES = !!new RegExp("", "d").hasIndices;
} catch (e) {}

/**
 * Emits scoped token parts for matched rules.
 *
 * The tokenizer owns control flow and state transitions; this helper only turns
 * an already matched value plus capture metadata into output tokens. It handles
 * simple string tokens, array token parts, indexed captures with gaps, and
 * retokenized sub-parts.
 */
class CaptureEmitter {
    /**
     * @param {import("./tokenizer").Tokenizer} tokenizer
     */
    constructor(tokenizer) {
        this.tokenizer = tokenizer;
    }

    getCaptureScopeRule(ruleScope, isScopedBegin) {
        return {
            ruleScope: ruleScope,
            scope: isScopedBegin ? {type: "begin"} : null
        };
    }

    appendRetokenizedTokens(tokens, part, retokenizeState) {
        var tokenizer = this.tokenizer;
        var retokenized = tokenizer.getLineTokens(part.value, retokenizeState || part.retokenizeState).tokens;
        for (var j = 0; j < retokenized.length; j++) {
            tokenizer.setTokenScope(
                retokenized[j],
                tokenizer.mergeRetokenizedScope(part.scope, retokenized[j].scope)
            );
            tokens.push(retokenized[j]);
        }
    }

    appendStringCapturedToken(tokens, token, type, value, ruleScope, mapping, currentState, stack, merge, excludeActiveInnerScope, isTmBegin) {
        var tokenizer = this.tokenizer;
        var scope = tokenizer.getTokenScope(
            type,
            this.getCaptureScopeRule(ruleScope, isTmBegin),
            mapping,
            currentState,
            stack,
            excludeActiveInnerScope
        );
        if (merge === false) {
            if (token.type)
                tokens.push(token);
            tokens.push(tokenizer.setTokenScope({
                type: type,
                value: value
            }, scope));
            return {type: null, value: ""};
        }
        return tokenizer.appendScopedToken(tokens, token, type, value, scope);
    }

    hasIndexedCaptures(match, type) {
        for (var i = 1; i < match.indices.length && i <= type.length; i++) {
            var range = match.indices[i];
            if (range && range[0] != null && range[0] >= 0 && range[1] > range[0])
                return true;
        }
        return false;
    }

    hasIndexedCaptureGaps(match, type) {
        var fullRange = match.indices[0];
        var position = fullRange[0];
        for (var i = 1; i < match.indices.length && i <= type.length; i++) {
            var range = match.indices[i];
            if (!range || range[0] == null || range[0] < 0 || range[1] <= range[0])
                continue;
            if (range[0] > position)
                return true;
            if (range[1] > position)
                position = range[1];
        }
        return fullRange[1] > position;
    }

    createCapturePart(partType, value, range) {
        return typeof partType == "object"
            ? Object.assign({value: value.slice(range[0], range[1])}, partType)
            : {
                type: partType,
                value: value.slice(range[0], range[1])
            };
    }

    setCapturePartScope(part, ruleScope, mapping, currentState, stack, excludeActiveInnerScope, isTmBegin) {
        var tokenizer = this.tokenizer;
        if (part.type && !part.scope)
            tokenizer.setTokenScope(
                part,
                tokenizer.getTokenScope(
                    part.type,
                    this.getCaptureScopeRule(part.ruleScope || ruleScope, isTmBegin),
                    mapping,
                    currentState,
                    stack,
                    excludeActiveInnerScope
                )
            );
    }

    appendIndexedCapturedTokens(tokens, type, value, ruleScope, mapping, currentState, stack, match, excludeActiveInnerScope, isTmBegin) {
        var tokenizer = this.tokenizer;
        var fullRange = match.indices[0];
        var position = fullRange[0];
        var defaultType = Array.isArray(ruleScope)
            ? ruleScope[ruleScope.length - 1]
            : ruleScope || mapping.defaultToken || "text";
        var defaultScope = tokenizer.getTokenScope(
            defaultType,
            this.getCaptureScopeRule(ruleScope, isTmBegin),
            mapping,
            currentState,
            stack,
            excludeActiveInnerScope
        );
        var localStack = [];
        var currentMeta = function() {
            return localStack[localStack.length - 1] || {
                type: defaultType,
                scope: defaultScope
            };
        };
        var emit = function(end) {
            if (end <= position)
                return;
            var meta = currentMeta();
            tokens.push(tokenizer.setTokenScope({
                type: meta.type || defaultType,
                value: value.slice(position, end)
            }, meta.scope || defaultScope));
            position = end;
        };

        for (var i = 1; i < match.indices.length && i <= type.length; i++) {
            var range = match.indices[i];
            if (!range || range[0] == null || range[0] < 0 || range[1] <= range[0])
                continue;
            while (localStack.length && localStack[localStack.length - 1].end <= range[0]) {
                emit(localStack[localStack.length - 1].end);
                localStack.pop();
            }
            emit(range[0]);
            var partType = type[i - 1];
            if (partType == null)
                continue;
            var part = this.createCapturePart(partType, value, range);
            this.setCapturePartScope(part, ruleScope, mapping, currentState, stack, excludeActiveInnerScope, isTmBegin);
            if (part.retokenizeState) {
                this.appendRetokenizedTokens(tokens, part);
                position = range[1];
                continue;
            }
            localStack.push({
                end: range[1],
                type: part.type,
                scope: part.scope
            });
        }
        while (localStack.length) {
            emit(localStack[localStack.length - 1].end);
            localStack.pop();
        }
        emit(fullRange[1]);
        return {type: null, value: ""};
    }

    appendArrayCapturedTokens(tokens, token, type, value, ruleScope, mapping, currentState, stack, splitRegex, excludeActiveInnerScope, isTmBegin) {
        var tokenizer = this.tokenizer;
        var parts = splitRegex
            ? tokenizer.$arrayTokens.call({splitRegex: splitRegex, tokenArray: type}, value)
            : type.map(function(part) {
                return Object.assign({value: value}, part);
            });

        if (typeof parts === "string") {
            return tokenizer.appendScopedToken(
                tokens,
                token,
                parts,
                value,
                tokenizer.getTokenScope(parts, this.getCaptureScopeRule(ruleScope, isTmBegin), mapping, currentState, stack, excludeActiveInnerScope)
            );
        }

        if (token.type)
            tokens.push(token);
        for (var i = 0; i < parts.length; i++) {
            this.setCapturePartScope(parts[i], ruleScope, mapping, currentState, stack, excludeActiveInnerScope, isTmBegin);
            tokens.push(parts[i]);
            if (parts[i].retokenizeState) {
                tokens.pop();
                this.appendRetokenizedTokens(tokens, parts[i]);
            }
        }
        return {type: null, value: ""};
    }

    append(tokens, token, type, value, ruleScope, mapping, currentState, stack, splitRegex, merge, excludeActiveInnerScope, emitGaps, isTmBegin) {
        if (!value || !type)
            return token;

        if (typeof type === "string")
            return this.appendStringCapturedToken(
                tokens,
                token,
                type,
                value,
                ruleScope,
                mapping,
                currentState,
                stack,
                merge,
                excludeActiveInnerScope,
                isTmBegin
            );

        if (!Array.isArray(type))
            type = [type];

        if (emitGaps && splitRegex && HAS_INDICES) {
            var match = splitRegex.exec(value);
            if (match && match.indices && match.indices[0]) {
                if (token.type)
                    tokens.push(token);
                token = {type: null, value: ""};

                if (this.hasIndexedCaptures(match, type) && this.hasIndexedCaptureGaps(match, type))
                    return this.appendIndexedCapturedTokens(
                        tokens,
                        type,
                        value,
                        ruleScope,
                        mapping,
                        currentState,
                        stack,
                        match,
                        excludeActiveInnerScope,
                        isTmBegin
                    );
            }
        }

        return this.appendArrayCapturedTokens(
            tokens,
            token,
            type,
            value,
            ruleScope,
            mapping,
            currentState,
            stack,
            splitRegex,
            excludeActiveInnerScope,
            isTmBegin
        );
    }
}

exports.CaptureEmitter = CaptureEmitter;
