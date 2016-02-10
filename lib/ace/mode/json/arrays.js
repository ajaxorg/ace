/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(function (require, exports) {
    'use strict';
    /**
     * Returns the last element of an array.
     * @param array The array.
     * @param n Which element from the end (default ist zero).
     */
    function tail(array, n) {
        if (n === void 0) { n = 0; }
        return array[array.length - (1 + n)];
    }
    exports.tail = tail;
    /**
     * Iterates the provided array and allows to remove
     * elements while iterating.
     */
    function forEach(array, callback) {
        for (var i = 0, len = array.length; i < len; i++) {
            callback(array[i], function () {
                array.splice(i, 1);
                i--;
                len--;
            });
        }
    }
    exports.forEach = forEach;
    function equals(one, other, itemEquals) {
        if (one.length !== other.length) {
            return false;
        }
        for (var i = 0, len = one.length; i < len; i++) {
            if (!itemEquals(one[i], other[i])) {
                return false;
            }
        }
        return true;
    }
    exports.equals = equals;
    function binarySearch(array, key, comparator) {
        var low = 0, high = array.length - 1;
        while (low <= high) {
            var mid = ((low + high) / 2) | 0;
            var comp = comparator(array[mid], key);
            if (comp < 0) {
                low = mid + 1;
            }
            else if (comp > 0) {
                high = mid - 1;
            }
            else {
                return mid;
            }
        }
        return -(low + 1);
    }
    exports.binarySearch = binarySearch;
    /**
     * Takes a sorted array and a function p. The array is sorted in such a way that all elements where p(x) is false
     * are located before all elements where p(x) is true.
     * @returns the least x for which p(x) is true or array.length if no element fullfills the given function.
     */
    function findFirst(array, p) {
        var low = 0, high = array.length;
        if (high === 0) {
            return 0; // no children
        }
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (p(array[mid])) {
                high = mid;
            }
            else {
                low = mid + 1;
            }
        }
        return low;
    }
    exports.findFirst = findFirst;
    function merge(arrays, hashFn) {
        var result = new Array();
        if (!hashFn) {
            for (var i = 0, len = arrays.length; i < len; i++) {
                result.push.apply(result, arrays[i]);
            }
        }
        else {
            var map = {};
            for (var i = 0; i < arrays.length; i++) {
                for (var j = 0; j < arrays[i].length; j++) {
                    var element = arrays[i][j], hash = hashFn(element);
                    if (!map.hasOwnProperty(hash)) {
                        map[hash] = true;
                        result.push(element);
                    }
                }
            }
        }
        return result;
    }
    exports.merge = merge;
    /**
     * @returns a new array with all undefined or null values removed. The original array is not modified at all.
     */
    function coalesce(array) {
        if (!array) {
            return array;
        }
        return array.filter(function (e) { return !!e; });
    }
    exports.coalesce = coalesce;
    /**
     * @returns true if the given item is contained in the array.
     */
    function contains(array, item) {
        return array.indexOf(item) >= 0;
    }
    exports.contains = contains;
    /**
     * Swaps the elements in the array for the provided positions.
     */
    function swap(array, pos1, pos2) {
        var element1 = array[pos1];
        var element2 = array[pos2];
        array[pos1] = element2;
        array[pos2] = element1;
    }
    exports.swap = swap;
    /**
     * Moves the element in the array for the provided positions.
     */
    function move(array, from, to) {
        array.splice(to, 0, array.splice(from, 1)[0]);
    }
    exports.move = move;
    /**
     * @returns {{false}} if the provided object is an array
     * 	and not empty.
     */
    function isFalsyOrEmpty(obj) {
        return !Array.isArray(obj) || obj.length === 0;
    }
    exports.isFalsyOrEmpty = isFalsyOrEmpty;
    /**
     * Removes duplicates from the given array. The optional keyFn allows to specify
     * how elements are checked for equalness by returning a unique string for each.
     */
    function distinct(array, keyFn) {
        if (!keyFn) {
            return array.filter(function (element, position) {
                return array.indexOf(element) === position;
            });
        }
        var seen = {};
        return array.filter(function (elem) {
            var key = keyFn(elem);
            if (seen[key]) {
                return false;
            }
            seen[key] = true;
            return true;
        });
    }
    exports.distinct = distinct;
    function first(array, fn, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = null; }
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (fn(element)) {
                return element;
            }
        }
        return notFoundValue;
    }
    exports.first = first;
    function commonPrefixLength(one, other, equals) {
        if (equals === void 0) { equals = function (a, b) { return a === b; }; }
        var result = 0;
        for (var i = 0, len = Math.min(one.length, other.length); i < len && equals(one[i], other[i]); i++) {
            result++;
        }
        return result;
    }
    exports.commonPrefixLength = commonPrefixLength;
    function flatten(arr) {
        return arr.reduce(function (r, v) { return r.concat(v); }, []);
    }
    exports.flatten = flatten;
});
