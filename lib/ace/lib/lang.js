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

exports.last = function(a) {
    return a[a.length - 1];
};

exports.stringReverse = function(string) {
    return string.split("").reverse().join("");
};

exports.stringRepeat = function (string, count) {
    var result = '';
    while (count > 0) {
        if (count & 1)
            result += string;

        if (count >>= 1)
            string += string;
    }
    return result;
};

exports.isCombiningChar = function (c) {
	// Copy from CM. Not so correct, requires correct previous combining
	var combiningChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
	// Ref: http://unicode.org/faq/char_combmark.html
	//      http://www.fileformat.info/info/unicode/category/Mn/list.htm
	return c.charCodeAt(0) >= 0x300 && combiningChars.test(c);
};

function stringToArray(s) {
    var o = [];
    var a = s.split("|");
    for (var i=0; i<a.length; i++) {
        if (a[i].indexOf("-")>0) {
            var a2 = a[i].split("-");
            var start = parseInt('0x'+a2[0]);
            var end = parseInt('0x'+a2[1]);
            for (var i2 = start; i2 <= end; i2++)
                o[i2]="";
        } else
            o[parseInt('0x'+a[i])]="";
    }
    return o;
}

var r="5be|5c0|5c3|5c6|5d0-5ea|5f0-5f4|608|60b|60d|61b-61c|61e-64a|66d-66f|671-6d5|6e5-6e6|6ee-6ef|6fa-70d|70f-710|712-72f|74d-7a5|7b1|7c0-7ea|7f4-7f5|7fa|800-815|81a|824|828|830-83e|840-858|85e|8a0-8b4|200f|fb1d|fb1f-fb28|fb2a-fb36|fb38-fb3c|fb3e|fb40-fb41|fb43-fb44|fb46-fbc1|fbd3-fd3d|fd50-fd8f|fd92-fdc7|fdf0-fdfc|fe70-fe74|fe76-fefc|10800-10805|10808|1080a-10835|10837-10838|1083c|1083f-10855|10857-1089e|108a7-108af|108e0-108f2|108f4-108f5|108fb-1091b|10920-10939|1093f|10980-109b7|109bc-109cf|109d2-10a00|10a10-10a13|10a15-10a17|10a19-10a33|10a40-10a47|10a50-10a58|10a60-10a9f|10ac0-10ae4|10aeb-10af6|10b00-10b35|10b40-10b55|10b58-10b72|10b78-10b91|10b99-10b9c|10ba9-10baf|10c00-10c48|10c80-10cb2|10cc0-10cf2|10cfa-10cff|1e800-1e8c4|1e8c7-1e8cf|1ee00-1ee03|1ee05-1ee1f|1ee21-1ee22|1ee24|1ee27|1ee29-1ee32|1ee34-1ee37|1ee39|1ee3b|1ee42|1ee47|1ee49|1ee4b|1ee4d-1ee4f|1ee51-1ee52|1ee54|1ee57|1ee59|1ee5b|1ee5d|1ee5f|1ee61-1ee62|1ee64|1ee67-1ee6a|1ee6c-1ee72|1ee74-1ee77|1ee79-1ee7c|1ee7e|1ee80-1ee89|1ee8b-1ee9b|1eea1-1eea3|1eea5-1eea9|1eeab-1eeba|1eebb";
var n="0-40|5b-60|7b-a9|ab-b4|b6-b9|bb-bf|d7|f7|2b9-2ba|2c2-2cf|2d2-2df|2e5-2ed|2ef-36f|374-375|37e|384-385|387|3f6|483-489|58a|58d-58f|591-5bd|5bf|5c1-5c2|5c4-5c5|5c7|600-607|609-60a|60c|60e-61a|64b-66c|670|6d6-6e4|6e7-6ed|6f0-6f9|711|730-74a|7a6-7b0|7eb-7f3|7f6-7f9|816-819|81b-823|825-827|829-82d|859-85b|8e3-902|93a|93c|941-948|94d|951-957|962-963|981|9bc|9c1-9c4|9cd|9e2-9e3|9f2-9f3|9fb|a01-a02|a3c|a41-a42|a47-a48|a4b-a4d|a51|a70-a71|a75|a81-a82|abc|ac1-ac5|ac7-ac8|acd|ae2-ae3|af1|b01|b3c|b3f|b41-b44|b4d|b56|b62-b63|b82|bc0|bcd|bf3-bfa|c00|c3e-c40|c46-c48|c4a-c4d|c55-c56|c62-c63|c78-c7e|c81|cbc|ccc-ccd|ce2-ce3|d01|d41-d44|d4d|d62-d63|dca|dd2-dd4|dd6|e31|e34-e3a|e3f|e47-e4e|eb1|eb4-eb9|ebb-ebc|ec8-ecd|f18-f19|f35|f37|f39-f3d|f71-f7e|f80-f84|f86-f87|f8d-f97|f99-fbc|fc6|102d-1030|1032-1037|1039-103a|103d-103e|1058-1059|105e-1060|1071-1074|1082|1085-1086|108d|109d|135d-135f|1390-1399|1400|1680|169b-169c|1712-1714|1732-1734|1752-1753|1772-1773|17b4-17b5|17b7-17bd|17c6|17c9-17d3|17db|17dd|17f0-17f9|1800-180e|18a9|1920-1922|1927-1928|1932|1939-193b|1940|1944-1945|19de-19ff|1a17-1a18|1a1b|1a56|1a58-1a5e|1a60|1a62|1a65-1a6c|1a73-1a7c|1a7f|1ab0-1abe|1b00-1b03|1b34|1b36-1b3a|1b3c|1b42|1b6b-1b73|1b80-1b81|1ba2-1ba5|1ba8-1ba9|1bab-1bad|1be6|1be8-1be9|1bed|1bef-1bf1|1c2c-1c33|1c36-1c37|1cd0-1cd2|1cd4-1ce0|1ce2-1ce8|1ced|1cf4|1cf8-1cf9|1dc0-1df5|1dfc-1dff|1fbd|1fbf-1fc1|1fcd-1fcf|1fdd-1fdf|1fed-1fef|1ffd-1ffe|2000-200d|2010-2029|202f-2064|206a-2070|2074-207e|2080-208e|20a0-20be|20d0-20f0|2100-2101|2103-2106|2108-2109|2114|2116-2118|211e-2123|2125|2127|2129|212e|213a-213b|2140-2144|214a-214d|2150-215f|2189-218b|2190-2335|237b-2394|2396-23fa|2400-2426|2440-244a|2460-249b|24ea-26ab|26ad-27ff|2900-2b73|2b76-2b95|2b98-2bb9|2bbd-2bc8|2bca-2bd1|2bec-2bef|2ce5-2cea|2cef-2cf1|2cf9-2cff|2d7f|2de0-2e42|2e80-2e99|2e9b-2ef3|2f00-2fd5|2ff0-2ffb|3000-3004|3008-3020|302a-302d|3030|3036-3037|303d-303f|3099-309c|30a0|30fb|31c0-31e3|321d-321e|3250-325f|327c-327e|32b1-32bf|32cc-32cf|3377-337a|33de-33df|33ff|4dc0-4dff|a490-a4c6|a60d-a60f|a66f-a67f|a69e-a69f|a6f0-a6f1|a700-a721|a788|a802|a806|a80b|a825-a826|a828-a82b|a838-a839|a874-a877|a8c4|a8e0-a8f1|a926-a92d|a947-a951|a980-a982|a9b3|a9b6-a9b9|a9bc|a9e5|aa29-aa2e|aa31-aa32|aa35-aa36|aa43|aa4c|aa7c|aab0|aab2-aab4|aab7-aab8|aabe-aabf|aac1|aaec-aaed|aaf6|abe5|abe8|abed|fb1e|fb29|fd3e-fd3f|fdfd|fe00-fe19|fe20-fe52|fe54-fe66|fe68-fe6b|feff|ff01-ff20|ff3b-ff40|ff5b-ff65|ffe0-ffe6|ffe8-ffee|fff9-fffd|10101|10140-1018c|10190-1019b|101a0|101fd|102e0-102fb|10376-1037a|1091f|10a01-10a03|10a05-10a06|10a0c-10a0f|10a38-10a3a|10a3f|10ae5-10ae6|10b39-10b3f|10e60-10e7e|11001|11038-11046|11052-11065|1107f-11081|110b3-110b6|110b9-110ba|11100-11102|11127-1112b|1112d-11134|11173|11180-11181|111b6-111be|111ca-111cc|1122f-11231|11234|11236-11237|112df|112e3-112ea|11300-11301|1133c|11340|11366-1136c|11370-11374|114b3-114b8|114ba|114bf-114c0|114c2-114c3|115b2-115b5|115bc-115bd|115bf-115c0|115dc-115dd|11633-1163a|1163d|1163f-11640|116ab|116ad|116b0-116b5|116b7|1171d-1171f|11722-11725|11727-1172b|16af0-16af4|16b30-16b36|16f8f-16f92|1bc9d-1bc9e|1bca0-1bca3|1d167-1d169|1d173-1d182|1d185-1d18b|1d1aa-1d1ad|1d200-1d245|1d300-1d356|1d6db|1d715|1d74f|1d789|1d7c3|1d7ce-1d7ff|1da00-1da36|1da3b-1da6c|1da75|1da84|1da9b-1da9f|1daa1-1daaf|1e8d0-1e8d6|1eef0-1eef1|1f000-1f02b|1f030-1f093|1f0a0-1f0ae|1f0b1-1f0bf|1f0c1-1f0cf|1f0d1-1f0f5|1f100-1f10c|1f16a-1f16b|1f300-1f579|1f57b-1f5a3|1f5a5-1f6d0|1f6e0-1f6ec|1f6f0-1f6f3|1f700-1f773|1f780-1f7d4|1f800-1f80b|1f810-1f847|1f850-1f859|1f860-1f887|1f890-1f8ad|1f910-1f918|1f980-1f984|1f9c0|e0001|e0020-e007f|e0100-e01ee|e01ef";
/* Standardize in unicode.org but not yet applied in browser */
var lre=0x202a;
var rle=0x202b;
var pdf=0x202c;
var lro=0x202d;
var rlo=0x202e;
var lri=0x2066;
var rli=0x2067;
var fsi=0x2068;
var pdi=0x2069;
var lrm=0x200E;
var rlm=0x200F;
var alm=0x061C;
var ar = stringToArray(r);
var an = stringToArray(n);

function isNInR(line, offset) {
    var sep = 1;
    var len = line.length;
    var c;
    var hasLeftR = false;
    var hasRightR = false;
    while(true) {
        if (!hasLeftR && offset - sep >= 0) {
            c = line.charCodeAt(offset - sep);
            if (!(c in ar) && !(c in an))
                return false;
            if (!hasLeftR && c in ar)
                hasLeftR = true;
        }
        if (!hasRightR && offset + sep < len) {
            c = line.charCodeAt(offset + sep);
            if (!(c in ar) && !(c in an))
                return false;
            if (!hasRightR && c in ar)
                hasRightR = true;
        }
        if (hasLeftR && hasRightR)
            break;
        sep++;
        if (offset - sep < 0 && offset + sep >= len)
            break;
    }
    return hasLeftR && hasRightR;
}

exports.getRtlBoundary = function(line, offset) {
    var endRtlWeak = offset;
    var endRtlStrong = offset;
    var startRtlWeak = offset;
    var startRtlStrong = offset;
    var len = line.length;
    var isR;
    var isN;
    while (endRtlWeak > 0) {
        isR = line.charCodeAt(endRtlWeak - 1) in ar;
        isN = line.charCodeAt(endRtlWeak - 1) in an;
        if (!isR && !isN)
            break;
        endRtlWeak--;
        if (isR)
            endRtlStrong = endRtlWeak;
    }
    while (startRtlWeak < len) {
        isR = line.charCodeAt(startRtlWeak + 1) in ar;
        isN = line.charCodeAt(startRtlWeak + 1) in an;
        if (!isR && !isN)
            break;
        startRtlWeak++;
        if (isR)
            startRtlStrong = startRtlWeak;
    }
    return [endRtlStrong, startRtlStrong];
};

exports.getVisualPos = function(line, offset) {
    var len = line.length;
    if (offset >= len) {
        // End of RTL
        var isPrevR = line.charCodeAt(offset - 1) in ar;
        if (isPrevR) {
            var rtlBoundary = exports.getRtlBoundary(line, len - 1);
            return rtlBoundary[0];
        }
    }
    var isR = line.charCodeAt(offset) in ar;
    var isN = line.charCodeAt(offset) in an;
    var isL = !isR && !isN;
    var visualPos = null;

    if (isN) {
        if (isNInR(line, offset)) {
            isR = true;
        } else {
            isL = true;
        }
    }
    
    if (isL) {
        visualPos = offset;
    } else if (isR) {
        if (offset > 0) {
            var isPrevR = line.charCodeAt(offset - 1) in ar;
            var isPrevN = line.charCodeAt(offset - 1) in an;
            var isPrevL = !isPrevR && !isPrevN;
            // Change from ltr to rtl
            if (isR && (isPrevL || (isPrevN && !isNInR(line, offset - 1))))
                return offset;
        }
        var rtlBoundary = exports.getRtlBoundary(line, offset);
        visualPos = rtlBoundary[1] - offset + rtlBoundary[0] + 1;
    }
    return visualPos;
};

exports.getVisualGroups = function(line, startOffset, endOffset) {
    var groups = [];
    var isL;
    var isR;
    var isN;
    var prevL = null;
    var prevR = null;
    var endL = null;
    var endR = null;    
    for (var i = startOffset; i <= endOffset; i++) {
        isR = line.charCodeAt(i) in ar;
        isN = line.charCodeAt(i) in an;
        isL = !isR && !isN;
        if (isN) {
            if (isNInR(line, i)) {
                isR = true;
            } else {
                isL = true;
            }
        }
        if (isR) {
            if (prevL != null) {
                groups.push({type:'ltr', pos:prevL});
                prevL = null;
            }
            if (prevR == null)
                prevR = i;
            endR = i;
        } else if (isL) {
            if (prevR !=null) {
                groups.push({type:'rtl', pos:prevR});
                prevR = null;
            }
            if (prevL == null)
                prevL = i;
            endL = i;
        }
        if (i == endOffset) {
            if (prevL != null)
                groups.push({type:'ltr', pos:prevL});
            else if (prevR != null)
                groups.push({type:'rtl', pos:prevR});
        }
        
        /* Combining: if startOffset and endOffset are L, treat as one group */
        if (i == startOffset && isL) {
            isR = line.charCodeAt(endOffset) in ar;
            isN = line.charCodeAt(endOffset) in an;
            isL = !isR && !isN;
            if (isN) {
                if (!isNInR(line, endOffset))
                    isL = true;
            } else if (isR) {
                var rtlBoundary = exports.getRtlBoundary(line, endOffset);
                if (rtlBoundary[1] == endOffset)
                    isL = true;
            }
            if (isL)
                return [{type:'ltr', pos:startOffset}];
        }
    }
    return groups;
};

var trimBeginRegexp = /^\s\s*/;
var trimEndRegexp = /\s\s*$/;

exports.stringTrimLeft = function (string) {
    return string.replace(trimBeginRegexp, '');
};

exports.stringTrimRight = function (string) {
    return string.replace(trimEndRegexp, '');
};

exports.copyObject = function(obj) {
    var copy = {};
    for (var key in obj) {
        copy[key] = obj[key];
    }
    return copy;
};

exports.copyArray = function(array){
    var copy = [];
    for (var i=0, l=array.length; i<l; i++) {
        if (array[i] && typeof array[i] == "object")
            copy[i] = this.copyObject( array[i] );
        else 
            copy[i] = array[i];
    }
    return copy;
};

exports.deepCopy = function deepCopy(obj) {
    if (typeof obj !== "object" || !obj)
        return obj;
    var copy;
    if (Array.isArray(obj)) {
        copy = [];
        for (var key = 0; key < obj.length; key++) {
            copy[key] = deepCopy(obj[key]);
        }
        return copy;
    }
    var cons = obj.constructor;
    if (cons === RegExp)
        return obj;
    
    copy = cons();
    for (var key in obj) {
        copy[key] = deepCopy(obj[key]);
    }
    return copy;
};

exports.arrayToMap = function(arr) {
    var map = {};
    for (var i=0; i<arr.length; i++) {
        map[arr[i]] = 1;
    }
    return map;

};

exports.createMap = function(props) {
    var map = Object.create(null);
    for (var i in props) {
        map[i] = props[i];
    }
    return map;
};

/*
 * splice out of 'array' anything that === 'value'
 */
exports.arrayRemove = function(array, value) {
  for (var i = 0; i <= array.length; i++) {
    if (value === array[i]) {
      array.splice(i, 1);
    }
  }
};

exports.escapeRegExp = function(str) {
    return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
};

exports.escapeHTML = function(str) {
    return str.replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
};

exports.getMatchOffsets = function(string, regExp) {
    var matches = [];

    string.replace(regExp, function(str) {
        matches.push({
            offset: arguments[arguments.length-2],
            length: str.length
        });
    });

    return matches;
};

/* deprecated */
exports.deferredCall = function(fcn) {
    var timer = null;
    var callback = function() {
        timer = null;
        fcn();
    };

    var deferred = function(timeout) {
        deferred.cancel();
        timer = setTimeout(callback, timeout || 0);
        return deferred;
    };

    deferred.schedule = deferred;

    deferred.call = function() {
        this.cancel();
        fcn();
        return deferred;
    };

    deferred.cancel = function() {
        clearTimeout(timer);
        timer = null;
        return deferred;
    };
    
    deferred.isPending = function() {
        return timer;
    };

    return deferred;
};


exports.delayedCall = function(fcn, defaultTimeout) {
    var timer = null;
    var callback = function() {
        timer = null;
        fcn();
    };

    var _self = function(timeout) {
        if (timer == null)
            timer = setTimeout(callback, timeout || defaultTimeout);
    };

    _self.delay = function(timeout) {
        timer && clearTimeout(timer);
        timer = setTimeout(callback, timeout || defaultTimeout);
    };
    _self.schedule = _self;

    _self.call = function() {
        this.cancel();
        fcn();
    };

    _self.cancel = function() {
        timer && clearTimeout(timer);
        timer = null;
    };

    _self.isPending = function() {
        return timer;
    };

    return _self;
};
});
