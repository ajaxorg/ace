/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2017, Ruslan Batdalov
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

var MixalHighlightRules = function() {
    var isValidSymbol = function(string) {
        return string && string.search(/^[A-Z\u0394\u03a0\u03a30-9]{1,10}$/) > -1 && string.search(/[A-Z\u0394\u03a0\u03a3]/) > -1;
    };

    var isValidOp = function(op) {
        return op && [
            'NOP', 'ADD', 'FADD', 'SUB', 'FSUB', 'MUL', 'FMUL', 'DIV', 'FDIV', 'NUM', 'CHAR', 'HLT',
            'SLA', 'SRA', 'SLAX', 'SRAX', 'SLC', 'SRC', 'MOVE', 'LDA', 'LD1', 'LD2', 'LD3', 'LD4',
            'LD5', 'LD6', 'LDX', 'LDAN', 'LD1N', 'LD2N', 'LD3N', 'LD4N', 'LD5N', 'LD6N', 'LDXN',
            'STA', 'ST1', 'ST2', 'ST3', 'ST4', 'ST5', 'ST6', 'STX', 'STJ', 'STZ', 'JBUS', 'IOC',
            'IN', 'OUT', 'JRED', 'JMP', 'JSJ', 'JOV', 'JNOV', 'JL', 'JE', 'JG', 'JGE', 'JNE', 'JLE',
            'JAN', 'JAZ', 'JAP', 'JANN', 'JANZ', 'JANP', 'J1N', 'J1Z', 'J1P', 'J1NN', 'J1NZ',
            'J1NP', 'J2N', 'J2Z', 'J2P', 'J2NN', 'J2NZ', 'J2NP','J3N', 'J3Z', 'J3P', 'J3NN', 'J3NZ',
            'J3NP', 'J4N', 'J4Z', 'J4P', 'J4NN', 'J4NZ', 'J4NP', 'J5N', 'J5Z', 'J5P', 'J5NN',
            'J5NZ', 'J5NP','J6N', 'J6Z', 'J6P', 'J6NN', 'J6NZ', 'J6NP', 'JXAN', 'JXZ', 'JXP',
            'JXNN', 'JXNZ', 'JXNP', 'INCA', 'DECA', 'ENTA', 'ENNA', 'INC1', 'DEC1', 'ENT1', 'ENN1',
            'INC2', 'DEC2', 'ENT2', 'ENN2', 'INC3', 'DEC3', 'ENT3', 'ENN3', 'INC4', 'DEC4', 'ENT4',
            'ENN4', 'INC5', 'DEC5', 'ENT5', 'ENN5', 'INC6', 'DEC6', 'ENT6', 'ENN6', 'INCX', 'DECX',
            'ENTX', 'ENNX', 'CMPA', 'FCMP', 'CMP1', 'CMP2', 'CMP3', 'CMP4', 'CMP5', 'CMP6', 'CMPX',
            'EQU', 'ORIG', 'CON', 'ALF', 'END'
        ].indexOf(op) > -1;
    };

    var containsOnlySupportedCharacters = function(string) {
        return string && string.search(/[^ A-Z\u0394\u03a0\u03a30-9.,()+*/=$<>@;:'-]/) == -1;
    };

    this.$rules = {
        "start" : [{
            token: "comment.line.character",
            regex: /^ *\*.*$/
        }, {
            token: function(label, space0, keyword, space1, literal, comment) {
                return [
                    isValidSymbol(label) ? "variable.other" : "invalid.illegal",
                    "text",
                    "keyword.control",
                    "text",
                    containsOnlySupportedCharacters(literal) ? "text" : "invalid.illegal",
                    "comment.line.character"
                ];
            },
            regex: /^(\S+)?( +)(ALF)(  )(.{5})(\s+.*)?$/
        }, {
            token: function(label, space0, keyword, space1, literal, comment) {
                return [
                    isValidSymbol(label) ? "variable.other" : "invalid.illegal",
                    "text",
                    "keyword.control",
                    "text",
                    containsOnlySupportedCharacters(literal) ? "text" : "invalid.illegal",
                    "comment.line.character"
                ];
            },
            regex: /^(\S+)?( +)(ALF)( )(\S.{4})(\s+.*)?$/
        }, {
            token: function(label, space0, op, comment) {
                return [
                    isValidSymbol(label) ? "variable.other" : "invalid.illegal",
                    "text",
                    isValidOp(op) ? "keyword.control" : "invalid.illegal",
                    "comment.line.character"
                ];
            },
            regex: /^(\S+)?( +)(\S+)(?:\s*)$/
        }, {
            token: function(label, space0, op, space1, address, comment) {
                return [
                    isValidSymbol(label) ? "variable.other" : "invalid.illegal",
                    "text",
                    isValidOp(op) ? "keyword.control" : "invalid.illegal",
                    "text",
                    containsOnlySupportedCharacters(address) ? "text" : "invalid.illegal",
                    "comment.line.character"
                ];
            },
            regex: /^(\S+)?( +)(\S+)( +)(\S+)(\s+.*)?$/
        }, {
            defaultToken: "text"
        }]
    };
};

oop.inherits(MixalHighlightRules, TextHighlightRules);

exports.MixalHighlightRules = MixalHighlightRules;

});
