var oop = require("../lib/oop");
var lang = require("../lib/lang");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var MysqlHighlightRules = function() {
    var mySqlKeywords = /*sql*/ "alter|and|as|asc|between|count|create|delete|desc|distinct|drop|from|lateral|having|in|insert|into|is|join|like|not|on|or|order|select|set|table|union|intersect|except|update|values|where"
        /*mysql*/ + "|accessible|action|add|after|algorithm|all|analyze|asensitive|at|authors|auto_increment|autocommit|avg|avg_row_length|before|binary|binlog|both|btree|cache|call|cascade|cascaded|case|catalog_name|chain|change|changed|character|check|checkpoint|checksum|class_origin|client_statistics|close|code|collate|collation|collations|column|columns|comment|commit|committed|completion|concurrent|condition|connection|consistent|constraint|contains|continue|contributors|convert|cross|current_date|current_time|current_timestamp|current_user|cursor|data|database|databases|day_hour|day_microsecond|day_minute|day_second|deallocate|dec|declare|default|delay_key_write|delayed|delimiter|des_key_file|describe|deterministic|dev_pop|dev_samp|deviance|directory|disable|discard|distinctrow|div|dual|dumpfile|each|elseif|enable|enclosed|end|ends|engine|engines|enum|errors|escape|escaped|even|event|events|every|execute|exists|exit|explain|extended|fast|fetch|field|fields|first|flush|for|force|foreign|found_rows|full|fulltext|function|general|global|grant|grants|group|by|group_concat|handler|hash|help|high_priority|hosts|hour_microsecond|hour_minute|hour_second|if|ignore|ignore_server_ids|import|index|index_statistics|infile|inner|innodb|inout|insensitive|insert_method|install|interval|invoker|isolation|iterate|key|keys|kill|language|last|leading|leave|left|level|limit|linear|lines|list|load|local|localtime|localtimestamp|lock|logs|low_priority|master|master_heartbeat_period|master_ssl_verify_server_cert|masters|match|max|max_rows|maxvalue|message_text|middleint|migrate|min|min_rows|minute_microsecond|minute_second|mod|mode|modifies|modify|mutex|mysql_errno|natural|next|no|no_write_to_binlog|offline|offset|one|online|open|optimize|option|optionally|out|outer|outfile|pack_keys|parser|partition|partitions|password|phase|plugin|plugins|prepare|preserve|prev|primary|privileges|procedure|processlist|profile|profiles|purge|query|quick|range|read|read_write|reads|real|rebuild|recover|references|regexp|relaylog|release|remove|rename|reorganize|repair|repeatable|replace|require|resignal|restrict|resume|return|returns|revoke|right|rlike|rollback|rollup|row|row_format|rtree|savepoint|schedule|schema|schema_name|schemas|second_microsecond|security|sensitive|separator|serializable|server|session|share|show|signal|slave|slow|smallint|snapshot|soname|spatial|specific|sql|sql_big_result|sql_buffer_result|sql_cache|sql_calc_found_rows|sql_no_cache|sql_small_result|sqlexception|sqlstate|sqlwarning|ssl|start|starting|starts|status|std|stddev|stddev_pop|stddev_samp|storage|straight_join|subclass_origin|sum|suspend|table_name|table_statistics|tables|tablespace|temporary|terminated|to|trailing|transaction|trigger|triggers|truncate|uncommitted|undo|uninstall|unique|unlock|upgrade|usage|use|use_frm|user|user_resources|user_statistics|using|utc_date|utc_time|utc_timestamp|value|variables|varying|view|views|warnings|when|while|with|work|write|xa|xor|year_month|zerofill|begin|do|then|else|loop|repeat";
    var builtins = "rank|coalesce|ifnull|isnull|nvl";
    var variable = "charset|clear|connect|edit|ego|exit|go|help|nopager|notee|nowarning|pager|print|prompt|quit|rehash|source|status|system|tee";
    var datetimeFunctions = 'adddate|addtime|convert_tz|curdate|current_date|current_time|current_timestamp|curtime|date|date_add|date_format|date_sub|datediff|day|dayname|dayofmonth|dayofweek|dayofyear|extract|from_days|from_unixtime|get_format|hour|last_day|localtime|localtimestamp|makedate|maketime|microsecond|minute|month|monthname|now|period_add|period_diff|quarter|sec_to_time|second|str_to_date|subdate|subtime|sysdate|time|time_format|time_to_sec|timediff|timestamp|timestampadd|timestampdiff|to_days|to_seconds|unix_timestamp|utc_date|utc_time|utc_timestamp|week|weekday|weekofyear|year|yearweek';
    var encryptionFunctions = 'aes_decrypt|aes_encrypt|compress|md|random_bytes|sha|sha|statement_digest|statement_digest_text|uncompress|uncompressed_length|validate_password_strength';
    var mathFunctions = 'abs|acos|asin|atan|atan|ceil|ceiling|conv|cos|cot|crc|degrees|div|exp|floor|ln|log|log10|log2|mod|pi|pow|power|radians|rand|round|sign|sin|sqrt|tan|truncate';
    var stringFunctions = 'ascii|bin|bit_length|char|char_length|character_length|concat|concat_ws|elt|export_set|field|find_in_set|format|from_base|hex|insert|instr|lcase|left|length|like|load_file|locate|lower|lpad|ltrim|make_set|match|mid|not|not|oct|octet_length|ord|position|quote|regexp|regexp_instr|regexp_like|regexp_replace|regexp_substr|repeat|replace|reverse|right|rlike|rpad|rtrim|soundex|sounds|space|strcmp|substr|substring|substring_index|to_base|trim|ucase|unhex|upper|weight_string';
    //operatorChars: /^[*+\-%<>!=&|^]/,
    var dataTypes = (
        "bool|boolean|bit|blob|decimal|double|enum|float|long|longblob|longtext|medium|mediumblob|mediumint|mediumtext|time|timestamp|tinyblob|tinyint|tinytext|text|" +
        "bigint|int|int1|int2|int3|int4|int8|integer|float|float4|float8|double|char|varbinary|varchar|varcharacter|precision|date|datetime|year|unsigned|signed|numeric"
    );
    
    var keywordMapper = this.createKeywordMapper({
        "support.function": [builtins, datetimeFunctions, encryptionFunctions, mathFunctions, stringFunctions].join('|'),
        "keyword": mySqlKeywords,
        "storage.type": dataTypes,
        "constant": "false|true|null|unknown|ODBCdotTable|zerolessFloat",
        "variable.language": variable
    }, "identifier", true);

    
    function string(rule) {
        var start = rule.start;
        var escapeSeq = rule.escape;
        return {
            token: "string.start",
            regex: start,
            next: [
                {token: "constant.language.escape", regex: escapeSeq},
                {token: "string.end", next: "start", regex: start},
                {defaultToken: "string"}
            ]
        };
    }

    this.$rules = {
        "start" : [ {
            token : "comment", regex : "(?:-- |#).*$"
        },  
        string({start: '"', escape: /\\[0'"bnrtZ\\%_]?/}),
        string({start: "'", escape: /\\[0'"bnrtZ\\%_]?/}),
        DocCommentHighlightRules.getStartRule("doc-start"),
        {
            token : "comment", // multi line comment
            regex : /\/\*/,
            next : "comment"
        }, {
            token : "constant.numeric", // hex
            regex : /0[xX][0-9a-fA-F]+|[xX]'[0-9a-fA-F]+'|0[bB][01]+|[bB]'[01]+'/
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "constant.class",
            regex : "@@?[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        }, {
            token : "constant.buildin",
            regex : "`[^`]*`"
        }, {
            token : "keyword.operator",
            regex : "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
        }, {
            token : "paren.lparen",
            regex : "[\\(]"
        }, {
            token : "paren.rparen",
            regex : "[\\)]"
        }, {
            token : "text",
            regex : "\\s+"
        } ],
        "comment" : [
            {token : "comment", regex : "\\*\\/", next : "start"},
            {defaultToken : "comment"}
        ]
    };

    this.embedRules(DocCommentHighlightRules, "doc-", [ DocCommentHighlightRules.getEndRule("start") ]);
    this.normalizeRules();
};

oop.inherits(MysqlHighlightRules, TextHighlightRules);

exports.MysqlHighlightRules = MysqlHighlightRules;
