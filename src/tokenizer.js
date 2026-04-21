"use strict";
const reportError = require("./lib/report_error").reportError;
const Scope = require("./scope").Scope;
var HAS_INDICES = false;
try {
    HAS_INDICES = !!new RegExp("", "d").hasIndices;
} catch (e) {}

// tokenizing lines longer than this makes editor very slow
var MAX_TOKEN_COUNT = 2000;
/**
 * This class takes a set of highlighting rules, and creates a tokenizer out of them. For more information, see [the wiki on extending highlighters](https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode#wiki-extendingTheHighlighter).
 **/
class Tokenizer {
    /**
     * Constructs a new tokenizer based on the given rules and flags.
     * @param {Object} rules The highlighting rules
     * @param {string} [modeName]
     **/
    constructor(rules, modeName) {
        /**@type {RegExp}*/
        this.splitRegex;
        this.states = rules;
        this.rootScope = new Scope(modeName || "root");

        this.regExps = {};
        this.matchMappings = {};
        this.anchoredRules = {};
        for (var key in this.states) {
            var state = this.states[key];
            var ruleRegExps = [];
            var matchTotal = 0;
            var mapping = this.matchMappings[key] = {defaultToken: "text", defaultScope: null};
            var anchoredRules = this.anchoredRules[key] = [];
            var flag = "g";

            var splitterRurles = [];
            for (var i = 0; i < state.length; i++) {
                var rule = state[i];
                if (rule.defaultToken) {
                    mapping.defaultToken = rule.defaultToken;
                    mapping.defaultScope = rule.ruleScope || rule.defaultScope || mapping.defaultScope;
                }
                if (rule.tmBegin) {
                    rule.tmBegin.beginRegex = rule.regex instanceof RegExp
                        ? rule.regex
                        : new RegExp("^(?:" + rule.regex + ")$", rule.tmBegin.beginFlags);
                    rule.tmBegin.endSource = rule.tmBegin.end instanceof RegExp
                        ? rule.tmBegin.end.source
                        : rule.tmBegin.end;
                    rule.tmBegin.broadEndSource = rule.tmBegin.end
                        ? this.broadEndRegexp(rule.tmBegin.end)
                        : null;
                    rule.tmBegin.whileSource = rule.tmBegin.while instanceof RegExp
                        ? rule.tmBegin.while.source
                        : rule.tmBegin.while;
                }
                if (rule.caseInsensitive && flag.indexOf("i") === -1)
                    flag += "i";
                if (rule.unicode && flag.indexOf("u") === -1)
                    flag += "u";
                if (rule.regex == null)
                    continue;

                if (rule.regex instanceof RegExp)
                    rule.regex = rule.regex.toString().slice(1, -1);

                rule.$index = i;
                if (/\\G/.test(rule.regex)) {
                    anchoredRules.push(rule);
                    continue;
                }

                // Count number of matching groups. 2 extra groups from the full match
                // And the catch-all on the end (used to force a match);
                var adjustedregex = rule.regex;
                var matchcount = new RegExp("(?:(" + adjustedregex + ")|(.))").exec("a").length - 2;
                if (Array.isArray(rule.token)) {
                    if (rule.token.length == 1 || matchcount == 1) {
                        rule.token = rule.token[0];
                    } else if (matchcount - 1 != rule.token.length) {
                        this.reportError("number of classes and regexp groups doesn't match", {
                            rule: rule,
                            groupCount: matchcount - 1
                        });
                        rule.token = rule.token[0];
                    } else {
                        rule.tokenArray = rule.token;
                        rule.token = null;
                        rule.onMatch = this.$arrayTokens;
                    }
                } else if (typeof rule.token == "function" && !rule.onMatch) {
                    if (matchcount > 1)
                        rule.onMatch = this.$applyToken;
                    else
                        rule.onMatch = rule.token;
                }

                if (matchcount > 1) {
                    if (/\\\d/.test(rule.regex)) {
                        // Replace any backreferences and offset appropriately.
                        adjustedregex = rule.regex.replace(/\\([0-9]+)/g, function(match, digit) {
                            return "\\" + (parseInt(digit, 10) + matchTotal + 1);
                        });
                    } else {
                        matchcount = 1;
                        adjustedregex = this.removeCapturingGroups(rule.regex);
                    }
                    if (rule.tmCaptureData && HAS_INDICES)
                        rule.tmCaptureSplitRegex = this.createSplitterRegexp(rule.regex, flag + "d");
                    if (!rule.splitRegex && typeof rule.token != "string")
                        splitterRurles.push(rule); // flag will be known only at the very end
                }

                mapping[matchTotal] = i;
                matchTotal += matchcount;

                ruleRegExps.push(adjustedregex);

                // makes property access faster
                if (!rule.onMatch)
                    rule.onMatch = null;
            }

            if (!ruleRegExps.length) {
                mapping[0] = 0;
                ruleRegExps.push("$");
            }

            splitterRurles.forEach(function(rule) {
                rule.splitRegex = this.createSplitterRegexp(rule.regex, flag);
            }, this);

            this.regExps[key] = new RegExp("(" + ruleRegExps.join(")|(") + ")|($)", flag);
        }
    }

    /**
     * @param {number} m
     */
    $setMaxTokenCount(m) {
        MAX_TOKEN_COUNT = m | 0;
    }

    /**
     * @param {string} str
     * @return {import("../ace-internal").Ace.Token[]}
     */
    $applyToken(str) {
        var values = this.splitRegex.exec(str).slice(1);
        //@ts-ignore
        var types = this.token.apply(this, values);

        // required for compatibility with old modes
        if (typeof types === "string")
            return [{type: types, value: str}];

        var tokens = [];
        for (var i = 0, l = types.length; i < l; i++) {
            if (values[i])
                tokens[tokens.length] = {
                    type: types[i],
                    value: values[i]
                };
        }
        return tokens;
    }

    /**
     * @param {string} str
     * @return {import("../ace-internal").Ace.Token[] | string}
     */
    $arrayTokens(str) {
        if (!str)
            return [];
        var values = this.splitRegex.exec(str);
        if (!values)
            return "text";
        var tokens = [];
        //@ts-ignore
        var types = this.tokenArray;
        for (var i = 0, l = types.length; i < l; i++) {
            if (!values[i + 1])
                continue;
            var type = types[i];
            if (type && typeof type == "object")
                tokens[tokens.length] = Object.assign({value: values[i + 1]}, type);
            else
                tokens[tokens.length] = {
                    type: type,
                    value: values[i + 1]
                };
        }
        return tokens;
    }

    /**
     * @param {string} src
     * @returns {string}
     */
    removeCapturingGroups(src) {
        var r = src.replace(
            /\\.|\[(?:\\.|[^\\\]])*|\(\?[:=!<]|(\()/g,
            function(x, y) {return y ? "(?:" : x;}
        );
        return r;
    }

    /**
     * @param {string} src
     * @param {string} flag
     */
    createSplitterRegexp(src, flag) {
        if (src.indexOf("(?=") != -1) {
            var stack = 0;
            var inChClass = false;
            var lastCapture = {};
            src.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g, function(
                m, esc, parenOpen, parenClose, square, index
            ) {
                if (inChClass) {
                    inChClass = square != "]";
                } else if (square) {
                    inChClass = true;
                } else if (parenClose) {
                    if (stack == lastCapture.stack) {
                        lastCapture.end = index+1;
                        lastCapture.stack = -1;
                    }
                    stack--;
                } else if (parenOpen) {
                    stack++;
                    if (parenOpen.length != 1) {
                        lastCapture.stack = stack;
                        lastCapture.start = index;
                    }
                }
                return m;
            });

            if (lastCapture.end != null && /^\)*$/.test(src.substr(lastCapture.end)))
                src = src.substring(0, lastCapture.start) + src.substr(lastCapture.end);
        }
        
        // this is needed for regexps that can match in multiple ways
        if (src.charAt(0) != "^") src = "^" + src;
        if (src.charAt(src.length - 1) != "$") src += "$";
        
        return new RegExp(src, (flag||"").replace("g", ""));
    }

    /**
     * @param {string|RegExp} end
     * @returns {string}
     */
    broadEndRegexp(end) {
        var source = end instanceof RegExp ? end.source : end;
        return source.replace(/\\([1-9])/g, ".*?");
    }

    /**
     * @param {string|RegExp} end
     * @param {string[]|undefined} captures
     */
    exactEndRegexp(end, captures, flags) {
        var source = end instanceof RegExp ? end.source : end;
        source = source.replace(/\\([1-9])/g, function(_, index) {
            var value = captures && captures[index - 1] || "";
            return value.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
        });
        flags = flags || "";
        if (end instanceof RegExp) {
            if (end.ignoreCase && flags.indexOf("i") == -1) flags += "i";
            if (end.multiline && flags.indexOf("m") == -1) flags += "m";
            if (end.unicode && flags.indexOf("u") == -1) flags += "u";
        }
        return new RegExp("^(?:" + source + ")$", flags);
    }

    /**
     * @param {string} source
     * @param {string[]|undefined} captures
     * @param {string} flags
     * @param {string} line
     * @param {number} index
     */
    matchTmRegexAt(source, captures, flags, line, index) {
        if (!source)
            return null;
        source = this.expandTmSource(source, captures);
        flags = (flags || "").replace(/g/g, "");
        var re = new RegExp("(?:" + source + ")", flags.indexOf("y") === -1 ? flags + "y" : flags);
        re.lastIndex = index;
        var match = re.exec(line);
        return match && match.index === index ? match : null;
    }

    /**
     * @param {string} source
     * @param {string[]|undefined} captures
     * @returns {string}
     */
    expandTmSource(source, captures) {
        return source
            .replace(/\\([1-9])/g, function(_, captureIndex) {
                var value = captures && captures[captureIndex - 1] || "";
                return value.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
            })
            .replace(/\\G/g, "");
    }

    /**
     * @param {string} source
     * @param {string[]|undefined} captures
     * @param {string} flags
     */
    createTmSplitterRegex(source, captures, flags) {
        return this.createSplitterRegexp(this.expandTmSource(source, captures), flags || "");
    }

    /**
     * @param {any[]} stack
     */
    getTmFrames(stack) {
        var frames = [];
        for (var i = 1; i < stack.length; i++) {
            var item = stack[i];
            if (item && item.kind === "tm")
                frames.push(item);
        }
        return frames.reverse();
    }

    /**
     * @param {string} currentState
     * @param {any[]} stack
     */
    getActiveTmFrame(currentState, stack) {
        if (stack[0] === currentState && stack[1] && stack[1].kind === "tm")
            return stack[1];
        return null;
    }

    getAnchoredRuleFlags(rule) {
        var flags = "";
        if (rule.tmBegin && rule.tmBegin.beginFlags)
            flags += rule.tmBegin.beginFlags;
        if (rule.caseInsensitive && flags.indexOf("i") === -1)
            flags += "i";
        if (rule.unicode && flags.indexOf("u") === -1)
            flags += "u";
        return flags;
    }

    matchAnchoredRule(stateName, line, index) {
        var rules = this.anchoredRules[stateName];
        if (!rules || !rules.length)
            return null;
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            var match = this.matchTmRegexAt(rule.regex, null, this.getAnchoredRuleFlags(rule), line, index);
            if (match)
                return {
                    rule: rule,
                    match: match,
                    index: index
                };
        }
        return null;
    }

    sameTmFrame(a, b) {
        if (!a || !b)
            return false;
        if (a.state !== b.state || a.outerScope !== b.outerScope || a.innerScope !== b.innerScope)
            return false;
        if (a.endSource !== b.endSource || a.whileSource !== b.whileSource)
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
     * @param {string|undefined} currentState
     * @param {any[]} stack
     * @param {any} tmBegin
     * @param {string} value
     */
    pushTmFrame(currentState, stack, tmBegin, value) {
        var match = tmBegin.beginRegex.exec(value);
        var frame = {
            kind: "tm",
            state: tmBegin.state,
            outerScope: tmBegin.outerScope,
            contentToken: tmBegin.contentToken,
            innerScope: tmBegin.innerScope,
            endSource: tmBegin.endSource,
            broadEndSource: tmBegin.broadEndSource,
            endFlags: tmBegin.endFlags,
            endToken: tmBegin.endToken,
            captures: match ? match.slice(1) : []
        };
        if (tmBegin.applyEndPatternLast)
            frame.applyEndPatternLast = true;
        if (tmBegin.endMerge === false)
            frame.endMerge = tmBegin.endMerge;
        if (tmBegin.endRuleScope && tmBegin.endRuleScope !== tmBegin.outerScope)
            frame.endRuleScope = tmBegin.endRuleScope;
        if (tmBegin.whileSource) {
            frame.whileSource = tmBegin.whileSource;
            frame.whileFlags = tmBegin.whileFlags;
            frame.whileToken = tmBegin.whileToken;
            if (tmBegin.whileMerge === false)
                frame.whileMerge = tmBegin.whileMerge;
            if (tmBegin.whileRuleScope && tmBegin.whileRuleScope !== tmBegin.outerScope)
                frame.whileRuleScope = tmBegin.whileRuleScope;
        }
        stack.unshift(tmBegin.state, frame, currentState || "start");
        return tmBegin.state;
    }

    /**
     * @param {string} currentState
     * @param {any[]} stack
     */
    popTmFrame(currentState, stack) {
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
    popTmFramesThrough(currentState, stack, frame) {
        while (true) {
            var activeTmFrame = this.getActiveTmFrame(currentState, stack);
            if (!activeTmFrame)
                return currentState;
            currentState = this.popTmFrame(currentState, stack);
            if (activeTmFrame === frame)
                return currentState;
        }
    }

    popSpecificTmFrame(currentState, stack, frame) {
        if (!frame)
            return currentState;
        if (this.getActiveTmFrame(currentState, stack) === frame)
            return this.popTmFrame(currentState, stack);

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

    /**
     * @param {string} currentState
     * @param {any[]} stack
     */
    getDefaultToken(currentState, stack) {
        var frame = this.getActiveTmFrame(currentState, stack);
        return frame ? frame.contentToken : this.matchMappings[currentState].defaultToken;
    }

    /**
     * @param {string} type
     * @param {any} rule
     * @param {{defaultScope?: string|null}} mapping
     * @returns {Scope}
     */
    getTokenScope(type, rule, mapping, currentState, stack, excludeActiveInnerScope) {
        var scope = this.rootScope;
        var appendScopeNames = function(scope, names) {
            if (!Array.isArray(names))
                names = names ? [names] : [];
            names.forEach(function(name) {
                if (name)
                    scope = scope.get(name);
            });
            return scope;
        };
        var startsWithScopeNames = function(scopeNames, prefix) {
            if (!Array.isArray(prefix))
                prefix = prefix ? [prefix] : [];
            if (scopeNames.length < prefix.length)
                return false;
            for (var i = 0; i < prefix.length; i++) {
                if (scopeNames[i] !== prefix[i])
                    return false;
            }
            return !!prefix.length;
        };
        var tailScopeNames = function(scopeNames, prefix) {
            if (!Array.isArray(scopeNames))
                scopeNames = scopeNames ? [scopeNames] : [];
            if (!startsWithScopeNames(scopeNames, prefix))
                return scopeNames;
            return scopeNames.slice((Array.isArray(prefix) ? prefix : [prefix]).length);
        };
        var tmFrames = this.getTmFrames(stack || []);
        tmFrames.forEach(function(frame, index) {
            scope = appendScopeNames(scope, frame.outerScope);
            if (
                frame.innerScope &&
                !(excludeActiveInnerScope && index === tmFrames.length - 1)
            )
                scope = appendScopeNames(scope, tailScopeNames(frame.innerScope, frame.outerScope));
        });
        var scopeNames = rule && rule.ruleScope;
        if (!scopeNames) {
            var frame = this.getActiveTmFrame(currentState || "", stack || []);
            if (frame)
                scopeNames = frame.innerScope;
        }
        if (!scopeNames)
            scopeNames = mapping.defaultScope;
        if (!Array.isArray(scopeNames))
            scopeNames = scopeNames ? [scopeNames] : [];
        var activeFrame = tmFrames[tmFrames.length - 1];
        if (!(rule && rule.tmBegin) && scopeNames.length && activeFrame && (
            (!excludeActiveInnerScope && startsWithScopeNames(scopeNames, activeFrame.innerScope))
            || startsWithScopeNames(scopeNames, activeFrame.outerScope)
            || (
                scopeNames.length === 1 &&
                Array.isArray(activeFrame.innerScope) &&
                activeFrame.innerScope[activeFrame.innerScope.length - 1] === scopeNames[0]
            )
        ))
            scopeNames = scopeNames.slice(
                (!excludeActiveInnerScope && Array.isArray(activeFrame.innerScope) && startsWithScopeNames(scopeNames, activeFrame.innerScope))
                        ? activeFrame.innerScope.length
                    : Array.isArray(activeFrame.outerScope) && startsWithScopeNames(scopeNames, activeFrame.outerScope)
                        ? activeFrame.outerScope.length
                        : (
                            scopeNames.length === 1 &&
                            Array.isArray(activeFrame.innerScope) &&
                            activeFrame.innerScope[activeFrame.innerScope.length - 1] === scopeNames[0]
                        )
                            ? 1
                        : 1
            );
        scope = appendScopeNames(scope, scopeNames);
        return scope;
    }

    /**
     * @param {import("../ace-internal").Ace.Token} token
     * @param {Scope} scope
     */
    setTokenScope(token, scope) {
        Object.defineProperty(token, "scope", {
            value: scope,
            configurable: true,
            writable: true
        });
        return token;
    }

    /**
     * @param {import("../ace-internal").Ace.Token[]} tokens
     * @param {import("../ace-internal").Ace.Token} token
     * @param {string} type
     * @param {string} value
     * @param {Scope} scope
     * @returns {import("../ace-internal").Ace.Token}
     */
    appendScopedToken(tokens, token, type, value, scope) {
        if (!value)
            return token;
        if (token.type === type && token.scope === scope) {
            token.value += value;
            return token;
        }
        if (token.type)
            tokens.push(token);
        return this.setTokenScope({
            type: type,
            value: value
        }, scope);
    }

    /**
     * @param {Scope} scope
     * @param {string[]|string|null|undefined} ruleScope
     */
    prependRuleScope(scope, ruleScope) {
        if (!ruleScope)
            return scope;
        var names = Array.isArray(ruleScope) ? ruleScope : [ruleScope];
        var childNames = scope.getAllScopeNames().slice(1);
        var merged = this.rootScope;
        names.concat(childNames).forEach(function(name) {
            if (name)
                merged = merged.get(name);
        });
        return merged;
    }

    mergeRetokenizedScope(ambientScope, childScope) {
        if (!ambientScope)
            return childScope;
        if (!childScope)
            return ambientScope;
        var ambientNames = ambientScope.getAllScopeNames().slice(1);
        var childNames = childScope.getAllScopeNames().slice(1);
        var overlap = 0;
        for (var size = Math.min(ambientNames.length, childNames.length); size > 0; size--) {
            var matches = true;
            for (var i = 0; i < size; i++) {
                if (ambientNames[ambientNames.length - size + i] !== childNames[i]) {
                    matches = false;
                    break;
                }
            }
            if (matches) {
                overlap = size;
                break;
            }
        }
        var merged = this.rootScope;
        ambientNames.concat(childNames.slice(overlap)).forEach(function(name) {
            if (name)
                merged = merged.get(name);
        });
        return merged;
    }

    /**
     * @param {import("../ace-internal").Ace.Token[]} tokens
     * @param {import("../ace-internal").Ace.Token} token
     * @param {string|object|object[]} type
     * @param {string} value
     * @param {string|string[]|null|undefined} ruleScope
     * @param {{defaultScope?: string|null}} mapping
     * @param {string} currentState
     * @param {any[]} stack
     * @param {RegExp} splitRegex
     */
    appendCapturedTokens(tokens, token, type, value, ruleScope, mapping, currentState, stack, splitRegex, merge, excludeActiveInnerScope) {
        if (!value || !type)
            return token;

        if (typeof type === "string") {
            var scope = this.getTokenScope(type, {ruleScope: ruleScope}, mapping, currentState, stack, excludeActiveInnerScope);
            if (merge === false) {
                if (token.type)
                    tokens.push(token);
                tokens.push(this.setTokenScope({
                    type: type,
                    value: value
                }, scope));
                return {type: null, value: ""};
            }
            return this.appendScopedToken(tokens, token, type, value, scope);
        }

        if (!Array.isArray(type))
            type = [type];

        var parts = splitRegex
            ? this.$arrayTokens.call({splitRegex: splitRegex, tokenArray: type}, value)
            : type.map(function(part) {
                return Object.assign({value: value}, part);
            });

        if (typeof parts === "string") {
            return this.appendScopedToken(
                tokens,
                token,
                parts,
                value,
                this.getTokenScope(parts, {ruleScope: ruleScope}, mapping, currentState, stack, excludeActiveInnerScope)
            );
        }

        if (token.type)
            tokens.push(token);
        for (var i = 0; i < parts.length; i++) {
            if (parts[i].type && !parts[i].scope)
                this.setTokenScope(
                    parts[i],
                    this.getTokenScope(
                        parts[i].type,
                        {ruleScope: parts[i].ruleScope || ruleScope},
                        mapping,
                        currentState,
                        stack,
                        excludeActiveInnerScope
                    )
                );
            tokens.push(parts[i]);
            if (parts[i].retokenizeState) {
                var retokenized = this.getLineTokens(parts[i].value, parts[i].retokenizeState).tokens;
                tokens.pop();
                for (var j = 0; j < retokenized.length; j++) {
                    this.setTokenScope(
                        retokenized[j],
                        this.mergeRetokenizedScope(parts[i].scope, retokenized[j].scope)
                    );
                    tokens.push(retokenized[j]);
                }
            }
        }
        return {type: null, value: ""};
    }

    /**
     * Returns an object containing two properties: `tokens`, which contains all the tokens; and `state`, the current state.
     * @param {string} line
     * @param {string | string[]} startState
     * @returns {{tokens:import("../ace-internal").Ace.Token[], state: string|string[]}}
     */
    getLineTokens(line, startState) {
        if (startState && typeof startState != "string") {
            /**@type {any[]}*/
            var stack = startState.slice(0);
            Object.getOwnPropertyNames(startState).forEach(function(name) {
                if (name == "length" || /^\d+$/.test(name))
                    return;
                var value = startState[name];
                if (Array.isArray(value))
                    value = value.slice(0);
                Object.defineProperty(stack, name, {
                    value: value,
                    configurable: true,
                    writable: true
                });
            });
            startState = stack[0];
            if (startState === "#tmp") {
                stack.shift();
                startState = stack.shift();
            }
        } else
            var stack = [];

        var currentState = /**@type{string}*/(startState) || "start";
        var state = this.states[currentState];
        if (!state) {
            currentState = "start";
            state = this.states[currentState];
        }
        var mapping = this.matchMappings[currentState];
        var re = this.regExps[currentState];
        re.lastIndex = 0;

        var match, tokens = [];
        var lastIndex = 0;
        var stalledMatchAttempts = 0;
        var lineEndConsumed = false;

        var token = {type: null, value: ""};

        var whileFrames = this.getTmFrames(stack);
        var whileIndex = 0;
        for (var frameIndex = 0; frameIndex < whileFrames.length; frameIndex++) {
            var whileFrame = whileFrames[frameIndex];
            if (!whileFrame.whileSource)
                continue;
            var whileMatch = this.matchTmRegexAt(
                whileFrame.whileSource,
                whileFrame.captures,
                whileFrame.whileFlags,
                line,
                whileIndex
            );
            if (!whileMatch) {
                currentState = this.popTmFramesThrough(currentState, stack, whileFrame);
                state = this.states[currentState] || this.states.start;
                mapping = this.matchMappings[currentState];
                re = this.regExps[currentState];
                if (whileIndex === 0) {
                    whileFrames = this.getTmFrames(stack);
                    frameIndex = -1;
                }
                break;
            }
            if (typeof (whileFrame.whileToken || whileFrame.contentToken) == "string")
                token = this.appendScopedToken(
                    tokens,
                    token,
                    whileFrame.whileToken || whileFrame.contentToken,
                    whileMatch[0],
                    this.getTokenScope(
                        whileFrame.whileToken || whileFrame.contentToken,
                        {ruleScope: whileFrame.whileRuleScope || whileFrame.outerScope},
                        this.matchMappings[currentState] || this.matchMappings.start,
                        currentState,
                        stack
                    )
                );
            else
                token = this.appendCapturedTokens(
                    tokens,
                    token,
                    whileFrame.whileToken || whileFrame.contentToken,
                    whileMatch[0],
                    whileFrame.whileRuleScope || whileFrame.outerScope,
                    this.matchMappings[currentState] || this.matchMappings.start,
                    currentState,
                    stack,
                    this.createTmSplitterRegex(whileFrame.whileSource, whileFrame.captures, whileFrame.whileFlags),
                    whileFrame.whileMerge
                );
            whileIndex += whileMatch[0].length;
        }
        lastIndex = whileIndex;

        while (lastIndex <= line.length) {
            var activeTmFrame = this.getActiveTmFrame(currentState, stack);
            var endMatch = null;
            if (activeTmFrame && activeTmFrame.endSource) {
                var endSearchSource = /\\[1-9]/.test(activeTmFrame.endSource)
                    ? this.expandTmSource(activeTmFrame.endSource, activeTmFrame.captures)
                    : activeTmFrame.broadEndSource;
                var endSearchRegex = new RegExp(endSearchSource, (activeTmFrame.endFlags || "") + "g");
                endSearchRegex.lastIndex = lastIndex;
                var candidate = endSearchRegex.exec(line);
                var exactCandidate = candidate && this.matchTmRegexAt(
                    activeTmFrame.endSource,
                    activeTmFrame.captures,
                    activeTmFrame.endFlags,
                    line,
                    candidate.index
                );
                if (candidate && exactCandidate) {
                    endMatch = {
                        index: candidate.index,
                        value: exactCandidate[0]
                    };
                }
            }

            re.lastIndex = lastIndex;
            match = re.exec(line);
            var regularRule = null;
            var matchedRuleIndex = -1;
            if (match) {
                for (var mi = 0; mi < match.length - 2; mi++) {
                    if (match[mi + 1] !== undefined) {
                        matchedRuleIndex = mi;
                        regularRule = state[mapping[mi]];
                        break;
                    }
                }
            }
            var anchoredMatch = this.matchAnchoredRule(currentState, line, lastIndex);
            var usingAnchoredMatch = false;
            if (anchoredMatch && (
                !match ||
                match.index > anchoredMatch.index ||
                (match.index === anchoredMatch.index && (!regularRule || anchoredMatch.rule.$index < regularRule.$index))
            )) {
                match = anchoredMatch.match;
                regularRule = anchoredMatch.rule;
                matchedRuleIndex = -1;
                usingAnchoredMatch = true;
            }
            if (!match && !endMatch)
                break;
            var matchIndex = match ? (usingAnchoredMatch ? lastIndex : match.index) : Infinity;
            if (endMatch && (
                endMatch.index < matchIndex ||
                (endMatch.index === matchIndex && (
                    !(activeTmFrame && activeTmFrame.applyEndPatternLast) ||
                    endMatch.value.length === 0
                ))
            )) {
                match = null;
                matchIndex = endMatch.index;
            }
            var type = this.getDefaultToken(currentState, stack);
            var rule = null;
            var value = match ? match[0] : endMatch.value;
            var index = match
                ? (usingAnchoredMatch ? lastIndex + value.length : re.lastIndex)
                : endMatch.index + endMatch.value.length;
            rule = regularRule;

            if (index - value.length > lastIndex) {
                var skipped = line.substring(lastIndex, index - value.length);
                if (rule && rule.leadingToken) {
                    var leadingScope = this.getTokenScope(
                        rule.leadingToken,
                        {ruleScope: rule.leadingRuleScope},
                        mapping,
                        currentState,
                        stack
                    );
                    token = this.appendScopedToken(tokens, token, rule.leadingToken, skipped, leadingScope);
                } else {
                    var skippedScope = this.getTokenScope(type, null, mapping, currentState, stack);
                    token = this.appendScopedToken(tokens, token, type, skipped, skippedScope);
                }
            }

            if (!match && endMatch) {
                var advancedAtEnd = index > lastIndex || !!endMatch.value;
                token = this.appendCapturedTokens(
                    tokens,
                    token,
                    activeTmFrame.endToken,
                    endMatch.value,
                    activeTmFrame.endRuleScope || activeTmFrame.outerScope,
                    mapping,
                    currentState,
                    stack,
                    typeof activeTmFrame.endToken == "string"
                        ? null
                        : this.createTmSplitterRegex(activeTmFrame.endSource, activeTmFrame.captures, activeTmFrame.endFlags),
                    activeTmFrame.endMerge,
                    true
                );
                lastIndex = index;
                currentState = this.popTmFrame(currentState, stack);
                state = this.states[currentState] || this.states.start;
                mapping = this.matchMappings[currentState];
                re = this.regExps[currentState];
                if (advancedAtEnd)
                    stalledMatchAttempts = 0;
                if (lastIndex >= line.length)
                    break;
                continue;
            }

            for (var i = matchedRuleIndex; i < match.length-2; i++) {
                if (i < 0 || match[i + 1] === undefined)
                    continue;

                if (rule.onMatch)
                    type = rule.onMatch(value, currentState, stack, line);
                else
                    type = rule.token;

                if (!rule.tmBegin && rule.next) {
                    if (typeof rule.next == "string") {
                        currentState = rule.next;
                    } else {
                        currentState = rule.next(currentState, stack);
                    }
                    
                    state = this.states[currentState];
                    if (!state) {
                        this.reportError("state doesn't exist", currentState);
                        currentState = "start";
                        state = this.states[currentState];
                    }
                    if (index > lastIndex)
                        stalledMatchAttempts = 0;
                    mapping = this.matchMappings[currentState];
                    lastIndex = index;
                    re = this.regExps[currentState];
                    re.lastIndex = index;
                }
                if (rule.consumeLineEnd)
                    lineEndConsumed = true;
                if (rule.consumeLineEnd)
                    lastIndex = index;
                break;
            }

            if (value) {
                if (typeof type === "string") {
                    var ruleScope = this.getTokenScope(type, rule, mapping, currentState, stack);
                    if ((!rule || rule.merge !== false))
                        token = this.appendScopedToken(tokens, token, type, value, ruleScope);
                    else {
                        if (token.type)
                            tokens.push(token);
                        tokens.push(this.setTokenScope({
                            type: type,
                            value: value
                        }, ruleScope));
                        token = {type: null, value: ""};
                    }
                } else if (type) {
                    if (!Array.isArray(type))
                        type = [type];
                    if (token.type)
                        tokens.push(token);
                    token = {type: null, value: ""};
                    for (var i = 0; i < type.length; i++) {
                        if (type[i] && type[i].value == null)
                            type[i] = Object.assign({value: value}, type[i]);
                        if (type[i].type && !type[i].scope)
                            this.setTokenScope(
                                type[i],
                                this.getTokenScope(
                                    type[i].type,
                                    {
                                        ruleScope: type[i].ruleScope || (rule && rule.ruleScope),
                                        tmBegin: rule && rule.tmBegin
                                    },
                                    mapping,
                                    currentState,
                                    stack
                                )
                            );
                        tokens.push(type[i]);
                        if (type[i].retokenizeState) {
                            var retokenized = this.getLineTokens(type[i].value, type[i].retokenizeState).tokens;
                            tokens.pop();
                            for (var j = 0; j < retokenized.length; j++) {
                                this.setTokenScope(
                                    retokenized[j],
                                    this.mergeRetokenizedScope(type[i].scope, retokenized[j].scope)
                                );
                                tokens.push(retokenized[j]);
                            }
                        }
                    }
                }
            }

            var advanced = index > lastIndex;
            if (rule && rule.tmBegin) {
                var previousFrame = activeTmFrame;
                currentState = this.pushTmFrame(currentState, stack, rule.tmBegin, value);
                state = this.states[currentState];
                mapping = this.matchMappings[currentState];
                re = this.regExps[currentState];
                re.lastIndex = index;

                if (!advanced) {
                    var pushedFrame = this.getActiveTmFrame(currentState, stack);
                    if (previousFrame && pushedFrame && this.sameTmFrame(previousFrame, pushedFrame)) {
                        currentState = this.popTmFrame(currentState, stack);
                        state = this.states[currentState] || this.states.start;
                        mapping = this.matchMappings[currentState];
                        re = this.regExps[currentState];
                        var remainderType = this.getDefaultToken(currentState, stack);
                        var remainderScope = this.getTokenScope(remainderType, null, mapping, currentState, stack);
                        token = this.appendScopedToken(
                            tokens,
                            token,
                            remainderType,
                            line.slice(index),
                            remainderScope
                        );
                        lastIndex = line.length;
                        break;
                    }
                }
            }

            if (lastIndex >= line.length)
                break;

            if (advanced)
                stalledMatchAttempts = 0;
            else
                stalledMatchAttempts++;

            lastIndex = index;

            if (stalledMatchAttempts > MAX_TOKEN_COUNT) {
                if (stalledMatchAttempts > 2 * line.length) {
                    this.reportError("infinite loop with in ace tokenizer", {
                        startState: startState,
                        line: line
                    });
                }
                // chrome doens't show contents of text nodes with very long text
                while (lastIndex < line.length) {
                    if (token.type)
                        tokens.push(token);
                    token = this.setTokenScope({
                        value: line.substring(lastIndex, lastIndex += 500),
                        type: "overflow"
                    }, this.getTokenScope("overflow", null, mapping, currentState, stack));
                }
                currentState = "start";
                stack = [];
                break;
            }
        }

        if (token.type)
            tokens.push(token);

        while (true) {
            if (lineEndConsumed)
                break;
            var finalFrames = this.getTmFrames(stack);
            var finalFrame = finalFrames[finalFrames.length - 1];
            if (!finalFrame || !finalFrame.endSource)
                break;
            if ((finalFrame.endSource + "").charAt(0) === "^" && line.length > 0)
                break;
            var finalEndMatch = this.matchTmRegexAt(
                finalFrame.endSource,
                finalFrame.captures,
                finalFrame.endFlags,
                line,
                line.length
            );
            if (!finalEndMatch || finalEndMatch[0] !== "")
                break;
            currentState = this.popSpecificTmFrame(currentState, stack, finalFrame);
        }
        
        if (stack.length > 1) {
            if (stack[0] !== currentState)
                stack.unshift("#tmp", currentState);
        }
        return {
            tokens : tokens,
            state : stack.length ? stack : currentState
        };
    }
}

Tokenizer.prototype.reportError = reportError;
exports.Tokenizer = Tokenizer;
