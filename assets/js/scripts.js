function driftMessenger() {

  const t = window.driftt = window.drift = window.driftt || [];
  if (!t.init) {
    if (t.invoked) return void(window.console && console.error && console.error("Drift snippet included twice."));
    t.invoked = !0, t.methods = ["identify", "config", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on"],
      t.factory = function(e) {
        return function() {
          const n = Array.prototype.slice.call(arguments);
          return n.unshift(e), t.push(n), t;
        };
      }, t.methods.forEach(function(e) {
        t[e] = t.factory(e);
      }), t.load = function(t) {
        const e = 3e5,
          n = Math.ceil(new Date() / e) * e,
          o = document.createElement("script");
        o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + n + "/" + t + ".js";
        const i = document.getElementsByTagName("script")[0];
        i.parentNode.insertBefore(o, i);
      };
  }

  drift.SNIPPET_VERSION = '0.3.1';
  drift.load('9ad3433dnnis');

};

// Utility function
function krunch() {};


/*
  Developer options
  @methodOf log('','');
  @enable with `console.log(msg, req);`
  @disable with `console.log();`
*/
const log = function(msg, req) {
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

  const frag = document.createDocumentFragment();
  const temp = document.createElement('y');

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

  const element = injectDOM('<y class="w-screen" id="ba194bb5a0b6e42d520d17a3b75f5962"></y><style>#ba194bb5a0b6e42d520d17a3b75f5962{color:#fff;font-size:0.8em;text-align:center;width:100%;top:0;left:0;z-index:999999;position:fixed;box-shadow: 0 0 3px #192127;}.is-online{background:transparent;padding:0}.is-online:after{visibility:visible;content:"";}.is-offline{background:#42505a;padding:0.2rem}.is-offline:after{visibility:visible;content:"No connection!"}</style>');
  document.body.insertBefore(element, document.body.childNodes[0]);

  try {
    window.addEventListener('DOMContentLoaded', function() {

      function checkStatus() {
        // display status
        window.document.getElementById('ba194bb5a0b6e42d520d17a3b75f5962')
          .className = navigator.onLine ? 'is-online' : 'is-offline';
        log('(CONN) ' + window.document.getElementById('ba194bb5a0b6e42d520d17a3b75f5962').className, '');
      }

      setInterval(function() {
        // check connection
        window.addEventListener('online', checkStatus);
        window.addEventListener('offline', checkStatus);
      }, 500)

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


/*
  Localization processor
  @methofOf locale
  @param {id} html element id
  @param {data} specify payload from json e.g. 'common:button.save'
*/
function localeProcessor(id, data) {

  const getId = id;
  let getData = data;

  locale
    .use(XHRBackend)
    .use(BrowserLanguageDetector)
    .init({ // init processor
      fallbackLang: 'en',
      debug: true,
      namespace: ['special', 'common'],
      defaultNS: 'special',
      backend: {
        loadPath: 'assets/locale/{{lng}}/{{namespace}}.json', // !! default
        crossDomain: true
      }
    }, function(err, t) {
      updatePayload(getId, getData); // init set content
    });

  function updatePayload(getId, getData) {

    const getElementId = document.getElementById(getId);
    let getLocaleValue = locale.t(getData);

    getElementId.innerHTML = getLocaleValue;
  };

  locale.on('languageChanged', function() {
    updatePayload(getId, getData);
  });

};


/*
  Localization Worker
  @param {array}
*/
function localeGenerator(array) {
  for (let i = 0; i < array.length; i++) {
    let obj = array[i]
    localeProcessor(obj.id, obj.data);
  }
};


/*
  Get ids and initialize localization
*/
krunch.lang = function() {

  const file = 'assets/locale/id.json';

  fetch(file).then(function(response) {
    return response.json();
  }).then(function(data) {
    localeGenerator(data);
    log('(LANG) (id)', data);
  }).catch(function(err) {
    log('(LANG) (ERR)', err);
  });
};


/*
  Trigger for changing locales
  @param {lang} as in e.g. 'en', 'de'
*/
krunch.langTrigger = function(lang) {
  locale.changeLanguage(lang);
};


/*
  Adaptive Image Loader
  @param {null}
  @usage,
    <img class="adaptive"
         src="assets/image/low/image.jpg"
         data-src="assets/image/high/image.jpg">
*/
krunch.adaptiveImageLoader = function() {

  const images = document.getElementsByClassName('adaptive')

  Array.from(images).map(imageElement => {

    const adaptive = new Image(); // start loading image
    adaptive.src = imageElement.dataset.src;

    // once image is loaded replace the src of the HTML element
    adaptive.onload = function() {
      imageElement.classList.remove('adaptive')
      if ('IMG' === imageElement.nodeName) imageElement.src = adaptive.src
      else imageElement.style.backgroundImage = `url(${adaptive.src})`
    };

  })
};


/*
  Display browser network properties
  @param {null}
 */
krunch.networkSpeed = function() {
  // network type that browser uses
  log('(Network Type) ' + navigator.connection.type);
  // effective bandwidth estimate
  log('(Downlink) ' + navigator.connection.downlink + ' MBytes/s', '');
  // effective round-trip time estimate
  log('(Round-Trip Time) ' + navigator.connection.rtt + ' miliseconds', '');
  // upper bound on the downlink speed of the first network hop
  log('(Downlink Max) ' + navigator.connection.downlinkMax + ' MBytes/s', '');
  // effective connection type determined using a combination of recently
  // observed rtt and downlink values: ' +
  ('(Effective Type) ' + navigator.connection.effectiveType, '');
  // true if the user has requested a reduced data usage mode from the
  // user agent.
  log('(DataSaver Mode) ' + navigator.connection.saveData, '');
};

/*
  DMCA Protection Badge & Tracker
  @param {null}
*/
function dmcaProtection() {
  document.addEventListener("DOMContentLoaded", function() {
    var e = "dmca-badge";
    var t = "refurl";
    var n = document.querySelectorAll('a.' + e);
    if (n[0].getAttribute("href").indexOf("refurl") < 0) {
      for (var r = 0; r < n.length; r++) {
        var i = n[r];
        i.href = i.href + (i.href.indexOf("?") === -1 ? "?" : "&") + t + "=" + document.location
      }
    }
  }, false)
};

/*
  Google Analytics Tracker
  @param {null}
*/
function googleAnalytics() {

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments)
  };

  gtag('js', new Date());
  gtag('config', 'UA-109094106-2');
};

function greeting() {};

greeting.withTime = function() {

  const time = new Date().getHours();
  const msg = " Are you coming here to hire me?";

  if (time < 12) { // morning

    const yelling = '<strong>Good morning!</strong>' + msg;
    snicker.onLoad(yelling, 15000);

  }
  else if (time < 20) { // evening

    const yelling = '<strong>Good evening!</strong>' + msg;
    snicker.onLoad(yelling, 15000);

  }
  else { // night

    const yelling = '<strong>Good night!</strong>' + msg;
    snicker.onLoad(yelling, 15000);

  }

};

function popup() {};

window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();


window.cancelRequestAnimFrame = (function() {
  return (
    window.cancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame ||
    window.oCancelRequestAnimationFrame ||
    window.msCancelRequestAnimationFrame ||
    clearTimeout
  );
})();


/*
  Fullscreen Popup Image
  @param {elment_id}

  use krunch component lifecycle callback `onUpdated()` after the `onMounted()`
*/
popup.image = (function() {

  "use strict";

  var KEYCODE_ESC = 27;

  // track both the current and destination mouse coordinates
  // destination coordinates are non-eased actual mouse coordinates
  var mouse = { xCurr: 0, yCurr: 0, xDest: 0, yDest: 0 };

  var horizontalOrientation = true;

  // holds the animation frame id.
  var looper;

  // current position of scrolly element
  var lastPosition,
    currentPosition = 0;

  var sourceDimensions, target;
  var targetDimensions = { w: 0, h: 0 };

  var container;
  var containerDimensions = { w: 0, h: 0 };
  var overflowArea = { x: 0, y: 0 };

  // overflow variable before screen is locked.
  var overflowValue;

  /* -------------------------
  /*          UTILS
  /* -------------------------*/

  // soft object augmentation
  function extend(target, source) {
    for (var key in source)
      if (!(key in target)) target[key] = source[key];

    return target;
  }


  // applys a dict of css properties to an element
  function applyProperties(target, properties) {
    for (var key in properties) {
      target.style[key] = properties[key];
    }
  }


  // returns whether target a vertical or horizontal fit in the page.
  // as well as the right fitting width/height of the image.
  function getFit(source) {
    var heightRatio = window.innerHeight / source.h;

    if (source.w * heightRatio > window.innerWidth) {
      return {
        w: source.w * heightRatio,
        h: source.h * heightRatio,
        fit: true
      };
    }
    else {
      var widthRatio = window.innerWidth / source.w;
      return { w: source.w * widthRatio, h: source.h * widthRatio, fit: false };
    }
  }

  /* -------------------------
  /*          APP
  /* -------------------------*/

  function startTracking(passedElements) {
    var i;

    // if passed an array of elements, assign tracking to all.
    if (passedElements.length) {
      // loop and assign
      for (i = 0; i < passedElements.length; i++) {
        track(passedElements[i]);
      }
    }
    else {
      track(passedElements);
    }
  }


  function track(element) {
    // element needs a src at minumun.
    if (element.getAttribute("data-src") || element.src) {
      element.addEventListener(
        "click",
        function() {
          init(this);
        },
        false
      );
    }
  }


  function start() {
    loop();
  }


  function stop() {
    cancelRequestAnimFrame(looper);
  }


  function loop() {
    looper = requestAnimFrame(loop);
    positionTarget();
  }


  // lock scroll on the document body.
  function lockBody() {
    overflowValue = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }


  // unlock scroll on the document body.
  function unlockBody() {
    document.body.style.overflow = overflowValue;
  }


  function createViewer(title, caption) {
    /*
     *  Container
     */
    var containerProperties = {
      backgroundColor: "rgba(0,0,0,0.8)",
      width: "100%",
      height: "100%",
      position: "fixed",
      top: "0px",
      left: "0px",
      overflow: "hidden",
      zIndex: "999999",
      margin: "0px",
      webkitTransition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )",
      MozTransition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )",
      transition: "opacity 150ms cubic-bezier( 0, 0, .26, 1 )",
      opacity: "0"
    };
    container = document.createElement("figure");
    container.appendChild(target);
    applyProperties(container, containerProperties);

    var imageProperties = {
      cursor: 'url( "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3Q0IyNDI3M0FFMkYxMUUzOEQzQUQ5NTMxMDAwQjJGRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3Q0IyNDI3NEFFMkYxMUUzOEQzQUQ5NTMxMDAwQjJGRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdDQjI0MjcxQUUyRjExRTM4RDNBRDk1MzEwMDBCMkZEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdDQjI0MjcyQUUyRjExRTM4RDNBRDk1MzEwMDBCMkZEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+soZ1WgAABp5JREFUeNrcWn9M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" ) 25 25, no-drop'
    };
    applyProperties(target, imageProperties);

    /*
     *  Caption Container
     */
    var captionContainerProperties = {
      fontFamily: 'Poppins, Sans-Serif',
      position: "fixed",
      bottom: "0px",
      left: "0px",
      padding: "25px",
      color: "#fff",
      wordSpacing: "0.2px",
      webkitFontSmoothing: "antialiased",
      textShadow: "-1px 0px 1px rgba(0,0,0,0.4)",
      backgroundColor: "rgba(0,0,0,0.9)"
    };
    var captionContainer = document.createElement("figcaption");
    applyProperties(captionContainer, captionContainerProperties);

    /*
     *  Caption Title
     */
    if (title) {
      var captionTitleProperties = {
        margin: "0px",
        padding: "0px",
        fontWeight: "normal",
        fontSize: "14px",
        letterSpacing: "0.1px",
        maxWidth: "500px",
        textAlign: "left",
        background: "none",
        marginTop: "5px"
      };
      var captionTitle = document.createElement("h1");
      applyProperties(captionTitle, captionTitleProperties);
      captionTitle.innerHTML = title;
      captionContainer.appendChild(captionTitle);
    }

    if (caption) {
      var captionTextProperties = {
        margin: "0px",
        padding: "0px",
        fontWeight: "normal",
        fontSize: "14px",
        letterSpacing: "0.1px",
        maxWidth: "500px",
        textAlign: "left",
        background: "none",
        marginTop: "5px"
      };
      var captionText = document.createElement("h2");
      applyProperties(captionText, captionTextProperties);
      captionText.innerHTML = caption;
      captionContainer.appendChild(captionText);
    }

    container.appendChild(captionContainer);

    setDimensions();

    mouse.xCurr = mouse.xDest = window.innerWidth / 2;
    mouse.yCurr = mouse.yDest = window.innerHeight / 2;

    document.body.appendChild(container);
    setTimeout(function() {
      container.style["opacity"] = "1";
    }, 10);
  }


  function removeViewer() {
    unlockBody();
    unbindEvents();
    stop();
    document.body.removeChild(container);
  }


  function setDimensions() {
    // Manually set height to stop bug where
    var imageDimensions = getFit(sourceDimensions);
    target.width = imageDimensions.w;
    target.height = imageDimensions.h;
    horizontalOrientation = imageDimensions.fit;

    targetDimensions = { w: target.width, h: target.height };
    containerDimensions = { w: window.innerWidth, h: window.innerHeight };
    overflowArea = {
      x: containerDimensions.w - targetDimensions.w,
      y: containerDimensions.h - targetDimensions.h
    };
  }


  function init(element) {
    var imageSource = element.getAttribute("data-src") || element.src;
    var title = element.getAttribute("data-title");
    var caption = element.getAttribute("data-caption");

    var img = new Image();
    img.onload = function() {
      sourceDimensions = { w: img.width, h: img.height }; // save original dimensions for later.
      target = this;
      createViewer(title, caption);
      lockBody();
      bindEvents();
      loop();
    };
    img.src = imageSource;
  }


  function bindEvents() {
    container.addEventListener("mousemove", onMouseMove, false);
    container.addEventListener("touchmove", onTouchMove, false);
    window.addEventListener("resize", setDimensions, false);
    window.addEventListener("keyup", onKeyUp, false);
    target.addEventListener("click", removeViewer, false);
  }


  function unbindEvents() {
    container.removeEventListener("mousemove", onMouseMove, false);
    container.removeEventListener("touchmove", onTouchMove, false);
    window.removeEventListener("resize", setDimensions, false);
    window.removeEventListener("keyup", onKeyUp, false);
    target.removeEventListener("click", removeViewer, false);
  }


  function onMouseMove(event) {
    mouse.xDest = event.clientX;
    mouse.yDest = event.clientY;
  }


  function onTouchMove(event) {
    event.preventDefault(); // needed to keep this event firing.
    mouse.xDest = event.touches[0].clientX;
    mouse.yDest = event.touches[0].clientY;
  }


  // exit on excape key pressed;
  function onKeyUp(event) {
    event.preventDefault();
    if (event.keyCode === KEYCODE_ESC) {
      removeViewer();
    }
  }


  function positionTarget() {
    mouse.xCurr += (mouse.xDest - mouse.xCurr) * 0.05;
    mouse.yCurr += (mouse.yDest - mouse.yCurr) * 0.05;

    if (horizontalOrientation === true) {
      // horizontal scanning
      currentPosition += mouse.xCurr - currentPosition;
      if (mouse.xCurr !== lastPosition) {
        var position = parseFloat(currentPosition / containerDimensions.w);
        position = overflowArea.x * position;
        target.style["webkitTransform"] =
          "translate3d(" + position + "px, 0px, 0px)";
        target.style["MozTransform"] =
          "translate3d(" + position + "px, 0px, 0px)";
        target.style["msTransform"] =
          "translate3d(" + position + "px, 0px, 0px)";
        lastPosition = mouse.xCurr;
      }
    }
    else if (horizontalOrientation === false) {
      // vertical scanning
      currentPosition += mouse.yCurr - currentPosition;
      if (mouse.yCurr !== lastPosition) {
        var position = parseFloat(currentPosition / containerDimensions.h);
        position = overflowArea.y * position;
        target.style["webkitTransform"] =
          "translate3d( 0px, " + position + "px, 0px)";
        target.style["MozTransform"] =
          "translate3d( 0px, " + position + "px, 0px)";
        target.style["msTransform"] =
          "translate3d( 0px, " + position + "px, 0px)";
        lastPosition = mouse.yCurr;
      }
    }
  }


  function main(element) {
    // parse arguments
    if (!element) {
      throw "(ERR) you need to pass an element!";
    }

    startTracking(element);
  }


  return extend(main, {
    resize: setDimensions,
    start: start,
    stop: stop
  });

})();


/*
  Should Call `popup.image()` On Touch Device
  @param {element_id}
*/
popup.imageNotTouchDevice = function(id) {
  try {
    document.createEvent("TouchEvent")
    const img = document.querySelectorAll(id)
    popup.image(img)
    return true
  }
  catch (error) {
    return false
  }
};


/*
  Never Call `popup.image()` On Touch Device
  @param {element_id}
*/
popup.imageTouchDevice = function(id) {
  try {
    document.createEvent("TouchEvent")
    return true
  }
  catch (error) {
    const img = document.querySelectorAll(id)
    popup.image(img)
    return false
  }
};
function progressbar() {};


const reader = {

  "defaults": {
    "color": "rgba(49, 130, 206, 1)",
    "height": "3px",
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0,
    "zIndex": 9999,
    "ontop": true, // bottom or top
    "ltr": true, // left to right
    "attach": false, // element to use value
    "css": false, // js style or css
    "round": false, // decimal numbers
    "nobar": false // use only values
  },
  "start": function(configs = {}) {

    let progressJSelem;

    if (!configs.nobar) {

      //create element
      progressJSelem = document.createElement("y");
      //use css instead of js style
      progressJSelem.setAttribute('id', 'pageReadProgressBar');
      //append to body
      document.body.appendChild(progressJSelem);
      //styles
      progressJSelem.style.position = 'fixed';
      progressJSelem.style.zIndex = '99999';
      progressJSelem.style.width = '0%';

      //configurable options
      //top or bottom
      configs.ontop ? progressJSelem.style.bottom = '0' : progressJSelem.style.top = reader.defaults.top;
      //ltr or rtl
      configs.ltr ? progressJSelem.style.right = '0' : progressJSelem.style.left = reader.defaults.left;
      //height
      configs.height ? progressJSelem.style.height = configs.height : progressJSelem.style.height = reader.defaults.height;
      //color
      configs.color ? progressJSelem.style.backgroundColor = configs.color : progressJSelem.style.backgroundColor = reader.defaults.color;

    }

    let attachElem = reader.defaults.attach;
    let roundto = reader.defaults.round;

    //round to
    configs.round ? roundto = configs.round : roundto = 2;
    //attach
    configs.attach ? attachElem = document.querySelector(configs.attach) : false;

    //scroll event
    document.addEventListener('scroll', function(e) {

      const maxHeight = document.body.scrollHeight;
      const sizeHeight = window.innerHeight;
      const scrolls = window.scrollY;
      const percentage = (scrolls / (maxHeight - sizeHeight)) * 100;

      if (!configs.nobar) {
        progressJSelem.style.width = percentage.toFixed(roundto) + "%";
      }
      if (attachElem) {
        attachElem.innerHTML = percentage.toFixed(roundto);
      }

    });

  }
};


/*
  Init page reading progress bar
  @param {null}
*/
progressbar.pageRead = function() {
  document.addEventListener("DOMContentLoaded", function(event) {
    reader.start();
  });
};

function snicker() {};

/*
  Snicker UI Decorator
  @param {data}
  @param {duration}
*/
function snickerUI(data, duration) {
  const element = document.createElement("y");
  const css ="position:fixed; bottom:13%; left:3%; right:3%; width:fit-content; color:#fff; background-color:#25313a; padding:1em; font-size:0.8em; font-family:inherit; border-radius:3px; box-shadow: 0 0 4px #0a0e10; z-index:999;";
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
  const evt = document.getElementById(id);
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

/*
  Get Total Posts from JSON data
  @param {id}
  @param {data}
*/
function totalPosts(id, data) {
  const showTotalItems = document.getElementById(id);
  const getTotalItems = Object.keys(data).length;
  showTotalItems.innerHTML = showTotalItems.innerHTML + getTotalItems;
};
