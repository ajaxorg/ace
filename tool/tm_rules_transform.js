"use strict";

var tk = require("./regexp_tokenizer");
var tokenize = tk.tokenize;
var toStr = tk.toStr;
var tmRuleId = 0;
var warnEnabled = true;

function warn() {
    if (!warnEnabled)
        return;
    console.warn.apply(console, arguments);
}

function log() {
    if (!warnEnabled)
        return;
    console.log.apply(console, arguments);
}

function last(array) {return array[array.length - 1];}

function convertHexEscape(tokens) {
    var inChClass = false;
    tokens.forEach(function(t) {
        if (t.type == "charclass")
            inChClass = true;
        else if (t.type == "charclass.end")
            inChClass = false;
        else if (t.type == "charType") {
            if (t.value == "\\h") {
                t.type = "text";
                t.value = inChClass ? "\\da-fA-F" : "[\\da-fA-F]";
            } else if (t.value == "\\H") {
                if (inChClass) {
                    warn("can't convert \\H in charclass");
                    return;
                }
                t.type = "text";
                t.value = "[^\\da-fA-F]";
            }
        }
    });
    return tokens;
}

function convertNewLinesTo$(str, info) {
    var tokens = tokenize(str);
    for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        if (t.type == "char" && t.value == "\\n") {
            var p = tokens[i + 1] || {};
            if (p.type != "quantifier") {
                t.value = "$";
                if (info)
                    info.converted = true;
                while (p.value == "\\n" || p.type == "quantifier") {
                    p.value = "";
                    p = tokens[++i + 1] || {};
                }
            } else if (/\?|\*|{,|{0,/.test(p.value)) {
                t.value = p.value = "";
            } else {
                if (info)
                    info.converted = true;
                p.value = "";
            }
        }
    }
    return toStr(tokens).replace(/[$]+/g, "$");
}

function convertCharacterTypes(str) {
    var tokens = tokenize(str);
    tokens = convertHexEscape(tokens);

    var warn = false;
    tokens.forEach(function(t) {
        if (t.type == "quantifier") {
            var val = t.value;
            if (val.slice(-1) == "+" && val.length > 1) {
                t.value = val.slice(0, -1);
                warn = val;
            }
        }
    });
    if (warn)
        log("converted possesive quantifier " + warn + " to *");
    return toStr(tokens);
}

function removeInlineFlags(str, rule) {
    var tokens = tokenize(str);
    var caseInsensitive = false;
    tokens.forEach(function(t, i) {
        if (t.type == "group.start" && /^\(\?[imsx-]+:?$/.test(t.value)) {
            if (/i/.test(t.value))
                caseInsensitive = true;
            t.value = t.value.replace(/[imsx\-]/g, "");
            var next = tokens[i + 1];
            if (next && next.type == "group.end") {
                t.value = next.value = "";
            }
        }
    });
    if (caseInsensitive && rule)
        rule.caseInsensitive = true;
    return toStr(tokens);
}

function convertToNonCapturingGroups(str) {
    var tokens = tokenize(str);
    tokens.forEach(function(t) {
        if (t.type == "group.start" && t.value == "(")
            t.value += "?:";
    });
    return toStr(tokens);
}

function transformAtomicGroups(str, rule) {
    var tokens = tokenize(str);
    var atomicId = 0;
    var hasBackRef = tokens.some(function(t) {
        return t.type == "backRef";
    });
    var hasCaptureMetadata = !!(rule && (rule.captures || rule.beginCaptures || rule.endCaptures || rule.whileCaptures));
    var hasUserCaptures = tokens.some(function(t) {
        return t.type == "group.start" && t.isGroup && t.value != "(?:" && t.value != "(?>";
    });

    tokens.forEach(function(t) {
        if (t.type != "group.start" || t.value != "(?>" || !t.end)
            return;

        var canUseExactTransform = !hasBackRef && !hasCaptureMetadata && !hasUserCaptures;
        if (canUseExactTransform) {
            atomicId++;
            t.value = "(?=(";
            t.end.value = "))\\1";
            return;
        }

        t.value = "(?:";
    });

    return toStr(tokens);
}

function getRuleNamePrefix(rule) {
    if (!rule)
        return "ace_tm_" + (tmRuleId++);
    if (!rule.$tmRuleId)
        rule.$tmRuleId = "ace_tm_" + (tmRuleId++);
    return rule.$tmRuleId;
}

function transformNamedGroups(str, rule) {
    var prefix = getRuleNamePrefix(rule);
    var tokens = tokenize(str);
    var names = Object.create(null);
    function normalizeGroupName(name) {
        return name && name.replace(/^['<]+/, "");
    }

    tokens.forEach(function(t) {
        if (t.type == "group.start" && t.name) {
            var originalName = normalizeGroupName(t.name);
            var uniqueName = prefix + "_" + originalName;
            names[originalName] = uniqueName;
            if (t.groupType == "<")
                t.value = "(?<" + uniqueName + ">";
            else if (t.groupType == "'")
                t.value = "(?'" + uniqueName + "'";
        }
    });

    tokens.forEach(function(t) {
        if (t.type != "backRef")
            return;
        t.value = t.value.replace(/\\([gk])(<([^>]+)>|'([^']+)')/g, function(match, kind, wrapper, angleName, quoteName) {
            var name = normalizeGroupName(angleName || quoteName);
            var uniqueName = names[name];
            if (!uniqueName)
                return match;
            if (wrapper.charAt(0) == "<")
                return "\\k<" + uniqueName + ">";
            return "\\k'" + uniqueName + "'";
        });
    });

    str = toStr(tokens);
    return str
        .replace(/\\([gk])<(\w+)>/g, function(match, kind, name) {
            name = normalizeGroupName(name);
            return names[name] ? "\\k<" + names[name] + ">" : match;
        })
        .replace(/\\([gk])'(\w+)'/g, function(match, kind, name) {
            name = normalizeGroupName(name);
            return names[name] ? "\\k'" + names[name] + "'" : match;
        });
}

function simplifyNonCapturingGroups(str) {
    var tokens = tokenize(str);
    var t = tokens[0] || {};
    if (t.type == "group.start" && t.value == "(?:"
        && t.end == last(tokens)) {
        t.value = t.end.value = "";
    }
    var i = 0;
    function iter(f) {
        for (i = 0; i < tokens.length; i++)
            f(tokens[i]);
    }
    function iterGroup(end, f) {
        for (var i1 = i + 1; i1 < tokens.length; i1++) {
            var t = tokens[i1];
            if (t == end)
                break;
            var index = f && f(t);
            if (index > i1)
                i1 = index;
        }
        return i1;
    }

    iter(function(t) {
        if (t.type == "group.start" && t.value == "(?:") {
            if (!t.end)
                return console.error("malformed regex: " + str);

            var canRemove = true;
            var next = tokens[tokens.indexOf(t.end, i) + 1];
            if (next && next.type == "quantifier")
                return;
            iterGroup(t.end, function(t) {
                if (t.type == "alternation")
                    canRemove = false;
                else if (t.type == "group.start" && t.end)
                    return iterGroup(t.end);
            });
            if (canRemove)
                t.value = t.end.value = "";
        }
    });

    return toStr(tokens);
}

function convertBeginEndBackrefs(rule) {
    if (!rule.end || !/\\\d/.test(rule.end))
        return;
    var startTokens = tokenize(rule.begin);
    var endTokens = tokenize(rule.end);
    var groups = {};

    startTokens.forEach(function(t, i) {
        if (t.number && t.end && t.type == "group.start") {
            var endIndex = startTokens.indexOf(t.end, i + 1);
            var content = startTokens.slice(i + 1, endIndex);
            groups[t.number] = toStr(content);
        }
    });

    endTokens.forEach(function(t) {
        if (t.type == "backRef") {
            var num = t.value.substr(1);
            if (groups[num])
                t.value = "(?:" + groups[num] + ")";
        }
    });

    rule.end = toStr(endTokens);
}

function checkForNamedCaptures(str) {
    var tokens = tokenize(str);
    tokens.forEach(function(t) {
        if (t.type == "group.start" && t.name
            && !/^ace_tm_\d+_/.test(t.name.replace(/^['<]+/, "")))
            warn("unresolved named capture", str);
        if (t.type == "backRef" && /^\\[gk](?:<|')/.test(t.value)
            && !/^\\k(?:<ace_tm_\d+_[^>]+>|'ace_tm_\d+_[^']+')$/.test(t.value))
            warn("unresolved named backRef", str);
    });
}

function getCaptureName(captures, index) {
    if (!captures)
        return "";
    var capture = captures[index];
    if (capture == null)
        capture = captures[String(index)];
    if (typeof capture == "string")
        return capture;
    return capture && capture.name || "";
}

function getCaptureMeta(captures, index) {
    if (!captures)
        return "";
    var capture = captures[index];
    if (capture == null)
        capture = captures[String(index)];
    if (!capture || typeof capture == "string")
        return capture || "";
    if (capture.patterns)
        return {
            name: capture.name || "",
            patterns: capture.patterns
        };
    return capture.name || "";
}

function hasRetokenizePatterns(captures) {
    return Object.keys(captures || {}).some(function(key) {
        var capture = captures[key];
        return capture && capture.patterns && capture.patterns.length;
    });
}

function appendScope(scopes, scopeName) {
    scopes = scopes ? scopes.slice() : [];
    if (scopeName && scopes[scopes.length - 1] !== scopeName)
        scopes.push(scopeName);
    return scopes;
}
function appendScopes(scopes, extra) {
    scopes = scopes ? scopes.slice() : [];
    if (!Array.isArray(extra))
        extra = extra ? [extra] : [];
    extra.forEach(function(scopeName) {
        if (scopeName && scopes[scopes.length - 1] !== scopeName)
            scopes.push(scopeName);
    });
    return scopes;
}

function hasScopeBackrefs(scope) {
    if (Array.isArray(scope))
        return scope.some(hasScopeBackrefs);
    return typeof scope == "string" && /\$\d+/.test(scope);
}

function hasCaptureScopeBackrefs(captures) {
    return Object.keys(captures || {}).some(function(key) {
        var capture = captures[key];
        return hasScopeBackrefs(typeof capture == "string" ? capture : capture && capture.name);
    });
}

function createCaptureTokenData(regex, captures, fallbackType, baseScopes) {
    if (!captures)
        return null;

    var wholeCaptureName = getCaptureName(captures, 0);
    var defaultScopes = appendScope(baseScopes, wholeCaptureName);
    var defaultName = wholeCaptureName || defaultScopes[defaultScopes.length - 1] || fallbackType || "text";
    var tokenArray = [];

    Object.keys(captures).forEach(function(key) {
        if (key === "0")
            return;
        tokenArray[key] = getCaptureMeta(captures, key);
    });

    if (tokenArray.length > 1) {
        var fixed = fixGroups(tokenArray, defaultName, regex);
        return {
            regex: fixed.regex,
            token: fixed.names.map(function(name) {
                var chain = Array.isArray(name) ? name.slice() : (name ? [name] : []);
                var leaf = chain.length ? chain[chain.length - 1] : "";
                var leafName = leaf && typeof leaf == "object" ? leaf.name : leaf;
                var scopeNames = chain.map(function(item) {
                    return item && typeof item == "object" ? item.name : item;
                }).filter(Boolean);
                return {
                    type: leafName || defaultName,
                    ruleScope: !scopeNames.length
                        ? defaultScopes.slice()
                        : appendScopes(defaultScopes, scopeNames),
                    retokenizePatterns: leaf && typeof leaf == "object" ? leaf.patterns : null
                };
            })
        };
    }

    return {
        regex: regex,
        token: wholeCaptureName || fallbackType || defaultName || "text",
        ruleScope: defaultScopes
    };
}

function fixGroups(captures, defaultName, regex) {
    var tokens = tokenize(regex);

    var opened = [], isStart = true, i = 0;
    function open() {
        var t = {value: "(", type: "group.start", isGroup: true};
        opened.push(t);
        tokens.splice(i++, 0, t);
    }
    function close() {
        var t = {value: ")", type: "group.start"};
        t.start = opened.pop();
        t.start.end = t;
        tokens.splice(i++, 0, t);
    }
    function tryOpen() {if (isStart) {open(); isStart = false;}}
    function tryClose() {if (opened.length) close();}
    function skip(t) {
        var i1 = tokens.indexOf(t.end, i);
        if (i1 > i)
            i = i1;
    }
    function lst(t) {return t[t.length - 1];}
    function iter(f) {
        for (i = 0; i < tokens.length; i++)
            f(tokens[i]);
    }
    function iterGroup(end, f) {
        for (var i1 = i + 1; i1 < tokens.length; i1++) {
            var t = tokens[i1];
            if (t == end)
                break;
            f(t);
        }
    }
    function peek() { return tokens[i + 1] || {}; }

    iter(function(t) {
        if (t.type == "group.start") {
            tryClose();
            isStart = true;
            if (!t.hasChildren || t.isSpecial)
                skip(t);
        } else if (t.type == "group.end") {
            isStart = true;
            tryClose();
        } else if (t.type == "alternation") {
            isStart = true;
            tryClose();
        } else if (t.type != "anchor" && t.type != "quantifier") {
            tryOpen();
        }
    });
    tryClose();

    var names = [];
    iter(function(t) {
        if (t.type == "group.start" && t.value == "(?:" && names.length
            && (tokens[tokens.indexOf(t.end, i) + 1] || {}).type == "quantifier") {
            var hasNestedCapture = false;
            iterGroup(t.end, function(t1) {
                if (t1.type == "group.start" && captures[t1.number])
                    hasNestedCapture = true;
            });
            if (!hasNestedCapture) {
                t.value = "(";
                t.tokenName = names.slice();
                iterGroup(t.end, function(t1) {
                    if (t1.value == "(")
                        t1.value = "(?:";
                });
                skip(t);
            }
        } else if (t.type == "group.start" && !t.isSpecial) {
            var captureName = captures[t.number];

            if (!t.hasChildren) {
                t.tokenName = captureName
                    ? names.concat([captureName])
                    : t.name ? null : names.length ? names.slice() : defaultName;
                skip(t);
            } else {
                var hasCapture = false;
                iterGroup(t.end, function(t1) {
                    if (t1.type == "group.start" && captures[t1.number])
                        hasCapture = true;
                });
                if (hasCapture) {
                    t.value = "(?:";
                    if (captureName) {
                        names.push(captureName);
                        t.isTokenGroup = true;
                    }
                } else {
                    t.tokenName = captureName
                        ? names.concat([captureName])
                        : t.name ? null : names.length ? names.slice() : defaultName;
                    iterGroup(t.end, function(t1) {
                        if (t1.value == "(")
                            t1.value = "(?:";
                    });
                }
            }
        } else if (t.type == "group.end") {
            if (t.start.isTokenGroup)
                names.pop();
        }
    });

    iter(function(t) {
        if (t.type == "group.end" && t.start.value == "(" && peek().type == "quantifier") {
            peek().value += ")";
            t.start.value += "(?:";
        }
    });

    names = [];
    tokens.forEach(function(t) {
        if (t.value == "(" || t.value == "((?:")
            t.tokenName && names.push(t.tokenName);
        else if (t.type == "group.start" && t.name && t.isGroup && /^\(\?['<]/.test(t.value))
            names.push(t.tokenName || null);
    });
    return {
        names: names,
        regex: toStr(tokens)
    };
}

function transformRegExp(str, rule, fieldName) {
    var newlineInfo = {converted: false};
    str = convertNewLinesTo$(str, newlineInfo);
    if (rule && fieldName && newlineInfo.converted)
        rule["$" + fieldName + "ConsumesLineEnd"] = true;
    str = removeInlineFlags(str, rule);
    str = str.replace(/(\\[xu]){([a-fA-F\d]+)}/g, "$1$2");
    str = convertCharacterTypes(str);
    str = transformAtomicGroups(str, rule);
    str = transformNamedGroups(str, rule);
    checkForNamedCaptures(str);
    return str;
}

function transformTmPattern(pattern, options) {
    if (!pattern || typeof pattern != "object")
        return pattern;
    if (pattern.begin != null && pattern.end != null && !(options && options.preserveBeginEndBackrefs))
        convertBeginEndBackrefs(pattern);
    if (pattern.match) {
        var defaultName = pattern.name || "text";
        var dynamicScope = typeof pattern.name == "string" && /\$\d+/.test(pattern.name);
        var regex = transformRegExp(pattern.match, pattern, "match");
        if (pattern.captures) {
            pattern.$tmCaptureRules = pattern.captures;
            pattern.match = regex;
        }
        if (!pattern.$tmCaptureRules && !dynamicScope) {
            if (typeof pattern.token == "string" || !pattern.token)
                regex = convertToNonCapturingGroups(regex);
            pattern.match = simplifyNonCapturingGroups(regex);
        } else if (!pattern.$tmCaptureRules) {
            pattern.match = regex;
        }
        if (!pattern.token && defaultName)
            pattern.token = defaultName;
        if (!pattern.ruleScope && pattern.name)
            pattern.ruleScope = [pattern.name];
    }
    ["captures", "beginCaptures", "endCaptures", "whileCaptures"].forEach(function(capturesKey) {
        Object.keys(pattern[capturesKey] || {}).forEach(function(key) {
            var capture = pattern[capturesKey][key];
            (capture && capture.patterns || []).forEach(function(child) {
                transformTmPattern(child, options);
            });
        });
    });
    var outerScope = pattern.name || pattern.token;
    var baseScopes = outerScope ? [outerScope] : [];
    if (pattern.begin) {
        pattern.begin = transformRegExp(pattern.begin, pattern, "begin");
        if (hasScopeBackrefs(pattern.name) || hasScopeBackrefs(pattern.contentName)
            || hasCaptureScopeBackrefs(pattern.beginCaptures || pattern.captures))
            pattern.$beginScopeRegex = pattern.begin;
        var beginTokenData = createCaptureTokenData(
            pattern.begin,
            pattern.beginCaptures || pattern.captures,
            pattern.token || outerScope || "text",
            baseScopes
        );
        if (beginTokenData) {
            pattern.begin = beginTokenData.regex;
            pattern.$beginToken = beginTokenData.token;
            pattern.$beginRuleScope = beginTokenData.ruleScope;
        }
    }
    if (pattern.end) {
        pattern.end = transformRegExp(pattern.end, pattern, "end");
        var endTokenData = createCaptureTokenData(
            pattern.end,
            pattern.endCaptures || pattern.captures,
            pattern.token || outerScope || "text",
            baseScopes
        );
        if (endTokenData) {
            pattern.end = endTokenData.regex;
            pattern.$endToken = endTokenData.token;
            pattern.$endRuleScope = endTokenData.ruleScope;
        }
    }
    if (pattern["while"]) {
        pattern["while"] = transformRegExp(pattern["while"], pattern, "while");
        var whileTokenData = createCaptureTokenData(
            pattern["while"],
            pattern.whileCaptures || pattern.beginCaptures || pattern.captures,
            pattern.token || outerScope || "text",
            baseScopes
        );
        if (whileTokenData) {
            pattern["while"] = whileTokenData.regex;
            pattern.$whileToken = whileTokenData.token;
            pattern.$whileRuleScope = whileTokenData.ruleScope;
        }
    }
    (pattern.patterns || []).forEach(function(child) {
        transformTmPattern(child, options);
    });
    Object.keys(pattern.injections || {}).forEach(function(selector) {
        var injection = pattern.injections[selector];
        (injection.patterns || []).forEach(function(child) {
            transformTmPattern(child, options);
        });
        Object.keys(injection.repository || {}).forEach(function(key) {
            transformTmPattern(injection.repository[key], options);
        });
    });
    Object.keys(pattern.repository || {}).forEach(function(key) {
        transformTmPattern(pattern.repository[key], options);
    });
    return pattern;
}

function transformTmGrammar(grammar) {
    tmRuleId = 0;
    transformTmPattern(grammar, {preserveBeginEndBackrefs: true});
    return grammar;
}

function setWarningsEnabled(enabled) {
    warnEnabled = !!enabled;
}

exports.transformRegExp = transformRegExp;
exports.convertBeginEndBackrefs = convertBeginEndBackrefs;
exports.convertToNonCapturingGroups = convertToNonCapturingGroups;
exports.simplifyNonCapturingGroups = simplifyNonCapturingGroups;
exports.fixGroups = fixGroups;
exports.transformTmPattern = transformTmPattern;
exports.transformTmGrammar = transformTmGrammar;
exports.setWarningsEnabled = setWarningsEnabled;
