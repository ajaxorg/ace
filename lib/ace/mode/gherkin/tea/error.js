define(function(require,exports,module){

/*!
 * tea-error
 * Copyright(c) 2012 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

var extend = require('./extend');

/**
 * ### error (name)
 *
 * The primary export for this module is a factory
 * that will return a constructor for a custom error
 * of the type/name that is specified.
 *
 * ```js
 * var error = require('tea-error')
 *   , TestError = error('TestError')
 *   , err = new TestError('My error message.');
 *
 * throw err;
 * ```
 *
 * An error created/thrown from the custom constructor
 * observes all of the expected Javascript behaviors of
 * `Error`.
 *
 * ##### instanceof
 *
 * The constructed error is an instanceof an Error.
 *
 * ```js
 * var err = new Error();
 *   , myerr = new TestError()
 *
 * err.should.be.instanceof(Error);
 * myerr.should.be.instanceof(Error);
 * myerr.should.be.isntanceof(TestError);
 * ```
 *
 * ##### name
 *
 * The `name` property is defined like other "native" errors.
 *
 * ```js
 * var err = new ReferenceError()
 *   , myerr = new TestError();
 *
 * err.should.have.property('name', 'ReferenceError');
 * myerr.should.have.property('name', 'TestError');
 * ```
 *
 * ##### message
 *
 * The `message` property is defined like all error and specified
 * as the first argument during construction.
 *
 * ```js
 * var err = new Error('Javascript error occurred')
 *   , myerr = new TestError('Test error occurred');
 *
 * err.should.have.property('message', 'Javascript error occurred');
 * myerr.should.have.property('message', 'Test Error occurred');
 * ```
 *
 * ##### stack
 *
 * If the environment provides the ability to capture a stack trace,
 * it will be provided as the `stack` property. Please view your environments
 * documentation to see if this is supported.
 *
 * ```js
 * var err = new Error()
 *   , myerr = new TestError();
 *
 * if (Error.captureStackTrace) {
 *   err.should.have.property('stack');
 *   myerr.should.have.property('stack');
 * }
 * ```
 *
 * @param {String} name
 * @return {Function} custom error constructor
 * @api public
 */

module.exports = function (name) {

  /**
   * #### new CustomError (message[, properties[, startStackFunction]])
   *
   * Once the new constructor for an error has been created
   * it can be used to construct errors just as normal javascript
   * errors.
   *
   * ```js
   * var TestError = require('tea-errors')('TestError')
   *   , err = new TestError('that did not work right');
   *
   * throw err;
   * ```
   *
   * There are a number of additional arguments that can be
   * specified upon construction to provide further insight
   * into the error created.
   *
   * ##### properties
   *
   * The second argument during construction can be an object
   * of properties that will be merged onto the newly created error.
   *
   * ```js
   * var err = new TestError('expected field value', { fields: [ 'username' ] });
   *
   * err.should.have.property('fields')
   *   .an('array')
   *   .that.deep.equals([ 'username' ]);
   * ```
   *
   * Note that if the `name`, `message`, and `stack` properties are defined
   * in this custom properties object, they will be ignored as those keys
   * are reserved.
   *
   * ##### start stack function
   *
   * The start stack function is used by `Error.captureStackTrace`
   * to indicate where the environment should start the visible
   * stack trace. Modifying this value might be useful in situations
   * where the internals of the module issuing the error are irrelevant
   * to what occured. The most obvious example is providing feedback
   * for an api method.
   *
   * ```js
   * // api.js
   * var ApiError = require('tea-error')('ApiError');
   *
   * exports.use = function (fn) {
   *   if ('function' !== typeof fn) {
   *     throw new ApiError('API .use only accepts functions', null, arguments.callee);
   *   }
   *
   *   // etc.
   * };
   *
   * // user.js
   * var api = require('./api.js);
   * api.use('a string?');
   * ```
   *
   * In this scenario the first line of the error stack will reference
   * `user.js-Ln:2` as opposed to `api.js-Ln:5`. See the `stack` example
   * for a demonstration.
   *
   * @param {String} message
   * @param {Object} properties
   * @param {Callee} start stack function for captureStackTrace
   */

  function ErrorProto (message, props, ssf) {
    var exclude = extend.exclude('name', 'message', 'stack')
      , props = exclude(props || {});

    this.message = message || ('Unspecified ' + name);
    extend(this, props);

    ssf = ssf || arguments.callee;
    if (ssf && Error.captureStackTrace) {
      Error.captureStackTrace(this, ssf);
    }
  }

  /*!
   * Build the prototype
   */

  ErrorProto.prototype = Object.create(Error.prototype);
  ErrorProto.prototype.name = name;
  ErrorProto.prototype.constructor = ErrorProto;

  /**
   * ### .toJSON ()
   *
   * Convert this error into a serialized JSON object.
   *
   * ```js
   * var err = new TestError('some message', { hello: 'universe' })
   *   , json = err.toJSON();
   *
   * json.should.deep.equal({
   *     name: 'TestError'
   *   , message: 'some message'
   *   , hello: 'universe'
   *   , stack: '...'
   * });
   * ```
   *
   * If this method is called as `err.toJSON(false)` the
   * `stack` property will not be included.
   *
   * @param {Boolean} include stack
   * @return {Object} JSON
   * @alias serialize
   * @api public
   */

  ErrorProto.prototype.toJSON =
  ErrorProto.prototype.serialize = function (stack) {
    var exclude = extend.exclude('constructor', 'serialize', 'toJSON', 'stack')
      , props = exclude({ name: this.name }, this);

    if (false !== stack && this.stack) {
      props.stack = this.stack;
    }

    return props;
  };

  // return constructor
  return ErrorProto;
};

return module.exports;

});
