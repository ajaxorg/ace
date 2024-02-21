"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var AssemblyARM32HighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = { 
        start: [ 
            { 
                token: 'keyword.control.assembly',
                regex: '\\b(?:svc|adc|add|and|b|bic|bl|bx|cdp|cmn|cmp|eor|ldc|ldm|ldr|mcr|mla|mov|mrc|mrs|msr|mul|mvn|orr|rsb|rsc|sbc|stc|stm|str|sub|swi|swp|teq|tst)\\b',
                caseInsensitive: true
            },
            { 
                token: 'variable.parameter.register.assembly',
                regex: '\\b(?:r0|r1|r2|r3|r4|r5|r6|r7|r8|r9|r10|r11|r12|r13|r14|r15|fp|ip|sp|lr|pc|cpsr|spsr)\\b',
                caseInsensitive: true 
            },
            { 
                token: 'constant.character.hexadecimal.assembly',
                regex: '#0x[A-F0-9]+',
                caseInsensitive: true 
            },
            { 
                token: 'constant.character.decimal.assembly',
                regex: '#[0-9]+' 
            },
            { 
                token: 'string.assembly', 
                regex: /'([^\\']|\\.)*'/ 
            },
            { 
                token: 'string.assembly', 
                regex: /"([^\\"]|\\.)*"/ 
            },
            { 
                token: 'support.function.directive.assembly',
                regex: '(?:\.section|\.global|\.text|\.asciz|\.asciiz|\.ascii|\.align|\.byte|\.end|\.data|\.equ|\.extern|\.include)'
            },
            { 
                token: 'entity.name.function.assembly', 
                regex: '^\\s*%%[\\w.]+?:$' 
            },
            { 
                token: 'entity.name.function.assembly', 
                regex: '^\\s*%\\$[\\w.]+?:$' 
            },
            {
                token: 'entity.name.function.assembly', 
                regex: '^[\\w.]+?:' 
            },
            { 
                token: 'entity.name.function.assembly', 
                regex: '^[\\w.]+?\\b'
            },
            {
                token: 'comment.assembly', 
                regex: '\\/\\*', next: 'comment'
            },
            { 
                token: 'comment.assembly', 
                regex: '(?:;|//|@).*$' 
            } 
        ],
        comment:[
            {
                token: 'comment.assembly',
                regex: '\\*\\/', next:'start'
            },
            {
                defaultToken:'comment'
            }
        ]
    };
    
    this.normalizeRules();
};

AssemblyARM32HighlightRules.metaData = { fileTypes: [ 's' ],
      name: 'Assembly ARM32',
      scopeName: 'source.assembly' };


oop.inherits(AssemblyARM32HighlightRules, TextHighlightRules);

exports.AssemblyARM32HighlightRules = AssemblyARM32HighlightRules;
