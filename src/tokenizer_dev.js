var BaseTokenizer = require("./tokenizer").Tokenizer;

// tokenizing lines longer than this makes editor very slow
var MAX_TOKEN_COUNT = 2000;
/*
 * version of Tokenizer with additional logging
 * and infinite loop checks
 * can be used for developing/testing new modes
 **/

class Tokenizer extends BaseTokenizer {
    
    /**
     * Returns an object containing two properties: `tokens`, which contains all the tokens; and `state`, the current state.
     * @returns {Object}
     **/
    getLineTokens(line, startState) {
        if (startState && typeof startState != "string") {
            /**@type {any[]}*/
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

        /**@type {any}*/
        var token = {
            type: null,
            value: "",
            state: currentState
        };
        initState();
        
        var maxRecur = 20000;
        
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
                    throw "infinite" + state[mapping[i]] + currentState;
                }

                rule = state[mapping[i]];

                if (rule.onMatch)
                    type = rule.onMatch(value, currentState, stack, line);
                else
                    type = rule.token;

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
                if (rule.consumeLineEnd)
                    lastIndex = index;
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
                currentState = "start";
                break;
            }
        }

        if (token.type)
            tokens.push(token);

        return {
            tokens : tokens,
            state : stack.length ? stack : currentState
        };
    }

}

Tokenizer.prototype = BaseTokenizer.prototype;

exports.Tokenizer = Tokenizer;
