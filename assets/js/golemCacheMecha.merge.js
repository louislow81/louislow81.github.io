/**
 * @file: golem_stash.js
 * @description: all purpose persistent local caching mechanism
 * @license: MIT
 * @author: Loouis Low <loouis@gmail.com>
 * @copyright: Loouis Low (https://github.com/loouislow81/golem-sdk)
 */

function asynchronous_adapter() {
  !function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.RSVP={})}(this,function(t){"use strict";function e(t){var e=t._promiseCallbacks;return e||(e=t._promiseCallbacks={}),e}var r={mixin:function(t){return t.on=this.on,t.off=this.off,t.trigger=this.trigger,t._promiseCallbacks=void 0,t},on:function(t,r){if("function"!=typeof r)throw new TypeError("Callback must be a function");var n=e(this),o=void 0;(o=n[t])||(o=n[t]=[]),o.indexOf(r)&&o.push(r)},off:function(t,r){var n,o=e(this),i=void 0;r?-1!==(n=(i=o[t]).indexOf(r))&&i.splice(n,1):o[t]=[]},trigger:function(t,r,n){var o;if(o=e(this)[t])for(var i=0;i<o.length;i++)(0,o[i])(r,n)}},n={instrument:!1};function o(t,e){if(2!==arguments.length)return n[t];n[t]=e}r.mixin(n);var i=[];function s(t,e,r){1===i.push({name:t,payload:{key:e._guidKey,id:e._id,eventName:t,detail:e._result,childId:r&&r._id,label:e._label,timeStamp:Date.now(),error:n["instrument-with-stack"]?new Error(e._label):null}})&&setTimeout(function(){for(var t=0;t<i.length;t++){var e=i[t],r=e.payload;r.guid=r.key+r.id,r.childGuid=r.key+r.childId,r.error&&(r.stack=r.error.stack),n.trigger(e.name,e.payload)}i.length=0},50)}function u(t,e){if(t&&"object"==typeof t&&t.constructor===this)return t;var r=new this(a,e);return m(r,t),r}function a(){}var c=void 0,l=1,f=2,h={error:null};function p(t){try{return t.then}catch(t){return h.error=t,h}}var y=void 0;function _(){try{var t=y;return y=null,t.apply(this,arguments)}catch(t){return h.error=t,h}}function v(t){return y=t,_}function d(t,e,r){if(e.constructor===t.constructor&&r===E&&t.constructor.resolve===u)!function(t,e){e._state===l?w(t,e._result):e._state===f?(e._onError=null,g(t,e._result)):j(e,void 0,function(r){e===r?w(t,r):m(t,r)},function(e){return g(t,e)})}(t,e);else if(r===h){var o=h.error;h.error=null,g(t,o)}else"function"==typeof r?function(t,e,r){n.async(function(t){var n=!1,o=v(r).call(e,function(r){n||(n=!0,e===r?w(t,r):m(t,r))},function(e){n||(n=!0,g(t,e))},"Settle: "+(t._label||" unknown promise"));if(!n&&o===h){n=!0;var i=h.error;h.error=null,g(t,i)}},t)}(t,e,r):w(t,e)}function m(t,e){var r,n;t===e?w(t,e):(n=typeof(r=e),null===r||"object"!==n&&"function"!==n?w(t,e):d(t,e,p(e)))}function b(t){t._onError&&t._onError(t._result),O(t)}function w(t,e){t._state===c&&(t._result=e,t._state=l,0===t._subscribers.length?n.instrument&&s("fulfilled",t):n.async(O,t))}function g(t,e){t._state===c&&(t._state=f,t._result=e,n.async(b,t))}function j(t,e,r,o){var i=t._subscribers,s=i.length;t._onError=null,i[s]=e,i[s+l]=r,i[s+f]=o,0===s&&t._state&&n.async(O,t)}function O(t){var e=t._subscribers,r=t._state;if(n.instrument&&s(r===l?"fulfilled":"rejected",t),0!==e.length){for(var o=void 0,i=void 0,u=t._result,a=0;a<e.length;a+=3)o=e[a],i=e[a+r],o?A(r,o,i,u):i(u);t._subscribers.length=0}}function A(t,e,r,n){var o="function"==typeof r,i=void 0;if(i=o?v(r)(n):n,e._state!==c);else if(i===e)g(e,new TypeError("A promises callback cannot return that same promise."));else if(i===h){var s=h.error;h.error=null,g(e,s)}else o?m(e,i):t===l?w(e,i):t===f&&g(e,i)}function E(t,e,r){var o=this._state;if(o===l&&!t||o===f&&!e)return n.instrument&&s("chained",this,this),this;this._onError=null;var i=new this.constructor(a,r),u=this._result;if(n.instrument&&s("chained",this,i),o===c)j(this,i,t,e);else{var h=o===l?t:e;n.async(function(){return A(o,i,h,u)})}return i}var T=function(){function t(t,e,r,n){this._instanceConstructor=t,this.promise=new t(a,n),this._abortOnReject=r,this._isUsingOwnPromise=t===x,this._isUsingOwnResolve=t.resolve===u,this._init.apply(this,arguments)}return t.prototype._init=function(t,e){var r=e.length||0;this.length=r,this._remaining=r,this._result=new Array(r),this._enumerate(e)},t.prototype._enumerate=function(t){for(var e=this.length,r=this.promise,n=0;r._state===c&&n<e;n++)this._eachEntry(t[n],n,!0);this._checkFullfillment()},t.prototype._checkFullfillment=function(){0===this._remaining&&w(this.promise,this._result)},t.prototype._settleMaybeThenable=function(t,e,r){var n=this._instanceConstructor;if(this._isUsingOwnResolve){var o=p(t);if(o===E&&t._state!==c)t._onError=null,this._settledAt(t._state,e,t._result,r);else if("function"!=typeof o)this._settledAt(l,e,t,r);else if(this._isUsingOwnPromise){var i=new n(a);d(i,t,o),this._willSettleAt(i,e,r)}else this._willSettleAt(new n(function(e){return e(t)}),e,r)}else this._willSettleAt(n.resolve(t),e,r)},t.prototype._eachEntry=function(t,e,r){null!==t&&"object"==typeof t?this._settleMaybeThenable(t,e,r):this._setResultAt(l,e,t,r)},t.prototype._settledAt=function(t,e,r,n){var o=this.promise;o._state===c&&(this._abortOnReject&&t===f?g(o,r):(this._setResultAt(t,e,r,n),this._checkFullfillment()))},t.prototype._setResultAt=function(t,e,r,n){this._remaining--,this._result[e]=r},t.prototype._willSettleAt=function(t,e,r){var n=this;j(t,void 0,function(t){return n._settledAt(l,e,t,r)},function(t){return n._settledAt(f,e,t,r)})},t}();function P(t,e,r){this._remaining--,this._result[e]=t===l?{state:"fulfilled",value:r}:{state:"rejected",reason:r}}var S="rsvp_"+Date.now()+"-",R=0;var x=function(){function t(e,r){this._id=R++,this._label=r,this._state=void 0,this._result=void 0,this._subscribers=[],n.instrument&&s("created",this),a!==e&&("function"!=typeof e&&function(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}(),this instanceof t?function(t,e){var r=!1;try{e(function(e){r||(r=!0,m(t,e))},function(e){r||(r=!0,g(t,e))})}catch(e){g(t,e)}}(this,e):function(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}())}return t.prototype._onError=function(t){var e=this;n.after(function(){e._onError&&n.trigger("error",t,e._label)})},t.prototype.catch=function(t,e){return this.then(void 0,t,e)},t.prototype.finally=function(t,e){var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})},e)},t}();function k(t,e){return{then:function(r,n){return t.call(e,r,n)}}}function M(t,e){var r=function(){for(var r=arguments.length,n=new Array(r+1),o=!1,i=0;i<r;++i){var s=arguments[i];if(!o){if((o=F(s))===h){var u=h.error;h.error=null;var c=new x(a);return g(c,u),c}o&&!0!==o&&(s=k(o,s))}n[i]=s}var l=new x(a);return n[r]=function(t,r){t?g(l,t):void 0===e?m(l,r):!0===e?m(l,function(t){for(var e=t.length,r=new Array(e-1),n=1;n<e;n++)r[n-1]=t[n];return r}(arguments)):Array.isArray(e)?m(l,function(t,e){for(var r={},n=t.length,o=new Array(n),i=0;i<n;i++)o[i]=t[i];for(var s=0;s<e.length;s++)r[e[s]]=o[s+1];return r}(arguments,e)):m(l,r)},o?function(t,e,r,n){return x.all(e).then(function(e){return C(t,e,r,n)})}(l,n,t,this):C(l,n,t,this)};return r.__proto__=t,r}function C(t,e,r,n){if(v(r).apply(n,e)===h){var o=h.error;h.error=null,g(t,o)}return t}function F(t){return null!==t&&"object"==typeof t&&(t.constructor===x||p(t))}function I(t,e){return x.all(t,e)}x.all=function(t,e){return Array.isArray(t)?new T(this,t,!0,e).promise:this.reject(new TypeError("Promise.all must be called with an array"),e)},x.race=function(t,e){var r=new this(a,e);if(!Array.isArray(t))return g(r,new TypeError("Promise.race must be called with an array")),r;for(var n=0;r._state===c&&n<t.length;n++)j(this.resolve(t[n]),void 0,function(t){return m(r,t)},function(t){return g(r,t)});return r},x.resolve=u,x.reject=function(t,e){var r=new this(a,e);return g(r,t),r},x.prototype._guidKey=S,x.prototype.then=E;var N=function(t){function e(e,r,n){return function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,e,r,!1,n))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e}(T);function U(t,e){return Array.isArray(t)?new N(x,t,e).promise:x.reject(new TypeError("Promise.allSettled must be called with an array"),e)}function V(t,e){return x.race(t,e)}N.prototype._setResultAt=P;var D=Object.prototype.hasOwnProperty,K=function(t){function e(e,r){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],o=arguments[3];return function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,e,r,n,o))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e.prototype._init=function(t,e){this._result={},this._enumerate(e),0===this._remaining&&w(this.promise,this._result)},e.prototype._enumerate=function(t){var e=this.promise,r=[];for(var n in t)D.call(t,n)&&r.push({position:n,entry:t[n]});var o=r.length;this._remaining=o;for(var i=void 0,s=0;e._state===c&&s<o;s++)i=r[s],this._eachEntry(i.entry,i.position)},e}(T);function q(t,e){return null===t||"object"!=typeof t?x.reject(new TypeError("Promise.hash must be called with an object"),e):new K(x,t,e).promise}var G=function(t){function e(e,r,n){return function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,e,r,!1,n))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e}(K);function L(t,e){return null===t||"object"!=typeof t?x.reject(new TypeError("RSVP.hashSettled must be called with an object"),e):new G(x,t,!1,e).promise}function W(t){throw setTimeout(function(){throw t}),t}function Y(t){var e={resolve:void 0,reject:void 0};return e.promise=new x(function(t,r){e.resolve=t,e.reject=r},t),e}G.prototype._setResultAt=P;var $=function(t){function e(e,r,n,o){return function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,e,r,!0,o,n))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e.prototype._init=function(t,e,r,n,o){var i=e.length||0;this.length=i,this._remaining=i,this._result=new Array(i),this._mapFn=o,this._enumerate(e)},e.prototype._setResultAt=function(t,e,r,n){if(n){var o=v(this._mapFn)(r,e);o===h?this._settledAt(f,e,o.error,!1):this._eachEntry(o,e,!1)}else this._remaining--,this._result[e]=r},e}(T);function z(t,e,r){return Array.isArray(t)?"function"!=typeof e?x.reject(new TypeError("RSVP.map expects a function as a second argument"),r):new $(x,t,e,r).promise:x.reject(new TypeError("RSVP.map must be called with an array"),r)}function B(t,e){return x.resolve(t,e)}function H(t,e){return x.reject(t,e)}var J={},Q=function(t){function e(e,r,n,o){return function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}(this,t.call(this,e,r,!0,o,n))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}(e,t),e.prototype._init=function(t,e,r,n,o){var i=e.length||0;this.length=i,this._remaining=i,this._result=new Array(i),this._filterFn=o,this._enumerate(e)},e.prototype._checkFullfillment=function(){0===this._remaining&&(this._result=this._result.filter(function(t){return t!==J}),w(this.promise,this._result))},e.prototype._setResultAt=function(t,e,r,n){if(n){this._result[e]=r;var o=v(this._filterFn)(r,e);o===h?this._settledAt(f,e,o.error,!1):this._eachEntry(o,e,!1)}else this._remaining--,r||(this._result[e]=J)},e}(T);function X(t,e,r){return"function"!=typeof e?x.reject(new TypeError("RSVP.filter expects function as a second argument"),r):x.resolve(t,r).then(function(t){if(!Array.isArray(t))throw new TypeError("RSVP.filter must be called with an array");return new Q(x,t,e,r).promise})}var Z=0,tt=void 0;function et(t,e){at[Z]=t,at[Z+1]=e,2===(Z+=2)&&dt()}var rt="undefined"!=typeof window?window:void 0,nt=rt||{},ot=nt.MutationObserver||nt.WebKitMutationObserver,it="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),st="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel;function ut(){return function(){return setTimeout(ct,1)}}var at=new Array(1e3);function ct(){for(var t=0;t<Z;t+=2){(0,at[t])(at[t+1]),at[t]=void 0,at[t+1]=void 0}Z=0}var lt,ft,ht,pt,yt,_t,vt,dt=void 0;function mt(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}it?(yt=process.nextTick,_t=process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/),Array.isArray(_t)&&"0"===_t[1]&&"10"===_t[2]&&(yt=setImmediate),dt=function(){return yt(ct)}):ot?(ft=0,ht=new ot(ct),pt=document.createTextNode(""),ht.observe(pt,{characterData:!0}),dt=function(){return pt.data=ft=++ft%2}):st?((lt=new MessageChannel).port1.onmessage=ct,dt=function(){return lt.port2.postMessage(0)}):dt=void 0===rt&&"function"==typeof require?function(){try{var t=require("vertx");return void 0!==(tt=t.runOnLoop||t.runOnContext)?function(){tt(ct)}:ut()}catch(t){return ut()}}():ut(),n.async=et,n.after=function(t){return setTimeout(t,0)};var bt=function(t,e){return n.async(t,e)};function wt(){n.on.apply(n,arguments)}function gt(){n.off.apply(n,arguments)}if("undefined"!=typeof window&&"object"==typeof window.__PROMISE_INSTRUMENTATION__){var jt=window.__PROMISE_INSTRUMENTATION__;for(var Ot in o("instrument",!0),jt)jt.hasOwnProperty(Ot)&&wt(Ot,jt[Ot])}var At=(mt(vt={asap:et,Promise:x,EventTarget:r,all:I,allSettled:U,race:V,hash:q,hashSettled:L,rethrow:W,defer:Y,denodeify:M,configure:o,on:wt,off:gt,resolve:B,reject:H,map:z},"async",bt),mt(vt,"filter",X),vt);t.default=At,t.asap=et,t.Promise=x,t.EventTarget=r,t.all=I,t.allSettled=U,t.race=V,t.hash=q,t.hashSettled=L,t.rethrow=W,t.defer=Y,t.denodeify=M,t.configure=o,t.on=wt,t.off=gt,t.resolve=B,t.reject=H,t.map=z,t.async=bt,t.filter=X,Object.defineProperty(t,"__esModule",{value:!0})});
};

(function( window, document ) {

  'use strict';

  // init 3rd-party library
  asynchronous_adapter();

  var head = document.head || document.getElementsByTagName('head')[0];
  var storagePrefix = 'golemCacheMecha-';
  var defaultExpiration = 5000;
  var addStash = [];

  var addLocalStorage = function( key, storeObj ) {
    try {
      localStorage.setItem( storagePrefix + key, JSON.stringify( storeObj ) );
      return true;
    } catch( e ) {
      if ( e.name.toUpperCase().indexOf('QUOTA') >= 0 ) {
        var item;
        var tempScripts = [];

        for ( item in localStorage ) {
          if ( item.indexOf( storagePrefix ) === 0 ) {
            tempScripts.push( JSON.parse( localStorage[ item ] ) );
          }
        }

        if ( tempScripts.length ) {
          tempScripts.sort(function( a, b ) {
            return a.stamp - b.stamp;
          });

          golemCacheMecha.remove( tempScripts[ 0 ].key );

          return addLocalStorage( key, storeObj );

        } else {
          // no files to remove. Larger than available quota
          return;
        }

      } else {
        // some other error
        return;
      }
    }

  };

  var getUrl = function( url ) {
    var promise = new RSVP.Promise( function( resolve, reject ){

      var xhr = new XMLHttpRequest();
      xhr.open( 'GET', url );

      xhr.onreadystatechange = function() {
        if ( xhr.readyState === 4 ) {
          if ( ( xhr.status === 200 ) ||
              ( ( xhr.status === 0 ) && xhr.responseText ) ) {
            resolve( {
              content: xhr.responseText,
              type: xhr.getResponseHeader('content-type')
            } );
          } else {
            reject( new Error( xhr.statusText ) );
          }
        }
      };

      // By default XHRs never timeout, and even Chrome doesn't implement the
      // spec for xhr.timeout. So we do it ourselves.
      setTimeout( function () {
        if( xhr.readyState < 4 ) {
          xhr.abort();
        }
      }, golemCacheMecha.timeout );

      xhr.send();
    });

    return promise;
  };

  var saveUrl = function( obj ) {
    return getUrl( obj.url ).then( function( result ) {
      var storeObj = wrapStoreData( obj, result );

      if (!obj.skipCache) {
        addLocalStorage( obj.key , storeObj );
      }

      return storeObj;
    });
  };

  var wrapStoreData = function( obj, data ) {
    var now = +new Date();
    obj.data = data.content;
    obj.originalType = data.type;
    obj.type = obj.type || data.type;
    obj.skipCache = obj.skipCache || false;
    obj.stamp = now;
    obj.expire = now + ( ( obj.expire || defaultExpiration ) * 60 * 60 * 1000 );

    return obj;
  };

  var isCacheValid = function(source, obj) {
    return !source ||
      source.expire - +new Date() < 0  ||
      obj.unique !== source.unique ||
      (golemCacheMecha.isValidItem && !golemCacheMecha.isValidItem(source, obj));
  };

  var handleStackObject = function( obj ) {
    var source, promise, shouldFetch;

    if ( !obj.url ) {
      return;
    }

    obj.key =  ( obj.key || obj.url );
    source = golemCacheMecha.get( obj.key );

    obj.execute = obj.execute !== false;

    shouldFetch = isCacheValid(source, obj);

    if( obj.live || shouldFetch ) {
      if ( obj.unique ) {
        // set parameter to prevent browser cache
        obj.url += ( ( obj.url.indexOf('?') > 0 ) ? '&' : '?' ) + 'golemCacheMecha-unique=' + obj.unique;
      }
      promise = saveUrl( obj );

      if( obj.live && !shouldFetch ) {
        promise = promise
          .then( function( result ) {
            // If we succeed, just return the value
            // RSVP doesn't have a .fail convenience method
            return result;
          }, function() {
            return source;
          });
      }
    } else {
      source.type = obj.type || source.originalType;
      source.execute = obj.execute;
      promise = new RSVP.Promise( function( resolve ){
        resolve( source );
      });
    }

    return promise;
  };

  var injectScript = function( obj ) {
    var script = document.createElement('script');
    script.defer = true;
    // Have to use .text, since we support IE8,
    // which won't allow appending to a script
    script.text = obj.data;
    head.appendChild( script );
  };

  var handlers = {
    'default': injectScript
  };

  var execute = function( obj ) {
    if( obj.type && handlers[ obj.type ] ) {
      return handlers[ obj.type ]( obj );
    }

    return handlers['default']( obj ); // 'default' is a reserved word
  };

  var performActions = function( resources ) {
    return resources.map( function( obj ) {
      if( obj.execute ) {
        execute( obj );
      }

      return obj;
    } );
  };

  var fetch = function() {
    var i, l, promises = [];

    for ( i = 0, l = arguments.length; i < l; i++ ) {
      promises.push( handleStackObject( arguments[ i ] ) );
    }

    return RSVP.all( promises );
  };

  var thenRequire = function() {
    var resources = fetch.apply( null, arguments );
    var promise = this.then( function() {
      return resources;
    }).then( performActions );
    promise.thenRequire = thenRequire;
    return promise;
  };

  window.golemCacheMecha = {
    add: function() {
      for ( var a = 0, l = arguments.length; a < l; a++ ) {
        arguments[a].execute = arguments[a].execute !== false;

        if ( arguments[a].once && addStash.indexOf(arguments[a].url) >= 0 ) {
          arguments[a].execute = false;
        } else if ( arguments[a].execute !== false && addStash.indexOf(arguments[a].url) < 0 ) {
          addStash.push(arguments[a].url);
        }
      }

      var promise = fetch.apply( null, arguments ).then( performActions );

      promise.thenRequire = thenRequire;
      console.log('INFO: GolemCacheMecha initializing');
      console.log('INFO: Store assets to folder: /' + storagePrefix);
      return promise;
    },

    remove: function( key ) {
      localStorage.removeItem( storagePrefix + key );
      return this;
    },

    get: function( key ) {
      var item = localStorage.getItem( storagePrefix + key );
      try	{
        return JSON.parse( item || 'false' );
      } catch( e ) {
        return false;
      }
    },

    clear: function( expired ) {
      var item, key;
      var now = +new Date();

      for ( item in localStorage ) {
        key = item.split( storagePrefix )[ 1 ];
        if ( key && ( !expired || this.get( key ).expire <= now ) ) {
          this.remove( key );
        }
      }

      return this;
    },

    isValidItem: null,

    timeout: 5000,

    addHandler: function( types, handler ) {
      if( !Array.isArray( types ) ) {
        types = [ types ];
      }
      types.forEach( function( type ) {
        handlers[ type ] = handler;
      });
    },

    removeHandler: function( types ) {
      golemCacheMecha.addHandler( types, undefined );
    }
  };

  // delete expired keys
  golemCacheMecha.clear( true );

})( this, document );

/**
 * @file: golem_cache_mecha.js
 * @description: all purpose persistent local caching mechanism
 * @license: MIT
 * @author: Loouis Low <loouis@gmail.com>
 * @copyright: Loouis Low (https://github.com/loouislow81/golem-sdk)
 */

var GolemCacheMecha = {
    version: '1.0.0',
    // engine options
    options: {
      debug: false, //call the log method ?
      localCacheFolder: 'golemCacheMecha', //name of the cache folder
      useDataURI: false, //use src="data:.."? otherwise will use src="filesystem:.."
      chromeQuota: 10 * 1024 * 1024, // allocated cache space : here 10MB
      usePersistentCache: true, //false = use temporary cache storage
      cacheClearSize: 0, //size in MB that triggers cache clear on init, 0 to disable
      headers: {}, //HTTP headers for the download requests -- e.g: headers: { 'Accept': 'application/jpg' }
      withCredentials: false, // indicates whether or not cross-site Access-Control requests should be made using credentials
      skipURIencoding: false, // enable if URIs are already encoded (skips call to sanitizeURI)
      androidFilesystemRoot: null, //if specified, use one of the Cordova File plugin's app directories for storage
      timeout: 0 // timeout delay in ms for xhr request
    },
    overridables: {
      hash: function (s) {
        /* tiny-sha1 r4 (11/2011) - MIT License - http://code.google.com/p/tiny-sha1/ */
        /* jshint ignore:start */
        function U(a,b,c){while(0<c--){a.push(b)}}function L(a,b){return(a<<b)|(a>>>(32-b))}function P(a,b,c){return a^b^c}function A(a,b){var c=(b&0xFFFF)+(a&0xFFFF),d=(b>>>16)+(a>>>16)+(c>>>16);return((d&0xFFFF)<<16)|(c&0xFFFF)}var B="0123456789abcdef";return(function(a){var c=[],d=a.length*4,e;for(var i=0;i<d;i+=1){e=a[i>>2]>>((3-(i%4))*8);c.push(B.charAt((e>>4)&0xF)+B.charAt(e&0xF))}return c.join('')}((function(a,b){var c,d,e,f,g,h=a.length,v=0x67452301,w=0xefcdab89,x=0x98badcfe,y=0x10325476,z=0xc3d2e1f0,M=[];U(M,0x5a827999,20);U(M,0x6ed9eba1,20);U(M,0x8f1bbcdc,20);U(M,0xca62c1d6,20);a[b>>5]|=0x80<<(24-(b%32));a[(((b+65)>>9)<<4)+15]=b;for(var i=0;i<h;i+=16){c=v;d=w;e=x;f=y;g=z;for(var j=0,O=[];j<80;j+=1){O[j]=j<16?a[j+i]:L(O[j-3]^O[j-8]^O[j-14]^O[j-16],1);var k=(function(a,b,c,d,e){var f=(e&0xFFFF)+(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF),g=(e>>>16)+(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(f>>>16);return((g&0xFFFF)<<16)|(f&0xFFFF)})(j<20?(function(t,a,b){return(t&a)^(~t&b)}(d,e,f)):j<40?P(d,e,f):j<60?(function(t,a,b){return(t&a)^(t&b)^(a&b)}(d,e,f)):P(d,e,f),g,M[j],O[j],L(c,5));g=f;f=e;e=L(d,30);d=c;c=k}v=A(v,c);w=A(w,d);x=A(x,e);y=A(y,f);z=A(z,g)}return[v,w,x,y,z]}((function(t){var a=[],b=255,c=t.length*8;for(var i=0;i<c;i+=8){a[i>>5]|=(t.charCodeAt(i/8)&b)<<(24-(i%32))}return a}(s)).slice(),s.length*8))));
        /* jshint ignore:end */
      },
      log: function (str, level) {
        'use strict';
        if (GolemCacheMecha.options.debug) {
          if (level === LOG_LEVEL_INFO) {
            str = 'INFO: ' + str;
          }
          if (level === LOG_LEVEL_WARNING) {
            str = 'WARN: ' + str;
          }
          if (level === LOG_LEVEL_ERROR) {
            str = 'ERROR: ' + str;
          }
          console.log(str);
        }
      }
    },
    ready: false,
    attributes: {}
  },
  LOG_LEVEL_INFO = 1,
  LOG_LEVEL_WARNING = 2,
  LOG_LEVEL_ERROR = 3;

(function ($) {
  'use strict';

  /** Helpers *****************************************************************/
  var Helpers = {};

  // make sure the url does not contain funny characters like spaces that might make the download fail
  Helpers.sanitizeURI = function (uri) {
    if (GolemCacheMecha.options.skipURIencoding) {
      return uri;
    }
    else {
      if (uri.length >= 2 && uri[0] === '"' && uri[uri.length - 1] === '"') {
        uri = uri.substr(1, uri.length - 2);
      }
      var encodedURI = encodeURI(uri);
      /*
      TODO: The following bit of code will have to be checked first (#30)
      if (Helpers.isCordova()) {
          return encodedURI.replace(/%/g, '%25');
      }
      */
      return encodedURI;
    }
  };

  // with a little help from http://code.google.com/p/js-uri/
  Helpers.URI = function (str) {
    if (!str) {
      str = '';
    }
    // Based on the regex in RFC2396 Appendix B.
    var parser = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/,
      result = str.match(parser);
    this.scheme = result[1] || null;
    this.authority = result[2] || null;
    this.path = result[3] || null;
    this.query = result[4] || null;
    this.fragment = result[5] || null;
  };
  // returns lower cased filename from full URI
  Helpers.URIGetFileName = function (fullpath) {
    if (!fullpath) {
      return;
    }
    //TODO: there must be a better way here.. (url encoded strings fail)
    var idx = fullpath.lastIndexOf('/');
    if (!idx) {
      return;
    }
    return fullpath.substr(idx + 1).toLowerCase();
  };

  // returns lower cased path from full URI
  Helpers.URIGetPath = function (str) {
    if (!str) {
      return;
    }
    var uri = Helpers.URI(str);
    return uri.path.toLowerCase();
  };

  // returns extension from filename (without leading '.')
  Helpers.fileGetExtension = function (filename) {
    if (!filename) {
      return '';
    }
    filename = filename.split('?')[0];
    var ext = filename.split('.').pop();
    // make sure it's a realistic file extension - for images no more than 4 characters long (.jpeg)
    if (!ext || ext.length > 4) {
      return '';
    }
    return ext;
  };

  Helpers.appendPaths = function (path1, path2) {
    if (!path2) {
      path2 = '';
    }
    if (!path1 || path1 === '') {
      return (path2.length > 0 && path2[0] == '/' ? '' : '/') + path2;
    }
    return path1 + (((path1[path1.length - 1] == '/') || (path2.length > 0 && path2[0] == '/')) ? '' : '/') + path2;
  };

  Helpers.hasJqueryOrJqueryLite = function () {
    return (GolemCacheMecha.jQuery || GolemCacheMecha.jQueryLite);
  };

  Helpers.isCordova = function () {
    return (typeof cordova !== 'undefined' || typeof phonegap !== 'undefined') && (cordova || phonegap).platformId !== 'browser';
  };

  Helpers.isCordovaAndroid = function () {
    return (Helpers.isCordova() && device && device.platform && device.platform.toLowerCase().indexOf('android') >= 0);
  };

  Helpers.isCordovaWindowsPhone = function () {
    return (Helpers.isCordova() && device && device.platform && ((device.platform.toLowerCase().indexOf('win32nt') >= 0) || (device.platform.toLowerCase().indexOf('windows') >= 0)));
  };

  Helpers.isCordovaIOS = function () {
    return (Helpers.isCordova() && device && device.platform && device.platform.toLowerCase() === 'ios');
  };

  // special case for #93
  Helpers.isCordovaAndroidOlderThan3_3 = function () {
    return (Helpers.isCordovaAndroid() && device.version && (
      device.version.indexOf('2.') === 0 ||
      device.version.indexOf('3.0') === 0 ||
      device.version.indexOf('3.1') === 0 ||
      device.version.indexOf('3.2') === 0
    ));
  };

  // special case for #47
  Helpers.isCordovaAndroidOlderThan4 = function () {
    return (Helpers.isCordovaAndroid() && device.version && (device.version.indexOf('2.') === 0 || device.version.indexOf('3.') === 0));
  };

  // Fix for #42 (Cordova versions < 4.0)
  Helpers.EntryToURL = function (entry) {
    if (Helpers.isCordovaAndroidOlderThan4() && typeof entry.toNativeURL === 'function') {
      return entry.toNativeURL();
    }
    else if (typeof entry.toInternalURL === 'function') {
      // Fix for #97
      return entry.toInternalURL();
    }
    else {
      return entry.toURL();
    }
  };

  // Returns a URL that can be used to locate a file
  Helpers.EntryGetURL = function (entry) {
    // toURL for html5, toURI for cordova 1.x
    return (typeof entry.toURL === 'function' ? Helpers.EntryToURL(entry) : entry.toURI());
  };

  // Returns the full absolute path from the root to the FileEntry
  Helpers.EntryGetPath = function (entry) {
    if (Helpers.isCordova()) {
      // #93
      if (Helpers.isCordovaIOS()) {
        if (Helpers.isCordovaAndroidOlderThan3_3()) {
          return entry.fullPath;
        }
        else {
          return entry.nativeURL;
        }
      }
      // From Cordova 3.3 onward toURL() seems to be required instead of fullPath (#38)
      return (typeof entry.toURL === 'function' ? Helpers.EntryToURL(entry) : entry.fullPath);
    }
    else {
      return entry.fullPath;
    }
  };

  Helpers.getCordovaStorageType = function (isPersistent) {
    // From Cordova 3.1 onward those constants have moved to the window object (#38)
    if (typeof LocalFileSystem !== 'undefined') {
      if (isPersistent && LocalFileSystem.hasOwnProperty('PERSISTENT')) {
        return LocalFileSystem.PERSISTENT;
      }
      if (!isPersistent && LocalFileSystem.hasOwnProperty('TEMPORARY')) {
        return LocalFileSystem.TEMPORARY;
      }
    }
    return (isPersistent ? window.PERSISTENT : window.TEMPORARY);
  };

  /****************************************************************************/

  /** DomHelpers **************************************************************/
  var DomHelpers = {};

  DomHelpers.trigger = function (DomElement, eventName) {
    if (GolemCacheMecha.jQuery) {
      $(DomElement).trigger(eventName);
    }
    else {
      /* CustomEvent polyfill */
      if (Helpers.isCordovaWindowsPhone() || !window.CustomEvent) {
        // CustomEvent for browsers which don't natively support the Constructor method
        window.CustomEvent = function CustomEvent(type, params) {
          var event;
          params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
          };
          try {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
          }
          catch (error) {
            // for browsers that don't support CustomEvent at all, we use a regular event instead
            event = document.createEvent('Event');
            event.initEvent(type, params.bubbles, params.cancelable);
            event.detail = params.detail;
          }
          return event;
        };
      }
      DomElement.dispatchEvent(new CustomEvent(eventName));
    }
  };

  DomHelpers.removeAttribute = function (element, attrName) {
    if (Helpers.hasJqueryOrJqueryLite()) {
      element.removeAttr(attrName);
    }
    else {
      element.removeAttribute(attrName);
    }
  };
  DomHelpers.setAttribute = function (element, attrName, value) {
    if (Helpers.hasJqueryOrJqueryLite()) {
      element.attr(attrName, value);
    }
    else {
      element.setAttribute(attrName, value);
    }
  };
  DomHelpers.getAttribute = function (element, attrName) {
    if (Helpers.hasJqueryOrJqueryLite()) {
      return element.attr(attrName);
    }
    else {
      return element.getAttribute(attrName);
    }
  };
  DomHelpers.getBackgroundImage = function (element) {
    if (Helpers.hasJqueryOrJqueryLite()) {
      return element.attr('data-old-background') ? "url(" + element.attr('data-old-background') + ")" : element.css('background-image');
    }
    else {
      var style = window.getComputedStyle(element, null);
      if (!style) {
        return;
      }
      return element.getAttribute("data-old-background") ? "url(" + element.getAttribute("data-old-background") + ")" : style.backgroundImage;
    }
  };
  DomHelpers.setBackgroundImage = function (element, styleValue) {
    if (Helpers.hasJqueryOrJqueryLite()) {
      element.css('background-image', styleValue);
    }
    else {
      element.style.backgroundImage = styleValue;
    }
  };

  /****************************************************************************/

  /** Private *****************************************************************/
  var Private = {
    attributes: {}
  };

  Private.isImgCacheLoaded = function () {
    if (!GolemCacheMecha.attributes.filesystem || !GolemCacheMecha.attributes.dirEntry) {
      GolemCacheMecha.overridables.log('GolemCacheMecha not loaded yet! - Have you called GolemCacheMecha.init() first?', LOG_LEVEL_WARNING);
      return false;
    }
    return true;
  };

  Private.attributes.hasLocalStorage = false;
  Private.hasLocalStorage = function () {
    // if already tested, avoid doing the check again
    if (Private.attributes.hasLocalStorage) {
      return Private.attributes.hasLocalStorage;
    }
    try {
      var mod = GolemCacheMecha.overridables.hash('imgcache_test');
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      Private.attributes.hasLocalStorage = true;
      return true;
    }
    catch (e) {
      // this is an info, not an error
      GolemCacheMecha.overridables.log('Could not write to local storage: ' + e.message, LOG_LEVEL_INFO);
      return false;
    }
  };

  Private.setCurrentSize = function (curSize) {
    GolemCacheMecha.overridables.log('current size: ' + curSize, LOG_LEVEL_INFO);
    if (Private.hasLocalStorage()) {
      localStorage.setItem('golemcachemecha:' + GolemCacheMecha.options.localCacheFolder, curSize);
    }
  };

  Private.getCachedFilePath = function (img_src) {
    return Helpers.appendPaths(GolemCacheMecha.options.localCacheFolder, Private.getCachedFileName(img_src));
  };

  // used for FileTransfer.download only
  Private.getCachedFileFullPath = function (img_src) {
    var local_root = Helpers.EntryGetPath(GolemCacheMecha.attributes.dirEntry);
    return Helpers.appendPaths(local_root, Private.getCachedFileName(img_src));
  };

  Private.getCachedFileName = function (img_src) {
    if (!img_src) {
      GolemCacheMecha.overridables.log('No source given to getCachedFileName', LOG_LEVEL_WARNING);
      return;
    }
    var hash = GolemCacheMecha.overridables.hash(img_src);
    var ext = Helpers.fileGetExtension(Helpers.URIGetFileName(img_src));
    return hash + (ext ? ('.' + ext) : '');
  };

  Private.setNewImgPath = function ($img, new_src, old_src) {
    DomHelpers.setAttribute($img, 'src', new_src);
    // store previous url in case we need to reload it
    DomHelpers.setAttribute($img, OLD_SRC_ATTR, old_src);
  };

  Private.createCacheDir = function (success_callback, error_callback) {
    if (!GolemCacheMecha.attributes.filesystem) {
      GolemCacheMecha.overridables.log('Filesystem instance was not initialised', LOG_LEVEL_ERROR);
      if (error_callback) {
        error_callback();
      }
      return;
    }
    var _fail = function (error) {
      GolemCacheMecha.overridables.log('Failed to get/create local cache directory: ' + error.code, LOG_LEVEL_ERROR);
      if (error_callback) {
        error_callback();
      }
    };
    var _getDirSuccess = function (dirEntry) {
      GolemCacheMecha.attributes.dirEntry = dirEntry;
      GolemCacheMecha.overridables.log('Store assets to folder: ' + Helpers.EntryGetPath(dirEntry), LOG_LEVEL_INFO);

      //Put .nomedia file in cache directory so Android doesn't index it.
      if (Helpers.isCordovaAndroid()) {
        var _androidNoMediaFileCreated = function () {
          GolemCacheMecha.overridables.log('.nomedia file created.', LOG_LEVEL_INFO);
          if (success_callback) {
            success_callback();
          }
        };

        dirEntry.getFile('.nomedia', {
          create: true,
          exclusive: false
        }, _androidNoMediaFileCreated, _fail);
      }
      else if (!Helpers.isCordovaWindowsPhone()) {
        // #73 - iOS: the directory should not be backed up in iCloud
        if (Helpers.isCordovaIOS() && dirEntry.setMetadata) {
          dirEntry.setMetadata(function () {
            /* success*/
            GolemCacheMecha.overridables.log('com.apple.MobileBackup metadata set', LOG_LEVEL_INFO);
          }, function () {
            /* failure */
            GolemCacheMecha.overridables.log('com.apple.MobileBackup metadata could not be set', LOG_LEVEL_WARNING);
          }, {
            // 1=NO backup oddly enough..
            'com.apple.MobileBackup': 1
          });
        }

        if (success_callback) {
          success_callback();
        }
      }
      else {
        if (success_callback) {
          success_callback();
        }
      }

      GolemCacheMecha.ready = true;
      DomHelpers.trigger(document, IMGCACHE_READY_TRIGGERED_EVENT);
    };
    GolemCacheMecha.attributes.filesystem.root.getDirectory(GolemCacheMecha.options.localCacheFolder, {
      create: true,
      exclusive: false
    }, _getDirSuccess, _fail);
  };

  // This is a wrapper for phonegap's FileTransfer object in order to implement the same feature
  // in Chrome (and possibly extra browsers in the future)
  Private.FileTransferWrapper = function (filesystem) {
    if (Helpers.isCordova()) {
      // PHONEGAP
      this.fileTransfer = new FileTransfer();
    }
    this.filesystem = filesystem; // only useful for CHROME
  };
  Private.FileTransferWrapper.prototype.download = function (uri, localPath, success_callback, error_callback, on_progress) {
    var headers = GolemCacheMecha.options.headers || {};
    var isOnProgressAvailable = (typeof on_progress === 'function');

    if (this.fileTransfer) {
      if (isOnProgressAvailable) {
        this.fileTransfer.onprogress = on_progress;
      }
      return this.fileTransfer.download(uri, localPath, success_callback, error_callback, false, {
        'headers': headers
      });
    }

    var filesystem = this.filesystem;

    // CHROME - browsers
    var _fail = function (str, level, error_callback) {
      GolemCacheMecha.overridables.log(str, level);
      // mock up FileTransferError, so at least caller knows there was a problem.
      // Normally, the error.code in the callback is a FileWriter error, we return 0 if the error was an XHR error
      if (error_callback) {
        error_callback({
          code: 0,
          source: uri,
          target: localPath
        });
      }
    };
    var xhr = new XMLHttpRequest();
    xhr.open('GET', uri, true);
    if (isOnProgressAvailable) {
      xhr.onprogress = on_progress;
    }
    if (GolemCacheMecha.options.withCredentials) {
      xhr.withCredentials = true;
    }
    xhr.timeout = GolemCacheMecha.options.timeout;
    xhr.responseType = 'blob';
    for (var key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
    xhr.onload = function () {
      if (xhr.response && (xhr.status === 200 || xhr.status === 0)) {
        filesystem.root.getFile(localPath, {
          create: true
        }, function (fileEntry) {
          fileEntry.createWriter(function (writer) {
            writer.onerror = error_callback;
            writer.onwriteend = function () {
              success_callback(fileEntry);
            };
            writer.write(xhr.response, error_callback);
          }, error_callback);
        }, error_callback);
      }
      else {
        _fail('Image ' + uri + ' could not be downloaded - status: ' + xhr.status, 3, error_callback);
      }
    };
    xhr.onerror = function () {
      _fail('XHR error - Image ' + uri + ' could not be downloaded - status: ' + xhr.status, 3, error_callback);
    };
    xhr.ontimeout = function () {
      _fail('XHR error - Image ' + uri + ' timed out - status: ' + xhr.status, 3, error_callback);
    };
    xhr.send();
  };

  Private.getBackgroundImageURL = function ($div) {
    var backgroundImageProperty = DomHelpers.getBackgroundImage($div);
    if (!backgroundImageProperty) {
      return;
    }
    var regexp = /url\s?\((.+)\)/;
    var img_src = regexp.exec(backgroundImageProperty)[1];
    return img_src.replace(/(['"])/g, '');
  };

  Private.getBase64DataFromEntry = function (entry, filename, success_callback, error_callback) {
    var _success = function (file) {
      var reader = new FileReader();
      reader.onloadend = function (e) {
        var base64content = e.target.result;
        if (base64content) {
          GolemCacheMecha.overridables.log('File ' + filename + ' loaded from cache', LOG_LEVEL_INFO);
          if (success_callback) {
            success_callback(base64content);
          }
        }
        else {
          GolemCacheMecha.overridables.log('File in cache ' + filename + ' is empty', LOG_LEVEL_WARNING);
          if (error_callback) {
            error_callback(filename);
          }
        }
      };
      reader.readAsDataURL(file);
    };
    var _failure = function (error) {
      GolemCacheMecha.overridables.log('Failed to read file ' + error.code, LOG_LEVEL_ERROR);
      if (error_callback) {
        error_callback(filename);
      }
    };

    entry.file(_success, _failure);
  };

  Private.loadCachedFile = function ($element, img_src, set_path_callback, success_callback, error_callback) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    if (!$element) {
      GolemCacheMecha.overridables.log('First parameter of loadCachedFile is empty, should be a DOM element', LOG_LEVEL_ERROR);
      return;
    }

    var filename = Helpers.URIGetFileName(img_src);

    var _gotFileEntry = function (entry) {
      if (GolemCacheMecha.options.useDataURI) {
        Private.getBase64DataFromEntry(entry, filename, function (base64content) {
          set_path_callback($element, base64content, img_src);
          if (success_callback) {
            success_callback($element);
          }
        }, function () {
          if (error_callback) {
            error_callback($element);
          }
        });
      }
      else {
        // using src="filesystem:" kind of url
        var new_url = Helpers.EntryGetURL(entry);
        set_path_callback($element, new_url, img_src);
        GolemCacheMecha.overridables.log('File ' + filename + ' loaded from cache', LOG_LEVEL_INFO);
        if (success_callback) {
          success_callback($element);
        }
      }
    };
    // if file does not exist in cache, cache it now!
    var _fail = function () {
      GolemCacheMecha.overridables.log('File ' + filename + ' not in cache', LOG_LEVEL_INFO);
      if (error_callback) {
        error_callback($element);
      }
    };
    GolemCacheMecha.attributes.filesystem.root.getFile(Private.getCachedFilePath(img_src), {
      create: false
    }, _gotFileEntry, _fail);
  };

  Private.setBackgroundImagePath = function ($element, new_src, old_src) {
    DomHelpers.setBackgroundImage($element, 'url("' + new_src + '")');
    // store previous url in case we need to reload it
    DomHelpers.setAttribute($element, OLD_BACKGROUND_ATTR, old_src);
  };

  /****************************************************************************/


  var OLD_SRC_ATTR = 'data-old-src',
    OLD_BACKGROUND_ATTR = 'data-old-background',
    IMGCACHE_READY_TRIGGERED_EVENT = 'ImgCacheReady';

  GolemCacheMecha.init = function (success_callback, error_callback) {
    GolemCacheMecha.jQuery = (window.jQuery || window.Zepto) ? true : false; /* using jQuery if it's available otherwise the DOM API */
    GolemCacheMecha.jQueryLite = (typeof window.angular !== 'undefined' && window.angular.element) ? true : false; /* is AngularJS jQueryLite available */

    GolemCacheMecha.attributes.init_callback = success_callback;

    GolemCacheMecha.overridables.log('GolemCacheMecha initialising', LOG_LEVEL_INFO);

    var _checkSize = function (callback) {
      if (GolemCacheMecha.options.cacheClearSize > 0) {
        var curSize = GolemCacheMecha.getCurrentSize();
        if (curSize > (GolemCacheMecha.options.cacheClearSize * 1024 * 1024)) {
          GolemCacheMecha.clearCache(callback, callback);
        }
        else {
          if (callback) {
            callback();
          }
        }
      }
      else {
        if (callback) {
          callback();
        }
      }
    };
    var _gotFS = function (filesystem) {
      GolemCacheMecha.overridables.log('`LocalFileSystem` service opened', LOG_LEVEL_INFO);

      // store filesystem handle
      GolemCacheMecha.attributes.filesystem = filesystem;

      Private.createCacheDir(function () {
        _checkSize(GolemCacheMecha.attributes.init_callback);
      }, error_callback);
    };
    var _fail = function (error) {
      GolemCacheMecha.overridables.log('Failed to initialise LocalFileSystem ' + error.code, LOG_LEVEL_ERROR);
      if (error_callback) {
        error_callback();
      }
    };
    if (Helpers.isCordova() && window.requestFileSystem) {
      // PHONEGAP
      if (GolemCacheMecha.options.androidFilesystemRoot) {
        try {
          window.resolveLocalFileSystemURL(
            GolemCacheMecha.options.androidFilesystemRoot,
            function (dirEntry) {
              _gotFS({
                root: dirEntry
              });
            },
            _fail
          );
        }
        catch (e) {
          _fail({
            code: e.message
          });
        }
      }
      else {
        window.requestFileSystem(Helpers.getCordovaStorageType(GolemCacheMecha.options.usePersistentCache), 0, _gotFS, _fail);
      }
    }
    else {
      //CHROME
      var savedFS = window.requestFileSystem || window.webkitRequestFileSystem;
      window.storageInfo = window.storageInfo || (GolemCacheMecha.options.usePersistentCache ? navigator.webkitPersistentStorage : navigator.webkitTemporaryStorage);
      if (!window.storageInfo) {
        GolemCacheMecha.overridables.log('Your browser does not support the html5 File API', LOG_LEVEL_WARNING);
        if (error_callback) {
          error_callback();
        }
        return;
      }
      // request space for storage
      var quota_size = GolemCacheMecha.options.chromeQuota;
      window.storageInfo.requestQuota(
        quota_size,
        function () {
          /* success*/
          var persistence = (GolemCacheMecha.options.usePersistentCache ? window.PERSISTENT : window.TEMPORARY);
          savedFS(persistence, quota_size, _gotFS, _fail);
        },
        function (error) {
          /* error*/
          GolemCacheMecha.overridables.log('Failed to request quota: ' + error.message, LOG_LEVEL_ERROR);
          if (error_callback) {
            error_callback();
          }
        }
      );
    }
  };

  GolemCacheMecha.getCurrentSize = function () {
    if (Private.hasLocalStorage()) {
      var curSize = localStorage.getItem('golemcachemecha:' + GolemCacheMecha.options.localCacheFolder);
      if (curSize === null) {
        return 0;
      }
      return parseInt(curSize, 10);
    }
    else {
      return 0;
    }
  };

  // this function will not check if the image is already cached or not => it will overwrite existing data
  // on_progress callback follows this spec: http://www.w3.org/TR/2014/REC-progress-events-20140211/ -- see #54
  GolemCacheMecha.cacheFile = function (img_src, success_callback, error_callback, on_progress) {
    if (!Private.isImgCacheLoaded() || !img_src) {
      return;
    }

    img_src = Helpers.sanitizeURI(img_src);

    var filePath = Private.getCachedFileFullPath(img_src);

    var fileTransfer = new Private.FileTransferWrapper(GolemCacheMecha.attributes.filesystem);
    fileTransfer.download(
      img_src,
      filePath,
      function (entry) {
        entry.getMetadata(function (metadata) {
          if (metadata && ('size' in metadata)) {
            GolemCacheMecha.overridables.log('Cached file size: ' + metadata.size, LOG_LEVEL_INFO);
            Private.setCurrentSize(GolemCacheMecha.getCurrentSize() + parseInt(metadata.size, 10));
          }
          else {
            GolemCacheMecha.overridables.log('No metadata size property available', LOG_LEVEL_INFO);
          }
        });
        GolemCacheMecha.overridables.log('Download complete: ' + Helpers.EntryGetPath(entry), LOG_LEVEL_INFO);

        // iOS: the file should not be backed up in iCloud
        // new from cordova 1.8 only
        if (entry.setMetadata) {
          entry.setMetadata(
            function () {
              /* success*/
              GolemCacheMecha.overridables.log('com.apple.MobileBackup metadata set', LOG_LEVEL_INFO);
            },
            function () {
              /* failure */
              GolemCacheMecha.overridables.log('com.apple.MobileBackup metadata could not be set', LOG_LEVEL_WARNING);
            }, {
              // 1=NO backup oddly enough..
              'com.apple.MobileBackup': 1
            }
          );
        }

        if (success_callback) {
          success_callback(entry.toURL());
        }
      },
      function (error) {
        if (error.source) {
          GolemCacheMecha.overridables.log('Download error source: ' + error.source, LOG_LEVEL_ERROR);
        }
        if (error.target) {
          GolemCacheMecha.overridables.log('Download error target: ' + error.target, LOG_LEVEL_ERROR);
        }
        GolemCacheMecha.overridables.log('Download error code: ' + error.code, LOG_LEVEL_ERROR);
        if (error_callback) {
          error_callback();
        }
      },
      on_progress
    );
  };

  // Returns the file already available in the cached
  // Reminder: this is an asynchronous method!
  // Answer to the question comes in response_callback as the second argument (first being the path)
  GolemCacheMecha.getCachedFile = function (img_src, response_callback) {
    // sanity check
    if (!Private.isImgCacheLoaded() || !response_callback) {
      return;
    }

    var original_img_src = img_src;
    img_src = Helpers.sanitizeURI(img_src);

    var path = Private.getCachedFilePath(img_src);
    if (Helpers.isCordovaAndroid()) {
      // This hack is probably only used for older versions of Cordova
      if (path.indexOf('file://') === 0) {
        // issue #4 -- android cordova specific
        path = path.substr(7);
      }
    }

    // try to get the file entry: if it fails, there's no such file in the cache
    GolemCacheMecha.attributes.filesystem.root.getFile(
      path, {
        create: false
      },
      function (file_entry) {
        response_callback(img_src, file_entry);
      },
      function () {
        response_callback(original_img_src, null);
      }
    );
  };

  // Returns the local url of a file already available in the cache
  GolemCacheMecha.getCachedFileURL = function (img_src, success_callback, error_callback) {
    var _getURL = function (img_src, entry) {
      if (entry) {
        success_callback(img_src, Helpers.EntryGetURL(entry));
      }
      else {
        if (error_callback) {
          error_callback(img_src);
        }
      }
    };

    GolemCacheMecha.getCachedFile(img_src, _getURL);
  };

  GolemCacheMecha.getCachedFileBase64Data = function (img_src, success_callback, error_callback) {
    var _getData = function (img_src, entry) {
      if (entry) {
        Private.getBase64DataFromEntry(entry, img_src, function (base64content) {
          success_callback(img_src, base64content);
        }, error_callback);
      }
      else {
        if (error_callback) {
          error_callback(img_src);
        }
      }
    };

    GolemCacheMecha.getCachedFile(img_src, _getData);
  };

  // checks if a copy of the file has already been cached
  // Reminder: this is an asynchronous method!
  // Answer to the question comes in response_callback as the second argument (first being the path)
  GolemCacheMecha.isCached = function (img_src, response_callback) {
    GolemCacheMecha.getCachedFile(img_src, function (src, file_entry) {
      response_callback(src, file_entry !== null);
    });
  };

  // $img: jQuery object of an <img/> element
  // Synchronous method
  GolemCacheMecha.useOnlineFile = function ($img) {
    if (!Private.isImgCacheLoaded() || !$img) {
      return;
    }

    var prev_src = DomHelpers.getAttribute($img, OLD_SRC_ATTR);
    if (prev_src) {
      DomHelpers.setAttribute($img, 'src', prev_src);
    }
    DomHelpers.removeAttribute($img, OLD_SRC_ATTR);
  };


  // $img: jQuery object of an <img/> element
  GolemCacheMecha.useCachedFile = function ($img, success_callback, error_callback) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    var img_url = Helpers.sanitizeURI(DomHelpers.getAttribute($img, 'src'));

    Private.loadCachedFile($img, img_url, Private.setNewImgPath, success_callback, error_callback);
  };

  // When the source url is not the 'src' attribute of the given img element
  GolemCacheMecha.useCachedFileWithSource = function ($img, image_url, success_callback, error_callback) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    var img_url = Helpers.sanitizeURI(image_url);

    Private.loadCachedFile($img, img_url, Private.setNewImgPath, success_callback, error_callback);
  };

  // clears the cache
  GolemCacheMecha.clearCache = function (success_callback, error_callback) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    // delete cache dir completely
    GolemCacheMecha.attributes.dirEntry.removeRecursively(
      function () {
        GolemCacheMecha.overridables.log('Local cache cleared', LOG_LEVEL_INFO);
        Private.setCurrentSize(0);
        // recreate the cache dir now
        Private.createCacheDir(success_callback, error_callback);
      },
      function (error) {
        GolemCacheMecha.overridables.log('Failed to remove directory or its contents: ' + error.code, LOG_LEVEL_ERROR);
        if (error_callback) {
          error_callback();
        }
      }
    );
  };

  GolemCacheMecha.removeFile = function (img_src, success_callback, error_callback) {
    img_src = Helpers.sanitizeURI(img_src);

    var filePath = Private.getCachedFilePath(img_src);
    var _fail = function (error) {
      GolemCacheMecha.overridables.log('Failed to remove file due to ' + error.code, LOG_LEVEL_ERROR);
      if (error_callback) {
        error_callback();
      }
    };
    GolemCacheMecha.attributes.filesystem.root.getFile(filePath, {
      create: false
    }, function (fileEntry) {
      fileEntry.remove(
        function () {
          if (success_callback) {
            success_callback();
          }
        },
        _fail
      );
    }, _fail);
  };

  GolemCacheMecha.isBackgroundCached = function ($div, response_callback) {
    var img_src = Private.getBackgroundImageURL($div);
    GolemCacheMecha.getCachedFile(img_src, function (src, file_entry) {
      response_callback(src, file_entry !== null);
    });
  };

  GolemCacheMecha.cacheBackground = function ($div, success_callback, error_callback, on_progress) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    var img_src = Private.getBackgroundImageURL($div);
    if (!img_src) {
      GolemCacheMecha.overridables.log('No background to cache', LOG_LEVEL_WARNING);
      if (error_callback) {
        error_callback();
      }
      return;
    }

    GolemCacheMecha.overridables.log('Background image URL: ' + img_src, LOG_LEVEL_INFO);
    GolemCacheMecha.cacheFile(img_src, success_callback, error_callback, on_progress);
  };

  GolemCacheMecha.useCachedBackground = function ($div, success_callback, error_callback) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    var img_src = Private.getBackgroundImageURL($div);
    if (!img_src) {
      GolemCacheMecha.overridables.log('No background to cache', LOG_LEVEL_WARNING);
      if (error_callback) {
        error_callback();
      }
      return;
    }

    Private.loadCachedFile($div, img_src, Private.setBackgroundImagePath, success_callback, error_callback);
  };

  GolemCacheMecha.useCachedBackgroundWithSource = function ($div, image_url, success_callback, error_callback) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    Private.loadCachedFile($div, image_url, Private.setBackgroundImagePath, success_callback, error_callback);
  };

  // Improved by Nathan
  // $div: jQuery object of an element
  // Synchronous method
  // Method used to revert call to useCachedBackground
  GolemCacheMecha.useBackgroundOnlineFile = function ($div) {
    if (!$div) {
      return;
    }

    var prev_src = DomHelpers.getAttribute($div, OLD_BACKGROUND_ATTR);
    if (prev_src) {
      DomHelpers.setBackgroundImage($div, 'url("' + prev_src + '")');
    }
    DomHelpers.removeAttribute($div, OLD_BACKGROUND_ATTR);
  };

  // returns the URI of the local cache folder (filesystem:)
  // this function is more useful for the examples than for anything else..
  // Synchronous method
  GolemCacheMecha.getCacheFolderURI = function () {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    return Helpers.EntryGetURL(GolemCacheMecha.attributes.dirEntry);
  };

  // private methods can now be used publicly
  GolemCacheMecha.helpers = Helpers;
  GolemCacheMecha.domHelpers = DomHelpers;
  GolemCacheMecha.private = Private;

  /****************************************************************************/

  // Expose the class either via AMD, CommonJS or the global object
  if (typeof define === 'function' && define.amd) {
    define('golemcachemecha', [], function () {
      return GolemCacheMecha;
    });
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = GolemCacheMecha;
  }
  else {
    window.GolemCacheMecha = GolemCacheMecha;
  }

})(window.jQuery || window.Zepto || function () {
  throw "ERR: require jQuery for `$img`";
});
// inject DOM decorator
function create(htmlStr) {
  var frag = document.createDocumentFragment(),
    temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

// create element
var fragment = create('<div id="d0ca0fd2bfa3100c95365c4ad784627b"></div>');

// insert element
document.body.insertBefore(fragment, document.body.childNodes[0]);

// get all image sources
document.getElementById('d0ca0fd2bfa3100c95365c4ad784627b').addEventListener("click", function () {
  var elements = document.querySelectorAll('img');
  Array.prototype.forEach.call(elements, function (el, i) {
    GolemCacheMecha.cacheFile(el.getAttribute('src'));

  });
});

// simulate
setTimeout(function () {
  var counter = 0;
  var interval = setInterval(function () {
    // Clicks the button
    document.getElementById("d0ca0fd2bfa3100c95365c4ad784627b").click();
    counter++; // Increases counter after every click
    // Stops after x clicks
    if (counter == 100) clearInterval(interval);
  }, 5000); // Will click the button every x seconds
}, 5000); // Starts after x seconds
