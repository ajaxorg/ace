define(function(require, exports, module){
var req = require=(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(req,module,exports){
function isScopeMarker(node) {
	if (node.namespaceURI === "http://www.w3.org/1999/xhtml") {
		return node.localName === "applet"
			|| node.localName === "caption"
			|| node.localName === "marquee"
			|| node.localName === "object"
			|| node.localName === "table"
			|| node.localName === "td"
			|| node.localName === "th";
	}
	if (node.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
		return node.localName === "mi"
			|| node.localName === "mo"
			|| node.localName === "mn"
			|| node.localName === "ms"
			|| node.localName === "mtext"
			|| node.localName === "annotation-xml";
	}
	if (node.namespaceURI === "http://www.w3.org/2000/svg") {
		return node.localName === "foreignObject"
			|| node.localName === "desc"
			|| node.localName === "title";
	}
}

function isListItemScopeMarker(node) {
	return isScopeMarker(node)
		|| (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'ol')
		|| (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'ul');
}

function isTableScopeMarker(node) {
	return (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'table')
		|| (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'html');
}

function isTableBodyScopeMarker(node) {
	return (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'tbody')
		|| (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'tfoot')
		|| (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'thead')
		|| (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'html');
}

function isTableRowScopeMarker(node) {
	return (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'tr')
		|| (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'html');
}

function isButtonScopeMarker(node) {
	return isScopeMarker(node)
		|| (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'button');
}

function isSelectScopeMarker(node) {
	return !(node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'optgroup')
		&& !(node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'option');
}

function ElementStack() {
	this.elements = [];
	this.rootNode = null;
	this.headElement = null;
	this.bodyElement = null;
}

ElementStack.prototype._inScope = function(localName, isMarker) {
	for (var i = this.elements.length - 1; i >= 0; i--) {
		var node = this.elements[i];
		if (node.localName === localName)
			return true;
		if (isMarker(node))
			return false;
	}
};

/**
 * Pushes the item on the stack top
 * @param {StackItem} item
 */
ElementStack.prototype.push = function(item) {
	this.elements.push(item);
};

/**
 * Pushes the item on the stack top
 * @param {StackItem} item HTML element stack item
 */
ElementStack.prototype.pushHtmlElement = function(item) {
	this.rootNode = item.node;
	this.push(item);
};

/**
 * Pushes the item on the stack top
 * @param {StackItem} item HEAD element stack item
 */
ElementStack.prototype.pushHeadElement = function(item) {
	this.headElement = item.node;
	this.push(item);
};

/**
 * Pushes the item on the stack top
 * @param {StackItem} item BODY element stack item
 */
ElementStack.prototype.pushBodyElement = function(item) {
	this.bodyElement = item.node;
	this.push(item);
};

/**
 * Pops the topmost item
 * @return {StackItem}
 */
ElementStack.prototype.pop = function() {
	return this.elements.pop();
};

/**
 * Removes the item from the element stack
 * @param {StackItem} item The item to remove
 */
ElementStack.prototype.remove = function(item) {
	this.elements.splice(this.elements.indexOf(item), 1);
};

ElementStack.prototype.popUntilPopped = function(localName) {
	var element;
	do {
		element = this.pop();
	} while (element.localName != localName);
};

ElementStack.prototype.popUntilTableScopeMarker = function() {
	while (!isTableScopeMarker(this.top))
		this.pop();
};

ElementStack.prototype.popUntilTableBodyScopeMarker = function() {
	while (!isTableBodyScopeMarker(this.top))
		this.pop();
};

ElementStack.prototype.popUntilTableRowScopeMarker = function() {
	while (!isTableRowScopeMarker(this.top))
		this.pop();
};

ElementStack.prototype.item = function(index) {
	return this.elements[index];
};

ElementStack.prototype.contains = function(element) {
	return this.elements.indexOf(element) !== -1;
};

ElementStack.prototype.inScope = function(localName) {
	return this._inScope(localName, isScopeMarker);
};

ElementStack.prototype.inListItemScope = function(localName) {
	return this._inScope(localName, isListItemScopeMarker);
};

ElementStack.prototype.inTableScope = function(localName) {
	return this._inScope(localName, isTableScopeMarker);
};

ElementStack.prototype.inButtonScope = function(localName) {
	return this._inScope(localName, isButtonScopeMarker);
};

ElementStack.prototype.inSelectScope = function(localName) {
	return this._inScope(localName, isSelectScopeMarker);
};

ElementStack.prototype.hasNumberedHeaderElementInScope = function() {
	for (var i = this.elements.length - 1; i >= 0; i--) {
		var node = this.elements[i];
		if (node.isNumberedHeader())
			return true;
		if (isScopeMarker(node))
			return false;
	}
};

ElementStack.prototype.furthestBlockForFormattingElement = function(element) {
	var furthestBlock = null;
	for (var i = this.elements.length - 1; i >= 0; i--) {
		var node = this.elements[i];
		if (node.node === element)
			return furthestBlock;
		if (node.isSpecial())
			furthestBlock = node;
	}
};

ElementStack.prototype.findIndex = function(localName) {
	for (var i = this.elements.length - 1; i >= 0; i--) {
		if (this.elements[i].localName == localName)
			return i;
	}
};

ElementStack.prototype.remove_openElements_until = function(callback) {
	var finished = false;
	var element;
	while (!finished) {
		element = this.elements.pop();
		finished = callback(element);
	}
	return element;
};

Object.defineProperty(ElementStack.prototype, 'top', {
	get: function() {
		return this.elements[this.elements.length - 1];
	}
});

Object.defineProperty(ElementStack.prototype, 'length', {
	get: function() {
		return this.elements.length;
	}
});

exports.ElementStack = ElementStack;

},{}],2:[function(req,module,exports){
var entities  = req('html5-entities');
var InputStream = req('./InputStream').InputStream;

/**
 * Magic value for UTF-16 operations.
 */
var LEAD_OFFSET = (0xD800 - (0x10000 >> 10));

var namedEntityPrefixes = {};
Object.keys(entities).forEach(function (entityKey) {
	for (var i = 0; i < entityKey.length; i++) {
		namedEntityPrefixes[entityKey.substring(0, i + 1)] = true;
	}
});

function isAlphaNumeric(c) {
	return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
}

function isHexDigit(c) {
	return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
}

function isDecimalDigit(c) {
	return (c >= '0' && c <= '9');
}

var EntityParser = {};

EntityParser.consumeEntity = function(buffer, tokenizer, additionalAllowedCharacter) {
	var decodedCharacter = '';
	var consumedCharacters = '';
	var ch = buffer.char();
	if (ch === InputStream.EOF)
		return false;
	consumedCharacters += ch;
	if (ch == '\t' || ch == '\n' || ch == '\v' || ch == ' ' || ch == '<' || ch == '&') {
		buffer.unget(consumedCharacters);
		return false;
	}
	if (additionalAllowedCharacter === ch) {
		buffer.unget(consumedCharacters);
		return false;
	}
	if (ch == '#') {
		ch = buffer.shift(1);
		if (ch === InputStream.EOF) {
			tokenizer._parseError("expected-numeric-entity-but-got-eof");
			buffer.unget(consumedCharacters);
			return false;
		}
		consumedCharacters += ch;
		var radix = 10;
		var isDigit = isDecimalDigit;
		if (ch == 'x' || ch == 'X') {
			radix = 16;
			isDigit = isHexDigit;
			ch = buffer.shift(1);
			if (ch === InputStream.EOF) {
				tokenizer._parseError("expected-numeric-entity-but-got-eof");
				buffer.unget(consumedCharacters);
				return false;
			}
			consumedCharacters += ch;
		}
		if (isDigit(ch)) {
			var code = '';
			while (ch !== InputStream.EOF && isDigit(ch)) {
				code += ch;
				ch = buffer.char();
			}
			code = parseInt(code, radix);
			var replacement = this.replaceEntityNumbers(code);
			if (replacement) {
				tokenizer._parseError("invalid-numeric-entity-replaced");
				code = replacement;
			}
			if (code > 0xFFFF && code < 0x10FFFF) {
				var astralChar = "";
				astralChar += String.fromCharCode(LEAD_OFFSET + (code >> 10));
				astralChar += String.fromCharCode(0xDC00 + (code & 0x3FF));
				decodedCharacter = astralChar;
			} else
				decodedCharacter = String.fromCharCode(code);
			if (ch !== ';') {
				tokenizer._parseError("numeric-entity-without-semicolon");
				buffer.unget(ch);
			}
			return decodedCharacter;
		}
		buffer.unget(consumedCharacters);
		tokenizer._parseError("expected-numeric-entity");
		return false;
	}
	if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
		var mostRecentMatch = '';
		while (namedEntityPrefixes[consumedCharacters]) {
			if (entities[consumedCharacters]) {
				mostRecentMatch = consumedCharacters;
			}
			if (ch == ';')
				break;
			ch = buffer.char();
			if (ch === InputStream.EOF)
				break;
			consumedCharacters += ch;
		}
		if (!mostRecentMatch) {
			tokenizer._parseError("expected-named-entity");
			buffer.unget(consumedCharacters);
			return false;
		}
		decodedCharacter = entities[mostRecentMatch];
		if (ch === ';' || !additionalAllowedCharacter || !(isAlphaNumeric(ch) || ch === '=')) {
			if (consumedCharacters.length > mostRecentMatch.length) {
				buffer.unget(consumedCharacters.substring(mostRecentMatch.length));
			}
			if (ch !== ';') {
				tokenizer._parseError("named-entity-without-semicolon");
			}
			return decodedCharacter;
		}
		buffer.unget(consumedCharacters);
		return false;
	}
};

EntityParser.replaceEntityNumbers = function(c) {
	switch(c) {
		case 0x00: return 0xFFFD; // REPLACEMENT CHARACTER
		case 0x13: return 0x0010; // Carriage return
		case 0x80: return 0x20AC; // EURO SIGN
		case 0x81: return 0x0081; // <control>
		case 0x82: return 0x201A; // SINGLE LOW-9 QUOTATION MARK
		case 0x83: return 0x0192; // LATIN SMALL LETTER F WITH HOOK
		case 0x84: return 0x201E; // DOUBLE LOW-9 QUOTATION MARK
		case 0x85: return 0x2026; // HORIZONTAL ELLIPSIS
		case 0x86: return 0x2020; // DAGGER
		case 0x87: return 0x2021; // DOUBLE DAGGER
		case 0x88: return 0x02C6; // MODIFIER LETTER CIRCUMFLEX ACCENT
		case 0x89: return 0x2030; // PER MILLE SIGN
		case 0x8A: return 0x0160; // LATIN CAPITAL LETTER S WITH CARON
		case 0x8B: return 0x2039; // SINGLE LEFT-POINTING ANGLE QUOTATION MARK
		case 0x8C: return 0x0152; // LATIN CAPITAL LIGATURE OE
		case 0x8D: return 0x008D; // <control>
		case 0x8E: return 0x017D; // LATIN CAPITAL LETTER Z WITH CARON
		case 0x8F: return 0x008F; // <control>
		case 0x90: return 0x0090; // <control>
		case 0x91: return 0x2018; // LEFT SINGLE QUOTATION MARK
		case 0x92: return 0x2019; // RIGHT SINGLE QUOTATION MARK
		case 0x93: return 0x201C; // LEFT DOUBLE QUOTATION MARK
		case 0x94: return 0x201D; // RIGHT DOUBLE QUOTATION MARK
		case 0x95: return 0x2022; // BULLET
		case 0x96: return 0x2013; // EN DASH
		case 0x97: return 0x2014; // EM DASH
		case 0x98: return 0x02DC; // SMALL TILDE
		case 0x99: return 0x2122; // TRADE MARK SIGN
		case 0x9A: return 0x0161; // LATIN SMALL LETTER S WITH CARON
		case 0x9B: return 0x203A; // SINGLE RIGHT-POINTING ANGLE QUOTATION MARK
		case 0x9C: return 0x0153; // LATIN SMALL LIGATURE OE
		case 0x9D: return 0x009D; // <control>
		case 0x9E: return 0x017E; // LATIN SMALL LETTER Z WITH CARON
		case 0x9F: return 0x0178; // LATIN CAPITAL LETTER Y WITH DIAERESIS
		default:
			if ((c >= 0xD800 && c <= 0xDFFF) || c >= 0x10FFFF) { /// @todo. The spec says > 0x10FFFF, not >=. Section 8.2.4.69.
				return 0xFFFD;
			} else if ((c >= 0x0001 && c <= 0x0008) || (c >= 0x000E && c <= 0x001F) ||
				(c >= 0x007F && c <= 0x009F) || (c >= 0xFDD0 && c <= 0xFDEF) ||
				c == 0x000B || c == 0xFFFE || c == 0x1FFFE || c == 0x2FFFFE ||
				c == 0x2FFFF || c == 0x3FFFE || c == 0x3FFFF || c == 0x4FFFE ||
				c == 0x4FFFF || c == 0x5FFFE || c == 0x5FFFF || c == 0x6FFFE ||
				c == 0x6FFFF || c == 0x7FFFE || c == 0x7FFFF || c == 0x8FFFE ||
				c == 0x8FFFF || c == 0x9FFFE || c == 0x9FFFF || c == 0xAFFFE ||
				c == 0xAFFFF || c == 0xBFFFE || c == 0xBFFFF || c == 0xCFFFE ||
				c == 0xCFFFF || c == 0xDFFFE || c == 0xDFFFF || c == 0xEFFFE ||
				c == 0xEFFFF || c == 0xFFFFE || c == 0xFFFFF || c == 0x10FFFE ||
				c == 0x10FFFF) {
				return c;
			}
	}
};

exports.EntityParser = EntityParser;

},{"./InputStream":3,"html5-entities":12}],3:[function(req,module,exports){
// FIXME convert CR to LF http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#input-stream
function InputStream() {
	this.data = '';
	this.start = 0;
	this.committed = 0;
	this.eof = false;
	this.lastLocation = {line: 0, column: 0};
}

InputStream.EOF = -1;

InputStream.DRAIN = -2;

InputStream.prototype = {
	slice: function() {
		if(this.start >= this.data.length) {
			if(!this.eof) throw InputStream.DRAIN;
			return InputStream.EOF;
		}
		return this.data.slice(this.start, this.data.length);
	},
	char: function() {
		if(!this.eof && this.start >= this.data.length - 1) throw InputStream.DRAIN;
		if(this.start >= this.data.length) {
			return InputStream.EOF;
		}
		return this.data[this.start++];
	},
	advance: function(amount) {
		this.start += amount;
		if(this.start >= this.data.length) {
			if(!this.eof) throw InputStream.DRAIN;
			return InputStream.EOF;
		} else {
			if(this.committed > this.data.length / 2) {
				// Sliiiide
				this.lastLocation = this.location();
				this.data = this.data.slice(this.committed);
				this.start = this.start - this.committed;
				this.committed = 0;
			}
		}
	},
	matchWhile: function(re) {
		if(this.eof && this.start >= this.data.length ) return '';
		var r = new RegExp("^"+re+"+");
		var m = r.exec(this.slice());
		if(m) {
			if(!this.eof && m[0].length == this.data.length - this.start) throw InputStream.DRAIN;
			this.advance(m[0].length);
			return m[0];
		} else {
			return '';
		}
	},
	matchUntil: function(re) {
		var m, s;
		s = this.slice();
		if(s === InputStream.EOF) {
			return '';
		} else if(m = new RegExp(re + (this.eof ? "|$" : "")).exec(s)) {
			var t = this.data.slice(this.start, this.start + m.index);
			this.advance(m.index);
			return t.toString();
		} else {
			throw InputStream.DRAIN;
		}
	},
	append: function(data) {
		this.data += data;
	},
	shift: function(n) {
		if(!this.eof && this.start + n >= this.data.length) throw InputStream.DRAIN;
		if(this.eof && this.start >= this.data.length) return InputStream.EOF;
		var d = this.data.slice(this.start, this.start + n).toString();
		this.advance(Math.min(n, this.data.length - this.start));
		return d;
	},
	peek: function(n) {
		if(!this.eof && this.start + n >= this.data.length) throw InputStream.DRAIN;
		if(this.eof && this.start >= this.data.length) return InputStream.EOF;
		return this.data.slice(this.start, Math.min(this.start + n, this.data.length)).toString();
	},
	length: function() {
		return this.data.length - this.start - 1;
	},
	unget: function(d) {
		if(d === InputStream.EOF) return;
		this.start -= (d.length);
	},
	undo: function() {
		this.start = this.committed;
	},
	commit: function() {
		this.committed = this.start;
	},
	location: function() {
		var lastLine = this.lastLocation.line;
		var lastColumn = this.lastLocation.column;
		var read = this.data.slice(0, this.committed);
		var newlines = read.match(/\n/g);
		var line = newlines ? lastLine + newlines.length : lastLine;
		var column = newlines ? read.length - read.lastIndexOf('\n') - 1 : lastColumn + read.length;
		return {line: line, column: column};
	}
};

exports.InputStream = InputStream;

},{}],4:[function(req,module,exports){
var SpecialElements = {
	"http://www.w3.org/1999/xhtml": [
		'address',
		'applet',
		'area',
		'article',
		'aside',
		'base',
		'basefont',
		'bgsound',
		'blockquote',
		'body',
		'br',
		'button',
		'caption',
		'center',
		'col',
		'colgroup',
		'dd',
		'details',
		'dir',
		'div',
		'dl',
		'dt',
		'embed',
		'fieldset',
		'figcaption',
		'figure',
		'footer',
		'form',
		'frame',
		'frameset',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'head',
		'header',
		'hgroup',
		'hr',
		'html',
		'iframe',
		'img',
		'input',
		'isindex',
		'li',
		'link',
		'listing',
		'main',
		'marquee',
		'menu',
		'menuitem',
		'meta',
		'nav',
		'noembed',
		'noframes',
		'noscript',
		'object',
		'ol',
		'p',
		'param',
		'plaintext',
		'pre',
		'script',
		'section',
		'select',
		'source',
		'style',
		'summary',
		'table',
		'tbody',
		'td',
		'textarea',
		'tfoot',
		'th',
		'thead',
		'title',
		'tr',
		'track',
		'ul',
		'wbr',
		'xmp'
	],
	"http://www.w3.org/1998/Math/MathML": [
		'mi',
		'mo',
		'mn',
		'ms',
		'mtext',
		'annotation-xml'
	],
	"http://www.w3.org/2000/svg": [
		'foreignObject',
		'desc',
		'title'
	]
};


function StackItem(namespaceURI, localName, attributes, node) {
	this.localName = localName;
	this.namespaceURI = namespaceURI;
	this.attributes = attributes;
	this.node = node;
}

// http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#special
StackItem.prototype.isSpecial = function() {
	return this.namespaceURI in SpecialElements &&
		SpecialElements[this.namespaceURI].indexOf(this.localName) > -1;
};

StackItem.prototype.isFosterParenting = function() {
	if (this.namespaceURI === "http://www.w3.org/1999/xhtml") {
		return this.localName === 'table' ||
			this.localName === 'tbody' ||
			this.localName === 'tfoot' ||
			this.localName === 'thead' ||
			this.localName === 'tr';
	}
	return false;
};

StackItem.prototype.isNumberedHeader = function() {
	if (this.namespaceURI === "http://www.w3.org/1999/xhtml") {
		return this.localName === 'h1' ||
			this.localName === 'h2' ||
			this.localName === 'h3' ||
			this.localName === 'h4' ||
			this.localName === 'h5' ||
			this.localName === 'h6';
	}
	return false;
};

StackItem.prototype.isForeign = function() {
	return this.namespaceURI != "http://www.w3.org/1999/xhtml";
};

function getAttribute(item, name) {
	for (var i = 0; i < item.attributes.length; i++) {
		if (item.attributes[i].nodeName == name)
			return item.attributes[i].nodeValue;
	}
	return null;
}

StackItem.prototype.isHtmlIntegrationPoint = function() {
	if (this.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
		if (this.localName !== "annotation-xml")
			return false;
		var encoding = getAttribute(this, 'encoding');
		if (!encoding)
			return false;
		encoding = encoding.toLowerCase();
		return encoding === "text/html" || encoding === "application/xhtml+xml";
	}
	if (this.namespaceURI === "http://www.w3.org/2000/svg") {
		return this.localName === "foreignObject"
			|| this.localName === "desc"
			|| this.localName === "title";
	}
	return false;
};

StackItem.prototype.isMathMLTextIntegrationPoint = function() {
	if (this.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
		return this.localName === "mi"
			|| this.localName === "mo"
			|| this.localName === "mn"
			|| this.localName === "ms"
			|| this.localName === "mtext";
	}
	return false;
};

exports.StackItem = StackItem;

},{}],5:[function(req,module,exports){
var InputStream = req('./InputStream').InputStream;
var EntityParser = req('./EntityParser').EntityParser;

function isWhitespace(c){
	return c === " " || c === "\n" || c === "\t" || c === "\r" || c === "\f";
}

function isAlpha(c) {
	return (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z');
}

/**
 *
 * @param {Object} tokenHandler
 * @constructor
 */
function Tokenizer(tokenHandler) {
	this._tokenHandler = tokenHandler;
	this._state = Tokenizer.DATA;
	this._inputStream = new InputStream();
	this._currentToken = null;
	this._temporaryBuffer = '';
	this._additionalAllowedCharacter = '';
}

Tokenizer.prototype._parseError = function(code, args) {
	this._tokenHandler.parseError(code, args);
};

Tokenizer.prototype._emitToken = function(token) {
	if (token.type === 'StartTag') {
		for (var i = 1; i < token.data.length; i++) {
			if (!token.data[i].nodeName)
				token.data.splice(i--, 1);
		}
	} else if (token.type === 'EndTag') {
		if (token.selfClosing) {
			this._parseError('self-closing-flag-on-end-tag');
		}
		if (token.data.length !== 0) {
			this._parseError('attributes-in-end-tag');
		}
	}
	this._tokenHandler.processToken(token);
	if (token.type === 'StartTag' && token.selfClosing && !this._tokenHandler.isSelfClosingFlagAcknowledged()) {
		this._parseError('non-void-element-with-trailing-solidus', {name: token.name});
	}
};

Tokenizer.prototype._emitCurrentToken = function() {
	this._state = Tokenizer.DATA;
	this._emitToken(this._currentToken);
};

Tokenizer.prototype._currentAttribute = function() {
	return this._currentToken.data[this._currentToken.data.length - 1];
};

Tokenizer.prototype.setState = function(state) {
	this._state = state;
};

Tokenizer.prototype.tokenize = function(source) {
	// FIXME proper tokenizer states
	Tokenizer.DATA = data_state;
	Tokenizer.RCDATA = rcdata_state;
	Tokenizer.RAWTEXT = rawtext_state;
	Tokenizer.SCRIPT_DATA = script_data_state;
	Tokenizer.PLAINTEXT = plaintext_state;


	this._state = Tokenizer.DATA;

	this._inputStream.append(source);

	this._tokenHandler.startTokenization(this);

	this._inputStream.eof = true;

	var tokenizer = this;

	while (this._state.call(this, this._inputStream));


	function data_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._emitToken({type: 'EOF', data: null});
			return false;
		} else if (data === '&') {
			tokenizer.setState(character_reference_in_data_state);
		} else if (data === '<') {
			tokenizer.setState(tag_open_state);
		} else if (data === '\u0000') {
			tokenizer._emitToken({type: 'Characters', data: data});
			buffer.commit();
		} else {
			var chars = buffer.matchUntil("&|<|\u0000");
			tokenizer._emitToken({type: 'Characters', data: data + chars});
			buffer.commit();
		}
		return true;
	}

	function character_reference_in_data_state(buffer) {
		var character = EntityParser.consumeEntity(buffer, tokenizer);
		tokenizer.setState(data_state);
		tokenizer._emitToken({type: 'Characters', data: character || '&'});
		return true;
	}

	function rcdata_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._emitToken({type: 'EOF', data: null});
			return false;
		} else if (data === '&') {
			tokenizer.setState(character_reference_in_rcdata_state);
		} else if (data === '<') {
			tokenizer.setState(rcdata_less_than_sign_state);
		} else if (data === "\u0000") {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._emitToken({type: 'Characters', data: '\uFFFD'});
			buffer.commit();
		} else {
			var chars = buffer.matchUntil("&|<|\u0000");
			tokenizer._emitToken({type: 'Characters', data: data + chars});
			buffer.commit();
		}
		return true;
	}

	function character_reference_in_rcdata_state(buffer) {
		var character = EntityParser.consumeEntity(buffer, tokenizer);
		tokenizer.setState(rcdata_state);
		tokenizer._emitToken({type: 'Characters', data: character || '&'});
		return true;
	}

	function rawtext_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._emitToken({type: 'EOF', data: null});
			return false;
		} else if (data === '<') {
			tokenizer.setState(rawtext_less_than_sign_state);
		} else if (data === "\u0000") {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._emitToken({type: 'Characters', data: '\uFFFD'});
			buffer.commit();
		} else {
			var chars = buffer.matchUntil("<|\u0000");
			tokenizer._emitToken({type: 'Characters', data: data + chars});
		}
		return true;
	}

	function plaintext_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._emitToken({type: 'EOF', data: null});
			return false;
		} else if (data === "\u0000") {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._emitToken({type: 'Characters', data: '\uFFFD'});
			buffer.commit();
		} else {
			var chars = buffer.matchUntil("\u0000");
			tokenizer._emitToken({type: 'Characters', data: data + chars});
		}
		return true;
	}


	function script_data_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._emitToken({type: 'EOF', data: null});
			return false;
		} else if (data === '<') {
			tokenizer.setState(script_data_less_than_sign_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._emitToken({type: 'Characters', data: '\uFFFD'});
			buffer.commit();
		} else {
			var chars = buffer.matchUntil("<|\u0000");
			tokenizer._emitToken({type: 'Characters', data: data + chars});
		}
		return true;
	}

	function rcdata_less_than_sign_state(buffer) {
		var data = buffer.char();
		if (data === "/") {
			this._temporaryBuffer = '';
			tokenizer.setState(rcdata_end_tag_open_state);
		} else {
			tokenizer._emitToken({type: 'Characters', data: '<'});
			buffer.unget(data);
			tokenizer.setState(rcdata_state);
		}
		return true;
	}

	function rcdata_end_tag_open_state(buffer) {
		var data = buffer.char();
		if (isAlpha(data)) {
			this._temporaryBuffer += data;
			tokenizer.setState(rcdata_end_tag_name_state);
		} else {
			tokenizer._emitToken({type: 'Characters', data: '</'});
			buffer.unget(data);
			tokenizer.setState(rcdata_state);
		}
		return true;
	}

	function rcdata_end_tag_name_state(buffer) {
		var appropriate = tokenizer._currentToken && (tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase());
		var data = buffer.char();
		if (isWhitespace(data) && appropriate) {
			tokenizer._currentToken = {type: 'EndTag', name: this._temporaryBuffer, data: [], selfClosing: false};
			tokenizer.setState(before_attribute_name_state);
		} else if (data === '/' && appropriate) {
			tokenizer._currentToken = {type: 'EndTag', name: this._temporaryBuffer, data: [], selfClosing: false};
			tokenizer.setState(self_closing_tag_state);
		} else if (data === '>' && appropriate) {
			tokenizer._currentToken = {type: 'EndTag', name: this._temporaryBuffer, data: [], selfClosing: false};
			tokenizer._emitCurrentToken();
			tokenizer.setState(data_state);
		} else if (isAlpha(data)) {
			this._temporaryBuffer += data;
			buffer.commit();
		} else {
			tokenizer._emitToken({type: 'Characters', data: '</' + this._temporaryBuffer});
			buffer.unget(data);
			tokenizer.setState(rcdata_state);
		}
		return true;
	}

	function rawtext_less_than_sign_state(buffer) {
		var data = buffer.char();
		if (data === "/") {
			this._temporaryBuffer = '';
			tokenizer.setState(rawtext_end_tag_open_state);
		} else {
			tokenizer._emitToken({type: 'Characters', data: '<'});
			buffer.unget(data);
			tokenizer.setState(rawtext_state);
		}
		return true;
	}

	function rawtext_end_tag_open_state(buffer) {
		var data = buffer.char();
		if (isAlpha(data)) {
			this._temporaryBuffer += data;
			tokenizer.setState(rawtext_end_tag_name_state);
		} else {
			tokenizer._emitToken({type: 'Characters', data: '</'});
			buffer.unget(data);
			tokenizer.setState(rawtext_state);
		}
		return true;
	}

	function rawtext_end_tag_name_state(buffer) {
		var appropriate = tokenizer._currentToken && (tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase());
		var data = buffer.char();
		if (isWhitespace(data) && appropriate) {
			tokenizer._currentToken = {type: 'EndTag', name: this._temporaryBuffer, data: [], selfClosing: false};
			tokenizer.setState(before_attribute_name_state);
		} else if (data === '/' && appropriate) {
			tokenizer._currentToken = {type: 'EndTag', name: this._temporaryBuffer, data: [], selfClosing: false};
			tokenizer.setState(self_closing_tag_state);
		} else if (data === '>' && appropriate) {
			tokenizer._currentToken = {type: 'EndTag', name: this._temporaryBuffer, data: [], selfClosing: false};
			tokenizer._emitCurrentToken();
			tokenizer.setState(data_state);
		} else if (isAlpha(data)) {
			this._temporaryBuffer += data;
			buffer.commit();
		} else {
			tokenizer._emitToken({type: 'Characters', data: '</' + this._temporaryBuffer});
			buffer.unget(data);
			tokenizer.setState(rawtext_state);
		}
		return true;
	}

	function script_data_less_than_sign_state(buffer) {
		var data = buffer.char();
		if (data === "/") {
			this._temporaryBuffer = '';
			tokenizer.setState(script_data_end_tag_open_state);
		} else if (data === '!') {
			tokenizer._emitToken({type: 'Characters', data: '<!'});
			tokenizer.setState(script_data_escape_start_state);
		} else {
			tokenizer._emitToken({type: 'Characters', data: '<'});
			buffer.unget(data);
			tokenizer.setState(script_data_state);
		}
		return true;
	}

	function script_data_end_tag_open_state(buffer) {
		var data = buffer.char();
		if (isAlpha(data)) {
			this._temporaryBuffer += data;
			tokenizer.setState(script_data_end_tag_name_state);
		} else {
			tokenizer._emitToken({type: 'Characters', data: '</'});
			buffer.unget(data);
			tokenizer.setState(script_data_state);
		}
		return true;
	}

	function script_data_end_tag_name_state(buffer) {
		var appropriate = tokenizer._currentToken && (tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase());
		var data = buffer.char();
		if (isWhitespace(data) && appropriate) {
			tokenizer._currentToken = {type: 'EndTag', name: 'script', data: [], selfClosing: false};
			tokenizer.setState(before_attribute_name_state);
		} else if (data === '/' && appropriate) {
			tokenizer._currentToken = {type: 'EndTag', name: 'script', data: [], selfClosing: false};
			tokenizer.setState(self_closing_tag_state);
		} else if (data === '>' && appropriate) {
			tokenizer._currentToken = {type: 'EndTag', name: 'script', data: [], selfClosing: false};
			tokenizer._emitCurrentToken();
		} else if (isAlpha(data)) {
			this._temporaryBuffer += data;
			buffer.commit();
		} else {
			tokenizer._emitToken({type: 'Characters', data: '</' + this._temporaryBuffer});
			buffer.unget(data);
			tokenizer.setState(script_data_state);
		}
		return true;
	}

	function script_data_escape_start_state(buffer) {
		var data = buffer.char();
		if (data === '-') {
			tokenizer._emitToken({type: 'Characters', data: '-'});
			tokenizer.setState(script_data_escape_start_dash_state);
		} else {
			buffer.unget(data);
			tokenizer.setState(script_data_state);
		}
		return true;
	}

	function script_data_escape_start_dash_state(buffer) {
		var data = buffer.char();
		if (data === '-') {
			tokenizer._emitToken({type: 'Characters', data: '-'});
			tokenizer.setState(script_data_escaped_dash_dash_state);
		} else {
			buffer.unget(data);
			tokenizer.setState(script_data_state);
		}
		return true;
	}

	function script_data_escaped_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '-') {
			tokenizer._emitToken({type: 'Characters', data: '-'});
			tokenizer.setState(script_data_escaped_dash_state);
		} else if (data === '<') {
			tokenizer.setState(script_data_escaped_less_then_sign_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._emitToken({type: 'Characters', data: '\uFFFD'});
			buffer.commit();
		} else {
			var chars = buffer.matchUntil('<|-|\u0000');
			tokenizer._emitToken({type: 'Characters', data: data + chars});
		}
		return true;
	}

	function script_data_escaped_dash_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '-') {
			tokenizer._emitToken({type: 'Characters', data: '-'});
			tokenizer.setState(script_data_escaped_dash_dash_state);
		} else if (data === '<') {
			tokenizer.setState(script_data_escaped_less_then_sign_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._emitToken({type: 'Characters', data: '\uFFFD'});
			tokenizer.setState(script_data_escaped_state);
		} else {
			tokenizer._emitToken({type: 'Characters', data: data});
			tokenizer.setState(script_data_escaped_state);
		}
		return true;
	}

	function script_data_escaped_dash_dash_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError('eof-in-script');
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '<') {
			tokenizer.setState(script_data_escaped_less_then_sign_state);
		} else if (data === '>') {
			tokenizer._emitToken({type: 'Characters', data: '>'});
			tokenizer.setState(script_data_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._emitToken({type: 'Characters', data: '\uFFFD'});
			tokenizer.setState(script_data_escaped_state);
		} else {
			tokenizer._emitToken({type: 'Characters', data: data});
			tokenizer.setState(script_data_escaped_state);
		}
		return true;
	}

	function script_data_escaped_less_then_sign_state(buffer) {
		var data = buffer.char();
		if (data === '/') {
			this._temporaryBuffer = '';
			tokenizer.setState(script_data_escaped_end_tag_open_state);
		} else if (isAlpha(data)) {
			tokenizer._emitToken({type: 'Characters', data: '<' + data});
			this._temporaryBuffer = data;
			tokenizer.setState(script_data_double_escape_start_state);
		} else {
			tokenizer._emitToken({type: 'Characters', data: '<'});
			buffer.unget(data);
			tokenizer.setState(script_data_escaped_state);
		}
		return true;
	}

	function script_data_escaped_end_tag_open_state(buffer) {
		var data = buffer.char();
		if (isAlpha(data)) {
			this._temporaryBuffer = data;
			tokenizer.setState(script_data_escaped_end_tag_name_state);
		} else {
			tokenizer._emitToken({type: 'Characters', data: '</'});
			buffer.unget(data);
			tokenizer.setState(script_data_escaped_state);
		}
		return true;
	}

	function script_data_escaped_end_tag_name_state(buffer) {
		var appropriate = tokenizer._currentToken && (tokenizer._currentToken.name === this._temporaryBuffer.toLowerCase());
		var data = buffer.char();
		if (isWhitespace(data) && appropriate) {
			tokenizer._currentToken = {type: 'EndTag', name: 'script', data: [], selfClosing: false};
			tokenizer.setState(before_attribute_name_state);
		} else if (data === '/' && appropriate) {
			tokenizer._currentToken = {type: 'EndTag', name: 'script', data: [], selfClosing: false};
			tokenizer.setState(self_closing_tag_state);
		} else if (data === '>' &&  appropriate) {
			tokenizer._currentToken = {type: 'EndTag', name: 'script', data: [], selfClosing: false};
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else if (isAlpha(data)) {
			this._temporaryBuffer += data;
			buffer.commit();
		} else {
			tokenizer._emitToken({type: 'Characters', data: '</' + this._temporaryBuffer});
			buffer.unget(data);
			tokenizer.setState(script_data_escaped_state);
		}
		return true;
	}

	function script_data_double_escape_start_state(buffer) {
		var data = buffer.char();
		if (isWhitespace(data) || data === '/' || data === '>') {
			tokenizer._emitToken({type: 'Characters', data: data});
			if (this._temporaryBuffer.toLowerCase() === 'script')
				tokenizer.setState(script_data_double_escaped_state);
			else
				tokenizer.setState(script_data_escaped_state);
		} else if (isAlpha(data)) {
			tokenizer._emitToken({type: 'Characters', data: data});
			this._temporaryBuffer += data;
			buffer.commit();
		} else {
			buffer.unget(data);
			tokenizer.setState(script_data_escaped_state);
		}
		return true;
	}

	function script_data_double_escaped_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError('eof-in-script');
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '-') {
			tokenizer._emitToken({type: 'Characters', data: '-'});
			tokenizer.setState(script_data_double_escaped_dash_state);
		} else if (data === '<') {
			tokenizer._emitToken({type: 'Characters', data: '<'});
			tokenizer.setState(script_data_double_escaped_less_than_sign_state);
		} else if (data === '\u0000') {
			tokenizer._parseError('invalid-codepoint');
			tokenizer._emitToken({type: 'Characters', data: '\uFFFD'});
			buffer.commit();
		} else {
			tokenizer._emitToken({type: 'Characters', data: data});
			buffer.commit();
		}
		return true;
	}

	function script_data_double_escaped_dash_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError('eof-in-script');
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '-') {
			tokenizer._emitToken({type: 'Characters', data: '-'});
			tokenizer.setState(script_data_double_escaped_dash_dash_state);
		} else if (data === '<') {
			tokenizer._emitToken({type: 'Characters', data: '<'});
			tokenizer.setState(script_data_double_escaped_less_than_sign_state);
		} else if (data === '\u0000') {
			tokenizer._parseError('invalid-codepoint');
			tokenizer._emitToken({type: 'Characters', data: '\uFFFD'});
			tokenizer.setState(script_data_double_escaped_state);
		} else {
			tokenizer._emitToken({type: 'Characters', data: data});
			tokenizer.setState(script_data_double_escaped_state);
		}
		return true;
	}

	function script_data_double_escaped_dash_dash_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError('eof-in-script');
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '-') {
			tokenizer._emitToken({type: 'Characters', data: '-'});
			buffer.commit();
		} else if (data === '<') {
			tokenizer._emitToken({type: 'Characters', data: '<'});
			tokenizer.setState(script_data_double_escaped_less_than_sign_state);
		} else if (data === '>') {
			tokenizer._emitToken({type: 'Characters', data: '>'});
			tokenizer.setState(script_data_state);
		} else if (data === '\u0000') {
			tokenizer._parseError('invalid-codepoint');
			tokenizer._emitToken({type: 'Characters', data: '\uFFFD'});
			tokenizer.setState(script_data_double_escaped_state);
		} else {
			tokenizer._emitToken({type: 'Characters', data: data});
			tokenizer.setState(script_data_double_escaped_state);
		}
		return true;
	}

	function script_data_double_escaped_less_than_sign_state(buffer) {
		var data = buffer.char();
		if (data === '/') {
			tokenizer._emitToken({type: 'Characters', data: '/'});
			this._temporaryBuffer = '';
			tokenizer.setState(script_data_double_escape_end_state);
		} else {
			buffer.unget(data);
			tokenizer.setState(script_data_double_escaped_state);
		}
		return true;
	}

	function script_data_double_escape_end_state(buffer) {
		var data = buffer.char();
		if (isWhitespace(data) || data === '/' || data === '>') {
			tokenizer._emitToken({type: 'Characters', data: data});
			if (this._temporaryBuffer.toLowerCase() === 'script')
				tokenizer.setState(script_data_escaped_state);
			else
				tokenizer.setState(script_data_double_escaped_state);
		} else if (isAlpha(data)) {
			tokenizer._emitToken({type: 'Characters', data: data});
			this._temporaryBuffer += data;
			buffer.commit();
		} else {
			buffer.unget(data);
			tokenizer.setState(script_data_double_escaped_state);
		}
		return true;
	}

	function tag_open_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("bare-less-than-sign-at-eof");
			tokenizer._emitToken({type: 'Characters', data: '<'});
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isAlpha(data)) {
			tokenizer._currentToken = {type: 'StartTag', name: data.toLowerCase(), data: []};
			tokenizer.setState(tag_name_state);
		} else if (data === '!') {
			tokenizer.setState(markup_declaration_open_state);
		} else if (data === '/') {
			tokenizer.setState(close_tag_open_state);
		} else if (data === '>') {
			// XXX In theory it could be something besides a tag name. But
			// do we really care?
			tokenizer._parseError("expected-tag-name-but-got-right-bracket");
			tokenizer._emitToken({type: 'Characters', data: "<>"});
			tokenizer.setState(data_state);
		} else if (data === '?') {
			// XXX In theory it could be something besides a tag name. But
			// do we really care?
			tokenizer._parseError("expected-tag-name-but-got-question-mark");
			buffer.unget(data);
			tokenizer.setState(bogus_comment_state);
		} else {
			// XXX
			tokenizer._parseError("expected-tag-name");
			tokenizer._emitToken({type: 'Characters', data: "<"});
			buffer.unget(data);
			tokenizer.setState(data_state);
		}
		return true;
	}

	function close_tag_open_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("expected-closing-tag-but-got-eof");
			tokenizer._emitToken({type: 'Characters', data: '</'});
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isAlpha(data)) {
			tokenizer._currentToken = {type: 'EndTag', name: data.toLowerCase(), data: []};
			tokenizer.setState(tag_name_state);
		} else if (data === '>') {
			tokenizer._parseError("expected-closing-tag-but-got-right-bracket");
			tokenizer.setState(data_state);
		} else {
			tokenizer._parseError("expected-closing-tag-but-got-char", {data: data}); // param 1 is datavars:
			buffer.unget(data);
			tokenizer.setState(bogus_comment_state);
		}
		return true;
	}

	function tag_name_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError('eof-in-tag-name');
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isWhitespace(data)) {
			tokenizer.setState(before_attribute_name_state);
		} else if (isAlpha(data)) {
			tokenizer._currentToken.name += data.toLowerCase();
		} else if (data === '>') {
			tokenizer._emitCurrentToken();
		} else if (data === '/') {
			tokenizer.setState(self_closing_tag_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentToken.name += "\uFFFD";
		} else {
			tokenizer._currentToken.name += data;
		}
		buffer.commit();

		return true;
	}

	function before_attribute_name_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("expected-attribute-name-but-got-eof");
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isWhitespace(data)) {
			return true;
		} else if (isAlpha(data)) {
			tokenizer._currentToken.data.push({nodeName: data.toLowerCase(), nodeValue: ""});
			tokenizer.setState(attribute_name_state);
		} else if (data === '>') {
			tokenizer._emitCurrentToken();
		} else if (data === '/') {
			tokenizer.setState(self_closing_tag_state);
		} else if (data === "'" || data === '"' || data === '=' || data === '<') {
			tokenizer._parseError("invalid-character-in-attribute-name");
			tokenizer._currentToken.data.push({nodeName: data, nodeValue: ""});
			tokenizer.setState(attribute_name_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentToken.data.push({nodeName: "\uFFFD", nodeValue: ""});
		} else {
			tokenizer._currentToken.data.push({nodeName: data, nodeValue: ""});
			tokenizer.setState(attribute_name_state);
		}
		return true;
	}

	function attribute_name_state(buffer) {
		var data = buffer.char();
		var leavingThisState = true;
		var shouldEmit = false;
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-attribute-name");
			buffer.unget(data);
			tokenizer.setState(data_state);
			shouldEmit = true;
		} else if (data === '=') {
			tokenizer.setState(before_attribute_value_state);
		} else if (isAlpha(data)) {
			tokenizer._currentAttribute().nodeName += data.toLowerCase();
			leavingThisState = false;
		} else if (data === '>') {
			// XXX If we emit here the attributes are converted to a dict
			// without being checked and when the code below runs we error
			// because data is a dict not a list
			shouldEmit = true;
		} else if (isWhitespace(data)) {
			tokenizer.setState(after_attribute_name_state);
		} else if (data === '/') {
			tokenizer.setState(self_closing_tag_state);
		} else if (data === "'" || data === '"') {
			tokenizer._parseError("invalid-character-in-attribute-name");
			tokenizer._currentAttribute().nodeName += data;
			leavingThisState = false;
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentAttribute().nodeName += "\uFFFD";
		} else {
			tokenizer._currentAttribute().nodeName += data;
			leavingThisState = false;
		}

		if (leavingThisState) {
			// Attributes are not dropped at this stage. That happens when the
			// start tag token is emitted so values can still be safely appended
			// to attributes, but we do want to report the parse error in time.
			var attributes = tokenizer._currentToken.data;
			var currentAttribute = attributes[attributes.length - 1];
			for (var i = attributes.length - 2; i >= 0; i--) {
				if (currentAttribute.nodeName === attributes[i].nodeName) {
					tokenizer._parseError("duplicate-attribute", {name: currentAttribute.nodeName});
					currentAttribute.nodeName = null;
					break;
				}
			}
			if (shouldEmit)
				tokenizer._emitCurrentToken();
		} else {
			buffer.commit();
		}
		return true;
	}

	function after_attribute_name_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("expected-end-of-tag-but-got-eof");
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isWhitespace(data)) {
			return true;
		} else if (data === '=') {
			tokenizer.setState(before_attribute_value_state);
		} else if (data === '>') {
			tokenizer._emitCurrentToken();
		} else if (isAlpha(data)) {
			tokenizer._currentToken.data.push({nodeName: data, nodeValue: ""});
			tokenizer.setState(attribute_name_state);
		} else if (data === '/') {
			tokenizer.setState(self_closing_tag_state);
		} else if (data === "'" || data === '"' || data === '<') {
			tokenizer._parseError("invalid-character-after-attribute-name");
			tokenizer._currentToken.data.push({nodeName: data, nodeValue: ""});
			tokenizer.setState(attribute_name_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentToken.data.push({nodeName: "\uFFFD", nodeValue: ""});
		} else {
			tokenizer._currentToken.data.push({nodeName: data, nodeValue: ""});
			tokenizer.setState(attribute_name_state);
		}
		return true;
	}

	function before_attribute_value_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("expected-attribute-value-but-got-eof");
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isWhitespace(data)) {
			return true;
		} else if (data === '"') {
			tokenizer.setState(attribute_value_double_quoted_state);
		} else if (data === '&') {
			tokenizer.setState(attribute_value_unquoted_state);
			buffer.unget(data);
		} else if (data === "'") {
			tokenizer.setState(attribute_value_single_quoted_state);
		} else if (data === '>') {
			tokenizer._parseError("expected-attribute-value-but-got-right-bracket");
			tokenizer._emitCurrentToken();
		} else if (data === '=' || data === '<' || data === '`') {
			tokenizer._parseError("unexpected-character-in-unquoted-attribute-value");
			tokenizer._currentAttribute().nodeValue += data;
			tokenizer.setState(attribute_value_unquoted_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentAttribute().nodeValue += "\uFFFD";
		} else {
			tokenizer._currentAttribute().nodeValue += data;
			tokenizer.setState(attribute_value_unquoted_state);
		}

		return true;
	}

	function attribute_value_double_quoted_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-attribute-value-double-quote");
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '"') {
			tokenizer.setState(after_attribute_value_state);
		} else if (data === '&') {
			this._additionalAllowedCharacter = '"';
			tokenizer.setState(character_reference_in_attribute_value_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentAttribute().nodeValue += "\uFFFD";
		} else {
			var s = buffer.matchUntil('[\0"&]');
			data = data + s;
			tokenizer._currentAttribute().nodeValue += data;
		}
		return true;
	}

	function attribute_value_single_quoted_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-attribute-value-single-quote");
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === "'") {
			tokenizer.setState(after_attribute_value_state);
		} else if (data === '&') {
			this._additionalAllowedCharacter = "'";
			tokenizer.setState(character_reference_in_attribute_value_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentAttribute().nodeValue += "\uFFFD";
		} else {
			tokenizer._currentAttribute().nodeValue += data + buffer.matchUntil("\u0000|['&]");
		}
		return true;
	}

	function attribute_value_unquoted_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-after-attribute-value");
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isWhitespace(data)) {
			tokenizer.setState(before_attribute_name_state);
		} else if (data === '&') {
			this._additionalAllowedCharacter = ">";
			tokenizer.setState(character_reference_in_attribute_value_state);
		} else if (data === '>') {
			tokenizer._emitCurrentToken();
		} else if (data === '"' || data === "'" || data === '=' || data === '`' || data === '<') {
			tokenizer._parseError("unexpected-character-in-unquoted-attribute-value");
			tokenizer._currentAttribute().nodeValue += data;
			buffer.commit();
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentAttribute().nodeValue += "\uFFFD";
		} else {
			var o = buffer.matchUntil("\u0000|["+ "\t\n\v\f\x20\r" + "&<>\"'=`" +"]");
			if (o === InputStream.EOF) {
				tokenizer._parseError("eof-in-attribute-value-no-quotes");
				tokenizer._emitCurrentToken();
			}
			// Commit here since this state is re-enterable and its outcome won't change with more data.
			buffer.commit();
			tokenizer._currentAttribute().nodeValue += data + o;
		}
		return true;
	}

	function character_reference_in_attribute_value_state(buffer) {
		var character = EntityParser.consumeEntity(buffer, tokenizer, this._additionalAllowedCharacter);
		this._currentAttribute().nodeValue += character || '&';
		// We're supposed to switch back to the attribute value state that
		// we were in when we were switched into this state. Rather than
		// keeping track of this explictly, we observe that the previous
		// state can be determined by additionalAllowedCharacter.
		if (this._additionalAllowedCharacter === '"')
			tokenizer.setState(attribute_value_double_quoted_state);
		else if (this._additionalAllowedCharacter === '\'')
			tokenizer.setState(attribute_value_single_quoted_state);
		else if (this._additionalAllowedCharacter === '>')
			tokenizer.setState(attribute_value_unquoted_state);
		return true;
	}

	function after_attribute_value_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-after-attribute-value");
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isWhitespace(data)) {
			tokenizer.setState(before_attribute_name_state);
		} else if (data === '>') {
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else if (data === '/') {
			tokenizer.setState(self_closing_tag_state);
		} else {
			tokenizer._parseError("unexpected-character-after-attribute-value");
			buffer.unget(data);
			tokenizer.setState(before_attribute_name_state);
		}
		return true;
	}

	function self_closing_tag_state(buffer) {
		var c = buffer.char();
		if (c === InputStream.EOF) {
			tokenizer._parseError("unexpected-eof-after-solidus-in-tag");
			buffer.unget(c);
			tokenizer.setState(data_state);
		} else if (c === '>') {
			tokenizer._currentToken.selfClosing = true;
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else {
			tokenizer._parseError("unexpected-character-after-solidus-in-tag");
			buffer.unget(c);
			tokenizer.setState(before_attribute_name_state);
		}
		return true;
	}

	function bogus_comment_state(buffer) {
		var data = buffer.matchUntil('>');
		data = data.replace(/\u0000/g, "\uFFFD");
		buffer.char();
		tokenizer._emitToken({type: 'Comment', data: data});
		tokenizer.setState(data_state);
		return true;
	}

	function markup_declaration_open_state(buffer) {
		var chars = buffer.shift(2);
		if (chars === '--') {
			tokenizer._currentToken = {type: 'Comment', data: ''};
			tokenizer.setState(comment_start_state);
		} else {
			var newchars = buffer.shift(5);
			if (newchars === InputStream.EOF || chars === InputStream.EOF) {
				tokenizer._parseError("expected-dashes-or-doctype");
				tokenizer.setState(bogus_comment_state);
				buffer.unget(chars);
				return true;
			}

			chars += newchars;
			if (chars.toUpperCase() === 'DOCTYPE') {
				tokenizer._currentToken = {type: 'Doctype', name: '', publicId: null, systemId: null, forceQuirks: false};
				tokenizer.setState(doctype_state);
			} else if (tokenizer._tokenHandler.isCdataSectionAllowed() && chars === '[CDATA[') {
				tokenizer.setState(cdata_section_state);
			} else {
				tokenizer._parseError("expected-dashes-or-doctype");
				buffer.unget(chars);
				tokenizer.setState(bogus_comment_state);
			}
		}
		return true;
	}

	function cdata_section_state(buffer) {
		var data = buffer.matchUntil(']]>');
		// skip ]]>
		buffer.shift(3);
		if (data) {
			tokenizer._emitToken({type: 'Characters', data: data});
		}
		tokenizer.setState(data_state);
		return true;
	}

	function comment_start_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-comment");
			tokenizer._emitToken(tokenizer._currentToken);
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '-') {
			tokenizer.setState(comment_start_dash_state);
		} else if (data === '>') {
			tokenizer._parseError("incorrect-comment");
			tokenizer._emitToken(tokenizer._currentToken);
			tokenizer.setState(data_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentToken.data += "\uFFFD";
		} else {
			tokenizer._currentToken.data += data;
			tokenizer.setState(comment_state);
		}
		return true;
	}

	function comment_start_dash_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-comment");
			tokenizer._emitToken(tokenizer._currentToken);
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '-') {
			tokenizer.setState(comment_end_state);
		} else if (data === '>') {
			tokenizer._parseError("incorrect-comment");
			tokenizer._emitToken(tokenizer._currentToken);
			tokenizer.setState(data_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentToken.data += "\uFFFD";
		} else {
			tokenizer._currentToken.data += '-' + data;
			tokenizer.setState(comment_state);
		}
		return true;
	}

	function comment_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-comment");
			tokenizer._emitToken(tokenizer._currentToken);
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '-') {
			tokenizer.setState(comment_end_dash_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentToken.data += "\uFFFD";
		} else {
			tokenizer._currentToken.data += data;
			buffer.commit();
		}
		return true;
	}

	function comment_end_dash_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-comment-end-dash");
			tokenizer._emitToken(tokenizer._currentToken);
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '-') {
			tokenizer.setState(comment_end_state);
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentToken.data += "-\uFFFD";
			tokenizer.setState(comment_state);
		} else {
			tokenizer._currentToken.data += '-' + data + buffer.matchUntil('\u0000|-');
			// Consume the next character which is either a "-" or an :EOF as
			// well so if there's a "-" directly after the "-" we go nicely to
			// the "comment end state" without emitting a tokenizer._parseError there.
			buffer.char();
		}
		return true;
	}

	function comment_end_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-comment-double-dash");
			tokenizer._emitToken(tokenizer._currentToken);
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '>') {
			tokenizer._emitToken(tokenizer._currentToken);
			tokenizer.setState(data_state);
		} else if (data === '!') {
			tokenizer._parseError("unexpected-bang-after-double-dash-in-comment");
			tokenizer.setState(comment_end_bang_state);
		} else if (data === '-') {
			tokenizer._parseError("unexpected-dash-after-double-dash-in-comment");
			tokenizer._currentToken.data += data;
		} else if (data === '\u0000') {
			tokenizer._parseError("invalid-codepoint");
			tokenizer._currentToken.data += "--\uFFFD";
			tokenizer.setState(comment_state);
		} else {
			// XXX
			tokenizer._parseError("unexpected-char-in-comment");
			tokenizer._currentToken.data += '--' + data;
			tokenizer.setState(comment_state);
		}
		return true;
	}

	function comment_end_bang_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-comment-end-bang-state");
			tokenizer._emitToken(tokenizer._currentToken);
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '>') {
			tokenizer._emitToken(tokenizer._currentToken);
			tokenizer.setState(data_state);
		} else if (data === '-') {
			tokenizer._currentToken.data += '--!';
			tokenizer.setState(comment_end_dash_state);
		} else {
			tokenizer._currentToken.data += '--!' + data;
			tokenizer.setState(comment_state);
		}
		return true;
	}

	function doctype_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("expected-doctype-name-but-got-eof");
			tokenizer._currentToken.forceQuirks = true;
			buffer.unget(data);
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else if (isWhitespace(data)) {
			tokenizer.setState(before_doctype_name_state);
		} else {
			tokenizer._parseError("need-space-after-doctype");
			buffer.unget(data);
			tokenizer.setState(before_doctype_name_state);
		}
		return true;
	}

	function before_doctype_name_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("expected-doctype-name-but-got-eof");
			tokenizer._currentToken.forceQuirks = true;
			buffer.unget(data);
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else if (isWhitespace(data)) {
			// pass
		} else if (data === '>') {
			tokenizer._parseError("expected-doctype-name-but-got-right-bracket");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else {
			if (isAlpha(data))
				data = data.toLowerCase();
			tokenizer._currentToken.name = data;
			tokenizer.setState(doctype_name_state);
		}
		return true;
	}

	function doctype_name_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._currentToken.forceQuirks = true;
			buffer.unget(data);
			tokenizer._parseError("eof-in-doctype-name");
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else if (isWhitespace(data)) {
			tokenizer.setState(after_doctype_name_state);
		} else if (data === '>') {
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else {
			if (isAlpha(data))
				data = data.toLowerCase();
			tokenizer._currentToken.name += data;
			buffer.commit();
		}
		return true;
	}

	function after_doctype_name_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._currentToken.forceQuirks = true;
			buffer.unget(data);
			tokenizer._parseError("eof-in-doctype");
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else if (isWhitespace(data)) {
			// pass
		} else if (data === '>') {
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else {
			if (['p', 'P'].indexOf(data) > -1) {
				var expected = [['u', 'U'], ['b', 'B'], ['l', 'L'], ['i', 'I'], ['c', 'C']];
				var matched = expected.every(function(expected){
					data = buffer.char();
					return expected.indexOf(data) > -1;
				});
				if (matched) {
					tokenizer.setState(after_doctype_public_keyword_state);
					return true;
				}
			} else if (['s', 'S'].indexOf(data) > -1) {
				var expected = [['y', 'Y'], ['s', 'S'], ['t', 'T'], ['e', 'E'], ['m', 'M']];
				var matched = expected.every(function(expected){
					data = buffer.char();
					return expected.indexOf(data) > -1;
				});
				if (matched) {
					tokenizer.setState(after_doctype_system_keyword_state);
					return true;
				}
			}

			// All the characters read before the current 'data' will be
			// [a-zA-Z], so they're garbage in the bogus doctype and can be
			// discarded; only the latest character might be '>' or EOF
			// and needs to be ungetted
			buffer.unget(data);
			tokenizer._currentToken.forceQuirks = true;

			if (data === InputStream.EOF) {
				tokenizer._parseError("eof-in-doctype");
				buffer.unget(data);
				tokenizer.setState(data_state);
				tokenizer._emitCurrentToken();
			} else {
				tokenizer._parseError("expected-space-or-right-bracket-in-doctype", {data: data});
				tokenizer.setState(bogus_doctype_state);
			}
		}
		return true;
	}

	function after_doctype_public_keyword_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			buffer.unget(data);
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else if (isWhitespace(data)) {
			tokenizer.setState(before_doctype_public_identifier_state);
		} else if (data === "'" || data === '"') {
			tokenizer._parseError("unexpected-char-in-doctype");
			buffer.unget(data);
			tokenizer.setState(before_doctype_public_identifier_state);
		} else {
			buffer.unget(data);
			tokenizer.setState(before_doctype_public_identifier_state);
		}
		return true;
	}

	function before_doctype_public_identifier_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			buffer.unget(data);
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else if (isWhitespace(data)) {
			// pass
		} else if (data === '"') {
			tokenizer._currentToken.publicId = '';
			tokenizer.setState(doctype_public_identifier_double_quoted_state);
		} else if (data === "'") {
			tokenizer._currentToken.publicId = '';
			tokenizer.setState(doctype_public_identifier_single_quoted_state);
		} else if (data === '>') {
			tokenizer._parseError("unexpected-end-of-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else {
			tokenizer._parseError("unexpected-char-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer.setState(bogus_doctype_state);
		}
		return true;
	}

	function doctype_public_identifier_double_quoted_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			buffer.unget(data);
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else if (data === '"') {
			tokenizer.setState(after_doctype_public_identifier_state);
		} else if (data === '>') {
			tokenizer._parseError("unexpected-end-of-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else {
			tokenizer._currentToken.publicId += data;
		}
		return true;
	}

	function doctype_public_identifier_single_quoted_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			buffer.unget(data);
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else if (data === "'") {
			tokenizer.setState(after_doctype_public_identifier_state);
		} else if (data === '>') {
			tokenizer._parseError("unexpected-end-of-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else {
			tokenizer._currentToken.publicId += data;
		}
		return true;
	}

	function after_doctype_public_identifier_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer._emitCurrentToken();
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isWhitespace(data)) {
			tokenizer.setState(between_doctype_public_and_system_identifiers_state);
		} else if (data === '>') {
			tokenizer.setState(data_state);
			tokenizer._emitCurrentToken();
		} else if (data === '"') {
			tokenizer._parseError("unexpected-char-in-doctype");
			tokenizer._currentToken.systemId = '';
			tokenizer.setState(doctype_system_identifier_double_quoted_state);
		} else if (data === "'") {
			tokenizer._parseError("unexpected-char-in-doctype");
			tokenizer._currentToken.systemId = '';
			tokenizer.setState(doctype_system_identifier_single_quoted_state);
		} else {
			tokenizer._parseError("unexpected-char-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer.setState(bogus_doctype_state);
		}
		return true;
	}

	function between_doctype_public_and_system_identifiers_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer._emitCurrentToken();
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isWhitespace(data)) {
			// pass
		} else if (data === '>') {
			tokenizer._emitCurrentToken();
			tokenizer.setState(data_state);
		} else if (data === '"') {
			tokenizer._currentToken.systemId = '';
			tokenizer.setState(doctype_system_identifier_double_quoted_state);
		} else if (data === "'") {
			tokenizer._currentToken.systemId = '';
			tokenizer.setState(doctype_system_identifier_single_quoted_state);
		} else {
			tokenizer._parseError("unexpected-char-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer.setState(bogus_doctype_state);
		}
		return true;
	}

	function after_doctype_system_keyword_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer._emitCurrentToken();
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isWhitespace(data)) {
			tokenizer.setState(before_doctype_system_identifier_state);
		} else if (data === "'" || data === '"') {
			tokenizer._parseError("unexpected-char-in-doctype");
			buffer.unget(data);
			tokenizer.setState(before_doctype_system_identifier_state);
		} else {
			buffer.unget(data);
			tokenizer.setState(before_doctype_system_identifier_state);
		}
		return true;
	}

	function before_doctype_system_identifier_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer._emitCurrentToken();
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isWhitespace(data)) {
			// pass
		} else if (data === '"') {
			tokenizer._currentToken.systemId = '';
			tokenizer.setState(doctype_system_identifier_double_quoted_state);
		} else if (data === "'") {
			tokenizer._currentToken.systemId = '';
			tokenizer.setState(doctype_system_identifier_single_quoted_state);
		} else if (data === '>') {
			tokenizer._parseError("unexpected-end-of-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer._emitCurrentToken();
			tokenizer.setState(data_state);
		} else {
			tokenizer._parseError("unexpected-char-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer.setState(bogus_doctype_state);
		}
		return true;
	}

	function doctype_system_identifier_double_quoted_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer._emitCurrentToken();
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === '"') {
			tokenizer.setState(after_doctype_system_identifier_state);
		} else if (data === '>') {
			tokenizer._parseError("unexpected-end-of-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer._emitCurrentToken();
			tokenizer.setState(data_state);
		} else {
			tokenizer._currentToken.systemId += data;
		}
		return true;
	}

	function doctype_system_identifier_single_quoted_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer._emitCurrentToken();
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (data === "'") {
			tokenizer.setState(after_doctype_system_identifier_state);
		} else if (data === '>') {
			tokenizer._parseError("unexpected-end-of-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer._emitCurrentToken();
			tokenizer.setState(data_state);
		} else {
			tokenizer._currentToken.systemId += data;
		}
		return true;
	}

	function after_doctype_system_identifier_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			tokenizer._parseError("eof-in-doctype");
			tokenizer._currentToken.forceQuirks = true;
			tokenizer._emitCurrentToken();
			buffer.unget(data);
			tokenizer.setState(data_state);
		} else if (isWhitespace(data)) {
			// pass
		} else if (data === '>') {
			tokenizer._emitCurrentToken();
			tokenizer.setState(data_state);
		} else {
			tokenizer._parseError("unexpected-char-in-doctype");
			tokenizer.setState(bogus_doctype_state);
		}
		return true;
	}

	function bogus_doctype_state(buffer) {
		var data = buffer.char();
		if (data === InputStream.EOF) {
			buffer.unget(data);
			tokenizer._emitCurrentToken();
			tokenizer.setState(data_state);
		} else if (data === '>') {
			tokenizer._emitCurrentToken();
			tokenizer.setState(data_state);
		}
		return true;
	}
};

exports.Tokenizer = Tokenizer;

},{"./EntityParser":2,"./InputStream":3}],6:[function(req,module,exports){
(function(){var assert = req('assert');

var messages = req('./messages.json');
var constants = req('./constants');

var EventEmitter = req('events').EventEmitter;

var Tokenizer = req('./Tokenizer').Tokenizer;
var ElementStack = req('./ElementStack').ElementStack;
var StackItem = req('./StackItem').StackItem;

var Marker = {};

function isWhitespace(ch) {
	return ch === " " || ch === "\n" || ch === "\t" || ch === "\r" || ch === "\f";
}

function isWhitespaceOrReplacementCharacter(ch) {
	return isWhitespace(ch) || ch === '\uFFFD';
}

function isAllWhitespace(characters) {
	for (var i = 0; i < characters.length; i++) {
		var ch = characters[i];
		if (!isWhitespace(ch))
			return false;
	}
	return true;
}

function isAllWhitespaceOrReplacementCharacters(characters) {
	for (var i = 0; i < characters.length; i++) {
		var ch = characters[i];
		if (!isWhitespaceOrReplacementCharacter(ch))
			return false;
	}
	return true;
}

function getAttribute(node, name) {
	for (var i = 0; i < node.attributes.length; i++) {
		var attribute = node.attributes[i];
		if (attribute.nodeName === name) {
			return attribute;
		}
	}
	return null;
}

function CharacterBuffer(characters) {
	this.characters = characters;
	this.current = 0;
	this.end = this.characters.length;
}

CharacterBuffer.prototype.skipAtMostOneLeadingNewline = function() {
	if (this.characters[this.current] === '\n')
		this.current++;
};

CharacterBuffer.prototype.skipLeadingWhitespace = function() {
	while (isWhitespace(this.characters[this.current])) {
		if (++this.current == this.end)
			return;
	}
};

CharacterBuffer.prototype.skipLeadingNonWhitespace = function() {
	while (!isWhitespace(this.characters[this.current])) {
		if (++this.current == this.end)
			return;
	}
};

CharacterBuffer.prototype.takeRemaining = function() {
	return this.characters.substring(this.current);
};

CharacterBuffer.prototype.takeLeadingWhitespace = function() {
	var start = this.current;
	this.skipLeadingWhitespace();
	if (start === this.current)
		return "";
	return this.characters.substring(start, this.current - start);
};

Object.defineProperty(CharacterBuffer.prototype, 'length', {
	get: function(){
		return this.end - this.current;
	}
});

/**
 *
 * @constructor
 */
function TreeBuilder() {
	this.tokenizer = null;
	this.errorHandler = null;
	this.scriptingEnabled = false;
	this.document = null;
	this.head = null;
	this.form = null;
	this.openElements = new ElementStack();
	this.activeFormattingElements = [];
	this.insertionMode = null;
	this.insertionModeName = "";
	this.originalInsertionMode = "";
	this.inQuirksMode = false; // TODO quirks mode
	this.compatMode = "no quirks";
	this.framesetOk = true;
	this.redirectAttachToFosterParent = false;
	this.selfClosingFlagAcknowledged = false;
	this.context = "";
	this.firstStartTag = false;
	this.pendingTableCharacters = [];
	this.shouldSkipLeadingNewline = false;

	var tree = this;
	var modes = this.insertionModes = {};
	modes.base = {
		end_tag_handlers: {"-default": 'endTagOther'},
		start_tag_handlers: {"-default": 'startTagOther'},
		processEOF: function() {
			tree.generateImpliedEndTags();
			if (tree.openElements.length > 2) {
				tree.parseError('expected-closing-tag-but-got-eof');
			} else if (tree.openElements.length == 2 &&
				tree.openElements.item(1).localName != 'body') {
				// This happens for framesets or something?
				tree.parseError('expected-closing-tag-but-got-eof');
			} else if (tree.context && tree.openElements.length > 1) {
				// XXX This is not what the specification says. Not sure what to do here.
				//tree.parseError('eof-in-innerhtml');
			}
		},
		processComment: function(data) {
			// For most phases the following is forceQuirks. Where it's not it will be
			// overridden.
			tree.insertComment(data, tree.currentStackItem().node);
		},
		processDoctype: function(name, publicId, systemId, forceQuirks) {
			tree.parseError('unexpected-doctype');
		},
		processStartTag: function(name, attributes, selfClosing) {
			if (this[this.start_tag_handlers[name]]) {
				this[this.start_tag_handlers[name]](name, attributes, selfClosing);
			} else if (this[this.start_tag_handlers["-default"]]) {
				this[this.start_tag_handlers["-default"]](name, attributes, selfClosing);
			} else {
				throw(new Error("No handler found for "+name));
			}
		},
		processEndTag: function(name) {
			if (this[this.end_tag_handlers[name]]) {
				this[this.end_tag_handlers[name]](name);
			} else if (this[this.end_tag_handlers["-default"]]) {
				this[this.end_tag_handlers["-default"]](name);
			} else {
				throw(new Error("No handler found for "+name));
			}
		},
		startTagHtml: function(name, attributes) {
			if (!tree.firstStartTag && name == 'html') {
				tree.parseError('non-html-root');
			}
			tree.addAttributesToElement(tree.openElements.rootNode, attributes);
			tree.firstStartTag = false;
		}
	};

	modes.initial = Object.create(modes.base);

	modes.initial.processEOF = function() {
		tree.parseError("expected-doctype-but-got-eof");
		this.anythingElse();
		tree.insertionMode.processEOF();
	};

	modes.initial.processComment = function(data) {
		tree.insertComment(data, tree.document);
	};

	modes.initial.processDoctype = function(name, publicId, systemId, forceQuirks) {
		tree.insertDoctype(name || '', publicId || '', systemId || '');

		if (forceQuirks || name != 'html' || (publicId != null && ([
					"+//silmaril//dtd html pro v0r11 19970101//",
					"-//advasoft ltd//dtd html 3.0 aswedit + extensions//",
					"-//as//dtd html 3.0 aswedit + extensions//",
					"-//ietf//dtd html 2.0 level 1//",
					"-//ietf//dtd html 2.0 level 2//",
					"-//ietf//dtd html 2.0 strict level 1//",
					"-//ietf//dtd html 2.0 strict level 2//",
					"-//ietf//dtd html 2.0 strict//",
					"-//ietf//dtd html 2.0//",
					"-//ietf//dtd html 2.1e//",
					"-//ietf//dtd html 3.0//",
					"-//ietf//dtd html 3.0//",
					"-//ietf//dtd html 3.2 final//",
					"-//ietf//dtd html 3.2//",
					"-//ietf//dtd html 3//",
					"-//ietf//dtd html level 0//",
					"-//ietf//dtd html level 0//",
					"-//ietf//dtd html level 1//",
					"-//ietf//dtd html level 1//",
					"-//ietf//dtd html level 2//",
					"-//ietf//dtd html level 2//",
					"-//ietf//dtd html level 3//",
					"-//ietf//dtd html level 3//",
					"-//ietf//dtd html strict level 0//",
					"-//ietf//dtd html strict level 0//",
					"-//ietf//dtd html strict level 1//",
					"-//ietf//dtd html strict level 1//",
					"-//ietf//dtd html strict level 2//",
					"-//ietf//dtd html strict level 2//",
					"-//ietf//dtd html strict level 3//",
					"-//ietf//dtd html strict level 3//",
					"-//ietf//dtd html strict//",
					"-//ietf//dtd html strict//",
					"-//ietf//dtd html strict//",
					"-//ietf//dtd html//",
					"-//ietf//dtd html//",
					"-//ietf//dtd html//",
					"-//metrius//dtd metrius presentational//",
					"-//microsoft//dtd internet explorer 2.0 html strict//",
					"-//microsoft//dtd internet explorer 2.0 html//",
					"-//microsoft//dtd internet explorer 2.0 tables//",
					"-//microsoft//dtd internet explorer 3.0 html strict//",
					"-//microsoft//dtd internet explorer 3.0 html//",
					"-//microsoft//dtd internet explorer 3.0 tables//",
					"-//netscape comm. corp.//dtd html//",
					"-//netscape comm. corp.//dtd strict html//",
					"-//o'reilly and associates//dtd html 2.0//",
					"-//o'reilly and associates//dtd html extended 1.0//",
					"-//spyglass//dtd html 2.0 extended//",
					"-//sq//dtd html 2.0 hotmetal + extensions//",
					"-//sun microsystems corp.//dtd hotjava html//",
					"-//sun microsystems corp.//dtd hotjava strict html//",
					"-//w3c//dtd html 3 1995-03-24//",
					"-//w3c//dtd html 3.2 draft//",
					"-//w3c//dtd html 3.2 final//",
					"-//w3c//dtd html 3.2//",
					"-//w3c//dtd html 3.2s draft//",
					"-//w3c//dtd html 4.0 frameset//",
					"-//w3c//dtd html 4.0 transitional//",
					"-//w3c//dtd html experimental 19960712//",
					"-//w3c//dtd html experimental 970421//",
					"-//w3c//dtd w3 html//",
					"-//w3o//dtd w3 html 3.0//",
					"-//webtechs//dtd mozilla html 2.0//",
					"-//webtechs//dtd mozilla html//",
					"html"
				].some(publicIdStartsWith)
				|| [
					"-//w3o//dtd w3 html strict 3.0//en//",
					"-/w3c/dtd html 4.0 transitional/en",
					"html"
				].indexOf(publicId.toLowerCase()) > -1
				|| (systemId == null && [
					"-//w3c//dtd html 4.01 transitional//",
					"-//w3c//dtd html 4.01 frameset//"
				].some(publicIdStartsWith)))
			)
			|| (systemId != null && (systemId.toLowerCase() == "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd"))
		) {
			tree.compatMode = "quirks";
			tree.parseError("quirky-doctype");
		} else if (publicId != null && ([
				"-//w3c//dtd xhtml 1.0 transitional//",
				"-//w3c//dtd xhtml 1.0 frameset//"
			].some(publicIdStartsWith)
			|| (systemId != null && [
				"-//w3c//dtd html 4.01 transitional//",
				"-//w3c//dtd html 4.01 frameset//"
			].indexOf(publicId.toLowerCase()) > -1))
		) {
			tree.compatMode = "limited quirks";
			tree.parseError("almost-standards-doctype");
		} else {
			if ((publicId == "-//W3C//DTD HTML 4.0//EN" && (systemId == null || systemId == "http://www.w3.org/TR/REC-html40/strict.dtd"))
				|| (publicId == "-//W3C//DTD HTML 4.01//EN" && (systemId == null || systemId == "http://www.w3.org/TR/html4/strict.dtd"))
				|| (publicId == "-//W3C//DTD XHTML 1.0 Strict//EN" && (systemId == "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"))
				|| (publicId == "-//W3C//DTD XHTML 1.1//EN" && (systemId == "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"))
			) {
				// warning
				//tree.warn("obsolete-doctype");
			} else if (!((systemId == null || systemId == "about:legacy-compat") && publicId == null)) {
				tree.parseError("unknown-doctype");
			}
		}
		tree.setInsertionMode('beforeHTML');
		function publicIdStartsWith(string) {
			return publicId.toLowerCase().indexOf(string) === 0;
		}
	};

	modes.initial.processCharacters = function(buffer) {
		buffer.skipLeadingWhitespace();
		if (!buffer.length)
			return;
		tree.parseError('expected-doctype-but-got-chars');
		this.anythingElse();
		tree.insertionMode.processCharacters(buffer);
	};

	modes.initial.processStartTag = function(name, attributes, selfClosing) {
		tree.parseError('expected-doctype-but-got-start-tag', {name: name});
		this.anythingElse();
		tree.insertionMode.processStartTag(name, attributes, selfClosing);
	};

	modes.initial.processEndTag = function(name) {
		tree.parseError('expected-doctype-but-got-end-tag', {name: name});
		this.anythingElse();
		tree.insertionMode.processEndTag(name);
	};

	modes.initial.anythingElse = function() {
		tree.compatMode = 'quirks';
		tree.setInsertionMode('beforeHTML');
	};

	modes.beforeHTML = Object.create(modes.base);

	modes.beforeHTML.start_tag_handlers = {
		html: 'startTagHtml',
		'-default': 'startTagOther'
	};

	modes.beforeHTML.processEOF = function() {
		this.anythingElse();
		tree.insertionMode.processEOF();
	};

	modes.beforeHTML.processComment = function(data) {
		tree.insertComment(data, tree.document);
	};

	modes.beforeHTML.processCharacters = function(buffer) {
		buffer.skipLeadingWhitespace();
		if (!buffer.length)
			return;
		this.anythingElse();
		tree.insertionMode.processCharacters(buffer);
	};

	modes.beforeHTML.startTagHtml = function(name, attributes, selfClosing) {
		tree.firstStartTag = true;
		tree.insertHtmlElement(attributes);
		tree.setInsertionMode('beforeHead');
	};

	modes.beforeHTML.startTagOther = function(name, attributes, selfClosing) {
		this.anythingElse();
		tree.insertionMode.processStartTag(name, attributes, selfClosing);
	};

	modes.beforeHTML.processEndTag = function(name) {
		this.anythingElse();
		tree.insertionMode.processEndTag(name);
	};

	modes.beforeHTML.anythingElse = function() {
		tree.insertHtmlElement();
		tree.setInsertionMode('beforeHead');
	};

	modes.afterAfterBody = Object.create(modes.base);

	modes.afterAfterBody.start_tag_handlers = {
		html: 'startTagHtml',
		'-default': 'startTagOther'
	};

	modes.afterAfterBody.processComment = function(data) {
		tree.insertComment(data, tree.document);
	};

	modes.afterAfterBody.processDoctype = function(data) {
		modes.inBody.processDoctype(data);
	};

	modes.afterAfterBody.startTagHtml = function(data, attributes) {
		modes.inBody.startTagHtml(data, attributes);
	};

	modes.afterAfterBody.startTagOther = function(name, attributes, selfClosing) {
		tree.parseError('unexpected-start-tag', {name: name});
		tree.setInsertionMode('inBody');
		tree.insertionMode.processStartTag(name, attributes, selfClosing);
	};

	modes.afterAfterBody.endTagOther = function(name) {
		tree.parseError('unexpected-end-tag', {name: name});
		tree.setInsertionMode('inBody');
		tree.insertionMode.processEndTag(name);
	};

	modes.afterAfterBody.processCharacters = function(data) {
		if (!isAllWhitespace(data.characters)) {
			tree.parseError('unexpected-char-after-body');
			tree.setInsertionMode('inBody');
			return tree.insertionMode.processCharacters(data);
		}
		modes.inBody.processCharacters(data);
	};

	modes.afterBody = Object.create(modes.base);

	modes.afterBody.end_tag_handlers = {
		html: 'endTagHtml',
		'-default': 'endTagOther'
	};

	modes.afterBody.processComment = function(data) {
		// This is needed because data is to be appended to the html element here
		// and not to whatever is currently open.
		tree.insertComment(data, tree.openElements.rootNode);
	};

	modes.afterBody.processCharacters = function(data) {
		if (!isAllWhitespace(data.characters)) {
			tree.parseError('unexpected-char-after-body');
			tree.setInsertionMode('inBody');
			return tree.insertionMode.processCharacters(data);
		}
		modes.inBody.processCharacters(data);
	};

	modes.afterBody.processStartTag = function(name, attributes, selfClosing) {
		tree.parseError('unexpected-start-tag-after-body', {name: name});
		tree.setInsertionMode('inBody');
		tree.insertionMode.processStartTag(name, attributes, selfClosing);
	};

	modes.afterBody.endTagHtml = function(name) {
		if (tree.context) {
			tree.parseError('end-html-in-innerhtml');
		} else {
			// XXX This may need to be done, not sure
			// Don't set last_phase to the current phase but to the inBody phase
			// instead. No need for extra parseErrors if there's something after
			// </html>.
			// Try <!doctype html>X</html>X for instance
			tree.setInsertionMode('afterAfterBody');
		}
	};

	modes.afterBody.endTagOther = function(name) {
		tree.parseError('unexpected-end-tag-after-body', {name: name});
		tree.setInsertionMode('inBody');
		tree.insertionMode.processEndTag(name);
	};

	modes.afterFrameset = Object.create(modes.base);

	modes.afterFrameset.start_tag_handlers = {
		html: 'startTagHtml',
		noframes: 'startTagNoframes',
		'-default': 'startTagOther'
	};

	modes.afterFrameset.end_tag_handlers = {
		html: 'endTagHtml',
		'-default': 'endTagOther'
	};

	modes.afterFrameset.processCharacters = function(buffer) {
		var characters = buffer.takeRemaining();
		var whitespace = "";
		for (var i = 0; i < characters.length; i++) {
			var ch = characters[i];
			if (isWhitespace(ch))
				whitespace += ch;
		}
		if (whitespace) {
			tree.insertText(whitespace);
		}
		if (whitespace.length < characters.length)
			tree.parseError('expected-eof-but-got-char');
	};

	modes.afterFrameset.startTagNoframes = function(name, attributes) {
		modes.inHead.processStartTag(name, attributes);
	};

	modes.afterFrameset.startTagOther = function(name, attributes) {
		tree.parseError("unexpected-start-tag-after-frameset", {name: name});
	};

	modes.afterFrameset.endTagHtml = function(name) {
		tree.setInsertionMode('afterAfterFrameset');
	};

	modes.afterFrameset.endTagOther = function(name) {
		tree.parseError("unexpected-end-tag-after-frameset", {name: name});
	};

	modes.beforeHead = Object.create(modes.base);

	modes.beforeHead.start_tag_handlers = {
		html: 'startTagHtml',
		head: 'startTagHead',
		'-default': 'startTagOther'
	};

	modes.beforeHead.end_tag_handlers = {
		html: 'endTagImplyHead',
		head: 'endTagImplyHead',
		body: 'endTagImplyHead',
		br: 'endTagImplyHead',
		'-default': 'endTagOther'
	};

	modes.beforeHead.processEOF = function() {
		this.startTagHead('head', []);
		tree.insertionMode.processEOF();
	};

	modes.beforeHead.processCharacters = function(buffer) {
		buffer.skipLeadingWhitespace();
		if (!buffer.length)
			return;
		this.startTagHead('head', []);
		tree.insertionMode.processCharacters(buffer);
	};

	modes.beforeHead.startTagHead = function(name, attributes) {
		tree.insertHeadElement(attributes);
		tree.setInsertionMode('inHead');
	};

	modes.beforeHead.startTagOther = function(name, attributes, selfClosing) {
		this.startTagHead('head', []);
		tree.insertionMode.processStartTag(name, attributes, selfClosing);
	};

	modes.beforeHead.endTagImplyHead = function(name) {
		this.startTagHead('head', []);
		tree.insertionMode.processEndTag(name);
	};

	modes.beforeHead.endTagOther = function(name) {
		tree.parseError('end-tag-after-implied-root', {name: name});
	};

	modes.inHead = Object.create(modes.base);

	modes.inHead.start_tag_handlers = {
		html: 'startTagHtml',
		head: 'startTagHead',
		title: 'startTagTitle',
		script: 'startTagScript',
		style: 'startTagNoFramesStyle',
		noscript: 'startTagNoScript',
		noframes: 'startTagNoFramesStyle',
		base: 'startTagBaseLinkCommand',
		basefont: 'startTagBaseLinkCommand',
		bgsound: 'startTagBaseLinkCommand',
		command: 'startTagBaseLinkCommand', //FIXME drop command tag?
		link: 'startTagBaseLinkCommand',
		meta: 'startTagMeta',
		"-default": 'startTagOther'
	};

	modes.inHead.end_tag_handlers = {
		head: 'endTagHead',
		html: 'endTagHtmlBodyBr',
		body: 'endTagHtmlBodyBr',
		br: 'endTagHtmlBodyBr',
		"-default": 'endTagOther'
	};

	modes.inHead.processEOF = function() {
		var name = tree.currentStackItem().localName;
		if (['title', 'style', 'script'].indexOf(name) != -1) {
			tree.parseError("expected-named-closing-tag-but-got-eof", {name: name});
			tree.popElement();
		}

		this.anythingElse();

		tree.insertionMode.processEOF();
	};

	modes.inHead.processCharacters = function(buffer) {
		var leadingWhitespace = buffer.takeLeadingWhitespace();
		if (leadingWhitespace)
			tree.insertText(leadingWhitespace);
		if (!buffer.length)
			return;
		this.anythingElse();
		tree.insertionMode.processCharacters(buffer);
	};

	modes.inHead.startTagHtml = function(name, attributes) {
		modes.inBody.processStartTag(name, attributes);
	};

	modes.inHead.startTagHead = function(name, attributes) {
		tree.parseError('two-heads-are-not-better-than-one');
	};

	modes.inHead.startTagTitle = function(name, attributes) {
		tree.processGenericRCDATAStartTag(name, attributes);
	};

	modes.inHead.startTagNoScript = function(name, attributes) {
		if (tree.scriptingEnabled)
			return tree.processGenericRawTextStartTag(name, attributes);
		tree.insertElement(name, attributes);
		tree.setInsertionMode('inHeadNoscript');
	};

	modes.inHead.startTagNoFramesStyle = function(name, attributes) {
		// XXX Need to decide whether to implement the scripting disabled case
		tree.processGenericRawTextStartTag(name, attributes);
	};

	modes.inHead.startTagScript = function(name, attributes) {
		tree.insertElement(name, attributes);
		tree.tokenizer.setState(Tokenizer.SCRIPT_DATA);
		tree.originalInsertionMode = tree.insertionModeName;
		tree.setInsertionMode('text');
	};

	modes.inHead.startTagBaseLinkCommand = function(name, attributes) {
		tree.insertSelfClosingElement(name, attributes);
	};

	modes.inHead.startTagMeta = function(name, attributes) {
		tree.insertSelfClosingElement(name, attributes);
		// @todo process charset attributes
	};

	modes.inHead.startTagOther = function(name, attributes, selfClosing) {
		this.anythingElse();
		tree.insertionMode.processStartTag(name, attributes, selfClosing);
	};

	modes.inHead.endTagHead = function(name) {
		if (tree.openElements.item(tree.openElements.length - 1).localName == 'head') {
			tree.openElements.pop();
		} else {
			tree.parseError('unexpected-end-tag', {name: 'head'});
		}
		tree.setInsertionMode('afterHead');
	};

	modes.inHead.endTagHtmlBodyBr = function(name) {
		this.anythingElse();
		tree.insertionMode.processEndTag(name);
	};

	modes.inHead.endTagOther = function(name) {
		tree.parseError('unexpected-end-tag', {name: name});
	};

	modes.inHead.anythingElse = function() {
		this.endTagHead('head');
	};

	modes.afterHead = Object.create(modes.base);

	modes.afterHead.start_tag_handlers = {
		html: 'startTagHtml',
		head: 'startTagHead',
		body: 'startTagBody',
		frameset: 'startTagFrameset',
		base: 'startTagFromHead',
		link: 'startTagFromHead',
		meta: 'startTagFromHead',
		script: 'startTagFromHead',
		// XXX noframes: 'startTagFromHead' ?
		style: 'startTagFromHead',
		title: 'startTagFromHead',
		"-default": 'startTagOther'
	};

	modes.afterHead.end_tag_handlers = {
		body: 'endTagBodyHtmlBr',
		html: 'endTagBodyHtmlBr',
		br: 'endTagBodyHtmlBr',
		"-default": 'endTagOther'
	};

	modes.afterHead.processEOF = function() {
		this.anythingElse();
		tree.insertionMode.processEOF();
	};

	modes.afterHead.processCharacters = function(buffer) {
		var leadingWhitespace = buffer.takeLeadingWhitespace();
		if (leadingWhitespace)
			tree.insertText(leadingWhitespace);
		if (!buffer.length)
			return;
		this.anythingElse();
		tree.insertionMode.processCharacters(buffer);
	};

	modes.afterHead.startTagHtml = function(name, attributes) {
		modes.inBody.processStartTag(name, attributes);
	};

	modes.afterHead.startTagBody = function(name, attributes) {
		tree.framesetOk = false;
		tree.insertBodyElement(attributes);
		tree.setInsertionMode('inBody');
	};

	modes.afterHead.startTagFrameset = function(name, attributes) {
		tree.insertElement(name, attributes);
		tree.setInsertionMode('inFrameset');
	};

	modes.afterHead.startTagFromHead = function(name, attributes, selfClosing) {
		tree.parseError("unexpected-start-tag-out-of-my-head", {name: name});
		// FIXME head pointer
		tree.openElements.push(tree.head);
		modes.inHead.processStartTag(name, attributes, selfClosing);
		tree.openElements.remove(tree.head);
	};

	modes.afterHead.startTagHead = function(name, attributes, selfClosing) {
		tree.parseError('unexpected-start-tag', {name: name});
	};

	modes.afterHead.startTagOther = function(name, attributes, selfClosing) {
		this.anythingElse();
		tree.insertionMode.processStartTag(name, attributes, selfClosing);
	};

	modes.afterHead.endTagBodyHtmlBr = function(name) {
		this.anythingElse();
		tree.insertionMode.processEndTag(name);
	};

	modes.afterHead.endTagOther = function(name) {
		tree.parseError('unexpected-end-tag', {name: name});
	};

	modes.afterHead.anythingElse = function() {
		tree.insertBodyElement([]);
		tree.setInsertionMode('inBody');
		tree.framesetOk = true;
	}

	modes.inBody = Object.create(modes.base);

	modes.inBody.start_tag_handlers = {
		html: 'startTagHtml',
		head: 'startTagMisplaced',
		base: 'startTagProcessInHead',
		basefont: 'startTagProcessInHead',
		bgsound: 'startTagProcessInHead',
		command: 'startTagProcessInHead',
		link: 'startTagProcessInHead',
		meta: 'startTagProcessInHead',
		noframes: 'startTagProcessInHead',
		script: 'startTagProcessInHead',
		style: 'startTagProcessInHead',
		title: 'startTagProcessInHead',
		body: 'startTagBody',
		form: 'startTagForm',
		plaintext: 'startTagPlaintext',
		a: 'startTagA',
		button: 'startTagButton',
		xmp: 'startTagXmp',
		table: 'startTagTable',
		hr: 'startTagHr',
		image: 'startTagImage',
		input: 'startTagInput',
		textarea: 'startTagTextarea',
		select: 'startTagSelect',
		isindex: 'startTagIsindex',
		applet:	'startTagAppletMarqueeObject',
		marquee:	'startTagAppletMarqueeObject',
		object:	'startTagAppletMarqueeObject',
		li: 'startTagListItem',
		dd: 'startTagListItem',
		dt: 'startTagListItem',
		address: 'startTagCloseP',
		article: 'startTagCloseP',
		aside: 'startTagCloseP',
		blockquote: 'startTagCloseP',
		center: 'startTagCloseP',
		details: 'startTagCloseP',
		dir: 'startTagCloseP',
		div: 'startTagCloseP',
		dl: 'startTagCloseP',
		fieldset: 'startTagCloseP',
		figcaption: 'startTagCloseP',
		figure: 'startTagCloseP',
		footer: 'startTagCloseP',
		header: 'startTagCloseP',
		hgroup: 'startTagCloseP',
		main: 'startTagCloseP',
		menu: 'startTagCloseP',
		nav: 'startTagCloseP',
		ol: 'startTagCloseP',
		p: 'startTagCloseP',
		section: 'startTagCloseP',
		summary: 'startTagCloseP',
		ul: 'startTagCloseP',
		listing: 'startTagPreListing',
		pre: 'startTagPreListing',
		b: 'startTagFormatting',
		big: 'startTagFormatting',
		code: 'startTagFormatting',
		em: 'startTagFormatting',
		font: 'startTagFormatting',
		i: 'startTagFormatting',
		s: 'startTagFormatting',
		small: 'startTagFormatting',
		strike: 'startTagFormatting',
		strong: 'startTagFormatting',
		tt: 'startTagFormatting',
		u: 'startTagFormatting',
		nobr: 'startTagNobr',
		area: 'startTagVoidFormatting',
		br: 'startTagVoidFormatting',
		embed: 'startTagVoidFormatting',
		img: 'startTagVoidFormatting',
		keygen: 'startTagVoidFormatting',
		wbr: 'startTagVoidFormatting',
		param: 'startTagParamSourceTrack',
		source: 'startTagParamSourceTrack',
		track: 'startTagParamSourceTrack',
		iframe: 'startTagIFrame',
		noembed: 'startTagRawText',
		noscript: 'startTagRawText',
		h1: 'startTagHeading',
		h2: 'startTagHeading',
		h3: 'startTagHeading',
		h4: 'startTagHeading',
		h5: 'startTagHeading',
		h6: 'startTagHeading',
		caption: 'startTagMisplaced',
		col: 'startTagMisplaced',
		colgroup: 'startTagMisplaced',
		frame: 'startTagMisplaced',
		frameset: 'startTagFrameset',
		tbody: 'startTagMisplaced',
		td: 'startTagMisplaced',
		tfoot: 'startTagMisplaced',
		th: 'startTagMisplaced',
		thead: 'startTagMisplaced',
		tr: 'startTagMisplaced',
		option: 'startTagOptionOptgroup',
		optgroup: 'startTagOptionOptgroup',
		math: 'startTagMath',
		svg: 'startTagSVG',
		rt: 'startTagRpRt',
		rp: 'startTagRpRt',
		"-default": 'startTagOther'
	};

	modes.inBody.end_tag_handlers = {
		p: 'endTagP',
		body: 'endTagBody',
		html: 'endTagHtml',
		address: 'endTagBlock',
		article: 'endTagBlock',
		aside: 'endTagBlock',
		blockquote: 'endTagBlock',
		button: 'endTagBlock',
		center: 'endTagBlock',
		details: 'endTagBlock',
		dir: 'endTagBlock',
		div: 'endTagBlock',
		dl: 'endTagBlock',
		fieldset: 'endTagBlock',
		figcaption: 'endTagBlock',
		figure: 'endTagBlock',
		footer: 'endTagBlock',
		header: 'endTagBlock',
		hgroup: 'endTagBlock',
		listing: 'endTagBlock',
		main: 'endTagBlock',
		menu: 'endTagBlock',
		nav: 'endTagBlock',
		ol: 'endTagBlock',
		pre: 'endTagBlock',
		section: 'endTagBlock',
		summary: 'endTagBlock',
		ul: 'endTagBlock',
		form: 'endTagForm',
		applet: 'endTagAppletMarqueeObject',
		marquee: 'endTagAppletMarqueeObject',
		object: 'endTagAppletMarqueeObject',
		dd: 'endTagListItem',
		dt: 'endTagListItem',
		li: 'endTagListItem',
		h1: 'endTagHeading',
		h2: 'endTagHeading',
		h3: 'endTagHeading',
		h4: 'endTagHeading',
		h5: 'endTagHeading',
		h6: 'endTagHeading',
		a: 'endTagFormatting',
		b: 'endTagFormatting',
		big: 'endTagFormatting',
		code: 'endTagFormatting',
		em: 'endTagFormatting',
		font: 'endTagFormatting',
		i: 'endTagFormatting',
		nobr: 'endTagFormatting',
		s: 'endTagFormatting',
		small: 'endTagFormatting',
		strike: 'endTagFormatting',
		strong: 'endTagFormatting',
		tt: 'endTagFormatting',
		u: 'endTagFormatting',
		br: 'endTagBr',
		"-default": 'endTagOther'
	};

	modes.inBody.processCharacters = function(buffer) {
		if (tree.shouldSkipLeadingNewline) {
			tree.shouldSkipLeadingNewline = false;
			buffer.skipAtMostOneLeadingNewline();
		}
		tree.reconstructActiveFormattingElements();
		var characters = buffer.takeRemaining();
		characters = characters.replace(/\u0000/g, function(match, index){
			// @todo position
			tree.parseError("invalid-codepoint");
			return '';
		});
		if (!characters)
			return;
		tree.insertText(characters);
		if (tree.framesetOk && !isAllWhitespaceOrReplacementCharacters(characters))
			tree.framesetOk = false;
	};

	modes.inBody.startTagProcessInHead = function(name, attributes) {
		modes.inHead.processStartTag(name, attributes);
	};

	modes.inBody.startTagBody = function(name, attributes) {
		tree.parseError('unexpected-start-tag', {name: 'body'});
		if (tree.openElements.length == 1 ||
			tree.openElements.item(1).localName != 'body') {
			assert.ok(tree.context);
		} else {
			tree.framesetOk = false;
			tree.addAttributesToElement(tree.openElements.bodyElement, attributes);
		}
	};

	modes.inBody.startTagFrameset = function(name, attributes) {
		tree.parseError('unexpected-start-tag', {name: 'frameset'});
		if (tree.openElements.length == 1 ||
			tree.openElements.item(1).localName != 'body') {
			assert.ok(tree.context);
		} else if (tree.framesetOk) {
			tree.detachFromParent(tree.openElements.bodyElement);
			while (tree.openElements.length > 1)
				tree.openElements.pop();
			tree.insertElement(name, attributes);
			tree.setInsertionMode('inFrameset');
		}
	};

	modes.inBody.startTagCloseP = function(name, attributes) {
		if (tree.openElements.inButtonScope('p'))
			this.endTagP('p');
		tree.insertElement(name, attributes);
	};

	modes.inBody.startTagPreListing = function(name, attributes) {
		if (tree.openElements.inButtonScope('p'))
			this.endTagP('p');
		tree.insertElement(name, attributes);
		tree.framesetOk = false;
		tree.shouldSkipLeadingNewline = true;
	};

	modes.inBody.startTagForm = function(name, attributes) {
		if (tree.form) {
			tree.parseError('unexpected-start-tag', {name: name});
		} else {
			if (tree.openElements.inButtonScope('p'))
				this.endTagP('p');
			tree.insertElement(name, attributes);
			tree.form = tree.currentStackItem();
		}
	};

	modes.inBody.startTagRpRt = function(name, attributes) {
		if (tree.openElements.inScope('ruby')) {
			tree.generateImpliedEndTags();
			if (tree.currentStackItem().localName != 'ruby') {
				tree.parseError('unexpected-start-tag', {name: name});
			}
		}
		tree.insertElement(name, attributes);
	};

	modes.inBody.startTagListItem = function(name, attributes) {
		/// @todo: Fix according to current spec. http://www.w3.org/TR/html5/tree-construction.html#parsing-main-inbody
		var stopNames = {li: ['li'], dd: ['dd', 'dt'], dt: ['dd', 'dt']};
		var stopName = stopNames[name];

		var els = tree.openElements;
		for (var i = els.length - 1; i >= 0; i--) {
			var node = els.item(i);
			if (stopName.indexOf(node.localName) != -1) {
				tree.insertionMode.processEndTag(node.localName);
				break;
			}

			// todo isScoping()
			if (node.isSpecial() && node.localName !== 'p' && node.localName !== 'address' && node.localName !== 'div')
				break;
		}
		if (tree.openElements.inButtonScope('p'))
			this.endTagP('p');

		// Always insert an <li> element
		tree.insertElement(name, attributes);
		tree.framesetOk = false;
	};

	modes.inBody.startTagPlaintext = function(name, attributes) {
		if (tree.openElements.inButtonScope('p'))
			this.endTagP('p');
		tree.insertElement(name, attributes);
		tree.tokenizer.setState(Tokenizer.PLAINTEXT);
	};

	modes.inBody.startTagHeading = function(name, attributes) {
		if (tree.openElements.inButtonScope('p'))
			this.endTagP('p');
		if (tree.currentStackItem().isNumberedHeader()) {
			tree.parseError('unexpected-start-tag', {name: name});
			tree.popElement();
		}
		tree.insertElement(name, attributes);
	};

	modes.inBody.startTagA = function(name, attributes) {
		var activeA = tree.elementInActiveFormattingElements('a');
		if (activeA) {
			tree.parseError("unexpected-start-tag-implies-end-tag", {startName: "a", endName: "a"});
			tree.adoptionAgencyEndTag('a');
			if (tree.openElements.contains(activeA))
				tree.openElements.remove(activeA);
			tree.removeElementFromActiveFormattingElements(activeA);
		}
		tree.reconstructActiveFormattingElements();
		tree.insertFormattingElement(name, attributes);
	};

	modes.inBody.startTagFormatting = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		tree.insertFormattingElement(name, attributes);
	};

	modes.inBody.startTagNobr = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		if (tree.openElements.inScope('nobr')) {
			tree.parseError("unexpected-start-tag-implies-end-tag", {startName: 'nobr', endName: 'nobr'});
			this.processEndTag('nobr');
				// XXX Need tests that trigger the following
				tree.reconstructActiveFormattingElements();
		}
		tree.insertFormattingElement(name, attributes);
	};

	modes.inBody.startTagButton = function(name, attributes) {
		if (tree.openElements.inScope('button')) {
			tree.parseError('unexpected-start-tag-implies-end-tag', {startName: 'button', endName: 'button'});
			this.processEndTag('button');
			tree.insertionMode.processStartTag(name, attributes);
		} else {
			tree.framesetOk = false;
			tree.reconstructActiveFormattingElements();
			tree.insertElement(name, attributes);
		}
	};

	modes.inBody.startTagAppletMarqueeObject = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		tree.insertElement(name, attributes);
		tree.activeFormattingElements.push(Marker);
		tree.framesetOk = false;
	};

	modes.inBody.endTagAppletMarqueeObject = function(name) {
		if (!tree.openElements.inScope(name)) {
			tree.parseError("unexpected-end-tag", {name: name});
		} else {
			tree.generateImpliedEndTags();
			if (tree.currentStackItem().localName != name) {
				tree.parseError('end-tag-too-early', {name: name});
			}
			tree.openElements.popUntilPopped(name);
			tree.clearActiveFormattingElements();
		}
	};

	modes.inBody.startTagXmp = function(name, attributes) {
		if (tree.openElements.inButtonScope('p'))
			this.processEndTag('p');
		tree.reconstructActiveFormattingElements();
		tree.processGenericRawTextStartTag(name, attributes);
		tree.framesetOk = false;
	};

	modes.inBody.startTagTable = function(name, attributes) {
		if (tree.compatMode !== "quirks")
			if (tree.openElements.inButtonScope('p'))
				this.processEndTag('p');
		tree.insertElement(name, attributes);
		tree.setInsertionMode('inTable');
		tree.framesetOk = false;
	};

	modes.inBody.startTagVoidFormatting = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		tree.insertSelfClosingElement(name, attributes);
		tree.framesetOk = false;
	};

	modes.inBody.startTagParamSourceTrack = function(name, attributes) {
		tree.insertSelfClosingElement(name, attributes);
	};

	modes.inBody.startTagHr = function(name, attributes) {
		if (tree.openElements.inButtonScope('p'))
			this.endTagP('p');
		tree.insertSelfClosingElement(name, attributes);
		tree.framesetOk = false;
	};

	modes.inBody.startTagImage = function(name, attributes) {
		// No, really...
		tree.parseError('unexpected-start-tag-treated-as', {originalName: 'image', newName: 'img'});
		this.processStartTag('img', attributes);
	};

	modes.inBody.startTagInput = function(name, attributes) {
		var currentFramesetOk = tree.framesetOk;
		this.startTagVoidFormatting(name, attributes);
		for (var key in attributes) {
			// input type=hidden doesn't change framesetOk
			if (attributes[key].nodeName == 'type') {
				if (attributes[key].nodeValue.toLowerCase() == 'hidden')
					tree.framesetOk = currentFramesetOk;
				break;
			}
		}
	};

	modes.inBody.startTagIsindex = function(name, attributes) {
		tree.parseError('deprecated-tag', {name: 'isindex'});
		tree.selfClosingFlagAcknowledged = true;
		if (tree.form)
			return;
		var formAttributes = [];
		var inputAttributes = [];
		var prompt = "This is a searchable index. Enter search keywords: ";
		for (var key in attributes) {
			switch (attributes[key].nodeName) {
				case 'action':
					formAttributes.push({nodeName: 'action',
						nodeValue: attributes[key].nodeValue});
					break;
				case 'prompt':
					prompt = attributes[key].nodeValue;
					break;
				case 'name':
					break;
				default:
					inputAttributes.push({nodeName: attributes[key].nodeName,
						nodeValue: attributes[key].nodeValue});
			}
		}
		inputAttributes.push({nodeName: 'name', nodeValue: 'isindex'});
		this.processStartTag('form', formAttributes);
		this.processStartTag('hr');
		this.processStartTag('label');
		this.processCharacters(new CharacterBuffer(prompt));
		this.processStartTag('input', inputAttributes);
		this.processEndTag('label');
		this.processStartTag('hr');
		this.processEndTag('form');
	};

	modes.inBody.startTagTextarea = function(name, attributes) {
		// XXX Form element pointer checking here as well...
		tree.insertElement(name, attributes);
		tree.tokenizer.setState(Tokenizer.RCDATA);
		tree.originalInsertionMode = tree.insertionModeName;
		tree.shouldSkipLeadingNewline = true;
		tree.framesetOk = false;
		tree.setInsertionMode('text');
	};

	modes.inBody.startTagIFrame = function(name, attributes) {
		tree.framesetOk = false;
		this.startTagRawText(name, attributes);
	};

	modes.inBody.startTagRawText = function(name, attributes) {
		tree.processGenericRawTextStartTag(name, attributes);
	};

	modes.inBody.startTagSelect = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		tree.insertElement(name, attributes);
		tree.framesetOk = false;
		var insertionModeName = tree.insertionModeName;
		if (insertionModeName == 'inTable' ||
			insertionModeName == 'inCaption' ||
			insertionModeName == 'inColumnGroup' ||
			insertionModeName == 'inTableBody' ||
			insertionModeName == 'inRow' ||
			insertionModeName == 'inCell') {
			tree.setInsertionMode('inSelectInTable');
		} else {
			tree.setInsertionMode('inSelect');
		}
	};

	modes.inBody.startTagMisplaced = function(name, attributes) {
		tree.parseError('unexpected-start-tag-ignored', {name: name});
	};

	modes.inBody.endTagMisplaced = function(name) {
		// This handles elements with end tags in other insertion modes.
		tree.parseError("unexpected-end-tag", {name: name});
	};

	modes.inBody.endTagBr = function(name) {
		tree.parseError("unexpected-end-tag-treated-as", {originalName: "br", newName: "br element"});
		tree.reconstructActiveFormattingElements();
		tree.insertElement(name, []);
		tree.popElement();
	};

	modes.inBody.startTagOptionOptgroup = function(name, attributes) {
		if (tree.currentStackItem().localName == 'option')
			tree.popElement();
		tree.reconstructActiveFormattingElements();
		tree.insertElement(name, attributes);
	};

	modes.inBody.startTagOther = function(name, attributes) {
		tree.reconstructActiveFormattingElements();
		tree.insertElement(name, attributes);
	};

	modes.inBody.endTagOther = function(name) {
		var node;
		for (var i = tree.openElements.length - 1; i > 0; i--) {
			node = tree.openElements.item(i);
			if (node.localName == name) {
				tree.generateImpliedEndTags(name);
				if (tree.currentStackItem().localName != name)
					tree.parseError('unexpected-end-tag', {name: name});
				// todo optimize
				tree.openElements.remove_openElements_until(function(x) {return x === node;});
				break;
			}
			if (node.isSpecial()) {
				tree.parseError('unexpected-end-tag', {name: name});
				break;
			}
		}
	};

	modes.inBody.startTagMath = function(name, attributes, selfClosing) {
		tree.reconstructActiveFormattingElements();
		attributes = tree.adjustMathMLAttributes(attributes);
		attributes = tree.adjustForeignAttributes(attributes);
		tree.insertForeignElement(name, attributes, "http://www.w3.org/1998/Math/MathML", selfClosing);
		// Need to get the parse error right for the case where the token
		// has a namespace not equal to the xmlns attribute
	};

	modes.inBody.startTagSVG = function(name, attributes, selfClosing) {
		tree.reconstructActiveFormattingElements();
		attributes = tree.adjustSVGAttributes(attributes);
		attributes = tree.adjustForeignAttributes(attributes);
		tree.insertForeignElement(name, attributes, "http://www.w3.org/2000/svg", selfClosing);
		// Need to get the parse error right for the case where the token
		// has a namespace not equal to the xmlns attribute
	};

	modes.inBody.endTagP = function(name) {
		if (!tree.openElements.inButtonScope('p')) {
			tree.parseError('unexpected-end-tag', {name: 'p'});
			this.startTagCloseP('p', []);
			this.endTagP('p');
		} else {
			tree.generateImpliedEndTags('p');
			if (tree.currentStackItem().localName != 'p')
				tree.parseError('unexpected-end-tag', {name: 'p'});
			tree.openElements.popUntilPopped(name);
		}
	};

	modes.inBody.endTagBody = function(name) {
		if (!tree.openElements.inScope('body')) {
			tree.parseError('unexpected-end-tag', {name: name});
			return;
		}

		/// @todo Emit parse error on end tags other than the ones listed in http://www.w3.org/TR/html5/tree-construction.html#parsing-main-inbody
		// ['dd', 'dt', 'li', 'optgroup', 'option', 'p', 'rp', 'rt', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'body', 'html']
		if (tree.currentStackItem().localName != 'body') {
			tree.parseError('expected-one-end-tag-but-got-another', {
				expectedName: tree.currentStackItem().localName,
				gotName: name
			});
		}
		tree.setInsertionMode('afterBody');
	};

	modes.inBody.endTagHtml = function(name) {
		if (!tree.openElements.inScope('body')) {
			tree.parseError('unexpected-end-tag', {name: name});
			return;
		}

		/// @todo Emit parse error on end tags other than the ones listed in http://www.w3.org/TR/html5/tree-construction.html#parsing-main-inbody
		// ['dd', 'dt', 'li', 'optgroup', 'option', 'p', 'rp', 'rt', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'body', 'html']
		if (tree.currentStackItem().localName != 'body') {
			tree.parseError('expected-one-end-tag-but-got-another', {
				expectedName: tree.currentStackItem().localName,
				gotName: name
			});
		}
		tree.setInsertionMode('afterBody');
		tree.insertionMode.processEndTag(name);
	};

	modes.inBody.endTagBlock = function(name) {
		if (!tree.openElements.inScope(name)) {
			tree.parseError('unexpected-end-tag', {name: name});
		} else {
			tree.generateImpliedEndTags();
			if (tree.currentStackItem().localName != name) {
				tree.parseError('end-tag-too-early', {name: name});
			}
			tree.openElements.popUntilPopped(name);
		}
	};

	modes.inBody.endTagForm = function(name)  {
		var node = tree.form;
		tree.form = null;
		if (!node || !tree.openElements.inScope(name)) {
			tree.parseError('unexpected-end-tag', {name: name});
		} else {
			tree.generateImpliedEndTags();
			if (tree.currentStackItem() != node) {
				tree.parseError('end-tag-too-early-ignored', {name: 'form'});
			}
			tree.openElements.remove(node);
		}
	};

	modes.inBody.endTagListItem = function(name) {
		if (!tree.openElements.inListItemScope(name)) {
			tree.parseError('unexpected-end-tag', {name: name});
		} else {
			tree.generateImpliedEndTags(name);
			if (tree.currentStackItem().localName != name)
				tree.parseError('end-tag-too-early', {name: name});
			tree.openElements.popUntilPopped(name);
		}
	};

	modes.inBody.endTagHeading = function(name) {
		if (!tree.openElements.hasNumberedHeaderElementInScope()) {
			tree.parseError('unexpected-end-tag', {name: name});
			return;
		}
		tree.generateImpliedEndTags();
		if (tree.currentStackItem().localName != name)
			tree.parseError('end-tag-too-early', {name: name});

		tree.openElements.remove_openElements_until(function(e) {
			return e.isNumberedHeader();
		});
	};

	modes.inBody.endTagFormatting = function(name, attributes) {
		if (!tree.adoptionAgencyEndTag(name))
			this.endTagOther(name, attributes);
	};

	modes.inCaption = Object.create(modes.base);

	modes.inCaption.start_tag_handlers = {
		html: 'startTagHtml',
		caption: 'startTagTableElement',
		col: 'startTagTableElement',
		colgroup: 'startTagTableElement',
		tbody: 'startTagTableElement',
		td: 'startTagTableElement',
		tfoot: 'startTagTableElement',
		thead: 'startTagTableElement',
		tr: 'startTagTableElement',
		'-default': 'startTagOther'
	};

	modes.inCaption.end_tag_handlers = {
		caption: 'endTagCaption',
		table: 'endTagTable',
		body: 'endTagIgnore',
		col: 'endTagIgnore',
		colgroup: 'endTagIgnore',
		html: 'endTagIgnore',
		tbody: 'endTagIgnore',
		td: 'endTagIgnore',
		tfood: 'endTagIgnore',
		thead: 'endTagIgnore',
		tr: 'endTagIgnore',
		'-default': 'endTagOther'
	};

	modes.inCaption.processCharacters = function(data) {
		modes.inBody.processCharacters(data);
	};

	modes.inCaption.startTagTableElement = function(name, attributes) {
		tree.parseError('unexpected-end-tag', {name: name});
		var ignoreEndTag = !tree.openElements.inTableScope('caption');
		tree.insertionMode.processEndTag('caption');
		if (!ignoreEndTag) tree.insertionMode.processStartTag(name, attributes);
	};

	modes.inCaption.startTagOther = function(name, attributes, selfClosing) {
		modes.inBody.processStartTag(name, attributes, selfClosing);
	};

	modes.inCaption.endTagCaption = function(name) {
		if (!tree.openElements.inTableScope('caption')) {
			// context case
			assert.ok(tree.context);
			tree.parseError('unexpected-end-tag', {name: name});
		} else {
			// AT this code is quite similar to endTagTable in inTable
			tree.generateImpliedEndTags();
			if (tree.currentStackItem().localName != 'caption') {
				// @todo this is confusing for implied end tag
				tree.parseError('expected-one-end-tag-but-got-another', {
					gotName: "caption",
					expectedName: tree.currentStackItem().localName
				});
			}
			tree.openElements.popUntilPopped('caption');
			tree.clearActiveFormattingElements();
			tree.setInsertionMode('inTable');
		}
	};

	modes.inCaption.endTagTable = function(name) {
		tree.parseError("unexpected-end-table-in-caption");
		var ignoreEndTag = !tree.openElements.inTableScope('caption');
		tree.insertionMode.processEndTag('caption');
		if (!ignoreEndTag) tree.insertionMode.processEndTag(name);
	};

	modes.inCaption.endTagIgnore = function(name) {
		tree.parseError('unexpected-end-tag', {name: name});
	};

	modes.inCaption.endTagOther = function(name) {
		modes.inBody.processEndTag(name);
	};

	modes.inCell = Object.create(modes.base);

	modes.inCell.start_tag_handlers = {
		html: 'startTagHtml',
		caption: 'startTagTableOther',
		col: 'startTagTableOther',
		colgroup: 'startTagTableOther',
		tbody: 'startTagTableOther',
		td: 'startTagTableOther',
		tfoot: 'startTagTableOther',
		th: 'startTagTableOther',
		thead: 'startTagTableOther',
		tr: 'startTagTableOther',
		'-default': 'startTagOther'
	};

	modes.inCell.end_tag_handlers = {
		td: 'endTagTableCell',
		th: 'endTagTableCell',
		body: 'endTagIgnore',
		caption: 'endTagIgnore',
		col: 'endTagIgnore',
		colgroup: 'endTagIgnore',
		html: 'endTagIgnore',
		table: 'endTagImply',
		tbody: 'endTagImply',
		tfoot: 'endTagImply',
		thead: 'endTagImply',
		tr: 'endTagImply',
		'-default': 'endTagOther'
	};

	modes.inCell.processCharacters = function(data) {
		modes.inBody.processCharacters(data);
	};

	modes.inCell.startTagTableOther = function(name, attributes, selfClosing) {
		if (tree.openElements.inTableScope('td') || tree.openElements.inTableScope('th')) {
			this.closeCell();
			tree.insertionMode.processStartTag(name, attributes, selfClosing);
		} else {
			// context case
			tree.parseError('unexpected-start-tag', {name: name});
		}
	};

	modes.inCell.startTagOther = function(name, attributes, selfClosing) {
		modes.inBody.processStartTag(name, attributes, selfClosing);
	};

	modes.inCell.endTagTableCell = function(name) {
		if (tree.openElements.inTableScope(name)) {
			tree.generateImpliedEndTags(name);
			if (tree.currentStackItem().localName != name.toLowerCase()) {
				tree.parseError('unexpected-cell-end-tag', {name: name});
				tree.openElements.popUntilPopped(name);
			} else {
				tree.popElement();
			}
			tree.clearActiveFormattingElements();
			tree.setInsertionMode('inRow');
		} else {
			tree.parseError('unexpected-end-tag', {name: name});
		}
	};

	modes.inCell.endTagIgnore = function(name) {
		tree.parseError('unexpected-end-tag', {name: name});
	};

	modes.inCell.endTagImply = function(name) {
		if (tree.openElements.inTableScope(name)) {
			this.closeCell();
			tree.insertionMode.processEndTag(name);
		} else {
			// sometimes context case
			tree.parseError('unexpected-end-tag', {name: name});
		}
	};

	modes.inCell.endTagOther = function(name) {
		modes.inBody.processEndTag(name);
	};

	modes.inCell.closeCell = function() {
		if (tree.openElements.inTableScope('td')) {
			this.endTagTableCell('td');
		} else if (tree.openElements.inTableScope('th')) {
			this.endTagTableCell('th');
		}
	};


	modes.inColumnGroup = Object.create(modes.base);

	modes.inColumnGroup.start_tag_handlers = {
		html: 'startTagHtml',
		col: 'startTagCol',
		'-default': 'startTagOther'
	};

	modes.inColumnGroup.end_tag_handlers = {
		colgroup: 'endTagColgroup',
		col: 'endTagCol',
		'-default': 'endTagOther'
	};

	modes.inColumnGroup.ignoreEndTagColgroup = function() {
		return tree.currentStackItem().localName == 'html';
	};

	modes.inColumnGroup.processCharacters = function(buffer) {
		var leadingWhitespace = buffer.takeLeadingWhitespace();
		if (leadingWhitespace)
			tree.insertText(leadingWhitespace);
		if (!buffer.length)
			return;
		var ignoreEndTag = this.ignoreEndTagColgroup();
		this.endTagColgroup('colgroup');
		if (!ignoreEndTag) tree.insertionMode.processCharacters(buffer);
	};

	modes.inColumnGroup.startTagCol = function(name, attributes) {
		tree.insertSelfClosingElement(name, attributes);
	};

	modes.inColumnGroup.startTagOther = function(name, attributes, selfClosing) {
		var ignoreEndTag = this.ignoreEndTagColgroup();
		this.endTagColgroup('colgroup');
		if (!ignoreEndTag) tree.insertionMode.processStartTag(name, attributes, selfClosing);
	};

	modes.inColumnGroup.endTagColgroup = function(name) {
		if (this.ignoreEndTagColgroup()) {
			// context case
			assert.ok(tree.context);
			tree.parseError('unexpected-end-tag', {name: name});
		} else {
			tree.popElement();
			tree.setInsertionMode('inTable');
		}
	};

	modes.inColumnGroup.endTagCol = function(name) {
		tree.parseError("no-end-tag", {name: 'col'});
	};

	modes.inColumnGroup.endTagOther = function(name) {
		var ignoreEndTag = this.ignoreEndTagColgroup();
		this.endTagColgroup('colgroup');
		if (!ignoreEndTag) tree.insertionMode.processEndTag(name) ;
	};

	modes.inForeignContent = Object.create(modes.base);

	modes.inForeignContent.processStartTag = function(name, attributes, selfClosing) {
		if (['b', 'big', 'blockquote', 'body', 'br', 'center', 'code', 'dd', 'div', 'dl', 'dt', 'em', 'embed', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'i', 'img', 'li', 'listing', 'menu', 'meta', 'nobr', 'ol', 'p', 'pre', 'ruby', 's', 'small', 'span', 'strong', 'strike', 'sub', 'sup', 'table', 'tt', 'u', 'ul', 'var'].indexOf(name) != -1
				|| (name == 'font' && attributes.some(function(attr){ return ['color', 'face', 'size'].indexOf(attr.nodeName) >= 0 }))) {
			tree.parseError('unexpected-html-element-in-foreign-content', {name: name});
			while (tree.currentStackItem().isForeign()
				&& !tree.currentStackItem().isHtmlIntegrationPoint()
				&& !tree.currentStackItem().isMathMLTextIntegrationPoint()) {
				tree.openElements.pop();
			}
			tree.insertionMode.processStartTag(name, attributes, selfClosing);
			return;
		}
		if (tree.currentStackItem().namespaceURI == "http://www.w3.org/1998/Math/MathML") {
			attributes = tree.adjustMathMLAttributes(attributes);
		}
		if (tree.currentStackItem().namespaceURI == "http://www.w3.org/2000/svg") {
			name = tree.adjustSVGTagNameCase(name);
			attributes = tree.adjustSVGAttributes(attributes);
		}
		attributes = tree.adjustForeignAttributes(attributes);
		tree.insertForeignElement(name, attributes, tree.currentStackItem().namespaceURI, selfClosing);
	};

	modes.inForeignContent.processEndTag = function(name) {
		var node = tree.currentStackItem();
		var index = tree.openElements.length - 1;
		if (node.localName.toLowerCase() != name)
			tree.parseError("unexpected-end-tag", {name: name});

		while (true) {
			if (index === 0)
				break;
			if (node.localName.toLowerCase() == name) {
				while (tree.openElements.pop() != node);
				break;
			}
			index -= 1;
			node = tree.openElements.item(index);
			if (node.isForeign()) {
				continue;
			} else {
				tree.insertionMode.processEndTag(name);
				break;
			}
		}
	};

	modes.inForeignContent.processCharacters = function(buffer) {
		var characters = buffer.takeRemaining();
		characters = characters.replace(/\u0000/g, function(match, index){
			// @todo position
			tree.parseError('invalid-codepoint');
			return '\uFFFD';
		});
		if (tree.framesetOk && !isAllWhitespaceOrReplacementCharacters(characters))
			tree.framesetOk = false;
		tree.insertText(characters);
	};

	modes.inHeadNoscript = Object.create(modes.base);

	modes.inHeadNoscript.start_tag_handlers = {
		html: 'startTagHtml',
		basefont: 'startTagBasefontBgsoundLinkMetaNoframesStyle',
		bgsound: 'startTagBasefontBgsoundLinkMetaNoframesStyle',
		link: 'startTagBasefontBgsoundLinkMetaNoframesStyle',
		meta: 'startTagBasefontBgsoundLinkMetaNoframesStyle',
		noframes: 'startTagBasefontBgsoundLinkMetaNoframesStyle',
		style: 'startTagBasefontBgsoundLinkMetaNoframesStyle',
		head: 'startTagHeadNoscript',
		noscript: 'startTagHeadNoscript',
		"-default": 'startTagOther'
	};

	modes.inHeadNoscript.end_tag_handlers = {
		noscript: 'endTagNoscript',
		br: 'endTagBr',
		'-default': 'endTagOther'
	};

	modes.inHeadNoscript.processCharacters = function(buffer) {
		var leadingWhitespace = buffer.takeLeadingWhitespace();
		if (leadingWhitespace)
			tree.insertText(leadingWhitespace);
		if (!buffer.length)
			return;
		// FIXME error message
		tree.parseError("unexpected-char-in-frameset");
		this.anythingElse();
		tree.insertionMode.processCharacters(buffer);
	};

	modes.inHeadNoscript.processComment = function(data) {
		modes.inHead.processComment(data);
	};

	modes.inHeadNoscript.startTagHtml = function(name, attributes) {
		modes.inBody.processStartTag(name, attributes);
	};

	modes.inHeadNoscript.startTagBasefontBgsoundLinkMetaNoframesStyle = function(name, attributes) {
		modes.inHead.processStartTag(name, attributes);
	};

	modes.inHeadNoscript.startTagHeadNoscript = function(name, attributes) {
		// FIXME error message
		tree.parseError("unexpected-start-tag-in-frameset", {name: name});
	};

	modes.inHeadNoscript.startTagOther = function(name, attributes) {
		// FIXME error message
		tree.parseError("unexpected-start-tag-in-frameset", {name: name});
		this.anythingElse();
		tree.insertionMode.processStartTag(name, attributes);
	};

	modes.inHeadNoscript.endTagBr = function(name, attributes) {
		// FIXME error message
		tree.parseError("unexpected-end-tag-in-frameset", {name: name});
		this.anythingElse();
		tree.insertionMode.processEndTag(name, attributes);
	};

	modes.inHeadNoscript.endTagNoscript = function(name, attributes) {
		tree.popElement();
		tree.setInsertionMode('inHead');
	};

	modes.inHeadNoscript.endTagOther = function(name, attributes) {
		// FIXME error message
		tree.parseError("unexpected-end-tag-in-frameset", {name: name});
	};

	modes.inHeadNoscript.anythingElse = function() {
		tree.popElement();
		tree.setInsertionMode('inHead');
	};


	modes.inFrameset = Object.create(modes.base);

	modes.inFrameset.start_tag_handlers = {
		html: 'startTagHtml',
		frameset: 'startTagFrameset',
		frame: 'startTagFrame',
		noframes: 'startTagNoframes',
		"-default": 'startTagOther'
	};

	modes.inFrameset.end_tag_handlers = {
		frameset: 'endTagFrameset',
		noframes: 'endTagNoframes',
		'-default': 'endTagOther'
	};

	modes.inFrameset.processCharacters = function(data) {
		tree.parseError("unexpected-char-in-frameset");
	};

	modes.inFrameset.startTagFrameset = function(name, attributes) {
		tree.insertElement(name, attributes);
	};

	modes.inFrameset.startTagFrame = function(name, attributes) {
		tree.insertSelfClosingElement(name, attributes);
	};

	modes.inFrameset.startTagNoframes = function(name, attributes) {
		modes.inBody.processStartTag(name, attributes);
	};

	modes.inFrameset.startTagOther = function(name, attributes) {
		tree.parseError("unexpected-start-tag-in-frameset", {name: name});
	};

	modes.inFrameset.endTagFrameset = function(name, attributes) {
		if (tree.currentStackItem().localName == 'html') {
			// context case
			tree.parseError("unexpected-frameset-in-frameset-innerhtml");
		} else {
			tree.popElement();
		}

		if (!tree.context && tree.currentStackItem().localName != 'frameset') {
			// If we're not in context mode an the current node is not a "frameset" element (anymore) then switch
			tree.setInsertionMode('afterFrameset');
		}
	};

	modes.inFrameset.endTagNoframes = function(name) {
		modes.inBody.processEndTag(name);
	};

	modes.inFrameset.endTagOther = function(name) {
		tree.parseError("unexpected-end-tag-in-frameset", {name: name});
	};

	modes.inTable = Object.create(modes.base);

	modes.inTable.start_tag_handlers = {
		html: 'startTagHtml',
		caption: 'startTagCaption',
		colgroup: 'startTagColgroup',
		col: 'startTagCol',
		table: 'startTagTable',
		tbody: 'startTagRowGroup',
		tfoot: 'startTagRowGroup',
		thead: 'startTagRowGroup',
		td: 'startTagImplyTbody',
		th: 'startTagImplyTbody',
		tr: 'startTagImplyTbody',
		style: 'startTagStyleScript',
		script: 'startTagStyleScript',
		input: 'startTagInput',
		form: 'startTagForm',
		'-default': 'startTagOther'
	};

	modes.inTable.end_tag_handlers = {
		table: 'endTagTable',
		body: 'endTagIgnore',
		caption: 'endTagIgnore',
		col: 'endTagIgnore',
		colgroup: 'endTagIgnore',
		html: 'endTagIgnore',
		tbody: 'endTagIgnore',
		td: 'endTagIgnore',
		tfoot: 'endTagIgnore',
		th: 'endTagIgnore',
		thead: 'endTagIgnore',
		tr: 'endTagIgnore',
		'-default': 'endTagOther'
	};

	modes.inTable.processCharacters =  function(data) {
		if (tree.currentStackItem().isFosterParenting()) {
			var originalInsertionMode = tree.insertionModeName;
			tree.setInsertionMode('inTableText');
			tree.originalInsertionMode = originalInsertionMode;
			tree.insertionMode.processCharacters(data);
		} else {
			tree.redirectAttachToFosterParent = true;
			modes.inBody.processCharacters(data);
			tree.redirectAttachToFosterParent = false;
		}
	};

	modes.inTable.startTagCaption = function(name, attributes) {
		tree.openElements.popUntilTableScopeMarker();
		tree.activeFormattingElements.push(Marker);
		tree.insertElement(name, attributes);
		tree.setInsertionMode('inCaption');
	};

	modes.inTable.startTagColgroup = function(name, attributes) {
		tree.openElements.popUntilTableScopeMarker();
		tree.insertElement(name, attributes);
		tree.setInsertionMode('inColumnGroup');
	};

	modes.inTable.startTagCol = function(name, attributes) {
		this.startTagColgroup('colgroup', []);
		tree.insertionMode.processStartTag(name, attributes);
	};

	modes.inTable.startTagRowGroup = function(name, attributes) {
		tree.openElements.popUntilTableScopeMarker();
		tree.insertElement(name, attributes);
		tree.setInsertionMode('inTableBody');
	};

	modes.inTable.startTagImplyTbody = function(name, attributes) {
		this.startTagRowGroup('tbody', []);
		tree.insertionMode.processStartTag(name, attributes);
	};

	modes.inTable.startTagTable = function(name, attributes) {
		tree.parseError("unexpected-start-tag-implies-end-tag",
				{startName: "table", endName: "table"});
		tree.insertionMode.processEndTag('table');
		if (!tree.context) tree.insertionMode.processStartTag(name, attributes);
	};

	modes.inTable.startTagStyleScript = function(name, attributes) {
		modes.inHead.processStartTag(name, attributes);
	};

	modes.inTable.startTagInput = function(name, attributes) {
		for (var key in attributes) {
			if (attributes[key].nodeName.toLowerCase() == 'type') {
				if (attributes[key].nodeValue.toLowerCase() == 'hidden') {
					tree.parseError("unexpected-hidden-input-in-table");
					tree.insertElement(name, attributes);
					// XXX associate with form
					tree.openElements.pop();
					return;
				}
				break;
			}
		}
		this.startTagOther(name, attributes);
	};

	modes.inTable.startTagForm = function(name, attributes) {
		tree.parseError("unexpected-form-in-table");
		if (!tree.form) {
			tree.insertElement(name, attributes);
			tree.form = tree.currentStackItem();
			tree.openElements.pop();
		}
	};

	modes.inTable.startTagOther = function(name, attributes, selfClosing) {
		tree.parseError("unexpected-start-tag-implies-table-voodoo", {name: name});
		tree.redirectAttachToFosterParent = true;
		modes.inBody.processStartTag(name, attributes, selfClosing);
		tree.redirectAttachToFosterParent = false;
	};

	modes.inTable.endTagTable = function(name) {
		if (tree.openElements.inTableScope(name)) {
			tree.generateImpliedEndTags();
			if (tree.currentStackItem().localName != name) {
				tree.parseError("end-tag-too-early-named", {gotName: 'table', expectedName: tree.currentStackItem().localName});
			}

			tree.openElements.popUntilPopped('table');
			tree.resetInsertionMode();
		} else {
			assert.ok(tree.context);
			tree.parseError('unexpected-end-tag', {name: name});
		}
	};

	modes.inTable.endTagIgnore = function(name) {
		tree.parseError("unexpected-end-tag", {name: name});
	};

	modes.inTable.endTagOther = function(name) {
		tree.parseError("unexpected-end-tag-implies-table-voodoo", {name: name});
		// Make all the special element rearranging voodoo kick in
		tree.redirectAttachToFosterParent = true;
		// Process the end tag in the "in body" mode
		modes.inBody.processEndTag(name);
		tree.redirectAttachToFosterParent = false;
	};

	modes.inTableText = Object.create(modes.base);

	modes.inTableText.flushCharacters = function() {
		var characters = tree.pendingTableCharacters.join('');
		if (!isAllWhitespace(characters)) {
			tree.redirectAttachToFosterParent = true;
			tree.reconstructActiveFormattingElements();
			tree.insertText(characters);
			tree.framesetOk = false;
			tree.redirectAttachToFosterParent = false;
		} else {
			tree.insertText(characters);
		}
		tree.pendingTableCharacters = [];
	};

	modes.inTableText.processComment = function(data) {
		this.flushCharacters();
		tree.setInsertionMode(tree.originalInsertionMode);
		tree.insertionMode.processComment(data);
	};

	modes.inTableText.processEOF = function(data) {
		this.flushCharacters();
		tree.setInsertionMode(tree.originalInsertionMode);
		tree.insertionMode.processEOF();
	};

	modes.inTableText.processCharacters = function(buffer) {
		var characters = buffer.takeRemaining();
		characters = characters.replace(/\u0000/g, function(match, index){
			// @todo position
			tree.parseError("invalid-codepoint");
			return '';
		});
		if (!characters)
			return;
		tree.pendingTableCharacters.push(characters);
	};

	modes.inTableText.processStartTag = function(name, attributes, selfClosing) {
		this.flushCharacters();
		tree.setInsertionMode(tree.originalInsertionMode);
		tree.insertionMode.processStartTag(name, attributes, selfClosing);
	};

	modes.inTableText.processEndTag = function(name, attributes) {
		this.flushCharacters();
		tree.setInsertionMode(tree.originalInsertionMode);
		tree.insertionMode.processEndTag(name, attributes);
	};

	modes.inTableBody = Object.create(modes.base);

	modes.inTableBody.start_tag_handlers = {
		html: 'startTagHtml',
		tr: 'startTagTr',
		td: 'startTagTableCell',
		th: 'startTagTableCell',
		caption: 'startTagTableOther',
		col: 'startTagTableOther',
		colgroup: 'startTagTableOther',
		tbody: 'startTagTableOther',
		tfoot: 'startTagTableOther',
		thead: 'startTagTableOther',
		'-default': 'startTagOther'
	};

	modes.inTableBody.end_tag_handlers = {
		table: 'endTagTable',
		tbody: 'endTagTableRowGroup',
		tfoot: 'endTagTableRowGroup',
		thead: 'endTagTableRowGroup',
		body: 'endTagIgnore',
		caption: 'endTagIgnore',
		col: 'endTagIgnore',
		colgroup: 'endTagIgnore',
		html: 'endTagIgnore',
		td: 'endTagIgnore',
		th: 'endTagIgnore',
		tr: 'endTagIgnore',
		'-default': 'endTagOther'
	};

	modes.inTableBody.processCharacters = function(data) {
		modes.inTable.processCharacters(data);
	};

	modes.inTableBody.startTagTr = function(name, attributes) {
		tree.openElements.popUntilTableBodyScopeMarker();
		tree.insertElement(name, attributes);
		tree.setInsertionMode('inRow');
	};

	modes.inTableBody.startTagTableCell = function(name, attributes) {
		tree.parseError("unexpected-cell-in-table-body", {name: name});
		this.startTagTr('tr', []);
		tree.insertionMode.processStartTag(name, attributes);
	};

	modes.inTableBody.startTagTableOther = function(name, attributes) {
		// XXX any ideas on how to share this with endTagTable
		if (tree.openElements.inTableScope('tbody') ||  tree.openElements.inTableScope('thead') || tree.openElements.inTableScope('tfoot')) {
			tree.openElements.popUntilTableBodyScopeMarker();
			this.endTagTableRowGroup(tree.currentStackItem().localName);
			tree.insertionMode.processStartTag(name, attributes);
		} else {
			// context case
			tree.parseError('unexpected-start-tag', {name: name});
		}
	};

	modes.inTableBody.startTagOther = function(name, attributes) {
		modes.inTable.processStartTag(name, attributes);
	};

	modes.inTableBody.endTagTableRowGroup = function(name) {
		if (tree.openElements.inTableScope(name)) {
			tree.openElements.popUntilTableBodyScopeMarker();
			tree.popElement();
			tree.setInsertionMode('inTable');
		} else {
			tree.parseError('unexpected-end-tag-in-table-body', {name: name});
		}
	};

	modes.inTableBody.endTagTable = function(name) {
		if (tree.openElements.inTableScope('tbody') ||  tree.openElements.inTableScope('thead') || tree.openElements.inTableScope('tfoot')) {
			tree.openElements.popUntilTableBodyScopeMarker();
			this.endTagTableRowGroup(tree.currentStackItem().localName);
			tree.insertionMode.processEndTag(name);
		} else {
			// context case
			tree.parseError('unexpected-end-tag', {name: name});
		}
	};

	modes.inTableBody.endTagIgnore = function(name) {
		tree.parseError("unexpected-end-tag-in-table-body", {name: name});
	};

	modes.inTableBody.endTagOther = function(name) {
		modes.inTable.processEndTag(name);
	};

	modes.inSelect = Object.create(modes.base);

	modes.inSelect.start_tag_handlers = {
		html: 'startTagHtml',
		option: 'startTagOption',
		optgroup: 'startTagOptgroup',
		select: 'startTagSelect',
		input: 'startTagInput',
		keygen: 'startTagInput',
		textarea: 'startTagInput',
		script: 'startTagScript',
		'-default': 'startTagOther'
	};

	modes.inSelect.end_tag_handlers = {
		option: 'endTagOption',
		optgroup: 'endTagOptgroup',
		select: 'endTagSelect',
		caption: 'endTagTableElements',
		table: 'endTagTableElements',
		tbody: 'endTagTableElements',
		tfoot: 'endTagTableElements',
		thead: 'endTagTableElements',
		tr: 'endTagTableElements',
		td: 'endTagTableElements',
		th: 'endTagTableElements',
		'-default': 'endTagOther'
	};

	modes.inSelect.processCharacters = function(buffer) {
		var data = buffer.takeRemaining();
		data = data.replace(/\u0000/g, function(match, index){
			// @todo position
			tree.parseError("invalid-codepoint");
			return '';
		});
		if (!data)
			return;
		tree.insertText(data);
	};

	modes.inSelect.startTagOption = function(name, attributes) {
		// we need to imply </option> if <option> is the current node
		if (tree.currentStackItem().localName == 'option')
			tree.popElement();
		tree.insertElement(name, attributes);
	};

	modes.inSelect.startTagOptgroup = function(name, attributes) {
		if (tree.currentStackItem().localName == 'option')
			tree.popElement();
		if (tree.currentStackItem().localName == 'optgroup')
			tree.popElement();
		tree.insertElement(name, attributes);
	};

	modes.inSelect.endTagOption = function(name) {
		if (tree.currentStackItem().localName !== 'option') {
			tree.parseError('unexpected-end-tag-in-select', {name: name});
			return;
		}
		tree.popElement();
	};

	modes.inSelect.endTagOptgroup = function(name) {
		// </optgroup> implicitly closes <option>
		if (tree.currentStackItem().localName == 'option' && tree.openElements.item(tree.openElements.length - 2).localName == 'optgroup') {
			tree.popElement();
		}

		// it also closes </optgroup>
		if (tree.currentStackItem().localName == 'optgroup') {
			tree.popElement();
		} else {
			// But nothing else
			tree.parseError('unexpected-end-tag-in-select', {name: 'optgroup'});
		}
	};

	modes.inSelect.startTagSelect = function(name) {
		tree.parseError("unexpected-select-in-select");
		this.endTagSelect('select');
	};

	modes.inSelect.endTagSelect = function(name) {
		if (tree.openElements.inTableScope('select')) {
			tree.openElements.popUntilPopped('select');
			tree.resetInsertionMode();
		} else {
			// context case
			tree.parseError('unexpected-end-tag', {name: name});
		}
	};

	modes.inSelect.startTagInput = function(name, attributes) {
		tree.parseError("unexpected-input-in-select");
		if (tree.openElements.inSelectScope('select')) {
			this.endTagSelect('select');
			tree.insertionMode.processStartTag(name, attributes);
		}
	};

	modes.inSelect.startTagScript = function(name, attributes) {
		modes.inHead.processStartTag(name, attributes);
	};

	modes.inSelect.endTagTableElements = function(name) {
		tree.parseError('unexpected-end-tag-in-select', {name: name});
		if (tree.openElements.inTableScope(name)) {
			this.endTagSelect('select');
			tree.insertionMode.processEndTag(name);
		}
	};

	modes.inSelect.startTagOther = function(name, attributes) {
		tree.parseError("unexpected-start-tag-in-select", {name: name});
	};

	modes.inSelect.endTagOther = function(name) {
		tree.parseError('unexpected-end-tag-in-select', {name: name});
	};

	modes.inSelectInTable = Object.create(modes.base);

	modes.inSelectInTable.start_tag_handlers = {
		caption: 'startTagTable',
		table: 'startTagTable',
		tbody: 'startTagTable',
		tfoot: 'startTagTable',
		thead: 'startTagTable',
		tr: 'startTagTable',
		td: 'startTagTable',
		th: 'startTagTable',
		'-default': 'startTagOther'
	};

	modes.inSelectInTable.end_tag_handlers = {
		caption: 'endTagTable',
		table: 'endTagTable',
		tbody: 'endTagTable',
		tfoot: 'endTagTable',
		thead: 'endTagTable',
		tr: 'endTagTable',
		td: 'endTagTable',
		th: 'endTagTable',
		'-default': 'endTagOther'
	};

	modes.inSelectInTable.processCharacters = function(data) {
		modes.inSelect.processCharacters(data);
	};

	modes.inSelectInTable.startTagTable = function(name, attributes) {
		tree.parseError("unexpected-table-element-start-tag-in-select-in-table", {name: name});
		this.endTagOther("select");
		tree.insertionMode.processStartTag(name, attributes);
	};

	modes.inSelectInTable.startTagOther = function(name, attributes, selfClosing) {
		modes.inSelect.processStartTag(name, attributes, selfClosing);
	};

	modes.inSelectInTable.endTagTable = function(name) {
		tree.parseError("unexpected-table-element-end-tag-in-select-in-table", {name: name});
		if (tree.openElements.inTableScope(name)) {
			this.endTagOther("select");
			tree.insertionMode.processEndTag(name);
		}
	};

	modes.inSelectInTable.endTagOther = function(name) {
		modes.inSelect.processEndTag(name);
	};

	modes.inRow = Object.create(modes.base);

	modes.inRow.start_tag_handlers = {
		html: 'startTagHtml',
		td: 'startTagTableCell',
		th: 'startTagTableCell',
		caption: 'startTagTableOther',
		col: 'startTagTableOther',
		colgroup: 'startTagTableOther',
		tbody: 'startTagTableOther',
		tfoot: 'startTagTableOther',
		thead: 'startTagTableOther',
		tr: 'startTagTableOther',
		'-default': 'startTagOther'
	};

	modes.inRow.end_tag_handlers = {
		tr: 'endTagTr',
		table: 'endTagTable',
		tbody: 'endTagTableRowGroup',
		tfoot: 'endTagTableRowGroup',
		thead: 'endTagTableRowGroup',
		body: 'endTagIgnore',
		caption: 'endTagIgnore',
		col: 'endTagIgnore',
		colgroup: 'endTagIgnore',
		html: 'endTagIgnore',
		td: 'endTagIgnore',
		th: 'endTagIgnore',
		'-default': 'endTagOther'
	};

	modes.inRow.processCharacters = function(data) {
		modes.inTable.processCharacters(data);
	};

	modes.inRow.startTagTableCell = function(name, attributes) {
		tree.openElements.popUntilTableRowScopeMarker();
		tree.insertElement(name, attributes);
		tree.setInsertionMode('inCell');
		tree.activeFormattingElements.push(Marker);
	};

	modes.inRow.startTagTableOther = function(name, attributes) {
		var ignoreEndTag = this.ignoreEndTagTr();
		this.endTagTr('tr');
		// XXX how are we sure it's always ignored in the context case?
		if (!ignoreEndTag) tree.insertionMode.processStartTag(name, attributes);
	};

	modes.inRow.startTagOther = function(name, attributes, selfClosing) {
		modes.inTable.processStartTag(name, attributes, selfClosing);
	};

	modes.inRow.endTagTr = function(name) {
		if (this.ignoreEndTagTr()) {
			assert.ok(tree.context);
			tree.parseError('unexpected-end-tag', {name: name});
		} else {
			tree.openElements.popUntilTableRowScopeMarker();
			tree.popElement();
			tree.setInsertionMode('inTableBody');
		}
	};

	modes.inRow.endTagTable = function(name) {
		var ignoreEndTag = this.ignoreEndTagTr();
		this.endTagTr('tr');
		// Reprocess the current tag if the tr end tag was not ignored
		// XXX how are we sure it's always ignored in the context case?
		if (!ignoreEndTag) tree.insertionMode.processEndTag(name);
	};

	modes.inRow.endTagTableRowGroup = function(name) {
		if (tree.openElements.inTableScope(name)) {
			this.endTagTr('tr');
			tree.insertionMode.processEndTag(name);
		} else {
			// context case
			tree.parseError('unexpected-end-tag', {name: name});
		}
	};

	modes.inRow.endTagIgnore = function(name) {
		tree.parseError("unexpected-end-tag-in-table-row", {name: name});
	};

	modes.inRow.endTagOther = function(name) {
		modes.inTable.processEndTag(name);
	};

	modes.inRow.ignoreEndTagTr = function() {
		return !tree.openElements.inTableScope('tr');
	};

	modes.afterAfterFrameset = Object.create(modes.base);

	modes.afterAfterFrameset.start_tag_handlers = {
		html: 'startTagHtml',
		noframes: 'startTagNoFrames',
		'-default': 'startTagOther'
	};

	modes.afterAfterFrameset.processEOF = function() {};

	modes.afterAfterFrameset.processComment = function(data) {
		tree.insertComment(data, tree.document);
	};

	modes.afterAfterFrameset.processCharacters = function(buffer) {
		var characters = buffer.takeRemaining();
		var whitespace = "";
		for (var i = 0; i < characters.length; i++) {
			var ch = characters[i];
			if (isWhitespace(ch))
				whitespace += ch;
		}
		if (whitespace) {
			tree.reconstructActiveFormattingElements();
			tree.insertText(whitespace);
		}
		if (whitespace.length < characters.length)
			tree.parseError('expected-eof-but-got-char');
	};

	modes.afterAfterFrameset.startTagHtml = function(name, attributes) {
		modes.inBody.processStartTag(name, attributes);
	};

	modes.afterAfterFrameset.startTagNoFrames = function(name, attributes) {
		modes.inHead.processStartTag(name, attributes);
	};

	modes.afterAfterFrameset.startTagOther = function(name, attributes, selfClosing) {
		tree.parseError('expected-eof-but-got-start-tag', {name: name});
	};

	modes.afterAfterFrameset.processEndTag = function(name, attributes) {
		tree.parseError('expected-eof-but-got-end-tag', {name: name});
	};

	modes.text = Object.create(modes.base);

	modes.text.start_tag_handlers = {
		'-default': 'startTagOther'
	};

	modes.text.end_tag_handlers = {
		script: 'endTagScript',
		'-default': 'endTagOther'
	};

	modes.text.processCharacters = function(buffer) {
		if (tree.shouldSkipLeadingNewline) {
			tree.shouldSkipLeadingNewline = false;
			buffer.skipAtMostOneLeadingNewline();
		}
		var data = buffer.takeRemaining();
		if (!data)
			return;
		tree.insertText(data);
	};

	modes.text.processEOF = function() {
		tree.parseError("expected-named-closing-tag-but-got-eof",
			{name: tree.currentStackItem().localName});
		tree.openElements.pop();
		tree.setInsertionMode(tree.originalInsertionMode);
		tree.insertionMode.processEOF();
	};

	modes.text.startTagOther = function(name) {
		throw "Tried to process start tag " + name + " in RCDATA/RAWTEXT mode";
	};

	modes.text.endTagScript = function(name) {
		var node = tree.openElements.pop();
		assert.ok(node.localName == 'script');
		tree.setInsertionMode(tree.originalInsertionMode);
	};

	modes.text.endTagOther = function(name) {
		tree.openElements.pop();
		tree.setInsertionMode(tree.originalInsertionMode);
	};
}

TreeBuilder.prototype.setInsertionMode = function(name) {
	this.insertionMode = this.insertionModes[name];
	this.insertionModeName = name;
};

/**
 * Adoption agency algorithm (http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html#adoption-agency-algorithm)
 * @param {String} name A tag name subject for which the algorithm is being run
 * @return {Boolean} Returns false if the algorithm was aborted
 */
TreeBuilder.prototype.adoptionAgencyEndTag = function(name) {
	var outerIterationLimit = 8;
	var innerIterationLimit = 3;
	var formattingElement;

	function isActiveFormattingElement(el) {
		return el === formattingElement;
	}

	var outerLoopCounter = 0;

	while (outerLoopCounter++ < outerIterationLimit) {
		// 4.
		formattingElement = this.elementInActiveFormattingElements(name);

		if (!formattingElement || (this.openElements.contains(formattingElement) && !this.openElements.inScope(formattingElement.localName))) {
			this.parseError('adoption-agency-1.1', {name: name});
			return false;
		}
		if (!this.openElements.contains(formattingElement)) {
			this.parseError('adoption-agency-1.2', {name: name});
			this.removeElementFromActiveFormattingElements(formattingElement);
			return true;
		}
		if (!this.openElements.inScope(formattingElement.localName)) {
			this.parseError('adoption-agency-4.4', {name: name});
		}

		if (formattingElement != this.currentStackItem()) {
			this.parseError('adoption-agency-1.3', {name: name});
		}

		// Start of the adoption agency algorithm proper
		// todo ElementStack
		var furthestBlock = this.openElements.furthestBlockForFormattingElement(formattingElement.node);

		if (!furthestBlock) {
			this.openElements.remove_openElements_until(isActiveFormattingElement);
			this.removeElementFromActiveFormattingElements(formattingElement);
			return true;
		}

		var afeIndex = this.openElements.elements.indexOf(formattingElement);
		var commonAncestor = this.openElements.item(afeIndex - 1);

		var bookmark = this.activeFormattingElements.indexOf(formattingElement);

		var node = furthestBlock;
		var lastNode = furthestBlock;
		var index = this.openElements.elements.indexOf(node);

		var innerLoopCounter = 0;
		while (innerLoopCounter++ < innerIterationLimit) {
			index -= 1;
			node = this.openElements.item(index);
			if (this.activeFormattingElements.indexOf(node) < 0) {
				this.openElements.elements.splice(index, 1);
				continue;
			}
			if (node == formattingElement)
				break;

			if (lastNode == furthestBlock)
				bookmark = this.activeFormattingElements.indexOf(node) + 1;

			var clone = this.createElement(node.namespaceURI, node.localName, node.attributes);
			var newNode = new StackItem(node.namespaceURI, node.localName, node.attributes, clone);

			this.activeFormattingElements[this.activeFormattingElements.indexOf(node)] = newNode;
			this.openElements.elements[this.openElements.elements.indexOf(node)] = newNode;

			node = newNode;
			this.detachFromParent(lastNode.node);
			this.attachNode(lastNode.node, node.node);
			lastNode = node;
		}

		this.detachFromParent(lastNode.node);
		if (commonAncestor.isFosterParenting()) {
			this.insertIntoFosterParent(lastNode.node);
		} else {
			this.attachNode(lastNode.node, commonAncestor.node);
		}

		var clone = this.createElement("http://www.w3.org/1999/xhtml", formattingElement.localName, formattingElement.attributes);
		var formattingClone = new StackItem(formattingElement.namespaceURI, formattingElement.localName, formattingElement.attributes, clone);

		this.reparentChildren(furthestBlock.node, clone);
		this.attachNode(clone, furthestBlock.node);

		this.removeElementFromActiveFormattingElements(formattingElement);
		this.activeFormattingElements.splice(Math.min(bookmark, this.activeFormattingElements.length), 0, formattingClone);

		this.openElements.remove(formattingElement);
		this.openElements.elements.splice(this.openElements.elements.indexOf(furthestBlock) + 1, 0, formattingClone);
	}

	return true;
};

TreeBuilder.prototype.start = function() {
	throw "Not mplemented";
};

TreeBuilder.prototype.startTokenization = function(tokenizer) {
	this.tokenizer = tokenizer;
	this.compatMode = "no quirks";
	this.originalInsertionMode = "initial";
	this.framesetOk = true;
	this.openElements = new ElementStack();
	this.activeFormattingElements = [];
	this.start();
	if (this.context) {
		switch(this.context) {
		case 'title':
		case 'textarea':
			this.tokenizer.setState(Tokenizer.RCDATA);
			break;
		case 'style':
		case 'xmp':
		case 'iframe':
		case 'noembed':
		case 'noframes':
			this.tokenizer.setState(Tokenizer.RAWTEXT);
			break;
		case 'script':
			this.tokenizer.setState(Tokenizer.SCRIPT_DATA);
			break;
		case 'noscript':
			if (this.scriptingEnabled)
				this.tokenizer.setState(Tokenizer.RAWTEXT);
			break;
		case 'plaintext':
			this.tokenizer.setState(Tokenizer.PLAINTEXT);
			break;
		}
		this.insertHtmlElement();
		this.resetInsertionMode();
		// todo form pointer
	} else {
		this.setInsertionMode('initial');
	}
};

TreeBuilder.prototype.processToken = function(token) {
	this.selfClosingFlagAcknowledged = false;

	var currentNode = this.openElements.top || null;
	var insertionMode;
	if (!currentNode || !currentNode.isForeign() ||
		(currentNode.isMathMLTextIntegrationPoint() &&
			((token.type == 'StartTag' &&
					!(token.name in {mglyph:0, malignmark:0})) ||
				(token.type === 'Characters'))
		) ||
		(currentNode.namespaceURI == "http://www.w3.org/1998/Math/MathML" &&
			currentNode.localName == 'annotation-xml' &&
			token.type == 'StartTag' && token.name == 'svg'
		) ||
		(currentNode.isHtmlIntegrationPoint() &&
			token.type in {StartTag:0, Characters:0}
		) ||
		token.type == 'EOF'
	) {
		insertionMode = this.insertionMode;
	} else {
		insertionMode = this.insertionModes.inForeignContent;
	}
	switch(token.type) {
	case 'Characters':
		var buffer = new CharacterBuffer(token.data);
		insertionMode.processCharacters(buffer);
		break;
	case 'Comment':
		insertionMode.processComment(token.data);
		break;
	case 'StartTag':
		insertionMode.processStartTag(token.name, token.data, token.selfClosing);
		break;
	case 'EndTag':
		insertionMode.processEndTag(token.name);
		break;
	case 'Doctype':
		insertionMode.processDoctype(token.name, token.publicId, token.systemId, token.forceQuirks);
		break;
	case 'EOF':
		insertionMode.processEOF();
		break;
	}
};

TreeBuilder.prototype.isCdataSectionAllowed = function() {
	return this.openElements.length > 0 && this.currentStackItem().isForeign();
};

TreeBuilder.prototype.isSelfClosingFlagAcknowledged = function() {
	return this.selfClosingFlagAcknowledged;
};

TreeBuilder.prototype.createElement = function(namespaceURI, localName, attributes) {
	throw new Error("Not implemented");
};

TreeBuilder.prototype.attachNode = function(child, parent) {
	throw new Error("Not implemented");
};

TreeBuilder.prototype.attachNodeToFosterParent = function(child, table, stackParent) {
	throw new Error("Not implemented");
};

TreeBuilder.prototype.detachFromParent = function(node) {
	throw new Error("Not implemented");
};

TreeBuilder.prototype.addAttributesToElement = function(element, attributes) {
	throw new Error("Not implemented");
};

TreeBuilder.prototype.insertHtmlElement = function(attributes) {
	var root = this.createElement("http://www.w3.org/1999/xhtml", 'html', attributes);
	this.attachNode(root, this.document);
	this.openElements.pushHtmlElement(new StackItem("http://www.w3.org/1999/xhtml", 'html', attributes, root));
	return root;
};

TreeBuilder.prototype.insertHeadElement = function(attributes) {
	var element = this.createElement("http://www.w3.org/1999/xhtml", "head", attributes);
	this.head = new StackItem("http://www.w3.org/1999/xhtml", "head", attributes, element);
	this.attachNode(element, this.openElements.top.node);
	this.openElements.pushHeadElement(this.head);
	return element;
};

TreeBuilder.prototype.insertBodyElement = function(attributes) {
	var element = this.createElement("http://www.w3.org/1999/xhtml", "body", attributes);
	this.attachNode(element, this.openElements.top.node);
	this.openElements.pushBodyElement(new StackItem("http://www.w3.org/1999/xhtml", "body", attributes, element));
	return element;
};

TreeBuilder.prototype.insertIntoFosterParent = function(node) {
	var tableIndex = this.openElements.findIndex('table');
	var tableElement = this.openElements.item(tableIndex).node;
	if (tableIndex === 0)
		return this.attachNode(node, tableElement);
	this.attachNodeToFosterParent(node, tableElement, this.openElements.item(tableIndex - 1).node);
};

TreeBuilder.prototype.insertElement = function(name, attributes, namespaceURI, selfClosing) {
	if (!namespaceURI)
		namespaceURI = "http://www.w3.org/1999/xhtml";
	var element = this.createElement(namespaceURI, name, attributes);
	if (this.shouldFosterParent())
		this.insertIntoFosterParent(element);
	else
		this.attachNode(element, this.openElements.top.node);
	if (!selfClosing)
		this.openElements.push(new StackItem(namespaceURI, name, attributes, element));
};

TreeBuilder.prototype.insertFormattingElement = function(name, attributes) {
	this.insertElement(name, attributes, "http://www.w3.org/1999/xhtml");
	this.appendElementToActiveFormattingElements(this.currentStackItem());
};

TreeBuilder.prototype.insertSelfClosingElement = function(name, attributes) {
	this.selfClosingFlagAcknowledged = true;
	this.insertElement(name, attributes, "http://www.w3.org/1999/xhtml", true);
};

TreeBuilder.prototype.insertForeignElement = function(name, attributes, namespaceURI, selfClosing) {
	if (selfClosing)
		this.selfClosingFlagAcknowledged = true;
	this.insertElement(name, attributes, namespaceURI, selfClosing);
};

TreeBuilder.prototype.insertComment = function(data, parent) {
	throw new Error("Not implemented");
};

TreeBuilder.prototype.insertDoctype = function(name, publicId, systemId) {
	throw new Error("Not implemented");
};

TreeBuilder.prototype.insertText = function(data) {
	throw new Error("Not implemented");
};

/**
 * Returns topmost open element
 * @return {StackItem}
 */
TreeBuilder.prototype.currentStackItem = function() {
	return this.openElements.top;
};

/**
 * Populates current open element
 * @return {StackItem}
 */
TreeBuilder.prototype.popElement = function() {
	return this.openElements.pop();
};

/**
 * Returns true if redirect is required and current open element causes foster parenting
 * @return {*}
 */
TreeBuilder.prototype.shouldFosterParent = function() {
	return this.redirectAttachToFosterParent && this.currentStackItem().isFosterParenting();
};

/**
 * Implements http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html#closing-elements-that-have-implied-end-tags
 * @param {String} [exclude] Ignore specific tag name
 */
TreeBuilder.prototype.generateImpliedEndTags = function(exclude) {
	// FIXME get rid of the recursion
	var name = this.openElements.top.localName;
	if (['dd', 'dt', 'li', 'option', 'optgroup', 'p', 'rp', 'rt'].indexOf(name) != -1 && name != exclude) {
		this.popElement();
		this.generateImpliedEndTags(exclude);
	}
};

/**
 * Performs http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#reconstruct-the-active-formatting-elements
 */
TreeBuilder.prototype.reconstructActiveFormattingElements = function() {
	// Within this algorithm the order of steps decribed in the specification
	// is not quite the same as the order of steps in the code. It should still
	// do the same though.

	// Step 1: stop if there's nothing to do
	if (this.activeFormattingElements.length === 0)
		return;

	// Step 2 and 3: start with the last element
	var i = this.activeFormattingElements.length - 1;
	var entry = this.activeFormattingElements[i];
	if (entry == Marker || this.openElements.contains(entry))
		return;

	while (entry != Marker && !this.openElements.contains(entry)) {
		i -= 1;
		entry = this.activeFormattingElements[i];
		if (!entry)
			break;
	}

	while (true) {
		i += 1;
		entry = this.activeFormattingElements[i];
		this.insertElement(entry.localName, entry.attributes);
		var element = this.currentStackItem();
		this.activeFormattingElements[i] = element;
		if (element == this.activeFormattingElements[this.activeFormattingElements.length -1])
			break;
	}

};

TreeBuilder.prototype.ensureNoahsArkCondition = function(item) {
	var kNoahsArkCapacity = 3;
	if (this.activeFormattingElements.length < kNoahsArkCapacity)
		return;
	var candidates = [];
	var newItemAttributeCount = item.attributes.length;
	for (var i = this.activeFormattingElements.length - 1; i >= 0; i--) {
		var candidate = this.activeFormattingElements[i];
		if (candidate === Marker)
			break;
		if (item.localName !== candidate.localName || item.namespaceURI !== candidate.namespaceURI)
			continue;
		if (candidate.attributes.length != newItemAttributeCount)
			continue;
		candidates.push(candidate);
	}
	if (candidates.length < kNoahsArkCapacity)
		return;

	var remainingCandidates = [];
	var attributes = item.attributes;
	for (var i = 0; i < attributes.length; i++) {
		var attribute = attributes[i];

		for (var j = 0; j < candidates.length; j++) {
			var candidate = candidates[j];
			var candidateAttribute = getAttribute(candidate, attribute.nodeName);
			if (candidateAttribute && candidateAttribute.nodeValue === attribute.nodeValue)
				remainingCandidates.push(candidate);
		}
		if (remainingCandidates.length < kNoahsArkCapacity)
			return;
		candidates = remainingCandidates;
		remainingCandidates = [];
	}
	// Inductively, we shouldn't spin this loop very many times. It's possible,
	// however, that we wil spin the loop more than once because of how the
	// formatting element list gets permuted.
	for (var i = kNoahsArkCapacity - 1; i < candidates.length; i++)
		this.removeElementFromActiveFormattingElements(candidates[i]);
};

TreeBuilder.prototype.appendElementToActiveFormattingElements = function(item) {
	this.ensureNoahsArkCondition(item);
	this.activeFormattingElements.push(item);
};

TreeBuilder.prototype.removeElementFromActiveFormattingElements = function(item) {
	var index = this.activeFormattingElements.indexOf(item);
	if (index >= 0)
		this.activeFormattingElements.splice(index, 1);
};

TreeBuilder.prototype.elementInActiveFormattingElements = function(name) {
	var els = this.activeFormattingElements;
	for (var i = els.length - 1; i >= 0; i--) {
		if (els[i] == Marker) break;
		if (els[i].localName == name) return els[i];
	}
	return false;
};

TreeBuilder.prototype.reparentChildren = function(oldParent, newParent) {
	throw new Error("Not implemented");
};

TreeBuilder.prototype.clearActiveFormattingElements = function() {
	while (!(this.activeFormattingElements.length === 0 || this.activeFormattingElements.pop() == Marker));
};

/**
 *
 * @param {String} context A context element name for fragment parsing
 */
TreeBuilder.prototype.setFragmentContext = function(context) {
	// Steps 4.2-4.6 of the HTML5 Fragment Case parsing algorithm:
	// http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#fragment-case
	// For efficiency, we skip step 4.2 ("Let root be a new html element with no attributes")
	// and instead use the DocumentFragment as a root node.
	//m_tree.openElements()->pushRootNode(HTMLStackItem::create(fragment, HTMLStackItem::ItemForDocumentFragmentNode));
	this.context = context;
};

/**
 *
 * @param {String} code
 * @param {Object} args
 * @param isWarning
 */
TreeBuilder.prototype.parseError = function(code, args, isWarning) {
	// FIXME: this.errors.push([this.tokenizer.position, code, data]);
	if (!this.errorHandler)
		return;
	var message = formatMessage(messages[code], args);
	this.errorHandler.error(message, this.tokenizer._inputStream.location(), code);
};

/**
 * Resets the insertion mode (http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#reset-the-insertion-mode-appropriately)
 */
TreeBuilder.prototype.resetInsertionMode = function() {
	var last = false;
	var node = null;
	for (var i = this.openElements.length - 1; i >= 0; i--) {
		node = this.openElements.item(i);
		if (i === 0) {
			assert.ok(this.context);
			last = true;
			node = new StackItem("http://www.w3.org/1999/xhtml", this.context, [], null);
		}

		if (node.namespaceURI === "http://www.w3.org/1999/xhtml") {
			// TODO template tag
			if (node.localName === 'select')
				// FIXME handle inSelectInTable
				return this.setInsertionMode('inSelect');
			if (node.localName === 'td' || node.localName === 'th')
				return this.setInsertionMode('inCell');
			if (node.localName === 'tr')
				return this.setInsertionMode('inRow');
			if (node.localName === 'tbody' || node.localName === 'thead' || node.localName === 'tfoot')
				return this.setInsertionMode('inTableBody');
			if (node.localName === 'caption')
				return this.setInsertionMode('inCaption');
			if (node.localName === 'colgroup')
				return this.setInsertionMode('inColumnGroup');
			if (node.localName === 'table')
				return this.setInsertionMode('inTable');
			if (node.localName === 'head' && !last)
				return this.setInsertionMode('inHead');
			if (node.localName === 'body')
				return this.setInsertionMode('inBody');
			if (node.localName === 'frameset')
				return this.setInsertionMode('inFrameset');
			if (node.localName === 'html')
				if (!this.openElements.headElement)
					return this.setInsertionMode('beforeHead');
				else
					return this.setInsertionMode('afterHead');
		}

		if (last)
			return this.setInsertionMode('inBody');
	}
};

TreeBuilder.prototype.processGenericRCDATAStartTag = function(name, attributes) {
	this.insertElement(name, attributes);
	this.tokenizer.setState(Tokenizer.RCDATA);
	this.originalInsertionMode = this.insertionModeName;
	this.setInsertionMode('text');
};

TreeBuilder.prototype.processGenericRawTextStartTag = function(name, attributes) {
	this.insertElement(name, attributes);
	this.tokenizer.setState(Tokenizer.RAWTEXT);
	this.originalInsertionMode = this.insertionModeName;
	this.setInsertionMode('text');
};

TreeBuilder.prototype.adjustMathMLAttributes = function(attributes) {
	attributes.forEach(function(a) {
		a.namespaceURI = "http://www.w3.org/1998/Math/MathML";
		if (constants.MATHMLAttributeMap[a.nodeName])
			a.nodeName = constants.MATHMLAttributeMap[a.nodeName];
	});
	return attributes;
};

TreeBuilder.prototype.adjustSVGTagNameCase = function(name) {
	return constants.SVGTagMap[name] || name;
};

TreeBuilder.prototype.adjustSVGAttributes = function(attributes) {
	attributes.forEach(function(a) {
		a.namespaceURI = "http://www.w3.org/2000/svg";
		if (constants.SVGAttributeMap[a.nodeName])
			a.nodeName = constants.SVGAttributeMap[a.nodeName];
	});
	return attributes;
};

TreeBuilder.prototype.adjustForeignAttributes = function(attributes) {
	for (var i = 0; i < attributes.length; i++) {
		var attribute = attributes[i];
		var adjusted = constants.ForeignAttributeMap[attribute.nodeName];
		if (adjusted) {
			attribute.nodeName = adjusted.localName;
			attribute.prefix = adjusted.prefix;
			attribute.namespaceURI = adjusted.namespaceURI;
		}
	}
	return attributes;
};

function formatMessage(format, args) {
	return format.replace(new RegExp('{[0-9a-z-]+}', 'gi'), function(match) {
		return args[match.slice(1, -1)] || match;
	});
}

exports.TreeBuilder = TreeBuilder;

})()
},{"./ElementStack":1,"./StackItem":4,"./Tokenizer":5,"./constants":7,"./messages.json":8,"assert":13,"events":14}],7:[function(req,module,exports){
exports.SVGTagMap = {
	"altglyph": "altGlyph",
	"altglyphdef": "altGlyphDef",
	"altglyphitem": "altGlyphItem",
	"animatecolor": "animateColor",
	"animatemotion": "animateMotion",
	"animatetransform": "animateTransform",
	"clippath": "clipPath",
	"feblend": "feBlend",
	"fecolormatrix": "feColorMatrix",
	"fecomponenttransfer": "feComponentTransfer",
	"fecomposite": "feComposite",
	"feconvolvematrix": "feConvolveMatrix",
	"fediffuselighting": "feDiffuseLighting",
	"fedisplacementmap": "feDisplacementMap",
	"fedistantlight": "feDistantLight",
	"feflood": "feFlood",
	"fefunca": "feFuncA",
	"fefuncb": "feFuncB",
	"fefuncg": "feFuncG",
	"fefuncr": "feFuncR",
	"fegaussianblur": "feGaussianBlur",
	"feimage": "feImage",
	"femerge": "feMerge",
	"femergenode": "feMergeNode",
	"femorphology": "feMorphology",
	"feoffset": "feOffset",
	"fepointlight": "fePointLight",
	"fespecularlighting": "feSpecularLighting",
	"fespotlight": "feSpotLight",
	"fetile": "feTile",
	"feturbulence": "feTurbulence",
	"foreignobject": "foreignObject",
	"glyphref": "glyphRef",
	"lineargradient": "linearGradient",
	"radialgradient": "radialGradient",
	"textpath": "textPath"
};

exports.MATHMLAttributeMap = {
	definitionurl: 'definitionURL'
};

exports.SVGAttributeMap = {
	attributename:	'attributeName',
	attributetype:	'attributeType',
	basefrequency:	'baseFrequency',
	baseprofile:	'baseProfile',
	calcmode:	'calcMode',
	clippathunits:	'clipPathUnits',
	contentscripttype:	'contentScriptType',
	contentstyletype:	'contentStyleType',
	diffuseconstant:	'diffuseConstant',
	edgemode:	'edgeMode',
	externalresourcesrequired:	'externalResourcesRequired',
	filterres:	'filterRes',
	filterunits:	'filterUnits',
	glyphref:	'glyphRef',
	gradienttransform:	'gradientTransform',
	gradientunits:	'gradientUnits',
	kernelmatrix:	'kernelMatrix',
	kernelunitlength:	'kernelUnitLength',
	keypoints:	'keyPoints',
	keysplines:	'keySplines',
	keytimes:	'keyTimes',
	lengthadjust:	'lengthAdjust',
	limitingconeangle:	'limitingConeAngle',
	markerheight:	'markerHeight',
	markerunits:	'markerUnits',
	markerwidth:	'markerWidth',
	maskcontentunits:	'maskContentUnits',
	maskunits:	'maskUnits',
	numoctaves:	'numOctaves',
	pathlength:	'pathLength',
	patterncontentunits:	'patternContentUnits',
	patterntransform:	'patternTransform',
	patternunits:	'patternUnits',
	pointsatx:	'pointsAtX',
	pointsaty:	'pointsAtY',
	pointsatz:	'pointsAtZ',
	preservealpha:	'preserveAlpha',
	preserveaspectratio:	'preserveAspectRatio',
	primitiveunits:	'primitiveUnits',
	refx:	'refX',
	refy:	'refY',
	repeatcount:	'repeatCount',
	repeatdur:	'repeatDur',
	requiredextensions:	'requiredExtensions',
	requiredfeatures:	'requiredFeatures',
	specularconstant:	'specularConstant',
	specularexponent:	'specularExponent',
	spreadmethod:	'spreadMethod',
	startoffset:	'startOffset',
	stddeviation:	'stdDeviation',
	stitchtiles:	'stitchTiles',
	surfacescale:	'surfaceScale',
	systemlanguage:	'systemLanguage',
	tablevalues:	'tableValues',
	targetx:	'targetX',
	targety:	'targetY',
	textlength:	'textLength',
	viewbox:	'viewBox',
	viewtarget:	'viewTarget',
	xchannelselector:	'xChannelSelector',
	ychannelselector:	'yChannelSelector',
	zoomandpan:	'zoomAndPan'
};

exports.ForeignAttributeMap = {
	"xlink:actuate": {prefix: "xlink", localName: "actuate", namespaceURI: "http://www.w3.org/1999/xlink"},
	"xlink:arcrole": {prefix: "xlink", localName: "arcrole", namespaceURI: "http://www.w3.org/1999/xlink"},
	"xlink:href": {prefix: "xlink", localName: "href", namespaceURI: "http://www.w3.org/1999/xlink"},
	"xlink:role": {prefix: "xlink", localName: "role", namespaceURI: "http://www.w3.org/1999/xlink"},
	"xlink:show": {prefix: "xlink", localName: "show", namespaceURI: "http://www.w3.org/1999/xlink"},
	"xlink:title": {prefix: "xlink", localName: "title", namespaceURI: "http://www.w3.org/1999/xlink"},
	"xlink:type": {prefix: "xlink", localName: "title", namespaceURI: "http://www.w3.org/1999/xlink"},
	"xml:base": {prefix: "xml", localName: "base", namespaceURI: "http://www.w3.org/XML/1998/namespace"},
	"xml:lang": {prefix: "xml", localName: "lang", namespaceURI: "http://www.w3.org/XML/1998/namespace"},
	"xml:space": {prefix: "xml", localName: "space", namespaceURI: "http://www.w3.org/XML/1998/namespace"},
	"xmlns": {prefix: null, localName: "xmlns", namespaceURI: "http://www.w3.org/2000/xmlns/"},
	"xmlns:xlink": {prefix: "xmlns", localName: "xlink", namespaceURI: "http://www.w3.org/2000/xmlns/"},
};
},{}],8:[function(req,module,exports){
module.exports={
	"null-character":
		"Null character in input stream, replaced with U+FFFD.",
	"invalid-codepoint":
		"Invalid codepoint in stream",
	"incorrectly-placed-solidus":
		"Solidus (/) incorrectly placed in tag.",
	"incorrect-cr-newline-entity":
		"Incorrect CR newline entity, replaced with LF.",
	"illegal-windows-1252-entity":
		"Entity used with illegal number (windows-1252 reference).",
	"cant-convert-numeric-entity":
		"Numeric entity couldn't be converted to character (codepoint U+{charAsInt}).",
	"invalid-numeric-entity-replaced":
		"Numeric entity represents an illegal codepoint. Expanded to the C1 controls range.",
	"numeric-entity-without-semicolon":
		"Numeric entity didn't end with ';'.",
	"expected-numeric-entity-but-got-eof":
		"Numeric entity expected. Got end of file instead.",
	"expected-numeric-entity":
		"Numeric entity expected but none found.",
	"named-entity-without-semicolon":
		"Named entity didn't end with ';'.",
	"expected-named-entity":
		"Named entity expected. Got none.",
	"attributes-in-end-tag":
		"End tag contains unexpected attributes.",
	"self-closing-flag-on-end-tag":
		"End tag contains unexpected self-closing flag.",
	"bare-less-than-sign-at-eof":
		"End of file after <.",
	"expected-tag-name-but-got-right-bracket":
		"Expected tag name. Got '>' instead.",
	"expected-tag-name-but-got-question-mark":
		"Expected tag name. Got '?' instead. (HTML doesn't support processing instructions.)",
	"expected-tag-name":
		"Expected tag name. Got something else instead.",
	"expected-closing-tag-but-got-right-bracket":
		"Expected closing tag. Got '>' instead. Ignoring '</>'.",
	"expected-closing-tag-but-got-eof":
		"Expected closing tag. Unexpected end of file.",
	"expected-closing-tag-but-got-char":
		"Expected closing tag. Unexpected character '{data}' found.",
	"eof-in-tag-name":
		"Unexpected end of file in the tag name.",
	"expected-attribute-name-but-got-eof":
		"Unexpected end of file. Expected attribute name instead.",
	"eof-in-attribute-name":
		"Unexpected end of file in attribute name.",
	"invalid-character-in-attribute-name":
		"Invalid character in attribute name.",
	"duplicate-attribute":
		"Dropped duplicate attribute '{name}' on tag.",
	"expected-end-of-tag-but-got-eof":
		"Unexpected end of file. Expected = or end of tag.",
	"expected-attribute-value-but-got-eof":
		"Unexpected end of file. Expected attribute value.",
	"expected-attribute-value-but-got-right-bracket":
		"Expected attribute value. Got '>' instead.",
	"unexpected-character-in-unquoted-attribute-value":
		"Unexpected character in unquoted attribute",
	"invalid-character-after-attribute-name":
		"Unexpected character after attribute name.",
	"unexpected-character-after-attribute-value":
		"Unexpected character after attribute value.",
	"eof-in-attribute-value-double-quote":
		"Unexpected end of file in attribute value (\").",
	"eof-in-attribute-value-single-quote":
		"Unexpected end of file in attribute value (').",
	"eof-in-attribute-value-no-quotes":
		"Unexpected end of file in attribute value.",
	"eof-after-attribute-value":
		"Unexpected end of file after attribute value.",
	"unexpected-eof-after-solidus-in-tag":
		"Unexpected end of file in tag. Expected >.",
	"unexpected-character-after-solidus-in-tag":
		"Unexpected character after / in tag. Expected >.",
	"expected-dashes-or-doctype":
		"Expected '--' or 'DOCTYPE'. Not found.",
	"unexpected-bang-after-double-dash-in-comment":
		"Unexpected ! after -- in comment.",
	"incorrect-comment":
		"Incorrect comment.",
	"eof-in-comment":
		"Unexpected end of file in comment.",
	"eof-in-comment-end-dash":
		"Unexpected end of file in comment (-).",
	"unexpected-dash-after-double-dash-in-comment":
		"Unexpected '-' after '--' found in comment.",
	"eof-in-comment-double-dash":
		"Unexpected end of file in comment (--).",
	"eof-in-comment-end-bang-state":
		"Unexpected end of file in comment.",
	"unexpected-char-in-comment":
		"Unexpected character in comment found.",
	"need-space-after-doctype":
		"No space after literal string 'DOCTYPE'.",
	"expected-doctype-name-but-got-right-bracket":
		"Unexpected > character. Expected DOCTYPE name.",
	"expected-doctype-name-but-got-eof":
		"Unexpected end of file. Expected DOCTYPE name.",
	"eof-in-doctype-name":
		"Unexpected end of file in DOCTYPE name.",
	"eof-in-doctype":
		"Unexpected end of file in DOCTYPE.",
	"expected-space-or-right-bracket-in-doctype":
		"Expected space or '>'. Got '{data}'.",
	"unexpected-end-of-doctype":
		"Unexpected end of DOCTYPE.",
	"unexpected-char-in-doctype":
		"Unexpected character in DOCTYPE.",
	"eof-in-bogus-doctype":
		"Unexpected end of file in bogus doctype.",
	"eof-in-innerhtml":
		"Unexpected EOF in inner html mode.",
	"unexpected-doctype":
		"Unexpected DOCTYPE. Ignored.",
	"non-html-root":
		"html needs to be the first start tag.",
	"expected-doctype-but-got-eof":
		"Unexpected End of file. Expected DOCTYPE.",
	"unknown-doctype":
		"Erroneous DOCTYPE. Expected <!DOCTYPE html>.",
	"quirky-doctype":
		"Quirky doctype. Expected <!DOCTYPE html>.",
	"almost-standards-doctype":
		"Almost standards mode doctype. Expected <!DOCTYPE html>.",
	"obsolete-doctype":
		"Obsolete doctype. Expected <!DOCTYPE html>.",
	"expected-doctype-but-got-chars":
		"Non-space characters found without seeing a doctype first. Expected e.g. <!DOCTYPE html>.",
	"expected-doctype-but-got-start-tag":
		"Start tag seen without seeing a doctype first. Expected e.g. <!DOCTYPE html>.",
	"expected-doctype-but-got-end-tag":
		"End tag seen without seeing a doctype first. Expected e.g. <!DOCTYPE html>.",
	"end-tag-after-implied-root":
		"Unexpected end tag ({name}) after the (implied) root element.",
	"expected-named-closing-tag-but-got-eof":
		"Unexpected end of file. Expected end tag ({name}).",
	"two-heads-are-not-better-than-one":
		"Unexpected start tag head in existing head. Ignored.",
	"unexpected-end-tag":
		"Unexpected end tag ({name}). Ignored.",
	"unexpected-start-tag-out-of-my-head":
		"Unexpected start tag ({name}) that can be in head. Moved.",
	"unexpected-start-tag":
		"Unexpected start tag ({name}).",
	"missing-end-tag":
		"Missing end tag ({name}).",
	"missing-end-tags":
		"Missing end tags ({name}).",
	"unexpected-start-tag-implies-end-tag":
		"Unexpected start tag ({startName}) implies end tag ({endName}).",
	"unexpected-start-tag-treated-as":
		"Unexpected start tag ({originalName}). Treated as {newName}.",
	"deprecated-tag":
		"Unexpected start tag {name}. Don't use it!",
	"unexpected-start-tag-ignored":
		"Unexpected start tag {name}. Ignored.",
	"expected-one-end-tag-but-got-another":
		"Unexpected end tag ({gotName}). Missing end tag ({expectedName}).",
	"end-tag-too-early":
		"End tag ({name}) seen too early. Expected other end tag.",
	"end-tag-too-early-named":
		"Unexpected end tag ({gotName}). Expected end tag ({expectedName}.",
	"end-tag-too-early-ignored":
		"End tag ({name}) seen too early. Ignored.",
	"adoption-agency-1.1":
		"End tag ({name}) violates step 1, paragraph 1 of the adoption agency algorithm.",
	"adoption-agency-1.2":
		"End tag ({name}) violates step 1, paragraph 2 of the adoption agency algorithm.",
	"adoption-agency-1.3":
		"End tag ({name}) violates step 1, paragraph 3 of the adoption agency algorithm.",
	"adoption-agency-4.4":
		"End tag ({name}) violates step 4, paragraph 4 of the adoption agency algorithm.",
	"unexpected-end-tag-treated-as":
		"Unexpected end tag ({originalName}). Treated as {newName}.",
	"no-end-tag":
		"This element ({name}) has no end tag.",
	"unexpected-implied-end-tag-in-table":
		"Unexpected implied end tag ({name}) in the table phase.",
	"unexpected-implied-end-tag-in-table-body":
		"Unexpected implied end tag ({name}) in the table body phase.",
	"unexpected-char-implies-table-voodoo":
		"Unexpected non-space characters in table context caused voodoo mode.",
	"unexpected-hidden-input-in-table":
		"Unexpected input with type hidden in table context.",
	"unexpected-form-in-table":
		"Unexpected form in table context.",
	"unexpected-start-tag-implies-table-voodoo":
		"Unexpected start tag ({name}) in table context caused voodoo mode.",
	"unexpected-end-tag-implies-table-voodoo":
		"Unexpected end tag ({name}) in table context caused voodoo mode.",
	"unexpected-cell-in-table-body":
		"Unexpected table cell start tag ({name}) in the table body phase.",
	"unexpected-cell-end-tag":
		"Got table cell end tag ({name}) while required end tags are missing.",
	"unexpected-end-tag-in-table-body":
		"Unexpected end tag ({name}) in the table body phase. Ignored.",
	"unexpected-implied-end-tag-in-table-row":
		"Unexpected implied end tag ({name}) in the table row phase.",
	"unexpected-end-tag-in-table-row":
		"Unexpected end tag ({name}) in the table row phase. Ignored.",
	"unexpected-select-in-select":
		"Unexpected select start tag in the select phase treated as select end tag.",
	"unexpected-input-in-select":
		"Unexpected input start tag in the select phase.",
	"unexpected-start-tag-in-select":
		"Unexpected start tag token ({name}) in the select phase. Ignored.",
	"unexpected-end-tag-in-select":
		"Unexpected end tag ({name}) in the select phase. Ignored.",
	"unexpected-table-element-start-tag-in-select-in-table":
		"Unexpected table element start tag ({name}) in the select in table phase.",
	"unexpected-table-element-end-tag-in-select-in-table":
		"Unexpected table element end tag ({name}) in the select in table phase.",
	"unexpected-char-after-body":
		"Unexpected non-space characters in the after body phase.",
	"unexpected-start-tag-after-body":
		"Unexpected start tag token ({name}) in the after body phase.",
	"unexpected-end-tag-after-body":
		"Unexpected end tag token ({name}) in the after body phase.",
	"unexpected-char-in-frameset":
		"Unepxected characters in the frameset phase. Characters ignored.",
	"unexpected-start-tag-in-frameset":
		"Unexpected start tag token ({name}) in the frameset phase. Ignored.",
	"unexpected-frameset-in-frameset-innerhtml":
		"Unexpected end tag token (frameset in the frameset phase (innerHTML).",
	"unexpected-end-tag-in-frameset":
		"Unexpected end tag token ({name}) in the frameset phase. Ignored.",
	"unexpected-char-after-frameset":
		"Unexpected non-space characters in the after frameset phase. Ignored.",
	"unexpected-start-tag-after-frameset":
		"Unexpected start tag ({name}) in the after frameset phase. Ignored.",
	"unexpected-end-tag-after-frameset":
		"Unexpected end tag ({name}) in the after frameset phase. Ignored.",
	"expected-eof-but-got-char":
		"Unexpected non-space characters. Expected end of file.",
	"expected-eof-but-got-start-tag":
		"Unexpected start tag ({name}). Expected end of file.",
	"expected-eof-but-got-end-tag":
		"Unexpected end tag ({name}). Expected end of file.",
	"unexpected-end-table-in-caption":
		"Unexpected end table tag in caption. Generates implied end caption.",
	"end-html-in-innerhtml": 
		"Unexpected html end tag in inner html mode.",
	"eof-in-table":
		"Unexpected end of file. Expected table content.",
	"eof-in-script":
		"Unexpected end of file. Expected script content.",
	"non-void-element-with-trailing-solidus":
		"Trailing solidus not allowed on element {name}.",
	"unexpected-html-element-in-foreign-content":
		"HTML start tag \"{name}\" in a foreign namespace context.",
	"unexpected-start-tag-in-table":
		"Unexpected {name}. Expected table content."
}
},{}],"DaboPu":[function(req,module,exports){
var SAXTreeBuilder = req('./SAXTreeBuilder').SAXTreeBuilder;
var Tokenizer = req('../Tokenizer').Tokenizer;
var TreeParser = req('./TreeParser').TreeParser;

function SAXParser() {
	this.contentHandler = null;
	this._errorHandler = null;
	this._treeBuilder = new SAXTreeBuilder();
	this._tokenizer = new Tokenizer(this._treeBuilder);
	this._scriptingEnabled = false;
}

SAXParser.prototype.parse = function(source) {
	this._tokenizer.tokenize(source);
	var document = this._treeBuilder.document;
	if (document) {
		new TreeParser(this.contentHandler).parse(document);
	}
};

SAXParser.prototype.parseFragment = function(source, context) {
	this._treeBuilder.setFragmentContext(context);
	this._tokenizer.tokenize(source);
	var fragment = this._treeBuilder.getFragment();
	if (fragment) {
		new TreeParser(this.contentHandler).parse(fragment);
	}
};

Object.defineProperty(SAXParser.prototype, 'scriptingEnabled', {
	get: function() {
		return this._scriptingEnabled;
	},
	set: function(value) {
		this._scriptingEnabled = value;
		this._treeBuilder.scriptingEnabled = value;
	}
});

Object.defineProperty(SAXParser.prototype, 'errorHandler', {
	get: function() {
		return this._errorHandler;
	},
	set: function(value) {
		this._errorHandler = value;
		this._treeBuilder.errorHandler = value;
	}
});

exports.SAXParser = SAXParser;

},{"../Tokenizer":5,"./SAXTreeBuilder":10,"./TreeParser":11}],10:[function(req,module,exports){
var util = req('util');
var TreeBuilder = req('../TreeBuilder').TreeBuilder;

function SAXTreeBuilder() {
	TreeBuilder.call(this);
}

util.inherits(SAXTreeBuilder, TreeBuilder);

SAXTreeBuilder.prototype.start = function(tokenizer) {
	this.document = new Document();
};

SAXTreeBuilder.prototype.insertDoctype = function(name, publicId, systemId) {
	var doctype = new DTD(name, publicId, systemId);
	this.document.appendChild(doctype);
};

SAXTreeBuilder.prototype.createElement = function(namespaceURI, localName, attributes) {
	var element = new Element(namespaceURI, localName, localName, attributes);
	return element;
};

SAXTreeBuilder.prototype.insertComment = function(data, parent) {
	if (!parent)
		parent = this.currentStackItem();
	var comment = new Comment(data);
	parent.appendChild(comment);
};

SAXTreeBuilder.prototype.appendCharacters = function(parent, data) {
	var text = new Characters(data);
	parent.appendChild(text);
};

SAXTreeBuilder.prototype.insertText = function(data) {
	if (this.redirectAttachToFosterParent && this.openElements.top.isFosterParenting()) {
		var tableIndex = this.openElements.findIndex('table');
		var tableItem = this.openElements.item(tableIndex);
		var table = tableItem.node;
		if (tableIndex === 0) {
			return this.appendCharacters(table, data);
		}
		var text = new Characters(data);
		var parent = table.parentNode;
		if (parent) {
			parent.insertBetween(text, table.previousSibling, table);
			return;
		}
		var stackParent = this.openElements.item(tableIndex - 1).node;
		stackParent.appendChild(text);
		return;
	}
	this.appendCharacters(this.currentStackItem().node, data);
};

SAXTreeBuilder.prototype.attachNode = function(node, parent) {
	parent.appendChild(node);
};

SAXTreeBuilder.prototype.attachNodeToFosterParent = function(child, table, stackParent) {
	var parent = table.parentNode;
	if (parent)
		parent.insertBetween(child, table.previousSibling, table);
	else
		stackParent.appendChild(child);
};

SAXTreeBuilder.prototype.detachFromParent = function(element) {
	element.detach();
};

SAXTreeBuilder.prototype.reparentChildren = function(oldParent, newParent) {
	newParent.appendChildren(oldParent.firstChild);
};

SAXTreeBuilder.prototype.getFragment = function() {
	var fragment = new DocumentFragment();
	this.reparentChildren(this.openElements.rootNode, fragment);
	return fragment;
};

function getAttribute(node, name) {
	for (var i = 0; i < node.attributes.length; i++) {
		var attribute = node.attributes[i];
		if (attribute.nodeName === name)
			return attribute.nodeValue;
	}
}

SAXTreeBuilder.prototype.addAttributesToElement = function(element, attributes) {
	for (var i = 0; i < attributes.length; i++) {
		var attribute = attributes[i];
		if (!getAttribute(element, attribute.nodeName))
			element.attributes.push(attribute);
	}
};

var NodeType = {
	/**
	 * A CDATA section.
	 */
	CDATA: 1,
	/**
	 * A run of characters.
	 */
	CHARACTERS: 2,
	/**
	 * A comment.
	 */
	COMMENT: 3,
	/**
	 * A document.
	 */
	DOCUMENT: 4,
	/**
	 * A document fragment.
	 */
	DOCUMENT_FRAGMENT: 5,
	/**
	 * A DTD.
	 */
	DTD: 6,
	/**
	 * An element.
	 */
	ELEMENT: 7,
	/**
	 * An entity.
	 */
	ENTITY: 8,
	/**
	 * A run of ignorable whitespace.
	 */
	IGNORABLE_WHITESPACE: 9,
	/**
	 * A processing instruction.
	 */
	PROCESSING_INSTRUCTION: 10,
	/**
	 * A skipped entity.
	 */
	SKIPPED_ENTITY: 11
};
/**
 * The common node superclass.
 * @version $Id$
 * @author hsivonen
 */
function Node() {
	this.parentNode = null;
	this.nextSibling = null;
	this.firstChild = null;
}

/**
 * Visit the node.
 * 
 * @param treeParser the visitor
 * @throws SAXException if stuff goes wrong
 */
Node.prototype.visit = function(treeParser) {
	throw new Error("Not Implemented");
};

/**
 * Revisit the node.
 * 
 * @param treeParser the visitor
 * @throws SAXException if stuff goes wrong
 */
Node.prototype.revisit = function(treeParser) {
	return;
};


// Subclass-specific accessors that are hoisted here to 
// avoid casting.

/**
 * Detach this node from its parent.
 */
Node.prototype.detach = function() {
	if (this.parentNode !== null) {
		this.parentNode.removeChild(this);
		this.parentNode = null;
	}
};

Object.defineProperty(Node.prototype, 'previousSibling', {
	get: function() {
		var prev = null;
		var next = this.parentNode.firstChild;
		for(;;) {
			if (this == next) {
				return prev;
			}
			prev = next;
			next = next.nextSibling;
		}
	}
});


function ParentNode() {
	Node.call(this);
	this.lastChild = null;
}

ParentNode.prototype = Object.create(Node.prototype);

/**
 * Insert a new child before a pre-existing child and return the newly inserted child.
 * @param child the new child
 * @param sibling the existing child before which to insert (must be a child of this node) or <code>null</code> to append
 * @return <code>child</code>
 */
ParentNode.prototype.insertBefore = function(child, sibling) {
	//assert sibling == null || this == sibling.getParentNode();
	if (!sibling) {
		return this.appendChild(child);
	}
	child.detach();
	child.parentNode = this;
	if (this.firstChild == sibling) {
		child.nextSibling = sibling;
		this.firstChild = child;
	} else {
		var prev = this.firstChild;
		var next = this.firstChild.nextSibling;
		while (next != sibling) {
			prev = next;
			next = next.nextSibling;
		}
		prev.nextSibling = child;
		child.nextSibling = next;
	}
	return child;
};

ParentNode.prototype.insertBetween = function(child, prev, next) {
	// assert prev == null || this == prev.getParentNode();
	// assert next == null || this == next.getParentNode();
	// assert prev != null || next == firstChild;
	// assert next != null || prev == lastChild;
	// assert prev == null || next == null || prev.getNextSibling() == next;
	if (!next) {
		return this.appendChild(child);
	}
	child.detach();
	child.parentNode = this;
	child.nextSibling = next;
	if (!prev) {
		firstChild = child;
	} else {
		prev.nextSibling = child;
	}
	return child;
};

/**
 * Append a child to this node and return the child.
 * 
 * @param child the child to append.
 * @return <code>child</code>
 */
ParentNode.prototype.appendChild = function(child) {
	child.detach();
	child.parentNode = this;
	if (!this.firstChild) {
		this.firstChild = child;
	} else {
		this.lastChild.nextSibling = child;
	}
	this.lastChild = child;
	return child;
};

/**
 * Append the children of another node to this node removing them from the other node .
 * @param parent the other node whose children to append to this one
 */
ParentNode.prototype.appendChildren = function(parent) {
	var child = parent.firstChild;
	if (!child) {
		return;
	}
	var another = parent;
	if (!this.firstChild) {
		this.firstChild = child;
	} else {
		this.lastChild.nextSibling = child;
	}
	this.lastChild = another.lastChild;
	do {
		child.parentNode = this;
	} while ((child = child.nextSibling));
	another.firstChild = null;
	another.lastChild = null;
};

/**
 * Remove a child from this node.
 * @param node the child to remove
 */
ParentNode.prototype.removeChild = function(node) {
	//assert this == node.getParentNode();
	if (this.firstChild == node) {
		this.firstChild = node.nextSibling;
		if (this.lastChild == node) {
			this.lastChild = null;
		}
	} else {
		var prev = this.firstChild;
		var next = this.firstChild.nextSibling;
		while (next != node) {
			prev = next;
			next = next.nextSibling;
		}
		prev.nextSibling = node.nextSibling;
		if (this.lastChild == node) {
			this.lastChild = prev;
		}
	}
	node.parentNode = null;
	return node;
};

/**
 * A document.
 * @version $Id$
 * @author hsivonen
 */
function Document () {
	Node.call(this);
	this.nodeType = NodeType.DOCUMENT;
}

Document.prototype = Object.create(ParentNode.prototype);

/**
 * 
 * @see nu.validator.saxtree.Node#visit(nu.validator.saxtree.TreeParser)
 */
Document.prototype.visit = function(treeParser) {
	treeParser.startDocument(this);
};

/**
 * @see nu.validator.saxtree.Node#revisit(nu.validator.saxtree.TreeParser)
 */
Document.prototype.revisit = function(treeParser) {
	treeParser.endDocument();
};

/**
 * A document fragment.
 * 
 * @version $Id$
 * @author hsivonen
 */

/**
 * The constructor.
 */
function DocumentFragment() {
	ParentNode.call(this);
	this.nodeType = NodeType.DOCUMENT_FRAGMENT;
}

DocumentFragment.prototype = Object.create(ParentNode.prototype);
/**
 * 
 * @see nu.validator.saxtree.Node#visit(nu.validator.saxtree.TreeParser)
 */
DocumentFragment.prototype.visit = function(treeParser) {
	// nothing
};

/**
 * An element.
 * @version $Id$
 * @author hsivonen
 */
function Element(uri, localName, qName, atts, prefixMappings) {
	ParentNode.call(this);

	this.uri = uri;
	this.localName = localName;
	this.qName = qName;
	this.attributes = atts;
	this.prefixMappings = prefixMappings;
	this.nodeType = NodeType.ELEMENT;
}

Element.prototype = Object.create(ParentNode.prototype);

/**
 * 
 * @see nu.validator.saxtree.Node#visit(nu.validator.saxtree.TreeParser)
 */
Element.prototype.visit = function(treeParser) {
	if (this.prefixMappings) {
		for (var key in prefixMappings) {
			var mapping = prefixMappings[key];
			treeParser.startPrefixMapping(mapping.getPrefix(),
					mapping.getUri(), this);
		}
	}
	treeParser.startElement(this.uri, this.localName, this.qName, this.attributes, this);
};

/**
 * @see nu.validator.saxtree.Node#revisit(nu.validator.saxtree.TreeParser)
 */
Element.prototype.revisit = function(treeParser) {
	treeParser.endElement(this.uri, this.localName, this.qName);
	if (this.prefixMappings) {
		for (var key in prefixMappings) {
			var mapping = prefixMappings[key];
			treeParser.endPrefixMapping(mapping.getPrefix());
		}
	}
};

/**
 * The constructor.
 * @param locator the locator
 * @param buf the buffer
 * @param start the offset in the buffer
 * @param length the length
 */
function Characters(data){
	Node.call(this);
	this.data = data;
	this.nodeType = NodeType.CHARACTERS;
}

Characters.prototype = Object.create(Node.prototype);

/**
 * 
 * @see nu.validator.saxtree.Node#visit(nu.validator.saxtree.TreeParser)
 */
Characters.prototype.visit = function (treeParser) {
	treeParser.characters(this.data, 0, this.data.length, this);
};

/**
 * The constructor.
 * @param buf the buffer
 * @param start the offset
 * @param length the length
 */
function IgnorableWhitespace(data) {
	Node.call(this);
	this.data = data;
	this.nodeType = NodeType.IGNORABLE_WHITESPACE;
}

IgnorableWhitespace.prototype = Object.create(Node.prototype);

/**
 * 
 * @see nu.validator.saxtree.Node#visit(nu.validator.saxtree.TreeParser)
 */
IgnorableWhitespace.prototype.visit = function(treeParser) {
	treeParser.ignorableWhitespace(this.data, 0, this.data.length, this);
};

/**
 * A comment.
 * 
 * @version $Id$
 * @author hsivonen
 */

/**
 * The constructor.
 * @param locator the locator
 * @param buf the buffer
 * @param start the offset
 * @param length the length
 */
function Comment(data) {
	Node.call(this);
	this.data = data;
	this.nodeType = NodeType.COMMENT;
}

Comment.prototype = Object.create(Node.prototype);

/**
 * 
 * @see nu.validator.saxtree.Node#visit(nu.validator.saxtree.TreeParser)
 */
Comment.prototype.visit = function(treeParser) {
	treeParser.comment(this.data, 0, this.data.length, this);
};

/**
 * A CDATA section.
 * @version $Id$
 * @author hsivonen
 */
/**
 * The constructor.
 * @param locator the locator
 */
function CDATA() {
	ParentNode.call(this);
	this.nodeType = NodeType.CDATA;
}

CDATA.prototype = Object.create(ParentNode.prototype);

/**
 * @see nu.validator.saxtree.Node#visit(nu.validator.saxtree.TreeParser)
 */
CDATA.prototype.visit = function(treeParser) {
	treeParser.startCDATA(this);
};

/**
 * 
 * @throws SAXException if things go wrong
 * @see nu.validator.saxtree.Node#revisit(nu.validator.saxtree.TreeParser)
 */
CDATA.prototype.revisit = function(treeParser) {
	treeParser.endCDATA();
};

/**
 * An entity.
 * @version $Id$
 * @author hsivonen
 */

/**
 * The constructor.
 * @param locator the locator
 * @param name the name
 */
function Entity(name) {
	ParentNode.call(this);
	this.name = name;
	this.nodeType = NodeType.ENTITY;
}

Entity.prototype = Object.create(ParentNode.prototype);

/**
 * 
 * @see nu.validator.saxtree.Node#visit(nu.validator.saxtree.TreeParser)
 */
Entity.prototype.visit = function(treeParser) {
	treeParser.startEntity(this.name, this);
};

/**
 * @see nu.validator.saxtree.Node#revisit(nu.validator.saxtree.TreeParser)
 */
Entity.prototype.revisit = function(treeParser) {
	treeParser.endEntity(this.name);
};

/**
 * A skipped entity.
 * @version $Id$
 * @author hsivonen
 */

/**
 * Constructor.
 * @param locator the locator
 * @param name the name
 */

function SkippedEntity(name) {
	Node.call(this);
	this.name = name;
	this.nodeType = NodeType.SKIPPED_ENTITY;
}

SkippedEntity.prototype = Object.create(Node.prototype);

/**
 * 
 * @see nu.validator.saxtree.Node#visit(nu.validator.saxtree.TreeParser)
 */
SkippedEntity.prototype.visit = function(treeParser) {
	treeParser.skippedEntity(this.name, this);
};

/**
 * A processing instruction.
 * @version $Id$
 * @author hsivonen
 */

/**
 * PI target.
 */
//private final String target;

/**
 * PI data.
 */
//private final String data;

/**
 * Constructor.
 * @param locator the locator
 * @param target PI target
 * @param data PI data
 */
function ProcessingInstruction(target, data) {
	Node.call(this);
	this.target = target;
	this.data = data;
}

ProcessingInstruction.prototype = Object.create(Node.prototype);

/**
 * 
 * @see nu.validator.saxtree.Node#visit(nu.validator.saxtree.TreeParser)
 */
ProcessingInstruction.prototype.visit = function(treeParser) {
	treeParser.processingInstruction(this.target, this.data, this);
};

/**
 * 
 * @see nu.validator.saxtree.Node#getNodeType()
 */
ProcessingInstruction.prototype.getNodeType = function() {
	return NodeType.PROCESSING_INSTRUCTION;
};

/**
 * The constructor.
 * @param locator the locator
 * @param name the name
 * @param publicIdentifier the public id
 * @param systemIdentifier the system id
 */
function DTD(name, publicIdentifier, systemIdentifier) {
	ParentNode.call(this);
	this.name = name;
	this.publicIdentifier = publicIdentifier;
	this.systemIdentifier = systemIdentifier;
	this.nodeType = NodeType.DTD;
}

DTD.prototype = Object.create(ParentNode.prototype);

/**
 * 
 * @see nu.validator.saxtree.Node#visit(nu.validator.saxtree.TreeParser)
 */
DTD.prototype.visit = function(treeParser) {
	treeParser.startDTD(this.name, this.publicIdentifier, this.systemIdentifier, this);
};

/**
 * @see nu.validator.saxtree.Node#revisit(nu.validator.saxtree.TreeParser)
 */
DTD.prototype.revisit = function(treeParser) {
	treeParser.endDTD();
};

exports.SAXTreeBuilder = SAXTreeBuilder;

},{"../TreeBuilder":6,"util":15}],11:[function(req,module,exports){
/**
 * A tree visitor that replays a tree as SAX events.
 * @version $Id$
 * @author hsivonen
 */

/**
 * The constructor.
 * 
 * @param contentHandler
 *            must not be <code>null</code>
 * @param lexicalHandler
 *            may be <code>null</code>
 */
function TreeParser(contentHandler, lexicalHandler){
    
    /**
     * The content handler.
     */
    this.contentHandler;

    /**
     * The lexical handler.
     */
    this.lexicalHandler;

    /**
     * The current locator.
     */
    this.locatorDelegate;

    if (!contentHandler) {
        throw new IllegalArgumentException("contentHandler was null.");
    }
    this.contentHandler = contentHandler;
    if (!lexicalHandler) {
        this.lexicalHandler = new NullLexicalHandler();
    } else {
        this.lexicalHandler = lexicalHandler;
    }
}

/**
 * Causes SAX events for the tree rooted at the argument to be emitted.
 * <code>startDocument()</code> and <code>endDocument()</code> are only
 * emitted for a <code>Document</code> node.
 * 
 * @param node
 *            the root
 * @throws SAXException
 */
TreeParser.prototype.parse = function(node) {
    // this.contentHandler.setDocumentLocator(this);
    var current = node;
    var next;
    for (;;) {
        current.visit(this);
        if ((next = current.firstChild) != null) {
            current = next;
            continue;
        }
        for (;;) {
            current.revisit(this);
            if (current == node) {
                return;
            }
            if ((next = current.nextSibling) != null) {
                current = next;
                break;
            }
            current = current.parentNode;
        }
    }
};

/**
 * @see org.xml.sax.ContentHandler#characters(char[], int, int)
 */
TreeParser.prototype.characters = function(ch, start, length, locator) {
    this.locatorDelegate = locator;
    this.contentHandler.characters(ch, start, length);
};

/**
 * @see org.xml.sax.ContentHandler#endDocument()
 */
TreeParser.prototype.endDocument = function(locator) {
    this.locatorDelegate = locator;
    this.contentHandler.endDocument();
};

/**
 * @see org.xml.sax.ContentHandler#endElement(java.lang.String,
 *      java.lang.String, java.lang.String)
 */
TreeParser.prototype.endElement = function(uri, localName, qName, locator) {
    this.locatorDelegate = locator;
    this.contentHandler.endElement(uri, localName, qName);
};

/**
 * @see org.xml.sax.ContentHandler#endPrefixMapping(java.lang.String)
 */
TreeParser.prototype.endPrefixMapping = function(prefix, locator) {
    this.locatorDelegate = locator;
    this.contentHandler.endPrefixMapping(prefix);
};

/**
 * @see org.xml.sax.ContentHandler#ignorableWhitespace(char[], int, int)
 */
TreeParser.prototype.ignorableWhitespace = function(ch, start, length, locator) {
    this.locatorDelegate = locator;
    this.contentHandler.ignorableWhitespace(ch, start, length);
};

/**
 * @see org.xml.sax.ContentHandler#processingInstruction(java.lang.String,
 *      java.lang.String)
 */
TreeParser.prototype.processingInstruction = function(target, data, locator) {
    this.locatorDelegate = locator;
    this.contentHandler.processingInstruction(target, data);
};

/**
 * @see org.xml.sax.ContentHandler#skippedEntity(java.lang.String)
 */
TreeParser.prototype.skippedEntity = function(name, locator) {
    this.locatorDelegate = locator;
    this.contentHandler.skippedEntity(name);
};

/**
 * @see org.xml.sax.ContentHandler#startDocument()
 */
TreeParser.prototype.startDocument = function(locator) {
    this.locatorDelegate = locator;
    this.contentHandler.startDocument();
};

/**
 * @see org.xml.sax.ContentHandler#startElement(java.lang.String,
 *      java.lang.String, java.lang.String, org.xml.sax.Attributes)
 */
TreeParser.prototype.startElement = function(uri, localName, qName, atts, locator) {
    this.locatorDelegate = locator;
    this.contentHandler.startElement(uri, localName, qName, atts);
};

/**
 * @see org.xml.sax.ContentHandler#startPrefixMapping(java.lang.String,
 *      java.lang.String)
 */
TreeParser.prototype.startPrefixMapping = function(prefix, uri, locator) {
    this.locatorDelegate = locator;
    this.contentHandler.startPrefixMapping(prefix, uri);
};

/**
 * @see org.xml.sax.ext.LexicalHandler#comment(char[], int, int)
 */
TreeParser.prototype.comment = function(ch, start, length, locator) {
    this.locatorDelegate = locator;
    this.lexicalHandler.comment(ch, start, length);
};

/**
 * @see org.xml.sax.ext.LexicalHandler#endCDATA()
 */
TreeParser.prototype.endCDATA = function(locator) {
    this.locatorDelegate = locator;
    this.lexicalHandler.endCDATA();
};

/**
 * @see org.xml.sax.ext.LexicalHandler#endDTD()
 */
TreeParser.prototype.endDTD = function(locator) {
    this.locatorDelegate = locator;
    this.lexicalHandler.endDTD();
};

/**
 * @see org.xml.sax.ext.LexicalHandler#endEntity(java.lang.String)
 */
TreeParser.prototype.endEntity = function(name, locator) {
    this.locatorDelegate = locator;
    this.lexicalHandler.endEntity(name);
};

/**
 * @see org.xml.sax.ext.LexicalHandler#startCDATA()
 */
TreeParser.prototype.startCDATA = function(locator) {
    this.locatorDelegate = locator;
    this.lexicalHandler.startCDATA();
};

/**
 * @see org.xml.sax.ext.LexicalHandler#startDTD(java.lang.String,
 *      java.lang.String, java.lang.String)
 */
TreeParser.prototype.startDTD = function(name, publicId, systemId, locator) {
    this.locatorDelegate = locator;
    this.lexicalHandler.startDTD(name, publicId, systemId);
};

/**
 * @see org.xml.sax.ext.LexicalHandler#startEntity(java.lang.String)
 */
TreeParser.prototype.startEntity = function(name, locator) {
    this.locatorDelegate = locator;
    this.lexicalHandler.startEntity(name);
};

// /**
//  * @see org.xml.sax.Locator#getColumnNumber()
//  */
// public int getColumnNumber() {
//     if (locatorDelegate == null) {
//         return -1;
//     } else {
//         return locatorDelegate.getColumnNumber();
//     }
// }

// /**
//  * @see org.xml.sax.Locator#getLineNumber()
//  */
// public int getLineNumber() {
//     if (locatorDelegate == null) {
//         return -1;
//     } else {
//         return locatorDelegate.getLineNumber();
//     }
// }

// /**
//  * @see org.xml.sax.Locator#getPublicId()
//  */
// public String getPublicId() {
//     if (locatorDelegate == null) {
//         return null;
//     } else {

//         return locatorDelegate.getPublicId();
//     }
// }

// /**
//  * @see org.xml.sax.Locator#getSystemId()
//  */
// public String getSystemId() {
//     if (locatorDelegate == null) {
//         return null;
//     } else {
//         return locatorDelegate.getSystemId();
//     }
// }


/**
 * A lexical handler that does nothing.
 * @version $Id$
 * @author hsivonen
 */
// implements LexicalHandler
function NullLexicalHandler() {

}

NullLexicalHandler.prototype.comment = function() {};
NullLexicalHandler.prototype.endCDATA = function() {};
NullLexicalHandler.prototype.endDTD = function() {};
NullLexicalHandler.prototype.endEntity = function() {};
NullLexicalHandler.prototype.startCDATA = function() {};
NullLexicalHandler.prototype.startDTD = function() {};
NullLexicalHandler.prototype.startEntity = function() {};

exports.TreeParser = TreeParser;

},{}],12:[function(req,module,exports){
module.exports = {
	"AElig": "\u00C6",
	"AElig;": "\u00C6",
	"AMP": "&",
	"AMP;": "&",
	"Aacute": "\u00C1",
	"Aacute;": "\u00C1",
	"Abreve;": "\u0102",
	"Acirc": "\u00C2",
	"Acirc;": "\u00C2",
	"Acy;": "\u0410",
	"Afr;": "\u1D504",
	"Agrave": "\u00C0",
	"Agrave;": "\u00C0",
	"Alpha;": "\u0391",
	"Amacr;": "\u0100",
	"And;": "\u2A53",
	"Aogon;": "\u0104",
	"Aopf;": "\u1D538",
	"ApplyFunction;": "\u2061",
	"Aring": "\u00C5",
	"Aring;": "\u00C5",
	"Ascr;": "\u1D49C",
	"Assign;": "\u2254",
	"Atilde": "\u00C3",
	"Atilde;": "\u00C3",
	"Auml": "\u00C4",
	"Auml;": "\u00C4",
	"Backslash;": "\u2216",
	"Barv;": "\u2AE7",
	"Barwed;": "\u2306",
	"Bcy;": "\u0411",
	"Because;": "\u2235",
	"Bernoullis;": "\u212C",
	"Beta;": "\u0392",
	"Bfr;": "\u1D505",
	"Bopf;": "\u1D539",
	"Breve;": "\u02D8",
	"Bscr;": "\u212C",
	"Bumpeq;": "\u224E",
	"CHcy;": "\u0427",
	"COPY": "\u00A9",
	"COPY;": "\u00A9",
	"Cacute;": "\u0106",
	"Cap;": "\u22D2",
	"CapitalDifferentialD;": "\u2145",
	"Cayleys;": "\u212D",
	"Ccaron;": "\u010C",
	"Ccedil": "\u00C7",
	"Ccedil;": "\u00C7",
	"Ccirc;": "\u0108",
	"Cconint;": "\u2230",
	"Cdot;": "\u010A",
	"Cedilla;": "\u00B8",
	"CenterDot;": "\u00B7",
	"Cfr;": "\u212D",
	"Chi;": "\u03A7",
	"CircleDot;": "\u2299",
	"CircleMinus;": "\u2296",
	"CirclePlus;": "\u2295",
	"CircleTimes;": "\u2297",
	"ClockwiseContourIntegral;": "\u2232",
	"CloseCurlyDoubleQuote;": "\u201D",
	"CloseCurlyQuote;": "\u2019",
	"Colon;": "\u2237",
	"Colone;": "\u2A74",
	"Congruent;": "\u2261",
	"Conint;": "\u222F",
	"ContourIntegral;": "\u222E",
	"Copf;": "\u2102",
	"Coproduct;": "\u2210",
	"CounterClockwiseContourIntegral;": "\u2233",
	"Cross;": "\u2A2F",
	"Cscr;": "\u1D49E",
	"Cup;": "\u22D3",
	"CupCap;": "\u224D",
	"DD;": "\u2145",
	"DDotrahd;": "\u2911",
	"DJcy;": "\u0402",
	"DScy;": "\u0405",
	"DZcy;": "\u040F",
	"Dagger;": "\u2021",
	"Darr;": "\u21A1",
	"Dashv;": "\u2AE4",
	"Dcaron;": "\u010E",
	"Dcy;": "\u0414",
	"Del;": "\u2207",
	"Delta;": "\u0394",
	"Dfr;": "\u1D507",
	"DiacriticalAcute;": "\u00B4",
	"DiacriticalDot;": "\u02D9",
	"DiacriticalDoubleAcute;": "\u02DD",
	"DiacriticalGrave;": "`",
	"DiacriticalTilde;": "\u02DC",
	"Diamond;": "\u22C4",
	"DifferentialD;": "\u2146",
	"Dopf;": "\u1D53B",
	"Dot;": "\u00A8",
	"DotDot;": "\u20DC",
	"DotEqual;": "\u2250",
	"DoubleContourIntegral;": "\u222F",
	"DoubleDot;": "\u00A8",
	"DoubleDownArrow;": "\u21D3",
	"DoubleLeftArrow;": "\u21D0",
	"DoubleLeftRightArrow;": "\u21D4",
	"DoubleLeftTee;": "\u2AE4",
	"DoubleLongLeftArrow;": "\u27F8",
	"DoubleLongLeftRightArrow;": "\u27FA",
	"DoubleLongRightArrow;": "\u27F9",
	"DoubleRightArrow;": "\u21D2",
	"DoubleRightTee;": "\u22A8",
	"DoubleUpArrow;": "\u21D1",
	"DoubleUpDownArrow;": "\u21D5",
	"DoubleVerticalBar;": "\u2225",
	"DownArrow;": "\u2193",
	"DownArrowBar;": "\u2913",
	"DownArrowUpArrow;": "\u21F5",
	"DownBreve;": "\u0311",
	"DownLeftRightVector;": "\u2950",
	"DownLeftTeeVector;": "\u295E",
	"DownLeftVector;": "\u21BD",
	"DownLeftVectorBar;": "\u2956",
	"DownRightTeeVector;": "\u295F",
	"DownRightVector;": "\u21C1",
	"DownRightVectorBar;": "\u2957",
	"DownTee;": "\u22A4",
	"DownTeeArrow;": "\u21A7",
	"Downarrow;": "\u21D3",
	"Dscr;": "\u1D49F",
	"Dstrok;": "\u0110",
	"ENG;": "\u014A",
	"ETH": "\u00D0",
	"ETH;": "\u00D0",
	"Eacute": "\u00C9",
	"Eacute;": "\u00C9",
	"Ecaron;": "\u011A",
	"Ecirc": "\u00CA",
	"Ecirc;": "\u00CA",
	"Ecy;": "\u042D",
	"Edot;": "\u0116",
	"Efr;": "\u1D508",
	"Egrave": "\u00C8",
	"Egrave;": "\u00C8",
	"Element;": "\u2208",
	"Emacr;": "\u0112",
	"EmptySmallSquare;": "\u25FB",
	"EmptyVerySmallSquare;": "\u25AB",
	"Eogon;": "\u0118",
	"Eopf;": "\u1D53C",
	"Epsilon;": "\u0395",
	"Equal;": "\u2A75",
	"EqualTilde;": "\u2242",
	"Equilibrium;": "\u21CC",
	"Escr;": "\u2130",
	"Esim;": "\u2A73",
	"Eta;": "\u0397",
	"Euml": "\u00CB",
	"Euml;": "\u00CB",
	"Exists;": "\u2203",
	"ExponentialE;": "\u2147",
	"Fcy;": "\u0424",
	"Ffr;": "\u1D509",
	"FilledSmallSquare;": "\u25FC",
	"FilledVerySmallSquare;": "\u25AA",
	"Fopf;": "\u1D53D",
	"ForAll;": "\u2200",
	"Fouriertrf;": "\u2131",
	"Fscr;": "\u2131",
	"GJcy;": "\u0403",
	"GT": ">",
	"GT;": ">",
	"Gamma;": "\u0393",
	"Gammad;": "\u03DC",
	"Gbreve;": "\u011E",
	"Gcedil;": "\u0122",
	"Gcirc;": "\u011C",
	"Gcy;": "\u0413",
	"Gdot;": "\u0120",
	"Gfr;": "\u1D50A",
	"Gg;": "\u22D9",
	"Gopf;": "\u1D53E",
	"GreaterEqual;": "\u2265",
	"GreaterEqualLess;": "\u22DB",
	"GreaterFullEqual;": "\u2267",
	"GreaterGreater;": "\u2AA2",
	"GreaterLess;": "\u2277",
	"GreaterSlantEqual;": "\u2A7E",
	"GreaterTilde;": "\u2273",
	"Gscr;": "\u1D4A2",
	"Gt;": "\u226B",
	"HARDcy;": "\u042A",
	"Hacek;": "\u02C7",
	"Hat;": "^",
	"Hcirc;": "\u0124",
	"Hfr;": "\u210C",
	"HilbertSpace;": "\u210B",
	"Hopf;": "\u210D",
	"HorizontalLine;": "\u2500",
	"Hscr;": "\u210B",
	"Hstrok;": "\u0126",
	"HumpDownHump;": "\u224E",
	"HumpEqual;": "\u224F",
	"IEcy;": "\u0415",
	"IJlig;": "\u0132",
	"IOcy;": "\u0401",
	"Iacute": "\u00CD",
	"Iacute;": "\u00CD",
	"Icirc": "\u00CE",
	"Icirc;": "\u00CE",
	"Icy;": "\u0418",
	"Idot;": "\u0130",
	"Ifr;": "\u2111",
	"Igrave": "\u00CC",
	"Igrave;": "\u00CC",
	"Im;": "\u2111",
	"Imacr;": "\u012A",
	"ImaginaryI;": "\u2148",
	"Implies;": "\u21D2",
	"Int;": "\u222C",
	"Integral;": "\u222B",
	"Intersection;": "\u22C2",
	"InvisibleComma;": "\u2063",
	"InvisibleTimes;": "\u2062",
	"Iogon;": "\u012E",
	"Iopf;": "\u1D540",
	"Iota;": "\u0399",
	"Iscr;": "\u2110",
	"Itilde;": "\u0128",
	"Iukcy;": "\u0406",
	"Iuml": "\u00CF",
	"Iuml;": "\u00CF",
	"Jcirc;": "\u0134",
	"Jcy;": "\u0419",
	"Jfr;": "\u1D50D",
	"Jopf;": "\u1D541",
	"Jscr;": "\u1D4A5",
	"Jsercy;": "\u0408",
	"Jukcy;": "\u0404",
	"KHcy;": "\u0425",
	"KJcy;": "\u040C",
	"Kappa;": "\u039A",
	"Kcedil;": "\u0136",
	"Kcy;": "\u041A",
	"Kfr;": "\u1D50E",
	"Kopf;": "\u1D542",
	"Kscr;": "\u1D4A6",
	"LJcy;": "\u0409",
	"LT": "<",
	"LT;": "<",
	"Lacute;": "\u0139",
	"Lambda;": "\u039B",
	"Lang;": "\u27EA",
	"Laplacetrf;": "\u2112",
	"Larr;": "\u219E",
	"Lcaron;": "\u013D",
	"Lcedil;": "\u013B",
	"Lcy;": "\u041B",
	"LeftAngleBracket;": "\u27E8",
	"LeftArrow;": "\u2190",
	"LeftArrowBar;": "\u21E4",
	"LeftArrowRightArrow;": "\u21C6",
	"LeftCeiling;": "\u2308",
	"LeftDoubleBracket;": "\u27E6",
	"LeftDownTeeVector;": "\u2961",
	"LeftDownVector;": "\u21C3",
	"LeftDownVectorBar;": "\u2959",
	"LeftFloor;": "\u230A",
	"LeftRightArrow;": "\u2194",
	"LeftRightVector;": "\u294E",
	"LeftTee;": "\u22A3",
	"LeftTeeArrow;": "\u21A4",
	"LeftTeeVector;": "\u295A",
	"LeftTriangle;": "\u22B2",
	"LeftTriangleBar;": "\u29CF",
	"LeftTriangleEqual;": "\u22B4",
	"LeftUpDownVector;": "\u2951",
	"LeftUpTeeVector;": "\u2960",
	"LeftUpVector;": "\u21BF",
	"LeftUpVectorBar;": "\u2958",
	"LeftVector;": "\u21BC",
	"LeftVectorBar;": "\u2952",
	"Leftarrow;": "\u21D0",
	"Leftrightarrow;": "\u21D4",
	"LessEqualGreater;": "\u22DA",
	"LessFullEqual;": "\u2266",
	"LessGreater;": "\u2276",
	"LessLess;": "\u2AA1",
	"LessSlantEqual;": "\u2A7D",
	"LessTilde;": "\u2272",
	"Lfr;": "\u1D50F",
	"Ll;": "\u22D8",
	"Lleftarrow;": "\u21DA",
	"Lmidot;": "\u013F",
	"LongLeftArrow;": "\u27F5",
	"LongLeftRightArrow;": "\u27F7",
	"LongRightArrow;": "\u27F6",
	"Longleftarrow;": "\u27F8",
	"Longleftrightarrow;": "\u27FA",
	"Longrightarrow;": "\u27F9",
	"Lopf;": "\u1D543",
	"LowerLeftArrow;": "\u2199",
	"LowerRightArrow;": "\u2198",
	"Lscr;": "\u2112",
	"Lsh;": "\u21B0",
	"Lstrok;": "\u0141",
	"Lt;": "\u226A",
	"Map;": "\u2905",
	"Mcy;": "\u041C",
	"MediumSpace;": "\u205F",
	"Mellintrf;": "\u2133",
	"Mfr;": "\u1D510",
	"MinusPlus;": "\u2213",
	"Mopf;": "\u1D544",
	"Mscr;": "\u2133",
	"Mu;": "\u039C",
	"NJcy;": "\u040A",
	"Nacute;": "\u0143",
	"Ncaron;": "\u0147",
	"Ncedil;": "\u0145",
	"Ncy;": "\u041D",
	"NegativeMediumSpace;": "\u200B",
	"NegativeThickSpace;": "\u200B",
	"NegativeThinSpace;": "\u200B",
	"NegativeVeryThinSpace;": "\u200B",
	"NestedGreaterGreater;": "\u226B",
	"NestedLessLess;": "\u226A",
	"NewLine;": "\u000A",
	"Nfr;": "\u1D511",
	"NoBreak;": "\u2060",
	"NonBreakingSpace;": "\u00A0",
	"Nopf;": "\u2115",
	"Not;": "\u2AEC",
	"NotCongruent;": "\u2262",
	"NotCupCap;": "\u226D",
	"NotDoubleVerticalBar;": "\u2226",
	"NotElement;": "\u2209",
	"NotEqual;": "\u2260",
	"NotEqualTilde;": "\u2242\u0338",
	"NotExists;": "\u2204",
	"NotGreater;": "\u226F",
	"NotGreaterEqual;": "\u2271",
	"NotGreaterFullEqual;": "\u2267\u0338",
	"NotGreaterGreater;": "\u226B\u0338",
	"NotGreaterLess;": "\u2279",
	"NotGreaterSlantEqual;": "\u2A7E\u0338",
	"NotGreaterTilde;": "\u2275",
	"NotHumpDownHump;": "\u224E\u0338",
	"NotHumpEqual;": "\u224F\u0338",
	"NotLeftTriangle;": "\u22EA",
	"NotLeftTriangleBar;": "\u29CF\u0338",
	"NotLeftTriangleEqual;": "\u22EC",
	"NotLess;": "\u226E",
	"NotLessEqual;": "\u2270",
	"NotLessGreater;": "\u2278",
	"NotLessLess;": "\u226A\u0338",
	"NotLessSlantEqual;": "\u2A7D\u0338",
	"NotLessTilde;": "\u2274",
	"NotNestedGreaterGreater;": "\u2AA2\u0338",
	"NotNestedLessLess;": "\u2AA1\u0338",
	"NotPrecedes;": "\u2280",
	"NotPrecedesEqual;": "\u2AAF\u0338",
	"NotPrecedesSlantEqual;": "\u22E0",
	"NotReverseElement;": "\u220C",
	"NotRightTriangle;": "\u22EB",
	"NotRightTriangleBar;": "\u29D0\u0338",
	"NotRightTriangleEqual;": "\u22ED",
	"NotSquareSubset;": "\u228F\u0338",
	"NotSquareSubsetEqual;": "\u22E2",
	"NotSquareSuperset;": "\u2290\u0338",
	"NotSquareSupersetEqual;": "\u22E3",
	"NotSubset;": "\u2282\u20D2",
	"NotSubsetEqual;": "\u2288",
	"NotSucceeds;": "\u2281",
	"NotSucceedsEqual;": "\u2AB0\u0338",
	"NotSucceedsSlantEqual;": "\u22E1",
	"NotSucceedsTilde;": "\u227F\u0338",
	"NotSuperset;": "\u2283\u20D2",
	"NotSupersetEqual;": "\u2289",
	"NotTilde;": "\u2241",
	"NotTildeEqual;": "\u2244",
	"NotTildeFullEqual;": "\u2247",
	"NotTildeTilde;": "\u2249",
	"NotVerticalBar;": "\u2224",
	"Nscr;": "\u1D4A9",
	"Ntilde": "\u00D1",
	"Ntilde;": "\u00D1",
	"Nu;": "\u039D",
	"OElig;": "\u0152",
	"Oacute": "\u00D3",
	"Oacute;": "\u00D3",
	"Ocirc": "\u00D4",
	"Ocirc;": "\u00D4",
	"Ocy;": "\u041E",
	"Odblac;": "\u0150",
	"Ofr;": "\u1D512",
	"Ograve": "\u00D2",
	"Ograve;": "\u00D2",
	"Omacr;": "\u014C",
	"Omega;": "\u03A9",
	"Omicron;": "\u039F",
	"Oopf;": "\u1D546",
	"OpenCurlyDoubleQuote;": "\u201C",
	"OpenCurlyQuote;": "\u2018",
	"Or;": "\u2A54",
	"Oscr;": "\u1D4AA",
	"Oslash": "\u00D8",
	"Oslash;": "\u00D8",
	"Otilde": "\u00D5",
	"Otilde;": "\u00D5",
	"Otimes;": "\u2A37",
	"Ouml": "\u00D6",
	"Ouml;": "\u00D6",
	"OverBar;": "\u203E",
	"OverBrace;": "\u23DE",
	"OverBracket;": "\u23B4",
	"OverParenthesis;": "\u23DC",
	"PartialD;": "\u2202",
	"Pcy;": "\u041F",
	"Pfr;": "\u1D513",
	"Phi;": "\u03A6",
	"Pi;": "\u03A0",
	"PlusMinus;": "\u00B1",
	"Poincareplane;": "\u210C",
	"Popf;": "\u2119",
	"Pr;": "\u2ABB",
	"Precedes;": "\u227A",
	"PrecedesEqual;": "\u2AAF",
	"PrecedesSlantEqual;": "\u227C",
	"PrecedesTilde;": "\u227E",
	"Prime;": "\u2033",
	"Product;": "\u220F",
	"Proportion;": "\u2237",
	"Proportional;": "\u221D",
	"Pscr;": "\u1D4AB",
	"Psi;": "\u03A8",
	"QUOT": "\u0022",
	"QUOT;": "\u0022",
	"Qfr;": "\u1D514",
	"Qopf;": "\u211A",
	"Qscr;": "\u1D4AC",
	"RBarr;": "\u2910",
	"REG": "\u00AE",
	"REG;": "\u00AE",
	"Racute;": "\u0154",
	"Rang;": "\u27EB",
	"Rarr;": "\u21A0",
	"Rarrtl;": "\u2916",
	"Rcaron;": "\u0158",
	"Rcedil;": "\u0156",
	"Rcy;": "\u0420",
	"Re;": "\u211C",
	"ReverseElement;": "\u220B",
	"ReverseEquilibrium;": "\u21CB",
	"ReverseUpEquilibrium;": "\u296F",
	"Rfr;": "\u211C",
	"Rho;": "\u03A1",
	"RightAngleBracket;": "\u27E9",
	"RightArrow;": "\u2192",
	"RightArrowBar;": "\u21E5",
	"RightArrowLeftArrow;": "\u21C4",
	"RightCeiling;": "\u2309",
	"RightDoubleBracket;": "\u27E7",
	"RightDownTeeVector;": "\u295D",
	"RightDownVector;": "\u21C2",
	"RightDownVectorBar;": "\u2955",
	"RightFloor;": "\u230B",
	"RightTee;": "\u22A2",
	"RightTeeArrow;": "\u21A6",
	"RightTeeVector;": "\u295B",
	"RightTriangle;": "\u22B3",
	"RightTriangleBar;": "\u29D0",
	"RightTriangleEqual;": "\u22B5",
	"RightUpDownVector;": "\u294F",
	"RightUpTeeVector;": "\u295C",
	"RightUpVector;": "\u21BE",
	"RightUpVectorBar;": "\u2954",
	"RightVector;": "\u21C0",
	"RightVectorBar;": "\u2953",
	"Rightarrow;": "\u21D2",
	"Ropf;": "\u211D",
	"RoundImplies;": "\u2970",
	"Rrightarrow;": "\u21DB",
	"Rscr;": "\u211B",
	"Rsh;": "\u21B1",
	"RuleDelayed;": "\u29F4",
	"SHCHcy;": "\u0429",
	"SHcy;": "\u0428",
	"SOFTcy;": "\u042C",
	"Sacute;": "\u015A",
	"Sc;": "\u2ABC",
	"Scaron;": "\u0160",
	"Scedil;": "\u015E",
	"Scirc;": "\u015C",
	"Scy;": "\u0421",
	"Sfr;": "\u1D516",
	"ShortDownArrow;": "\u2193",
	"ShortLeftArrow;": "\u2190",
	"ShortRightArrow;": "\u2192",
	"ShortUpArrow;": "\u2191",
	"Sigma;": "\u03A3",
	"SmallCircle;": "\u2218",
	"Sopf;": "\u1D54A",
	"Sqrt;": "\u221A",
	"Square;": "\u25A1",
	"SquareIntersection;": "\u2293",
	"SquareSubset;": "\u228F",
	"SquareSubsetEqual;": "\u2291",
	"SquareSuperset;": "\u2290",
	"SquareSupersetEqual;": "\u2292",
	"SquareUnion;": "\u2294",
	"Sscr;": "\u1D4AE",
	"Star;": "\u22C6",
	"Sub;": "\u22D0",
	"Subset;": "\u22D0",
	"SubsetEqual;": "\u2286",
	"Succeeds;": "\u227B",
	"SucceedsEqual;": "\u2AB0",
	"SucceedsSlantEqual;": "\u227D",
	"SucceedsTilde;": "\u227F",
	"SuchThat;": "\u220B",
	"Sum;": "\u2211",
	"Sup;": "\u22D1",
	"Superset;": "\u2283",
	"SupersetEqual;": "\u2287",
	"Supset;": "\u22D1",
	"THORN": "\u00DE",
	"THORN;": "\u00DE",
	"TRADE;": "\u2122",
	"TSHcy;": "\u040B",
	"TScy;": "\u0426",
	"Tab;": "\u0009",
	"Tau;": "\u03A4",
	"Tcaron;": "\u0164",
	"Tcedil;": "\u0162",
	"Tcy;": "\u0422",
	"Tfr;": "\u1D517",
	"Therefore;": "\u2234",
	"Theta;": "\u0398",
	"ThickSpace;": "\u205F\u200A",
	"ThinSpace;": "\u2009",
	"Tilde;": "\u223C",
	"TildeEqual;": "\u2243",
	"TildeFullEqual;": "\u2245",
	"TildeTilde;": "\u2248",
	"Topf;": "\u1D54B",
	"TripleDot;": "\u20DB",
	"Tscr;": "\u1D4AF",
	"Tstrok;": "\u0166",
	"Uacute": "\u00DA",
	"Uacute;": "\u00DA",
	"Uarr;": "\u219F",
	"Uarrocir;": "\u2949",
	"Ubrcy;": "\u040E",
	"Ubreve;": "\u016C",
	"Ucirc": "\u00DB",
	"Ucirc;": "\u00DB",
	"Ucy;": "\u0423",
	"Udblac;": "\u0170",
	"Ufr;": "\u1D518",
	"Ugrave": "\u00D9",
	"Ugrave;": "\u00D9",
	"Umacr;": "\u016A",
	"UnderBar;": "_",
	"UnderBrace;": "\u23DF",
	"UnderBracket;": "\u23B5",
	"UnderParenthesis;": "\u23DD",
	"Union;": "\u22C3",
	"UnionPlus;": "\u228E",
	"Uogon;": "\u0172",
	"Uopf;": "\u1D54C",
	"UpArrow;": "\u2191",
	"UpArrowBar;": "\u2912",
	"UpArrowDownArrow;": "\u21C5",
	"UpDownArrow;": "\u2195",
	"UpEquilibrium;": "\u296E",
	"UpTee;": "\u22A5",
	"UpTeeArrow;": "\u21A5",
	"Uparrow;": "\u21D1",
	"Updownarrow;": "\u21D5",
	"UpperLeftArrow;": "\u2196",
	"UpperRightArrow;": "\u2197",
	"Upsi;": "\u03D2",
	"Upsilon;": "\u03A5",
	"Uring;": "\u016E",
	"Uscr;": "\u1D4B0",
	"Utilde;": "\u0168",
	"Uuml": "\u00DC",
	"Uuml;": "\u00DC",
	"VDash;": "\u22AB",
	"Vbar;": "\u2AEB",
	"Vcy;": "\u0412",
	"Vdash;": "\u22A9",
	"Vdashl;": "\u2AE6",
	"Vee;": "\u22C1",
	"Verbar;": "\u2016",
	"Vert;": "\u2016",
	"VerticalBar;": "\u2223",
	"VerticalLine;": "|",
	"VerticalSeparator;": "\u2758",
	"VerticalTilde;": "\u2240",
	"VeryThinSpace;": "\u200A",
	"Vfr;": "\u1D519",
	"Vopf;": "\u1D54D",
	"Vscr;": "\u1D4B1",
	"Vvdash;": "\u22AA",
	"Wcirc;": "\u0174",
	"Wedge;": "\u22C0",
	"Wfr;": "\u1D51A",
	"Wopf;": "\u1D54E",
	"Wscr;": "\u1D4B2",
	"Xfr;": "\u1D51B",
	"Xi;": "\u039E",
	"Xopf;": "\u1D54F",
	"Xscr;": "\u1D4B3",
	"YAcy;": "\u042F",
	"YIcy;": "\u0407",
	"YUcy;": "\u042E",
	"Yacute": "\u00DD",
	"Yacute;": "\u00DD",
	"Ycirc;": "\u0176",
	"Ycy;": "\u042B",
	"Yfr;": "\u1D51C",
	"Yopf;": "\u1D550",
	"Yscr;": "\u1D4B4",
	"Yuml;": "\u0178",
	"ZHcy;": "\u0416",
	"Zacute;": "\u0179",
	"Zcaron;": "\u017D",
	"Zcy;": "\u0417",
	"Zdot;": "\u017B",
	"ZeroWidthSpace;": "\u200B",
	"Zeta;": "\u0396",
	"Zfr;": "\u2128",
	"Zopf;": "\u2124",
	"Zscr;": "\u1D4B5",
	"aacute": "\u00E1",
	"aacute;": "\u00E1",
	"abreve;": "\u0103",
	"ac;": "\u223E",
	"acE;": "\u223E\u0333",
	"acd;": "\u223F",
	"acirc": "\u00E2",
	"acirc;": "\u00E2",
	"acute": "\u00B4",
	"acute;": "\u00B4",
	"acy;": "\u0430",
	"aelig": "\u00E6",
	"aelig;": "\u00E6",
	"af;": "\u2061",
	"afr;": "\u1D51E",
	"agrave": "\u00E0",
	"agrave;": "\u00E0",
	"alefsym;": "\u2135",
	"aleph;": "\u2135",
	"alpha;": "\u03B1",
	"amacr;": "\u0101",
	"amalg;": "\u2A3F",
	"amp": "&",
	"amp;": "&",
	"and;": "\u2227",
	"andand;": "\u2A55",
	"andd;": "\u2A5C",
	"andslope;": "\u2A58",
	"andv;": "\u2A5A",
	"ang;": "\u2220",
	"ange;": "\u29A4",
	"angle;": "\u2220",
	"angmsd;": "\u2221",
	"angmsdaa;": "\u29A8",
	"angmsdab;": "\u29A9",
	"angmsdac;": "\u29AA",
	"angmsdad;": "\u29AB",
	"angmsdae;": "\u29AC",
	"angmsdaf;": "\u29AD",
	"angmsdag;": "\u29AE",
	"angmsdah;": "\u29AF",
	"angrt;": "\u221F",
	"angrtvb;": "\u22BE",
	"angrtvbd;": "\u299D",
	"angsph;": "\u2222",
	"angst;": "\u00C5",
	"angzarr;": "\u237C",
	"aogon;": "\u0105",
	"aopf;": "\u1D552",
	"ap;": "\u2248",
	"apE;": "\u2A70",
	"apacir;": "\u2A6F",
	"ape;": "\u224A",
	"apid;": "\u224B",
	"apos;": "\u0027",
	"approx;": "\u2248",
	"approxeq;": "\u224A",
	"aring": "\u00E5",
	"aring;": "\u00E5",
	"ascr;": "\u1D4B6",
	"ast;": "*",
	"asymp;": "\u2248",
	"asympeq;": "\u224D",
	"atilde": "\u00E3",
	"atilde;": "\u00E3",
	"auml": "\u00E4",
	"auml;": "\u00E4",
	"awconint;": "\u2233",
	"awint;": "\u2A11",
	"bNot;": "\u2AED",
	"backcong;": "\u224C",
	"backepsilon;": "\u03F6",
	"backprime;": "\u2035",
	"backsim;": "\u223D",
	"backsimeq;": "\u22CD",
	"barvee;": "\u22BD",
	"barwed;": "\u2305",
	"barwedge;": "\u2305",
	"bbrk;": "\u23B5",
	"bbrktbrk;": "\u23B6",
	"bcong;": "\u224C",
	"bcy;": "\u0431",
	"bdquo;": "\u201E",
	"becaus;": "\u2235",
	"because;": "\u2235",
	"bemptyv;": "\u29B0",
	"bepsi;": "\u03F6",
	"bernou;": "\u212C",
	"beta;": "\u03B2",
	"beth;": "\u2136",
	"between;": "\u226C",
	"bfr;": "\u1D51F",
	"bigcap;": "\u22C2",
	"bigcirc;": "\u25EF",
	"bigcup;": "\u22C3",
	"bigodot;": "\u2A00",
	"bigoplus;": "\u2A01",
	"bigotimes;": "\u2A02",
	"bigsqcup;": "\u2A06",
	"bigstar;": "\u2605",
	"bigtriangledown;": "\u25BD",
	"bigtriangleup;": "\u25B3",
	"biguplus;": "\u2A04",
	"bigvee;": "\u22C1",
	"bigwedge;": "\u22C0",
	"bkarow;": "\u290D",
	"blacklozenge;": "\u29EB",
	"blacksquare;": "\u25AA",
	"blacktriangle;": "\u25B4",
	"blacktriangledown;": "\u25BE",
	"blacktriangleleft;": "\u25C2",
	"blacktriangleright;": "\u25B8",
	"blank;": "\u2423",
	"blk12;": "\u2592",
	"blk14;": "\u2591",
	"blk34;": "\u2593",
	"block;": "\u2588",
	"bne;": "\u003D\u20E5",
	"bnequiv;": "\u2261\u20E5",
	"bnot;": "\u2310",
	"bopf;": "\u1D553",
	"bot;": "\u22A5",
	"bottom;": "\u22A5",
	"bowtie;": "\u22C8",
	"boxDL;": "\u2557",
	"boxDR;": "\u2554",
	"boxDl;": "\u2556",
	"boxDr;": "\u2553",
	"boxH;": "\u2550",
	"boxHD;": "\u2566",
	"boxHU;": "\u2569",
	"boxHd;": "\u2564",
	"boxHu;": "\u2567",
	"boxUL;": "\u255D",
	"boxUR;": "\u255A",
	"boxUl;": "\u255C",
	"boxUr;": "\u2559",
	"boxV;": "\u2551",
	"boxVH;": "\u256C",
	"boxVL;": "\u2563",
	"boxVR;": "\u2560",
	"boxVh;": "\u256B",
	"boxVl;": "\u2562",
	"boxVr;": "\u255F",
	"boxbox;": "\u29C9",
	"boxdL;": "\u2555",
	"boxdR;": "\u2552",
	"boxdl;": "\u2510",
	"boxdr;": "\u250C",
	"boxh;": "\u2500",
	"boxhD;": "\u2565",
	"boxhU;": "\u2568",
	"boxhd;": "\u252C",
	"boxhu;": "\u2534",
	"boxminus;": "\u229F",
	"boxplus;": "\u229E",
	"boxtimes;": "\u22A0",
	"boxuL;": "\u255B",
	"boxuR;": "\u2558",
	"boxul;": "\u2518",
	"boxur;": "\u2514",
	"boxv;": "\u2502",
	"boxvH;": "\u256A",
	"boxvL;": "\u2561",
	"boxvR;": "\u255E",
	"boxvh;": "\u253C",
	"boxvl;": "\u2524",
	"boxvr;": "\u251C",
	"bprime;": "\u2035",
	"breve;": "\u02D8",
	"brvbar": "\u00A6",
	"brvbar;": "\u00A6",
	"bscr;": "\u1D4B7",
	"bsemi;": "\u204F",
	"bsim;": "\u223D",
	"bsime;": "\u22CD",
	"bsol;": "\u005C",
	"bsolb;": "\u29C5",
	"bsolhsub;": "\u27C8",
	"bull;": "\u2022",
	"bullet;": "\u2022",
	"bump;": "\u224E",
	"bumpE;": "\u2AAE",
	"bumpe;": "\u224F",
	"bumpeq;": "\u224F",
	"cacute;": "\u0107",
	"cap;": "\u2229",
	"capand;": "\u2A44",
	"capbrcup;": "\u2A49",
	"capcap;": "\u2A4B",
	"capcup;": "\u2A47",
	"capdot;": "\u2A40",
	"caps;": "\u2229\uFE00",
	"caret;": "\u2041",
	"caron;": "\u02C7",
	"ccaps;": "\u2A4D",
	"ccaron;": "\u010D",
	"ccedil": "\u00E7",
	"ccedil;": "\u00E7",
	"ccirc;": "\u0109",
	"ccups;": "\u2A4C",
	"ccupssm;": "\u2A50",
	"cdot;": "\u010B",
	"cedil": "\u00B8",
	"cedil;": "\u00B8",
	"cemptyv;": "\u29B2",
	"cent": "\u00A2",
	"cent;": "\u00A2",
	"centerdot;": "\u00B7",
	"cfr;": "\u1D520",
	"chcy;": "\u0447",
	"check;": "\u2713",
	"checkmark;": "\u2713",
	"chi;": "\u03C7",
	"cir;": "\u25CB",
	"cirE;": "\u29C3",
	"circ;": "\u02C6",
	"circeq;": "\u2257",
	"circlearrowleft;": "\u21BA",
	"circlearrowright;": "\u21BB",
	"circledR;": "\u00AE",
	"circledS;": "\u24C8",
	"circledast;": "\u229B",
	"circledcirc;": "\u229A",
	"circleddash;": "\u229D",
	"cire;": "\u2257",
	"cirfnint;": "\u2A10",
	"cirmid;": "\u2AEF",
	"cirscir;": "\u29C2",
	"clubs;": "\u2663",
	"clubsuit;": "\u2663",
	"colon;": ":",
	"colone;": "\u2254",
	"coloneq;": "\u2254",
	"comma;": ",",
	"commat;": "@",
	"comp;": "\u2201",
	"compfn;": "\u2218",
	"complement;": "\u2201",
	"complexes;": "\u2102",
	"cong;": "\u2245",
	"congdot;": "\u2A6D",
	"conint;": "\u222E",
	"copf;": "\u1D554",
	"coprod;": "\u2210",
	"copy": "\u00A9",
	"copy;": "\u00A9",
	"copysr;": "\u2117",
	"crarr;": "\u21B5",
	"cross;": "\u2717",
	"cscr;": "\u1D4B8",
	"csub;": "\u2ACF",
	"csube;": "\u2AD1",
	"csup;": "\u2AD0",
	"csupe;": "\u2AD2",
	"ctdot;": "\u22EF",
	"cudarrl;": "\u2938",
	"cudarrr;": "\u2935",
	"cuepr;": "\u22DE",
	"cuesc;": "\u22DF",
	"cularr;": "\u21B6",
	"cularrp;": "\u293D",
	"cup;": "\u222A",
	"cupbrcap;": "\u2A48",
	"cupcap;": "\u2A46",
	"cupcup;": "\u2A4A",
	"cupdot;": "\u228D",
	"cupor;": "\u2A45",
	"cups;": "\u222A\uFE00",
	"curarr;": "\u21B7",
	"curarrm;": "\u293C",
	"curlyeqprec;": "\u22DE",
	"curlyeqsucc;": "\u22DF",
	"curlyvee;": "\u22CE",
	"curlywedge;": "\u22CF",
	"curren": "\u00A4",
	"curren;": "\u00A4",
	"curvearrowleft;": "\u21B6",
	"curvearrowright;": "\u21B7",
	"cuvee;": "\u22CE",
	"cuwed;": "\u22CF",
	"cwconint;": "\u2232",
	"cwint;": "\u2231",
	"cylcty;": "\u232D",
	"dArr;": "\u21D3",
	"dHar;": "\u2965",
	"dagger;": "\u2020",
	"daleth;": "\u2138",
	"darr;": "\u2193",
	"dash;": "\u2010",
	"dashv;": "\u22A3",
	"dbkarow;": "\u290F",
	"dblac;": "\u02DD",
	"dcaron;": "\u010F",
	"dcy;": "\u0434",
	"dd;": "\u2146",
	"ddagger;": "\u2021",
	"ddarr;": "\u21CA",
	"ddotseq;": "\u2A77",
	"deg": "\u00B0",
	"deg;": "\u00B0",
	"delta;": "\u03B4",
	"demptyv;": "\u29B1",
	"dfisht;": "\u297F",
	"dfr;": "\u1D521",
	"dharl;": "\u21C3",
	"dharr;": "\u21C2",
	"diam;": "\u22C4",
	"diamond;": "\u22C4",
	"diamondsuit;": "\u2666",
	"diams;": "\u2666",
	"die;": "\u00A8",
	"digamma;": "\u03DD",
	"disin;": "\u22F2",
	"div;": "\u00F7",
	"divide": "\u00F7",
	"divide;": "\u00F7",
	"divideontimes;": "\u22C7",
	"divonx;": "\u22C7",
	"djcy;": "\u0452",
	"dlcorn;": "\u231E",
	"dlcrop;": "\u230D",
	"dollar;": "$",
	"dopf;": "\u1D555",
	"dot;": "\u02D9",
	"doteq;": "\u2250",
	"doteqdot;": "\u2251",
	"dotminus;": "\u2238",
	"dotplus;": "\u2214",
	"dotsquare;": "\u22A1",
	"doublebarwedge;": "\u2306",
	"downarrow;": "\u2193",
	"downdownarrows;": "\u21CA",
	"downharpoonleft;": "\u21C3",
	"downharpoonright;": "\u21C2",
	"drbkarow;": "\u2910",
	"drcorn;": "\u231F",
	"drcrop;": "\u230C",
	"dscr;": "\u1D4B9",
	"dscy;": "\u0455",
	"dsol;": "\u29F6",
	"dstrok;": "\u0111",
	"dtdot;": "\u22F1",
	"dtri;": "\u25BF",
	"dtrif;": "\u25BE",
	"duarr;": "\u21F5",
	"duhar;": "\u296F",
	"dwangle;": "\u29A6",
	"dzcy;": "\u045F",
	"dzigrarr;": "\u27FF",
	"eDDot;": "\u2A77",
	"eDot;": "\u2251",
	"eacute": "\u00E9",
	"eacute;": "\u00E9",
	"easter;": "\u2A6E",
	"ecaron;": "\u011B",
	"ecir;": "\u2256",
	"ecirc": "\u00EA",
	"ecirc;": "\u00EA",
	"ecolon;": "\u2255",
	"ecy;": "\u044D",
	"edot;": "\u0117",
	"ee;": "\u2147",
	"efDot;": "\u2252",
	"efr;": "\u1D522",
	"eg;": "\u2A9A",
	"egrave": "\u00E8",
	"egrave;": "\u00E8",
	"egs;": "\u2A96",
	"egsdot;": "\u2A98",
	"el;": "\u2A99",
	"elinters;": "\u23E7",
	"ell;": "\u2113",
	"els;": "\u2A95",
	"elsdot;": "\u2A97",
	"emacr;": "\u0113",
	"empty;": "\u2205",
	"emptyset;": "\u2205",
	"emptyv;": "\u2205",
	"emsp13;": "\u2004",
	"emsp14;": "\u2005",
	"emsp;": "\u2003",
	"eng;": "\u014B",
	"ensp;": "\u2002",
	"eogon;": "\u0119",
	"eopf;": "\u1D556",
	"epar;": "\u22D5",
	"eparsl;": "\u29E3",
	"eplus;": "\u2A71",
	"epsi;": "\u03B5",
	"epsilon;": "\u03B5",
	"epsiv;": "\u03F5",
	"eqcirc;": "\u2256",
	"eqcolon;": "\u2255",
	"eqsim;": "\u2242",
	"eqslantgtr;": "\u2A96",
	"eqslantless;": "\u2A95",
	"equals;": "=",
	"equest;": "\u225F",
	"equiv;": "\u2261",
	"equivDD;": "\u2A78",
	"eqvparsl;": "\u29E5",
	"erDot;": "\u2253",
	"erarr;": "\u2971",
	"escr;": "\u212F",
	"esdot;": "\u2250",
	"esim;": "\u2242",
	"eta;": "\u03B7",
	"eth": "\u00F0",
	"eth;": "\u00F0",
	"euml": "\u00EB",
	"euml;": "\u00EB",
	"euro;": "\u20AC",
	"excl;": "!",
	"exist;": "\u2203",
	"expectation;": "\u2130",
	"exponentiale;": "\u2147",
	"fallingdotseq;": "\u2252",
	"fcy;": "\u0444",
	"female;": "\u2640",
	"ffilig;": "\uFB03",
	"fflig;": "\uFB00",
	"ffllig;": "\uFB04",
	"ffr;": "\u1D523",
	"filig;": "\uFB01",
	"fjlig;": "\u0066",
	"flat;": "\u266D",
	"fllig;": "\uFB02",
	"fltns;": "\u25B1",
	"fnof;": "\u0192",
	"fopf;": "\u1D557",
	"forall;": "\u2200",
	"fork;": "\u22D4",
	"forkv;": "\u2AD9",
	"fpartint;": "\u2A0D",
	"frac12": "\u00BD",
	"frac12;": "\u00BD",
	"frac13;": "\u2153",
	"frac14": "\u00BC",
	"frac14;": "\u00BC",
	"frac15;": "\u2155",
	"frac16;": "\u2159",
	"frac18;": "\u215B",
	"frac23;": "\u2154",
	"frac25;": "\u2156",
	"frac34": "\u00BE",
	"frac34;": "\u00BE",
	"frac35;": "\u2157",
	"frac38;": "\u215C",
	"frac45;": "\u2158",
	"frac56;": "\u215A",
	"frac58;": "\u215D",
	"frac78;": "\u215E",
	"frasl;": "\u2044",
	"frown;": "\u2322",
	"fscr;": "\u1D4BB",
	"gE;": "\u2267",
	"gEl;": "\u2A8C",
	"gacute;": "\u01F5",
	"gamma;": "\u03B3",
	"gammad;": "\u03DD",
	"gap;": "\u2A86",
	"gbreve;": "\u011F",
	"gcirc;": "\u011D",
	"gcy;": "\u0433",
	"gdot;": "\u0121",
	"ge;": "\u2265",
	"gel;": "\u22DB",
	"geq;": "\u2265",
	"geqq;": "\u2267",
	"geqslant;": "\u2A7E",
	"ges;": "\u2A7E",
	"gescc;": "\u2AA9",
	"gesdot;": "\u2A80",
	"gesdoto;": "\u2A82",
	"gesdotol;": "\u2A84",
	"gesl;": "\u22DB\uFE00",
	"gesles;": "\u2A94",
	"gfr;": "\u1D524",
	"gg;": "\u226B",
	"ggg;": "\u22D9",
	"gimel;": "\u2137",
	"gjcy;": "\u0453",
	"gl;": "\u2277",
	"glE;": "\u2A92",
	"gla;": "\u2AA5",
	"glj;": "\u2AA4",
	"gnE;": "\u2269",
	"gnap;": "\u2A8A",
	"gnapprox;": "\u2A8A",
	"gne;": "\u2A88",
	"gneq;": "\u2A88",
	"gneqq;": "\u2269",
	"gnsim;": "\u22E7",
	"gopf;": "\u1D558",
	"grave;": "`",
	"gscr;": "\u210A",
	"gsim;": "\u2273",
	"gsime;": "\u2A8E",
	"gsiml;": "\u2A90",
	"gt": ">",
	"gt;": ">",
	"gtcc;": "\u2AA7",
	"gtcir;": "\u2A7A",
	"gtdot;": "\u22D7",
	"gtlPar;": "\u2995",
	"gtquest;": "\u2A7C",
	"gtrapprox;": "\u2A86",
	"gtrarr;": "\u2978",
	"gtrdot;": "\u22D7",
	"gtreqless;": "\u22DB",
	"gtreqqless;": "\u2A8C",
	"gtrless;": "\u2277",
	"gtrsim;": "\u2273",
	"gvertneqq;": "\u2269\uFE00",
	"gvnE;": "\u2269\uFE00",
	"hArr;": "\u21D4",
	"hairsp;": "\u200A",
	"half;": "\u00BD",
	"hamilt;": "\u210B",
	"hardcy;": "\u044A",
	"harr;": "\u2194",
	"harrcir;": "\u2948",
	"harrw;": "\u21AD",
	"hbar;": "\u210F",
	"hcirc;": "\u0125",
	"hearts;": "\u2665",
	"heartsuit;": "\u2665",
	"hellip;": "\u2026",
	"hercon;": "\u22B9",
	"hfr;": "\u1D525",
	"hksearow;": "\u2925",
	"hkswarow;": "\u2926",
	"hoarr;": "\u21FF",
	"homtht;": "\u223B",
	"hookleftarrow;": "\u21A9",
	"hookrightarrow;": "\u21AA",
	"hopf;": "\u1D559",
	"horbar;": "\u2015",
	"hscr;": "\u1D4BD",
	"hslash;": "\u210F",
	"hstrok;": "\u0127",
	"hybull;": "\u2043",
	"hyphen;": "\u2010",
	"iacute": "\u00ED",
	"iacute;": "\u00ED",
	"ic;": "\u2063",
	"icirc": "\u00EE",
	"icirc;": "\u00EE",
	"icy;": "\u0438",
	"iecy;": "\u0435",
	"iexcl": "\u00A1",
	"iexcl;": "\u00A1",
	"iff;": "\u21D4",
	"ifr;": "\u1D526",
	"igrave": "\u00EC",
	"igrave;": "\u00EC",
	"ii;": "\u2148",
	"iiiint;": "\u2A0C",
	"iiint;": "\u222D",
	"iinfin;": "\u29DC",
	"iiota;": "\u2129",
	"ijlig;": "\u0133",
	"imacr;": "\u012B",
	"image;": "\u2111",
	"imagline;": "\u2110",
	"imagpart;": "\u2111",
	"imath;": "\u0131",
	"imof;": "\u22B7",
	"imped;": "\u01B5",
	"in;": "\u2208",
	"incare;": "\u2105",
	"infin;": "\u221E",
	"infintie;": "\u29DD",
	"inodot;": "\u0131",
	"int;": "\u222B",
	"intcal;": "\u22BA",
	"integers;": "\u2124",
	"intercal;": "\u22BA",
	"intlarhk;": "\u2A17",
	"intprod;": "\u2A3C",
	"iocy;": "\u0451",
	"iogon;": "\u012F",
	"iopf;": "\u1D55A",
	"iota;": "\u03B9",
	"iprod;": "\u2A3C",
	"iquest": "\u00BF",
	"iquest;": "\u00BF",
	"iscr;": "\u1D4BE",
	"isin;": "\u2208",
	"isinE;": "\u22F9",
	"isindot;": "\u22F5",
	"isins;": "\u22F4",
	"isinsv;": "\u22F3",
	"isinv;": "\u2208",
	"it;": "\u2062",
	"itilde;": "\u0129",
	"iukcy;": "\u0456",
	"iuml": "\u00EF",
	"iuml;": "\u00EF",
	"jcirc;": "\u0135",
	"jcy;": "\u0439",
	"jfr;": "\u1D527",
	"jmath;": "\u0237",
	"jopf;": "\u1D55B",
	"jscr;": "\u1D4BF",
	"jsercy;": "\u0458",
	"jukcy;": "\u0454",
	"kappa;": "\u03BA",
	"kappav;": "\u03F0",
	"kcedil;": "\u0137",
	"kcy;": "\u043A",
	"kfr;": "\u1D528",
	"kgreen;": "\u0138",
	"khcy;": "\u0445",
	"kjcy;": "\u045C",
	"kopf;": "\u1D55C",
	"kscr;": "\u1D4C0",
	"lAarr;": "\u21DA",
	"lArr;": "\u21D0",
	"lAtail;": "\u291B",
	"lBarr;": "\u290E",
	"lE;": "\u2266",
	"lEg;": "\u2A8B",
	"lHar;": "\u2962",
	"lacute;": "\u013A",
	"laemptyv;": "\u29B4",
	"lagran;": "\u2112",
	"lambda;": "\u03BB",
	"lang;": "\u27E8",
	"langd;": "\u2991",
	"langle;": "\u27E8",
	"lap;": "\u2A85",
	"laquo": "\u00AB",
	"laquo;": "\u00AB",
	"larr;": "\u2190",
	"larrb;": "\u21E4",
	"larrbfs;": "\u291F",
	"larrfs;": "\u291D",
	"larrhk;": "\u21A9",
	"larrlp;": "\u21AB",
	"larrpl;": "\u2939",
	"larrsim;": "\u2973",
	"larrtl;": "\u21A2",
	"lat;": "\u2AAB",
	"latail;": "\u2919",
	"late;": "\u2AAD",
	"lates;": "\u2AAD\uFE00",
	"lbarr;": "\u290C",
	"lbbrk;": "\u2772",
	"lbrace;": "{",
	"lbrack;": "[",
	"lbrke;": "\u298B",
	"lbrksld;": "\u298F",
	"lbrkslu;": "\u298D",
	"lcaron;": "\u013E",
	"lcedil;": "\u013C",
	"lceil;": "\u2308",
	"lcub;": "{",
	"lcy;": "\u043B",
	"ldca;": "\u2936",
	"ldquo;": "\u201C",
	"ldquor;": "\u201E",
	"ldrdhar;": "\u2967",
	"ldrushar;": "\u294B",
	"ldsh;": "\u21B2",
	"le;": "\u2264",
	"leftarrow;": "\u2190",
	"leftarrowtail;": "\u21A2",
	"leftharpoondown;": "\u21BD",
	"leftharpoonup;": "\u21BC",
	"leftleftarrows;": "\u21C7",
	"leftrightarrow;": "\u2194",
	"leftrightarrows;": "\u21C6",
	"leftrightharpoons;": "\u21CB",
	"leftrightsquigarrow;": "\u21AD",
	"leftthreetimes;": "\u22CB",
	"leg;": "\u22DA",
	"leq;": "\u2264",
	"leqq;": "\u2266",
	"leqslant;": "\u2A7D",
	"les;": "\u2A7D",
	"lescc;": "\u2AA8",
	"lesdot;": "\u2A7F",
	"lesdoto;": "\u2A81",
	"lesdotor;": "\u2A83",
	"lesg;": "\u22DA\uFE00",
	"lesges;": "\u2A93",
	"lessapprox;": "\u2A85",
	"lessdot;": "\u22D6",
	"lesseqgtr;": "\u22DA",
	"lesseqqgtr;": "\u2A8B",
	"lessgtr;": "\u2276",
	"lesssim;": "\u2272",
	"lfisht;": "\u297C",
	"lfloor;": "\u230A",
	"lfr;": "\u1D529",
	"lg;": "\u2276",
	"lgE;": "\u2A91",
	"lhard;": "\u21BD",
	"lharu;": "\u21BC",
	"lharul;": "\u296A",
	"lhblk;": "\u2584",
	"ljcy;": "\u0459",
	"ll;": "\u226A",
	"llarr;": "\u21C7",
	"llcorner;": "\u231E",
	"llhard;": "\u296B",
	"lltri;": "\u25FA",
	"lmidot;": "\u0140",
	"lmoust;": "\u23B0",
	"lmoustache;": "\u23B0",
	"lnE;": "\u2268",
	"lnap;": "\u2A89",
	"lnapprox;": "\u2A89",
	"lne;": "\u2A87",
	"lneq;": "\u2A87",
	"lneqq;": "\u2268",
	"lnsim;": "\u22E6",
	"loang;": "\u27EC",
	"loarr;": "\u21FD",
	"lobrk;": "\u27E6",
	"longleftarrow;": "\u27F5",
	"longleftrightarrow;": "\u27F7",
	"longmapsto;": "\u27FC",
	"longrightarrow;": "\u27F6",
	"looparrowleft;": "\u21AB",
	"looparrowright;": "\u21AC",
	"lopar;": "\u2985",
	"lopf;": "\u1D55D",
	"loplus;": "\u2A2D",
	"lotimes;": "\u2A34",
	"lowast;": "\u2217",
	"lowbar;": "_",
	"loz;": "\u25CA",
	"lozenge;": "\u25CA",
	"lozf;": "\u29EB",
	"lpar;": "(",
	"lparlt;": "\u2993",
	"lrarr;": "\u21C6",
	"lrcorner;": "\u231F",
	"lrhar;": "\u21CB",
	"lrhard;": "\u296D",
	"lrm;": "\u200E",
	"lrtri;": "\u22BF",
	"lsaquo;": "\u2039",
	"lscr;": "\u1D4C1",
	"lsh;": "\u21B0",
	"lsim;": "\u2272",
	"lsime;": "\u2A8D",
	"lsimg;": "\u2A8F",
	"lsqb;": "[",
	"lsquo;": "\u2018",
	"lsquor;": "\u201A",
	"lstrok;": "\u0142",
	"lt": "<",
	"lt;": "<",
	"ltcc;": "\u2AA6",
	"ltcir;": "\u2A79",
	"ltdot;": "\u22D6",
	"lthree;": "\u22CB",
	"ltimes;": "\u22C9",
	"ltlarr;": "\u2976",
	"ltquest;": "\u2A7B",
	"ltrPar;": "\u2996",
	"ltri;": "\u25C3",
	"ltrie;": "\u22B4",
	"ltrif;": "\u25C2",
	"lurdshar;": "\u294A",
	"luruhar;": "\u2966",
	"lvertneqq;": "\u2268\uFE00",
	"lvnE;": "\u2268\uFE00",
	"mDDot;": "\u223A",
	"macr": "\u00AF",
	"macr;": "\u00AF",
	"male;": "\u2642",
	"malt;": "\u2720",
	"maltese;": "\u2720",
	"map;": "\u21A6",
	"mapsto;": "\u21A6",
	"mapstodown;": "\u21A7",
	"mapstoleft;": "\u21A4",
	"mapstoup;": "\u21A5",
	"marker;": "\u25AE",
	"mcomma;": "\u2A29",
	"mcy;": "\u043C",
	"mdash;": "\u2014",
	"measuredangle;": "\u2221",
	"mfr;": "\u1D52A",
	"mho;": "\u2127",
	"micro": "\u00B5",
	"micro;": "\u00B5",
	"mid;": "\u2223",
	"midast;": "*",
	"midcir;": "\u2AF0",
	"middot": "\u00B7",
	"middot;": "\u00B7",
	"minus;": "\u2212",
	"minusb;": "\u229F",
	"minusd;": "\u2238",
	"minusdu;": "\u2A2A",
	"mlcp;": "\u2ADB",
	"mldr;": "\u2026",
	"mnplus;": "\u2213",
	"models;": "\u22A7",
	"mopf;": "\u1D55E",
	"mp;": "\u2213",
	"mscr;": "\u1D4C2",
	"mstpos;": "\u223E",
	"mu;": "\u03BC",
	"multimap;": "\u22B8",
	"mumap;": "\u22B8",
	"nGg;": "\u22D9\u0338",
	"nGt;": "\u226B\u20D2",
	"nGtv;": "\u226B\u0338",
	"nLeftarrow;": "\u21CD",
	"nLeftrightarrow;": "\u21CE",
	"nLl;": "\u22D8\u0338",
	"nLt;": "\u226A\u20D2",
	"nLtv;": "\u226A\u0338",
	"nRightarrow;": "\u21CF",
	"nVDash;": "\u22AF",
	"nVdash;": "\u22AE",
	"nabla;": "\u2207",
	"nacute;": "\u0144",
	"nang;": "\u2220\u20D2",
	"nap;": "\u2249",
	"napE;": "\u2A70\u0338",
	"napid;": "\u224B\u0338",
	"napos;": "\u0149",
	"napprox;": "\u2249",
	"natur;": "\u266E",
	"natural;": "\u266E",
	"naturals;": "\u2115",
	"nbsp": "\u00A0",
	"nbsp;": "\u00A0",
	"nbump;": "\u224E\u0338",
	"nbumpe;": "\u224F\u0338",
	"ncap;": "\u2A43",
	"ncaron;": "\u0148",
	"ncedil;": "\u0146",
	"ncong;": "\u2247\u0338",
	"ncongdot;": "\u2A6D",
	"ncup;": "\u2A42",
	"ncy;": "\u043D",
	"ndash;": "\u2013",
	"ne;": "\u2260",
	"neArr;": "\u21D7",
	"nearhk;": "\u2924",
	"nearr;": "\u2197",
	"nearrow;": "\u2197",
	"nedot;": "\u2250\u0338",
	"nequiv;": "\u2262",
	"nesear;": "\u2928",
	"nesim;": "\u2242\u0338",
	"nexist;": "\u2204",
	"nexists;": "\u2204",
	"nfr;": "\u1D52B",
	"ngE;": "\u2267\u0338",
	"nge;": "\u2271",
	"ngeq;": "\u2271",
	"ngeqq;": "\u2267\u0338",
	"ngeqslant;": "\u2A7E\u0338",
	"nges;": "\u2A7E\u0338",
	"ngsim;": "\u2275",
	"ngt;": "\u226F",
	"ngtr;": "\u226F",
	"nhArr;": "\u21CE",
	"nharr;": "\u21AE",
	"nhpar;": "\u2AF2",
	"ni;": "\u220B",
	"nis;": "\u22FC",
	"nisd;": "\u22FA",
	"niv;": "\u220B",
	"njcy;": "\u045A",
	"nlArr;": "\u21CD",
	"nlE;": "\u2266\u0338",
	"nlarr;": "\u219A",
	"nldr;": "\u2025",
	"nle;": "\u2270",
	"nleftarrow;": "\u219A",
	"nleftrightarrow;": "\u21AE",
	"nleq;": "\u2270",
	"nleqq;": "\u2266\u0338",
	"nleqslant;": "\u2A7D\u0338",
	"nles;": "\u2A7D\u0338",
	"nless;": "\u226E",
	"nlsim;": "\u2274",
	"nlt;": "\u226E",
	"nltri;": "\u22EA",
	"nltrie;": "\u22EC",
	"nmid;": "\u2224",
	"nopf;": "\u1D55F",
	"not": "\u00AC",
	"not;": "\u00AC",
	"notin;": "\u2209",
	"notinE;": "\u22F9\u0338",
	"notindot;": "\u22F5\u0338",
	"notinva;": "\u2209",
	"notinvb;": "\u22F7",
	"notinvc;": "\u22F6",
	"notni;": "\u220C",
	"notniva;": "\u220C",
	"notnivb;": "\u22FE",
	"notnivc;": "\u22FD",
	"npar;": "\u2226",
	"nparallel;": "\u2226",
	"nparsl;": "\u2AFD\u20E5",
	"npart;": "\u2202\u0338",
	"npolint;": "\u2A14",
	"npr;": "\u2280",
	"nprcue;": "\u22E0",
	"npre;": "\u2AAF",
	"nprec;": "\u2280",
	"npreceq;": "\u2AAF",
	"nrArr;": "\u21CF",
	"nrarr;": "\u219B",
	"nrarrc;": "\u2933\u0338",
	"nrarrw;": "\u219D\u0338",
	"nrightarrow;": "\u219B",
	"nrtri;": "\u22EB",
	"nrtrie;": "\u22ED",
	"nsc;": "\u2281",
	"nsccue;": "\u22E1",
	"nsce;": "\u2AB0\u0338",
	"nscr;": "\u1D4C3",
	"nshortmid;": "\u2224",
	"nshortparallel;": "\u2226",
	"nsim;": "\u2241",
	"nsime;": "\u2244",
	"nsimeq;": "\u2244",
	"nsmid;": "\u2224",
	"nspar;": "\u2226",
	"nsqsube;": "\u22E2",
	"nsqsupe;": "\u22E3",
	"nsub;": "\u2284",
	"nsubE;": "\u2AC5\u0338",
	"nsube;": "\u2288",
	"nsubset;": "\u2282\u0338",
	"nsubseteq;": "\u2288",
	"nsubseteqq;": "\u2AC5\u0338",
	"nsucc;": "\u2281",
	"nsucceq;": "\u2AB0\u0338",
	"nsup;": "\u2285",
	"nsupE;": "\u2AC6",
	"nsupe;": "\u2289",
	"nsupset;": "\u2283\u0338",
	"nsupseteq;": "\u2289",
	"nsupseteqq;": "\u2AC6\u0338",
	"ntgl;": "\u2279",
	"ntilde": "\u00F1",
	"ntilde;": "\u00F1",
	"ntlg;": "\u2278",
	"ntriangleleft;": "\u22EA",
	"ntrianglelefteq;": "\u22EC",
	"ntriangleright;": "\u22EB",
	"ntrianglerighteq;": "\u22ED",
	"nu;": "\u03BD",
	"num;": "#",
	"numero;": "\u2116",
	"numsp;": "\u2007",
	"nvDash;": "\u22AD",
	"nvHarr;": "\u2904",
	"nvap;": "\u224D\u20D2",
	"nvdash;": "\u22AC",
	"nvge;": "\u2265\u20D2",
	"nvgt;": "\u003E\u20D2",
	"nvinfin;": "\u29DE",
	"nvlArr;": "\u2902",
	"nvle;": "\u2264\u20D2",
	"nvlt;": "\u003C\u20D2",
	"nvltrie;": "\u22B4\u20D2",
	"nvrArr;": "\u2903",
	"nvrtrie;": "\u22B5\u20D2",
	"nvsim;": "\u223C\u20D2",
	"nwArr;": "\u21D6",
	"nwarhk;": "\u2923",
	"nwarr;": "\u2196",
	"nwarrow;": "\u2196",
	"nwnear;": "\u2927",
	"oS;": "\u24C8",
	"oacute": "\u00F3",
	"oacute;": "\u00F3",
	"oast;": "\u229B",
	"ocir;": "\u229A",
	"ocirc": "\u00F4",
	"ocirc;": "\u00F4",
	"ocy;": "\u043E",
	"odash;": "\u229D",
	"odblac;": "\u0151",
	"odiv;": "\u2A38",
	"odot;": "\u2299",
	"odsold;": "\u29BC",
	"oelig;": "\u0153",
	"ofcir;": "\u29BF",
	"ofr;": "\u1D52C",
	"ogon;": "\u02DB",
	"ograve": "\u00F2",
	"ograve;": "\u00F2",
	"ogt;": "\u29C1",
	"ohbar;": "\u29B5",
	"ohm;": "\u03A9",
	"oint;": "\u222E",
	"olarr;": "\u21BA",
	"olcir;": "\u29BE",
	"olcross;": "\u29BB",
	"oline;": "\u203E",
	"olt;": "\u29C0",
	"omacr;": "\u014D",
	"omega;": "\u03C9",
	"omicron;": "\u03BF",
	"omid;": "\u29B6",
	"ominus;": "\u2296",
	"oopf;": "\u1D560",
	"opar;": "\u29B7",
	"operp;": "\u29B9",
	"oplus;": "\u2295",
	"or;": "\u2228",
	"orarr;": "\u21BB",
	"ord;": "\u2A5D",
	"order;": "\u2134",
	"orderof;": "\u2134",
	"ordf": "\u00AA",
	"ordf;": "\u00AA",
	"ordm": "\u00BA",
	"ordm;": "\u00BA",
	"origof;": "\u22B6",
	"oror;": "\u2A56",
	"orslope;": "\u2A57",
	"orv;": "\u2A5B",
	"oscr;": "\u2134",
	"oslash": "\u00F8",
	"oslash;": "\u00F8",
	"osol;": "\u2298",
	"otilde": "\u00F5",
	"otilde;": "\u00F5",
	"otimes;": "\u2297",
	"otimesas;": "\u2A36",
	"ouml": "\u00F6",
	"ouml;": "\u00F6",
	"ovbar;": "\u233D",
	"par;": "\u2225",
	"para": "\u00B6",
	"para;": "\u00B6",
	"parallel;": "\u2225",
	"parsim;": "\u2AF3",
	"parsl;": "\u2AFD",
	"part;": "\u2202",
	"pcy;": "\u043F",
	"percnt;": "%",
	"period;": ".",
	"permil;": "\u2030",
	"perp;": "\u22A5",
	"pertenk;": "\u2031",
	"pfr;": "\u1D52D",
	"phi;": "\u03C6",
	"phiv;": "\u03D5",
	"phmmat;": "\u2133",
	"phone;": "\u260E",
	"pi;": "\u03C0",
	"pitchfork;": "\u22D4",
	"piv;": "\u03D6",
	"planck;": "\u210F",
	"planckh;": "\u210E",
	"plankv;": "\u210F",
	"plus;": "+",
	"plusacir;": "\u2A23",
	"plusb;": "\u229E",
	"pluscir;": "\u2A22",
	"plusdo;": "\u2214",
	"plusdu;": "\u2A25",
	"pluse;": "\u2A72",
	"plusmn": "\u00B1",
	"plusmn;": "\u00B1",
	"plussim;": "\u2A26",
	"plustwo;": "\u2A27",
	"pm;": "\u00B1",
	"pointint;": "\u2A15",
	"popf;": "\u1D561",
	"pound": "\u00A3",
	"pound;": "\u00A3",
	"pr;": "\u227A",
	"prE;": "\u2AB3",
	"prap;": "\u2AB7",
	"prcue;": "\u227C",
	"pre;": "\u2AAF",
	"prec;": "\u227A",
	"precapprox;": "\u2AB7",
	"preccurlyeq;": "\u227C",
	"preceq;": "\u2AAF",
	"precnapprox;": "\u2AB9",
	"precneqq;": "\u2AB5",
	"precnsim;": "\u22E8",
	"precsim;": "\u227E",
	"prime;": "\u2032",
	"primes;": "\u2119",
	"prnE;": "\u2AB5",
	"prnap;": "\u2AB9",
	"prnsim;": "\u22E8",
	"prod;": "\u220F",
	"profalar;": "\u232E",
	"profline;": "\u2312",
	"profsurf;": "\u2313",
	"prop;": "\u221D",
	"propto;": "\u221D",
	"prsim;": "\u227E",
	"prurel;": "\u22B0",
	"pscr;": "\u1D4C5",
	"psi;": "\u03C8",
	"puncsp;": "\u2008",
	"qfr;": "\u1D52E",
	"qint;": "\u2A0C",
	"qopf;": "\u1D562",
	"qprime;": "\u2057",
	"qscr;": "\u1D4C6",
	"quaternions;": "\u210D",
	"quatint;": "\u2A16",
	"quest;": "?",
	"questeq;": "\u225F",
	"quot": "\u0022",
	"quot;": "\u0022",
	"rAarr;": "\u21DB",
	"rArr;": "\u21D2",
	"rAtail;": "\u291C",
	"rBarr;": "\u290F",
	"rHar;": "\u2964",
	"race;": "\u223D\u0331",
	"racute;": "\u0155",
	"radic;": "\u221A",
	"raemptyv;": "\u29B3",
	"rang;": "\u27E9",
	"rangd;": "\u2992",
	"range;": "\u29A5",
	"rangle;": "\u27E9",
	"raquo": "\u00BB",
	"raquo;": "\u00BB",
	"rarr;": "\u2192",
	"rarrap;": "\u2975",
	"rarrb;": "\u21E5",
	"rarrbfs;": "\u2920",
	"rarrc;": "\u2933",
	"rarrfs;": "\u291E",
	"rarrhk;": "\u21AA",
	"rarrlp;": "\u21AC",
	"rarrpl;": "\u2945",
	"rarrsim;": "\u2974",
	"rarrtl;": "\u21A3",
	"rarrw;": "\u219D",
	"ratail;": "\u291A",
	"ratio;": "\u2236",
	"rationals;": "\u211A",
	"rbarr;": "\u290D",
	"rbbrk;": "\u2773",
	"rbrace;": "}",
	"rbrack;": "]",
	"rbrke;": "\u298C",
	"rbrksld;": "\u298E",
	"rbrkslu;": "\u2990",
	"rcaron;": "\u0159",
	"rcedil;": "\u0157",
	"rceil;": "\u2309",
	"rcub;": "}",
	"rcy;": "\u0440",
	"rdca;": "\u2937",
	"rdldhar;": "\u2969",
	"rdquo;": "\u201D",
	"rdquor;": "\u201D",
	"rdsh;": "\u21B3",
	"real;": "\u211C",
	"realine;": "\u211B",
	"realpart;": "\u211C",
	"reals;": "\u211D",
	"rect;": "\u25AD",
	"reg": "\u00AE",
	"reg;": "\u00AE",
	"rfisht;": "\u297D",
	"rfloor;": "\u230B",
	"rfr;": "\u1D52F",
	"rhard;": "\u21C1",
	"rharu;": "\u21C0",
	"rharul;": "\u296C",
	"rho;": "\u03C1",
	"rhov;": "\u03F1",
	"rightarrow;": "\u2192",
	"rightarrowtail;": "\u21A3",
	"rightharpoondown;": "\u21C1",
	"rightharpoonup;": "\u21C0",
	"rightleftarrows;": "\u21C4",
	"rightleftharpoons;": "\u21CC",
	"rightrightarrows;": "\u21C9",
	"rightsquigarrow;": "\u219D",
	"rightthreetimes;": "\u22CC",
	"ring;": "\u02DA",
	"risingdotseq;": "\u2253",
	"rlarr;": "\u21C4",
	"rlhar;": "\u21CC",
	"rlm;": "\u200F",
	"rmoust;": "\u23B1",
	"rmoustache;": "\u23B1",
	"rnmid;": "\u2AEE",
	"roang;": "\u27ED",
	"roarr;": "\u21FE",
	"robrk;": "\u27E7",
	"ropar;": "\u2986",
	"ropf;": "\u1D563",
	"roplus;": "\u2A2E",
	"rotimes;": "\u2A35",
	"rpar;": ")",
	"rpargt;": "\u2994",
	"rppolint;": "\u2A12",
	"rrarr;": "\u21C9",
	"rsaquo;": "\u203A",
	"rscr;": "\u1D4C7",
	"rsh;": "\u21B1",
	"rsqb;": "]",
	"rsquo;": "\u2019",
	"rsquor;": "\u2019",
	"rthree;": "\u22CC",
	"rtimes;": "\u22CA",
	"rtri;": "\u25B9",
	"rtrie;": "\u22B5",
	"rtrif;": "\u25B8",
	"rtriltri;": "\u29CE",
	"ruluhar;": "\u2968",
	"rx;": "\u211E",
	"sacute;": "\u015B",
	"sbquo;": "\u201A",
	"sc;": "\u227B",
	"scE;": "\u2AB4",
	"scap;": "\u2AB8",
	"scaron;": "\u0161",
	"sccue;": "\u227D",
	"sce;": "\u2AB0",
	"scedil;": "\u015F",
	"scirc;": "\u015D",
	"scnE;": "\u2AB6",
	"scnap;": "\u2ABA",
	"scnsim;": "\u22E9",
	"scpolint;": "\u2A13",
	"scsim;": "\u227F",
	"scy;": "\u0441",
	"sdot;": "\u22C5",
	"sdotb;": "\u22A1",
	"sdote;": "\u2A66",
	"seArr;": "\u21D8",
	"searhk;": "\u2925",
	"searr;": "\u2198",
	"searrow;": "\u2198",
	"sect": "\u00A7",
	"sect;": "\u00A7",
	"semi;": ";",
	"seswar;": "\u2929",
	"setminus;": "\u2216",
	"setmn;": "\u2216",
	"sext;": "\u2736",
	"sfr;": "\u1D530",
	"sfrown;": "\u2322",
	"sharp;": "\u266F",
	"shchcy;": "\u0449",
	"shcy;": "\u0448",
	"shortmid;": "\u2223",
	"shortparallel;": "\u2225",
	"shy": "\u00AD",
	"shy;": "\u00AD",
	"sigma;": "\u03C3",
	"sigmaf;": "\u03C2",
	"sigmav;": "\u03C2",
	"sim;": "\u223C",
	"simdot;": "\u2A6A",
	"sime;": "\u2243",
	"simeq;": "\u2243",
	"simg;": "\u2A9E",
	"simgE;": "\u2AA0",
	"siml;": "\u2A9D",
	"simlE;": "\u2A9F",
	"simne;": "\u2246",
	"simplus;": "\u2A24",
	"simrarr;": "\u2972",
	"slarr;": "\u2190",
	"smallsetminus;": "\u2216",
	"smashp;": "\u2A33",
	"smeparsl;": "\u29E4",
	"smid;": "\u2223",
	"smile;": "\u2323",
	"smt;": "\u2AAA",
	"smte;": "\u2AAC",
	"smtes;": "\u2AAC\uFE00",
	"softcy;": "\u044C",
	"sol;": "/",
	"solb;": "\u29C4",
	"solbar;": "\u233F",
	"sopf;": "\u1D564",
	"spades;": "\u2660",
	"spadesuit;": "\u2660",
	"spar;": "\u2225",
	"sqcap;": "\u2293",
	"sqcaps;": "\u2293\uFE00",
	"sqcup;": "\u2294",
	"sqcups;": "\u2294\uFE00",
	"sqsub;": "\u228F",
	"sqsube;": "\u2291",
	"sqsubset;": "\u228F",
	"sqsubseteq;": "\u2291",
	"sqsup;": "\u2290",
	"sqsupe;": "\u2292",
	"sqsupset;": "\u2290",
	"sqsupseteq;": "\u2292",
	"squ;": "\u25A1",
	"square;": "\u25A1",
	"squarf;": "\u25AA",
	"squf;": "\u25AA",
	"srarr;": "\u2192",
	"sscr;": "\u1D4C8",
	"ssetmn;": "\u2216",
	"ssmile;": "\u2323",
	"sstarf;": "\u22C6",
	"star;": "\u2606",
	"starf;": "\u2605",
	"straightepsilon;": "\u03F5",
	"straightphi;": "\u03D5",
	"strns;": "\u00AF",
	"sub;": "\u2282",
	"subE;": "\u2AC5",
	"subdot;": "\u2ABD",
	"sube;": "\u2286",
	"subedot;": "\u2AC3",
	"submult;": "\u2AC1",
	"subnE;": "\u2ACB",
	"subne;": "\u228A",
	"subplus;": "\u2ABF",
	"subrarr;": "\u2979",
	"subset;": "\u2282",
	"subseteq;": "\u2286",
	"subseteqq;": "\u2AC5",
	"subsetneq;": "\u228A",
	"subsetneqq;": "\u2ACB",
	"subsim;": "\u2AC7",
	"subsub;": "\u2AD5",
	"subsup;": "\u2AD3",
	"succ;": "\u227B",
	"succapprox;": "\u2AB8",
	"succcurlyeq;": "\u227D",
	"succeq;": "\u2AB0",
	"succnapprox;": "\u2ABA",
	"succneqq;": "\u2AB6",
	"succnsim;": "\u22E9",
	"succsim;": "\u227F",
	"sum;": "\u2211",
	"sung;": "\u266A",
	"sup1": "\u00B9",
	"sup1;": "\u00B9",
	"sup2": "\u00B2",
	"sup2;": "\u00B2",
	"sup3": "\u00B3",
	"sup3;": "\u00B3",
	"sup;": "\u2283",
	"supE;": "\u2AC6",
	"supdot;": "\u2ABE",
	"supdsub;": "\u2AD8",
	"supe;": "\u2287",
	"supedot;": "\u2AC4",
	"suphsol;": "\u27C9",
	"suphsub;": "\u2AD7",
	"suplarr;": "\u297B",
	"supmult;": "\u2AC2",
	"supnE;": "\u2ACC",
	"supne;": "\u228B",
	"supplus;": "\u2AC0",
	"supset;": "\u2283",
	"supseteq;": "\u2287",
	"supseteqq;": "\u2AC6",
	"supsetneq;": "\u228B",
	"supsetneqq;": "\u2ACC",
	"supsim;": "\u2AC8",
	"supsub;": "\u2AD4",
	"supsup;": "\u2AD6",
	"swArr;": "\u21D9",
	"swarhk;": "\u2926",
	"swarr;": "\u2199",
	"swarrow;": "\u2199",
	"swnwar;": "\u292A",
	"szlig": "\u00DF",
	"szlig;": "\u00DF",
	"target;": "\u2316",
	"tau;": "\u03C4",
	"tbrk;": "\u23B4",
	"tcaron;": "\u0165",
	"tcedil;": "\u0163",
	"tcy;": "\u0442",
	"tdot;": "\u20DB",
	"telrec;": "\u2315",
	"tfr;": "\u1D531",
	"there4;": "\u2234",
	"therefore;": "\u2234",
	"theta;": "\u03B8",
	"thetasym;": "\u03D1",
	"thetav;": "\u03D1",
	"thickapprox;": "\u2248",
	"thicksim;": "\u223C",
	"thinsp;": "\u2009",
	"thkap;": "\u2248",
	"thksim;": "\u223C",
	"thorn": "\u00FE",
	"thorn;": "\u00FE",
	"tilde;": "\u02DC",
	"times": "\u00D7",
	"times;": "\u00D7",
	"timesb;": "\u22A0",
	"timesbar;": "\u2A31",
	"timesd;": "\u2A30",
	"tint;": "\u222D",
	"toea;": "\u2928",
	"top;": "\u22A4",
	"topbot;": "\u2336",
	"topcir;": "\u2AF1",
	"topf;": "\u1D565",
	"topfork;": "\u2ADA",
	"tosa;": "\u2929",
	"tprime;": "\u2034",
	"trade;": "\u2122",
	"triangle;": "\u25B5",
	"triangledown;": "\u25BF",
	"triangleleft;": "\u25C3",
	"trianglelefteq;": "\u22B4",
	"triangleq;": "\u225C",
	"triangleright;": "\u25B9",
	"trianglerighteq;": "\u22B5",
	"tridot;": "\u25EC",
	"trie;": "\u225C",
	"triminus;": "\u2A3A",
	"triplus;": "\u2A39",
	"trisb;": "\u29CD",
	"tritime;": "\u2A3B",
	"trpezium;": "\u23E2",
	"tscr;": "\u1D4C9",
	"tscy;": "\u0446",
	"tshcy;": "\u045B",
	"tstrok;": "\u0167",
	"twixt;": "\u226C",
	"twoheadleftarrow;": "\u219E",
	"twoheadrightarrow;": "\u21A0",
	"uArr;": "\u21D1",
	"uHar;": "\u2963",
	"uacute": "\u00FA",
	"uacute;": "\u00FA",
	"uarr;": "\u2191",
	"ubrcy;": "\u045E",
	"ubreve;": "\u016D",
	"ucirc": "\u00FB",
	"ucirc;": "\u00FB",
	"ucy;": "\u0443",
	"udarr;": "\u21C5",
	"udblac;": "\u0171",
	"udhar;": "\u296E",
	"ufisht;": "\u297E",
	"ufr;": "\u1D532",
	"ugrave": "\u00F9",
	"ugrave;": "\u00F9",
	"uharl;": "\u21BF",
	"uharr;": "\u21BE",
	"uhblk;": "\u2580",
	"ulcorn;": "\u231C",
	"ulcorner;": "\u231C",
	"ulcrop;": "\u230F",
	"ultri;": "\u25F8",
	"umacr;": "\u016B",
	"uml": "\u00A8",
	"uml;": "\u00A8",
	"uogon;": "\u0173",
	"uopf;": "\u1D566",
	"uparrow;": "\u2191",
	"updownarrow;": "\u2195",
	"upharpoonleft;": "\u21BF",
	"upharpoonright;": "\u21BE",
	"uplus;": "\u228E",
	"upsi;": "\u03C5",
	"upsih;": "\u03D2",
	"upsilon;": "\u03C5",
	"upuparrows;": "\u21C8",
	"urcorn;": "\u231D",
	"urcorner;": "\u231D",
	"urcrop;": "\u230E",
	"uring;": "\u016F",
	"urtri;": "\u25F9",
	"uscr;": "\u1D4CA",
	"utdot;": "\u22F0",
	"utilde;": "\u0169",
	"utri;": "\u25B5",
	"utrif;": "\u25B4",
	"uuarr;": "\u21C8",
	"uuml": "\u00FC",
	"uuml;": "\u00FC",
	"uwangle;": "\u29A7",
	"vArr;": "\u21D5",
	"vBar;": "\u2AE8",
	"vBarv;": "\u2AE9",
	"vDash;": "\u22A8",
	"vangrt;": "\u299C",
	"varepsilon;": "\u03F5",
	"varkappa;": "\u03F0",
	"varnothing;": "\u2205",
	"varphi;": "\u03D5",
	"varpi;": "\u03D6",
	"varpropto;": "\u221D",
	"varr;": "\u2195",
	"varrho;": "\u03F1",
	"varsigma;": "\u03C2",
	"varsubsetneq;": "\u228A\uFE00",
	"varsubsetneqq;": "\u2ACB\uFE00",
	"varsupsetneq;": "\u228B\uFE00",
	"varsupsetneqq;": "\u2ACC\uFE00",
	"vartheta;": "\u03D1",
	"vartriangleleft;": "\u22B2",
	"vartriangleright;": "\u22B3",
	"vcy;": "\u0432",
	"vdash;": "\u22A2",
	"vee;": "\u2228",
	"veebar;": "\u22BB",
	"veeeq;": "\u225A",
	"vellip;": "\u22EE",
	"verbar;": "|",
	"vert;": "|",
	"vfr;": "\u1D533",
	"vltri;": "\u22B2",
	"vnsub;": "\u2282\u20D2",
	"vnsup;": "\u2283\u20D2",
	"vopf;": "\u1D567",
	"vprop;": "\u221D",
	"vrtri;": "\u22B3",
	"vscr;": "\u1D4CB",
	"vsubnE;": "\u2ACB\uFE00",
	"vsubne;": "\u228A\uFE00",
	"vsupnE;": "\u2ACC\uFE00",
	"vsupne;": "\u228B\uFE00",
	"vzigzag;": "\u299A",
	"wcirc;": "\u0175",
	"wedbar;": "\u2A5F",
	"wedge;": "\u2227",
	"wedgeq;": "\u2259",
	"weierp;": "\u2118",
	"wfr;": "\u1D534",
	"wopf;": "\u1D568",
	"wp;": "\u2118",
	"wr;": "\u2240",
	"wreath;": "\u2240",
	"wscr;": "\u1D4CC",
	"xcap;": "\u22C2",
	"xcirc;": "\u25EF",
	"xcup;": "\u22C3",
	"xdtri;": "\u25BD",
	"xfr;": "\u1D535",
	"xhArr;": "\u27FA",
	"xharr;": "\u27F7",
	"xi;": "\u03BE",
	"xlArr;": "\u27F8",
	"xlarr;": "\u27F5",
	"xmap;": "\u27FC",
	"xnis;": "\u22FB",
	"xodot;": "\u2A00",
	"xopf;": "\u1D569",
	"xoplus;": "\u2A01",
	"xotime;": "\u2A02",
	"xrArr;": "\u27F9",
	"xrarr;": "\u27F6",
	"xscr;": "\u1D4CD",
	"xsqcup;": "\u2A06",
	"xuplus;": "\u2A04",
	"xutri;": "\u25B3",
	"xvee;": "\u22C1",
	"xwedge;": "\u22C0",
	"yacute": "\u00FD",
	"yacute;": "\u00FD",
	"yacy;": "\u044F",
	"ycirc;": "\u0177",
	"ycy;": "\u044B",
	"yen": "\u00A5",
	"yen;": "\u00A5",
	"yfr;": "\u1D536",
	"yicy;": "\u0457",
	"yopf;": "\u1D56A",
	"yscr;": "\u1D4CE",
	"yucy;": "\u044E",
	"yuml": "\u00FF",
	"yuml;": "\u00FF",
	"zacute;": "\u017A",
	"zcaron;": "\u017E",
	"zcy;": "\u0437",
	"zdot;": "\u017C",
	"zeetrf;": "\u2128",
	"zeta;": "\u03B6",
	"zfr;": "\u1D537",
	"zhcy;": "\u0436",
	"zigrarr;": "\u21DD",
	"zopf;": "\u1D56B",
	"zscr;": "\u1D4CF",
	"zwj;": "\u200D",
	"zwnj;": "\u200C"
};

},{}],13:[function(req,module,exports){
(function(){// UTILITY
var util = req('util');
var Buffer = req("buffer").Buffer;
var pSlice = Array.prototype.slice;

function objectKeys(object) {
  if (Object.keys) return Object.keys(object);
  var result = [];
  for (var name in object) {
    if (Object.prototype.hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (value === undefined) {
    return '' + value;
  }
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (typeof value === 'function' || value instanceof RegExp) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (typeof s == 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

assert.AssertionError.prototype.toString = function() {
  if (this.message) {
    return [this.name + ':', this.message].join(' ');
  } else {
    return [
      this.name + ':',
      truncate(JSON.stringify(this.actual, replacer), 128),
      this.operator,
      truncate(JSON.stringify(this.expected, replacer), 128)
    ].join(' ');
  }
};

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!!!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (expected instanceof RegExp) {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail('Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail('Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

})()
},{"buffer":17,"util":15}],14:[function(req,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(req("__browserify_process"))
},{"__browserify_process":20}],15:[function(req,module,exports){
var events = req('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\u001b[' + styles[style][0] + 'm' + str +
             '\u001b[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && Object.prototype.toString.call(ar) === '[object Array]');
}


function isRegExp(re) {
  typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]';
}


function isDate(d) {
  return typeof d === 'object' && Object.prototype.toString.call(d) === '[object Date]';
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":14}],16:[function(req,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],17:[function(req,module,exports){
(function(){var assert = req('assert');
exports.Buffer = Buffer;
exports.SlowBuffer = Buffer;
Buffer.poolSize = 8192;
exports.INSPECT_MAX_BYTES = 50;

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }
  this.parent = this;
  this.offset = 0;

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        if (subject instanceof Buffer) {
          this[i] = subject.readUInt8(i);
        }
        else {
          this[i] = subject[i];
        }
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    } else if (type === 'number') {
      for (var i = 0; i < this.length; i++) {
        this[i] = 0;
      }
    }
  }
}

Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this[i];
};

Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this[i] = v;
};

Buffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
    case 'binary':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

Buffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return Buffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

Buffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return Buffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

Buffer.prototype.binaryWrite = Buffer.prototype.asciiWrite;

Buffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return Buffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

Buffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return req("base64-js").fromByteArray(bytes);
};

Buffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

Buffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

Buffer.prototype.binarySlice = Buffer.prototype.asciiSlice;

Buffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


Buffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  Buffer._charsWritten = i * 2;
  return i;
};


Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  if (end === undefined || isNaN(end)) {
    end = this.length;
  }
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  var temp = [];
  for (var i=start; i<end; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=target_start; i<target_start+temp.length; i++) {
    target[i] = temp[i-target_start];
  }
};

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  for (var i = start; i < end; i++) {
    this[i] = value;
  }
}

// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof Buffer;
};

Buffer.concat = function (list, totalLength) {
  if (!isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// helpers

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}

function isArray(subject) {
  return (Array.isArray ||
    function(subject){
      return {}.toString.apply(subject) == '[object Array]'
    })
    (subject)
}

function isArrayIsh(subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return req("base64-js").toByteArray(str);
}

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

// read/write bit-twiddling

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  return buffer[offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    val = buffer[offset] << 8;
    if (offset + 1 < buffer.length) {
      val |= buffer[offset + 1];
    }
  } else {
    val = buffer[offset];
    if (offset + 1 < buffer.length) {
      val |= buffer[offset + 1] << 8;
    }
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    if (offset + 1 < buffer.length)
      val = buffer[offset + 1] << 16;
    if (offset + 2 < buffer.length)
      val |= buffer[offset + 2] << 8;
    if (offset + 3 < buffer.length)
      val |= buffer[offset + 3];
    val = val + (buffer[offset] << 24 >>> 0);
  } else {
    if (offset + 2 < buffer.length)
      val = buffer[offset + 2] << 16;
    if (offset + 1 < buffer.length)
      val |= buffer[offset + 1] << 8;
    val |= buffer[offset];
    if (offset + 3 < buffer.length)
      val = val + (buffer[offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  neg = buffer[offset] & 0x80;
  if (!neg) {
    return (buffer[offset]);
  }

  return ((0xff - buffer[offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return req('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return req('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  if (offset < buffer.length) {
    buffer[offset] = value;
  }
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 2); i++) {
    buffer[offset + i] =
        (value & (0xff << (8 * (isBigEndian ? 1 - i : i)))) >>>
            (isBigEndian ? 1 - i : i) * 8;
  }

}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 4); i++) {
    buffer[offset + i] =
        (value >>> (isBigEndian ? 3 - i : i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  req('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  req('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

})()
},{"./buffer_ieee754":16,"assert":13,"base64-js":18}],18:[function(req,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],"./lib/sax/SAXParser.js":[function(req,module,exports){
module.exports=req('DaboPu');
},{}],20:[function(req,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},["DaboPu"])
;
exports.SAXParser = req('./lib/sax/SAXParser.js').SAXParser;
});
