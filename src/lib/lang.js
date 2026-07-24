"use strict";

exports.last = function(a) {
    return a[a.length - 1];
};


/** @param {string} string */
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

var trimBeginRegexp = /^\s\s*/;
var trimEndRegexp = /\s\s*$/;

exports.stringTrimLeft = function (string) {
    return string.replace(trimBeginRegexp, '');
};

exports.stringTrimRight = function (string) {
    return string.replace(trimEndRegexp, '');
};
/**
 * @template T
 * @param {T} obj
 * @return {T}
 */
exports.copyObject = function(obj) {
    /** @type Object*/
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
            copy[i] = this.copyObject(array[i]);
        else
            copy[i] = array[i];
    }
    return copy;
};

exports.deepCopy = require("./deep_copy").deepCopy;

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
    return ("" + str).replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
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

/**
 * @param {number} [defaultTimeout]
 */
exports.delayedCall = function(fcn, defaultTimeout) {
    var timer = null;
    var callback = function() {
        timer = null;
        fcn();
    };
    /**
     * @param {number} [timeout]
     */
    var _self = function(timeout) {
        if (timer == null)
            timer = setTimeout(callback, timeout || defaultTimeout);
    };
    /**
     * @param {number} [timeout]
     */
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

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
exports.sleep = function(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
};

exports.supportsLookbehind = function () {
    try {
        new RegExp('(?<=.)');
    } catch (e) {
        return false;
    }
    return true;
};

exports.skipEmptyMatch = function(line, last, supportsUnicodeFlag) {
    return supportsUnicodeFlag && line.codePointAt(last) > 0xffff ? 2 : 1;
};

/*global Intl*/
var clusterRe;
try {
    // marks, ZWJ, variation selectors, astral code points, conjoining jamo,
    // prepend characters (arabic number signs, malayalam dot reph) and the
    // spacing marks segmenters attach to a base (thai/lao AM);
    // with the u flag paired surrogates match as code points, so astral
    // chars need the explicit \u{10000}-\u{10FFFF} range
    clusterRe = new RegExp("[\\p{M}\\u200C\\u200D\\uFE00-\\uFE0F\\u{10000}-\\u{10FFFF}\\u1100-\\u11FF\\uA960-\\uA97F\\uD7B0-\\uD7FF"
        + "\\u0600-\\u0605\\u06DD\\u070F\\u0890\\u0891\\u08E2\\u0D4E\\u0E33\\u0EB3\\uFF9E\\uFF9F]", "u");
} catch (e) {
    clusterRe = /[\u0300-\uFFFF]/;
}

/**
 * Quick test whether `text` may contain grapheme clusters spanning more than
 * one code unit. False guarantees every code unit is its own cluster.
 * @param {string} text
 * @returns {boolean}
 */
exports.mayContainGraphemeClusters = function(text) {
    return clusterRe.test(text);
};

var graphemeSegmenter;
function getSegmenter() {
    if (graphemeSegmenter === undefined) {
        graphemeSegmenter = typeof Intl == "object" && Intl["Segmenter"]
            ? new Intl["Segmenter"](undefined, {granularity: "grapheme"}) : null;
    }
    return graphemeSegmenter;
}

/**
 * Returns the [start, end) code unit offsets of the grapheme cluster containing
 * `column`, or null if `Intl.Segmenter` is unavailable or `column` is outside the text.
 * @param {string} text
 * @param {number} column
 * @returns {{start: number, end: number} | null}
 */
exports.getGraphemeCluster = function(text, column) {
    var segmenter = getSegmenter();
    if (!segmenter) return null;
    var segment = segmenter.segment(text).containing(column);
    if (!segment) return null;
    return {start: segment.index, end: segment.index + segment.segment.length};
};

/**
 * Calls `callback(start, end)` for each grapheme cluster of `text` in order,
 * where [start, end) are code unit offsets. Iteration stops early if the
 * callback returns `false`. Lazy: segmentation cost is proportional to how
 * far the iteration gets, not to text length. Falls back to surrogate pair
 * boundaries when `Intl.Segmenter` is unavailable.
 * @param {string} text
 * @param {(start: number, end: number) => boolean|void} callback
 */
exports.forEachGrapheme = function(text, callback) {
    var segmenter = getSegmenter();
    if (segmenter) {
        var iterator = segmenter.segment(text)[Symbol.iterator]();
        var step;
        while (!(step = iterator.next()).done) {
            if (callback(step.value.index, step.value.index + step.value.segment.length) === false)
                return;
        }
    } else {
        for (var i = 0; i < text.length; i++) {
            var start = i;
            if (/[\uD800-\uDBFF]/.test(text.charAt(i)) && /[\uDC00-\uDFFF]/.test(text.charAt(i + 1)))
                i++;
            if (callback(start, i + 1) === false)
                return;
        }
    }
};

/**
 * Returns the number of grapheme clusters in `text` without materializing
 * a boundaries array.
 * @param {string} text
 * @returns {number}
 */
exports.countGraphemes = function(text) {
    var segmenter = getSegmenter();
    var count = 0;
    if (segmenter) {
        var iterator = segmenter.segment(text)[Symbol.iterator]();
        while (!iterator.next().done)
            count++;
    } else {
        for (var i = 0; i < text.length; i++) {
            if (/[\uD800-\uDBFF]/.test(text.charAt(i)) && /[\uDC00-\uDFFF]/.test(text.charAt(i + 1)))
                i++;
            count++;
        }
    }
    return count;
};

// memo of the most recent segmentations: cursor rendering and doc<->screen
// mapping repeatedly segment content-equal line prefixes
var boundariesCache = new Map();
var BOUNDARIES_CACHE_SIZE = 8;

/**
 * Returns the grapheme cluster boundaries of `text` as code unit offsets,
 * including 0 and text.length. Falls back to surrogate pair boundaries
 * when `Intl.Segmenter` is unavailable.
 * Callers must not mutate the returned array; it may be cached.
 * @param {string} text
 * @returns {number[]}
 */
exports.getGraphemeBoundaries = function(text) {
    var cached = boundariesCache.get(text);
    if (cached) return cached;
    var boundaries = [0];
    var segmenter = getSegmenter();
    if (segmenter) {
        var iterator = segmenter.segment(text)[Symbol.iterator]();
        var step;
        while (!(step = iterator.next()).done)
            boundaries.push(step.value.index + step.value.segment.length);
    } else {
        for (var i = 0; i < text.length; i++) {
            if (/[\uD800-\uDBFF]/.test(text.charAt(i)) && /[\uDC00-\uDFFF]/.test(text.charAt(i + 1)))
                i++;
            boundaries.push(i + 1);
        }
    }
    if (boundariesCache.size >= BOUNDARIES_CACHE_SIZE)
        boundariesCache.delete(boundariesCache.keys().next().value);
    boundariesCache.set(text, boundaries);
    return boundaries;
};
