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
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var _1CHighlightRules = function() {
        console.log('1c-rules started')

        var keywords = (
            "процедура|функция|конецпроцедуры|конецфункции|для|пока|цикл|конеццикла|если|тогда|иначеесли|конецесли|попытка|исключение|конецпопытки|каждого|" +
            "перем|знач|и|или|не|новый"
        );
        var builtinConstants = (
            "истина|ложь|неопределено|true|false"
        );
        var builtinFunctions = (
            "лев|сред|прав|цел|окр|минимум|максимум|число|строка|дата|формат|сокрлп|сокрл|символ|кодсимвола|" +
            "врег|нрег|трег|найти|стрнайти|стрчисловхождений|пустаястрока|стрзаменить|стрчислострок|стрполучитьстроку|" +
            "стрразделить|стрсоединить|год|месяц|день|час|минута|секунда|началогода|началоквартала|началомесяца|началонедели|" +
            "началодня|началочаса|началоминуты|конецгода|конецквартала|конецмесяца|конецнедели|конецдня|конецчаса|конецминуты|" +
            "тип|типзнч|показатьвопрос|вопрос|предупреждение|сообщить"
        );
        var dataTypes = (
            "int|numeric|decimal|date|varchar|char|bigint|float|double|bit|binary|text|set|timestamp|" +
            "money|real|number|integer"
        );
        var keywordMapper = this.createKeywordMapper({
            "support.function": builtinFunctions,
            "keyword": keywords,
            "constant.language": builtinConstants,
        }, "identifier", true);

        this.$rules = {
            "start" : [ {
                token : "comment",
                regex : "\/\/.*"
            },
            {
                token : "region",
                regex : "\#(\u0020|\t)*(region|область)(\u0020|\t)*.*",
                next: "region.end",
                caseInsensitive: true
            },
            {
                token : "region.end",
                regex : "\#(\u0020|\t)*(endregion|конецобласти)(\u0020|\t)*.*",
                caseInsensitive: true
            },
            // {
            //     token : "meta",
            //     start : "\$|\#.*$"
            // }, 
            {
                token : "label",
                regex : "~(\u0020|\t)*[_A-Za-zА-ЯЁа-яё][_A-Za-z0-9А-ЯЁа-яё]*(\u0020|\t)*:"
            },
            {
                token : "string",           // ' string
                regex : "\".*\""
            },
            // {
            //     token : "string.multiline", // ' string
            //     regex : "\"((^\")*(\n(\u0020|\t)*\|^[\||\"]*)*\""
            // },
            {
                token : "identifier", // ' identifier
                regex : "[_A-Za-zА-ЯЁа-яё][_A-Za-z0-9А-ЯЁа-яё]*"
            },
            {
                token : "doubleoperator", // ' identifier
                regex : "<=|<>|>="
            },
            {
                token : "singleoperator", // ' identifier
                regex : "[\\+\\-\\*/%&<>=]"
            },

            // {
            //     token : "string",           // ` string multiline
            //     regex : "\"([^\"].\n\s.\|).\""
            // },
            // {
            //     token : "constant.numeric", // float
            //     regex : "[0-9]"
            // },
            // {
            //     token : keywordMapper,
            //     regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
            // }, 
            // {
            //     token : "keyword.operator",
            //     regex : "\+"
            // },
            {
                token : "paren.lparen",
                regex : "[\\(]"
            }, 
            {
                token : "paren.rparen",
                regex : "[\\)]"
            }, 
            // {
            //     token : "text",
            //     regex : "\\s+"
            // } 
        ],
        };
        this.normalizeRules();
    };

    oop.inherits(_1CHighlightRules, TextHighlightRules);

    exports._1CHighlightRules = _1CHighlightRules;
    });
