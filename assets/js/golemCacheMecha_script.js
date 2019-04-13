/**
 * @file: golemCacheMecha_script.js
 * @description: (module) persistent caching for scripts (js,css,xml,yaml,json)
 * @license: MIT
 * @author: Loouis Low <loouis@gmail.com>
 * @copyright: Loouis Low (https://github.com/loouislow81/golem-sdk)
 */

function asynchronous_adapter() {
  // RSVP (https://github.com/tildeio/rsvp.js/)
  !function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.RSVP={})}(this,function(t){"use strict";function e(t){var e=t._promiseCallbacks;return e||(e=t._promiseCallbacks={}),e}var r={mixin:function(t){return t.on=this.on,t.off=this.off,t.trigger=this.trigger,t._promiseCallbacks=void 0,t},on:function(t,r){if("function"!=typeof r)throw new TypeError("Callback must be a function");var n=e(this),o=void 0;(o=n[t])||(o=n[t]=[]),o.indexOf(r)&&o.push(r)},off:function(t,r){var n,o=e(this),i=void 0;r?-1!==(n=(i=o[t]).indexOf(r))&&i.splice(n,1):o[t]=[]},trigger:function(t,r,n){var o;if(o=e(this)[t])for(var i=0;i<o.length;i++)(0,o[i])(r,n)}},n={instrument:!1};function o(t,e){if(2!==arguments.length)return n[t];n[t]=e}r.mixin(n);var i=[];function s(t,e,r){1===i.push({name:t,payload:{key:e._guidKey,id:e._id,eventName:t,detail:e._result,childId:r&&r._id,label:e._label,timeStamp:Date.now(),error:n["instrument-with-stack"]?new Error(e._label):null}})&&setTimeout(function(){for(var t=0;t<i.length;t++){var e=i[t],r=e.payload;r.guid=r.key+r.id,r.childGuid=r.key+r.childId,r.error&&(r.stack=r.error.stack),n.trigger(e.name,e.payload)}i.length=0},50)}function u(t,e){if(t&&"object"==typeof t&&t.constructor===this)return t;var r=new this(a,e);return m(r,t),r}function a(){}var c=void 0,l=1,f=2,h={error:null};function p(t){try{return t.then}catch(t){return h.error=t,h}}var y=void 0;function _(){try{var t=y;return y=null,t.apply(this,arguments)}catch(t){return h.error=t,h}}function v(t){return y=t,_}function d(t,e,r){if(e.constructor===t.constructor&&r===E&&t.constructor.resolve===u)!function(t,e){e._state===l?w(t,e._result):e._state===f?(e._onError=null,g(t,e._result)):j(e,void 0,function(r){e===r?w(t,r):m(t,r)},function(e){return g(t,e)})}(t,e);else if(r===h){var o=h.error;h.error=null,g(t,o)}else"function"==typeof r?function(t,e,r){n.async(function(t){var n=!1,o=v(r).call(e,function(r){n||(n=!0,e===r?w(t,r):m(t,r))},function(e){n||(n=!0,g(t,e))},"Settle: "+(t._label||" unknown promise"));if(!n&&o===h){n=!0;var i=h.error;h.error=null,g(t,i)}},t)}(t,e,r):w(t,e)}function m(t,e){var r,n;t===e?w(t,e):(n=typeof(r=e),null===r||"object"!==n&&"function"!==n?w(t,e):d(t,e,p(e)))}function b(t){t._onError&&t._onError(t._result),O(t)}function w(t,e){t._state===c&&(t._result=e,t._state=l,0===t._subscribers.length?n.instrument&&s("fulfilled",t):n.async(O,t))}function g(t,e){t._state===c&&(t._state=f,t._result=e,n.async(b,t))}function j(t,e,r,o){var i=t._subscribers,s=i.length;t._onError=null,i[s]=e,i[s+l]=r,i[s+f]=o,0===s&&t._state&&n.async(O,t)}function O(t){var e=t._subscribers,r=t._state;if(n.instrument&&s(r===l?"fulfilled":"rejected",t),0!==e.length){for(var o=void 0,i=void 0,u=t._result,a=0;a<e.length;a+=3)o=e[a],i=e[a+r],o?A(r,o,i,u):i(u);t._subscribers.length=0}}function A(t,e,r,n){var o="function"==typeof r,i=void 0;if(i=o?v(r)(n):n,e._state!==c);else if(i===e)g(e,new TypeError("A promises callback cannot return that same promise."));else if(i===h){var s=h.error;h.error=null,g(e,s)}else o?m(e,i):t===l?w(e,i):t===f&&g(e,i)}function E(t,e,r){var o=this._state;if(o===l&&!t||o===f&&!e)return n.instrument&&s("chained",this,this),this;this._onError=null;var i=new this.constructor(a,r),u=this._result;if(n.instrument&&s("chained",this,i),o===c)j(this,i,t,e);else{var h=o===l?t:e;n.async(function(){return A(o,i,h,u)})}return i}var T=function(){function t(t,e,r,n){this._instanceConstructor=t,this.promise=new t(a,n),this._abortOnReject=r,this._isUsingOwnPromise=t===x,this._isUsingOwnResolve=t.resolve===u,this._init.apply(this,arguments)}return t.prototype._init=function(t,e){var r=e.length||0;this.length=r,this._remaining=r,this._result=new Array(r),this._enumerate(e)},t.prototype._enumerate=function(t){for(var e=this.length,r=this.promise,n=0;r._state===c&&n<e;n++)this._eachEntry(t[n],n,!0);this._checkFullfillment()},t.prototype._checkFullfillment=function(){0===this._remaining&&w(this.promise,this._result)},t.prototype._settleMaybeThenable=function(t,e,r){var n=this._instanceConstructor;if(this._isUsingOwnResolve){var o=p(t);if(o===E&&t._state!==c)t._onError=null,this._settledAt(t._state,e,t._result,r);else if("function"!=typeof o)this._settledAt(l,e,t,r);else if(this._isUsingOwnPromise){var i=new n(a);d(i,t,o),this._willSettleAt(i,e,r)}else this._willSettleAt(new n(function(e){return e(t)}),e,r)}else this._willSettleAt(n.resolve(t),e,r)},t.prototype._eachEntry=function(t,e,r){null!==t&&"object"==typeof t?this._settleMaybeThenable(t,e,r):this._setResultAt(l,e,t,r)},t.prototype._settledAt=function(t,e,r,n){var o=this.promise;o._state===c&&(this._abortOnReject&&t===f?g(o,r):(this._setResultAt(t,e,r,n),this._checkFullfillment()))},t.prototype._setResultAt=function(t,e,r,n){this._remaining--,this._result[e]=r},t.prototype._willSettleAt=function(t,e,r){var n=this;j(t,void 0,function(t){return n._settledAt(l,e,t,r)},function(t){return n._settledAt(f,e,t,r)})},t}();function P(t,e,r){this._remaining--,this._result[e]=t===l?{state:"fulfilled",value:r}:{state:"rejected",reason:r}}var S="rsvp_"+Date.now()+"-",R=0;var x=function(){function t(e,r){this._id=R++,this._label=r,this._state=void 0,this._result=void 0,this._subscribers=[],n.instrument&&s("created",this),a!==e&&("function"!=typeof e&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof t?function(t,e){var r=!1;try{e(function(e){r||(r=!0,m(t,e))},function(e){r||(r=!0,g(t,e))})}catch(e){g(t,e)}}(this,e):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}return t.prototype._onError=function(t){var e=this;n.after(function(){e._onError&&n.trigger("error",t,e._label)})},t.prototype.catch=function(t,e){return this.then(void 0,t,e)},t.prototype.finally=function(t,e){var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})},e)},t}();function k(t,e){return{then:function(r,n){return t.call(e,r,n)}}}function M(t,e){var r=function(){for(var r=arguments.length,n=new Array(r+1),o=!1,i=0;i<r;++i){var s=arguments[i];if(!o){if((o=F(s))===h){var u=h.error;h.error=null;var c=new x(a);return g(c,u),c}o&&!0!==o&&(s=k(o,s))}n[i]=s}var l=new x(a);return n[r]=function(t,r){t?g(l,t):void 0===e?m(l,r):!0===e?m(l,function(t){for(var e=t.length,r=new Array(e-1),n=1;n<e;n++)r[n-1]=t[n];return r}(arguments)):Array.isArray(e)?m(l,function(t,e){for(var r={},n=t.length,o=new Array(n),i=0;i<n;i++)o[i]=t[i];for(var s=0;s<e.length;s++)r[e[s]]=o[s+1];return r}(arguments,e)):m(l,r)},o?function(t,e,r,n){return x.all(e).then(function(e){return C(t,e,r,n)})}(l,n,t,this):C(l,n,t,this)};return r.__proto__=t,r}function C(t,e,r,n){if(v(r).apply(n,e)===h){var o=h.error;h.error=null,g(t,o)}return t}function F(t){return null!==t&&"object"==typeof t&&(t.constructor===x||p(t))}function I(t,e){return x.all(t,e)}x.all=function(t,e){return Array.isArray(t)?new T(this,t,!0,e).promise:this.reject(new TypeError("Promise.all must be called with an array"),e)},x.race=function(t,e){var r=new this(a,e);if(!Array.isArray(t))return g(r,new TypeError("Promise.race must be called with an array")),r;for(var n=0;r._state===c&&n<t.length;n++)j(this.resolve(t[n]),void 0,function(t){return m(r,t)},function(t){return g(r,t)});return r},x.resolve=u,x.reject=function(t,e){var r=new this(a,e);return g(r,t),r},x.prototype._guidKey=S,x.prototype.then=E;var N=function(t){function e(e,r,n){return function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,e,r,!1,n))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e}(T);function U(t,e){return Array.isArray(t)?new N(x,t,e).promise:x.reject(new TypeError("Promise.allSettled must be called with an array"),e)}function V(t,e){return x.race(t,e)}N.prototype._setResultAt=P;var D=Object.prototype.hasOwnProperty,K=function(t){function e(e,r){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],o=arguments[3];return function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,e,r,n,o))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e.prototype._init=function(t,e){this._result={},this._enumerate(e),0===this._remaining&&w(this.promise,this._result)},e.prototype._enumerate=function(t){var e=this.promise,r=[];for(var n in t)D.call(t,n)&&r.push({position:n,entry:t[n]});var o=r.length;this._remaining=o;for(var i=void 0,s=0;e._state===c&&s<o;s++)i=r[s],this._eachEntry(i.entry,i.position)},e}(T);function q(t,e){return null===t||"object"!=typeof t?x.reject(new TypeError("Promise.hash must be called with an object"),e):new K(x,t,e).promise}var G=function(t){function e(e,r,n){return function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,e,r,!1,n))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e}(K);function L(t,e){return null===t||"object"!=typeof t?x.reject(new TypeError("RSVP.hashSettled must be called with an object"),e):new G(x,t,!1,e).promise}function W(t){throw setTimeout(function(){throw t}),t}function Y(t){var e={resolve:void 0,reject:void 0};return e.promise=new x(function(t,r){e.resolve=t,e.reject=r},t),e}G.prototype._setResultAt=P;var $=function(t){function e(e,r,n,o){return function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,e,r,!0,o,n))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e.prototype._init=function(t,e,r,n,o){var i=e.length||0;this.length=i,this._remaining=i,this._result=new Array(i),this._mapFn=o,this._enumerate(e)},e.prototype._setResultAt=function(t,e,r,n){if(n){var o=v(this._mapFn)(r,e);o===h?this._settledAt(f,e,o.error,!1):this._eachEntry(o,e,!1)}else this._remaining--,this._result[e]=r},e}(T);function z(t,e,r){return Array.isArray(t)?"function"!=typeof e?x.reject(new TypeError("RSVP.map expects a function as a second argument"),r):new $(x,t,e,r).promise:x.reject(new TypeError("RSVP.map must be called with an array"),r)}function B(t,e){return x.resolve(t,e)}function H(t,e){return x.reject(t,e)}var J={},Q=function(t){function e(e,r,n,o){return function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,e,r,!0,o,n))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e.prototype._init=function(t,e,r,n,o){var i=e.length||0;this.length=i,this._remaining=i,this._result=new Array(i),this._filterFn=o,this._enumerate(e)},e.prototype._checkFullfillment=function(){0===this._remaining&&(this._result=this._result.filter(function(t){return t!==J}),w(this.promise,this._result))},e.prototype._setResultAt=function(t,e,r,n){if(n){this._result[e]=r;var o=v(this._filterFn)(r,e);o===h?this._settledAt(f,e,o.error,!1):this._eachEntry(o,e,!1)}else this._remaining--,r||(this._result[e]=J)},e}(T);function X(t,e,r){return"function"!=typeof e?x.reject(new TypeError("RSVP.filter expects function as a second argument"),r):x.resolve(t,r).then(function(t){if(!Array.isArray(t))throw new TypeError("RSVP.filter must be called with an array");return new Q(x,t,e,r).promise})}var Z=0,tt=void 0;function et(t,e){at[Z]=t,at[Z+1]=e,2===(Z+=2)&&dt()}var rt="undefined"!=typeof window?window:void 0,nt=rt||{},ot=nt.MutationObserver||nt.WebKitMutationObserver,it="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),st="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel;function ut(){return function(){return setTimeout(ct,1)}}var at=new Array(1e3);function ct(){for(var t=0;t<Z;t+=2){(0,at[t])(at[t+1]),at[t]=void 0,at[t+1]=void 0}Z=0}var lt,ft,ht,pt,yt,_t,vt,dt=void 0;function mt(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}it?(yt=process.nextTick,_t=process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/),Array.isArray(_t)&&"0"===_t[1]&&"10"===_t[2]&&(yt=setImmediate),dt=function(){return yt(ct)}):ot?(ft=0,ht=new ot(ct),pt=document.createTextNode(""),ht.observe(pt,{characterData:!0}),dt=function(){return pt.data=ft=++ft%2}):st?((lt=new MessageChannel).port1.onmessage=ct,dt=function(){return lt.port2.postMessage(0)}):dt=void 0===rt&&"function"==typeof require?function(){try{var t=require("vertx");return void 0!==(tt=t.runOnLoop||t.runOnContext)?function(){tt(ct)}:ut()}catch(t){return ut()}}():ut(),n.async=et,n.after=function(t){return setTimeout(t,0)};var bt=function(t,e){return n.async(t,e)};function wt(){n.on.apply(n,arguments)}function gt(){n.off.apply(n,arguments)}if("undefined"!=typeof window&&"object"==typeof window.__PROMISE_INSTRUMENTATION__){var jt=window.__PROMISE_INSTRUMENTATION__;for(var Ot in o("instrument",!0),jt)jt.hasOwnProperty(Ot)&&wt(Ot,jt[Ot])}var At=(mt(vt={asap:et,Promise:x,EventTarget:r,all:I,allSettled:U,race:V,hash:q,hashSettled:L,rethrow:W,defer:Y,denodeify:M,configure:o,on:wt,off:gt,resolve:B,reject:H,map:z},"async",bt),mt(vt,"filter",X),vt);t.default=At,t.asap=et,t.Promise=x,t.EventTarget=r,t.all=I,t.allSettled=U,t.race=V,t.hash=q,t.hashSettled=L,t.rethrow=W,t.defer=Y,t.denodeify=M,t.configure=o,t.on=wt,t.off=gt,t.resolve=B,t.reject=H,t.map=z,t.async=bt,t.filter=X,Object.defineProperty(t,"__esModule",{value:!0})});
};

(function (window, document) {

  'use strict';

  // init 3rd-party library (RSVP)
  asynchronous_adapter();

  var head = document.head || document.getElementsByTagName('head')[0];
  var storagePrefix = 'golemCacheMecha-';
  var defaultExpiration = 5000;
  var addStash = [];

  var createNewStash = function (key, storeObj) {
    try {
      localStorage.setItem(storagePrefix + key, JSON.stringify(storeObj));
      return true;
    }
    catch (e) {
      if (e.name.toUpperCase().indexOf('QUOTA') >= 0) {
        var item;
        var tempScripts = [];

        for (item in localStorage) {
          if (item.indexOf(storagePrefix) === 0) {

            tempScripts.push(JSON.parse(localStorage[item]));
          }
        }

        if (tempScripts.length) {
          tempScripts.sort(function (a, b) {
            return a.stamp - b.stamp;
          });

          golemCacheMecha.remove(tempScripts[0].key);

          return createNewStash(key, storeObj);

        }
        else {
          // no files to remove. Larger than available quota
          return;
        }

      }
      else {
        // some other error
        return;
      }
    }

  };

  var getUrl = function (url) {
    var promise = new RSVP.Promise(function (resolve, reject) {

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if ((xhr.status === 200) ||
            ((xhr.status === 0) && xhr.responseText)) {
            resolve({
              content: xhr.responseText,
              type: xhr.getResponseHeader('content-type')
            });
          }
          else {
            reject(new Error(xhr.statusText));
          }
        }
      };

      // By default XHRs never timeout, and even Chrome doesn't implement the
      // spec for xhr.timeout. So we do it ourselves.
      setTimeout(function () {
        if (xhr.readyState < 4) {
          xhr.abort();
        }
      }, golemCacheMecha.timeout);

      xhr.send();
    });

    return promise;
  };

  var saveUrl = function (obj) {
    return getUrl(obj.url).then(function (result) {
      var storeObj = wrapStoreData(obj, result);

      if (!obj.skipCache) {
        createNewStash(obj.key, storeObj);
      }

      return storeObj;
    });
  };

  var wrapStoreData = function (obj, data) {
    var now = +new Date();
    obj.data = data.content;
    obj.originalType = data.type;
    obj.type = obj.type || data.type;
    obj.skipCache = obj.skipCache || false;
    obj.stamp = now;
    obj.expire = now + ((obj.expire || defaultExpiration) * 60 * 60 * 1000);

    return obj;
  };

  var isCacheValid = function (source, obj) {
    return !source ||
      source.expire - +new Date() < 0 ||
      obj.unique !== source.unique ||
      (golemCacheMecha.isValidItem && !golemCacheMecha.isValidItem(source, obj));
  };

  var handleStackObject = function (obj) {
    var source, promise, shouldFetch;

    if (!obj.url) {
      return;
    }

    obj.key = (obj.key || obj.url);
    source = golemCacheMecha.get(obj.key);

    obj.execute = obj.execute !== false;

    shouldFetch = isCacheValid(source, obj);

    if (obj.live || shouldFetch) {
      if (obj.unique) {
        // set parameter to prevent browser cache
        obj.url += ((obj.url.indexOf('?') > 0) ? '&' : '?') + 'golemCacheMecha-unique=' + obj.unique;
      }
      promise = saveUrl(obj);

      if (obj.live && !shouldFetch) {
        promise = promise
          .then(function (result) {
            // If we succeed, just return the value
            // RSVP doesn't have a .fail convenience method
            return result;
          }, function () {
            return source;
          });
      }
    }
    else {
      source.type = obj.type || source.originalType;
      source.execute = obj.execute;
      promise = new RSVP.Promise(function (resolve) {
        resolve(source);
      });
    }

    return promise;
  };

  var injectScript = function (obj) {
    var script = document.createElement('script');
    script.defer = true;
    // Have to use .text, since we support IE8,
    // which won't allow appending to a script
    script.text = obj.data;
    head.appendChild(script);
  };

  var handlers = {
    'default': injectScript
  };

  var execute = function (obj) {
    if (obj.type && handlers[obj.type]) {
      return handlers[obj.type](obj);
    }

    return handlers['default'](obj); // 'default' is a reserved word
  };

  var performActions = function (resources) {
    return resources.map(function (obj) {
      if (obj.execute) {
        execute(obj);
      }

      return obj;
    });
  };

  var fetch = function () {
    var i, l, promises = [];

    for (i = 0, l = arguments.length; i < l; i++) {
      promises.push(handleStackObject(arguments[i]));
    }

    return RSVP.all(promises);
  };

  var thenRequire = function () {
    var resources = fetch.apply(null, arguments);
    var promise = this.then(function () {
      return resources;
    }).then(performActions);
    promise.thenRequire = thenRequire;
    return promise;
  };

  window.golemCacheMecha = {
    add: function () {
      for (var a = 0, l = arguments.length; a < l; a++) {
        arguments[a].execute = arguments[a].execute !== false;

        if (arguments[a].once && addStash.indexOf(arguments[a].url) >= 0) {
          arguments[a].execute = false;
        }
        else if (arguments[a].execute !== false && addStash.indexOf(arguments[a].url) < 0) {
          addStash.push(arguments[a].url);
        }
      }

      var promise = fetch.apply(null, arguments).then(performActions);

      promise.thenRequire = thenRequire;
      console.log('INFO: GolemCacheMecha initializing');
      console.log('INFO: Store assets to folder: /' + storagePrefix);
      return promise;
    },

    remove: function (key) {
      localStorage.removeItem(storagePrefix + key);
      return this;
    },

    get: function (key) {
      var item = localStorage.getItem(storagePrefix + key);
      try {
        return JSON.parse(item || 'false');
      }
      catch (e) {
        return false;
      }
    },

    clear: function (expired) {
      var item, key;
      var now = +new Date();

      for (item in localStorage) {
        key = item.split(storagePrefix)[1];
        if (key && (!expired || this.get(key).expire <= now)) {
          this.remove(key);
        }
      }

      return this;
    },

    isValidItem: null,

    timeout: 5000,

    addHandler: function (types, handler) {
      if (!Array.isArray(types)) {
        types = [types];
      }
      types.forEach(function (type) {
        handlers[type] = handler;
      });
    },

    removeHandler: function (types) {
      golemCacheMecha.addHandler(types, undefined);
    }
  };

  // delete expired keys
  golemCacheMecha.clear(true);

})(this, document);
