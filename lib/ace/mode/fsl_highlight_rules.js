"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var FSLHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        start: [{
            token: "punctuation.definition.comment.mn",
            regex: /\/\*/,
            push: [{
                token: "punctuation.definition.comment.mn",
                regex: /\*\//,
                next: "pop"
            }, {
                defaultToken: "comment.block.fsl"
            }]
        }, {
            token: "comment.line.fsl",
            regex: /\/\//,
            push: [{
                token: "comment.line.fsl",
                regex: /$/,
                next: "pop"
            }, {
                defaultToken: "comment.line.fsl"
            }]
        }, {
            token: "entity.name.function",
            regex: /\${/,
            push: [{
                token: "entity.name.function",
                regex: /}/,
                next: "pop"
            }, {
                defaultToken: "keyword.other"
            }],
            comment: "js outcalls"
        }, {
            token: "constant.numeric",
            regex: /[0-9]*\.[0-9]*\.[0-9]*/,
            comment: "semver"
        }, {
            token: "constant.language.fslLanguage",
            regex: "(?:"
                + "graph_layout|machine_name|machine_author|machine_license|machine_comment|machine_language"
                + "|machine_version|machine_reference|npm_name|graph_layout|on_init|on_halt|on_end|on_terminate|on_finalize|on_transition"
                + "|on_action|on_stochastic_action|on_legal|on_main|on_forced|on_validation|on_validation_failure|on_transition_refused|on_forced_transition_refused"
                + "|on_action_refused|on_enter|on_exit|start_states|end_states|terminal_states|final_states|fsl_version"
                + ")\\s*:"
        }, {
            token: "keyword.control.transition.fslArrow",
            regex: /<->|<-|->|<=>|=>|<=|<~>|~>|<~|<-=>|<=->|<-~>|<~->|<=~>|<~=>/
        }, {
            token: "constant.numeric.fslProbability",
            regex: /[0-9]+%/,
            comment: "edge probability annotation"
        }, {
            token: "constant.character.fslAction",
            regex: /\'[^']*\'/,
            comment: "action annotation"
        }, {
            token: "string.quoted.double.fslLabel.doublequoted",
            regex: /\"[^"]*\"/,
            comment: "fsl label annotation"
        }, {
            token: "entity.name.tag.fslLabel.atom",
            regex: /[a-zA-Z0-9_.+&()#@!?,]/,
            comment: "fsl label annotation"
        }]
    };

    this.normalizeRules();
};

FSLHighlightRules.metaData = {
    fileTypes: ["fsl", "fsl_state"],
    name: "FSL",
    scopeName: "source.fsl"
};


oop.inherits(FSLHighlightRules, TextHighlightRules);

exports.FSLHighlightRules = FSLHighlightRules;
