"use strict";
const reportError = require("./lib/report_error").reportError;
const Scope = require("./scope").Scope;
const ScopedFrameManager = require("./scoped_frame_manager").ScopedFrameManager;
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
        this.scopedFrames = new ScopedFrameManager(this.rootScope);

        this.regExps = {};
        this.stickyRegExps = {};
        this.matchMappings = {};
        for (var key in this.states) {
            var state = this.states[key];
            var ruleRegExps = [];
            var stickyRuleRegExps = [];
            var matchTotal = 0;
            var stickyMatchTotal = 0;
            var mapping = this.matchMappings[key] = {defaultToken: "text", defaultScope: null};
            var stickyMapping = mapping.sticky = {};
            var flag = "g";

            var splitterRurles = [];
            for (var i = 0; i < state.length; i++) {
                var rule = state[i];
                if (rule.defaultToken) {
                    mapping.defaultToken = rule.defaultToken;
                    mapping.defaultScope = rule.ruleScope || rule.defaultScope || mapping.defaultScope;
                }
                var scopeRule = rule.scope;
                if (scopeRule && (scopeRule.type === "begin" || scopeRule.type === "while")) {
                    scopeRule.beginRegex = rule.regex instanceof RegExp
                        ? rule.regex
                        : new RegExp("^(?:" + rule.regex + ")$", scopeRule.beginFlags);
                    if (scopeRule.nameRegex) {
                        scopeRule.nameRegex = scopeRule.nameRegex instanceof RegExp
                            ? scopeRule.nameRegex
                            : new RegExp("^(?:" + scopeRule.nameRegex + ")", scopeRule.beginFlags);
                    }
                    scopeRule.source = scopeRule.regex instanceof RegExp
                        ? scopeRule.regex.source
                        : scopeRule.regex;
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

                if (rule.sticky) {
                    stickyMapping[stickyMatchTotal] = i;
                    stickyMatchTotal += matchcount;
                    stickyRuleRegExps.push(adjustedregex);
                } else {
                    mapping[matchTotal] = i;
                    matchTotal += matchcount;
                    ruleRegExps.push(adjustedregex);
                }

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
            if (stickyRuleRegExps.length)
                this.stickyRegExps[key] = new RegExp("(" + stickyRuleRegExps.join(")|(") + ")|($)", flag.replace(/g/g, "") + "y");
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
            if (type == null)
                continue;
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
     * @param {string} source
     * @param {string[]|undefined} captures
     * @param {string} flags
     * @param {string} line
     * @param {number} index
     */
    matchScopedRegexAt(source, captures, flags, line, index) {
        if (source == null)
            return null;
        source = this.expandRegexBackrefs(source, captures);
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
    expandRegexBackrefs(source, captures) {
        return source.replace(/\\([1-9])/g, function(_, captureIndex) {
            var value = captures && captures[captureIndex - 1] || "";
            return value.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
        });
    }

    /**
     * @param {string} source
     * @param {string[]|undefined} captures
     * @param {string} flags
     */
    createScopedSplitterRegex(source, captures, flags) {
        return this.createSplitterRegexp(this.expandRegexBackrefs(source, captures), flags || "");
    }

    /**
     * @param {string} currentState
     * @param {any[]} stack
     */
    getDefaultToken(currentState, stack) {
        var frame = this.scopedFrames.getActive(currentState, stack);
        return frame ? frame.contentToken : this.matchMappings[currentState].defaultToken;
    }

    /**
     * @param {string} type
     * @param {any} rule
     * @param {{defaultScope?: string|null}} mapping
     * @returns {Scope}
     */
    getTokenScope(type, rule, mapping, currentState, stack, excludeActiveInnerScope) {
        var scope = this.scopedFrames.getContentScope(stack, excludeActiveInnerScope);
        var scopeNames = rule && rule.ruleScope;
        if (!scopeNames) {
            var frame = this.scopedFrames.getActive(currentState || "", stack || []);
            if (frame)
                scopeNames = frame.innerScope;
        }
        if (!scopeNames)
            scopeNames = mapping.defaultScope;
        scopeNames = Scope.toNames(scopeNames);
        var activeFrame = this.scopedFrames.getActive(currentState || "", stack || []);
        if (!(rule && rule.scope && (rule.scope.type === "begin" || rule.scope.type === "while")) && activeFrame)
            scopeNames = Scope.trimActivePrefix(
                scopeNames,
                activeFrame.outerScope,
                activeFrame.innerScope,
                excludeActiveInnerScope
            );
        return scope.append(scopeNames);
    }

    /**
     * @param {import("../ace-internal").Ace.Token} token
     * @param {Scope} scope
     */
    setTokenScope(token, scope) {
        return scope ? scope.attachTo(token) : token;
    }

    getCaptureScopeRule(ruleScope, isScopedBegin) {
        return {
            ruleScope: ruleScope,
            scope: isScopedBegin ? {type: "begin"} : null
        };
    }

    appendRetokenizedTokens(tokens, part, retokenizeState) {
        var retokenized = this.getLineTokens(part.value, retokenizeState || part.retokenizeState).tokens;
        for (var j = 0; j < retokenized.length; j++) {
            this.setTokenScope(
                retokenized[j],
                this.mergeRetokenizedScope(part.scope, retokenized[j].scope)
            );
            tokens.push(retokenized[j]);
        }
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
        return scope.prepend(ruleScope);
    }

    mergeRetokenizedScope(ambientScope, childScope) {
        if (!ambientScope)
            return childScope;
        if (!childScope)
            return ambientScope;
        return ambientScope.merge(childScope);
    }

    appendStringCapturedToken(tokens, token, type, value, ruleScope, mapping, currentState, stack, merge, excludeActiveInnerScope, isTmBegin) {
        var scope = this.getTokenScope(
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
            tokens.push(this.setTokenScope({
                type: type,
                value: value
            }, scope));
            return {type: null, value: ""};
        }
        return this.appendScopedToken(tokens, token, type, value, scope);
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
        if (part.type && !part.scope)
            this.setTokenScope(
                part,
                this.getTokenScope(
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
        var fullRange = match.indices[0];
        var position = fullRange[0];
        var defaultType = Array.isArray(ruleScope)
            ? ruleScope[ruleScope.length - 1]
            : ruleScope || mapping.defaultToken || "text";
        var defaultScope = this.getTokenScope(
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
            tokens.push(this.setTokenScope({
                type: meta.type || defaultType,
                value: value.slice(position, end)
            }, meta.scope || defaultScope));
            position = end;
        }.bind(this);

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
                this.getTokenScope(parts, this.getCaptureScopeRule(ruleScope, isTmBegin), mapping, currentState, stack, excludeActiveInnerScope)
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
    appendCapturedTokens(tokens, token, type, value, ruleScope, mapping, currentState, stack, splitRegex, merge, excludeActiveInnerScope, emitGaps, isTmBegin) {
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

                if (
                    this.hasIndexedCaptures(match, type) &&
                    this.hasIndexedCaptureGaps(match, type)
                )
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

        var whileFrames = this.scopedFrames.getAll(stack);
        var whileIndex = 0;
        for (var frameIndex = 0; frameIndex < whileFrames.length; frameIndex++) {
            var whileFrame = whileFrames[frameIndex];
            if (whileFrame.type !== "while" || !whileFrame.source)
                continue;
            var whileMatch = this.matchScopedRegexAt(
                whileFrame.source,
                whileFrame.captures,
                whileFrame.flags,
                line,
                whileIndex
            );
            if (!whileMatch) {
                currentState = this.scopedFrames.popThrough(currentState, stack, whileFrame);
                state = this.states[currentState] || this.states.start;
                mapping = this.matchMappings[currentState];
                re = this.regExps[currentState];
                if (whileIndex === 0) {
                    whileFrames = this.scopedFrames.getAll(stack);
                    frameIndex = -1;
                }
                break;
            }
            if (typeof (whileFrame.token || whileFrame.contentToken) == "string")
                token = this.appendScopedToken(
                    tokens,
                    token,
                    whileFrame.token || whileFrame.contentToken,
                    whileMatch[0],
                    this.getTokenScope(
                        whileFrame.token || whileFrame.contentToken,
                        {ruleScope: whileFrame.ruleScope || whileFrame.outerScope},
                        this.matchMappings[currentState] || this.matchMappings.start,
                        currentState,
                        stack
                    )
                );
            else
                token = this.appendCapturedTokens(
                    tokens,
                    token,
                    whileFrame.token || whileFrame.contentToken,
                    whileMatch[0],
                    whileFrame.ruleScope || whileFrame.outerScope,
                    this.matchMappings[currentState] || this.matchMappings.start,
                    currentState,
                    stack,
                    this.createScopedSplitterRegex(
                        whileFrame.source,
                        whileFrame.captures,
                        (whileFrame.flags || "") + (HAS_INDICES && (whileFrame.flags || "").indexOf("d") === -1 ? "d" : "")
                    ),
                    whileFrame.merge,
                    false,
                    true
                );
            whileIndex += whileMatch[0].length;
        }
        lastIndex = whileIndex;

        while (lastIndex <= line.length) {
            var activeScopedFrame = this.scopedFrames.getActive(currentState, stack);
            var endMatch = null;
            if (activeScopedFrame && activeScopedFrame.type === "begin" && activeScopedFrame.source != null) {
                var endSearchRegex = new RegExp(
                    this.expandRegexBackrefs(activeScopedFrame.source, activeScopedFrame.captures),
                    (activeScopedFrame.flags || "") + "g"
                );
                endSearchRegex.lastIndex = lastIndex;
                var candidate = endSearchRegex.exec(line);
                var exactCandidate = candidate && this.matchScopedRegexAt(
                    activeScopedFrame.source,
                    activeScopedFrame.captures,
                    activeScopedFrame.flags,
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
            var stickyRe = this.stickyRegExps[currentState];
            var stickyMapping = mapping.sticky;
            var stickyMatch = null;
            var stickyRule = null;
            var stickyMatchedRuleIndex = -1;
            if (stickyRe) {
                stickyRe.lastIndex = lastIndex;
                stickyMatch = stickyRe.exec(line);
                if (stickyMatch) {
                    for (var smi = 0; smi < stickyMatch.length - 2; smi++) {
                        if (stickyMatch[smi + 1] !== undefined) {
                            stickyMatchedRuleIndex = smi;
                            stickyRule = state[stickyMapping[smi]];
                            break;
                        }
                    }
                }
            }
            if (match) {
                for (var mi = 0; mi < match.length - 2; mi++) {
                    if (match[mi + 1] !== undefined) {
                        matchedRuleIndex = mi;
                        regularRule = state[mapping[mi]];
                        break;
                    }
                }
            }
            if (stickyMatch && (
                !match ||
                match.index > lastIndex ||
                (match.index === lastIndex && (!regularRule || stickyRule.$index < regularRule.$index))
            )) {
                match = stickyMatch;
                regularRule = stickyRule;
                matchedRuleIndex = stickyMatchedRuleIndex;
            }
            if (!match && !endMatch)
                break;
            var matchIndex = match ? match.index : Infinity;
            if (endMatch && (
                endMatch.index < matchIndex ||
                (endMatch.index === matchIndex && (
                    !(activeScopedFrame && activeScopedFrame.applyEndPatternLast) ||
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
                ? re.lastIndex
                : endMatch.index + endMatch.value.length;
            rule = regularRule;

            if (index - value.length > lastIndex) {
                var skipped = line.substring(lastIndex, index - value.length);
                var skippedScope = this.getTokenScope(type, null, mapping, currentState, stack);
                token = this.appendScopedToken(tokens, token, type, skipped, skippedScope);
            }

            if (!match && endMatch) {
                var advancedAtEnd = index > lastIndex || !!endMatch.value;
                token = this.appendCapturedTokens(
                    tokens,
                    token,
                    activeScopedFrame.token,
                    endMatch.value,
                    activeScopedFrame.ruleScope || activeScopedFrame.outerScope,
                    mapping,
                    currentState,
                    stack,
                    typeof activeScopedFrame.token == "string"
                        ? null
                        : this.createScopedSplitterRegex(
                            activeScopedFrame.source,
                            activeScopedFrame.captures,
                            (activeScopedFrame.flags || "") + (HAS_INDICES && (activeScopedFrame.flags || "").indexOf("d") === -1 ? "d" : "")
                        ),
                    activeScopedFrame.merge,
                    true,
                    true
                );
                lastIndex = index;
                currentState = this.scopedFrames.popActive(currentState, stack);
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
                if (!rule)
                    continue;

                if (rule.scope && (rule.scope.type === "begin" || rule.scope.type === "while") && rule.tokenArray)
                    type = rule.tokenArray;
                else if (rule.onMatch)
                    type = rule.onMatch(value, currentState, stack, line);
                else
                    type = rule.token;

                if (!(rule.scope && (rule.scope.type === "begin" || rule.scope.type === "while")) && rule.next) {
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
                    var scopeRule = rule;
                    if (rule && rule.scope && (rule.scope.type === "begin" || rule.scope.type === "while") && rule.ruleScope) {
                        var stringBeginRegex = rule.scope.nameRegex || rule.scope.beginRegex;
                        var stringBeginMatch = stringBeginRegex.exec(value)
                            || stringBeginRegex.exec(line.slice(index - value.length));
                        scopeRule = {
                            ruleScope: Scope.expandBackrefs(
                                rule.ruleScope,
                                stringBeginMatch ? stringBeginMatch.slice(1) : []
                            ),
                            scope: rule.scope
                        };
                    }
                    var ruleScope = this.getTokenScope(type, scopeRule, mapping, currentState, stack);
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
                    var beginCaptures = null;
                    if (rule && rule.scope && (rule.scope.type === "begin" || rule.scope.type === "while")) {
                        var arrayBeginRegex = rule.scope.nameRegex || rule.scope.beginRegex;
                        var arrayBeginMatch = arrayBeginRegex.exec(value)
                            || arrayBeginRegex.exec(line.slice(index - value.length));
                        beginCaptures = arrayBeginMatch ? arrayBeginMatch.slice(1) : [];
                        var beginRuleScope = Scope.expandBackrefs(rule.ruleScope, beginCaptures);
                        var beginTypes = type.map(function(part) {
                            if (!part || typeof part != "object")
                                return part;
                            part = Object.assign({}, part);
                            part.ruleScope = Scope.expandBackrefs(part.ruleScope || beginRuleScope, beginCaptures);
                            return part;
                        });
                        token = this.appendCapturedTokens(
                            tokens,
                            token,
                            beginTypes,
                            value,
                            beginRuleScope,
                            mapping,
                            currentState,
                            stack,
                            this.createScopedSplitterRegex(
                                rule.regex,
                                null,
                                (rule.scope.beginFlags || "") + (HAS_INDICES && (rule.scope.beginFlags || "").indexOf("d") === -1 ? "d" : "")
                            ),
                            rule.merge,
                            false,
                            true,
                            true
                        );
                        type = null;
                    }
                    if (type) {
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
                                            scope: rule && rule.scope
                                        },
                                        mapping,
                                        currentState,
                                        stack
                                    )
                                );
                            tokens.push(type[i]);
                            if (type[i].retokenizeState) {
                                tokens.pop();
                                this.appendRetokenizedTokens(tokens, type[i]);
                            }
                        }
                    }
                }
            }

            var advanced = index > lastIndex;
            if (rule && rule.scope && (rule.scope.type === "begin" || rule.scope.type === "while")) {
                var previousFrame = activeScopedFrame;
                var contentMapping = this.matchMappings[rule.scope.state] || {};
                var contentToken = contentMapping.defaultToken || rule.scope.contentName || rule.scope.name || "text";
                var pushedFrame = this.scopedFrames.create(rule.scope, value, stack, contentToken);
                stack.unshift(rule.scope.state, pushedFrame, currentState || "start");
                currentState = rule.scope.state;
                state = this.states[currentState];
                mapping = this.matchMappings[currentState];
                re = this.regExps[currentState];
                re.lastIndex = index;

                if (!advanced) {
                    if (previousFrame && pushedFrame && this.scopedFrames.same(previousFrame, pushedFrame)) {
                        currentState = this.scopedFrames.popActive(currentState, stack);
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
            var finalFrames = this.scopedFrames.getAll(stack);
            var finalFrame = finalFrames[finalFrames.length - 1];
            if (!finalFrame || finalFrame.type !== "begin" || finalFrame.source == null)
                break;
            if ((finalFrame.source + "").charAt(0) === "^" && line.length > 0)
                break;
            var finalEndMatch = this.matchScopedRegexAt(
                finalFrame.source,
                finalFrame.captures,
                finalFrame.flags,
                line,
                line.length
            );
            if (!finalEndMatch || finalEndMatch[0] !== "")
                break;
            currentState = this.scopedFrames.popSpecific(currentState, stack, finalFrame);
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
