"use strict";

var $cancelT;
/**
 * 
 * @type {{cancel: Function, lineMode: boolean|string, pasteCancelled: ((function(): (boolean))|*)}}
 */
module.exports = { 
    lineMode: false,
    pasteCancelled: function() {
        if ($cancelT && $cancelT > Date.now() - 50)
            return true;
        return $cancelT = false;
    },
    cancel: function() {
        $cancelT = Date.now();
    }
};
