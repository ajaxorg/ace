"use strict";

var $cancelT;
module.exports = { 
    /** @type {string|false} */
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
