/*
    EXPLANATION

    This highlight rules were created to help developer spot typos when working
    with Content-Security-Policy (CSP). See:
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/
 */

    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var CspHighlightRules = function() {
        var keywordMapper = this.createKeywordMapper({
            "constant.language": "child-src|connect-src|default-src|font-src|frame-src|img-src|manifest-src|media-src|object-src"
                  + "|script-src|style-src|worker-src|base-uri|plugin-types|sandbox|disown-opener|form-action|frame-ancestors|report-uri"
                  + "|report-to|upgrade-insecure-requests|block-all-mixed-content|require-sri-for|reflected-xss|referrer|policy-uri",
            "variable": "'none'|'self'|'unsafe-inline'|'unsafe-eval'|'strict-dynamic'|'unsafe-hashed-attributes'"
        }, "identifier", true);

        this.$rules = {
            start: [{
                token: "string.link",
                regex: /https?:[^;\s]*/
            }, {
                token: "operator.punctuation",
                regex: /;/
            }, {
                token: keywordMapper,
                regex: /[^\s;]+/
            }]
        };
    };

    oop.inherits(CspHighlightRules, TextHighlightRules);

    exports.CspHighlightRules = CspHighlightRules;
