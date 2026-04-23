"use strict";

const deepCopy = require("../lib/deep_copy").deepCopy;

/**@type {(new() => Partial<import("../../ace-internal").Ace.HighlightRules>) & {prototype: import("../../ace-internal").Ace.HighlightRules}}*/
var TextHighlightRules;
TextHighlightRules = function() {

    // regexp must not have capturing parentheses
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [{
            token : "empty_line",
            regex : '^$'
        }, {
            defaultToken : "text"
        }]
    };
};

(function() {

    /**
     * @param {import("../../ace-internal").Ace.HighlightRulesMap} rules
     * @param {string} [prefix]
     * @this {import("../../ace-internal").Ace.HighlightRules}
     */
    this.addRules = function(rules, prefix) {
        if (!prefix) {
            for (var key in rules)
                this.$rules[key] = rules[key];
            return;
        }
        for (var key in rules) {
            var state = rules[key];
            delete state.processed;
            for (var i = 0; i < state.length; i++) {
                var rule = state[i];
                if (rule.next || rule.onMatch) {
                    if (typeof rule.next == "string") {
                        if (rule.next.indexOf(prefix) !== 0)
                            rule.next = prefix + rule.next;
                    }
                    if (rule.nextState && rule.nextState.indexOf(prefix) !== 0)
                        rule.nextState = prefix + rule.nextState;
                }
                if (rule.tmBegin && rule.tmBegin.state && rule.tmBegin.state.indexOf(prefix) !== 0)
                    rule.tmBegin.state = prefix + rule.tmBegin.state;
            }
            this.$rules[prefix + key] = state;
        }
    };

    /**
     * @returns {import("../../ace-internal").Ace.HighlightRulesMap}
     * @this {import("../../ace-internal").Ace.HighlightRules}
     */
    this.getRules = function() {
        return this.$rules;
    };

    /**
     * @param HighlightRules
     * @param prefix
     * @param escapeRules
     * @param states
     * @param append
     * @this {import("../../ace-internal").Ace.HighlightRules}
     */
    this.embedRules = function (HighlightRules, prefix, escapeRules, states, append) {
        var embedRules = typeof HighlightRules == "function"
            ? new HighlightRules().getRules()
            : HighlightRules;
        if (states) {
            for (var i = 0; i < states.length; i++)
                states[i] = prefix + states[i];
        } else {
            states = [];
            for (var key in embedRules)
                states.push(prefix + key);
        }

        this.addRules(embedRules, prefix);

        if (escapeRules) {
            var addRules = Array.prototype[append ? "push" : "unshift"];
            for (var i = 0; i < states.length; i++)
                addRules.apply(this.$rules[states[i]], deepCopy(escapeRules));
        }

        if (!this.$embeds)
            this.$embeds = [];
        this.$embeds.push(prefix);
    };

    /**
     * @this {import("../../ace-internal").Ace.HighlightRules}
     */
    this.getEmbeds = function() {
        return this.$embeds;
    };

    function regexpSource(re) {
        return re instanceof RegExp ? re.source : re;
    }
    function regexpFlags(re) {
        return re instanceof RegExp ? (re.ignoreCase ? "i" : "") + (re.multiline ? "m" : "") + (re.unicode ? "u" : "") : "";
    }
    function captureToken(captures, fallback) {
        var capture = captures && (captures[0] || captures["0"]);
        if (typeof capture == "string")
            return capture;
        return capture && capture.name || fallback;
    }
    function appendRuleScope(baseScope, scopeName) {
        var scopes = Array.isArray(baseScope) ? baseScope.slice() : baseScope ? [baseScope] : [];
        if (scopeName && scopes[scopes.length - 1] !== scopeName)
            scopes.push(scopeName);
        return scopes;
    }
    function appendCaptureScope(baseScope, scopeName) {
        var scopes = Array.isArray(baseScope) ? baseScope.slice() : baseScope ? [baseScope] : [];
        if (scopeName)
            scopes.push(scopeName);
        return scopes;
    }
    function sameScopeList(a, b) {
        if (!Array.isArray(a))
            a = a ? [a] : [];
        if (!Array.isArray(b))
            b = b ? [b] : [];
        if (a.length !== b.length)
            return false;
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    }
    function appendScopeNames(base, extra) {
        if (!Array.isArray(base))
            base = base ? [base] : [];
        if (!Array.isArray(extra))
            extra = extra ? [extra] : [];
        return base.concat(extra);
    }
    function hasScopeBackrefs(scope) {
        if (Array.isArray(scope))
            return scope.some(hasScopeBackrefs);
        return typeof scope == "string" && /\$\d+/.test(scope);
    }
    function expandScopeBackrefs(scope, match) {
        if (Array.isArray(scope))
            return scope.map(function(part) { return expandScopeBackrefs(part, match); });
        if (typeof scope != "string")
            return scope;
        return scope.replace(/\$(\d+)/g, function(_, index) {
            return match && match[Number(index)] || "";
        });
    }
    function tmCaptureTokens(value) {
        if (!value)
            return [];
        if (!this.tmCaptureSplitRegex) {
            var flags = (this.caseInsensitive ? "i" : "") + (this.unicode ? "u" : "");
            try {
                this.tmCaptureSplitRegex = new RegExp("^(?:" + this.regex + ")$", flags + "d");
            } catch (e) {}
        }
        var match = this.tmCaptureSplitRegex && this.tmCaptureSplitRegex.exec(value);
        if (!match || !match.indices || !match.indices[0])
            return [{
                type: this.tmCaptureDefaultType,
                value: value,
                ruleScope: this.tmCaptureBaseScope
            }];

        var tokens = [];
        var fullRange = match.indices[0];
        var captureMeta = this.tmCaptureData || [];
        var localStack = [];
        var baseType = this.tmCaptureDefaultType || "text";
        var baseScope = this.tmCaptureBaseScope || [];
        var position = fullRange[0];

        function currentMeta() {
            return localStack[localStack.length - 1] || {
                type: baseType,
                ruleScope: baseScope
            };
        }
        function emit(end) {
            if (end <= position)
                return;
            var meta = currentMeta();
            tokens.push({
                type: meta.type || baseType,
                value: value.slice(position, end),
                ruleScope: meta.ruleScope
            });
            position = end;
        }
        function getLocalCaptureMatch(captureIndex, range) {
            var local = [match[captureIndex]];
            for (var j = 1; j < match.indices.length; j++) {
                if (j == captureIndex)
                    continue;
                var childRange = match.indices[j];
                if (!childRange || childRange[0] == null || childRange[0] < range[0] || childRange[1] > range[1])
                    continue;
                local.push(match[j]);
            }
            return local.length > 1 ? local : match;
        }

        for (var i = 1; i < match.indices.length && i < captureMeta.length; i++) {
            var meta = captureMeta[i];
            var range = match.indices[i];
            if (!meta || !range || range[0] == null || range[0] < 0 || range[1] <= range[0])
                continue;
            while (localStack.length && localStack[localStack.length - 1].end <= range[0]) {
                emit(localStack[localStack.length - 1].end);
                localStack.pop();
            }
            emit(range[0]);

            var parentMeta = currentMeta();
            var captureName = expandScopeBackrefs(meta.name, getLocalCaptureMatch(i, range));
            var captureScope = captureName
                ? appendCaptureScope(parentMeta.ruleScope, captureName)
                : parentMeta.ruleScope;
            var captureType = captureName || parentMeta.type || baseType;

            if (meta.retokenizeState) {
                tokens.push({
                    type: captureType,
                    value: value.slice(range[0], range[1]),
                    ruleScope: captureScope,
                    retokenizeState: meta.retokenizeState
                });
                position = range[1];
                continue;
            }
            if (captureName) {
                localStack.push({
                    end: range[1],
                    type: captureType,
                    ruleScope: captureScope
                });
            }
        }

        while (localStack.length) {
            emit(localStack[localStack.length - 1].end);
            localStack.pop();
        }
        emit(fullRange[1]);
        return tokens;
    }
    function tmDynamicScopeToken(value) {
        var flags = (this.caseInsensitive ? "i" : "") + (this.unicode ? "u" : "");
        if (!this.tmDynamicScopeRegex)
            this.tmDynamicScopeRegex = new RegExp("^(?:" + this.regex + ")$", flags);
        var match = this.tmDynamicScopeRegex.exec(value);
        return {
            type: this.tmDynamicTokenType || "text",
            value: value,
            ruleScope: expandScopeBackrefs(this.tmDynamicRuleScope, match)
        };
    }
    var pushState = function(currentState, stack) {
        if (currentState != "start" || stack.length)
            stack.unshift(this.nextState, currentState);
        return this.nextState;
    };
    var popState = function(currentState, stack) {
        // if (stack[0] === currentState)
        stack.shift();
        return stack.shift() || "start";
    };

    /**
     * @this {import("../../ace-internal").Ace.HighlightRules}
     */
    this.normalizeRules = function() {
        var id = 0;
        var tmLikeRuleId = 0;
        var rules = this.$rules;
        var pendingStates = [];
        function enqueueState(name) {
            if (!rules[name] || pendingStates.indexOf(name) !== -1)
                return;
            pendingStates.push(name);
        }
        function compileRetokenizeParts(parts, ownerName) {
            if (!Array.isArray(parts))
                return parts;
            return parts.map(function(part, index) {
                if (!part || !part.retokenizePatterns || !part.retokenizePatterns.length)
                    return part;
                var captureStateName = (ownerName || "tmCapture") + ".capture." + index + "." + tmLikeRuleId++;
                rules[captureStateName] = part.retokenizePatterns.concat([{
                    defaultToken: part.type || "text"
                }]);
                enqueueState(captureStateName);
                part = Object.assign({}, part);
                part.retokenizeState = captureStateName;
                delete part.retokenizePatterns;
                return part;
            });
        }
        function compileTmRule(pattern) {
            if (!pattern || pattern.regex)
                return pattern;

            if (pattern.match) {
                var dynamicScope = hasScopeBackrefs(pattern.ruleScope || pattern.name);
                pattern.regex = pattern.match;
                pattern.token = pattern.token || pattern.name || "text";
                pattern.ruleScope = pattern.ruleScope || pattern.name;
                if (pattern.$matchConsumesLineEnd)
                    pattern.consumeLineEnd = true;
                if (pattern.$tmCaptureRules) {
                    var wholeCapture = pattern.$tmCaptureRules[0] || pattern.$tmCaptureRules["0"];
                    var baseScope = Array.isArray(pattern.ruleScope)
                        ? pattern.ruleScope.slice()
                        : pattern.ruleScope ? [pattern.ruleScope] : [];
                    if (wholeCapture && wholeCapture.name)
                        baseScope = appendRuleScope(baseScope, wholeCapture.name);
                    pattern.tmCaptureData = [];
                    Object.keys(pattern.$tmCaptureRules).forEach(function(key) {
                        var capture = pattern.$tmCaptureRules[key];
                        var meta = pattern.tmCaptureData[Number(key)] = {
                            name: capture && capture.name || ""
                        };
                        if (capture && capture.patterns && capture.patterns.length) {
                            var captureStateName = (pattern.name || pattern.token || "tmCapture") + ".capture." + key + "." + tmLikeRuleId++;
                            rules[captureStateName] = capture.patterns.concat([{
                                defaultToken: pattern.token || pattern.name || "text"
                            }]);
                            enqueueState(captureStateName);
                            meta.retokenizeState = captureStateName;
                        }
                    });
                    pattern.tmCaptureBaseScope = baseScope;
                    pattern.tmCaptureDefaultType = wholeCapture && wholeCapture.name || pattern.token || pattern.name || "text";
                    pattern.onMatch = tmCaptureTokens;
                    pattern.token = null;
                } else if (dynamicScope) {
                    pattern.tmDynamicRuleScope = pattern.ruleScope;
                    pattern.tmDynamicTokenType = pattern.token || pattern.name || "text";
                    pattern.onMatch = tmDynamicScopeToken;
                    pattern.token = null;
                }
                delete pattern.match;
                delete pattern.name;
                return pattern;
            }

            if (pattern.begin && (pattern.end != null || pattern.while)) {
                var outerScope = pattern.name || pattern.token;
                var contentToken = pattern.token || outerScope || "text";
                var beginToken = compileRetokenizeParts(
                    pattern.$beginToken || captureToken(pattern.beginCaptures, pattern.token || outerScope || "text"),
                    outerScope || pattern.token
                );
                var endToken = compileRetokenizeParts(
                    pattern.$endToken || captureToken(pattern.endCaptures, pattern.token || outerScope || "text"),
                    outerScope || pattern.token
                );
                var whileToken = compileRetokenizeParts(
                    pattern.$whileToken || captureToken(
                    pattern.whileCaptures || pattern.beginCaptures || pattern.captures,
                    pattern.token || contentToken
                    ),
                    outerScope || pattern.token
                );
                var innerScope = pattern.contentName || outerScope;
                var beginRuleScope = pattern.$beginRuleScope || outerScope;
                var endRuleScope = pattern.$endRuleScope || outerScope;
                var whileRuleScope = pattern.$whileRuleScope || outerScope;
                var tmStateName = pattern.stateName || (outerScope || "tm") + "." + tmLikeRuleId++;
                var beginMerge = beginToken === contentToken && sameScopeList(beginRuleScope, innerScope);
                var endMerge = endToken === contentToken && sameScopeList(endRuleScope, innerScope);
                var whileMerge = whileToken === contentToken && sameScopeList(whileRuleScope, innerScope);

                rules[tmStateName] = (pattern.patterns || []).concat([{
                    defaultToken: contentToken,
                    ruleScope: innerScope
                }]);
                enqueueState(tmStateName);

                return {
                    token: beginToken,
                    merge: beginMerge,
                    ruleScope: beginRuleScope,
                    regex: pattern.begin,
                    consumeLineEnd: !!pattern.$beginConsumesLineEnd,
                    tmBegin: {
                        state: tmStateName,
                        outerScope: outerScope,
                        contentToken: contentToken,
                        innerScope: innerScope,
                        applyEndPatternLast: !!pattern.applyEndPatternLast,
                        end: pattern.end,
                        endToken: endToken,
                        endRuleScope: endRuleScope,
                        endMerge: endMerge,
                        beginScopeRegex: pattern.$beginScopeRegex,
                        while: pattern.while,
                        whileToken: whileToken,
                        whileRuleScope: whileRuleScope,
                        whileMerge: whileMerge,
                        beginFlags: regexpFlags(pattern.begin),
                        endFlags: regexpFlags(pattern.end),
                        whileFlags: regexpFlags(pattern.while)
                    }
                };
            }

            return pattern;
        }
        function processState(key) {
            var state = rules[key];
            if (!state || state["processed"])
                return;
            if (state["processing"])
                return;
            state["processing"] = true;
            state["processed"] = true;
            for (var i = 0; i < state.length; i++) {
                var rule = state[i];
                if (rule && rule.disabled) {
                    state.splice(i, 1);
                    i--;
                    continue;
                }
                rule = state[i] = compileTmRule(rule);
                var toInsert = null;
                if (Array.isArray(rule)) {
                    toInsert = rule;
                    // @ts-ignore
                    rule = {};
                }
                if (!rule.regex && rule.start) {
                    rule.regex = rule.start;
                    if (!rule.next)
                        rule.next = [];
                    rule.next.push({
                        defaultToken: rule.token
                    }, {
                        token: rule.token + ".end",
                        regex: rule.end || rule.start,
                        next: "pop"
                    });
                    rule.token = rule.token + ".start";
                    rule.push = true;
                }
                var next = rule.next || rule.push;
                if (next && Array.isArray(next)) {
                    var stateName = rule.stateName;
                    if (!stateName)  {
                        stateName = rule.token;
                        if (typeof stateName != "string")
                            stateName = stateName[0] || "";
                        if (rules[stateName])
                            stateName += id++;
                    }
                    rules[stateName] = next;
                    rule.next = stateName;
                    enqueueState(stateName);
                } else if (next == "pop") {
                    rule.next = popState;
                }

                if (rule.push) {
                    rule.nextState = rule.next || rule.push;
                    rule.next = pushState;
                    delete rule.push;
                }

                if (rule.rules) {
                    for (var r in rule.rules) {
                        if (rules[r]) {
                            if (rules[r].push)
                                rules[r].push.apply(rules[r], rule.rules[r]);
                        } else {
                            rules[r] = rule.rules[r];
                        }
                    }
                }
                var includeName = typeof rule == "string" ? rule : rule.include;
                if (includeName) {
                    if (includeName === "$self")
                        includeName = "start";
                    if (Array.isArray(includeName)) {
                        toInsert = [];
                        includeName.forEach(function(name) {
                            processState(name);
                            if (rules[name])
                                toInsert = toInsert.concat(rules[name]);
                        });
                    } else {
                        processState(includeName);
                        toInsert = rules[includeName];
                    }
                }

                if (toInsert) {
                    /**
                     * @type{any[]}
                     */
                    // @ts-ignore
                    var args = [i, 1].concat(toInsert);
                    if (rule.noEscape)
                        args = args.filter(function(x) {return !x.next;});
                    state.splice.apply(state, args);
                    // skip included rules since they are already processed
                    //i += args.length - 3;
                    i--;
                }
                
                if (rule.keywordMap) {
                    rule.token = this.createKeywordMapper(
                        rule.keywordMap, rule.defaultToken || "text", rule.caseInsensitive
                    );
                    delete rule.defaultToken;
                }
            }
            delete state["processing"];
        }
        Object.keys(rules).forEach(enqueueState);
        while (pendingStates.length)
            processState(pendingStates.shift());
    };

    this.createKeywordMapper = function(map, defaultToken, ignoreCase, splitChar) {
        var keywords = Object.create(null);
        this.$keywordList = [];
        Object.keys(map).forEach(function(className) {
            var a = map[className];
            var list = a.split(splitChar || "|");
            for (var i = list.length; i--; ) {
                var word = list[i];
                this.$keywordList.push(word);
                if (ignoreCase)
                    word = word.toLowerCase(); 
                keywords[word] = className;
            }
        }, this);
        map = null;
        return ignoreCase
            ? function(value) {return keywords[value.toLowerCase()] || defaultToken; }
            : function(value) {return keywords[value] || defaultToken; };
    };

    /**
     * @this {import("../../ace-internal").Ace.HighlightRules}
     */
    this.getKeywords = function() {
        return this.$keywords;
    };

}).call(TextHighlightRules.prototype);

exports.TextHighlightRules = TextHighlightRules;
