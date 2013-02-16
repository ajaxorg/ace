/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {

// tokenizing lines longer than this makes editor very slow
var MAX_TOKEN_COUNT = 1000;
/*
 * version of Tokenizer with additional logging
 * and infinite loop checks
 * can be used for developing/testing new modes
 **/

var Tokenizer = function(rules) {
    this.states = rules;

    this.regExps = {};
    this.matchMappings = {};
    for (var key in this.states) {
        var state = this.states[key];
        var ruleRegExps = [];
        var matchTotal = 0;
        var mapping = this.matchMappings[key] = {defaultToken: "default.text"};
        var flag = "g";

        for (var i = 0; i < state.length; i++) {
            var rule = state[i];
            if (rule.defaultToken)
                mapping.defaultToken = rule.defaultToken;
            if (rule.caseInsensitive)
                flag = "gi";
            if (rule.regex == null)
                continue;
            
            if (rule.regex instanceof RegExp)
                rule.regex = rule.regex.toString().slice(1, -1);

            // Count number of matching groups. 2 extra groups from the full match
            // And the catch-all on the end (used to force a match);
            var adjustedregex = rule.regex;
            var matchcount = new RegExp("(?:(" + adjustedregex + ")|(.))").exec("a").length - 2;
            if (Array.isArray(rule.token)) {
                if (rule.token.length == 1) {
                    rule.token = rule.token[0];
                } else {
                    rule.tokenArray = rule.token;
                    rule.token = this.$arrayTokens;
                }
            }

            if (matchcount > 1) {
                if (/\\\d/.test(rule.regex)) {
                    // Replace any backreferences and offset appropriately.
                    adjustedregex = rule.regex.replace(/\\([0-9]+)/g, function (match, digit) {
                        return "\\" + (parseInt(digit, 10) + matchTotal + 1);
                    });
                } else {
                    matchcount = 1;
                    adjustedregex = this.removeCapturingGroups(rule.regex);
                }
                if (!rule.splitRegex)
                    rule.splitRegex = this.createSplitterRegexp(rule.regex, flag);
            }

            mapping[matchTotal] = i;
            matchTotal += matchcount;

            ruleRegExps.push(adjustedregex);
        }

        this.regExps[key] = new RegExp("(" + ruleRegExps.join(")|(") + ")|($)", flag);
    }
};

(function() {
    this.$arrayTokens = function(str) {
        if (!str)
            return [];
        var values = str.split(this.splitRegex)
        var tokens = [];
        var types = this.tokenArray;
        if (types.length != values.length - 2) {
            if (window.console)
                console.error(types.length , values.length - 2, str, this.splitRegex);
            return [{type: "error.invalid", value: str}];
        }
        for (var i = 0; i < types.length; i++) {
            if (values[i + 1]) {
                tokens[tokens.length] = {
                    type: types[i],
                    value: values[i + 1]
                };
            }
        }
        return tokens;
    };
    
    this.removeCapturingGroups = function(src) {
        var r = src.replace(
            /\[(?:\\.|[^\]])*?\]|\\.|\(\?[:=!]|(\()/g,
            function(x, y) {return y ? "(?:" : x;}
        );
        return r;
    };
    
    this.createSplitterRegexp = function(src, flag) {
        src = src.replace(/\(\?=([^()]|\\.)*?\)$/, "");
        return new RegExp(src, flag);
    };

    /**
    * Returns an object containing two properties: `tokens`, which contains all the tokens; and `state`, the current state.
    * @returns {Object}
    **/
    this.getLineTokens = function(line, startState) {
        if (startState && typeof startState != "string") {
            var stack = startState.slice(0);
            startState = stack[0];
        } else
            var stack = [];

        var currentState = startState || "start";
        var state = this.states[currentState];
        var mapping = this.matchMappings[currentState];
        var re = this.regExps[currentState];
        re.lastIndex = 0;

        var match, tokens = [];

        var lastIndex = 0;

        var stateTransitions = [];
        function onStateChange() {
            stateTransitions.push(startState+"@"+lastIndex);
        }
        function initState() {
            onStateChange();
            stateTransitions = [];
            onStateChange();
        }
        
        var token = {
            type: null,
            value: "",
            state: currentState
        };
        initState();
        
        var maxRecur = 10000;
        
        while (match = re.exec(line)) {
            var type = mapping.defaultToken;
            var rule = null;
            var value = match[0];
            var index = re.lastIndex;

            if (index - value.length > lastIndex) {
                var skipped = line.substring(lastIndex, index - value.length);
                if (token.type == type) {
                    token.value += skipped;
                } else {
                    if (token.type)
                        tokens.push(token);
                    token = {type: type, value: skipped};
                }
            }

            for (var i = 0; i < match.length-2; i++) {
                if (match[i + 1] === undefined)
                    continue;
                
                if (!maxRecur--) {
                    throw "infinite" + state[mapping[i]] + currentState
                }

                rule = state[mapping[i]];

                // compute token type
                type = typeof rule.token == "function"
                    ? rule.token(value, currentState, stack)
                    : rule.token;

                if (rule.next) {
                    if (typeof rule.next == "string")
                        currentState = rule.next;
                    else
                        currentState = rule.next(currentState, stack);

                    state = this.states[currentState];
                    if (!state) {
                        window.console && console.error && console.error(currentState, "doesn't exist");
                        currentState = "start";
                        state = this.states[currentState];
                    }
                    mapping = this.matchMappings[currentState];
                    lastIndex = index;
                    re = this.regExps[currentState];
                    re.lastIndex = index;

                    onStateChange();
                }
                break;
            }

            if (value) {
                if (typeof type == "string") {
                    if ((!rule || rule.merge !== false) && token.type === type) {
                        token.value += value;
                    } else {
                        if (token.type)
                            tokens.push(token);
                        token = {type: type, value: value};
                    }
                } else {
                    if (token.type)
                        tokens.push(token);
                    token = {type: null, value: ""};
                    for (var i = 0; i < type.length; i++)
                        tokens.push(type[i]);
                }
            }

            if (lastIndex == line.length)
                break;

            lastIndex = index;

            if (tokens.length > MAX_TOKEN_COUNT) {
                token.value += line.substr(lastIndex);
                currentState = "start"
                break;
            }
        }

        if (token.type)
            tokens.push(token);

        return {
            tokens : tokens,
            state : stack.length ? stack : currentState
        };
    };

}).call(Tokenizer.prototype);

exports.Tokenizer = Tokenizer;
});
