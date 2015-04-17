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

var SqlServerHighlightRules = function() {
    /**
     * each section has a link and some javacript code. 
     * go to the link, open dev tools, run code to get the string
     */

    var builtinConstants = "TRUE|FALSE";
    
    
    // multiple pages for built in functions, the following code works for all
    // var r = []; $('.tableSection').find('td').find('a').each(function() { var t = $(this).text().trim().toUpperCase(); /*dont add things with spaces */ if (t.indexOf(' ') !== -1) return; r.push(t); }); r = r.filter(function(value, index, self) { return self.indexOf(value) === index; }); r.sort(); console.log(r.join('|') + '|');
    var builtinFunctions = (
        /* https://msdn.microsoft.com/en-us/library/ms187957.aspx */
        "OPENDATASOURCE|OPENQUERY|OPENROWSET|OPENXML|" +
        /* https://msdn.microsoft.com/en-us/library/ms173454.aspx */
        "AVG|CHECKSUM_AGG|COUNT|COUNT_BIG|GROUPING|GROUPING_ID|MAX|MIN|STDEV|STDEVP|SUM|VAR|VARP|" +
        /* https://msdn.microsoft.com/en-us/library/ms189798.aspx */
        "DENSE_RANK|NTILE|RANK|ROW_NUMBER" +
        /* https://msdn.microsoft.com/en-us/library/ms173823.aspx */
        "@@DATEFIRST|@@DBTS|@@LANGID|@@LANGUAGE|@@LOCK_TIMEOUT|@@MAX_CONNECTIONS|@@MAX_PRECISION|@@NESTLEVEL|@@OPTIONS|@@REMSERVER|@@SERVERNAME|@@SERVICENAME|@@SPID|@@TEXTSIZE|@@VERSION|" +
        /* https://msdn.microsoft.com/en-us/library/hh231076.aspx (MANUAL) */
        "CAST|CONVERT|PARSE|TRY_CAST|TRY_CONVERT|TRY_PARSE" +
        /* https://msdn.microsoft.com/en-us/library/ms186285.aspx */
        "@@CURSOR_ROWS|@@FETCH_STATUS|CURSOR_STATUS|" +
        /* https://msdn.microsoft.com/en-us/library/ms186724.aspx (MANUAL) */
        "@@DATEFIRST|@@LANGUAGE|CURRENT_TIMESTAMP|DATEADD|DATEDIFF|DATEFROMPARTS|DATENAME|DATEPART|DATETIME2FROMPARTS|DATETIMEFROMPARTS|DATETIMEOFFSETFROMPARTS|DAY|EOMONTH|GETDATE|GETUTCDATE|ISDATE|MONTH|SET DATEFIRST|SET DATEFORMAT|SET LANGUAGE|SMALLDATETIMEFROMPARTS|SP_HELPLANGUAGE|SWITCHOFFSET|SYSDATETIME|SYSDATETIMEOFFSET|SYSUTCDATETIME|TIMEFROMPARTS|TODATETIMEOFFSET|YEAR|" +
        /* https://msdn.microsoft.com/en-us/library/hh213226.aspx (MANUAL) */
        "CHOOSE|IIF|" +
        /* https://msdn.microsoft.com/en-us/library/ms177516.aspx */
        "ABS|ACOS|ASIN|ATAN|ATN2|CEILING|COS|COT|DEGREES|EXP|FLOOR|LOG|LOG10|PI|POWER|RADIANS|RAND|ROUND|SIGN|SIN|SQRT|SQUARE|TAN|" +
        /* https://msdn.microsoft.com/en-us/library/ms187812.aspx */
        "@@PROCID|APPLOCK_MODE|APPLOCK_TEST|APP_NAME|ASSEMBLYPROPERTY|COLUMNPROPERTY|COL_LENGTH|COL_NAME|DATABASEPROPERTYEX|DATABASE_PRINCIPAL_ID|DB_ID|DB_NAME|FILEGROUPPROPERTY|FILEGROUP_ID|FILEGROUP_NAME|FILEPROPERTY|FILE_ID|FILE_IDEX|FILE_NAME|FULLTEXTCATALOGPROPERTY|FULLTEXTSERVICEPROPERTY|INDEXKEY_PROPERTY|INDEXPROPERTY|INDEX_COL|OBJECTPROPERTY|OBJECTPROPERTYEX|OBJECT_DEFINITION|OBJECT_ID|OBJECT_NAME|OBJECT_SCHEMA_NAME|ORIGINAL_DB_NAME|PARSENAME|SCHEMA_ID|SCHEMA_NAME|SCOPE_IDENTITY|SERVERPROPERTY|STATS_DATE|TYPEPROPERTY|TYPE_ID|TYPE_NAME|" +
        /* https://msdn.microsoft.com/en-us/library/ms186236.aspx (MANUAL) */
        "CERTENCODED|CERTPRIVATEKEY|CURRENT_USER|DATABASE_PRINCIPAL_ID|HAS_PERMS_BY_NAME|IS_MEMBER|IS_ROLEMEMBER|IS_SRVROLEMEMBER|ORIGINAL_LOGIN|PERMISSIONS|PWDCOMPARE|PWDENCRYPT|SCHEMA_ID|SCHEMA_NAME|SESSION_USER|SUSER_ID|SUSER_NAME|SUSER_SID|SUSER_SNAME|SYS.FN_BUILTIN_PERMISSIONS|SYS.FN_GET_AUDIT_FILE|SYS.FN_MY_PERMISSIONS|SYSTEM_USER|USER_ID|USER_NAME|" +
        /* https://msdn.microsoft.com/en-us/library/ms181984.aspx */
        "ASCII|CHAR|CHARINDEX|CONCAT|DIFFERENCE|FORMAT|LEFT|LEN|LOWER|LTRIM|NCHAR|PATINDEX|QUOTENAME|REPLACE|REPLICATE|REVERSE|RIGHT|RTRIM|SOUNDEX|SPACE|STR|STUFF|SUBSTRING|UNICODE|UPPER|" +
        /* https://msdn.microsoft.com/en-us/library/ms187786.aspx */
        "$PARTITION|@@ERROR|@@IDENTITY|@@PACK_RECEIVED|@@ROWCOUNT|@@TRANCOUNT|BINARY_CHECKSUM|CHECKSUM|CONNECTIONPROPERTY|CONTEXT_INFO|CURRENT_REQUEST_ID|ERROR_LINE|ERROR_MESSAGE|ERROR_NUMBER|ERROR_PROCEDURE|ERROR_SEVERITY|ERROR_STATE|FORMATMESSAGE|GETANSINULL|GET_FILESTREAM_TRANSACTION_CONTEXT|HOST_ID|HOST_NAME|ISNULL|ISNUMERIC|MIN_ACTIVE_ROWVERSION|NEWID|NEWSEQUENTIALID|ROWCOUNT_BIG|XACT_STATE|" +
        /* https://msdn.microsoft.com/en-us/library/ms177520.aspx */
        "@@CONNECTIONS|@@CPU_BUSY|@@IDLE|@@IO_BUSY|@@PACKET_ERRORS|@@PACK_RECEIVED|@@PACK_SENT|@@TIMETICKS|@@TOTAL_ERRORS|@@TOTAL_READ|@@TOTAL_WRITE|FN_VIRTUALFILESTATS|" +
        /* https://msdn.microsoft.com/en-us/library/ms188353.aspx */
        "PATINDEX|TEXTPTR|TEXTVALID|" 
    );


    // https://msdn.microsoft.com/en-us/library/ms187752.aspx
    // var r = []; $('.tableSection').find('td').find('a').each(function() { var t = $(this).text().trim().toUpperCase(); /*dont add things with spaces */ if (t.indexOf(' ') !== -1) return; r.push($(this).text().trim().toUpperCase()); }); r = r.filter(function(value, index, self) { return self.indexOf(value) === index; }); r.sort(); console.log(r.join('|'));
    var dataTypes = (
        "BIGINT|BINARY|BIT|CHAR|CURSOR|DATE|DATETIME|DATETIME2|DATETIMEOFFSET|DECIMAL|FLOAT|HIERARCHYID|IMAGE|INT|MONEY|NCHAR|NTEXT|NUMERIC|NVARCHAR|REAL|SMALLDATETIME|SMALLINT|SMALLMONEY|SQL_VARIANT|TABLE|TEXT|TIME|TIMESTAMP|TINYINT|UNIQUEIDENTIFIER|VARBINARY|VARCHAR|XML"
    );
    
    
    // https://msdn.microsoft.com/en-us/library/ms189822.aspx
    // var r = []; $('.tableSection').find('td').each(function() { r.push($(this).text().trim()); }); r = r.filter(function(value, index, self) { return self.indexOf(value) === index; }); r.sort(); console.log(r.join('|'));
    var keywords = "ABSOLUTE|ACTION|ADA|ADD|ADMIN|AFTER|AGGREGATE|ALIAS|ALL|ALLOCATE|ALTER|AND|ANY|ARE|ARRAY|AS|ASC|ASENSITIVE|ASSERTION|ASYMMETRIC|AT|ATOMIC|AUTHORIZATION|BACKUP|BEFORE|BEGIN|BETWEEN|BIT_LENGTH|BLOB|BOOLEAN|BOTH|BREADTH|BREAK|BROWSE|BULK|BY|CALL|CALLED|CARDINALITY|CASCADE|CASCADED|CASE|CATALOG|CHARACTER|CHARACTER_LENGTH|CHAR_LENGTH|CHECK|CHECKPOINT|CLASS|CLOB|CLOSE|CLUSTERED|COALESCE|COLLATE|COLLATION|COLLECT|COLUMN|COMMIT|COMPLETION|COMPUTE|CONDITION|CONNECT|CONNECTION|CONSTRAINT|CONSTRAINTS|CONSTRUCTOR|CONTAINS|CONTAINSTABLE|CONTINUE|CORR|CORRESPONDING|COVAR_POP|COVAR_SAMP|CREATE|CROSS|CUBE|CUME_DIST|CURRENT|CURRENT_CATALOG|CURRENT_DATE|CURRENT_DEFAULT_TRANSFORM_GROUP|CURRENT_PATH|CURRENT_ROLE|CURRENT_SCHEMA|CURRENT_TIME|CURRENT_TRANSFORM_GROUP_FOR_TYPE|CYCLE|DATA|DATABASE|DBCC|DEALLOCATE|DEC|DECLARE|DEFAULT|DEFERRABLE|DEFERRED|DELETE|DENY|DEPTH|DEREF|DESC|DESCRIBE|DESCRIPTOR|DESTROY|DESTRUCTOR|DETERMINISTIC|DIAGNOSTICS|DICTIONARY|DISCONNECT|DISK|DISTINCT|DISTRIBUTED|DOMAIN|DOUBLE|DROP|DUMP|DYNAMIC|EACH|ELEMENT|ELSE|END|END-EXEC|EQUALS|ERRLVL|ESCAPE|EVERY|EXCEPT|EXCEPTION|EXEC|EXECUTE|EXISTS|EXIT|EXTERNAL|EXTRACT|FETCH|FILE|FILLFACTOR|FILTER|FIRST|FOR|FOREIGN|FORTRAN|FOUND|FREE|FREETEXT|FREETEXTTABLE|FROM|FULL|FULLTEXTTABLE|FUNCTION|FUSION|GENERAL|GET|GLOBAL|GO|GOTO|GRANT|GROUP|HAVING|HOLD|HOLDLOCK|HOST|HOUR|IDENTITY|IDENTITYCOL|IDENTITY_INSERT|IF|IGNORE|IMMEDIATE|IN|INCLUDE|INDEX|INDICATOR|INITIALIZE|INITIALLY|INNER|INOUT|INPUT|INSENSITIVE|INSERT|INTEGER|INTERSECT|INTERSECTION|INTERVAL|INTO|IS|ISOLATION|ITERATE|JOIN|KEY|KILL|LANGUAGE|LARGE|LAST|LATERAL|LEADING|LESS|LEVEL|LIKE|LIKE_REGEX|LIMIT|LINENO|LN|LOAD|LOCAL|LOCALTIME|LOCALTIMESTAMP|LOCATOR|MAP|MATCH|MEMBER|MERGE|METHOD|MINUTE|MOD|MODIFIES|MODIFY|MODULE|MULTISET|NAMES|NATIONAL|NATURAL|NCLOB|NEW|NEXT|NO|NOCHECK|NONCLUSTERED|NONE|NORMALIZE|NOT|NULL|NULLIF|OBJECT|OCCURRENCES_REGEX|OCTET_LENGTH|OF|OFF|OFFSETS|OLD|ON|ONLY|OPEN|OPERATION|OPTION|OR|ORDER|ORDINALITY|OUT|OUTER|OUTPUT|OVER|OVERLAPS|OVERLAY|PAD|PARAMETER|PARAMETERS|PARTIAL|PARTITION|PASCAL|PATH|PERCENT|PERCENTILE_CONT|PERCENTILE_DISC|PERCENT_RANK|PIVOT|PLAN|POSITION|POSITION_REGEX|POSTFIX|PRECISION|PREFIX|PREORDER|PREPARE|PRESERVE|PRIMARY|PRINT|PRIOR|PRIVILEGES|PROC|PROCEDURE|PUBLIC|RAISERROR|RANGE|READ|READS|READTEXT|RECONFIGURE|RECURSIVE|REF|REFERENCES|REFERENCING|REGR_AVGX|REGR_AVGY|REGR_COUNT|REGR_INTERCEPT|REGR_R2|REGR_SLOPE|REGR_SXX|REGR_SXY|REGR_SYY|RELATIVE|RELEASE|REPLICATION|RESTORE|RESTRICT|RESULT|RETURN|RETURNS|REVERT|REVOKE|ROLE|ROLLBACK|ROLLUP|ROUTINE|ROW|ROWCOUNT|ROWGUIDCOL|ROWS|RULE|SAVE|SAVEPOINT|SCHEMA|SCOPE|SCROLL|SEARCH|SECOND|SECTION|SECURITYAUDIT|SELECT|SEMANTICKEYPHRASETABLE|SEMANTICSIMILARITYDETAILSTABLE|SEMANTICSIMILARITYTABLE|SENSITIVE|SEQUENCE|SESSION|SET|SETS|SETUSER|SHUTDOWN|SIMILAR|SIZE|SOME|SPECIFIC|SPECIFICTYPE|SQL|SQLCA|SQLCODE|SQLERROR|SQLEXCEPTION|SQLSTATE|SQLWARNING|START|STATE|STATEMENT|STATIC|STATISTICS|STDDEV_POP|STDDEV_SAMP|STRUCTURE|SUBMULTISET|SUBSTRING_REGEX|SYMMETRIC|SYSTEM|TABLESAMPLE|TEMPORARY|TERMINATE|TEXTSIZE|THAN|THEN|TIMEZONE_HOUR|TIMEZONE_MINUTE|TO|TOP|TRAILING|TRAN|TRANSACTION|TRANSLATE|TRANSLATE_REGEX|TRANSLATION|TREAT|TRIGGER|TRIM|TRUNCATE|TSEQUAL|UESCAPE|UNDER|UNION|UNIQUE|UNKNOWN|UNNEST|UNPIVOT|UPDATE|UPDATETEXT|USAGE|USE|USER|USING|VALUE|VALUES|VARIABLE|VARYING|VAR_POP|VAR_SAMP|VIEW|WAITFOR|WHEN|WHENEVER|WHERE|WHILE|WIDTH_BUCKET|WINDOW|WITH|WITHIN|WITHIN GROUP|WITHOUT|WORK|WRITE|WRITETEXT|XMLAGG|XMLATTRIBUTES|XMLBINARY|XMLCAST|XMLCOMMENT|XMLCONCAT|XMLDOCUMENT|XMLELEMENT|XMLEXISTS|XMLFOREST|XMLITERATE|XMLNAMESPACES|XMLPARSE|XMLPI|XMLQUERY|XMLSERIALIZE|XMLTABLE|XMLTEXT|XMLVALIDATE|ZONE";
    
    //after modifying above data sets, copy above code and run this to remove data types, functions, and constants from keywords
    // keywords = keywords.split('|');
    // keywords = keywords.filter(function(value,index,self){
    //     return builtinConstants.split('|').indexOf(value) === -1 && builtinFunctions.split('|').indexOf(value) === -1 && dataTypes.split('|').indexOf(value) === -1;
    // });
    // console.log(keywords.sort().join('|'));

    var keywordMapper = this.createKeywordMapper({
        "support.function": builtinFunctions,
        "keyword": keywords,
        "constant.language": builtinConstants,
        "storage.type": dataTypes
    }, "identifier", true);
    
    // createKeywordMapper ignores case which we want because SqlServer keywords are not case sensitive which
    // causes our keywords to get changed to lowercase.
    // However, the preferred standard for keywords is uppercase, so this transforms them back to uppercase for code completion
    for (var i = 0; i < this.$keywordList.length; i++) {
        this.$keywordList[i] = this.$keywordList[i].toUpperCase();
    }

    this.$rules = {
        "start" : [ {
            token : "comment",
            regex : "--.*$"
        },  {
            token : "comment",
            start : "/\\*",
            end : "\\*/"
        }, {
            token : "string",           // " string
            regex : '".*?"'
        }, {
            token : "string",           // ' string
            regex : "'.*?'"
        }, {
            token : "constant.numeric", // float
            regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
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
        } ]
    };
    this.normalizeRules();
};

oop.inherits(SqlServerHighlightRules, TextHighlightRules);

exports.SqlHighlightRules = SqlServerHighlightRules;
});

