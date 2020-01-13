// Utility function
function krunch() {};


/*
  Developer options
  @methodOf log('','');
  @enable with `console.log(msg, req);`
  @disable with `console.log();`
*/
var log = function(msg, req){
  // console.log('krugurt:', msg, req);
  console.log();
};


/*
  Connection Detector
*/
/*
  DOM Decorate Injector for krunch.probeConnection()
  @param {htmlstring}
*/
function injectDOM(htmlStr) {
  var frag = document.createDocumentFragment(),
    temp = document.createElement('y');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
};


/*
  Check Connection with display message
  @param {null}
*/
krunch.probeConnection = function() {

  var element = injectDOM('<y class="w-screen" id="ba194bb5a0b6e42d520d17a3b75f5962"></y><style>#ba194bb5a0b6e42d520d17a3b75f5962{color:#fff;font-size:0.8em;text-align:center;width:100%;top:0;left:0;z-index:200;position:fixed;}.is-online{background:transparent;padding:0}.is-online:after{visibility:visible;content:"";}.is-offline{background:#F44336;padding:0.15rem}.is-offline:after{visibility:visible;content:"No connection!";}</style>');
  document.body.insertBefore(element, document.body.childNodes[0]);

  try {
    window.addEventListener('load', function() {
      function checkStatus() {
        // display status
        window.document.getElementById('ba194bb5a0b6e42d520d17a3b75f5962')
          .className = navigator.onLine ? 'is-online' : 'is-offline';
        log('(CONN) is ' + window.document.getElementById('ba194bb5a0b6e42d520d17a3b75f5962').className);
      }
      setInterval(function() {
        // check connection
        window.addEventListener('online', checkStatus);
        window.addEventListener('offline', checkStatus);
      }, 1000)
    });
  }
  catch (error) {
    log('(CONN)', error);
  }

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
  log('(SW) add cache', req);
};


/*
  Remove `request` from the cache
  @param {string[]|Request[]|string|Request} request
*/
krunch.removeCache = function(req) {
  serviceWorker.remove(req);
  log('(SW) remove cache', req);
};


/*
  Executed immediately
  @methodOf serviceWorker
  @param {function} callback
  @returns {function} dispose
*/
krunch.isCached = function() {
  serviceWorker.onCached(function() {
    log('(SW) (CACHED)');
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
    log('(SW) (ONLINE)');
  });
};

