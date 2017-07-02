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

var ArabicAlefBetIntervalsBegine = ['\u0621', '\u0641'];
var ArabicAlefBetIntervalsEnd = ['\u063A', '\u064a'];
var dir = 0, hiLevel = 0;
var lastArabic = false, hasUBAT_AL = false,  hasUBAT_B = false,  hasUBAT_S = false, hasBlockSep = false, hasSegSep = false;

var impTab_LTR = [
				/*		L,		R,		EN,		AN,		N,		IL,		Cond */
/* 0 LTR text	*/	[	0,		3,		0,		1,		0,		0,		0	],
/* 1 LTR+AN		*/	[	0,		3,		0,		1,		2,		2,		0	],
/* 2 LTR+AN+N	*/	[	0,		3,		0,		0x11,		2,		0,		1	],
/* 3 RTL text	*/	[	0,		3,		5,		5,		4,		1,		0	],
/* 4 RTL cont	*/	[	0,		3,		0x15,		0x15,		4,		0,		1	],
/* 5 RTL+EN/AN	*/	[	0,		3,		5,		5,		4,		2,		0	]
];

var impTab_RTL = [
		/*		L,		R,		EN,		AN,		N,		IL,		Cond */
/* 0 RTL text	*/	[	2,		0,		1,		1,		0,		1,		0	],
/* 1 RTL+EN/AN	*/	[	2,		0,		1,		1,		0,		2,		0	],
/* 2 LTR text	*/	[	2,		0,		2,		1,		3,		2,		0	],
/* 3 LTR+cont	*/	[	2,		0,		2,		0x21,		3,		1,		1	]
];

var LTR = 0, RTL = 1;

var L = 0; /* left to right */
var R = 1; /* right to left */
var EN = 2; /* European digit */
var AN = 3; /* Arabic-Indic digit */
var ON = 4; /* neutral */
var B = 5; /* block separator */
var S = 6; /* segment separator */
var AL = 7; /* Arabic Letter */
var WS = 8; /* white space */
var CS = 9; /* common digit separator */
var ES = 10; /* European digit separator */
var ET = 11; /* European digit terminator */
var NSM = 12; /* Non Spacing Mark */
var LRE = 13; /* LRE */
var RLE = 14; /* RLE */
var PDF = 15; /* PDF */
var LRO = 16; /* LRO */
var RLO = 17; /* RLO */
var BN = 18; /* Boundary Neutral */

var UnicodeTBL00 = [
BN,BN,BN,BN,BN,BN,BN,BN,BN,S,B,S,WS,B,BN,BN,
BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,B,B,B,S,
WS,ON,ON,ET,ET,ET,ON,ON,ON,ON,ON,ES,CS,ES,CS,CS,
EN,EN,EN,EN,EN,EN,EN,EN,EN,EN,CS,ON,ON,ON,ON,ON,
ON,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,
L,L,L,L,L,L,L,L,L,L,L,ON,ON,ON,ON,ON,
ON,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,
L,L,L,L,L,L,L,L,L,L,L,ON,ON,ON,ON,BN,
BN,BN,BN,BN,BN,B,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,
BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,BN,
CS,ON,ET,ET,ET,ET,ON,ON,ON,ON,L,ON,ON,BN,ON,ON,
ET,ET,EN,EN,ON,L,ON,ON,ON,EN,L,ON,ON,ON,ON,ON
];

var UnicodeTBL20 = [
WS,WS,WS,WS,WS,WS,WS,WS,WS,WS,WS,BN,BN,BN,L,R	,
ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,
ON,ON,ON,ON,ON,ON,ON,ON,WS,B,LRE,RLE,PDF,LRO,RLO,CS,
ET,ET,ET,ET,ET,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,
ON,ON,ON,ON,CS,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,
ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,ON,WS
];

function _computeLevels(chars, levels, len, charTypes) {
	var impTab = dir ? impTab_RTL : impTab_LTR
		, prevState = null, newClass = null, newLevel = null, newState = 0
		, action = null, cond = null, condPos = -1, i = null, ix = null, classes = [];

	if (!charTypes) {
		for (i = 0, charTypes = []; i < len; i++) {
			charTypes[i] = _getCharacterType(chars[i]);
		}
	}
	hiLevel = dir;
	lastArabic = false;
	hasUBAT_AL = false;
	hasUBAT_B = false;
	hasUBAT_S = false;
	for (ix = 0; ix < len; ix++){
		prevState = newState;
		classes[ix] = newClass = _getCharClass(chars, charTypes, classes, ix);
		newState = impTab[prevState][newClass];
		action = newState & 0xF0;
		newState &= 0x0F;
		levels[ix] = newLevel = impTab[newState][5];
		if (action > 0){
			if (action == 0x10){
				for(i = condPos; i < ix; i++){
					levels[i] = 1;
				}
				condPos = -1;
			} else {
				condPos = -1;
			}
		}
		cond = impTab[newState][6];
		if (cond){
			if(condPos == -1){
				condPos = ix;
			}
		}else{
			if (condPos > -1){
				for(i = condPos; i < ix; i++){
					levels[i] = newLevel;
				}
				condPos = -1;
			}
		}
		if (charTypes[ix] == B){
			levels[ix] = 0;
		}
		hiLevel |= newLevel;
	}
	if (hasUBAT_S){
		for(i = 0; i < len; i++){
			if(charTypes[i] == S){
				levels[i] = dir;
				for(var j = i - 1; j >= 0; j--){
					if(charTypes[j] == WS){
						levels[j] = dir;
					}else{
						break;
					}
				}
			}
		}
	}
}

function _invertLevel(lev, levels, _array) {
	if (hiLevel < lev){
		return;
	}
	if (lev == 1 && dir == RTL && !hasUBAT_B){
		_array.reverse();
		return;
	}
	var len = _array.length, start = 0, end, lo, hi, tmp;
	while(start < len){
		if (levels[start] >= lev){
			end = start + 1;
		while(end < len && levels[end] >= lev){
			end++;
		}
		for(lo = start, hi = end - 1 ; lo < hi; lo++, hi--){
			tmp = _array[lo];
			_array[lo] = _array[hi];
			_array[hi] = tmp;
		}
		start = end;
	}
	start++;
	}
}

function _getCharClass(chars, types, classes, ix) {			
	var cType = types[ix], wType, nType, len, i;
	switch(cType){
		case L:
		case R:
			lastArabic = false;
		case ON:
		case AN:
			return cType;
		case EN:
			return lastArabic ? AN : EN;
		case AL:
			lastArabic = true;
			hasUBAT_AL = true;
			return R;
		case WS:
			return ON;
		case CS:
			if (ix < 1 || (ix + 1) >= types.length ||
				((wType = classes[ix - 1]) != EN && wType != AN) ||
				((nType = types[ix + 1]) != EN && nType != AN)){
				return ON;
			}
			if (lastArabic){nType = AN;}
			return nType == wType ? nType : ON;
		case ES:
			wType = ix > 0 ? classes[ix - 1] : B;
			if (wType == EN && (ix + 1) < types.length && types[ix + 1] == EN){
				return EN;
			}
			return ON;
		case ET:
			if (ix > 0 && classes[ix - 1] == EN){
				return EN;
			}
			if (lastArabic){
				return ON;
			}
			i = ix + 1;
			len = types.length;
			while (i < len && types[i] == ET){
				i++;
			}
			if (i < len && types[i] == EN){
				return EN;
			}
			return ON;
		case NSM:
			len = types.length;
			i = ix + 1;
			while (i < len && types[i] == NSM){
				i++;
			}
			if (i < len){
				var c = chars[ix], rtlCandidate = (c >= 0x0591 && c <= 0x08FF) || c == 0xFB1E;
				
				wType = types[i];
				if (rtlCandidate && (wType == R || wType == AL)){
					return R;
				}
			}

			if (ix < 1 || (wType = types[ix - 1]) == B){
				return ON;
			}
			return classes[ix - 1];
		case B:
			lastArabic = false;
			hasUBAT_B = true;
			return dir;
		case S:
			hasUBAT_S = true;
			return ON;
		case LRE:
		case RLE:
		case LRO:
		case RLO:
		case PDF:
			lastArabic = false;
		case BN:
			return ON;
	}
}

function _getCharacterType( ch ) {		
	var uc = ch.charCodeAt(0), hi = uc >> 8;
	
	if (hi == 0) {		
		return ((uc > 0x00BF) ? L : UnicodeTBL00[uc]);
	} else if (hi == 5) {
		return (/[\u0591-\u05f4]/.test(ch) ? R : L);
	} else if (hi == 6) {
		if (/[\u0610-\u061a\u064b-\u065f\u06d6-\u06e4\u06e7-\u06ed]/.test(ch))
			return NSM;
		else if (/[\u0660-\u0669\u066b-\u066c]/.test(ch))
			return AN;
		else if (uc == 0x066A)
			return ET;
		else if (/[\u06f0-\u06f9]/.test(ch))
			return EN;			
		else
			return AL;
	} else if (hi == 0x20 && uc <= 0x205F) {
		return UnicodeTBL20[uc & 0xFF];
	} else if (hi == 0xFE) {
		return (uc >= 0xFE70 ? AL : ON);
	}		
	return ON;	
}

function _isArabicDiacritics( ch ) {
	return (ch >= '\u064b' && ch <= '\u0655');
}

/* Strong LTR character (0 - even), regular width */
exports.L = L;
/* Strong RTL character (1 - odd), Bidi width */
exports.R = R;
/* European digit (2 - even), regular width */
exports.EN = EN;
/* Neutral RTL-by-context character (3 - odd), regular width */
exports.ON_R = 3;
/* Hindi (Arabic) digit (4 - even), Bidi width */
exports.AN = 4;
/* Arabic LamAlef (5 - odd), Half Bidi width */
exports.R_H = 5;
/* invisible EOL (6 - even), zero width */
exports.B = 6;

exports.DOT = "\xB7";

/**
 * Performs text reordering by implementing Unicode Bidi algorithm
 * with aim to produce logical<->visual map and Bidi levels
 * @param {String} text string to be reordered
 * @param {Array} unicode character types produced by call to 'hasBidiCharacters'
 * @param {Boolean} 'true' for right-to-left text direction, otherwise 'false'
 *
 * @return {Object} An object containing logicalFromVisual map and Bidi levels
 **/
exports.doBidiReorder = function(text, textCharTypes, isRtl) {
	if (text.length < 2)
		return {};
		
	var chars = text.split(""), logicalFromVisual = new Array(chars.length),
		bidiLevels = new Array(chars.length), levels = []; 

	dir = isRtl ? RTL : LTR;

	_computeLevels(chars, levels, chars.length, textCharTypes);

	for (var i = 0; i < logicalFromVisual.length; logicalFromVisual[i] = i, i++);

	_invertLevel(2, levels, logicalFromVisual);
	_invertLevel(1, levels, logicalFromVisual);

	for (var i = 0; i < logicalFromVisual.length - 1; i++) { //fix levels to reflect character width
		if (textCharTypes[i] === AN) {
			levels[i] = exports.AN;
		} else if (levels[i] === R && ((textCharTypes[i] > AL && textCharTypes[i] < LRE) 
			|| textCharTypes[i] === ON || textCharTypes[i] === BN)) {
			levels[i] = exports.ON_R;
		} else if ((i > 0 && chars[i - 1] === '\u0644') && /\u0622|\u0623|\u0625|\u0627/.test(chars[i])) {
			levels[i - 1] = levels[i] = exports.R_H;
			i++;
		}
	}
	/* fix level to mark zero length EOL */
	if (chars[chars.length - 1] === exports.DOT)
		levels[chars.length - 1] = exports.B;
				
	for (var i = 0; i < logicalFromVisual.length; i++) {
		bidiLevels[i] = levels[logicalFromVisual[i]];
	}

	return {'logicalFromVisual': logicalFromVisual, 'bidiLevels': bidiLevels};
};	

/**
 * Performs character classification, to be used in Unicode Bidi algorithm.
 * @param {String} text string to be reordered
 * @param {Array} unicode character types (to be filled by this method)
 *
 * @return {Boolean} 'true' if text contains Bidi characters, otherwise 'false'
 **/
exports.hasBidiCharacters = function(text, textCharTypes){
	var ret = false;
	for (var i = 0; i < text.length; i++){
		textCharTypes[i] = _getCharacterType(text.charAt(i));
		if (!ret && (textCharTypes[i] == R || textCharTypes[i] == AL))
			ret = true;
	}
	return ret;
};

/**
 * Returns visual index corresponding to logical index basing on logicalFromvisual 
 * map provided by Unicode Bidi algorithm.
 * @param {int} logical index of character in text buffer
 * @param {Object} object containing logicalFromVisual map
 *
 * @return {int} visual index (on display) corresponding to logical index
 **/	
exports.getVisualFromLogicalIdx = function(logIdx, rowMap) {
	for (var i = 0; i < rowMap.logicalFromVisual.length; i++) {
		if (rowMap.logicalFromVisual[i] == logIdx)
			return i;
	}
	return 0;
};

});
