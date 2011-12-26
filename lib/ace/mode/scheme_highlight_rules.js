
define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var SchemeHighlightRules = function() {

    var builtinFunctions = lang.arrayToMap(
        ("exit-handler field import inherit init-field interface let/ec mixin " +
        "opt-lambda override protect provide public rename require " +
        "require-for-syntax syntax syntax-case syntax-error unit/sig with-syntax " +
        "call-with-input-file call-with-output-file define-syntax delay " +
        "dynamic-wind for-each let-syntax letrec-syntax map syntax-rules abs acos " +
        "angle append apply asin assoc assq assv atan boolean? caar cadr " +
        "call-with-input-file call-with-output-file call-with-values car cdddar " +
        "cddddr cdr ceiling char->integer char-alphabetic? char-ci<=? char-ci<? " +
        "char-ci=? char-ci>=? char-ci>? char-downcase char-lower-case? " +
        "char-numeric? char-ready? char-upcase char-upper-case? char-whitespace? " +
        "char<=? char<? char=? char>=? char>? char? close-input-port " +
        "close-output-port complex? cons cos current-input-port " +
        "current-output-port denominator display eof-object? eq? equal? eqv? eval " +
        "even? exact->inexact exact? exp expt floor force gcd imag-part " +
        "inexact->exact inexact? input-port? integer->char integer? " +
        "interaction-environment lcm length list list->string list->vector " +
        "list-ref list-tail list? load log magnitude make-polar make-rectangular " +
        "make-string make-vector max member memq memv min modulo negative? newline " +
        "not null-environment null? number->string number? numerator odd? " +
        "open-input-file open-output-file output-port? pair? peek-char port? " +
        "positive? procedure? quotient rational? rationalize read read-char " +
        "real-part real? remainder reverse round scheme-report-environment set-car! " + 
        "set-cdr! sin sqrt string string->list string->number string->symbol " + 
        "string-append string-ci<=? string-ci<? string-ci=? string-ci>=? string-ci>? " +
        "string-copy string-fill! string-length string-ref string-set! " +
        "string<=? string<? string=? string>=? string>? string? substring " +
        "symbol->string symbol? tan transcript-off transcript-on truncate " +
        "values vector vector->list vector-fill! vector-length vector-ref " + 
        "vector-set! with-input-from-file with-output-to-file write write-char zero? * / - +").split(' ')
    );
    
    var keywords = lang.arrayToMap(
      ("define begin quote lambda if set! cond else case and or let let* letrec letrec* " +
      "let-values let*-values do when call-with-current-continuation call/cc quasiquote " +
      "unquote unquote-splicing unless case-lambda define-record-type record-type-descriptor " +
      "record-constructor-descriptor define-enumeration class define-class").split(' ')
    );
    
    var builtinConstants = lang.arrayToMap(
        ("true false nil #t #f").split(" ")
    );
    
    var numPost = "(?:[+]\\d+(?:\\.\\d*)?i)?\\b";
    
    this.$rules = {
          "start" : [
              {
                  token : "comment",
                  regex : ";.*$"
              }, {
                      token : "comment", // multi line comment
                      regex : "#\\|",
                      next : "comment"
              }, {
                      token : "comment", // s-expression comment
                      regex : "#;\\(",
                      next : "comment.sexpr"
              },{
                  token : "constant",
                  regex : "#\\\\[^\\s]*"
              }, {
                  token : "keyword", //parens
                  regex : "[\\(|\\)]"
              }, {
                  token : "keyword", //datum abbreviations
                  regex : "[\\'\\(`,@]"
              }, {
                  token : "keyword", //bytevectors
                  regex : "#vu8"
              }, {
                  token : "keyword", //vectors
                  regex : "#"
              }, {
                  token : "constant.numeric", // hex
                  regex : "0[xX][0-9a-fA-F]+\\b"
              }, {
                  token : "constant.numeric", // special
                  regex : "[+-](?:nan|inf)\\.0" + numPost
              }, {
                  token : "constant.numeric", // rational
                  regex : "[+-]?\\d+\\/\\d+" + numPost
              }, {
                  token : "constant.numeric", // float
                  regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[+]\\d+(?:\\.\\d*)?i)?)?\\b"
              },{
                  token : function(value) {
                      if (keywords.hasOwnProperty(value))
                          return "keyword";
                      else if (builtinConstants.hasOwnProperty(value))
                          return "constant.language";
                          else if (builtinFunctions.hasOwnProperty(value))
                          return "support.function";
                      else
                          return "identifier";
                  },
                  regex : "[a-zA-Z0-9!\\$%&\\*\\+\\-\\.\\/:<=>\\?@^_~]+"
              }, {
                  token : "string", // multi line
                  regex : '"',
                  next : "string"
              }, {
              token : "string.regexp", //Regular Expressions
              regex : '/#"(?:\.|(\\\")|[^\""\n])*"/g'
              }

          ],
          "comment" : [
              {
                  token : "comment", // closing comment
                  regex : ".*\\|#",
                  next : "start"
              }, {
                  token : "comment", // comment spanning whole line
                  merge : true,
                  regex : ".+"
              }
          ],
          // Couldn't truley implement this because of this regex oriented tokenizer.
          "comment.sexpr" : [
              {
                  token : "comment",
                  regex : ".*\\)",
                  next : "start"
              }, {
                  token : "comment",
                  merge : true,
                  regex : ".+"
              }
          ],
          "string" : [
            {
              token : "string",
              regex : '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
              next : "start"
            },
            {
              token : "string",
              merge : true,
              regex : '.+'
            }
          ]
    }
};

oop.inherits(SchemeHighlightRules, TextHighlightRules);

exports.SchemeHighlightRules = SchemeHighlightRules;
});
