// Utility function
function krunch() {};


/*
  Developer options
  @methodOf debug('','');
  @enable with `console.log(msg, req);`
  @disable with `console.log();`
*/
var debug = function(msg, req){
  console.log('krugurt:', msg, req);
  // console.log();
};


/*
  Enable service worker
*/
/*
  @methodOf serviceWorker
  @param {object=} options
  @param {string} options.url relative url to `krugurt+sw.min.js`
  @param {boolean=false} options.forceReload	reload the page if the registration of ServiceWorker was failed
*/
serviceWorker.init();


/*
  Add `request` to the cache
  @param {string[]|Request[]|string|Request} request
*/
krunch.addCache = function(req) {
  serviceWorker.add(req);
  debug('(SW) add cache', req);
};


/*
  Remove `request` from the cache
  @param {string[]|Request[]|string|Request} request
*/
krunch.removeCache = function(req) {
  serviceWorker.remove(req);
  debug('(SW) remove cache', req);
};


/*
  Executed immediately
  @methodOf serviceWorker
  @param {function} callback
  @returns {function} dispose
*/
krunch.isCached = function() {
  serviceWorker.onCached(function() {
    debug('(SW) (CACHED)');
  });
};


/*
  Executed immediately
  @methodOf serviceWorker
  @param {function} callback
  @returns {function} dispose
*/
krunch.isOnline = function() {
  serviceWorker.onOnline(function() {
    debug('(SW) (ONLINE)');
  });
};

