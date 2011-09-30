define(function(require, exports, module) {

var oop = require("pilot/oop");
var lang = require("pilot/lang");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var bashHighlightRules = function() {

    var builtinFunctions = lang.arrayToMap(
        ("aclocal|aconnect|aplay|apm|apmsleep|apropos|ar|arch|arecord|as|as86|autoconf|autoheader|automake|awk|awk|basename|bash|bc|bison|bunzip2|bzcat|bzcmp|bzdiff|bzegrep|bzfgrep|bzgrep|bzip2|bzip2recover|bzless|bzmore|c++|cal|cat|cat|cc|cd-read|cdda2wav|cdparanoia|cdrdao|cdrecord|chattr|chfn|chgrp|chgrp|chmod|chmod|chown|chown|chroot|chsh|chvt|clear|cmp|co|col|comm|cp|cp|cpio|cpp|cut|date|dc|dcop|dd|dd|deallocvt|df|df|diff|diff3|dir|dir|dircolors|dircolors|directomatic|dirname|dmesg|dnsdomainname|domainname|du|du|dumpkeys|echo|ed|egrep|env|expr|false|fbset|fgconsole|fgrep|file|find|flex|flex++|fmt|free|ftp|funzip|fuser|fuser|g++|gawk|gawk|gc|gcc|gdb|getent|getkeycodes|getopt|gettext|gettextize|gimp|gimp-remote|gimptool|gmake|gocr|grep|groups|gs|gunzip|gzexe|gzip|head|hexdump|hostname|id|igawk|install|install|join|kbd_mode|kbdrate|kdialog|kfile|kill|killall|killall|last|lastb|ld|ld86|ldd|less|lex|link|ln|ln|loadkeys|loadunimap|locate|lockfile|login|logname|lp|lpr|ls|ls|lsattr|lsmod|lsmod.old|lynx|m4|make|man|mapscrn|mesg|mkdir|mkdir|mkfifo|mknod|mknod|mktemp|more|mount|msgfmt|mv|mv|namei|nano|nasm|nawk|netstat|nice|nisdomainname|nl|nm|nm86|nmap|nohup|nop|od|openvt|passwd|patch|pcregrep|pcretest|perl|perror|pgawk|pidof|pidof|ping|pr|printf|procmail|prune|ps|ps2ascii|ps2epsi|ps2frag|ps2pdf|ps2ps|psbook|psmerge|psnup|psresize|psselect|pstops|pstree|pwd|rbash|rcs|readlink|red|resizecons|rev|rm|rm|rmdir|run-parts|sash|scp|sed|sed|seq|setfont|setkeycodes|setleds|setmetamode|setserial|setterm|sh|showkey|shred|shred|size|size86|skill|sleep|slogin|snice|sort|sox|split|ssed|ssh|ssh-add|ssh-agent|ssh-keygen|ssh-keyscan|stat|stat|strings|strip|stty|su|sudo|suidperl|sum|sync|tac|tail|tar|tee|tempfile|test|touch|tr|true|umount|uname|unicode_start|unicode_stop|uniq|unlink|unlink|unzip|updatedb|updmap|uptime|users|utmpdump|uuidgen|vdir|vmstat|w|wall|wc|wc|wget|whatis|whereis|which|who|whoami|write|xargs|xhost|xmodmap|xset|yacc|yes|ypdomainname|zcat|zcmp|zdiff|zegrep|zfgrep|zforce|zgrep|zip|zless|zmore|znew|zsh|zsoelim").split("|")
    );

    var keywords = lang.arrayToMap(
        ("case|esac|declare|do|done|export|local|read|readonly|typeset|unset|if|elif|else|fi|for|function|in|select|set|then|until|while").split("|")
    );

    var buildinConstants = lang.arrayToMap(
        ("alias|bg|bind|break|builtin|cd|command|compgen|complete|continue|dirs|disown|echo|enable|eval|exec|exit|fc|fg|getopts|hash|help|history|jobs|kill|let|logout|popd|printf|pushd|pwd|return|set|shift|shopt|source|suspend|test|times|trap|type|ulimit|umask|unalias|wait").split("|")
    );

    var builtinVariables = lang.arrayToMap(
        ("\$DEBUG|\$defout|\$FILENAME|\$LOAD_PATH|\$SAFE|\$stdin|\$stdout|\$stderr|\$VERBOSE|" +
        "$!|root_url|flash|session|cookies|params|request|response|logger").split("|")
    );

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
	        {
	            token : "comment",
	            regex : "#.*$"
	        }, {
                token : "comment", // multi line comment
                regex : "^\=begin$",
                next : "comment"
            }, {
	            token : "string.regexp",
	            regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
	        }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
	        }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
	        }, {
                token : "string", // backtick string
                regex : "[`](?:(?:\\\\.)|(?:[^'\\\\]))*?[`]"
	        }, {
                token : "text", // namespaces aren't symbols
                regex : "::"
	        }, {
                token : "variable.instancce", // instance variable
                regex : "@{1,2}(?:[a-zA-Z_]|\d)+"
	        }, {
                token : "variable.class", // class name
                regex : "[A-Z](?:[a-zA-Z_]|\d)+"
	        }, {
                token : "string", // symbol
                regex : "[:](?:[A-Za-z_]|[@$](?=[a-zA-Z0-9_]))[a-zA-Z0-9_]*[!=?]?"
	       }, {
	            token : "constant.numeric", // hex
	            regex : "0[xX][0-9a-fA-F](?:[0-9a-fA-F]|_(?=[0-9a-fA-F]))*\\b"
	        }, {
	            token : "constant.numeric", // float
	            regex : "[+-]?\\d(?:\\d|_(?=\\d))*(?:(?:\\.\\d(?:\\d|_(?=\\d))*)?(?:[eE][+-]?\\d+)?)?\\b"
	        }, {
	            token : "constant.language.boolean",
	            regex : "(?:true|false)\\b"
	        }, {
	            token : function(value) {
	                if (value == "self")
	                    return "variable.language";
	                else if (keywords.hasOwnProperty(value))
	                    return "keyword";
	                else if (buildinConstants.hasOwnProperty(value))
	                    return "constant.language";
                    else if (builtinVariables.hasOwnProperty(value))
                        return "variable.language";
                    else if (builtinFunctions.hasOwnProperty(value))
                        return "support.function";
	                else if (value == "debugger")
	                    return "invalid.deprecated";
	                else
	                    return "identifier";
	            },
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
	        }
        ],
        "comment" : [
	        {
                token : "comment", // closing comment
                regex : "^\=end$",
                next : "start"
            }, {
	            token : "comment", // comment spanning whole line
	            regex : ".+"
	        }
        ]
    };
};

oop.inherits(bashHighlightRules, TextHighlightRules);

exports.bashHighlightRules = bashHighlightRules;
});
