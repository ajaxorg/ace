"use strict";
/**
 * @typedef {Behaviour & {[key: string]: any}} IBehaviour
 */

/**@type {any}*/
var Behaviour;
Behaviour = function() {
   this.$behaviours = {};
};

(function () {

    /**
     * @this {Behaviour & this}
     */
    this.add = function (name, action, callback) {
        switch (undefined) {
          case this.$behaviours:
              this.$behaviours = {};
          case this.$behaviours[name]:
              this.$behaviours[name] = {};
        }
        this.$behaviours[name][action] = callback;
    };

    /**
     * @this {Behaviour & this}
     */
    this.addBehaviours = function (behaviours) {
        for (var key in behaviours) {
            for (var action in behaviours[key]) {
                this.add(key, action, behaviours[key][action]);
            }
        }
    };

    /**
     * @this {Behaviour & this}
     */
    this.remove = function (name) {
        if (this.$behaviours && this.$behaviours[name]) {
            delete this.$behaviours[name];
        }
    };

    /**
     * @this {Behaviour & this}
     */
    this.inherit = function (mode, filter) {
        if (typeof mode === "function") {
            var behaviours = new mode().getBehaviours(filter);
        } else {
            var behaviours = mode.getBehaviours(filter);
        }
        this.addBehaviours(behaviours);
    };

    /**
     * 
     * @param [filter]
     * @returns {{}|*}
     * @this {Behaviour & this}
     */
    this.getBehaviours = function (filter) {
        if (!filter) {
            return this.$behaviours;
        } else {
            var ret = {};
            for (var i = 0; i < filter.length; i++) {
                if (this.$behaviours[filter[i]]) {
                    ret[filter[i]] = this.$behaviours[filter[i]];
                }
            }
            return ret;
        }
    };

}).call(Behaviour.prototype);

exports.Behaviour = Behaviour;
