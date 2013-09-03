define(function(require, exports, module) {
"use strict";

	exports.description = {
		'object': ('ActiveXObject|Array|ArrayBuffer|arguments|Boolean|DataView|Date|Debug|Enumerator|Error|Float32Array|Float64Array|Function|Global|Int8Array|Int16Array|Int32Array|Intl.Collator|Intl.DateTimeFormat|Intl.NumberFormat|JSON|Map|Math|Number|Object|RegExp|Regular Expression|Set|String|Uint8Array|Uint16Array|Uint32Array|VBArray|WeakMap|WinRTError'.split('|')),
		
		'constant': ('Infinity|LN2|LN10|LOG2E|LOG10E|MAX_VALUE|MIN_VALUE|NaN|NEGATIVE_INFINITY|null|PI|POSITIVE_INFINITY|SQRT1_2|SQRT2|undefined'.split('|')),
		
		'property': ('__proto__|arguments|callee|caller|constructor|description|global|ignoreCase|index|input|lastIndex|lastMatch|lastParen|leftContext|length|message|multiline|name|number|prototype|rightContext|source'.split('|')),
		
		'function': ('abs|acos|asin|atan|atan2|ceil|cos|create|decodeURI|decodeURIComponent|defineProperties|defineProperty|encodeURI|encodeURIComponent|escape|eval|exp|floor|freeze|fromCharCode|GetObject|getOwnPropertyDescriptor|getOwnPropertyNames|getPrototypeOf|isArray|isExtensible|isFinite|isFrozen|isNaN|isSealed|keys|log|max|min|now|parse|parseFloat|parseInt|parseInt|preventExtensions|random|round|ScriptEngine|ScriptEngineBuildVersion|ScriptEngineMajorVersion|ScriptEngineMinorVersion|seal|sin|sqrt|stringify|tan|unescape|UTC|write|writeln'.split('|')),
		
		'method': ('anchor|apply|atEnd|big|bind|blink|bold|call|charAt|charCodeAt|compile|concat|dimensions|every|exec|filter|fixed|fontcolor|fontsize|forEach|getDate|getDay|getFullYear|getHours|getItem|getMilliseconds|getMinutes|getMonth|getSeconds|getTime|getTimezoneOffset|getUTCDate|getUTCDay|getUTCFullYear|getUTCHours|getUTCMilliseconds|getUTCMinutes|getUTCMonth|getUTCSeconds|getVarDate|getYear|hasOwnProperty|indexOf|isPrototypeOf|italics|item|join|lastIndexOf|lastIndexOf|lbound|link|localeCompare|map|match|moveFirst|moveNext|pop|propertyIsEnumerable|push|reduce|reduceRight|replace|reverse|search|setDate|setFullYear|setHours|setMilliseconds|setMinutes|setMonth|setSeconds|setTime|setUTCDate|setUTCFullYear|setUTCHours|setUTCMilliseconds|setUTCMinutes|setUTCMonth|setUTCSeconds|setYear|shift|slice|slice|small|some|sort|splice|split|strike|sub|substr|substring|sup|test|toArray|toDateString|toExponential|toFixed|toGMTString|toISOString|toJSON|toLocaleDateString|toLocaleLowerCase|toLocaleString|toLocaleTimeString|toLocaleUpperCase|toLowerCase|toPrecision|toString|toTimeString|toUpperCase|toUTCString|trim|ubound|unshift|valueOf'.split('|')),
		
		'keyword': ('break|default|function|return|var|case|delete|if|switch|void|catch|do|in|this|while|const|else|instanceof|throw|with|continue|finally|let|try|debugger|for|new|typeof|class|enum|export|extends|import|super|implements|interface|package|private|protected|public|static|yield'.split('|'))
};
	exports.scope = "javascript";

});
