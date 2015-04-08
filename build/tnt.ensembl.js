(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = tnt_ensembl = require("./index.js");

},{"./index.js":2}],2:[function(require,module,exports){
module.exports = tnt_ensembl = require("./src/rest.js");

},{"./src/rest.js":20}],3:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.0.1
 */

(function() {
    "use strict";

    function $$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function $$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function $$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var $$utils$$_isArray;

    if (!Array.isArray) {
      $$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      $$utils$$_isArray = Array.isArray;
    }

    var $$utils$$isArray = $$utils$$_isArray;
    var $$utils$$now = Date.now || function() { return new Date().getTime(); };
    function $$utils$$F() { }

    var $$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      $$utils$$F.prototype = o;
      return new $$utils$$F();
    });

    var $$asap$$len = 0;

    var $$asap$$default = function asap(callback, arg) {
      $$asap$$queue[$$asap$$len] = callback;
      $$asap$$queue[$$asap$$len + 1] = arg;
      $$asap$$len += 2;
      if ($$asap$$len === 2) {
        // If len is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        $$asap$$scheduleFlush();
      }
    };

    var $$asap$$browserGlobal = (typeof window !== 'undefined') ? window : {};
    var $$asap$$BrowserMutationObserver = $$asap$$browserGlobal.MutationObserver || $$asap$$browserGlobal.WebKitMutationObserver;

    // test for web worker but not in IE10
    var $$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function $$asap$$useNextTick() {
      return function() {
        process.nextTick($$asap$$flush);
      };
    }

    function $$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new $$asap$$BrowserMutationObserver($$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function $$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = $$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function $$asap$$useSetTimeout() {
      return function() {
        setTimeout($$asap$$flush, 1);
      };
    }

    var $$asap$$queue = new Array(1000);

    function $$asap$$flush() {
      for (var i = 0; i < $$asap$$len; i+=2) {
        var callback = $$asap$$queue[i];
        var arg = $$asap$$queue[i+1];

        callback(arg);

        $$asap$$queue[i] = undefined;
        $$asap$$queue[i+1] = undefined;
      }

      $$asap$$len = 0;
    }

    var $$asap$$scheduleFlush;

    // Decide what async method to use to triggering processing of queued callbacks:
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      $$asap$$scheduleFlush = $$asap$$useNextTick();
    } else if ($$asap$$BrowserMutationObserver) {
      $$asap$$scheduleFlush = $$asap$$useMutationObserver();
    } else if ($$asap$$isWorker) {
      $$asap$$scheduleFlush = $$asap$$useMessageChannel();
    } else {
      $$asap$$scheduleFlush = $$asap$$useSetTimeout();
    }

    function $$$internal$$noop() {}
    var $$$internal$$PENDING   = void 0;
    var $$$internal$$FULFILLED = 1;
    var $$$internal$$REJECTED  = 2;
    var $$$internal$$GET_THEN_ERROR = new $$$internal$$ErrorObject();

    function $$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function $$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.')
    }

    function $$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        $$$internal$$GET_THEN_ERROR.error = error;
        return $$$internal$$GET_THEN_ERROR;
      }
    }

    function $$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function $$$internal$$handleForeignThenable(promise, thenable, then) {
       $$asap$$default(function(promise) {
        var sealed = false;
        var error = $$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            $$$internal$$resolve(promise, value);
          } else {
            $$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          $$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          $$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function $$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, thenable._result);
      } else if (promise._state === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, thenable._result);
      } else {
        $$$internal$$subscribe(thenable, undefined, function(value) {
          $$$internal$$resolve(promise, value);
        }, function(reason) {
          $$$internal$$reject(promise, reason);
        });
      }
    }

    function $$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        $$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = $$$internal$$getThen(maybeThenable);

        if (then === $$$internal$$GET_THEN_ERROR) {
          $$$internal$$reject(promise, $$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          $$$internal$$fulfill(promise, maybeThenable);
        } else if ($$utils$$isFunction(then)) {
          $$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          $$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function $$$internal$$resolve(promise, value) {
      if (promise === value) {
        $$$internal$$reject(promise, $$$internal$$selfFullfillment());
      } else if ($$utils$$objectOrFunction(value)) {
        $$$internal$$handleMaybeThenable(promise, value);
      } else {
        $$$internal$$fulfill(promise, value);
      }
    }

    function $$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      $$$internal$$publish(promise);
    }

    function $$$internal$$fulfill(promise, value) {
      if (promise._state !== $$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = $$$internal$$FULFILLED;

      if (promise._subscribers.length === 0) {
      } else {
        $$asap$$default($$$internal$$publish, promise);
      }
    }

    function $$$internal$$reject(promise, reason) {
      if (promise._state !== $$$internal$$PENDING) { return; }
      promise._state = $$$internal$$REJECTED;
      promise._result = reason;

      $$asap$$default($$$internal$$publishRejection, promise);
    }

    function $$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + $$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + $$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        $$asap$$default($$$internal$$publish, parent);
      }
    }

    function $$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          $$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function $$$internal$$ErrorObject() {
      this.error = null;
    }

    var $$$internal$$TRY_CATCH_ERROR = new $$$internal$$ErrorObject();

    function $$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        $$$internal$$TRY_CATCH_ERROR.error = e;
        return $$$internal$$TRY_CATCH_ERROR;
      }
    }

    function $$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = $$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = $$$internal$$tryCatch(callback, detail);

        if (value === $$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          $$$internal$$reject(promise, $$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== $$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        $$$internal$$resolve(promise, value);
      } else if (failed) {
        $$$internal$$reject(promise, error);
      } else if (settled === $$$internal$$FULFILLED) {
        $$$internal$$fulfill(promise, value);
      } else if (settled === $$$internal$$REJECTED) {
        $$$internal$$reject(promise, value);
      }
    }

    function $$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          $$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          $$$internal$$reject(promise, reason);
        });
      } catch(e) {
        $$$internal$$reject(promise, e);
      }
    }

    function $$$enumerator$$makeSettledResult(state, position, value) {
      if (state === $$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
        return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function $$$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor($$$internal$$noop, label);
      this._abortOnReject = abortOnReject;

      if (this._validateInput(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._init();

        if (this.length === 0) {
          $$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            $$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        $$$internal$$reject(this.promise, this._validationError());
      }
    }

    $$$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return $$utils$$isArray(input);
    };

    $$$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    $$$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var $$$enumerator$$default = $$$enumerator$$Enumerator;

    $$$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var promise = this.promise;
      var input   = this._input;

      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    $$$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      if ($$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== $$$internal$$PENDING) {
          entry._onerror = null;
          this._settledAt(entry._state, i, entry._result);
        } else {
          this._willSettleAt(c.resolve(entry), i);
        }
      } else {
        this._remaining--;
        this._result[i] = this._makeResult($$$internal$$FULFILLED, i, entry);
      }
    };

    $$$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === $$$internal$$PENDING) {
        this._remaining--;

        if (this._abortOnReject && state === $$$internal$$REJECTED) {
          $$$internal$$reject(promise, value);
        } else {
          this._result[i] = this._makeResult(state, i, value);
        }
      }

      if (this._remaining === 0) {
        $$$internal$$fulfill(promise, this._result);
      }
    };

    $$$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    $$$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      $$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt($$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt($$$internal$$REJECTED, i, reason);
      });
    };

    var $$promise$all$$default = function all(entries, label) {
      return new $$$enumerator$$default(this, entries, true /* abort on reject */, label).promise;
    };

    var $$promise$race$$default = function race(entries, label) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor($$$internal$$noop, label);

      if (!$$utils$$isArray(entries)) {
        $$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        $$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        $$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === $$$internal$$PENDING && i < length; i++) {
        $$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    };

    var $$promise$resolve$$default = function resolve(object, label) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$resolve(promise, object);
      return promise;
    };

    var $$promise$reject$$default = function reject(reason, label) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor($$$internal$$noop, label);
      $$$internal$$reject(promise, reason);
      return promise;
    };

    var $$es6$promise$promise$$counter = 0;

    function $$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function $$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var $$es6$promise$promise$$default = $$es6$promise$promise$$Promise;

    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise’s eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function $$es6$promise$promise$$Promise(resolver) {
      this._id = $$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if ($$$internal$$noop !== resolver) {
        if (!$$utils$$isFunction(resolver)) {
          $$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof $$es6$promise$promise$$Promise)) {
          $$es6$promise$promise$$needsNew();
        }

        $$$internal$$initializePromise(this, resolver);
      }
    }

    $$es6$promise$promise$$Promise.all = $$promise$all$$default;
    $$es6$promise$promise$$Promise.race = $$promise$race$$default;
    $$es6$promise$promise$$Promise.resolve = $$promise$resolve$$default;
    $$es6$promise$promise$$Promise.reject = $$promise$reject$$default;

    $$es6$promise$promise$$Promise.prototype = {
      constructor: $$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === $$$internal$$FULFILLED && !onFulfillment || state === $$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor($$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          $$asap$$default(function(){
            $$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          $$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };

    var $$es6$promise$polyfill$$default = function polyfill() {
      var local;

      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof window !== 'undefined' && window.document) {
        local = window;
      } else {
        local = self;
      }

      var es6PromiseSupport =
        "Promise" in local &&
        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        "resolve" in local.Promise &&
        "reject" in local.Promise &&
        "all" in local.Promise &&
        "race" in local.Promise &&
        // Older version of the spec had a resolver object
        // as the arg rather than a function
        (function() {
          var resolve;
          new local.Promise(function(r) { resolve = r; });
          return $$utils$$isFunction(resolve);
        }());

      if (!es6PromiseSupport) {
        local.Promise = $$es6$promise$promise$$default;
      }
    };

    var es6$promise$umd$$ES6Promise = {
      'Promise': $$es6$promise$promise$$default,
      'polyfill': $$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = es6$promise$umd$$ES6Promise;
    }
}).call(this);
}).call(this,require("IrXUsu"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"IrXUsu":4}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],5:[function(require,module,exports){
/*globals define */
'use strict';


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return (root.httppleasepromises = factory(root));
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.httppleasepromises = factory(root);
    }
}(this, function (root) { // jshint ignore:line
    return function (Promise) {
        Promise = Promise || root && root.Promise;
        if (!Promise) {
            throw new Error('No Promise implementation found.');
        }
        return {
            processRequest: function (req) {
                var resolve, reject,
                    oldOnload = req.onload,
                    oldOnerror = req.onerror,
                    promise = new Promise(function (a, b) {
                        resolve = a;
                        reject = b;
                    });
                req.onload = function (res) {
                    var result;
                    if (oldOnload) {
                        result = oldOnload.apply(this, arguments);
                    }
                    resolve(res);
                    return result;
                };
                req.onerror = function (err) {
                    var result;
                    if (oldOnerror) {
                        result = oldOnerror.apply(this, arguments);
                    }
                    reject(err);
                    return result;
                };
                req.then = function () {
                    return promise.then.apply(promise, arguments);
                };
                req['catch'] = function () {
                    return promise['catch'].apply(promise, arguments);
                };
            }
        };
    };
}));

},{}],6:[function(require,module,exports){
'use strict';

var Response = require('./response');

function RequestError(message, props) {
    var err = new Error(message);
    err.name = 'RequestError';
    this.name = err.name;
    this.message = err.message;
    if (err.stack) {
        this.stack = err.stack;
    }

    this.toString = function () {
        return this.message;
    };

    for (var k in props) {
        if (props.hasOwnProperty(k)) {
            this[k] = props[k];
        }
    }
}

RequestError.prototype = Error.prototype;

RequestError.create = function (message, req, props) {
    var err = new RequestError(message, props);
    Response.call(err, req);
    return err;
};

module.exports = RequestError;

},{"./response":9}],7:[function(require,module,exports){
'use strict';

var i,
    cleanURL = require('../plugins/cleanurl'),
    XHR = require('./xhr'),
    delay = require('./utils/delay'),
    createError = require('./error').create,
    Response = require('./response'),
    Request = require('./request'),
    extend = require('xtend'),
    once = require('./utils/once');

function factory(defaults, plugins) {
    defaults = defaults || {};
    plugins = plugins || [];

    function http(req, cb) {
        var xhr, plugin, done, k, timeoutId;

        req = new Request(extend(defaults, req));

        for (i = 0; i < plugins.length; i++) {
            plugin = plugins[i];
            if (plugin.processRequest) {
                plugin.processRequest(req);
            }
        }

        // Give the plugins a chance to create the XHR object
        for (i = 0; i < plugins.length; i++) {
            plugin = plugins[i];
            if (plugin.createXHR) {
                xhr = plugin.createXHR(req);
                break; // First come, first serve
            }
        }
        xhr = xhr || new XHR();

        req.xhr = xhr;

        // Because XHR can be an XMLHttpRequest or an XDomainRequest, we add
        // `onreadystatechange`, `onload`, and `onerror` callbacks. We use the
        // `once` util to make sure that only one is called (and it's only called
        // one time).
        done = once(delay(function (err) {
            clearTimeout(timeoutId);
            xhr.onload = xhr.onerror = xhr.onreadystatechange = xhr.ontimeout = xhr.onprogress = null;
            var res = err && err.isHttpError ? err : new Response(req);
            for (i = 0; i < plugins.length; i++) {
                plugin = plugins[i];
                if (plugin.processResponse) {
                    plugin.processResponse(res);
                }
            }
            if (err) {
                if (req.onerror) {
                    req.onerror(err);
                }
            } else {
                if (req.onload) {
                    req.onload(res);
                }
            }
            if (cb) {
                cb(err, res);
            }
        }));

        // When the request completes, continue.
        xhr.onreadystatechange = function () {
            if (req.timedOut) return;

            if (req.aborted) {
                done(createError('Request aborted', req, {name: 'Abort'}));
            } else if (xhr.readyState === 4) {
                var type = Math.floor(xhr.status / 100);
                if (type === 2) {
                    done();
                } else if (xhr.status === 404 && !req.errorOn404) {
                    done();
                } else {
                    var kind;
                    switch (type) {
                        case 4:
                            kind = 'Client';
                            break;
                        case 5:
                            kind = 'Server';
                            break;
                        default:
                            kind = 'HTTP';
                    }
                    var msg = kind + ' Error: ' +
                              'The server returned a status of ' + xhr.status +
                              ' for the request "' +
                              req.method.toUpperCase() + ' ' + req.url + '"';
                    done(createError(msg, req));
                }
            }
        };

        // `onload` is only called on success and, in IE, will be called without
        // `xhr.status` having been set, so we don't check it.
        xhr.onload = function () { done(); };

        xhr.onerror = function () {
            done(createError('Internal XHR Error', req));
        };

        // IE sometimes fails if you don't specify every handler.
        // See http://social.msdn.microsoft.com/Forums/ie/en-US/30ef3add-767c-4436-b8a9-f1ca19b4812e/ie9-rtm-xdomainrequest-issued-requests-may-abort-if-all-event-handlers-not-specified?forum=iewebdevelopment
        xhr.ontimeout = function () { /* noop */ };
        xhr.onprogress = function () { /* noop */ };

        xhr.open(req.method, req.url);

        if (req.timeout) {
            // If we use the normal XHR timeout mechanism (`xhr.timeout` and
            // `xhr.ontimeout`), `onreadystatechange` will be triggered before
            // `ontimeout`. There's no way to recognize that it was triggered by
            // a timeout, and we'd be unable to dispatch the right error.
            timeoutId = setTimeout(function () {
                req.timedOut = true;
                done(createError('Request timeout', req, {name: 'Timeout'}));
                try {
                    xhr.abort();
                } catch (err) {}
            }, req.timeout);
        }

        for (k in req.headers) {
            if (req.headers.hasOwnProperty(k)) {
                xhr.setRequestHeader(k, req.headers[k]);
            }
        }

        xhr.send(req.body);

        return req;
    }

    var method,
        methods = ['get', 'post', 'put', 'head', 'patch', 'delete'],
        verb = function (method) {
            return function (req, cb) {
                req = new Request(req);
                req.method = method;
                return http(req, cb);
            };
        };
    for (i = 0; i < methods.length; i++) {
        method = methods[i];
        http[method] = verb(method);
    }

    http.plugins = function () {
        return plugins;
    };

    http.defaults = function (newValues) {
        if (newValues) {
            return factory(extend(defaults, newValues), plugins);
        }
        return defaults;
    };

    http.use = function () {
        var newPlugins = Array.prototype.slice.call(arguments, 0);
        return factory(defaults, plugins.concat(newPlugins));
    };

    http.bare = function () {
        return factory();
    };

    http.Request = Request;
    http.Response = Response;

    return http;
}

module.exports = factory({}, [cleanURL]);

},{"../plugins/cleanurl":14,"./error":6,"./request":8,"./response":9,"./utils/delay":10,"./utils/once":11,"./xhr":12,"xtend":13}],8:[function(require,module,exports){
'use strict';

function Request(optsOrUrl) {
    var opts = typeof optsOrUrl === 'string' ? {url: optsOrUrl} : optsOrUrl || {};
    this.method = opts.method ? opts.method.toUpperCase() : 'GET';
    this.url = opts.url;
    this.headers = opts.headers || {};
    this.body = opts.body;
    this.timeout = opts.timeout || 0;
    this.errorOn404 = opts.errorOn404 != null ? opts.errorOn404 : true;
    this.onload = opts.onload;
    this.onerror = opts.onerror;
}

Request.prototype.abort = function () {
    if (this.aborted) return;
    this.aborted = true;
    this.xhr.abort();
    return this;
};

Request.prototype.header = function (name, value) {
    var k;
    for (k in this.headers) {
        if (this.headers.hasOwnProperty(k)) {
            if (name.toLowerCase() === k.toLowerCase()) {
                if (arguments.length === 1) {
                    return this.headers[k];
                }

                delete this.headers[k];
                break;
            }
        }
    }
    if (value != null) {
        this.headers[name] = value;
        return value;
    }
};


module.exports = Request;

},{}],9:[function(require,module,exports){
'use strict';

var Request = require('./request');


function Response(req) {
    var i, lines, m,
        xhr = req.xhr;
    this.request = req;
    this.xhr = xhr;
    this.headers = {};

    // Browsers don't like you trying to read XHR properties when you abort the
    // request, so we don't.
    if (req.aborted || req.timedOut) return;

    this.status = xhr.status || 0;
    this.text = xhr.responseText;
    this.body = xhr.response || xhr.responseText;
    this.contentType = xhr.contentType || (xhr.getResponseHeader && xhr.getResponseHeader('Content-Type'));

    if (xhr.getAllResponseHeaders) {
        lines = xhr.getAllResponseHeaders().split('\n');
        for (i = 0; i < lines.length; i++) {
            if ((m = lines[i].match(/\s*([^\s]+):\s+([^\s]+)/))) {
                this.headers[m[1]] = m[2];
            }
        }
    }

    this.isHttpError = this.status >= 400;
}

Response.prototype.header = Request.prototype.header;


module.exports = Response;

},{"./request":8}],10:[function(require,module,exports){
'use strict';

// Wrap a function in a `setTimeout` call. This is used to guarantee async
// behavior, which can avoid unexpected errors.

module.exports = function (fn) {
    return function () {
        var
            args = Array.prototype.slice.call(arguments, 0),
            newFunc = function () {
                return fn.apply(null, args);
            };
        setTimeout(newFunc, 0);
    };
};

},{}],11:[function(require,module,exports){
'use strict';

// A "once" utility.
module.exports = function (fn) {
    var result, called = false;
    return function () {
        if (!called) {
            called = true;
            result = fn.apply(this, arguments);
        }
        return result;
    };
};

},{}],12:[function(require,module,exports){
module.exports = window.XMLHttpRequest;

},{}],13:[function(require,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],14:[function(require,module,exports){
'use strict';

module.exports = {
    processRequest: function (req) {
        req.url = req.url.replace(/[^%]+/g, function (s) {
            return encodeURI(s);
        });
    }
};

},{}],15:[function(require,module,exports){
'use strict';

var jsonrequest = require('./jsonrequest'),
    jsonresponse = require('./jsonresponse');

module.exports = {
    processRequest: function (req) {
        jsonrequest.processRequest.call(this, req);
        jsonresponse.processRequest.call(this, req);
    },
    processResponse: function (res) {
        jsonresponse.processResponse.call(this, res);
    }
};

},{"./jsonrequest":16,"./jsonresponse":17}],16:[function(require,module,exports){
'use strict';

module.exports = {
    processRequest: function (req) {
        var
            contentType = req.header('Content-Type'),
            hasJsonContentType = contentType &&
                                 contentType.indexOf('application/json') !== -1;

        if (contentType != null && !hasJsonContentType) {
            return;
        }

        if (req.body) {
            if (!contentType) {
                req.header('Content-Type', 'application/json');
            }

            req.body = JSON.stringify(req.body);
        }
    }
};

},{}],17:[function(require,module,exports){
'use strict';

module.exports = {
    processRequest: function (req) {
        var accept = req.header('Accept');
        if (accept == null) {
            req.header('Accept', 'application/json');
        }
    },
    processResponse: function (res) {
        // Check to see if the contentype is "something/json" or
        // "something/somethingelse+json"
        if (res.contentType && /^.*\/(?:.*\+)?json(;|$)/i.test(res.contentType)) {
            var raw = typeof res.body === 'string' ? res.body : res.text;
            if (raw) {
                res.body = JSON.parse(raw);
            }
        }
    }
};

},{}],18:[function(require,module,exports){
module.exports = require("./src/api.js");

},{"./src/api.js":19}],19:[function(require,module,exports){
var api = function (who) {

    var _methods = function () {
	var m = [];

	m.add_batch = function (obj) {
	    m.unshift(obj);
	};

	m.update = function (method, value) {
	    for (var i=0; i<m.length; i++) {
		for (var p in m[i]) {
		    if (p === method) {
			m[i][p] = value;
			return true;
		    }
		}
	    }
	    return false;
	};

	m.add = function (method, value) {
	    if (m.update (method, value) ) {
	    } else {
		var reg = {};
		reg[method] = value;
		m.add_batch (reg);
	    }
	};

	m.get = function (method) {
	    for (var i=0; i<m.length; i++) {
		for (var p in m[i]) {
		    if (p === method) {
			return m[i][p];
		    }
		}
	    }
	};

	return m;
    };

    var methods    = _methods();
    var api = function () {};

    api.check = function (method, check, msg) {
	if (method instanceof Array) {
	    for (var i=0; i<method.length; i++) {
		api.check(method[i], check, msg);
	    }
	    return;
	}

	if (typeof (method) === 'function') {
	    method.check(check, msg);
	} else {
	    who[method].check(check, msg);
	}
	return api;
    };

    api.transform = function (method, cbak) {
	if (method instanceof Array) {
	    for (var i=0; i<method.length; i++) {
		api.transform (method[i], cbak);
	    }
	    return;
	}

	if (typeof (method) === 'function') {
	    method.transform (cbak);
	} else {
	    who[method].transform(cbak);
	}
	return api;
    };

    var attach_method = function (method, opts) {
	var checks = [];
	var transforms = [];

	var getter = opts.on_getter || function () {
	    return methods.get(method);
	};

	var setter = opts.on_setter || function (x) {
	    for (var i=0; i<transforms.length; i++) {
		x = transforms[i](x);
	    }

	    for (var j=0; j<checks.length; j++) {
		if (!checks[j].check(x)) {
		    var msg = checks[j].msg || 
			("Value " + x + " doesn't seem to be valid for this method");
		    throw (msg);
		}
	    }
	    methods.add(method, x);
	};

	var new_method = function (new_val) {
	    if (!arguments.length) {
		return getter();
	    }
	    setter(new_val);
	    return who; // Return this?
	};
	new_method.check = function (cbak, msg) {
	    if (!arguments.length) {
		return checks;
	    }
	    checks.push ({check : cbak,
			  msg   : msg});
	    return this;
	};
	new_method.transform = function (cbak) {
	    if (!arguments.length) {
		return transforms;
	    }
	    transforms.push(cbak);
	    return this;
	};

	who[method] = new_method;
    };

    var getset = function (param, opts) {
	if (typeof (param) === 'object') {
	    methods.add_batch (param);
	    for (var p in param) {
		attach_method (p, opts);
	    }
	} else {
	    methods.add (param, opts.default_value);
	    attach_method (param, opts);
	}
    };

    api.getset = function (param, def) {
	getset(param, {default_value : def});

	return api;
    };

    api.get = function (param, def) {
	var on_setter = function () {
	    throw ("Method defined only as a getter (you are trying to use it as a setter");
	};

	getset(param, {default_value : def,
		       on_setter : on_setter}
	      );

	return api;
    };

    api.set = function (param, def) {
	var on_getter = function () {
	    throw ("Method defined only as a setter (you are trying to use it as a getter");
	};

	getset(param, {default_value : def,
		       on_getter : on_getter}
	      );

	return api;
    };

    api.method = function (name, cbak) {
	if (typeof (name) === 'object') {
	    for (var p in name) {
		who[p] = name[p];
	    }
	} else {
	    who[name] = cbak;
	}
	return api;
    };

    return api;
    
};

module.exports = exports = api;
},{}],20:[function(require,module,exports){
var http = require("httpplease");
var apijs = require("tnt.api");
var promises = require('httpplease-promises');
var Promise = require('es6-promise').Promise;
var json = require("httpplease/plugins/json");
http = http.use(json).use(promises(Promise));

tnt_eRest = function() {

    // Prefixes to use the REST API.
    // These are modified in the localREST setter
    var prefix = "http://rest.ensembl.org";
    var prefix_region = prefix + "/overlap/region/";
    var prefix_ensgene = prefix + "/lookup/id/";
    var prefix_xref = prefix + "/xrefs/symbol/";
    var prefix_homologues = prefix + "/homology/id/";
    var prefix_chr_info = prefix + "/info/assembly/";
    var prefix_aln_region = prefix + "/alignment/region/";
    var prefix_gene_tree = prefix + "/genetree/id/";
    var prefix_assembly = prefix + "/info/assembly/";

    // Number of connections made to the database
    var connections = 0;

    var eRest = function() {
    };

    // Limits imposed by the ensembl REST API
    eRest.limits = {
	region : 5000000
    };

    var api = apijs (eRest);


    /** <strong>localREST</strong> points the queries to a local REST service to debug.
	TODO: This method should be removed in "production"
    */
    api.method ('localREST', function() {
	prefix = "http://127.0.0.1:3000";
	prefix_region = prefix + "/overlap/region/";
	prefix_ensgene = prefix + "/lookup/id/";
	prefix_xref = prefix + "/xrefs/symbol/";
	prefix_homologues = prefix + "/homology/id/";

	return eRest;
    });

    /** <strong>call</strong> makes an asynchronous call to the ensembl REST service.
	@param {Object} object - A literal object containing the following fields:
	<ul>
	<li>url => The rest URL. This is returned by {@link eRest.url}</li>
	<li>success => A callback to be called when the REST query is successful (i.e. the response from the server is a defined value and no error has been returned)</li>
	<li>error => A callback to be called when the REST query returns an error
	</ul>
    */
    api.method ('call', function (myurl) {
	return http.get({
	    "url": myurl
	});
    });
    // api.method ('call', function (obj) {
    // 	var url = obj.url;
    // 	var on_success = obj.success;
    // 	var on_error   = obj.error;
    // 	connections++;
    // 	http.get({
    // 	    "url" : url
    // 	}, function (error, resp) {
    // 	    if (resp !== undefined && error == null && on_success !== undefined) {
    // 		on_success(JSON.parse(resp.body));
    // 	    }
    // 	    if (error !== null && on_error !== undefined) {
    // 		on_error(error);
    // 	    }
    // 	});
    // });


    eRest.url = {};
    var url_api = apijs (eRest.url);
	/** eRest.url.<strong>region</strong> returns the ensembl REST url to retrieve the genes included in the specified region
	    @param {object} obj - An object literal with the following fields:<br />
<ul>
<li>species : The species the region refers to</li>
<li>chr     : The chr (or seq_region name)</li>
<li>from    : The start position of the region in the chr</li>
<li>to      : The end position of the region (from < to always)</li>
</ul>
            @returns {string} - The url to query the Ensembl REST server. For an example of output of these urls see the {@link http://beta.rest.ensembl.org/feature/region/homo_sapiens/13:32889611-32973805.json?feature=gene|Ensembl REST API example}
	    @example
eRest.call ( url     : eRest.url.region ({ species : "homo_sapiens", chr : "13", from : 32889611, to : 32973805 }),
             success : callback,
             error   : callback
	   );
	 */
    url_api.method ('region', function(obj) {
	return prefix_region +
	    obj.species +
	    "/" +
	    obj.chr +
	    ":" + 
	    obj.from + 
	    "-" + obj.to + 
	    ".json?feature=gene";
    });

	/** eRest.url.<strong>species_gene</strong> returns the ensembl REST url to retrieve the ensembl gene associated with
	    the given name in the specified species.
	    @param {object} obj - An object literal with the following fields:<br />
<ul>
<li>species   : The species the region refers to</li>
<li>gene_name : The name of the gene</li>
</ul>
            @returns {string} - The url to query the Ensembl REST server. For an example of output of these urls see the {@link http://beta.rest.ensembl.org/xrefs/symbol/human/BRCA2.json?object_type=gene|Ensembl REST API example}
	    @example
eRest.call ( url     : eRest.url.species_gene ({ species : "human", gene_name : "BRCA2" }),
             success : callback,
             error   : callback
	   );
	 */
    url_api.method ('xref', function (obj) {
	return prefix_xref +
	    obj.species  +
	    "/" +
	    obj.name +
	    ".json?object_type=gene";
    });

	/** eRest.url.<strong>homologues</strong> returns the ensembl REST url to retrieve the homologues (orthologues + paralogues) of the given ensembl ID.
	    @param {object} obj - An object literal with the following fields:<br />
<ul>
<li>id : The Ensembl ID of the gene</li>
</ul>
            @returns {string} - The url to query the Ensembl REST server. For an example of output of these urls see the {@link http://beta.rest.ensembl.org/homology/id/ENSG00000139618.json?format=condensed;sequence=none;type=all|Ensembl REST API example}
	    @example
eRest.call ( url     : eRest.url.homologues ({ id : "ENSG00000139618" }),
             success : callback,
             error   : callback
	   );
	 */
    url_api.method ('homologues', function(obj) {
	return prefix_homologues +
	    obj.id + 
	    ".json?format=condensed;sequence=none;type=all";
    });

	/** eRest.url.<strong>gene</strong> returns the ensembl REST url to retrieve the ensembl gene associated with
	    the given ID
	    @param {object} obj - An object literal with the following fields:<br />
<ul>
<li>id : The name of the gene</li>
<li>expand : if transcripts should be included in the response (default to 0)</li>
</ul>
            @returns {string} - The url to query the Ensembl REST server. For an example of output of these urls see the {@link http://beta.rest.ensembl.org/lookup/ENSG00000139618.json?format=full|Ensembl REST API example}
	    @example
eRest.call ( url     : eRest.url.gene ({ id : "ENSG00000139618" }),
             success : callback,
             error   : callback
	   );
	 */
    url_api.method ('gene', function(obj) {
	var url = prefix_ensgene + obj.id + ".json?format=full";
	if (obj.expand && obj.expand === 1) {
	    url = url + "&expand=1";
	}
	return url;
    });

	/** eRest.url.<strong>chr_info</strong> returns the ensembl REST url to retrieve the information associated with the chromosome (seq_region in Ensembl nomenclature).
	    @param {object} obj - An object literal with the following fields:<br />
<ul>
<li>species : The species the chr (or seq_region) belongs to
<li>chr     : The name of the chr (or seq_region)</li>
</ul>
            @returns {string} - The url to query the Ensembl REST server. For an example of output of these urls see the {@link http://beta.rest.ensembl.org/assembly/info/homo_sapiens/13.json?format=full|Ensembl REST API example}
	    @example
eRest.call ( url     : eRest.url.chr_info ({ species : "homo_sapiens", chr : "13" }),
             success : callback,
             error   : callback
	   );
	 */
    url_api.method ('chr_info', function(obj) {
	return prefix_chr_info +
	    obj.species +
	    "/" +
	    obj.chr +
	    ".json?format=full";
    });

	// TODO: For now, it only works with species_set and not species_set_groups
	// Should be extended for wider use
    url_api.method ('aln_block', function (obj) {
	var url = prefix_aln_region + 
	    obj.species +
	    "/" +
	    obj.chr +
	    ":" +
	    obj.from +
	    "-" +
	    obj.to +
	    ".json?method=" +
	    obj.method;

	for (var i=0; i<obj.species_set.length; i++) {
	    url += "&species_set=" + obj.species_set[i];
	}

	return url;
    });

    url_api.method ('gene_tree', function (obj) {
	return prefix_gene_tree +
	    obj.id + 
	    ".json?sequence=" +
	    ((obj.sequence || obj.aligned) ? 1 : "none") +
	    (obj.aligned ? '&aligned=1' : '');
    });

    url_api.method('assembly', function (obj) {
	return prefix_assembly + 
	    obj.species +
	    ".json";
    });


    api.method ('connections', function() {
	return connections;
    });

    return eRest;
};

module.exports = exports = tnt_eRest;

},{"es6-promise":3,"httpplease":7,"httpplease-promises":5,"httpplease/plugins/json":15,"tnt.api":18}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90bnQuZW5zZW1ibC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdG50LmVuc2VtYmwvZmFrZV8xZTE2YmFhLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RudC5lbnNlbWJsL2luZGV4LmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RudC5lbnNlbWJsL25vZGVfbW9kdWxlcy9lczYtcHJvbWlzZS9kaXN0L2VzNi1wcm9taXNlLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RudC5lbnNlbWJsL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90bnQuZW5zZW1ibC9ub2RlX21vZHVsZXMvaHR0cHBsZWFzZS1wcm9taXNlcy9odHRwcGxlYXNlLXByb21pc2VzLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RudC5lbnNlbWJsL25vZGVfbW9kdWxlcy9odHRwcGxlYXNlL2xpYi9lcnJvci5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90bnQuZW5zZW1ibC9ub2RlX21vZHVsZXMvaHR0cHBsZWFzZS9saWIvaW5kZXguanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdG50LmVuc2VtYmwvbm9kZV9tb2R1bGVzL2h0dHBwbGVhc2UvbGliL3JlcXVlc3QuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdG50LmVuc2VtYmwvbm9kZV9tb2R1bGVzL2h0dHBwbGVhc2UvbGliL3Jlc3BvbnNlLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RudC5lbnNlbWJsL25vZGVfbW9kdWxlcy9odHRwcGxlYXNlL2xpYi91dGlscy9kZWxheS5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90bnQuZW5zZW1ibC9ub2RlX21vZHVsZXMvaHR0cHBsZWFzZS9saWIvdXRpbHMvb25jZS5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90bnQuZW5zZW1ibC9ub2RlX21vZHVsZXMvaHR0cHBsZWFzZS9saWIveGhyLWJyb3dzZXIuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdG50LmVuc2VtYmwvbm9kZV9tb2R1bGVzL2h0dHBwbGVhc2Uvbm9kZV9tb2R1bGVzL3h0ZW5kL2luZGV4LmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RudC5lbnNlbWJsL25vZGVfbW9kdWxlcy9odHRwcGxlYXNlL3BsdWdpbnMvY2xlYW51cmwuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdG50LmVuc2VtYmwvbm9kZV9tb2R1bGVzL2h0dHBwbGVhc2UvcGx1Z2lucy9qc29uLmpzIiwiL1VzZXJzL3BpZ25hdGVsbGkvc3JjL3JlcG9zL3RudC5lbnNlbWJsL25vZGVfbW9kdWxlcy9odHRwcGxlYXNlL3BsdWdpbnMvanNvbnJlcXVlc3QuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdG50LmVuc2VtYmwvbm9kZV9tb2R1bGVzL2h0dHBwbGVhc2UvcGx1Z2lucy9qc29ucmVzcG9uc2UuanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdG50LmVuc2VtYmwvbm9kZV9tb2R1bGVzL3RudC5hcGkvaW5kZXguanMiLCIvVXNlcnMvcGlnbmF0ZWxsaS9zcmMvcmVwb3MvdG50LmVuc2VtYmwvbm9kZV9tb2R1bGVzL3RudC5hcGkvc3JjL2FwaS5qcyIsIi9Vc2Vycy9waWduYXRlbGxpL3NyYy9yZXBvcy90bnQuZW5zZW1ibC9zcmMvcmVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2o4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB0bnRfZW5zZW1ibCA9IHJlcXVpcmUoXCIuL2luZGV4LmpzXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB0bnRfZW5zZW1ibCA9IHJlcXVpcmUoXCIuL3NyYy9yZXN0LmpzXCIpO1xuIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCl7XG4vKiFcbiAqIEBvdmVydmlldyBlczYtcHJvbWlzZSAtIGEgdGlueSBpbXBsZW1lbnRhdGlvbiBvZiBQcm9taXNlcy9BKy5cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE0IFllaHVkYSBLYXR6LCBUb20gRGFsZSwgU3RlZmFuIFBlbm5lciBhbmQgY29udHJpYnV0b3JzIChDb252ZXJzaW9uIHRvIEVTNiBBUEkgYnkgSmFrZSBBcmNoaWJhbGQpXG4gKiBAbGljZW5zZSAgIExpY2Vuc2VkIHVuZGVyIE1JVCBsaWNlbnNlXG4gKiAgICAgICAgICAgIFNlZSBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vamFrZWFyY2hpYmFsZC9lczYtcHJvbWlzZS9tYXN0ZXIvTElDRU5TRVxuICogQHZlcnNpb24gICAyLjAuMVxuICovXG5cbihmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGZ1bmN0aW9uICQkdXRpbHMkJG9iamVjdE9yRnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnZnVuY3Rpb24nIHx8ICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gJCR1dGlscyQkaXNGdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdmdW5jdGlvbic7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gJCR1dGlscyQkaXNNYXliZVRoZW5hYmxlKHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeCAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgJCR1dGlscyQkX2lzQXJyYXk7XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkpIHtcbiAgICAgICQkdXRpbHMkJF9pc0FycmF5ID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh4KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICQkdXRpbHMkJF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcbiAgICB9XG5cbiAgICB2YXIgJCR1dGlscyQkaXNBcnJheSA9ICQkdXRpbHMkJF9pc0FycmF5O1xuICAgIHZhciAkJHV0aWxzJCRub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHsgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpOyB9O1xuICAgIGZ1bmN0aW9uICQkdXRpbHMkJEYoKSB7IH1cblxuICAgIHZhciAkJHV0aWxzJCRvX2NyZWF0ZSA9IChPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIChvKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZWNvbmQgYXJndW1lbnQgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvICE9PSAnb2JqZWN0Jykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgICAgfVxuICAgICAgJCR1dGlscyQkRi5wcm90b3R5cGUgPSBvO1xuICAgICAgcmV0dXJuIG5ldyAkJHV0aWxzJCRGKCk7XG4gICAgfSk7XG5cbiAgICB2YXIgJCRhc2FwJCRsZW4gPSAwO1xuXG4gICAgdmFyICQkYXNhcCQkZGVmYXVsdCA9IGZ1bmN0aW9uIGFzYXAoY2FsbGJhY2ssIGFyZykge1xuICAgICAgJCRhc2FwJCRxdWV1ZVskJGFzYXAkJGxlbl0gPSBjYWxsYmFjaztcbiAgICAgICQkYXNhcCQkcXVldWVbJCRhc2FwJCRsZW4gKyAxXSA9IGFyZztcbiAgICAgICQkYXNhcCQkbGVuICs9IDI7XG4gICAgICBpZiAoJCRhc2FwJCRsZW4gPT09IDIpIHtcbiAgICAgICAgLy8gSWYgbGVuIGlzIDEsIHRoYXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHNjaGVkdWxlIGFuIGFzeW5jIGZsdXNoLlxuICAgICAgICAvLyBJZiBhZGRpdGlvbmFsIGNhbGxiYWNrcyBhcmUgcXVldWVkIGJlZm9yZSB0aGUgcXVldWUgaXMgZmx1c2hlZCwgdGhleVxuICAgICAgICAvLyB3aWxsIGJlIHByb2Nlc3NlZCBieSB0aGlzIGZsdXNoIHRoYXQgd2UgYXJlIHNjaGVkdWxpbmcuXG4gICAgICAgICQkYXNhcCQkc2NoZWR1bGVGbHVzaCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgJCRhc2FwJCRicm93c2VyR2xvYmFsID0gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSA/IHdpbmRvdyA6IHt9O1xuICAgIHZhciAkJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyID0gJCRhc2FwJCRicm93c2VyR2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgJCRhc2FwJCRicm93c2VyR2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG5cbiAgICAvLyB0ZXN0IGZvciB3ZWIgd29ya2VyIGJ1dCBub3QgaW4gSUUxMFxuICAgIHZhciAkJGFzYXAkJGlzV29ya2VyID0gdHlwZW9mIFVpbnQ4Q2xhbXBlZEFycmF5ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgdHlwZW9mIGltcG9ydFNjcmlwdHMgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09ICd1bmRlZmluZWQnO1xuXG4gICAgLy8gbm9kZVxuICAgIGZ1bmN0aW9uICQkYXNhcCQkdXNlTmV4dFRpY2soKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soJCRhc2FwJCRmbHVzaCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uICQkYXNhcCQkdXNlTXV0YXRpb25PYnNlcnZlcigpIHtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBvYnNlcnZlciA9IG5ldyAkJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKCQkYXNhcCQkZmx1c2gpO1xuICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgICBvYnNlcnZlci5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBub2RlLmRhdGEgPSAoaXRlcmF0aW9ucyA9ICsraXRlcmF0aW9ucyAlIDIpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyB3ZWIgd29ya2VyXG4gICAgZnVuY3Rpb24gJCRhc2FwJCR1c2VNZXNzYWdlQ2hhbm5lbCgpIHtcbiAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9ICQkYXNhcCQkZmx1c2g7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkJGFzYXAkJHVzZVNldFRpbWVvdXQoKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNldFRpbWVvdXQoJCRhc2FwJCRmbHVzaCwgMSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciAkJGFzYXAkJHF1ZXVlID0gbmV3IEFycmF5KDEwMDApO1xuXG4gICAgZnVuY3Rpb24gJCRhc2FwJCRmbHVzaCgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJCRhc2FwJCRsZW47IGkrPTIpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gJCRhc2FwJCRxdWV1ZVtpXTtcbiAgICAgICAgdmFyIGFyZyA9ICQkYXNhcCQkcXVldWVbaSsxXTtcblxuICAgICAgICBjYWxsYmFjayhhcmcpO1xuXG4gICAgICAgICQkYXNhcCQkcXVldWVbaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICQkYXNhcCQkcXVldWVbaSsxXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgJCRhc2FwJCRsZW4gPSAwO1xuICAgIH1cblxuICAgIHZhciAkJGFzYXAkJHNjaGVkdWxlRmx1c2g7XG5cbiAgICAvLyBEZWNpZGUgd2hhdCBhc3luYyBtZXRob2QgdG8gdXNlIHRvIHRyaWdnZXJpbmcgcHJvY2Vzc2luZyBvZiBxdWV1ZWQgY2FsbGJhY2tzOlxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYge30udG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgICAkJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSAkJGFzYXAkJHVzZU5leHRUaWNrKCk7XG4gICAgfSBlbHNlIGlmICgkJGFzYXAkJEJyb3dzZXJNdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgICAkJGFzYXAkJHNjaGVkdWxlRmx1c2ggPSAkJGFzYXAkJHVzZU11dGF0aW9uT2JzZXJ2ZXIoKTtcbiAgICB9IGVsc2UgaWYgKCQkYXNhcCQkaXNXb3JrZXIpIHtcbiAgICAgICQkYXNhcCQkc2NoZWR1bGVGbHVzaCA9ICQkYXNhcCQkdXNlTWVzc2FnZUNoYW5uZWwoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCRhc2FwJCRzY2hlZHVsZUZsdXNoID0gJCRhc2FwJCR1c2VTZXRUaW1lb3V0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gJCQkaW50ZXJuYWwkJG5vb3AoKSB7fVxuICAgIHZhciAkJCRpbnRlcm5hbCQkUEVORElORyAgID0gdm9pZCAwO1xuICAgIHZhciAkJCRpbnRlcm5hbCQkRlVMRklMTEVEID0gMTtcbiAgICB2YXIgJCQkaW50ZXJuYWwkJFJFSkVDVEVEICA9IDI7XG4gICAgdmFyICQkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUiA9IG5ldyAkJCRpbnRlcm5hbCQkRXJyb3JPYmplY3QoKTtcblxuICAgIGZ1bmN0aW9uICQkJGludGVybmFsJCRzZWxmRnVsbGZpbGxtZW50KCkge1xuICAgICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoXCJZb3UgY2Fubm90IHJlc29sdmUgYSBwcm9taXNlIHdpdGggaXRzZWxmXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uICQkJGludGVybmFsJCRjYW5ub3RSZXR1cm5Pd24oKSB7XG4gICAgICByZXR1cm4gbmV3IFR5cGVFcnJvcignQSBwcm9taXNlcyBjYWxsYmFjayBjYW5ub3QgcmV0dXJuIHRoYXQgc2FtZSBwcm9taXNlLicpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gJCQkaW50ZXJuYWwkJGdldFRoZW4ocHJvbWlzZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbjtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgJCQkaW50ZXJuYWwkJEdFVF9USEVOX0VSUk9SLmVycm9yID0gZXJyb3I7XG4gICAgICAgIHJldHVybiAkJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gJCQkaW50ZXJuYWwkJHRyeVRoZW4odGhlbiwgdmFsdWUsIGZ1bGZpbGxtZW50SGFuZGxlciwgcmVqZWN0aW9uSGFuZGxlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBmdWxmaWxsbWVudEhhbmRsZXIsIHJlamVjdGlvbkhhbmRsZXIpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uICQkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgdGhlbmFibGUsIHRoZW4pIHtcbiAgICAgICAkJGFzYXAkJGRlZmF1bHQoZnVuY3Rpb24ocHJvbWlzZSkge1xuICAgICAgICB2YXIgc2VhbGVkID0gZmFsc2U7XG4gICAgICAgIHZhciBlcnJvciA9ICQkJGludGVybmFsJCR0cnlUaGVuKHRoZW4sIHRoZW5hYmxlLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGlmIChzZWFsZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAodGhlbmFibGUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAkJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgIGlmIChzZWFsZWQpIHsgcmV0dXJuOyB9XG4gICAgICAgICAgc2VhbGVkID0gdHJ1ZTtcblxuICAgICAgICAgICQkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgICAgfSwgJ1NldHRsZTogJyArIChwcm9taXNlLl9sYWJlbCB8fCAnIHVua25vd24gcHJvbWlzZScpKTtcblxuICAgICAgICBpZiAoIXNlYWxlZCAmJiBlcnJvcikge1xuICAgICAgICAgIHNlYWxlZCA9IHRydWU7XG4gICAgICAgICAgJCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH0sIHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uICQkJGludGVybmFsJCRoYW5kbGVPd25UaGVuYWJsZShwcm9taXNlLCB0aGVuYWJsZSkge1xuICAgICAgaWYgKHRoZW5hYmxlLl9zdGF0ZSA9PT0gJCQkaW50ZXJuYWwkJEZVTEZJTExFRCkge1xuICAgICAgICAkJCRpbnRlcm5hbCQkZnVsZmlsbChwcm9taXNlLCB0aGVuYWJsZS5fcmVzdWx0KTtcbiAgICAgIH0gZWxzZSBpZiAocHJvbWlzZS5fc3RhdGUgPT09ICQkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICAkJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHRoZW5hYmxlLl9yZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCQkaW50ZXJuYWwkJHN1YnNjcmliZSh0aGVuYWJsZSwgdW5kZWZpbmVkLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICQkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICAgJCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCByZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkJCRpbnRlcm5hbCQkaGFuZGxlTWF5YmVUaGVuYWJsZShwcm9taXNlLCBtYXliZVRoZW5hYmxlKSB7XG4gICAgICBpZiAobWF5YmVUaGVuYWJsZS5jb25zdHJ1Y3RvciA9PT0gcHJvbWlzZS5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAkJCRpbnRlcm5hbCQkaGFuZGxlT3duVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdGhlbiA9ICQkJGludGVybmFsJCRnZXRUaGVuKG1heWJlVGhlbmFibGUpO1xuXG4gICAgICAgIGlmICh0aGVuID09PSAkJCRpbnRlcm5hbCQkR0VUX1RIRU5fRVJST1IpIHtcbiAgICAgICAgICAkJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsICQkJGludGVybmFsJCRHRVRfVEhFTl9FUlJPUi5lcnJvcik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgJCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJCR1dGlscyQkaXNGdW5jdGlvbih0aGVuKSkge1xuICAgICAgICAgICQkJGludGVybmFsJCRoYW5kbGVGb3JlaWduVGhlbmFibGUocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSwgdGhlbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgbWF5YmVUaGVuYWJsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkJCRpbnRlcm5hbCQkcmVzb2x2ZShwcm9taXNlLCB2YWx1ZSkge1xuICAgICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB7XG4gICAgICAgICQkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgJCQkaW50ZXJuYWwkJHNlbGZGdWxsZmlsbG1lbnQoKSk7XG4gICAgICB9IGVsc2UgaWYgKCQkdXRpbHMkJG9iamVjdE9yRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICQkJGludGVybmFsJCRoYW5kbGVNYXliZVRoZW5hYmxlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkJCRpbnRlcm5hbCQkcHVibGlzaFJlamVjdGlvbihwcm9taXNlKSB7XG4gICAgICBpZiAocHJvbWlzZS5fb25lcnJvcikge1xuICAgICAgICBwcm9taXNlLl9vbmVycm9yKHByb21pc2UuX3Jlc3VsdCk7XG4gICAgICB9XG5cbiAgICAgICQkJGludGVybmFsJCRwdWJsaXNoKHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uICQkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHZhbHVlKSB7XG4gICAgICBpZiAocHJvbWlzZS5fc3RhdGUgIT09ICQkJGludGVybmFsJCRQRU5ESU5HKSB7IHJldHVybjsgfVxuXG4gICAgICBwcm9taXNlLl9yZXN1bHQgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3N0YXRlID0gJCQkaW50ZXJuYWwkJEZVTEZJTExFRDtcblxuICAgICAgaWYgKHByb21pc2UuX3N1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCRhc2FwJCRkZWZhdWx0KCQkJGludGVybmFsJCRwdWJsaXNoLCBwcm9taXNlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbikge1xuICAgICAgaWYgKHByb21pc2UuX3N0YXRlICE9PSAkJCRpbnRlcm5hbCQkUEVORElORykgeyByZXR1cm47IH1cbiAgICAgIHByb21pc2UuX3N0YXRlID0gJCQkaW50ZXJuYWwkJFJFSkVDVEVEO1xuICAgICAgcHJvbWlzZS5fcmVzdWx0ID0gcmVhc29uO1xuXG4gICAgICAkJGFzYXAkJGRlZmF1bHQoJCQkaW50ZXJuYWwkJHB1Ymxpc2hSZWplY3Rpb24sIHByb21pc2UpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uICQkJGludGVybmFsJCRzdWJzY3JpYmUocGFyZW50LCBjaGlsZCwgb25GdWxmaWxsbWVudCwgb25SZWplY3Rpb24pIHtcbiAgICAgIHZhciBzdWJzY3JpYmVycyA9IHBhcmVudC5fc3Vic2NyaWJlcnM7XG4gICAgICB2YXIgbGVuZ3RoID0gc3Vic2NyaWJlcnMubGVuZ3RoO1xuXG4gICAgICBwYXJlbnQuX29uZXJyb3IgPSBudWxsO1xuXG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGhdID0gY2hpbGQ7XG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGggKyAkJCRpbnRlcm5hbCQkRlVMRklMTEVEXSA9IG9uRnVsZmlsbG1lbnQ7XG4gICAgICBzdWJzY3JpYmVyc1tsZW5ndGggKyAkJCRpbnRlcm5hbCQkUkVKRUNURURdICA9IG9uUmVqZWN0aW9uO1xuXG4gICAgICBpZiAobGVuZ3RoID09PSAwICYmIHBhcmVudC5fc3RhdGUpIHtcbiAgICAgICAgJCRhc2FwJCRkZWZhdWx0KCQkJGludGVybmFsJCRwdWJsaXNoLCBwYXJlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uICQkJGludGVybmFsJCRwdWJsaXNoKHByb21pc2UpIHtcbiAgICAgIHZhciBzdWJzY3JpYmVycyA9IHByb21pc2UuX3N1YnNjcmliZXJzO1xuICAgICAgdmFyIHNldHRsZWQgPSBwcm9taXNlLl9zdGF0ZTtcblxuICAgICAgaWYgKHN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm47IH1cblxuICAgICAgdmFyIGNoaWxkLCBjYWxsYmFjaywgZGV0YWlsID0gcHJvbWlzZS5fcmVzdWx0O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSArPSAzKSB7XG4gICAgICAgIGNoaWxkID0gc3Vic2NyaWJlcnNbaV07XG4gICAgICAgIGNhbGxiYWNrID0gc3Vic2NyaWJlcnNbaSArIHNldHRsZWRdO1xuXG4gICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgICQkJGludGVybmFsJCRpbnZva2VDYWxsYmFjayhzZXR0bGVkLCBjaGlsZCwgY2FsbGJhY2ssIGRldGFpbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FsbGJhY2soZGV0YWlsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBwcm9taXNlLl9zdWJzY3JpYmVycy5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uICQkJGludGVybmFsJCRFcnJvck9iamVjdCgpIHtcbiAgICAgIHRoaXMuZXJyb3IgPSBudWxsO1xuICAgIH1cblxuICAgIHZhciAkJCRpbnRlcm5hbCQkVFJZX0NBVENIX0VSUk9SID0gbmV3ICQkJGludGVybmFsJCRFcnJvck9iamVjdCgpO1xuXG4gICAgZnVuY3Rpb24gJCQkaW50ZXJuYWwkJHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhkZXRhaWwpO1xuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICQkJGludGVybmFsJCRUUllfQ0FUQ0hfRVJST1IuZXJyb3IgPSBlO1xuICAgICAgICByZXR1cm4gJCQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc2V0dGxlZCwgcHJvbWlzZSwgY2FsbGJhY2ssIGRldGFpbCkge1xuICAgICAgdmFyIGhhc0NhbGxiYWNrID0gJCR1dGlscyQkaXNGdW5jdGlvbihjYWxsYmFjayksXG4gICAgICAgICAgdmFsdWUsIGVycm9yLCBzdWNjZWVkZWQsIGZhaWxlZDtcblxuICAgICAgaWYgKGhhc0NhbGxiYWNrKSB7XG4gICAgICAgIHZhbHVlID0gJCQkaW50ZXJuYWwkJHRyeUNhdGNoKGNhbGxiYWNrLCBkZXRhaWwpO1xuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gJCQkaW50ZXJuYWwkJFRSWV9DQVRDSF9FUlJPUikge1xuICAgICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgZXJyb3IgPSB2YWx1ZS5lcnJvcjtcbiAgICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3VjY2VlZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgICAgICQkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgJCQkaW50ZXJuYWwkJGNhbm5vdFJldHVybk93bigpKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBkZXRhaWw7XG4gICAgICAgIHN1Y2NlZWRlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSAhPT0gJCQkaW50ZXJuYWwkJFBFTkRJTkcpIHtcbiAgICAgICAgLy8gbm9vcFxuICAgICAgfSBlbHNlIGlmIChoYXNDYWxsYmFjayAmJiBzdWNjZWVkZWQpIHtcbiAgICAgICAgJCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChmYWlsZWQpIHtcbiAgICAgICAgJCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlcnJvcik7XG4gICAgICB9IGVsc2UgaWYgKHNldHRsZWQgPT09ICQkJGludGVybmFsJCRGVUxGSUxMRUQpIHtcbiAgICAgICAgJCQkaW50ZXJuYWwkJGZ1bGZpbGwocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChzZXR0bGVkID09PSAkJCRpbnRlcm5hbCQkUkVKRUNURUQpIHtcbiAgICAgICAgJCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gJCQkaW50ZXJuYWwkJGluaXRpYWxpemVQcm9taXNlKHByb21pc2UsIHJlc29sdmVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlcihmdW5jdGlvbiByZXNvbHZlUHJvbWlzZSh2YWx1ZSl7XG4gICAgICAgICAgJCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICB9LCBmdW5jdGlvbiByZWplY3RQcm9taXNlKHJlYXNvbikge1xuICAgICAgICAgICQkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgJCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkJCRlbnVtZXJhdG9yJCRtYWtlU2V0dGxlZFJlc3VsdChzdGF0ZSwgcG9zaXRpb24sIHZhbHVlKSB7XG4gICAgICBpZiAoc3RhdGUgPT09ICQkJGludGVybmFsJCRGVUxGSUxMRUQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0ZTogJ2Z1bGZpbGxlZCcsXG4gICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXRlOiAncmVqZWN0ZWQnLFxuICAgICAgICAgIHJlYXNvbjogdmFsdWVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiAkJCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yKENvbnN0cnVjdG9yLCBpbnB1dCwgYWJvcnRPblJlamVjdCwgbGFiZWwpIHtcbiAgICAgIHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgICAgIHRoaXMucHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcigkJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuICAgICAgdGhpcy5fYWJvcnRPblJlamVjdCA9IGFib3J0T25SZWplY3Q7XG5cbiAgICAgIGlmICh0aGlzLl92YWxpZGF0ZUlucHV0KGlucHV0KSkge1xuICAgICAgICB0aGlzLl9pbnB1dCAgICAgPSBpbnB1dDtcbiAgICAgICAgdGhpcy5sZW5ndGggICAgID0gaW5wdXQubGVuZ3RoO1xuICAgICAgICB0aGlzLl9yZW1haW5pbmcgPSBpbnB1dC5sZW5ndGg7XG5cbiAgICAgICAgdGhpcy5faW5pdCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICQkJGludGVybmFsJCRmdWxmaWxsKHRoaXMucHJvbWlzZSwgdGhpcy5fcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMubGVuZ3RoIHx8IDA7XG4gICAgICAgICAgdGhpcy5fZW51bWVyYXRlKCk7XG4gICAgICAgICAgaWYgKHRoaXMuX3JlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgICAgJCQkaW50ZXJuYWwkJGZ1bGZpbGwodGhpcy5wcm9taXNlLCB0aGlzLl9yZXN1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCQkaW50ZXJuYWwkJHJlamVjdCh0aGlzLnByb21pc2UsIHRoaXMuX3ZhbGlkYXRpb25FcnJvcigpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkJCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5fdmFsaWRhdGVJbnB1dCA9IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICByZXR1cm4gJCR1dGlscyQkaXNBcnJheShpbnB1dCk7XG4gICAgfTtcblxuICAgICQkJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl92YWxpZGF0aW9uRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0FycmF5IE1ldGhvZHMgbXVzdCBiZSBwcm92aWRlZCBhbiBBcnJheScpO1xuICAgIH07XG5cbiAgICAkJCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fcmVzdWx0ID0gbmV3IEFycmF5KHRoaXMubGVuZ3RoKTtcbiAgICB9O1xuXG4gICAgdmFyICQkJGVudW1lcmF0b3IkJGRlZmF1bHQgPSAkJCRlbnVtZXJhdG9yJCRFbnVtZXJhdG9yO1xuXG4gICAgJCQkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2VudW1lcmF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGxlbmd0aCAgPSB0aGlzLmxlbmd0aDtcbiAgICAgIHZhciBwcm9taXNlID0gdGhpcy5wcm9taXNlO1xuICAgICAgdmFyIGlucHV0ICAgPSB0aGlzLl9pbnB1dDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IHByb21pc2UuX3N0YXRlID09PSAkJCRpbnRlcm5hbCQkUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5fZWFjaEVudHJ5KGlucHV0W2ldLCBpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJCQkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX2VhY2hFbnRyeSA9IGZ1bmN0aW9uKGVudHJ5LCBpKSB7XG4gICAgICB2YXIgYyA9IHRoaXMuX2luc3RhbmNlQ29uc3RydWN0b3I7XG4gICAgICBpZiAoJCR1dGlscyQkaXNNYXliZVRoZW5hYmxlKGVudHJ5KSkge1xuICAgICAgICBpZiAoZW50cnkuY29uc3RydWN0b3IgPT09IGMgJiYgZW50cnkuX3N0YXRlICE9PSAkJCRpbnRlcm5hbCQkUEVORElORykge1xuICAgICAgICAgIGVudHJ5Ll9vbmVycm9yID0gbnVsbDtcbiAgICAgICAgICB0aGlzLl9zZXR0bGVkQXQoZW50cnkuX3N0YXRlLCBpLCBlbnRyeS5fcmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl93aWxsU2V0dGxlQXQoYy5yZXNvbHZlKGVudHJ5KSwgaSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3JlbWFpbmluZy0tO1xuICAgICAgICB0aGlzLl9yZXN1bHRbaV0gPSB0aGlzLl9tYWtlUmVzdWx0KCQkJGludGVybmFsJCRGVUxGSUxMRUQsIGksIGVudHJ5KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJCQkZW51bWVyYXRvciQkRW51bWVyYXRvci5wcm90b3R5cGUuX3NldHRsZWRBdCA9IGZ1bmN0aW9uKHN0YXRlLCBpLCB2YWx1ZSkge1xuICAgICAgdmFyIHByb21pc2UgPSB0aGlzLnByb21pc2U7XG5cbiAgICAgIGlmIChwcm9taXNlLl9zdGF0ZSA9PT0gJCQkaW50ZXJuYWwkJFBFTkRJTkcpIHtcbiAgICAgICAgdGhpcy5fcmVtYWluaW5nLS07XG5cbiAgICAgICAgaWYgKHRoaXMuX2Fib3J0T25SZWplY3QgJiYgc3RhdGUgPT09ICQkJGludGVybmFsJCRSRUpFQ1RFRCkge1xuICAgICAgICAgICQkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3Jlc3VsdFtpXSA9IHRoaXMuX21ha2VSZXN1bHQoc3RhdGUsIGksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICQkJGludGVybmFsJCRmdWxmaWxsKHByb21pc2UsIHRoaXMuX3Jlc3VsdCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgICQkJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl9tYWtlUmVzdWx0ID0gZnVuY3Rpb24oc3RhdGUsIGksIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgICQkJGVudW1lcmF0b3IkJEVudW1lcmF0b3IucHJvdG90eXBlLl93aWxsU2V0dGxlQXQgPSBmdW5jdGlvbihwcm9taXNlLCBpKSB7XG4gICAgICB2YXIgZW51bWVyYXRvciA9IHRoaXM7XG5cbiAgICAgICQkJGludGVybmFsJCRzdWJzY3JpYmUocHJvbWlzZSwgdW5kZWZpbmVkLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBlbnVtZXJhdG9yLl9zZXR0bGVkQXQoJCQkaW50ZXJuYWwkJEZVTEZJTExFRCwgaSwgdmFsdWUpO1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGVudW1lcmF0b3IuX3NldHRsZWRBdCgkJCRpbnRlcm5hbCQkUkVKRUNURUQsIGksIHJlYXNvbik7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyICQkcHJvbWlzZSRhbGwkJGRlZmF1bHQgPSBmdW5jdGlvbiBhbGwoZW50cmllcywgbGFiZWwpIHtcbiAgICAgIHJldHVybiBuZXcgJCQkZW51bWVyYXRvciQkZGVmYXVsdCh0aGlzLCBlbnRyaWVzLCB0cnVlIC8qIGFib3J0IG9uIHJlamVjdCAqLywgbGFiZWwpLnByb21pc2U7XG4gICAgfTtcblxuICAgIHZhciAkJHByb21pc2UkcmFjZSQkZGVmYXVsdCA9IGZ1bmN0aW9uIHJhY2UoZW50cmllcywgbGFiZWwpIHtcbiAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzO1xuXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcigkJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuXG4gICAgICBpZiAoISQkdXRpbHMkJGlzQXJyYXkoZW50cmllcykpIHtcbiAgICAgICAgJCQkaW50ZXJuYWwkJHJlamVjdChwcm9taXNlLCBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGFuIGFycmF5IHRvIHJhY2UuJykpO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGxlbmd0aCA9IGVudHJpZXMubGVuZ3RoO1xuXG4gICAgICBmdW5jdGlvbiBvbkZ1bGZpbGxtZW50KHZhbHVlKSB7XG4gICAgICAgICQkJGludGVybmFsJCRyZXNvbHZlKHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gb25SZWplY3Rpb24ocmVhc29uKSB7XG4gICAgICAgICQkJGludGVybmFsJCRyZWplY3QocHJvbWlzZSwgcmVhc29uKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IHByb21pc2UuX3N0YXRlID09PSAkJCRpbnRlcm5hbCQkUEVORElORyAmJiBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgJCQkaW50ZXJuYWwkJHN1YnNjcmliZShDb25zdHJ1Y3Rvci5yZXNvbHZlKGVudHJpZXNbaV0pLCB1bmRlZmluZWQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcblxuICAgIHZhciAkJHByb21pc2UkcmVzb2x2ZSQkZGVmYXVsdCA9IGZ1bmN0aW9uIHJlc29sdmUob2JqZWN0LCBsYWJlbCkge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgIHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cbiAgICAgIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0LmNvbnN0cnVjdG9yID09PSBDb25zdHJ1Y3Rvcikge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfVxuXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBDb25zdHJ1Y3RvcigkJCRpbnRlcm5hbCQkbm9vcCwgbGFiZWwpO1xuICAgICAgJCQkaW50ZXJuYWwkJHJlc29sdmUocHJvbWlzZSwgb2JqZWN0KTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH07XG5cbiAgICB2YXIgJCRwcm9taXNlJHJlamVjdCQkZGVmYXVsdCA9IGZ1bmN0aW9uIHJlamVjdChyZWFzb24sIGxhYmVsKSB7XG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgdmFyIENvbnN0cnVjdG9yID0gdGhpcztcbiAgICAgIHZhciBwcm9taXNlID0gbmV3IENvbnN0cnVjdG9yKCQkJGludGVybmFsJCRub29wLCBsYWJlbCk7XG4gICAgICAkJCRpbnRlcm5hbCQkcmVqZWN0KHByb21pc2UsIHJlYXNvbik7XG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9O1xuXG4gICAgdmFyICQkZXM2JHByb21pc2UkcHJvbWlzZSQkY291bnRlciA9IDA7XG5cbiAgICBmdW5jdGlvbiAkJGVzNiRwcm9taXNlJHByb21pc2UkJG5lZWRzUmVzb2x2ZXIoKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdZb3UgbXVzdCBwYXNzIGEgcmVzb2x2ZXIgZnVuY3Rpb24gYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBwcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gJCRlczYkcHJvbWlzZSRwcm9taXNlJCRuZWVkc05ldygpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJGYWlsZWQgdG8gY29uc3RydWN0ICdQcm9taXNlJzogUGxlYXNlIHVzZSB0aGUgJ25ldycgb3BlcmF0b3IsIHRoaXMgb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi5cIik7XG4gICAgfVxuXG4gICAgdmFyICQkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdCA9ICQkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZTtcblxuICAgIC8qKlxuICAgICAgUHJvbWlzZSBvYmplY3RzIHJlcHJlc2VudCB0aGUgZXZlbnR1YWwgcmVzdWx0IG9mIGFuIGFzeW5jaHJvbm91cyBvcGVyYXRpb24uIFRoZVxuICAgICAgcHJpbWFyeSB3YXkgb2YgaW50ZXJhY3Rpbmcgd2l0aCBhIHByb21pc2UgaXMgdGhyb3VnaCBpdHMgYHRoZW5gIG1ldGhvZCwgd2hpY2hcbiAgICAgIHJlZ2lzdGVycyBjYWxsYmFja3MgdG8gcmVjZWl2ZSBlaXRoZXIgYSBwcm9taXNl4oCZcyBldmVudHVhbCB2YWx1ZSBvciB0aGUgcmVhc29uXG4gICAgICB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICAgICAgVGVybWlub2xvZ3lcbiAgICAgIC0tLS0tLS0tLS0tXG5cbiAgICAgIC0gYHByb21pc2VgIGlzIGFuIG9iamVjdCBvciBmdW5jdGlvbiB3aXRoIGEgYHRoZW5gIG1ldGhvZCB3aG9zZSBiZWhhdmlvciBjb25mb3JtcyB0byB0aGlzIHNwZWNpZmljYXRpb24uXG4gICAgICAtIGB0aGVuYWJsZWAgaXMgYW4gb2JqZWN0IG9yIGZ1bmN0aW9uIHRoYXQgZGVmaW5lcyBhIGB0aGVuYCBtZXRob2QuXG4gICAgICAtIGB2YWx1ZWAgaXMgYW55IGxlZ2FsIEphdmFTY3JpcHQgdmFsdWUgKGluY2x1ZGluZyB1bmRlZmluZWQsIGEgdGhlbmFibGUsIG9yIGEgcHJvbWlzZSkuXG4gICAgICAtIGBleGNlcHRpb25gIGlzIGEgdmFsdWUgdGhhdCBpcyB0aHJvd24gdXNpbmcgdGhlIHRocm93IHN0YXRlbWVudC5cbiAgICAgIC0gYHJlYXNvbmAgaXMgYSB2YWx1ZSB0aGF0IGluZGljYXRlcyB3aHkgYSBwcm9taXNlIHdhcyByZWplY3RlZC5cbiAgICAgIC0gYHNldHRsZWRgIHRoZSBmaW5hbCByZXN0aW5nIHN0YXRlIG9mIGEgcHJvbWlzZSwgZnVsZmlsbGVkIG9yIHJlamVjdGVkLlxuXG4gICAgICBBIHByb21pc2UgY2FuIGJlIGluIG9uZSBvZiB0aHJlZSBzdGF0ZXM6IHBlbmRpbmcsIGZ1bGZpbGxlZCwgb3IgcmVqZWN0ZWQuXG5cbiAgICAgIFByb21pc2VzIHRoYXQgYXJlIGZ1bGZpbGxlZCBoYXZlIGEgZnVsZmlsbG1lbnQgdmFsdWUgYW5kIGFyZSBpbiB0aGUgZnVsZmlsbGVkXG4gICAgICBzdGF0ZS4gIFByb21pc2VzIHRoYXQgYXJlIHJlamVjdGVkIGhhdmUgYSByZWplY3Rpb24gcmVhc29uIGFuZCBhcmUgaW4gdGhlXG4gICAgICByZWplY3RlZCBzdGF0ZS4gIEEgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmV2ZXIgYSB0aGVuYWJsZS5cblxuICAgICAgUHJvbWlzZXMgY2FuIGFsc28gYmUgc2FpZCB0byAqcmVzb2x2ZSogYSB2YWx1ZS4gIElmIHRoaXMgdmFsdWUgaXMgYWxzbyBhXG4gICAgICBwcm9taXNlLCB0aGVuIHRoZSBvcmlnaW5hbCBwcm9taXNlJ3Mgc2V0dGxlZCBzdGF0ZSB3aWxsIG1hdGNoIHRoZSB2YWx1ZSdzXG4gICAgICBzZXR0bGVkIHN0YXRlLiAgU28gYSBwcm9taXNlIHRoYXQgKnJlc29sdmVzKiBhIHByb21pc2UgdGhhdCByZWplY3RzIHdpbGxcbiAgICAgIGl0c2VsZiByZWplY3QsIGFuZCBhIHByb21pc2UgdGhhdCAqcmVzb2x2ZXMqIGEgcHJvbWlzZSB0aGF0IGZ1bGZpbGxzIHdpbGxcbiAgICAgIGl0c2VsZiBmdWxmaWxsLlxuXG5cbiAgICAgIEJhc2ljIFVzYWdlOlxuICAgICAgLS0tLS0tLS0tLS0tXG5cbiAgICAgIGBgYGpzXG4gICAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAvLyBvbiBzdWNjZXNzXG4gICAgICAgIHJlc29sdmUodmFsdWUpO1xuXG4gICAgICAgIC8vIG9uIGZhaWx1cmVcbiAgICAgICAgcmVqZWN0KHJlYXNvbik7XG4gICAgICB9KTtcblxuICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8vIG9uIGZ1bGZpbGxtZW50XG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgLy8gb24gcmVqZWN0aW9uXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBBZHZhbmNlZCBVc2FnZTpcbiAgICAgIC0tLS0tLS0tLS0tLS0tLVxuXG4gICAgICBQcm9taXNlcyBzaGluZSB3aGVuIGFic3RyYWN0aW5nIGF3YXkgYXN5bmNocm9ub3VzIGludGVyYWN0aW9ucyBzdWNoIGFzXG4gICAgICBgWE1MSHR0cFJlcXVlc3Rgcy5cblxuICAgICAgYGBganNcbiAgICAgIGZ1bmN0aW9uIGdldEpTT04odXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xuICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwpO1xuICAgICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBoYW5kbGVyO1xuICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XG4gICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgICAgIGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSB0aGlzLkRPTkUpIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzcG9uc2UpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2dldEpTT046IGAnICsgdXJsICsgJ2AgZmFpbGVkIHdpdGggc3RhdHVzOiBbJyArIHRoaXMuc3RhdHVzICsgJ10nKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZ2V0SlNPTignL3Bvc3RzLmpzb24nKS50aGVuKGZ1bmN0aW9uKGpzb24pIHtcbiAgICAgICAgLy8gb24gZnVsZmlsbG1lbnRcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAvLyBvbiByZWplY3Rpb25cbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIFVubGlrZSBjYWxsYmFja3MsIHByb21pc2VzIGFyZSBncmVhdCBjb21wb3NhYmxlIHByaW1pdGl2ZXMuXG5cbiAgICAgIGBgYGpzXG4gICAgICBQcm9taXNlLmFsbChbXG4gICAgICAgIGdldEpTT04oJy9wb3N0cycpLFxuICAgICAgICBnZXRKU09OKCcvY29tbWVudHMnKVxuICAgICAgXSkudGhlbihmdW5jdGlvbih2YWx1ZXMpe1xuICAgICAgICB2YWx1ZXNbMF0gLy8gPT4gcG9zdHNKU09OXG4gICAgICAgIHZhbHVlc1sxXSAvLyA9PiBjb21tZW50c0pTT05cblxuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgQGNsYXNzIFByb21pc2VcbiAgICAgIEBwYXJhbSB7ZnVuY3Rpb259IHJlc29sdmVyXG4gICAgICBVc2VmdWwgZm9yIHRvb2xpbmcuXG4gICAgICBAY29uc3RydWN0b3JcbiAgICAqL1xuICAgIGZ1bmN0aW9uICQkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZShyZXNvbHZlcikge1xuICAgICAgdGhpcy5faWQgPSAkJGVzNiRwcm9taXNlJHByb21pc2UkJGNvdW50ZXIrKztcbiAgICAgIHRoaXMuX3N0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBbXTtcblxuICAgICAgaWYgKCQkJGludGVybmFsJCRub29wICE9PSByZXNvbHZlcikge1xuICAgICAgICBpZiAoISQkdXRpbHMkJGlzRnVuY3Rpb24ocmVzb2x2ZXIpKSB7XG4gICAgICAgICAgJCRlczYkcHJvbWlzZSRwcm9taXNlJCRuZWVkc1Jlc29sdmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgJCRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlKSkge1xuICAgICAgICAgICQkZXM2JHByb21pc2UkcHJvbWlzZSQkbmVlZHNOZXcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgICQkJGludGVybmFsJCRpbml0aWFsaXplUHJvbWlzZSh0aGlzLCByZXNvbHZlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJCRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLmFsbCA9ICQkcHJvbWlzZSRhbGwkJGRlZmF1bHQ7XG4gICAgJCRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLnJhY2UgPSAkJHByb21pc2UkcmFjZSQkZGVmYXVsdDtcbiAgICAkJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UucmVzb2x2ZSA9ICQkcHJvbWlzZSRyZXNvbHZlJCRkZWZhdWx0O1xuICAgICQkZXM2JHByb21pc2UkcHJvbWlzZSQkUHJvbWlzZS5yZWplY3QgPSAkJHByb21pc2UkcmVqZWN0JCRkZWZhdWx0O1xuXG4gICAgJCRlczYkcHJvbWlzZSRwcm9taXNlJCRQcm9taXNlLnByb3RvdHlwZSA9IHtcbiAgICAgIGNvbnN0cnVjdG9yOiAkJGVzNiRwcm9taXNlJHByb21pc2UkJFByb21pc2UsXG5cbiAgICAvKipcbiAgICAgIFRoZSBwcmltYXJ5IHdheSBvZiBpbnRlcmFjdGluZyB3aXRoIGEgcHJvbWlzZSBpcyB0aHJvdWdoIGl0cyBgdGhlbmAgbWV0aG9kLFxuICAgICAgd2hpY2ggcmVnaXN0ZXJzIGNhbGxiYWNrcyB0byByZWNlaXZlIGVpdGhlciBhIHByb21pc2UncyBldmVudHVhbCB2YWx1ZSBvciB0aGVcbiAgICAgIHJlYXNvbiB3aHkgdGhlIHByb21pc2UgY2Fubm90IGJlIGZ1bGZpbGxlZC5cblxuICAgICAgYGBganNcbiAgICAgIGZpbmRVc2VyKCkudGhlbihmdW5jdGlvbih1c2VyKXtcbiAgICAgICAgLy8gdXNlciBpcyBhdmFpbGFibGVcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHVzZXIgaXMgdW5hdmFpbGFibGUsIGFuZCB5b3UgYXJlIGdpdmVuIHRoZSByZWFzb24gd2h5XG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBDaGFpbmluZ1xuICAgICAgLS0tLS0tLS1cblxuICAgICAgVGhlIHJldHVybiB2YWx1ZSBvZiBgdGhlbmAgaXMgaXRzZWxmIGEgcHJvbWlzZS4gIFRoaXMgc2Vjb25kLCAnZG93bnN0cmVhbSdcbiAgICAgIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmaXJzdCBwcm9taXNlJ3MgZnVsZmlsbG1lbnRcbiAgICAgIG9yIHJlamVjdGlvbiBoYW5kbGVyLCBvciByZWplY3RlZCBpZiB0aGUgaGFuZGxlciB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHJldHVybiB1c2VyLm5hbWU7XG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHJldHVybiAnZGVmYXVsdCBuYW1lJztcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHVzZXJOYW1lKSB7XG4gICAgICAgIC8vIElmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgdXNlck5hbWVgIHdpbGwgYmUgdGhlIHVzZXIncyBuYW1lLCBvdGhlcndpc2UgaXRcbiAgICAgICAgLy8gd2lsbCBiZSBgJ2RlZmF1bHQgbmFtZSdgXG4gICAgICB9KTtcblxuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRm91bmQgdXNlciwgYnV0IHN0aWxsIHVuaGFwcHknKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZmluZFVzZXJgIHJlamVjdGVkIGFuZCB3ZSdyZSB1bmhhcHB5Jyk7XG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAvLyBuZXZlciByZWFjaGVkXG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIGlmIGBmaW5kVXNlcmAgZnVsZmlsbGVkLCBgcmVhc29uYCB3aWxsIGJlICdGb3VuZCB1c2VyLCBidXQgc3RpbGwgdW5oYXBweScuXG4gICAgICAgIC8vIElmIGBmaW5kVXNlcmAgcmVqZWN0ZWQsIGByZWFzb25gIHdpbGwgYmUgJ2BmaW5kVXNlcmAgcmVqZWN0ZWQgYW5kIHdlJ3JlIHVuaGFwcHknLlxuICAgICAgfSk7XG4gICAgICBgYGBcbiAgICAgIElmIHRoZSBkb3duc3RyZWFtIHByb21pc2UgZG9lcyBub3Qgc3BlY2lmeSBhIHJlamVjdGlvbiBoYW5kbGVyLCByZWplY3Rpb24gcmVhc29ucyB3aWxsIGJlIHByb3BhZ2F0ZWQgZnVydGhlciBkb3duc3RyZWFtLlxuXG4gICAgICBgYGBqc1xuICAgICAgZmluZFVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgIHRocm93IG5ldyBQZWRhZ29naWNhbEV4Y2VwdGlvbignVXBzdHJlYW0gZXJyb3InKTtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5ldmVyIHJlYWNoZWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgLy8gVGhlIGBQZWRnYWdvY2lhbEV4Y2VwdGlvbmAgaXMgcHJvcGFnYXRlZCBhbGwgdGhlIHdheSBkb3duIHRvIGhlcmVcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEFzc2ltaWxhdGlvblxuICAgICAgLS0tLS0tLS0tLS0tXG5cbiAgICAgIFNvbWV0aW1lcyB0aGUgdmFsdWUgeW91IHdhbnQgdG8gcHJvcGFnYXRlIHRvIGEgZG93bnN0cmVhbSBwcm9taXNlIGNhbiBvbmx5IGJlXG4gICAgICByZXRyaWV2ZWQgYXN5bmNocm9ub3VzbHkuIFRoaXMgY2FuIGJlIGFjaGlldmVkIGJ5IHJldHVybmluZyBhIHByb21pc2UgaW4gdGhlXG4gICAgICBmdWxmaWxsbWVudCBvciByZWplY3Rpb24gaGFuZGxlci4gVGhlIGRvd25zdHJlYW0gcHJvbWlzZSB3aWxsIHRoZW4gYmUgcGVuZGluZ1xuICAgICAgdW50aWwgdGhlIHJldHVybmVkIHByb21pc2UgaXMgc2V0dGxlZC4gVGhpcyBpcyBjYWxsZWQgKmFzc2ltaWxhdGlvbiouXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgICAgLy8gVGhlIHVzZXIncyBjb21tZW50cyBhcmUgbm93IGF2YWlsYWJsZVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgSWYgdGhlIGFzc2ltbGlhdGVkIHByb21pc2UgcmVqZWN0cywgdGhlbiB0aGUgZG93bnN0cmVhbSBwcm9taXNlIHdpbGwgYWxzbyByZWplY3QuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmaW5kVXNlcigpLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRDb21tZW50c0J5QXV0aG9yKHVzZXIpO1xuICAgICAgfSkudGhlbihmdW5jdGlvbiAoY29tbWVudHMpIHtcbiAgICAgICAgLy8gSWYgYGZpbmRDb21tZW50c0J5QXV0aG9yYCBmdWxmaWxscywgd2UnbGwgaGF2ZSB0aGUgdmFsdWUgaGVyZVxuICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAvLyBJZiBgZmluZENvbW1lbnRzQnlBdXRob3JgIHJlamVjdHMsIHdlJ2xsIGhhdmUgdGhlIHJlYXNvbiBoZXJlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBTaW1wbGUgRXhhbXBsZVxuICAgICAgLS0tLS0tLS0tLS0tLS1cblxuICAgICAgU3luY2hyb25vdXMgRXhhbXBsZVxuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICB2YXIgcmVzdWx0O1xuXG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBmaW5kUmVzdWx0KCk7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH1cbiAgICAgIGBgYFxuXG4gICAgICBFcnJiYWNrIEV4YW1wbGVcblxuICAgICAgYGBganNcbiAgICAgIGZpbmRSZXN1bHQoZnVuY3Rpb24ocmVzdWx0LCBlcnIpe1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgUHJvbWlzZSBFeGFtcGxlO1xuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICBmaW5kUmVzdWx0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAvLyBzdWNjZXNzXG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAvLyBmYWlsdXJlXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBBZHZhbmNlZCBFeGFtcGxlXG4gICAgICAtLS0tLS0tLS0tLS0tLVxuXG4gICAgICBTeW5jaHJvbm91cyBFeGFtcGxlXG5cbiAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgIHZhciBhdXRob3IsIGJvb2tzO1xuXG4gICAgICB0cnkge1xuICAgICAgICBhdXRob3IgPSBmaW5kQXV0aG9yKCk7XG4gICAgICAgIGJvb2tzICA9IGZpbmRCb29rc0J5QXV0aG9yKGF1dGhvcik7XG4gICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgIC8vIGZhaWx1cmVcbiAgICAgIH1cbiAgICAgIGBgYFxuXG4gICAgICBFcnJiYWNrIEV4YW1wbGVcblxuICAgICAgYGBganNcblxuICAgICAgZnVuY3Rpb24gZm91bmRCb29rcyhib29rcykge1xuXG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGZhaWx1cmUocmVhc29uKSB7XG5cbiAgICAgIH1cblxuICAgICAgZmluZEF1dGhvcihmdW5jdGlvbihhdXRob3IsIGVycil7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgLy8gZmFpbHVyZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmaW5kQm9vb2tzQnlBdXRob3IoYXV0aG9yLCBmdW5jdGlvbihib29rcywgZXJyKSB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGZvdW5kQm9va3MoYm9va3MpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2gocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgICBmYWlsdXJlKHJlYXNvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICBmYWlsdXJlKGVycik7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHN1Y2Nlc3NcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBgYGBcblxuICAgICAgUHJvbWlzZSBFeGFtcGxlO1xuXG4gICAgICBgYGBqYXZhc2NyaXB0XG4gICAgICBmaW5kQXV0aG9yKCkuXG4gICAgICAgIHRoZW4oZmluZEJvb2tzQnlBdXRob3IpLlxuICAgICAgICB0aGVuKGZ1bmN0aW9uKGJvb2tzKXtcbiAgICAgICAgICAvLyBmb3VuZCBib29rc1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgIH0pO1xuICAgICAgYGBgXG5cbiAgICAgIEBtZXRob2QgdGhlblxuICAgICAgQHBhcmFtIHtGdW5jdGlvbn0gb25GdWxmaWxsZWRcbiAgICAgIEBwYXJhbSB7RnVuY3Rpb259IG9uUmVqZWN0ZWRcbiAgICAgIFVzZWZ1bCBmb3IgdG9vbGluZy5cbiAgICAgIEByZXR1cm4ge1Byb21pc2V9XG4gICAgKi9cbiAgICAgIHRoZW46IGZ1bmN0aW9uKG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzO1xuICAgICAgICB2YXIgc3RhdGUgPSBwYXJlbnQuX3N0YXRlO1xuXG4gICAgICAgIGlmIChzdGF0ZSA9PT0gJCQkaW50ZXJuYWwkJEZVTEZJTExFRCAmJiAhb25GdWxmaWxsbWVudCB8fCBzdGF0ZSA9PT0gJCQkaW50ZXJuYWwkJFJFSkVDVEVEICYmICFvblJlamVjdGlvbikge1xuICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkID0gbmV3IHRoaXMuY29uc3RydWN0b3IoJCQkaW50ZXJuYWwkJG5vb3ApO1xuICAgICAgICB2YXIgcmVzdWx0ID0gcGFyZW50Ll9yZXN1bHQ7XG5cbiAgICAgICAgaWYgKHN0YXRlKSB7XG4gICAgICAgICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzW3N0YXRlIC0gMV07XG4gICAgICAgICAgJCRhc2FwJCRkZWZhdWx0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkJCRpbnRlcm5hbCQkaW52b2tlQ2FsbGJhY2soc3RhdGUsIGNoaWxkLCBjYWxsYmFjaywgcmVzdWx0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkJCRpbnRlcm5hbCQkc3Vic2NyaWJlKHBhcmVudCwgY2hpbGQsIG9uRnVsZmlsbG1lbnQsIG9uUmVqZWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgIH0sXG5cbiAgICAvKipcbiAgICAgIGBjYXRjaGAgaXMgc2ltcGx5IHN1Z2FyIGZvciBgdGhlbih1bmRlZmluZWQsIG9uUmVqZWN0aW9uKWAgd2hpY2ggbWFrZXMgaXQgdGhlIHNhbWVcbiAgICAgIGFzIHRoZSBjYXRjaCBibG9jayBvZiBhIHRyeS9jYXRjaCBzdGF0ZW1lbnQuXG5cbiAgICAgIGBgYGpzXG4gICAgICBmdW5jdGlvbiBmaW5kQXV0aG9yKCl7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGRuJ3QgZmluZCB0aGF0IGF1dGhvcicpO1xuICAgICAgfVxuXG4gICAgICAvLyBzeW5jaHJvbm91c1xuICAgICAgdHJ5IHtcbiAgICAgICAgZmluZEF1dGhvcigpO1xuICAgICAgfSBjYXRjaChyZWFzb24pIHtcbiAgICAgICAgLy8gc29tZXRoaW5nIHdlbnQgd3JvbmdcbiAgICAgIH1cblxuICAgICAgLy8gYXN5bmMgd2l0aCBwcm9taXNlc1xuICAgICAgZmluZEF1dGhvcigpLmNhdGNoKGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIC8vIHNvbWV0aGluZyB3ZW50IHdyb25nXG4gICAgICB9KTtcbiAgICAgIGBgYFxuXG4gICAgICBAbWV0aG9kIGNhdGNoXG4gICAgICBAcGFyYW0ge0Z1bmN0aW9ufSBvblJlamVjdGlvblxuICAgICAgVXNlZnVsIGZvciB0b29saW5nLlxuICAgICAgQHJldHVybiB7UHJvbWlzZX1cbiAgICAqL1xuICAgICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGlvbik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciAkJGVzNiRwcm9taXNlJHBvbHlmaWxsJCRkZWZhdWx0ID0gZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gICAgICB2YXIgbG9jYWw7XG5cbiAgICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsb2NhbCA9IGdsb2JhbDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRvY3VtZW50KSB7XG4gICAgICAgIGxvY2FsID0gd2luZG93O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9jYWwgPSBzZWxmO1xuICAgICAgfVxuXG4gICAgICB2YXIgZXM2UHJvbWlzZVN1cHBvcnQgPVxuICAgICAgICBcIlByb21pc2VcIiBpbiBsb2NhbCAmJlxuICAgICAgICAvLyBTb21lIG9mIHRoZXNlIG1ldGhvZHMgYXJlIG1pc3NpbmcgZnJvbVxuICAgICAgICAvLyBGaXJlZm94L0Nocm9tZSBleHBlcmltZW50YWwgaW1wbGVtZW50YXRpb25zXG4gICAgICAgIFwicmVzb2x2ZVwiIGluIGxvY2FsLlByb21pc2UgJiZcbiAgICAgICAgXCJyZWplY3RcIiBpbiBsb2NhbC5Qcm9taXNlICYmXG4gICAgICAgIFwiYWxsXCIgaW4gbG9jYWwuUHJvbWlzZSAmJlxuICAgICAgICBcInJhY2VcIiBpbiBsb2NhbC5Qcm9taXNlICYmXG4gICAgICAgIC8vIE9sZGVyIHZlcnNpb24gb2YgdGhlIHNwZWMgaGFkIGEgcmVzb2x2ZXIgb2JqZWN0XG4gICAgICAgIC8vIGFzIHRoZSBhcmcgcmF0aGVyIHRoYW4gYSBmdW5jdGlvblxuICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHJlc29sdmU7XG4gICAgICAgICAgbmV3IGxvY2FsLlByb21pc2UoZnVuY3Rpb24ocikgeyByZXNvbHZlID0gcjsgfSk7XG4gICAgICAgICAgcmV0dXJuICQkdXRpbHMkJGlzRnVuY3Rpb24ocmVzb2x2ZSk7XG4gICAgICAgIH0oKSk7XG5cbiAgICAgIGlmICghZXM2UHJvbWlzZVN1cHBvcnQpIHtcbiAgICAgICAgbG9jYWwuUHJvbWlzZSA9ICQkZXM2JHByb21pc2UkcHJvbWlzZSQkZGVmYXVsdDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGVzNiRwcm9taXNlJHVtZCQkRVM2UHJvbWlzZSA9IHtcbiAgICAgICdQcm9taXNlJzogJCRlczYkcHJvbWlzZSRwcm9taXNlJCRkZWZhdWx0LFxuICAgICAgJ3BvbHlmaWxsJzogJCRlczYkcHJvbWlzZSRwb2x5ZmlsbCQkZGVmYXVsdFxuICAgIH07XG5cbiAgICAvKiBnbG9iYWwgZGVmaW5lOnRydWUgbW9kdWxlOnRydWUgd2luZG93OiB0cnVlICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lWydhbWQnXSkge1xuICAgICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gZXM2JHByb21pc2UkdW1kJCRFUzZQcm9taXNlOyB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZVsnZXhwb3J0cyddKSB7XG4gICAgICBtb2R1bGVbJ2V4cG9ydHMnXSA9IGVzNiRwcm9taXNlJHVtZCQkRVM2UHJvbWlzZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpc1snRVM2UHJvbWlzZSddID0gZXM2JHByb21pc2UkdW1kJCRFUzZQcm9taXNlO1xuICAgIH1cbn0pLmNhbGwodGhpcyk7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIklyWFVzdVwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCIvKmdsb2JhbHMgZGVmaW5lICovXG4ndXNlIHN0cmljdCc7XG5cblxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIChyb290Lmh0dHBwbGVhc2Vwcm9taXNlcyA9IGZhY3Rvcnkocm9vdCkpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnkocm9vdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5odHRwcGxlYXNlcHJvbWlzZXMgPSBmYWN0b3J5KHJvb3QpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKHJvb3QpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChQcm9taXNlKSB7XG4gICAgICAgIFByb21pc2UgPSBQcm9taXNlIHx8IHJvb3QgJiYgcm9vdC5Qcm9taXNlO1xuICAgICAgICBpZiAoIVByb21pc2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gUHJvbWlzZSBpbXBsZW1lbnRhdGlvbiBmb3VuZC4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcHJvY2Vzc1JlcXVlc3Q6IGZ1bmN0aW9uIChyZXEpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzb2x2ZSwgcmVqZWN0LFxuICAgICAgICAgICAgICAgICAgICBvbGRPbmxvYWQgPSByZXEub25sb2FkLFxuICAgICAgICAgICAgICAgICAgICBvbGRPbmVycm9yID0gcmVxLm9uZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSA9IGE7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QgPSBiO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXEub25sb2FkID0gZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICBpZiAob2xkT25sb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBvbGRPbmxvYWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXEub25lcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZE9uZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IG9sZE9uZXJyb3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcS50aGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZS50aGVuLmFwcGx5KHByb21pc2UsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXFbJ2NhdGNoJ10gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlWydjYXRjaCddLmFwcGx5KHByb21pc2UsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xufSkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVzcG9uc2UgPSByZXF1aXJlKCcuL3Jlc3BvbnNlJyk7XG5cbmZ1bmN0aW9uIFJlcXVlc3RFcnJvcihtZXNzYWdlLCBwcm9wcykge1xuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgZXJyLm5hbWUgPSAnUmVxdWVzdEVycm9yJztcbiAgICB0aGlzLm5hbWUgPSBlcnIubmFtZTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcbiAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICAgIHRoaXMuc3RhY2sgPSBlcnIuc3RhY2s7XG4gICAgfVxuXG4gICAgdGhpcy50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZTtcbiAgICB9O1xuXG4gICAgZm9yICh2YXIgayBpbiBwcm9wcykge1xuICAgICAgICBpZiAocHJvcHMuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIHRoaXNba10gPSBwcm9wc1trXTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuUmVxdWVzdEVycm9yLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblxuUmVxdWVzdEVycm9yLmNyZWF0ZSA9IGZ1bmN0aW9uIChtZXNzYWdlLCByZXEsIHByb3BzKSB7XG4gICAgdmFyIGVyciA9IG5ldyBSZXF1ZXN0RXJyb3IobWVzc2FnZSwgcHJvcHMpO1xuICAgIFJlc3BvbnNlLmNhbGwoZXJyLCByZXEpO1xuICAgIHJldHVybiBlcnI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcXVlc3RFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGksXG4gICAgY2xlYW5VUkwgPSByZXF1aXJlKCcuLi9wbHVnaW5zL2NsZWFudXJsJyksXG4gICAgWEhSID0gcmVxdWlyZSgnLi94aHInKSxcbiAgICBkZWxheSA9IHJlcXVpcmUoJy4vdXRpbHMvZGVsYXknKSxcbiAgICBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vZXJyb3InKS5jcmVhdGUsXG4gICAgUmVzcG9uc2UgPSByZXF1aXJlKCcuL3Jlc3BvbnNlJyksXG4gICAgUmVxdWVzdCA9IHJlcXVpcmUoJy4vcmVxdWVzdCcpLFxuICAgIGV4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kJyksXG4gICAgb25jZSA9IHJlcXVpcmUoJy4vdXRpbHMvb25jZScpO1xuXG5mdW5jdGlvbiBmYWN0b3J5KGRlZmF1bHRzLCBwbHVnaW5zKSB7XG4gICAgZGVmYXVsdHMgPSBkZWZhdWx0cyB8fCB7fTtcbiAgICBwbHVnaW5zID0gcGx1Z2lucyB8fCBbXTtcblxuICAgIGZ1bmN0aW9uIGh0dHAocmVxLCBjYikge1xuICAgICAgICB2YXIgeGhyLCBwbHVnaW4sIGRvbmUsIGssIHRpbWVvdXRJZDtcblxuICAgICAgICByZXEgPSBuZXcgUmVxdWVzdChleHRlbmQoZGVmYXVsdHMsIHJlcSkpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBwbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBwbHVnaW4gPSBwbHVnaW5zW2ldO1xuICAgICAgICAgICAgaWYgKHBsdWdpbi5wcm9jZXNzUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgIHBsdWdpbi5wcm9jZXNzUmVxdWVzdChyZXEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2l2ZSB0aGUgcGx1Z2lucyBhIGNoYW5jZSB0byBjcmVhdGUgdGhlIFhIUiBvYmplY3RcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHBsdWdpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHBsdWdpbiA9IHBsdWdpbnNbaV07XG4gICAgICAgICAgICBpZiAocGx1Z2luLmNyZWF0ZVhIUikge1xuICAgICAgICAgICAgICAgIHhociA9IHBsdWdpbi5jcmVhdGVYSFIocmVxKTtcbiAgICAgICAgICAgICAgICBicmVhazsgLy8gRmlyc3QgY29tZSwgZmlyc3Qgc2VydmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB4aHIgPSB4aHIgfHwgbmV3IFhIUigpO1xuXG4gICAgICAgIHJlcS54aHIgPSB4aHI7XG5cbiAgICAgICAgLy8gQmVjYXVzZSBYSFIgY2FuIGJlIGFuIFhNTEh0dHBSZXF1ZXN0IG9yIGFuIFhEb21haW5SZXF1ZXN0LCB3ZSBhZGRcbiAgICAgICAgLy8gYG9ucmVhZHlzdGF0ZWNoYW5nZWAsIGBvbmxvYWRgLCBhbmQgYG9uZXJyb3JgIGNhbGxiYWNrcy4gV2UgdXNlIHRoZVxuICAgICAgICAvLyBgb25jZWAgdXRpbCB0byBtYWtlIHN1cmUgdGhhdCBvbmx5IG9uZSBpcyBjYWxsZWQgKGFuZCBpdCdzIG9ubHkgY2FsbGVkXG4gICAgICAgIC8vIG9uZSB0aW1lKS5cbiAgICAgICAgZG9uZSA9IG9uY2UoZGVsYXkoZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgICAgICAgICB4aHIub25sb2FkID0geGhyLm9uZXJyb3IgPSB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0geGhyLm9udGltZW91dCA9IHhoci5vbnByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgIHZhciByZXMgPSBlcnIgJiYgZXJyLmlzSHR0cEVycm9yID8gZXJyIDogbmV3IFJlc3BvbnNlKHJlcSk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGx1Z2lucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBsdWdpbiA9IHBsdWdpbnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKHBsdWdpbi5wcm9jZXNzUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luLnByb2Nlc3NSZXNwb25zZShyZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVxLm9uZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxLm9uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyZXEub25sb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcS5vbmxvYWQocmVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgICBjYihlcnIsIHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcblxuICAgICAgICAvLyBXaGVuIHRoZSByZXF1ZXN0IGNvbXBsZXRlcywgY29udGludWUuXG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocmVxLnRpbWVkT3V0KSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmIChyZXEuYWJvcnRlZCkge1xuICAgICAgICAgICAgICAgIGRvbmUoY3JlYXRlRXJyb3IoJ1JlcXVlc3QgYWJvcnRlZCcsIHJlcSwge25hbWU6ICdBYm9ydCd9KSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBNYXRoLmZsb29yKHhoci5zdGF0dXMgLyAxMDApO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHhoci5zdGF0dXMgPT09IDQwNCAmJiAhcmVxLmVycm9yT240MDQpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBraW5kO1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBraW5kID0gJ0NsaWVudCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2luZCA9ICdTZXJ2ZXInO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBraW5kID0gJ0hUVFAnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBtc2cgPSBraW5kICsgJyBFcnJvcjogJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnVGhlIHNlcnZlciByZXR1cm5lZCBhIHN0YXR1cyBvZiAnICsgeGhyLnN0YXR1cyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnIGZvciB0aGUgcmVxdWVzdCBcIicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxLm1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJyAnICsgcmVxLnVybCArICdcIic7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoY3JlYXRlRXJyb3IobXNnLCByZXEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gYG9ubG9hZGAgaXMgb25seSBjYWxsZWQgb24gc3VjY2VzcyBhbmQsIGluIElFLCB3aWxsIGJlIGNhbGxlZCB3aXRob3V0XG4gICAgICAgIC8vIGB4aHIuc3RhdHVzYCBoYXZpbmcgYmVlbiBzZXQsIHNvIHdlIGRvbid0IGNoZWNrIGl0LlxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkgeyBkb25lKCk7IH07XG5cbiAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkb25lKGNyZWF0ZUVycm9yKCdJbnRlcm5hbCBYSFIgRXJyb3InLCByZXEpKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJRSBzb21ldGltZXMgZmFpbHMgaWYgeW91IGRvbid0IHNwZWNpZnkgZXZlcnkgaGFuZGxlci5cbiAgICAgICAgLy8gU2VlIGh0dHA6Ly9zb2NpYWwubXNkbi5taWNyb3NvZnQuY29tL0ZvcnVtcy9pZS9lbi1VUy8zMGVmM2FkZC03NjdjLTQ0MzYtYjhhOS1mMWNhMTliNDgxMmUvaWU5LXJ0bS14ZG9tYWlucmVxdWVzdC1pc3N1ZWQtcmVxdWVzdHMtbWF5LWFib3J0LWlmLWFsbC1ldmVudC1oYW5kbGVycy1ub3Qtc3BlY2lmaWVkP2ZvcnVtPWlld2ViZGV2ZWxvcG1lbnRcbiAgICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uICgpIHsgLyogbm9vcCAqLyB9O1xuICAgICAgICB4aHIub25wcm9ncmVzcyA9IGZ1bmN0aW9uICgpIHsgLyogbm9vcCAqLyB9O1xuXG4gICAgICAgIHhoci5vcGVuKHJlcS5tZXRob2QsIHJlcS51cmwpO1xuXG4gICAgICAgIGlmIChyZXEudGltZW91dCkge1xuICAgICAgICAgICAgLy8gSWYgd2UgdXNlIHRoZSBub3JtYWwgWEhSIHRpbWVvdXQgbWVjaGFuaXNtIChgeGhyLnRpbWVvdXRgIGFuZFxuICAgICAgICAgICAgLy8gYHhoci5vbnRpbWVvdXRgKSwgYG9ucmVhZHlzdGF0ZWNoYW5nZWAgd2lsbCBiZSB0cmlnZ2VyZWQgYmVmb3JlXG4gICAgICAgICAgICAvLyBgb250aW1lb3V0YC4gVGhlcmUncyBubyB3YXkgdG8gcmVjb2duaXplIHRoYXQgaXQgd2FzIHRyaWdnZXJlZCBieVxuICAgICAgICAgICAgLy8gYSB0aW1lb3V0LCBhbmQgd2UnZCBiZSB1bmFibGUgdG8gZGlzcGF0Y2ggdGhlIHJpZ2h0IGVycm9yLlxuICAgICAgICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmVxLnRpbWVkT3V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkb25lKGNyZWF0ZUVycm9yKCdSZXF1ZXN0IHRpbWVvdXQnLCByZXEsIHtuYW1lOiAnVGltZW91dCd9KSk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7fVxuICAgICAgICAgICAgfSwgcmVxLnRpbWVvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChrIGluIHJlcS5oZWFkZXJzKSB7XG4gICAgICAgICAgICBpZiAocmVxLmhlYWRlcnMuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrLCByZXEuaGVhZGVyc1trXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB4aHIuc2VuZChyZXEuYm9keSk7XG5cbiAgICAgICAgcmV0dXJuIHJlcTtcbiAgICB9XG5cbiAgICB2YXIgbWV0aG9kLFxuICAgICAgICBtZXRob2RzID0gWydnZXQnLCAncG9zdCcsICdwdXQnLCAnaGVhZCcsICdwYXRjaCcsICdkZWxldGUnXSxcbiAgICAgICAgdmVyYiA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAocmVxLCBjYikge1xuICAgICAgICAgICAgICAgIHJlcSA9IG5ldyBSZXF1ZXN0KHJlcSk7XG4gICAgICAgICAgICAgICAgcmVxLm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gaHR0cChyZXEsIGNiKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgZm9yIChpID0gMDsgaSA8IG1ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbWV0aG9kID0gbWV0aG9kc1tpXTtcbiAgICAgICAgaHR0cFttZXRob2RdID0gdmVyYihtZXRob2QpO1xuICAgIH1cblxuICAgIGh0dHAucGx1Z2lucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHBsdWdpbnM7XG4gICAgfTtcblxuICAgIGh0dHAuZGVmYXVsdHMgPSBmdW5jdGlvbiAobmV3VmFsdWVzKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3J5KGV4dGVuZChkZWZhdWx0cywgbmV3VmFsdWVzKSwgcGx1Z2lucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRzO1xuICAgIH07XG5cbiAgICBodHRwLnVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5ld1BsdWdpbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgICByZXR1cm4gZmFjdG9yeShkZWZhdWx0cywgcGx1Z2lucy5jb25jYXQobmV3UGx1Z2lucykpO1xuICAgIH07XG5cbiAgICBodHRwLmJhcmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3J5KCk7XG4gICAgfTtcblxuICAgIGh0dHAuUmVxdWVzdCA9IFJlcXVlc3Q7XG4gICAgaHR0cC5SZXNwb25zZSA9IFJlc3BvbnNlO1xuXG4gICAgcmV0dXJuIGh0dHA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSh7fSwgW2NsZWFuVVJMXSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFJlcXVlc3Qob3B0c09yVXJsKSB7XG4gICAgdmFyIG9wdHMgPSB0eXBlb2Ygb3B0c09yVXJsID09PSAnc3RyaW5nJyA/IHt1cmw6IG9wdHNPclVybH0gOiBvcHRzT3JVcmwgfHwge307XG4gICAgdGhpcy5tZXRob2QgPSBvcHRzLm1ldGhvZCA/IG9wdHMubWV0aG9kLnRvVXBwZXJDYXNlKCkgOiAnR0VUJztcbiAgICB0aGlzLnVybCA9IG9wdHMudXJsO1xuICAgIHRoaXMuaGVhZGVycyA9IG9wdHMuaGVhZGVycyB8fCB7fTtcbiAgICB0aGlzLmJvZHkgPSBvcHRzLmJvZHk7XG4gICAgdGhpcy50aW1lb3V0ID0gb3B0cy50aW1lb3V0IHx8IDA7XG4gICAgdGhpcy5lcnJvck9uNDA0ID0gb3B0cy5lcnJvck9uNDA0ICE9IG51bGwgPyBvcHRzLmVycm9yT240MDQgOiB0cnVlO1xuICAgIHRoaXMub25sb2FkID0gb3B0cy5vbmxvYWQ7XG4gICAgdGhpcy5vbmVycm9yID0gb3B0cy5vbmVycm9yO1xufVxuXG5SZXF1ZXN0LnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5hYm9ydGVkKSByZXR1cm47XG4gICAgdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgICB0aGlzLnhoci5hYm9ydCgpO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuUmVxdWVzdC5wcm90b3R5cGUuaGVhZGVyID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGs7XG4gICAgZm9yIChrIGluIHRoaXMuaGVhZGVycykge1xuICAgICAgICBpZiAodGhpcy5oZWFkZXJzLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICBpZiAobmFtZS50b0xvd2VyQ2FzZSgpID09PSBrLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oZWFkZXJzW2tdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmhlYWRlcnNba107XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5oZWFkZXJzW25hbWVdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlcXVlc3QgPSByZXF1aXJlKCcuL3JlcXVlc3QnKTtcblxuXG5mdW5jdGlvbiBSZXNwb25zZShyZXEpIHtcbiAgICB2YXIgaSwgbGluZXMsIG0sXG4gICAgICAgIHhociA9IHJlcS54aHI7XG4gICAgdGhpcy5yZXF1ZXN0ID0gcmVxO1xuICAgIHRoaXMueGhyID0geGhyO1xuICAgIHRoaXMuaGVhZGVycyA9IHt9O1xuXG4gICAgLy8gQnJvd3NlcnMgZG9uJ3QgbGlrZSB5b3UgdHJ5aW5nIHRvIHJlYWQgWEhSIHByb3BlcnRpZXMgd2hlbiB5b3UgYWJvcnQgdGhlXG4gICAgLy8gcmVxdWVzdCwgc28gd2UgZG9uJ3QuXG4gICAgaWYgKHJlcS5hYm9ydGVkIHx8IHJlcS50aW1lZE91dCkgcmV0dXJuO1xuXG4gICAgdGhpcy5zdGF0dXMgPSB4aHIuc3RhdHVzIHx8IDA7XG4gICAgdGhpcy50ZXh0ID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICB0aGlzLmJvZHkgPSB4aHIucmVzcG9uc2UgfHwgeGhyLnJlc3BvbnNlVGV4dDtcbiAgICB0aGlzLmNvbnRlbnRUeXBlID0geGhyLmNvbnRlbnRUeXBlIHx8ICh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIgJiYgeGhyLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKSk7XG5cbiAgICBpZiAoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycykge1xuICAgICAgICBsaW5lcyA9IHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKS5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKChtID0gbGluZXNbaV0ubWF0Y2goL1xccyooW15cXHNdKyk6XFxzKyhbXlxcc10rKS8pKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyc1ttWzFdXSA9IG1bMl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmlzSHR0cEVycm9yID0gdGhpcy5zdGF0dXMgPj0gNDAwO1xufVxuXG5SZXNwb25zZS5wcm90b3R5cGUuaGVhZGVyID0gUmVxdWVzdC5wcm90b3R5cGUuaGVhZGVyO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUmVzcG9uc2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIFdyYXAgYSBmdW5jdGlvbiBpbiBhIGBzZXRUaW1lb3V0YCBjYWxsLiBUaGlzIGlzIHVzZWQgdG8gZ3VhcmFudGVlIGFzeW5jXG4vLyBiZWhhdmlvciwgd2hpY2ggY2FuIGF2b2lkIHVuZXhwZWN0ZWQgZXJyb3JzLlxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCksXG4gICAgICAgICAgICBuZXdGdW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIHNldFRpbWVvdXQobmV3RnVuYywgMCk7XG4gICAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIEEgXCJvbmNlXCIgdXRpbGl0eS5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgdmFyIHJlc3VsdCwgY2FsbGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFjYWxsZWQpIHtcbiAgICAgICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICByZXN1bHQgPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdy5YTUxIdHRwUmVxdWVzdDtcbiIsIm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kXG5cbmZ1bmN0aW9uIGV4dGVuZCgpIHtcbiAgICB2YXIgdGFyZ2V0ID0ge31cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHByb2Nlc3NSZXF1ZXN0OiBmdW5jdGlvbiAocmVxKSB7XG4gICAgICAgIHJlcS51cmwgPSByZXEudXJsLnJlcGxhY2UoL1teJV0rL2csIGZ1bmN0aW9uIChzKSB7XG4gICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJKHMpO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIganNvbnJlcXVlc3QgPSByZXF1aXJlKCcuL2pzb25yZXF1ZXN0JyksXG4gICAganNvbnJlc3BvbnNlID0gcmVxdWlyZSgnLi9qc29ucmVzcG9uc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHJvY2Vzc1JlcXVlc3Q6IGZ1bmN0aW9uIChyZXEpIHtcbiAgICAgICAganNvbnJlcXVlc3QucHJvY2Vzc1JlcXVlc3QuY2FsbCh0aGlzLCByZXEpO1xuICAgICAgICBqc29ucmVzcG9uc2UucHJvY2Vzc1JlcXVlc3QuY2FsbCh0aGlzLCByZXEpO1xuICAgIH0sXG4gICAgcHJvY2Vzc1Jlc3BvbnNlOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGpzb25yZXNwb25zZS5wcm9jZXNzUmVzcG9uc2UuY2FsbCh0aGlzLCByZXMpO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHByb2Nlc3NSZXF1ZXN0OiBmdW5jdGlvbiAocmVxKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgY29udGVudFR5cGUgPSByZXEuaGVhZGVyKCdDb250ZW50LVR5cGUnKSxcbiAgICAgICAgICAgIGhhc0pzb25Db250ZW50VHlwZSA9IGNvbnRlbnRUeXBlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZS5pbmRleE9mKCdhcHBsaWNhdGlvbi9qc29uJykgIT09IC0xO1xuXG4gICAgICAgIGlmIChjb250ZW50VHlwZSAhPSBudWxsICYmICFoYXNKc29uQ29udGVudFR5cGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgICAgICAgaWYgKCFjb250ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgIHJlcS5oZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlcS5ib2R5ID0gSlNPTi5zdHJpbmdpZnkocmVxLmJvZHkpO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgcHJvY2Vzc1JlcXVlc3Q6IGZ1bmN0aW9uIChyZXEpIHtcbiAgICAgICAgdmFyIGFjY2VwdCA9IHJlcS5oZWFkZXIoJ0FjY2VwdCcpO1xuICAgICAgICBpZiAoYWNjZXB0ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJlcS5oZWFkZXIoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHByb2Nlc3NSZXNwb25zZTogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGNvbnRlbnR5cGUgaXMgXCJzb21ldGhpbmcvanNvblwiIG9yXG4gICAgICAgIC8vIFwic29tZXRoaW5nL3NvbWV0aGluZ2Vsc2UranNvblwiXG4gICAgICAgIGlmIChyZXMuY29udGVudFR5cGUgJiYgL14uKlxcLyg/Oi4qXFwrKT9qc29uKDt8JCkvaS50ZXN0KHJlcy5jb250ZW50VHlwZSkpIHtcbiAgICAgICAgICAgIHZhciByYXcgPSB0eXBlb2YgcmVzLmJvZHkgPT09ICdzdHJpbmcnID8gcmVzLmJvZHkgOiByZXMudGV4dDtcbiAgICAgICAgICAgIGlmIChyYXcpIHtcbiAgICAgICAgICAgICAgICByZXMuYm9keSA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3NyYy9hcGkuanNcIik7XG4iLCJ2YXIgYXBpID0gZnVuY3Rpb24gKHdobykge1xuXG4gICAgdmFyIF9tZXRob2RzID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgbSA9IFtdO1xuXG5cdG0uYWRkX2JhdGNoID0gZnVuY3Rpb24gKG9iaikge1xuXHQgICAgbS51bnNoaWZ0KG9iaik7XG5cdH07XG5cblx0bS51cGRhdGUgPSBmdW5jdGlvbiAobWV0aG9kLCB2YWx1ZSkge1xuXHQgICAgZm9yICh2YXIgaT0wOyBpPG0ubGVuZ3RoOyBpKyspIHtcblx0XHRmb3IgKHZhciBwIGluIG1baV0pIHtcblx0XHQgICAgaWYgKHAgPT09IG1ldGhvZCkge1xuXHRcdFx0bVtpXVtwXSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0ICAgIH1cblx0XHR9XG5cdCAgICB9XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdH07XG5cblx0bS5hZGQgPSBmdW5jdGlvbiAobWV0aG9kLCB2YWx1ZSkge1xuXHQgICAgaWYgKG0udXBkYXRlIChtZXRob2QsIHZhbHVlKSApIHtcblx0ICAgIH0gZWxzZSB7XG5cdFx0dmFyIHJlZyA9IHt9O1xuXHRcdHJlZ1ttZXRob2RdID0gdmFsdWU7XG5cdFx0bS5hZGRfYmF0Y2ggKHJlZyk7XG5cdCAgICB9XG5cdH07XG5cblx0bS5nZXQgPSBmdW5jdGlvbiAobWV0aG9kKSB7XG5cdCAgICBmb3IgKHZhciBpPTA7IGk8bS5sZW5ndGg7IGkrKykge1xuXHRcdGZvciAodmFyIHAgaW4gbVtpXSkge1xuXHRcdCAgICBpZiAocCA9PT0gbWV0aG9kKSB7XG5cdFx0XHRyZXR1cm4gbVtpXVtwXTtcblx0XHQgICAgfVxuXHRcdH1cblx0ICAgIH1cblx0fTtcblxuXHRyZXR1cm4gbTtcbiAgICB9O1xuXG4gICAgdmFyIG1ldGhvZHMgICAgPSBfbWV0aG9kcygpO1xuICAgIHZhciBhcGkgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIGFwaS5jaGVjayA9IGZ1bmN0aW9uIChtZXRob2QsIGNoZWNrLCBtc2cpIHtcblx0aWYgKG1ldGhvZCBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdCAgICBmb3IgKHZhciBpPTA7IGk8bWV0aG9kLmxlbmd0aDsgaSsrKSB7XG5cdFx0YXBpLmNoZWNrKG1ldGhvZFtpXSwgY2hlY2ssIG1zZyk7XG5cdCAgICB9XG5cdCAgICByZXR1cm47XG5cdH1cblxuXHRpZiAodHlwZW9mIChtZXRob2QpID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICBtZXRob2QuY2hlY2soY2hlY2ssIG1zZyk7XG5cdH0gZWxzZSB7XG5cdCAgICB3aG9bbWV0aG9kXS5jaGVjayhjaGVjaywgbXNnKTtcblx0fVxuXHRyZXR1cm4gYXBpO1xuICAgIH07XG5cbiAgICBhcGkudHJhbnNmb3JtID0gZnVuY3Rpb24gKG1ldGhvZCwgY2Jhaykge1xuXHRpZiAobWV0aG9kIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0ICAgIGZvciAodmFyIGk9MDsgaTxtZXRob2QubGVuZ3RoOyBpKyspIHtcblx0XHRhcGkudHJhbnNmb3JtIChtZXRob2RbaV0sIGNiYWspO1xuXHQgICAgfVxuXHQgICAgcmV0dXJuO1xuXHR9XG5cblx0aWYgKHR5cGVvZiAobWV0aG9kKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgbWV0aG9kLnRyYW5zZm9ybSAoY2Jhayk7XG5cdH0gZWxzZSB7XG5cdCAgICB3aG9bbWV0aG9kXS50cmFuc2Zvcm0oY2Jhayk7XG5cdH1cblx0cmV0dXJuIGFwaTtcbiAgICB9O1xuXG4gICAgdmFyIGF0dGFjaF9tZXRob2QgPSBmdW5jdGlvbiAobWV0aG9kLCBvcHRzKSB7XG5cdHZhciBjaGVja3MgPSBbXTtcblx0dmFyIHRyYW5zZm9ybXMgPSBbXTtcblxuXHR2YXIgZ2V0dGVyID0gb3B0cy5vbl9nZXR0ZXIgfHwgZnVuY3Rpb24gKCkge1xuXHQgICAgcmV0dXJuIG1ldGhvZHMuZ2V0KG1ldGhvZCk7XG5cdH07XG5cblx0dmFyIHNldHRlciA9IG9wdHMub25fc2V0dGVyIHx8IGZ1bmN0aW9uICh4KSB7XG5cdCAgICBmb3IgKHZhciBpPTA7IGk8dHJhbnNmb3Jtcy5sZW5ndGg7IGkrKykge1xuXHRcdHggPSB0cmFuc2Zvcm1zW2ldKHgpO1xuXHQgICAgfVxuXG5cdCAgICBmb3IgKHZhciBqPTA7IGo8Y2hlY2tzLmxlbmd0aDsgaisrKSB7XG5cdFx0aWYgKCFjaGVja3Nbal0uY2hlY2soeCkpIHtcblx0XHQgICAgdmFyIG1zZyA9IGNoZWNrc1tqXS5tc2cgfHwgXG5cdFx0XHQoXCJWYWx1ZSBcIiArIHggKyBcIiBkb2Vzbid0IHNlZW0gdG8gYmUgdmFsaWQgZm9yIHRoaXMgbWV0aG9kXCIpO1xuXHRcdCAgICB0aHJvdyAobXNnKTtcblx0XHR9XG5cdCAgICB9XG5cdCAgICBtZXRob2RzLmFkZChtZXRob2QsIHgpO1xuXHR9O1xuXG5cdHZhciBuZXdfbWV0aG9kID0gZnVuY3Rpb24gKG5ld192YWwpIHtcblx0ICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdHJldHVybiBnZXR0ZXIoKTtcblx0ICAgIH1cblx0ICAgIHNldHRlcihuZXdfdmFsKTtcblx0ICAgIHJldHVybiB3aG87IC8vIFJldHVybiB0aGlzP1xuXHR9O1xuXHRuZXdfbWV0aG9kLmNoZWNrID0gZnVuY3Rpb24gKGNiYWssIG1zZykge1xuXHQgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0cmV0dXJuIGNoZWNrcztcblx0ICAgIH1cblx0ICAgIGNoZWNrcy5wdXNoICh7Y2hlY2sgOiBjYmFrLFxuXHRcdFx0ICBtc2cgICA6IG1zZ30pO1xuXHQgICAgcmV0dXJuIHRoaXM7XG5cdH07XG5cdG5ld19tZXRob2QudHJhbnNmb3JtID0gZnVuY3Rpb24gKGNiYWspIHtcblx0ICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdHJldHVybiB0cmFuc2Zvcm1zO1xuXHQgICAgfVxuXHQgICAgdHJhbnNmb3Jtcy5wdXNoKGNiYWspO1xuXHQgICAgcmV0dXJuIHRoaXM7XG5cdH07XG5cblx0d2hvW21ldGhvZF0gPSBuZXdfbWV0aG9kO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0c2V0ID0gZnVuY3Rpb24gKHBhcmFtLCBvcHRzKSB7XG5cdGlmICh0eXBlb2YgKHBhcmFtKSA9PT0gJ29iamVjdCcpIHtcblx0ICAgIG1ldGhvZHMuYWRkX2JhdGNoIChwYXJhbSk7XG5cdCAgICBmb3IgKHZhciBwIGluIHBhcmFtKSB7XG5cdFx0YXR0YWNoX21ldGhvZCAocCwgb3B0cyk7XG5cdCAgICB9XG5cdH0gZWxzZSB7XG5cdCAgICBtZXRob2RzLmFkZCAocGFyYW0sIG9wdHMuZGVmYXVsdF92YWx1ZSk7XG5cdCAgICBhdHRhY2hfbWV0aG9kIChwYXJhbSwgb3B0cyk7XG5cdH1cbiAgICB9O1xuXG4gICAgYXBpLmdldHNldCA9IGZ1bmN0aW9uIChwYXJhbSwgZGVmKSB7XG5cdGdldHNldChwYXJhbSwge2RlZmF1bHRfdmFsdWUgOiBkZWZ9KTtcblxuXHRyZXR1cm4gYXBpO1xuICAgIH07XG5cbiAgICBhcGkuZ2V0ID0gZnVuY3Rpb24gKHBhcmFtLCBkZWYpIHtcblx0dmFyIG9uX3NldHRlciA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIHRocm93IChcIk1ldGhvZCBkZWZpbmVkIG9ubHkgYXMgYSBnZXR0ZXIgKHlvdSBhcmUgdHJ5aW5nIHRvIHVzZSBpdCBhcyBhIHNldHRlclwiKTtcblx0fTtcblxuXHRnZXRzZXQocGFyYW0sIHtkZWZhdWx0X3ZhbHVlIDogZGVmLFxuXHRcdCAgICAgICBvbl9zZXR0ZXIgOiBvbl9zZXR0ZXJ9XG5cdCAgICAgICk7XG5cblx0cmV0dXJuIGFwaTtcbiAgICB9O1xuXG4gICAgYXBpLnNldCA9IGZ1bmN0aW9uIChwYXJhbSwgZGVmKSB7XG5cdHZhciBvbl9nZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICB0aHJvdyAoXCJNZXRob2QgZGVmaW5lZCBvbmx5IGFzIGEgc2V0dGVyICh5b3UgYXJlIHRyeWluZyB0byB1c2UgaXQgYXMgYSBnZXR0ZXJcIik7XG5cdH07XG5cblx0Z2V0c2V0KHBhcmFtLCB7ZGVmYXVsdF92YWx1ZSA6IGRlZixcblx0XHQgICAgICAgb25fZ2V0dGVyIDogb25fZ2V0dGVyfVxuXHQgICAgICApO1xuXG5cdHJldHVybiBhcGk7XG4gICAgfTtcblxuICAgIGFwaS5tZXRob2QgPSBmdW5jdGlvbiAobmFtZSwgY2Jhaykge1xuXHRpZiAodHlwZW9mIChuYW1lKSA9PT0gJ29iamVjdCcpIHtcblx0ICAgIGZvciAodmFyIHAgaW4gbmFtZSkge1xuXHRcdHdob1twXSA9IG5hbWVbcF07XG5cdCAgICB9XG5cdH0gZWxzZSB7XG5cdCAgICB3aG9bbmFtZV0gPSBjYmFrO1xuXHR9XG5cdHJldHVybiBhcGk7XG4gICAgfTtcblxuICAgIHJldHVybiBhcGk7XG4gICAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBhcGk7IiwidmFyIGh0dHAgPSByZXF1aXJlKFwiaHR0cHBsZWFzZVwiKTtcbnZhciBhcGlqcyA9IHJlcXVpcmUoXCJ0bnQuYXBpXCIpO1xudmFyIHByb21pc2VzID0gcmVxdWlyZSgnaHR0cHBsZWFzZS1wcm9taXNlcycpO1xudmFyIFByb21pc2UgPSByZXF1aXJlKCdlczYtcHJvbWlzZScpLlByb21pc2U7XG52YXIganNvbiA9IHJlcXVpcmUoXCJodHRwcGxlYXNlL3BsdWdpbnMvanNvblwiKTtcbmh0dHAgPSBodHRwLnVzZShqc29uKS51c2UocHJvbWlzZXMoUHJvbWlzZSkpO1xuXG50bnRfZVJlc3QgPSBmdW5jdGlvbigpIHtcblxuICAgIC8vIFByZWZpeGVzIHRvIHVzZSB0aGUgUkVTVCBBUEkuXG4gICAgLy8gVGhlc2UgYXJlIG1vZGlmaWVkIGluIHRoZSBsb2NhbFJFU1Qgc2V0dGVyXG4gICAgdmFyIHByZWZpeCA9IFwiaHR0cDovL3Jlc3QuZW5zZW1ibC5vcmdcIjtcbiAgICB2YXIgcHJlZml4X3JlZ2lvbiA9IHByZWZpeCArIFwiL292ZXJsYXAvcmVnaW9uL1wiO1xuICAgIHZhciBwcmVmaXhfZW5zZ2VuZSA9IHByZWZpeCArIFwiL2xvb2t1cC9pZC9cIjtcbiAgICB2YXIgcHJlZml4X3hyZWYgPSBwcmVmaXggKyBcIi94cmVmcy9zeW1ib2wvXCI7XG4gICAgdmFyIHByZWZpeF9ob21vbG9ndWVzID0gcHJlZml4ICsgXCIvaG9tb2xvZ3kvaWQvXCI7XG4gICAgdmFyIHByZWZpeF9jaHJfaW5mbyA9IHByZWZpeCArIFwiL2luZm8vYXNzZW1ibHkvXCI7XG4gICAgdmFyIHByZWZpeF9hbG5fcmVnaW9uID0gcHJlZml4ICsgXCIvYWxpZ25tZW50L3JlZ2lvbi9cIjtcbiAgICB2YXIgcHJlZml4X2dlbmVfdHJlZSA9IHByZWZpeCArIFwiL2dlbmV0cmVlL2lkL1wiO1xuICAgIHZhciBwcmVmaXhfYXNzZW1ibHkgPSBwcmVmaXggKyBcIi9pbmZvL2Fzc2VtYmx5L1wiO1xuXG4gICAgLy8gTnVtYmVyIG9mIGNvbm5lY3Rpb25zIG1hZGUgdG8gdGhlIGRhdGFiYXNlXG4gICAgdmFyIGNvbm5lY3Rpb25zID0gMDtcblxuICAgIHZhciBlUmVzdCA9IGZ1bmN0aW9uKCkge1xuICAgIH07XG5cbiAgICAvLyBMaW1pdHMgaW1wb3NlZCBieSB0aGUgZW5zZW1ibCBSRVNUIEFQSVxuICAgIGVSZXN0LmxpbWl0cyA9IHtcblx0cmVnaW9uIDogNTAwMDAwMFxuICAgIH07XG5cbiAgICB2YXIgYXBpID0gYXBpanMgKGVSZXN0KTtcblxuXG4gICAgLyoqIDxzdHJvbmc+bG9jYWxSRVNUPC9zdHJvbmc+IHBvaW50cyB0aGUgcXVlcmllcyB0byBhIGxvY2FsIFJFU1Qgc2VydmljZSB0byBkZWJ1Zy5cblx0VE9ETzogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIHJlbW92ZWQgaW4gXCJwcm9kdWN0aW9uXCJcbiAgICAqL1xuICAgIGFwaS5tZXRob2QgKCdsb2NhbFJFU1QnLCBmdW5jdGlvbigpIHtcblx0cHJlZml4ID0gXCJodHRwOi8vMTI3LjAuMC4xOjMwMDBcIjtcblx0cHJlZml4X3JlZ2lvbiA9IHByZWZpeCArIFwiL292ZXJsYXAvcmVnaW9uL1wiO1xuXHRwcmVmaXhfZW5zZ2VuZSA9IHByZWZpeCArIFwiL2xvb2t1cC9pZC9cIjtcblx0cHJlZml4X3hyZWYgPSBwcmVmaXggKyBcIi94cmVmcy9zeW1ib2wvXCI7XG5cdHByZWZpeF9ob21vbG9ndWVzID0gcHJlZml4ICsgXCIvaG9tb2xvZ3kvaWQvXCI7XG5cblx0cmV0dXJuIGVSZXN0O1xuICAgIH0pO1xuXG4gICAgLyoqIDxzdHJvbmc+Y2FsbDwvc3Ryb25nPiBtYWtlcyBhbiBhc3luY2hyb25vdXMgY2FsbCB0byB0aGUgZW5zZW1ibCBSRVNUIHNlcnZpY2UuXG5cdEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgLSBBIGxpdGVyYWwgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZyBmaWVsZHM6XG5cdDx1bD5cblx0PGxpPnVybCA9PiBUaGUgcmVzdCBVUkwuIFRoaXMgaXMgcmV0dXJuZWQgYnkge0BsaW5rIGVSZXN0LnVybH08L2xpPlxuXHQ8bGk+c3VjY2VzcyA9PiBBIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBSRVNUIHF1ZXJ5IGlzIHN1Y2Nlc3NmdWwgKGkuZS4gdGhlIHJlc3BvbnNlIGZyb20gdGhlIHNlcnZlciBpcyBhIGRlZmluZWQgdmFsdWUgYW5kIG5vIGVycm9yIGhhcyBiZWVuIHJldHVybmVkKTwvbGk+XG5cdDxsaT5lcnJvciA9PiBBIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBSRVNUIHF1ZXJ5IHJldHVybnMgYW4gZXJyb3Jcblx0PC91bD5cbiAgICAqL1xuICAgIGFwaS5tZXRob2QgKCdjYWxsJywgZnVuY3Rpb24gKG15dXJsKSB7XG5cdHJldHVybiBodHRwLmdldCh7XG5cdCAgICBcInVybFwiOiBteXVybFxuXHR9KTtcbiAgICB9KTtcbiAgICAvLyBhcGkubWV0aG9kICgnY2FsbCcsIGZ1bmN0aW9uIChvYmopIHtcbiAgICAvLyBcdHZhciB1cmwgPSBvYmoudXJsO1xuICAgIC8vIFx0dmFyIG9uX3N1Y2Nlc3MgPSBvYmouc3VjY2VzcztcbiAgICAvLyBcdHZhciBvbl9lcnJvciAgID0gb2JqLmVycm9yO1xuICAgIC8vIFx0Y29ubmVjdGlvbnMrKztcbiAgICAvLyBcdGh0dHAuZ2V0KHtcbiAgICAvLyBcdCAgICBcInVybFwiIDogdXJsXG4gICAgLy8gXHR9LCBmdW5jdGlvbiAoZXJyb3IsIHJlc3ApIHtcbiAgICAvLyBcdCAgICBpZiAocmVzcCAhPT0gdW5kZWZpbmVkICYmIGVycm9yID09IG51bGwgJiYgb25fc3VjY2VzcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gXHRcdG9uX3N1Y2Nlc3MoSlNPTi5wYXJzZShyZXNwLmJvZHkpKTtcbiAgICAvLyBcdCAgICB9XG4gICAgLy8gXHQgICAgaWYgKGVycm9yICE9PSBudWxsICYmIG9uX2Vycm9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBcdFx0b25fZXJyb3IoZXJyb3IpO1xuICAgIC8vIFx0ICAgIH1cbiAgICAvLyBcdH0pO1xuICAgIC8vIH0pO1xuXG5cbiAgICBlUmVzdC51cmwgPSB7fTtcbiAgICB2YXIgdXJsX2FwaSA9IGFwaWpzIChlUmVzdC51cmwpO1xuXHQvKiogZVJlc3QudXJsLjxzdHJvbmc+cmVnaW9uPC9zdHJvbmc+IHJldHVybnMgdGhlIGVuc2VtYmwgUkVTVCB1cmwgdG8gcmV0cmlldmUgdGhlIGdlbmVzIGluY2x1ZGVkIGluIHRoZSBzcGVjaWZpZWQgcmVnaW9uXG5cdCAgICBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gb2JqZWN0IGxpdGVyYWwgd2l0aCB0aGUgZm9sbG93aW5nIGZpZWxkczo8YnIgLz5cbjx1bD5cbjxsaT5zcGVjaWVzIDogVGhlIHNwZWNpZXMgdGhlIHJlZ2lvbiByZWZlcnMgdG88L2xpPlxuPGxpPmNociAgICAgOiBUaGUgY2hyIChvciBzZXFfcmVnaW9uIG5hbWUpPC9saT5cbjxsaT5mcm9tICAgIDogVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZWdpb24gaW4gdGhlIGNocjwvbGk+XG48bGk+dG8gICAgICA6IFRoZSBlbmQgcG9zaXRpb24gb2YgdGhlIHJlZ2lvbiAoZnJvbSA8IHRvIGFsd2F5cyk8L2xpPlxuPC91bD5cbiAgICAgICAgICAgIEByZXR1cm5zIHtzdHJpbmd9IC0gVGhlIHVybCB0byBxdWVyeSB0aGUgRW5zZW1ibCBSRVNUIHNlcnZlci4gRm9yIGFuIGV4YW1wbGUgb2Ygb3V0cHV0IG9mIHRoZXNlIHVybHMgc2VlIHRoZSB7QGxpbmsgaHR0cDovL2JldGEucmVzdC5lbnNlbWJsLm9yZy9mZWF0dXJlL3JlZ2lvbi9ob21vX3NhcGllbnMvMTM6MzI4ODk2MTEtMzI5NzM4MDUuanNvbj9mZWF0dXJlPWdlbmV8RW5zZW1ibCBSRVNUIEFQSSBleGFtcGxlfVxuXHQgICAgQGV4YW1wbGVcbmVSZXN0LmNhbGwgKCB1cmwgICAgIDogZVJlc3QudXJsLnJlZ2lvbiAoeyBzcGVjaWVzIDogXCJob21vX3NhcGllbnNcIiwgY2hyIDogXCIxM1wiLCBmcm9tIDogMzI4ODk2MTEsIHRvIDogMzI5NzM4MDUgfSksXG4gICAgICAgICAgICAgc3VjY2VzcyA6IGNhbGxiYWNrLFxuICAgICAgICAgICAgIGVycm9yICAgOiBjYWxsYmFja1xuXHQgICApO1xuXHQgKi9cbiAgICB1cmxfYXBpLm1ldGhvZCAoJ3JlZ2lvbicsIGZ1bmN0aW9uKG9iaikge1xuXHRyZXR1cm4gcHJlZml4X3JlZ2lvbiArXG5cdCAgICBvYmouc3BlY2llcyArXG5cdCAgICBcIi9cIiArXG5cdCAgICBvYmouY2hyICtcblx0ICAgIFwiOlwiICsgXG5cdCAgICBvYmouZnJvbSArIFxuXHQgICAgXCItXCIgKyBvYmoudG8gKyBcblx0ICAgIFwiLmpzb24/ZmVhdHVyZT1nZW5lXCI7XG4gICAgfSk7XG5cblx0LyoqIGVSZXN0LnVybC48c3Ryb25nPnNwZWNpZXNfZ2VuZTwvc3Ryb25nPiByZXR1cm5zIHRoZSBlbnNlbWJsIFJFU1QgdXJsIHRvIHJldHJpZXZlIHRoZSBlbnNlbWJsIGdlbmUgYXNzb2NpYXRlZCB3aXRoXG5cdCAgICB0aGUgZ2l2ZW4gbmFtZSBpbiB0aGUgc3BlY2lmaWVkIHNwZWNpZXMuXG5cdCAgICBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gb2JqZWN0IGxpdGVyYWwgd2l0aCB0aGUgZm9sbG93aW5nIGZpZWxkczo8YnIgLz5cbjx1bD5cbjxsaT5zcGVjaWVzICAgOiBUaGUgc3BlY2llcyB0aGUgcmVnaW9uIHJlZmVycyB0bzwvbGk+XG48bGk+Z2VuZV9uYW1lIDogVGhlIG5hbWUgb2YgdGhlIGdlbmU8L2xpPlxuPC91bD5cbiAgICAgICAgICAgIEByZXR1cm5zIHtzdHJpbmd9IC0gVGhlIHVybCB0byBxdWVyeSB0aGUgRW5zZW1ibCBSRVNUIHNlcnZlci4gRm9yIGFuIGV4YW1wbGUgb2Ygb3V0cHV0IG9mIHRoZXNlIHVybHMgc2VlIHRoZSB7QGxpbmsgaHR0cDovL2JldGEucmVzdC5lbnNlbWJsLm9yZy94cmVmcy9zeW1ib2wvaHVtYW4vQlJDQTIuanNvbj9vYmplY3RfdHlwZT1nZW5lfEVuc2VtYmwgUkVTVCBBUEkgZXhhbXBsZX1cblx0ICAgIEBleGFtcGxlXG5lUmVzdC5jYWxsICggdXJsICAgICA6IGVSZXN0LnVybC5zcGVjaWVzX2dlbmUgKHsgc3BlY2llcyA6IFwiaHVtYW5cIiwgZ2VuZV9uYW1lIDogXCJCUkNBMlwiIH0pLFxuICAgICAgICAgICAgIHN1Y2Nlc3MgOiBjYWxsYmFjayxcbiAgICAgICAgICAgICBlcnJvciAgIDogY2FsbGJhY2tcblx0ICAgKTtcblx0ICovXG4gICAgdXJsX2FwaS5tZXRob2QgKCd4cmVmJywgZnVuY3Rpb24gKG9iaikge1xuXHRyZXR1cm4gcHJlZml4X3hyZWYgK1xuXHQgICAgb2JqLnNwZWNpZXMgICtcblx0ICAgIFwiL1wiICtcblx0ICAgIG9iai5uYW1lICtcblx0ICAgIFwiLmpzb24/b2JqZWN0X3R5cGU9Z2VuZVwiO1xuICAgIH0pO1xuXG5cdC8qKiBlUmVzdC51cmwuPHN0cm9uZz5ob21vbG9ndWVzPC9zdHJvbmc+IHJldHVybnMgdGhlIGVuc2VtYmwgUkVTVCB1cmwgdG8gcmV0cmlldmUgdGhlIGhvbW9sb2d1ZXMgKG9ydGhvbG9ndWVzICsgcGFyYWxvZ3Vlcykgb2YgdGhlIGdpdmVuIGVuc2VtYmwgSUQuXG5cdCAgICBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gb2JqZWN0IGxpdGVyYWwgd2l0aCB0aGUgZm9sbG93aW5nIGZpZWxkczo8YnIgLz5cbjx1bD5cbjxsaT5pZCA6IFRoZSBFbnNlbWJsIElEIG9mIHRoZSBnZW5lPC9saT5cbjwvdWw+XG4gICAgICAgICAgICBAcmV0dXJucyB7c3RyaW5nfSAtIFRoZSB1cmwgdG8gcXVlcnkgdGhlIEVuc2VtYmwgUkVTVCBzZXJ2ZXIuIEZvciBhbiBleGFtcGxlIG9mIG91dHB1dCBvZiB0aGVzZSB1cmxzIHNlZSB0aGUge0BsaW5rIGh0dHA6Ly9iZXRhLnJlc3QuZW5zZW1ibC5vcmcvaG9tb2xvZ3kvaWQvRU5TRzAwMDAwMTM5NjE4Lmpzb24/Zm9ybWF0PWNvbmRlbnNlZDtzZXF1ZW5jZT1ub25lO3R5cGU9YWxsfEVuc2VtYmwgUkVTVCBBUEkgZXhhbXBsZX1cblx0ICAgIEBleGFtcGxlXG5lUmVzdC5jYWxsICggdXJsICAgICA6IGVSZXN0LnVybC5ob21vbG9ndWVzICh7IGlkIDogXCJFTlNHMDAwMDAxMzk2MThcIiB9KSxcbiAgICAgICAgICAgICBzdWNjZXNzIDogY2FsbGJhY2ssXG4gICAgICAgICAgICAgZXJyb3IgICA6IGNhbGxiYWNrXG5cdCAgICk7XG5cdCAqL1xuICAgIHVybF9hcGkubWV0aG9kICgnaG9tb2xvZ3VlcycsIGZ1bmN0aW9uKG9iaikge1xuXHRyZXR1cm4gcHJlZml4X2hvbW9sb2d1ZXMgK1xuXHQgICAgb2JqLmlkICsgXG5cdCAgICBcIi5qc29uP2Zvcm1hdD1jb25kZW5zZWQ7c2VxdWVuY2U9bm9uZTt0eXBlPWFsbFwiO1xuICAgIH0pO1xuXG5cdC8qKiBlUmVzdC51cmwuPHN0cm9uZz5nZW5lPC9zdHJvbmc+IHJldHVybnMgdGhlIGVuc2VtYmwgUkVTVCB1cmwgdG8gcmV0cmlldmUgdGhlIGVuc2VtYmwgZ2VuZSBhc3NvY2lhdGVkIHdpdGhcblx0ICAgIHRoZSBnaXZlbiBJRFxuXHQgICAgQHBhcmFtIHtvYmplY3R9IG9iaiAtIEFuIG9iamVjdCBsaXRlcmFsIHdpdGggdGhlIGZvbGxvd2luZyBmaWVsZHM6PGJyIC8+XG48dWw+XG48bGk+aWQgOiBUaGUgbmFtZSBvZiB0aGUgZ2VuZTwvbGk+XG48bGk+ZXhwYW5kIDogaWYgdHJhbnNjcmlwdHMgc2hvdWxkIGJlIGluY2x1ZGVkIGluIHRoZSByZXNwb25zZSAoZGVmYXVsdCB0byAwKTwvbGk+XG48L3VsPlxuICAgICAgICAgICAgQHJldHVybnMge3N0cmluZ30gLSBUaGUgdXJsIHRvIHF1ZXJ5IHRoZSBFbnNlbWJsIFJFU1Qgc2VydmVyLiBGb3IgYW4gZXhhbXBsZSBvZiBvdXRwdXQgb2YgdGhlc2UgdXJscyBzZWUgdGhlIHtAbGluayBodHRwOi8vYmV0YS5yZXN0LmVuc2VtYmwub3JnL2xvb2t1cC9FTlNHMDAwMDAxMzk2MTguanNvbj9mb3JtYXQ9ZnVsbHxFbnNlbWJsIFJFU1QgQVBJIGV4YW1wbGV9XG5cdCAgICBAZXhhbXBsZVxuZVJlc3QuY2FsbCAoIHVybCAgICAgOiBlUmVzdC51cmwuZ2VuZSAoeyBpZCA6IFwiRU5TRzAwMDAwMTM5NjE4XCIgfSksXG4gICAgICAgICAgICAgc3VjY2VzcyA6IGNhbGxiYWNrLFxuICAgICAgICAgICAgIGVycm9yICAgOiBjYWxsYmFja1xuXHQgICApO1xuXHQgKi9cbiAgICB1cmxfYXBpLm1ldGhvZCAoJ2dlbmUnLCBmdW5jdGlvbihvYmopIHtcblx0dmFyIHVybCA9IHByZWZpeF9lbnNnZW5lICsgb2JqLmlkICsgXCIuanNvbj9mb3JtYXQ9ZnVsbFwiO1xuXHRpZiAob2JqLmV4cGFuZCAmJiBvYmouZXhwYW5kID09PSAxKSB7XG5cdCAgICB1cmwgPSB1cmwgKyBcIiZleHBhbmQ9MVwiO1xuXHR9XG5cdHJldHVybiB1cmw7XG4gICAgfSk7XG5cblx0LyoqIGVSZXN0LnVybC48c3Ryb25nPmNocl9pbmZvPC9zdHJvbmc+IHJldHVybnMgdGhlIGVuc2VtYmwgUkVTVCB1cmwgdG8gcmV0cmlldmUgdGhlIGluZm9ybWF0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2hyb21vc29tZSAoc2VxX3JlZ2lvbiBpbiBFbnNlbWJsIG5vbWVuY2xhdHVyZSkuXG5cdCAgICBAcGFyYW0ge29iamVjdH0gb2JqIC0gQW4gb2JqZWN0IGxpdGVyYWwgd2l0aCB0aGUgZm9sbG93aW5nIGZpZWxkczo8YnIgLz5cbjx1bD5cbjxsaT5zcGVjaWVzIDogVGhlIHNwZWNpZXMgdGhlIGNociAob3Igc2VxX3JlZ2lvbikgYmVsb25ncyB0b1xuPGxpPmNociAgICAgOiBUaGUgbmFtZSBvZiB0aGUgY2hyIChvciBzZXFfcmVnaW9uKTwvbGk+XG48L3VsPlxuICAgICAgICAgICAgQHJldHVybnMge3N0cmluZ30gLSBUaGUgdXJsIHRvIHF1ZXJ5IHRoZSBFbnNlbWJsIFJFU1Qgc2VydmVyLiBGb3IgYW4gZXhhbXBsZSBvZiBvdXRwdXQgb2YgdGhlc2UgdXJscyBzZWUgdGhlIHtAbGluayBodHRwOi8vYmV0YS5yZXN0LmVuc2VtYmwub3JnL2Fzc2VtYmx5L2luZm8vaG9tb19zYXBpZW5zLzEzLmpzb24/Zm9ybWF0PWZ1bGx8RW5zZW1ibCBSRVNUIEFQSSBleGFtcGxlfVxuXHQgICAgQGV4YW1wbGVcbmVSZXN0LmNhbGwgKCB1cmwgICAgIDogZVJlc3QudXJsLmNocl9pbmZvICh7IHNwZWNpZXMgOiBcImhvbW9fc2FwaWVuc1wiLCBjaHIgOiBcIjEzXCIgfSksXG4gICAgICAgICAgICAgc3VjY2VzcyA6IGNhbGxiYWNrLFxuICAgICAgICAgICAgIGVycm9yICAgOiBjYWxsYmFja1xuXHQgICApO1xuXHQgKi9cbiAgICB1cmxfYXBpLm1ldGhvZCAoJ2Nocl9pbmZvJywgZnVuY3Rpb24ob2JqKSB7XG5cdHJldHVybiBwcmVmaXhfY2hyX2luZm8gK1xuXHQgICAgb2JqLnNwZWNpZXMgK1xuXHQgICAgXCIvXCIgK1xuXHQgICAgb2JqLmNociArXG5cdCAgICBcIi5qc29uP2Zvcm1hdD1mdWxsXCI7XG4gICAgfSk7XG5cblx0Ly8gVE9ETzogRm9yIG5vdywgaXQgb25seSB3b3JrcyB3aXRoIHNwZWNpZXNfc2V0IGFuZCBub3Qgc3BlY2llc19zZXRfZ3JvdXBzXG5cdC8vIFNob3VsZCBiZSBleHRlbmRlZCBmb3Igd2lkZXIgdXNlXG4gICAgdXJsX2FwaS5tZXRob2QgKCdhbG5fYmxvY2snLCBmdW5jdGlvbiAob2JqKSB7XG5cdHZhciB1cmwgPSBwcmVmaXhfYWxuX3JlZ2lvbiArIFxuXHQgICAgb2JqLnNwZWNpZXMgK1xuXHQgICAgXCIvXCIgK1xuXHQgICAgb2JqLmNociArXG5cdCAgICBcIjpcIiArXG5cdCAgICBvYmouZnJvbSArXG5cdCAgICBcIi1cIiArXG5cdCAgICBvYmoudG8gK1xuXHQgICAgXCIuanNvbj9tZXRob2Q9XCIgK1xuXHQgICAgb2JqLm1ldGhvZDtcblxuXHRmb3IgKHZhciBpPTA7IGk8b2JqLnNwZWNpZXNfc2V0Lmxlbmd0aDsgaSsrKSB7XG5cdCAgICB1cmwgKz0gXCImc3BlY2llc19zZXQ9XCIgKyBvYmouc3BlY2llc19zZXRbaV07XG5cdH1cblxuXHRyZXR1cm4gdXJsO1xuICAgIH0pO1xuXG4gICAgdXJsX2FwaS5tZXRob2QgKCdnZW5lX3RyZWUnLCBmdW5jdGlvbiAob2JqKSB7XG5cdHJldHVybiBwcmVmaXhfZ2VuZV90cmVlICtcblx0ICAgIG9iai5pZCArIFxuXHQgICAgXCIuanNvbj9zZXF1ZW5jZT1cIiArXG5cdCAgICAoKG9iai5zZXF1ZW5jZSB8fCBvYmouYWxpZ25lZCkgPyAxIDogXCJub25lXCIpICtcblx0ICAgIChvYmouYWxpZ25lZCA/ICcmYWxpZ25lZD0xJyA6ICcnKTtcbiAgICB9KTtcblxuICAgIHVybF9hcGkubWV0aG9kKCdhc3NlbWJseScsIGZ1bmN0aW9uIChvYmopIHtcblx0cmV0dXJuIHByZWZpeF9hc3NlbWJseSArIFxuXHQgICAgb2JqLnNwZWNpZXMgK1xuXHQgICAgXCIuanNvblwiO1xuICAgIH0pO1xuXG5cbiAgICBhcGkubWV0aG9kICgnY29ubmVjdGlvbnMnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIGNvbm5lY3Rpb25zO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVSZXN0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gdG50X2VSZXN0O1xuIl19
