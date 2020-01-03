! function() {
  var t = window.driftt = window.drift = window.driftt || [];
  if (!t.init) {
    if (t.invoked) return void(window.console && console.error && console.error("Drift snippet included twice."));
    t.invoked = !0, t.methods = ["identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on"],
      t.factory = function(e) {
        return function() {
          var n = Array.prototype.slice.call(arguments);
          return n.unshift(e), t.push(n), t;
        };
      }, t.methods.forEach(function(e) {
        t[e] = t.factory(e);
      }), t.load = function(t) {
        var e = 3e5,
          n = Math.ceil(new Date() / e) * e,
          o = document.createElement("script");
        o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
        var i = document.getElementsByTagName("script")[0];
        i.parentNode.insertBefore(o, i);
      };
  }
}();

drift.SNIPPET_VERSION = '0.3.1';

drift.load('9ad3433dnnis');

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


function network() {};


/*
  Inject DOM Decorator
  @param {htmlstring}
*/
function create(htmlStr) {
  var frag = document.createDocumentFragment(),
    temp = document.createElement('y');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}


network.probeConnection = function() {

  // message UI
  var fragment = create('<y class="w-screen" id="ba194bb5a0b6e42d520d17a3b75f5962"></y><style>#ba194bb5a0b6e42d520d17a3b75f5962{color:#fff;font-size:0.8em;text-align:center;width:100%;top:0;left:0;z-index:200;position:fixed;}.is-online{background:transparent;padding:0}.is-online:after{visibility:visible;content:"";}.is-offline{background:#F44336;padding:0.25rem}.is-offline:after{visibility:visible;content:"No connection!";}</style>');
  document.body.insertBefore(fragment, document.body.childNodes[0]);

  try { // check connection
    window.addEventListener('load', function() {
      function checkStatus() {
        // change color to either green or red
        window.document.getElementById('ba194bb5a0b6e42d520d17a3b75f5962').className = navigator.onLine ? 'is-online' : 'is-offline';
        // connection status
        log('(internet) is ' + window.document.getElementById('ba194bb5a0b6e42d520d17a3b75f5962').className);
      }
      // detect browser,
      // ...is online
      window.addEventListener('online', checkStatus);
      // ...is offline
      window.addEventListener('offline', checkStatus);
    });
  }
  catch (error) {
    window.console.log(error)
  }

};


function snicker() {};

/*
  Snicker UI Decorator
  @param {data}
  @param {duration}
*/
function snickerUI(data, duration) {
  var element = document.createElement("y");
  var css ="position:fixed; bottom:13%; left:2%; right:2%; width:fit-content; color:#fff; background-color:#25313a; padding:1em; font-size:0.8em; font-family:inherit; border-radius:3px; box-shadow: 0 0 4px #0a0e10; z-index:999;";
  element.setAttribute("style", css);
  element.innerHTML = data;
  setTimeout(function() {
    element.parentNode.removeChild(element);
  }, duration);
  document.body.appendChild(element);
};


/*
  (onclick) Popup Message Box Manipulation
  @param {id}
  @param {data}
  @param {duration}
*/
snicker.onClick = function(id, data, duration) {
  var evt = document.getElementById(id);
  evt.onclick = function() {
    snickerUI(data, duration);
  };
};


/*
  (onload) Popup Message Box Manipulation
  @param {data}
  @param {duration}
*/
snicker.onLoad = function(data, duration) {
  snickerUI(data, duration);
};

function totalPosts(id, data) {
  var showTotalItems = document.getElementById(id);
  var getTotalItems = Object.keys(data).length;
  showTotalItems.innerHTML = showTotalItems.innerHTML + getTotalItems;
};

window.twttr = (function(d, s, id) {
  var t, js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);
  return window.twttr || (t = { _e: [], ready: function(f) { t._e.push(f) } });
}(document, "script", "twitter-wjs"));

twttr.ready(function(twttr) {
  twttr.widgets.load();
  setInterval(function() {
    twttr.widgets.load();
    // console.log("update twitter timeline");
  }, 1000);
});
