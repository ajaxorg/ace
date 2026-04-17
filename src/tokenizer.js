"use strict";
const reportError = require("./lib/report_error").reportError;
const Scope = require("./scope").Scope;

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
        for (var key in this.states) {
            var state = this.states[key];
            var ruleRegExps = [];
            var matchTotal = 0;
            var mapping = this.matchMappings[key] = {defaultToken: "text", defaultScope: null};
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
            if (values[i + 1])
                tokens[tokens.length] = {
                    type: types[i],
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
        source = source.replace(/\\([1-9])/g, function(_, captureIndex) {
            var value = captures && captures[captureIndex - 1] || "";
            return value.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
        });
        source = source.replace(/\\G/g, "");
        var re = new RegExp("^(?:" + source + ")", flags || "");
        return re.exec(line.slice(index));
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
        if (tmBegin.whileSource) {
            frame.whileSource = tmBegin.whileSource;
            frame.whileFlags = tmBegin.whileFlags;
            frame.whileToken = tmBegin.whileToken;
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
    getTokenScope(type, rule, mapping, currentState, stack) {
        var scope = this.rootScope;
        var tmFrames = this.getTmFrames(stack || []);
        tmFrames.forEach(function(frame) {
            if (frame.outerScope)
                scope = scope.get(frame.outerScope);
        });
        var scopeName = rule && rule.ruleScope;
        if (!scopeName) {
            var frame = this.getActiveTmFrame(currentState || "", stack || []);
            if (frame)
                scopeName = frame.innerScope;
        }
        if (!scopeName)
            scopeName = mapping.defaultScope;
        var activeFrame = tmFrames[tmFrames.length - 1];
        if (scopeName && (!activeFrame || activeFrame.outerScope !== scopeName))
            scope = scope.get(scopeName);
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
        var matchAttempts = 0;

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
            token = this.appendScopedToken(
                tokens,
                token,
                whileFrame.whileToken || whileFrame.contentToken,
                whileMatch[0],
                this.getTokenScope(
                    whileFrame.whileToken || whileFrame.contentToken,
                    {scope: whileFrame.outerScope},
                    this.matchMappings[currentState] || this.matchMappings.start,
                    currentState,
                    stack
                )
            );
            whileIndex += whileMatch[0].length;
        }
        lastIndex = whileIndex;

        while (lastIndex <= line.length) {
            var activeTmFrame = this.getActiveTmFrame(currentState, stack);
            var endMatch = null;
            if (activeTmFrame && activeTmFrame.endSource) {
                var endSearchRegex = new RegExp(activeTmFrame.broadEndSource, (activeTmFrame.endFlags || "") + "g");
                endSearchRegex.lastIndex = lastIndex;
                var candidate = endSearchRegex.exec(line);
                if (candidate && this.exactEndRegexp(activeTmFrame.endSource, activeTmFrame.captures, activeTmFrame.endFlags).test(candidate[0])) {
                    endMatch = {
                        index: candidate.index,
                        value: candidate[0]
                    };
                }
            }

            re.lastIndex = lastIndex;
            match = re.exec(line);
            if (!match)
                break;
            var matchIndex = match.index;
            if (endMatch && endMatch.index < matchIndex) {
                match = null;
                matchIndex = endMatch.index;
            }
            var type = this.getDefaultToken(currentState, stack);
            var rule = null;
            var value = match ? match[0] : endMatch.value;
            var index = match ? re.lastIndex : endMatch.index + endMatch.value.length;

            if (index - value.length > lastIndex) {
                var skipped = line.substring(lastIndex, index - value.length);
                var skippedScope = this.getTokenScope(type, null, mapping, currentState, stack);
                token = this.appendScopedToken(tokens, token, type, skipped, skippedScope);
            }

            if (!match && endMatch) {
                var endScope = this.getTokenScope(activeTmFrame.endToken, {scope: activeTmFrame.outerScope}, mapping, currentState, stack);
                token = this.appendScopedToken(tokens, token, activeTmFrame.endToken, endMatch.value, endScope);
                lastIndex = index;
                currentState = this.popTmFrame(currentState, stack);
                state = this.states[currentState] || this.states.start;
                mapping = this.matchMappings[currentState];
                re = this.regExps[currentState];
                if (lastIndex >= line.length)
                    break;
                continue;
            }

            for (var i = 0; i < match.length-2; i++) {
                if (match[i + 1] === undefined)
                    continue;

                rule = state[mapping[i]];

                if (rule.onMatch)
                    type = rule.onMatch(value, currentState, stack, line);
                else
                    type = rule.token;

                if (rule.tmBegin) {
                    currentState = this.pushTmFrame(currentState, stack, rule.tmBegin, value);
                    state = this.states[currentState];
                    mapping = this.matchMappings[currentState];
                    lastIndex = index;
                    re = this.regExps[currentState];
                    re.lastIndex = index;
                }

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
                    mapping = this.matchMappings[currentState];
                    lastIndex = index;
                    re = this.regExps[currentState];
                    re.lastIndex = index;
                }
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
                        token = this.setTokenScope({
                            type: type,
                            value: value
                        }, ruleScope);
                    }
                } else if (type) {
                    if (token.type)
                        tokens.push(token);
                    token = {type: null, value: ""};
                    for (var i = 0; i < type.length; i++) {
                        if (type[i].type && !type[i].scope)
                            this.setTokenScope(type[i], this.getTokenScope(type[i].type, rule, mapping, currentState, stack));
                        tokens.push(type[i]);
                    }
                }
            }

            if (lastIndex >= line.length)
                break;

            lastIndex = index;

            if (matchAttempts++ > MAX_TOKEN_COUNT) {
                if (matchAttempts > 2 * line.length) {
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
