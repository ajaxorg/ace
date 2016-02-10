/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(function(require, exports) {

    function localize(info, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return message.replace(/{(\d+)}/g, function (match, number) { return typeof args[number] !== 'undefined' ? args[number] : match; });
    }
    exports.localize = localize;
});
