define(function(require,exports,module){

/*!
 * tea-extend
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/**
 * ### extend (destination, source, ...)
 *
 * For each source, shallow merge its key/values to the
 * destinatino. Sources are read in order, meaning the same
 * key in a later source will overwrite the key's value earlier
 * set.
 *
 * ```js
 * var extend = require('tea-extend');
 *
 * // sample objects
 * var a = { hello: 'universe' }
 *   , b = { speak: 'loudly' };
 *
 * // change a
 * extend(a, b);
 * a.should.deep.equal({ hello: 'universe', speak: 'loudly' });
 *
 * // shallow clone to c
 * var c = extend({}, a);
 * a.language = 'en';
 *
 * a.should.deep.equal({ hello: 'universe', speak: 'loudly', language: 'en' });
 * c.should.deep.equal({ hello: 'universe', speak: 'loudly' });
 * ```
 *
 * @param {Object} destination
 * @param {Object} sources ...
 * @return {Object} destination extended
 * @api public
 */

var exports = module.exports = function () {
  var args = [].slice.call(arguments, 0)
    , i = 1
    , res = args[0];

  for (; i < args.length; i++) {
    extend(res, args[i]);
  }

  return res;
};

/*!
 * Actually extend
 */

function extend (a, b) {
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * ### extend.include (props, ...)
 *
 * Create a new object that only includes the properties
 * specified. Unlike `extend()`, the original objects
 * will not be modified.
 *
 * This method will return a function that can be
 * reused for the specified properties. Like `extend()`,
 * this function accepts an unlimited number of objects
 * as parameters to draw from. Also, the same key in later
 * specified objects will overwrite earlier specified values.
 *
 * ```js
 * var extend = require('tea-extend')
 *   , include = extend.include('one', 'two');
 *
 * var a = { one: 1, three: 3 }
 *   , b = { zero: 0, two: 2 };
 *
 * var c = include(a, b);
 *
 * c.should.deep.equal({ one: 1, two: 2 });
 * ```
 *
 * @param {String} each property to include as an argument
 * @return {Function} reusable include function
 * @api public
 */

exports.include = function () {
  var includes = [].slice.call(arguments, 0);

  function include (res, obj) {
    Object.keys(obj).forEach(function (key) {
      if (~includes.indexOf(key)) res[key] = obj[key];
    });
  }

  return function extendInclude () {
    var args = [].slice.call(arguments, 0)
      , i = 0
      , res = {};

    for (; i < args.length; i++) {
      include(res, args[i]);
    }

    return res;
  };
};

/**
 * ### extend.exclude (props, ...)
 *
 * Create a new object that include all but the properties
 * specified. Unlike `extend()`, the original objects
 * will not be modified.
 *
 * This method will return a function that can be
 * reused for the specified properties. Like `extend()`,
 * this function accepts an unlimited number of objects
 * as parameters to draw from. Also, the same key in later
 * specified objects will overwrite earlier specified values.
 *
 * ```js
 * var extend = require('tea-extend')
 *   , exclude = extend.exclude('one', 'two');
 *
 * var a = { one: 1, three: 3 }
 *   , b = { zero: 0, two: 2 };
 *
 * var c = exclude(a, b);
 *
 * c.should.deep.equal({ three: 3, zero: 0 });
 * ```
 *
 * @param {String} each property to exclude as an argument
 * @return {Function} reusable exclude function
 * @api public
 */

exports.exclude = function () {
  var excludes = [].slice.call(arguments, 0);

  function exclude (res, obj) {
    Object.keys(obj).forEach(function (key) {
      if (!~excludes.indexOf(key)) res[key] = obj[key];
    });
  }

  return function extendExclude () {
    var args = [].slice.call(arguments, 0)
      , i = 0
      , res = {};

    for (; i < args.length; i++) {
      exclude(res, args[i]);
    }

    return res;
  };
};

return module.exports;

});
