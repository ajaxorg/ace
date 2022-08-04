"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var JavaHighlightRules = require("./java_highlight_rules").JavaHighlightRules;
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;

var identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*";
var packageIdentifierRe = "[a-zA-Z\\$_\u00a1-\uffff][\\.a-zA-Z\\d\\$_\u00a1-\uffff]*";

var DroolsHighlightRules = function() {

    var keywords = ("date|effective|expires|lock|on|active|no|loop|auto|focus" +
        "|activation|group|agenda|ruleflow|duration|timer|calendars|refract|direct" +
        "|dialect|salience|enabled|attributes|extends|template" +
        "|function|contains|matches|eval|excludes|soundslike" +
        "|memberof|not|in|or|and|exists|forall|over|from|entry|point|accumulate|acc|collect" +
        "|action|reverse|result|end|init|instanceof|extends|super|boolean|char|byte|short" +
        "|int|long|float|double|this|void|class|new|case|final|if|else|for|while|do" +
        "|default|try|catch|finally|switch|synchronized|return|throw|break|continue|assert" +
        "|modify|static|public|protected|private|abstract|native|transient|volatile" +
        "|strictfp|throws|interface|enum|implements|type|window|trait|no-loop|str"
      );

      var langClasses = (
          "AbstractMethodError|AssertionError|ClassCircularityError|"+
          "ClassFormatError|Deprecated|EnumConstantNotPresentException|"+
          "ExceptionInInitializerError|IllegalAccessError|"+
          "IllegalThreadStateException|InstantiationError|InternalError|"+
          "NegativeArraySizeException|NoSuchFieldError|Override|Process|"+
          "ProcessBuilder|SecurityManager|StringIndexOutOfBoundsException|"+
          "SuppressWarnings|TypeNotPresentException|UnknownError|"+
          "UnsatisfiedLinkError|UnsupportedClassVersionError|VerifyError|"+
          "InstantiationException|IndexOutOfBoundsException|"+
          "ArrayIndexOutOfBoundsException|CloneNotSupportedException|"+
          "NoSuchFieldException|IllegalArgumentException|NumberFormatException|"+
          "SecurityException|Void|InheritableThreadLocal|IllegalStateException|"+
          "InterruptedException|NoSuchMethodException|IllegalAccessException|"+
          "UnsupportedOperationException|Enum|StrictMath|Package|Compiler|"+
          "Readable|Runtime|StringBuilder|Math|IncompatibleClassChangeError|"+
          "NoSuchMethodError|ThreadLocal|RuntimePermission|ArithmeticException|"+
          "NullPointerException|Long|Integer|Short|Byte|Double|Number|Float|"+
          "Character|Boolean|StackTraceElement|Appendable|StringBuffer|"+
          "Iterable|ThreadGroup|Runnable|Thread|IllegalMonitorStateException|"+
          "StackOverflowError|OutOfMemoryError|VirtualMachineError|"+
          "ArrayStoreException|ClassCastException|LinkageError|"+
          "NoClassDefFoundError|ClassNotFoundException|RuntimeException|"+
          "Exception|ThreadDeath|Error|Throwable|System|ClassLoader|"+
          "Cloneable|Class|CharSequence|Comparable|String|Object"
      );

    var keywordMapper = this.createKeywordMapper({
        "variable.language": "this",
        "keyword": keywords,
        "constant.language": "null",
        "support.class" : langClasses,
        "support.function" : "retract|update|modify|insert"
    }, "identifier");

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    var stringRules = function() {
      return [{
        token : "string", // single line
        regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
      }, {
        token : "string", // single line
        regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
      }];
    };


      var basicPreRules = function(blockCommentRules) {
        return [{
            token : "comment",
            regex : "\\/\\/.*$"
        },
        DocCommentHighlightRules.getStartRule("doc-start"),
        {
            token : "comment", // multi line comment
            regex : "\\/\\*",
            next : blockCommentRules
        }, {
            token : "constant.numeric", // hex
            regex : "0[xX][0-9a-fA-F]+\\b"
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : "constant.language.boolean",
            regex : "(?:true|false)\\b"
          }];
      };

      var blockCommentRules = function(returnRule) {
        return [
            {
                token : "comment.block", // closing comment
                regex : "\\*\\/",
                next : returnRule
            }, {
                defaultToken : "comment.block"
            }
        ];
      };

      var basicPostRules = function() {
        return [{
            token : keywordMapper,
            // TODO: Unicode escape sequences
            // TODO: Unicode identifiers
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "keyword.operator",
            regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
        }, {
            token : "lparen",
            regex : "[[({]"
        }, {
            token : "rparen",
            regex : "[\\])}]"
        }, {
            token : "text",
            regex : "\\s+"
        }];
      };


    this.$rules = {
        "start" : [].concat(basicPreRules("block.comment"), [
              {
                token : "entity.name.type",
                regex : "@[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
              }, {
                // package com.example
                token : ["keyword","text","entity.name.type"],
                regex : "(package)(\\s+)(" + packageIdentifierRe +")"
              }, {
                // import function com.Util.staticMethod
                token : ["keyword","text","keyword","text","entity.name.type"],
                regex : "(import)(\\s+)(function)(\\s+)(" + packageIdentifierRe +")"
              }, {
                // import function com.Util.staticMethod
                token : ["keyword","text","entity.name.type"],
                regex : "(import)(\\s+)(" + packageIdentifierRe +")"
              }, {
                // global com.example.Type identifier
                token : ["keyword","text","entity.name.type","text","variable"],
                regex : "(global)(\\s+)(" + packageIdentifierRe +")(\\s+)(" + identifierRe +")"
              }, {
                // declare trait DeclaredType
                token : ["keyword","text","keyword","text","entity.name.type"],
                regex : "(declare)(\\s+)(trait)(\\s+)(" + identifierRe +")"
              }, {
                // declare trait DeclaredType
                token : ["keyword","text","entity.name.type"],
                regex : "(declare)(\\s+)(" + identifierRe +")"
              }, {
                // declare trait DeclaredType
                token : ["keyword","text","entity.name.type"],
                regex : "(extends)(\\s+)(" + packageIdentifierRe +")"
              }, {
                // rule ...
                token : ["keyword","text"],
                regex : "(rule)(\\s+)",
                next :  "asset.name"
              }],
              stringRules(),
              [{
                // variable :
                token : ["variable.other","text","text"],
                regex : "(" + identifierRe + ")(\\s*)(:)"
              }, {
                // query ...
                token : ["keyword","text"],
                regex : "(query)(\\s+)",
                next :  "asset.name"
              }, {
                // when ...
                token : ["keyword","text"],
                regex : "(when)(\\s*)"
              }, {
                // then <java/mvel code> end
                token : ["keyword","text"],
                regex : "(then)(\\s*)",
                next :  "java-start"
              }, {
                  token : "paren.lparen",
                  regex : /[\[({]/
              }, {
                  token : "paren.rparen",
                  regex : /[\])}]/
              }], basicPostRules()),
        "block.comment" : blockCommentRules("start"),
        "asset.name" : [
            {
                token : "entity.name",
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "entity.name",
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "entity.name",
                regex : identifierRe
            }, {
                regex: "",
                token: "empty",
                next: "start"
            }]
    };
    this.embedRules(DocCommentHighlightRules, "doc-",
        [ DocCommentHighlightRules.getEndRule("start") ]);

    this.embedRules(JavaHighlightRules, "java-", [
      {
       token : "support.function",
       regex: "\\b(insert|modify|retract|update)\\b"
     }, {
       token : "keyword",
       regex: "\\bend\\b",
       next  : "start"
    }]);

};

oop.inherits(DroolsHighlightRules, TextHighlightRules);

exports.DroolsHighlightRules = DroolsHighlightRules;
