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
        var rules = this.$rules;
        function processState(key) {
            var state = rules[key];
            state["processed"] = true;
            for (var i = 0; i < state.length; i++) {
                var rule = state[i];
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
                    processState(stateName);
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
                    if (Array.isArray(includeName))
                        toInsert = includeName.map(function(x) { return rules[x]; });
                    else
                        toInsert = rules[includeName];
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
        }
        Object.keys(rules).forEach(processState, this);
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
