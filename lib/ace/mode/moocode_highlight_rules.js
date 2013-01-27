/* global define */

define(function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

  var MoocodeHighlightRules = function() {

    var keywords = (
      "return|break|continue|if|elseif|else|endif|for|endfor|fork|endfork|" +
        "try|except|finally|endtry|while|endwhile|in"
    );

    var builtinConstants = (
      "E_NONE|E_TYPE|E_DIV|E_PERM|E_PROPNF|E_VERBNF|E_VARNF|E_INVIND|E_RECMOVE|E_MAXREC|" +
        "E_RANGE|E_ARGS|E_NACC|E_INVARG|E_QUOTA|E_FLOAT|E_FILE|E_EXEC|E_INTRPT"
    );

    var specialVariables = (
      "this|player|args|argstr|caller|dobj|dobjstr|iobj|iobjstr|player|prepstr|this|verb|" +
        "ERR|FLOAT|INT|LIST|MAP|NUM|OBJ|STR"
    );

    var functions = (
      "abs|acos|add_property|add_verb|ancestors|asin|atan|binary_hash|binary_hmac|boot_player|" +
        "buffered_output_length|call_function|caller_perms|callers|ceil|children|chparent|" +
        "chparents|clear_property|connected_players|connected_seconds|connection_name|" +
        "connection_option|connection_options|cos|cosh|create|crypt|ctime|db_disk_size|" +
        "decode_base64|decode_binary|delete_property|delete_verb|descendants|disassemble|" +
        "dump_database|encode_base64|encode_binary|equal|eval|exec|exp|file_chmod|file_close|" +
        "file_eof|file_flush|file_last_access|file_last_change|file_last_modify|file_list|" +
        "file_mkdir|file_mode|file_name|file_open|file_openmode|file_read|file_readline|" +
        "file_readlines|file_remove|file_rename|file_rmdir|file_seek|file_size|file_stat|" +
        "file_tell|file_type|file_version|file_write|file_writeline|floatstr|floor|flush_input|" +
        "force_input|function_info|gc_stats|generate_json|idle_seconds|index|is_clear_property|" +
        "is_member|is_player|isa|kill_task|length|listappend|listdelete|listen|listeners|" +
        "listinsert|listset|load_server_options|log|log10|log_cache_stats|mapdelete|mapkeys|mapvalues|" +
        "match|max|max_object|memory_usage|min|move|notify|object_bytes|open_network_connection|" +
        "output_delimiters|parent|parents|parse_json|pass|players|properties|property_info|" +
        "queue_info|queued_tasks|raise|random|read|read_http|recycle|renumber|reset_max_object|" +
        "respond_to|resume|rindex|rmatch|run_gc|seconds_left|server_log|server_version|" +
        "set_connection_option|set_player_flag|set_property_info|set_task_local|set_task_perms|" +
        "set_verb_args|set_verb_code|set_verb_info|setadd|setremove|shutdown|sin|sinh|sqrt|" +
        "strcmp|string_hash|string_hmac|strsub|substitute|suspend|switch_player|tan|tanh|" +
        "task_id|task_local|task_perms|task_stack|ticks_left|time|tofloat|toint|toliteral|" +
        "tonum|toobj|tostr|trunc|typeof|unlisten|valid|value_bytes|value_hash|value_hmac|" +
        "verb_args|verb_cache_stats|verb_code|verb_info|verbs"
    );

    var keywordMapper = this.createKeywordMapper({
      "keyword": keywords,
      "constant.language": builtinConstants,
      "variable.language": specialVariables,
      "support.function": functions
    }, "identifier");

    // regexp must not have capturing parentheses. Use (?:) instead.

    var fraction = "(?:\\.\\d+)";
    var intPart = "(?:\\d+)";
    var pointFloat = "(?:(?:" + intPart + "?" + fraction + ")|(?:" + intPart + "\\.))";
    var floatNumber = "(?:" + pointFloat + ")";
    var integerNumber = "(?:(?:[1-9]\\d*)|(?:0))";
    var objectNumber = "(?:#[+-]?\\d+)";

    this.$rules = {
      start :
      [{
        token : "comment",
        regex : "\\/\\*",
        next : "comment"
      }, {
        token : "string",
        regex : '"(?:[^\\\\]|\\\\.)*?"'
      }, {
        token : "constant.numeric",
        regex : floatNumber
      }, {
        token : "constant.numeric",
        regex : integerNumber + "\\b"
      }, {
        token : "invalid.deprecated",
        regex : objectNumber + "\\b"
      }, {
        token : "variable.language",
        regex : "\\$[a-zA-Z_][a-zA-Z0-9_]*\\b"
      }, {
        token : keywordMapper,
        regex : "[a-zA-Z_][a-zA-Z0-9_]*\\b"
      }, {
        token : "keyword.operator",
        regex : "\\+|\\-|\\*|\\/|%|\\^|<|>|<=|=>|==|!=|=|\\:|\\."
      }, {
        token : "paren.lparen",
        regex : "[\\[\\(\\{]"
      }, {
        token : "paren.rparen",
        regex : "[\\]\\)\\}]"
      }, {
        token : "text",
        regex : "\\s+"
      }],

      comment:
      [{
        token : "comment",
        regex : ".*?\\*\\/",
        next : "start"
      }, {
        token : "comment",
        regex : ".+"
      }]
    };
  }

  oop.inherits(MoocodeHighlightRules, TextHighlightRules);

  exports.MoocodeHighlightRules = MoocodeHighlightRules;
});
