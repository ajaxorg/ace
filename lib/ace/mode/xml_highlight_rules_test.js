/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

var XmlMode = require("./xml").Mode;
var assert = require("../test/assertions");

var testData = {
    "test: tokenize1" : [{
        text: "<Juhu>//Juhu Kinners</Kinners>",
        state: ["start", "start"],
        tokens: [
            {
                type: "meta.tag",
                value: "<"
            },
            {
                type: "meta.tag.tag-name",
                value: "Juhu"
            },
            {
                type: "meta.tag",
                value: ">"
            },
            {
                type: "text",
                value: "//Juhu Kinners"
            },
            {
                type: "meta.tag",
                value: "</"
            },
            {
                type: "meta.tag.tag-name",
                value: "Kinners"
            },
            {
                type: "meta.tag",
                value: ">"
            }
        ]
    }],

    "test: two tags in the same lines should be in separate tokens": [{
        text: "<Juhu><Kinners>",
        state: [ "start", "start"],
        tokens: [
            {
                type: "meta.tag",
                value: "<"
            },
            {
                type: "meta.tag.tag-name",
                value: "Juhu"
            },
            {
                type: "meta.tag",
                value: ">"
            },
            {
                type: "meta.tag",
                value: "<"
            },
            {
                type: "meta.tag.tag-name",
                value: "Kinners"
            },
            {
                type: "meta.tag",
                value: ">"
            }
        ]
    }],

    "test: multiline attributes": [{
        text: "<copy set=\"{",
        state: ["start", "tag_qqstring"],
        tokens: [
            {
                type: "meta.tag",
                value: "<"
            },
            {
                type: "meta.tag.tag-name",
                value: "copy"
            },
            {
                type: "text",
                value: " "
            },
            {
                type: "entity.other.attribute-name",
                value: "set"
            },
            {
                type: "keyword.operator",
                value: "="
            },
            {
                type: "string",
                value: "\"{"
            }
        ]
    }, {
        text: "}\" undo=\"{",
        state: [ "tag_qqstring", "tag_qqstring"],
        tokens: [
            {
                type: "string",
                value: "}\""
            },
            {
                type: "text",
                value: " "
            },
            {
                type: "entity.other.attribute-name",
                value: "undo"
            },
            {
                type: "keyword.operator",
                value: "="
            },
            {
                type: "string",
                value: "\"{"
            }
        ]
    }, {
        text: "}\"/>",
        state: ["tag_qqstring", "start"],
        tokens: [
            {
                type: "string",
                value: "}\""
            },
            {
                type: "meta.tag",
                value: "/>"
            }
        ]
    }]
};

function generateTest(exampleData) {
    return function testTokenizer() {
        for (var i = 0; i < exampleData.length; i++) {
            var s = exampleData[i];
            var lineTokens = tokenizer.getLineTokens(s.text, s.state[0]);

            assert.equal(
                JSON.stringify(lineTokens, null, 4),
                JSON.stringify({tokens:s.tokens, state: s.state[1]}, null, 4)
            );
        }
    }
}

var tokenizer;
module.exports = {
    name: "XML Tokenizer",

    setUp : function() {
        tokenizer = new XmlMode().getTokenizer();
    }
}

for (var i in testData) {
    module.exports[i] = generateTest(testData[i])
}
});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
