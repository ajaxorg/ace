
function require(module, callback) {

    if (Array.isArray(module)) {
        var params = [];
        module.forEach(function(m) {
            params.push(require.modules[m]);
        }, this);

        if (callback) {
            callback.apply(null, params);
        }
    }

    if (typeof module === 'string') {
        var payload = require.modules[module];
        if (payload == null) {
            console.error('Missing module: ' + module);
        }

        if (typeof payload === 'function') {
            var exports = {};
            var module = {
                 id: '',
                 uri: ''
            };
            payload(require, exports, module);
            payload = exports;
        }

        if (callback) {
            callback();
        }

        return payload;
    }
}
require.modules = {};

function define(module, payload) {
    if (typeof module !== 'string') {
        console.error('dropping module because define wasn\'t munged.');
        console.trace();
        return;
    }

    console.log('defining module: ' + module + ' as a ' + typeof payload);
    require.modules[module] = payload;
}
