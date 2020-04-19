define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var MediaWikiHighlightRules = function() {
    this.$rules = {
        start: [{
            include: "#switch"
        }, {
            include: "#redirect"
        }, {
            include: "#variable"
        }, {
            include: "#comment"
        }, {
            include: "#entity"
        }, {
            include: "#emphasis"
        }, {
            include: "#tag"
        }, {
            include: "#table"
        }, {
            include: "#hr"
        }, {
            include: "#heading"
        }, {
            include: "#link"
        }, {
            include: "#list"
        }, {
            include: "#template"
        }],
        "#hr": [{
            token: "markup.bold",
            regex: /^[-]{4,}/
        }],
        "#switch": [{
            token: "constant.language",
            regex: /(__NOTOC__|__FORCETOC__|__TOC__|__NOEDITSECTION__|__NEWSECTIONLINK__|__NONEWSECTIONLINK__|__NOWYSIWYG__|__NOGALLERY__|__HIDDENCAT__|__EXPECTUNUSEDCATEGORY__|__NOCONTENTCONVERT__|__NOCC__|__NOTITLECONVERT__|__NOTC__|__START__|__END__|__INDEX__|__NOINDEX__|__STATICREDIRECT__|__NOGLOBAL__|__DISAMBIG__)/
        }],
        "#redirect": [{
            token: [
                "keyword.control.redirect",
                "meta.keyword.control"
            ],
            regex: /(^#REDIRECT|^#redirect|^#Redirect)(\s+)/
        }],
        "#variable": [{
            token: "storage.type.variable",
            regex: /{{{/,
            push: [{
                token: "storage.type.variable",
                regex: /}}}/,
                next: "pop"
            }, {
                token: [
                    "text",
                    "variable.other",
                    "text",
                    "keyword.operator"
                ],
                regex: /(\s*)(\w+)(\s*)((?:\|)?)/
            }, {
                defaultToken: "storage.type.variable"
            }]
        }],
        "#entity": [{
            token: "constant.character.entity",
            regex: /&\w+;/
        }],
        "#list": [{
            token: "markup.bold",
            regex: /^[#*;:]+/,
            push: [{
                token: "markup.list",
                regex: /$/,
                next: "pop"
            }, {
                include: "$self"
            }, {
                defaultToken: "markup.list"
            }]
        }],
        "#template": [{
            token: [
                "storage.type.function",
                "meta.template",
                "entity.name.function",
                "meta.template"
            ],
            regex: /({{)(\s*)([#\w: ]+)(\s*)/,
            push: [{
                token: "storage.type.function",
                regex: /}}/,
                next: "pop"
            }, {
                token: [
                    "storage",
                    "meta.structure.dictionary",
                    "support.type.property-name",
                    "meta.structure.dictionary",
                    "punctuation.separator.dictionary.key-value",
                    "meta.structure.dictionary",
                    "meta.structure.dictionary.value"
                ],
                regex: /(\|)(\s*)([a-zA-Z-]*)(\s*)(=)(\s*)([^|}]*)/,
                push: [{
                    token: "meta.structure.dictionary",
                    regex: /(?=}}|[|])/,
                    next: "pop"
                }, {
                    defaultToken: "meta.structure.dictionary"
                }]
            }, {
                token: ["storage", "meta.template.value"],
                regex: /(\|)(.*?)/,
                push: [{
                    token: [],
                    regex: /(?=}}|[|])/,
                    next: "pop"
                }, {
                    include: "$self"
                }, {
                    defaultToken: "meta.template.value"
                }]
            }, {
                defaultToken: "meta.template"
            }]
        }],
        "#link": [{
            token: [
                "punctuation.definition.tag.begin",
                "meta.tag.link.internal",
                "entity.name.tag",
                "meta.tag.link.internal",
                "string.other.link.title",
                "meta.tag.link.internal",
                "punctuation.definition.tag"
            ],
            regex: /(\[\[)(\s*)((?:Category|Wikipedia)?)(:?)([^\]\]\|]+)(\s*)((?:\|)*)/,
            push: [{
                token: "punctuation.definition.tag.end",
                regex: /\]\]/,
                next: "pop"
            }, {
                include: "$self"
            }, {
                defaultToken: "meta.tag.link.internal"
            }]
        }, {
            token: [
                "punctuation.definition.tag.begin",
                "meta.tag.link.external",
                "meta.tag.link.external",
                "string.unquoted",
                "punctuation.definition.tag.end"
            ],
            regex: /(\[)(.*?)([\s]+)(.*?)(\])/
        }],
        "#comment": [{
            token: "punctuation.definition.comment.html",
            regex: /<!--/,
            push: [{
                token: "punctuation.definition.comment.html",
                regex: /-->/,
                next: "pop"
            }, {
                defaultToken: "comment.block.html"
            }]
        }],
        "#emphasis": [{
            token: [
                "punctuation.definition.tag.begin",
                "markup.italic.bold",
                "punctuation.definition.tag.end"
            ],
            regex: /(''''')(?!')(.*?)('''''|$)/
        }, {
            token: [
                "punctuation.definition.tag.begin",
                "markup.bold",
                "punctuation.definition.tag.end"
            ],
            regex: /(''')(?!')(.*?)('''|$)/
        }, {
            token: [
                "punctuation.definition.tag.begin",
                "markup.italic",
                "punctuation.definition.tag.end"
            ],
            regex: /('')(?!')(.*?)(''|$)/
        }],
        "#heading": [{
            token: [
                "punctuation.definition.heading",
                "entity.name.section",
                "punctuation.definition.heading"
            ],
            regex: /(={1,6})(.+?)(\1)(?!=)/
        }],
        "#tag": [{
            token: [
                "punctuation.definition.tag.begin",
                "entity.name.tag",
                "meta.tag.block.ref",
                "punctuation.definition.tag.end"
            ],
            regex: /(<)(ref)((?:\s+.*?)?)(>)/,
            caseInsensitive: true,
            push: [{
                token: [
                    "punctuation.definition.tag.begin",
                    "entity.name.tag",
                    "meta.tag.block.ref",
                    "punctuation.definition.tag.end"
                ],
                regex: /(<\/)(ref)(\s*)(>)/,
                caseInsensitive: true,
                next: "pop"
            }, {
                include: "$self"
            }, {
                defaultToken: "meta.tag.block.ref"
            }]
        },
        {
            token: [
                "punctuation.definition.tag.begin",
                "entity.name.tag",
                "meta.tag.block.nowiki",
                "punctuation.definition.tag.end"
            ],
            regex: /(<)(nowiki)((?:\s+.*?)?)(>)/,
            caseInsensitive: true,
            push: [{
                token: [
                    "punctuation.definition.tag.begin",
                    "entity.name.tag",
                    "meta.tag.block.nowiki",
                    "punctuation.definition.tag.end"
                ],
                regex: /(<\/)(nowiki)(\s*)(>)/,
                caseInsensitive: true,
                next: "pop"
            }, {
                defaultToken: "meta.tag.block.nowiki"
            }]
        }, {
            token: [
                "punctuation.definition.tag.begin",
                "entity.name.tag"
            ],
            regex: /(<\/?)(noinclude|includeonly|onlyinclude)(?=\W)/,
            caseInsensitive: true,
            push: [{
                token: [
                    "invalid.illegal",
                    "punctuation.definition.tag.end"
                ],
                regex: /((?:\/)?)(>)/,
                next: "pop"
            }, {
                include: "#attribute"
            }, {
                defaultToken: "meta.tag.block.any"
            }]
        }, {
            token: [
                "punctuation.definition.tag.begin",
                "entity.name.tag"
            ],
            regex: /(<)(br|wbr|hr|meta|link)(?=\W)/,
            caseInsensitive: true,
            push: [{
                token: "punctuation.definition.tag.end",
                regex: /\/?>/,
                next: "pop"
            }, {
                include: "#attribute"
            }, {
                defaultToken: "meta.tag.other"
            }]
        }, {
            token: [
                "punctuation.definition.tag.begin",
                "entity.name.tag"
            ],
            regex: /(<\/?)(div|center|span|h1|h2|h3|h4|h5|h6|bdo|em|strong|cite|dfn|code|samp|kbd|var|abbr|blockquote|q|sub|sup|p|pre|ins|del|ul|ol|li|dl|dd|dt|table|caption|thead|tfoot|tbody|colgroup|col|tr|td|th|a|img|video|source|track|tt|b|i|big|small|strike|s|u|font|ruby|rb|rp|rt|rtc|math|figure|figcaption|bdi|data|time|mark|html)(?=\W)/,
            caseInsensitive: true,
            push: [{
                token: [
                    "invalid.illegal",
                    "punctuation.definition.tag.end"
                ],
                regex: /((?:\/)?)(>)/,
                next: "pop"
            }, {
                include: "#attribute"
            }, {
                defaultToken: "meta.tag.block"
            }]
        }, {
            token: [
                "punctuation.definition.tag.begin",
                "invalid.illegal"
            ],
            regex: /(<\/)(br|wbr|hr|meta|link)(?=\W)/,
            caseInsensitive: true,
            push: [{
                token: "punctuation.definition.tag.end",
                regex: /\/?>/,
                next: "pop"
            }, {
                include: "#attribute"
            }, {
                defaultToken: "meta.tag.other"
            }]
        }],
        "#caption": [{
            token: [
                "meta.tag.block.table-caption",
                "punctuation.definition.tag.begin"
            ],
            regex: /^(\s*)(\|\+)/,
            push: [{
                token: "meta.tag.block.table-caption",
                regex: /$/,
                next: "pop"
            }, {
                defaultToken: "meta.tag.block.table-caption"
            }]
        }],
        "#tr": [{
            token: [
                "meta.tag.block.tr",
                "punctuation.definition.tag.begin",
                "meta.tag.block.tr",
                "invalid.illegal"
            ],
            regex: /^(\s*)(\|\-)([\s]*)(.*)/
        }],
        "#th": [{
            token: [
                "meta.tag.block.th.heading",
                "punctuation.definition.tag.begin",
                "meta.tag.block.th.heading",
                "punctuation.definition.tag",
                "markup.bold"
            ],
            regex: /^(\s*)(!)(?:(.*?)(\|))?(.*?)(?=!!|$)/,
            push: [{
                token: "meta.tag.block.th.heading",
                regex: /$/,
                next: "pop"
            }, {
                token: [
                    "punctuation.definition.tag.begin",
                    "meta.tag.block.th.inline",
                    "punctuation.definition.tag",
                    "markup.bold"
                ],
                regex: /(!!)(?:(.*?)(\|))?(.*?)(?=!!|$)/
            }, {
                include: "$self"
            }, {
                defaultToken: "meta.tag.block.th.heading"
            }]
        }],
        "#td": [{
            token: [
                "meta.tag.block.td",
                "punctuation.definition.tag.begin"
            ],
            regex: /^(\s*)(\|)/,
            push: [{
                token: "meta.tag.block.td",
                regex: /$/,
                next: "pop"
            }, {
                include: "$self"
            }, {
                defaultToken: "meta.tag.block.td"
            }]
        }],
        "#table": [{
            patterns: [{
                name: "meta.tag.block.table",
                begin: "^\\s*({\\|)(.*?)$",
                end: "^\\s*\\|}",
                beginCaptures: {
                    1: {
                        name: "punctuation.definition.tag.begin"
                    },
                    2: {
                        patterns: [{
                            include: "#attribute"
                        }]
                    },
                    3: {
                        name: "invalid.illegal"
                    }
                },
                endCaptures: {
                    0: {
                        name: "punctuation.definition.tag.end"
                    }
                },
                patterns: [{
                    include: "#comment"
                }, {
                    include: "#template"
                }, {
                    include: "#caption"
                }, {
                    include: "#tr"
                }, {
                    include: "#th"
                }, {
                    include: "#td"
                }]
            }],
            repository: {
                caption: {
                    name: "meta.tag.block.table-caption",
                    begin: "^\\s*(\\|\\+)",
                    end: "$",
                    beginCaptures: {
                        1: {
                            name: "punctuation.definition.tag.begin"
                        }
                    }
                },
                tr: {
                    name: "meta.tag.block.tr",
                    match: "^\\s*(\\|\\-)[\\s]*(.*)",
                    captures: {
                        1: {
                            name: "punctuation.definition.tag.begin"
                        },
                        2: {
                            name: "invalid.illegal"
                        }
                    }
                },
                th: {
                    name: "meta.tag.block.th.heading",
                    begin: "^\\s*(!)((.*?)(\\|))?(.*?)(?=(!!)|$)",
                    end: "$",
                    beginCaptures: {
                        1: {
                            name: "punctuation.definition.tag.begin"
                        },
                        3: {
                            patterns: [{
                                include: "#attribute"
                            }]
                        },
                        4: {
                            name: "punctuation.definition.tag"
                        },
                        5: {
                            name: "markup.bold"
                        }
                    },
                    patterns: [{
                        name: "meta.tag.block.th.inline",
                        match: "(!!)((.*?)(\\|))?(.*?)(?=(!!)|$)",
                        captures: {
                            1: {
                                name: "punctuation.definition.tag.begin"
                            },
                            3: {
                                patterns: [{
                                    include: "#attribute"
                                }]
                            },
                            4: {
                                name: "punctuation.definition.tag"
                            },
                            5: {
                                name: "markup.bold"
                            }
                        }
                    }, {
                        include: "$self"
                    }]
                },
                td: {
                    name: "meta.tag.block.td",
                    begin: "^\\s*(\\|)",
                    end: "$",
                    beginCaptures: {
                        1: {
                            name: "punctuation.definition.tag.begin"
                        },
                        2: {
                            patterns: [{
                                include: "#attribute"
                            }]
                        },
                        3: {
                            name: "punctuation.definition.tag"
                        }
                    },
                    patterns: [{
                        include: "$self"
                    }]
                }
            }
        }],
        "#attribute": [{
            include: "#string"
        }, {
            token: "entity.other.attribute-name",
            regex: /\w+/
        }],
        "#string": [{
            token: "string.quoted.double",
            regex: /\"/,
            push: [{
                token: "string.quoted.double",
                regex: /\"/,
                next: "pop"
            }, {
                defaultToken: "string.quoted.double"
            }]
        }, {
            token: "string.quoted.single",
            regex: /\'/,
            push: [{
                token: "string.quoted.single",
                regex: /\'/,
                next: "pop"
            }, {
                defaultToken: "string.quoted.single"
            }]
        }],
        "#url": [{
            token: "markup.underline.link",
            regex: /(?:http(?:s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#\[\]@!\$&'\(\)\*\+,;=.]+/
        }, {
            token: "invalid.illegal",
            regex: /.*/
        }]
    };
    

    this.normalizeRules();
};

MediaWikiHighlightRules.metaData = {
    name: "MediaWiki",
    scopeName: "text.html.mediawiki",
    fileTypes: ["mediawiki", "wiki"]
};


oop.inherits(MediaWikiHighlightRules, TextHighlightRules);

exports.MediaWikiHighlightRules = MediaWikiHighlightRules;
});
