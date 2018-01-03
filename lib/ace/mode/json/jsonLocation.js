/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(function (require, exports) {
'use strict';
var JSONLocation = (function () {
    function JSONLocation(segments) {
        this.segments = segments;
    }
    JSONLocation.prototype.append = function (segment) {
        return new JSONLocation(this.segments.concat(segment));
    };
    JSONLocation.prototype.getSegments = function () {
        return this.segments;
    };
    JSONLocation.prototype.matches = function (segments) {
        var k = 0;
        for (var i = 0; k < segments.length && i < this.segments.length; i++) {
            if (segments[k] === this.segments[i] || segments[k] === '*') {
                k++;
            }
            else if (segments[k] !== '**') {
                return false;
            }
        }
        return k === segments.length;
    };
    JSONLocation.prototype.toString = function () {
        return '[' + this.segments.join('][') + ']';
    };
    return JSONLocation;
})();
exports.JSONLocation = JSONLocation;
});
