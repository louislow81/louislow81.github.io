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

function greeting() {}

greeting.withTime = function() {

  const time = new Date().getHours();
  const msg = " Are you coming here to hire me?";

  if (time < 12) { // morning

    const yelling = "<strong>Good morning!</strong>" + msg;
    snicker.onLoad(yelling, 10000);

  } else if (time < 20) { // evening

    const yelling = "<strong>Good evening!</strong>" + msg;
    snicker.onLoad(yelling, 10000);

  } else { // night

    const yelling = "<strong>Good night!</strong>" + msg;
    snicker.onLoad(yelling, 10000);

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
      cursor: 'url( "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3Q0IyNDI3M0FFMkYxMUUzOEQzQUQ5NTMxMDAwQjJGRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3Q0IyNDI3NEFFMkYxMUUzOEQzQUQ5NTMxMDAwQjJGRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdDQjI0MjcxQUUyRjExRTM4RDNBRDk1MzEwMDBCMkZEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdDQjI0MjcyQUUyRjExRTM4RDNBRDk1MzEwMDBCMkZEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+soZ1WgAABp5JREFUeNrcWn9MlVUY/u4dogIapV0gQ0SUO4WAXdT8B5ULc6uFgK3MLFxzFrQFZMtaed0oKTPj1x8EbbZZK5fNCdLWcvxQ+EOHyAQlBgiIVFxAJuUF7YrQ81zOtU+8F+Pe78K1d3s5537f+fE8nPec7z3vOSpJIRkbGwtEEgtdBdVCl0AXQr2hKqgJeg16BdoCrYNWqVSqbif7VQT8YqgB2jTmuDSJNoIcJUJVOVg5EsmH0Oehaj4bGRkZ6uvra2xvb29oamrqbGxs7K2vrx/s7Oy8yffBwcFzdTqdb0REhF9YWFhwSEhIpEajifDw8PAWzY5Cj0GzMUoNUx0R1RQJaJAcgKaw7ujo6O2urq7qysrKioyMjHNDQ0OjU2nP29tbnZ+fv1qv18cFBQWtU6vVs9gN9BvobhDqU5wIKryA5CuoLwj83dzc/NOePXuOlpSUXFNijiUlJS3ct2/fiytWrHgOhGbj0SD0dZD5UREiKOiJJA+axt9Go7F2165deUeOHOmVXCBbt271y8nJyfD3939aPCqCZoCQ2WEiKOQj7HYjzejUqVNFcXFxJdI0SEVFRdKGDRtShbmd5HwEGZM9IupJSHiJBjaazebr2dnZmdNFgsK+2Cf7JgZiEZhsimoSc/oZqh8eHjamp6fvPnTo0O/SDMiOHTsWFRQUHPDy8vLnQEGflZvZpKaFl4WcE7du3epPTU19+/Dhwz3SDMr27dsDioqKcufMmfM45wyIpD3QtPBiC0lgTowcPHgwa6ZJUIiBWIgJP1OB8aVJTQsFnkDSxCUWk60gPj6+VHIjKS8vT8TcSRdLcxhG5g+bpoWH3yF5ube3tw7L33uSGwqW/8/8/Pzoz30PItvuMy080HEZx/CZDQZDgeSmQmzESKwC870jgodcWhPhJx0LDw8vlNxYLl269Cb8Nfp5NP2kuyMiPM8EfvTodkhuLsQoJn4C/VG5ab3CfHd3d41SvpMrhRiBtVrgf01OZBv/nIRID4nIsG6xzBGxs7vK/YSvr2/SVF3xiYL55bVgwYJZp0+f/nOycuvXr38E+xczvOibjvTDLcDg4OBx7GfoD4ZwRPR8gUYbnCUBF3wuHMtPy8rKcmJjY33tleM7lqmpqdnPOo70RazAfNHapFrssaWOjo6Lzg43vj2zPT09febNm7ektLT0C1tk+IzvWIZlWcfR/oC5UWSjSCSUudbW1qvOEqmqqhrcvHnzOzdu3Lhii4ycBMuwLOs42t/ly5etmLUkEsJcbW3tbwq5ETbJ2CLBss70dfbsWSvmpZzsnJTzo6KiEhoaGoaVWlXkwE0mkyXk4+PjE6gUCUpMTMz86urq48gOkIjFWYHfEqf0EkkyJ06cyCMB/iah5OTkTCVIUDQajQf8wl+QNaune/2/c+eOS9olkb+YiYyM9FJ6NGhaHA2OBJV5e6uZI6LVaq2YTSTSz9zatWsfc8X84JzYtGlTJtXeauaorFy5cr7IXieRdubWrFnzpCtIJCYmWpZYKvNKksE/34q5g0RamQsNDV3sKhLy74ySZJYtW2bF3EIidZaFeOnSp5wl0t/fb4aYbJGwRYZlWcfR/mSYL8idRhOcxuTpdBoHBgZuY5Pk0LfrPqdRnE8080Fubm60Aru34QeRoLCMoyQoxCpItFnnCIVBB2kj5GHZj8iw/iDfWJHIaGBgYAyj4u5OghiBdZ00fqby9V0iMK8rSMoYMGZo392JECOwehAztHNipPFjxiGw0UnYuXPnInclQWzEKI0fCH1kL9JoCdAZjcZzAQEB77sjkZ6env3YjK22G6AT8i7DkSzI8KS7kSAmQWJQYL3HabwrjKVK4mQKX9w0g8EQ6i4k9u7dqyUm8TNNYJVsmpbMxL5EkuouxwopKSn+xcXFeeJYoRgkUmVYJyXirgc9ldBnbB302NxYiYJcGc6wgcLCwvysrCztTJgT+xYkzhCTvUPR//9hqBgZkxiZYjao1+vf4vLH4XalKbEP9iVIFIuRME2K9b92MOHCAEOdZS66MJAAAp5iiX0DBI4+ANfUiIhKvMLxOfRVSXaFA2ZQnpmZWefIFY68vLxVMNf4CVc4vuV3wiVXOCZUjkLygXTvpRoTL9Uw9NrS0tJVX1/fc/78+ettbW2WIPXy5cvnRkdHP6rT6QK0Wm0QNkXhGo0mUrjikvTvpZpPQODCFLA4bw6ya06/OnHNqXnGrjnZIyWNXzyjC0GPYIk0fvHM+h+XXzxjnOCcNH7x7KqT/VrSfwQYAOAcX9HTDttYAAAAAElFTkSuQmCC" ) 25 25, no-drop'
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
var isMobile = {

  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
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

(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ScrollReveal = factory());
}(this, (function() {
  
  'use strict';

  var defaults = {
    delay: 0,
    distance: '0',
    duration: 200,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    interval: 0,
    opacity: 0,
    origin: 'bottom',
    rotate: {
      x: 0,
      y: 0,
      z: 0
    },
    scale: 1,
    cleanup: false,
    container: document.documentElement,
    desktop: true,
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor: 0.0,
    viewOffset: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    afterReset: function afterReset() {},
    afterReveal: function afterReveal() {},
    beforeReset: function beforeReset() {},
    beforeReveal: function beforeReveal() {}
  }


  function failure() {
    document.documentElement.classList.remove('sr');

    return {
      clean: function clean() {},
      destroy: function destroy() {},
      reveal: function reveal() {},
      sync: function sync() {},
      get noop() {
        return true
      }
    }
  }


  function success() {
    document.documentElement.classList.add('sr');

    if (document.body) {
      document.body.style.height = '100%';
    }
    else {
      document.addEventListener('DOMContentLoaded', function() {
        document.body.style.height = '100%';
      });
    }
  }

  var mount = { success: success, failure: failure }

  function isDomNode(x) {
    return typeof window.Node === 'object' ?
      x instanceof window.Node :
      x !== null &&
      typeof x === 'object' &&
      typeof x.nodeType === 'number' &&
      typeof x.nodeName === 'string'
  }


  function isDomNodeList(x) {
    var prototypeToString = Object.prototype.toString.call(x);
    var regex = /^\[object (HTMLCollection|NodeList|Object)\]$/;

    return typeof window.NodeList === 'object' ?
      x instanceof window.NodeList :
      x !== null &&
      typeof x === 'object' &&
      typeof x.length === 'number' &&
      regex.test(prototypeToString) &&
      (x.length === 0 || isDomNode(x[0]))
  }


  function tealight(target, context) {
    if (context === void 0) { context = document; }

    if (target instanceof Array) { return target.filter(isDomNode); }
    if (isDomNode(target)) { return [target]; }
    if (isDomNodeList(target)) { return Array.prototype.slice.call(target); }
    if (typeof target === "string") {
      try {
        var query = context.querySelectorAll(target);
        return Array.prototype.slice.call(query);
      }
      catch (err) {
        return [];
      }
    }
    return [];
  }

  function isObject(x) {
    return (
      x !== null &&
      x instanceof Object &&
      (x.constructor === Object ||
        Object.prototype.toString.call(x) === '[object Object]')
    )
  }

  function each(collection, callback) {
    if (isObject(collection)) {
      var keys = Object.keys(collection);
      return keys.forEach(function(key) { return callback(collection[key], key, collection); })
    }
    if (collection instanceof Array) {
      return collection.forEach(function(item, i) { return callback(item, i, collection); })
    }
    throw new TypeError('Expected either an array or object literal.')
  }

  function logger(message) {
    var details = [],
      len = arguments.length - 1;
    while (len-- > 0) details[len] = arguments[len + 1];

    if (this.constructor.debug && console) {
      var report = "%cScrollReveal: " + message;
      details.forEach(function(detail) { return (report += "\n — " + detail); });
      console.log(report, 'color: #ea654b;'); // eslint-disable-line no-console
    }
  }

  function rinse() {
    var this$1 = this;

    var struct = function() {
      return ({
        active: [],
        stale: []
      });
    };

    var elementIds = struct();
    var sequenceIds = struct();
    var containerIds = struct();

    /**
     * Take stock of active element IDs.
     */
    try {
      each(tealight('[data-sr-id]'), function(node) {
        var id = parseInt(node.getAttribute('data-sr-id'));
        elementIds.active.push(id);
      });
    }
    catch (e) {
      throw e
    }
    /**
     * Destroy stale elements.
     */
    each(this.store.elements, function(element) {
      if (elementIds.active.indexOf(element.id) === -1) {
        elementIds.stale.push(element.id);
      }
    });

    each(elementIds.stale, function(staleId) { return delete this$1.store.elements[staleId]; });

    /**
     * Take stock of active container and sequence IDs.
     */
    each(this.store.elements, function(element) {
      if (containerIds.active.indexOf(element.containerId) === -1) {
        containerIds.active.push(element.containerId);
      }
      if (element.hasOwnProperty('sequence')) {
        if (sequenceIds.active.indexOf(element.sequence.id) === -1) {
          sequenceIds.active.push(element.sequence.id);
        }
      }
    });

    /**
     * Destroy stale containers.
     */
    each(this.store.containers, function(container) {
      if (containerIds.active.indexOf(container.id) === -1) {
        containerIds.stale.push(container.id);
      }
    });

    each(containerIds.stale, function(staleId) {
      var stale = this$1.store.containers[staleId].node;
      stale.removeEventListener('scroll', this$1.delegate);
      stale.removeEventListener('resize', this$1.delegate);
      delete this$1.store.containers[staleId];
    });

    /**
     * Destroy stale sequences.
     */
    each(this.store.sequences, function(sequence) {
      if (sequenceIds.active.indexOf(sequence.id) === -1) {
        sequenceIds.stale.push(sequence.id);
      }
    });

    each(sequenceIds.stale, function(staleId) { return delete this$1.store.sequences[staleId]; });
  }


  function clean(target) {
    
    var this$1 = this;
    var dirty;

    try {
      each(tealight(target), function(node) {
        var id = node.getAttribute('data-sr-id');
        if (id !== null) {
          dirty = true;
          var element = this$1.store.elements[id];
          if (element.callbackTimer) {
            window.clearTimeout(element.callbackTimer.clock);
          }
          node.setAttribute('style', element.styles.inline.generated);
          node.removeAttribute('data-sr-id');
          delete this$1.store.elements[id];
        }
      });
    }
    catch (e) {
      return logger.call(this, 'Clean failed.', e.message)
    }

    if (dirty) {
      try {
        rinse.call(this);
      }
      catch (e) {
        return logger.call(this, 'Clean failed.', e.message)
      }
    }
  }

  function destroy() {

    var this$1 = this;

    /**
     * Remove all generated styles and element ids
     */
    each(this.store.elements, function(element) {
      element.node.setAttribute('style', element.styles.inline.generated);
      element.node.removeAttribute('data-sr-id');
    });

    /**
     * Remove all event listeners.
     */
    each(this.store.containers, function(container) {
      var target =
        container.node === document.documentElement ? window : container.node;
      target.removeEventListener('scroll', this$1.delegate);
      target.removeEventListener('resize', this$1.delegate);
    });

    /**
     * Clear all data from the store
     */
    this.store = {
      containers: {},
      elements: {},
      history: [],
      sequences: {}
    };
  }


  /**
   * @module Rematrix
   */

  /**
   * Transformation matrices in the browser come in two flavors:
   *
   *  - `matrix` using 6 values (short)
   *  - `matrix3d` using 16 values (long)
   *
   * This utility follows this [conversion guide](https://goo.gl/EJlUQ1)
   * to expand short form matrices to their equivalent long form.
   *
   * @param  {array} source - Accepts both short and long form matrices.
   * @return {array}
   */
  function format(source) {
    if (source.constructor !== Array) {
      throw new TypeError('Expected array.')
    }
    if (source.length === 16) {
      return source
    }
    if (source.length === 6) {
      var matrix = identity();
      matrix[0] = source[0];
      matrix[1] = source[1];
      matrix[4] = source[2];
      matrix[5] = source[3];
      matrix[12] = source[4];
      matrix[13] = source[5];
      return matrix
    }
    throw new RangeError('Expected array with either 6 or 16 values.')
  }


  /**
   * Returns a matrix representing no transformation. The product of any matrix
   * multiplied by the identity matrix will be the original matrix.
   *
   * > **Tip:** Similar to how `5 * 1 === 5`, where `1` is the identity.
   *
   * @return {array}
   */
  function identity() {
    var matrix = [];
    for (var i = 0; i < 16; i++) {
      i % 5 == 0 ? matrix.push(1) : matrix.push(0);
    }
    return matrix
  }


  /**
   * Returns a 4x4 matrix describing the combined transformations
   * of both arguments.
   *
   * > **Note:** Order is very important. For example, rotating 45°
   * along the Z-axis, followed by translating 500 pixels along the
   * Y-axis... is not the same as translating 500 pixels along the
   * Y-axis, followed by rotating 45° along on the Z-axis.
   *
   * @param  {array} m - Accepts both short and long form matrices.
   * @param  {array} x - Accepts both short and long form matrices.
   * @return {array}
   */
  function multiply(m, x) {
    var fm = format(m);
    var fx = format(x);
    var product = [];

    for (var i = 0; i < 4; i++) {
      var row = [fm[i], fm[i + 4], fm[i + 8], fm[i + 12]];
      for (var j = 0; j < 4; j++) {
        var k = j * 4;
        var col = [fx[k], fx[k + 1], fx[k + 2], fx[k + 3]];
        var result =
          row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3];

        product[i + k] = result;
      }
    }

    return product
  }


  /**
   * Attempts to return a 4x4 matrix describing the CSS transform
   * matrix passed in, but will return the identity matrix as a
   * fallback.
   *
   * > **Tip:** This method is used to convert a CSS matrix (retrieved as a
   * `string` from computed styles) to its equivalent array format.
   *
   * @param  {string} source - `matrix` or `matrix3d` CSS Transform value.
   * @return {array}
   */
  function parse(source) {
    if (typeof source === 'string') {
      var match = source.match(/matrix(3d)?\(([^)]+)\)/);
      if (match) {
        var raw = match[2].split(', ').map(parseFloat);
        return format(raw)
      }
    }
    return identity()
  }


  /**
   * Returns a 4x4 matrix describing X-axis rotation.
   *
   * @param  {number} angle - Measured in degrees.
   * @return {array}
   */
  function rotateX(angle) {

    var theta = Math.PI / 180 * angle;
    var matrix = identity();

    matrix[5] = matrix[10] = Math.cos(theta);
    matrix[6] = matrix[9] = Math.sin(theta);
    matrix[9] *= -1;

    return matrix
  }


  /**
   * Returns a 4x4 matrix describing Y-axis rotation.
   *
   * @param  {number} angle - Measured in degrees.
   * @return {array}
   */
  function rotateY(angle) {

    var theta = Math.PI / 180 * angle;
    var matrix = identity();

    matrix[0] = matrix[10] = Math.cos(theta);
    matrix[2] = matrix[8] = Math.sin(theta);
    matrix[2] *= -1;

    return matrix
  }


  /**
   * Returns a 4x4 matrix describing Z-axis rotation.
   *
   * @param  {number} angle - Measured in degrees.
   * @return {array}
   */
  function rotateZ(angle) {

    var theta = Math.PI / 180 * angle;
    var matrix = identity();

    matrix[0] = matrix[5] = Math.cos(theta);
    matrix[1] = matrix[4] = Math.sin(theta);
    matrix[4] *= -1;

    return matrix
  }


  /**
   * Returns a 4x4 matrix describing 2D scaling. The first argument
   * is used for both X and Y-axis scaling, unless an optional
   * second argument is provided to explicitly define Y-axis scaling.
   *
   * @param  {number} scalar    - Decimal multiplier.
   * @param  {number} [scalarY] - Decimal multiplier.
   * @return {array}
   */
  function scale(scalar, scalarY) {

    var matrix = identity();

    matrix[0] = scalar;
    matrix[5] = typeof scalarY === 'number' ? scalarY : scalar;

    return matrix
  }


  /**
   * Returns a 4x4 matrix describing X-axis translation.
   *
   * @param  {number} distance - Measured in pixels.
   * @return {array}
   */
  function translateX(distance) {
    var matrix = identity();
    matrix[12] = distance;
    return matrix
  }


  /**
   * Returns a 4x4 matrix describing Y-axis translation.
   *
   * @param  {number} distance - Measured in pixels.
   * @return {array}
   */
  function translateY(distance) {
    var matrix = identity();
    matrix[13] = distance;
    return matrix
  }


  var getPrefixedCssProp = (function() {

    var properties = {};
    var style = document.documentElement.style;

    function getPrefixedCssProperty(name, source) {
      if (source === void 0) source = style;

      if (name && typeof name === 'string') {
        if (properties[name]) {
          return properties[name]
        }
        if (typeof source[name] === 'string') {
          return (properties[name] = name)
        }
        if (typeof source[("-webkit-" + name)] === 'string') {
          return (properties[name] = "-webkit-" + name)
        }
        throw new RangeError(("Unable to find \"" + name + "\" style property."))
      }
      throw new TypeError('Expected a string.')
    }

    getPrefixedCssProperty.clearCache = function() { return (properties = {}); };

    return getPrefixedCssProperty
  })();


  function style(element) {
    var computed = window.getComputedStyle(element.node);
    var position = computed.position;
    var config = element.config;

    /**
     * Generate inline styles
     */
    var inline = {};
    var inlineStyle = element.node.getAttribute('style') || '';
    var inlineMatch = inlineStyle.match(/[\w-]+\s*:\s*[^;]+\s*/gi) || [];

    inline.computed = inlineMatch ? inlineMatch.map(function(m) { return m.trim(); }).join('; ') + ';' : '';

    inline.generated = inlineMatch.some(function(m) { return m.match(/visibility\s?:\s?visible/i); }) ?
      inline.computed :
      inlineMatch.concat(['visibility: visible']).map(function(m) { return m.trim(); }).join('; ') + ';';

    /**
     * Generate opacity styles
     */
    var computedOpacity = parseFloat(computed.opacity);
    var configOpacity = !isNaN(parseFloat(config.opacity)) ?
      parseFloat(config.opacity) :
      parseFloat(computed.opacity);

    var opacity = {
      computed: computedOpacity !== configOpacity ? ("opacity: " + computedOpacity + ";") : '',
      generated: computedOpacity !== configOpacity ? ("opacity: " + configOpacity + ";") : ''
    };

    /**
     * Generate transformation styles
     */
    var transformations = [];

    if (parseFloat(config.distance)) {
      var axis = config.origin === 'top' || config.origin === 'bottom' ? 'Y' : 'X';

      /**
       * Let’s make sure our our pixel distances are negative for top and left.
       * e.g. { origin: 'top', distance: '25px' } starts at `top: -25px` in CSS.
       */
      var distance = config.distance;
      if (config.origin === 'top' || config.origin === 'left') {
        distance = /^-/.test(distance) ? distance.substr(1) : ("-" + distance);
      }

      var ref = distance.match(/(^-?\d+\.?\d?)|(em$|px$|%$)/g);
      var value = ref[0];
      var unit = ref[1];

      switch (unit) {
        case 'em':
          distance = parseInt(computed.fontSize) * value;
          break
        case 'px':
          distance = value;
          break
        case '%':
          /**
           * Here we use `getBoundingClientRect` instead of
           * the existing data attached to `element.geometry`
           * because only the former includes any transformations
           * current applied to the element.
           *
           * If that behavior ends up being unintuitive, this
           * logic could instead utilize `element.geometry.height`
           * and `element.geoemetry.width` for the distaince calculation
           */
          distance =
            axis === 'Y' ?
            element.node.getBoundingClientRect().height * value / 100 :
            element.node.getBoundingClientRect().width * value / 100;
          break
        default:
          throw new RangeError('Unrecognized or missing distance unit.')
      }

      if (axis === 'Y') {
        transformations.push(translateY(distance));
      }
      else {
        transformations.push(translateX(distance));
      }
    }

    if (config.rotate.x) { transformations.push(rotateX(config.rotate.x)); }
    if (config.rotate.y) { transformations.push(rotateY(config.rotate.y)); }
    if (config.rotate.z) { transformations.push(rotateZ(config.rotate.z)); }
    if (config.scale !== 1) {
      if (config.scale === 0) {
        /**
         * The CSS Transforms matrix interpolation specification
         * basically disallows transitions of non-invertible
         * matrixes, which means browsers won't transition
         * elements with zero scale.
         *
         * That’s inconvenient for the API and developer
         * experience, so we simply nudge their value
         * slightly above zero; this allows browsers
         * to transition our element as expected.
         *
         * `0.0002` was the smallest number
         * that performed across browsers.
         */
        transformations.push(scale(0.0002));
      }
      else {
        transformations.push(scale(config.scale));
      }
    }

    var transform = {};
    if (transformations.length) {
      transform.property = getPrefixedCssProp('transform');
      /**
       * The default computed transform value should be one of:
       * undefined || 'none' || 'matrix()' || 'matrix3d()'
       */
      transform.computed = {
        raw: computed[transform.property],
        matrix: parse(computed[transform.property])
      };

      transformations.unshift(transform.computed.matrix);
      var product = transformations.reduce(multiply);

      transform.generated = {
        initial: ((transform.property) + ": matrix3d(" + (product.join(', ')) + ");"),
        final: ((transform.property) + ": matrix3d(" + (transform.computed.matrix.join(
          ', '
        )) + ");")
      };
    }
    else {
      transform.generated = {
        initial: '',
        final: ''
      };
    }

    /**
     * Generate transition styles
     */
    var transition = {};
    if (opacity.generated || transform.generated.initial) {
      transition.property = getPrefixedCssProp('transition');
      transition.computed = computed[transition.property];
      transition.fragments = [];

      var delay = config.delay;
      var duration = config.duration;
      var easing = config.easing;

      if (opacity.generated) {
        transition.fragments.push({
          delayed: ("opacity " + (duration / 1000) + "s " + easing + " " + (delay / 1000) + "s"),
          instant: ("opacity " + (duration / 1000) + "s " + easing + " 0s")
        });
      }

      if (transform.generated.initial) {
        transition.fragments.push({
          delayed: ((transform.property) + " " + (duration / 1000) + "s " + easing + " " + (delay /
            1000) + "s"),
          instant: ((transform.property) + " " + (duration / 1000) + "s " + easing + " 0s")
        });
      }

      /**
       * The default computed transition property should be one of:
       * undefined || '' || 'all 0s ease 0s' || 'all 0s 0s cubic-bezier()'
       */
      if (transition.computed && !transition.computed.match(/all 0s/)) {
        transition.fragments.unshift({
          delayed: transition.computed,
          instant: transition.computed
        });
      }

      var composed = transition.fragments.reduce(
        function(composition, fragment, i) {
          composition.delayed +=
            i === 0 ? fragment.delayed : (", " + (fragment.delayed));
          composition.instant +=
            i === 0 ? fragment.instant : (", " + (fragment.instant));
          return composition
        }, {
          delayed: '',
          instant: ''
        }
      );

      transition.generated = {
        delayed: ((transition.property) + ": " + (composed.delayed) + ";"),
        instant: ((transition.property) + ": " + (composed.instant) + ";")
      };
    }
    else {
      transition.generated = {
        delayed: '',
        instant: ''
      };
    }

    return {
      inline: inline,
      opacity: opacity,
      position: position,
      transform: transform,
      transition: transition
    }
  }


  function animate(element, force) {
    if (force === void 0) force = {};

    var pristine = force.pristine || this.pristine;
    var delayed =
      element.config.useDelay === 'always' ||
      (element.config.useDelay === 'onload' && pristine) ||
      (element.config.useDelay === 'once' && !element.seen);

    var shouldReveal = element.visible && !element.revealed;
    var shouldReset = !element.visible && element.revealed && element.config.reset;

    if (force.reveal || shouldReveal) {
      return triggerReveal.call(this, element, delayed)
    }

    if (force.reset || shouldReset) {
      return triggerReset.call(this, element)
    }
  }


  function triggerReveal(element, delayed) {
    var styles = [
      element.styles.inline.generated,
      element.styles.opacity.computed,
      element.styles.transform.generated.final
    ];
    if (delayed) {
      styles.push(element.styles.transition.generated.delayed);
    }
    else {
      styles.push(element.styles.transition.generated.instant);
    }
    element.revealed = element.seen = true;
    element.node.setAttribute('style', styles.filter(function(s) { return s !== ''; }).join(' '));
    registerCallbacks.call(this, element, delayed);
  }


  function triggerReset(element) {
    var styles = [
      element.styles.inline.generated,
      element.styles.opacity.generated,
      element.styles.transform.generated.initial,
      element.styles.transition.generated.instant
    ];
    element.revealed = false;
    element.node.setAttribute('style', styles.filter(function(s) { return s !== ''; }).join(' '));
    registerCallbacks.call(this, element);
  }


  function registerCallbacks(element, isDelayed) {
    var this$1 = this;

    var duration = isDelayed ?
      element.config.duration + element.config.delay :
      element.config.duration;

    var beforeCallback = element.revealed ?
      element.config.beforeReveal :
      element.config.beforeReset;

    var afterCallback = element.revealed ?
      element.config.afterReveal :
      element.config.afterReset;

    var elapsed = 0;
    if (element.callbackTimer) {
      elapsed = Date.now() - element.callbackTimer.start;
      window.clearTimeout(element.callbackTimer.clock);
    }

    beforeCallback(element.node);

    element.callbackTimer = {
      start: Date.now(),
      clock: window.setTimeout(function() {
        afterCallback(element.node);
        element.callbackTimer = null;
        if (element.revealed && !element.config.reset && element.config.cleanup) {
          clean.call(this$1, element.node);
        }
      }, duration - elapsed)
    };
  }


  var nextUniqueId = (function() {
    var uid = 0;
    return function() { return uid++; }
  })();


  function sequence(element, pristine) {
    if (pristine === void 0) pristine = this.pristine;

    /**
     * We first check if the element should reset.
     */
    if (!element.visible && element.revealed && element.config.reset) {
      return animate.call(this, element, { reset: true })
    }

    var seq = this.store.sequences[element.sequence.id];
    var i = element.sequence.index;

    if (seq) {
      var visible = new SequenceModel(seq, 'visible', this.store);
      var revealed = new SequenceModel(seq, 'revealed', this.store);

      seq.models = { visible: visible, revealed: revealed };

      /**
       * If the sequence has no revealed members,
       * then we reveal the first visible element
       * within that sequence.
       *
       * The sequence then cues a recursive call
       * in both directions.
       */
      if (!revealed.body.length) {
        var nextId = seq.members[visible.body[0]];
        var nextElement = this.store.elements[nextId];

        if (nextElement) {
          cue.call(this, seq, visible.body[0], -1, pristine);
          cue.call(this, seq, visible.body[0], +1, pristine);
          return animate.call(this, nextElement, { reveal: true, pristine: pristine })
        }
      }

      /**
       * If our element isn’t resetting, we check the
       * element sequence index against the head, and
       * then the foot of the sequence.
       */
      if (!seq.blocked.head &&
        i === [].concat(revealed.head).pop() &&
        i >= [].concat(visible.body).shift()
      ) {
        cue.call(this, seq, i, -1, pristine);
        return animate.call(this, element, { reveal: true, pristine: pristine })
      }

      if (!seq.blocked.foot &&
        i === [].concat(revealed.foot).shift() &&
        i <= [].concat(visible.body).pop()
      ) {
        cue.call(this, seq, i, +1, pristine);
        return animate.call(this, element, { reveal: true, pristine: pristine })
      }
    }
  }


  function Sequence(interval) {
    var i = Math.abs(interval);
    if (!isNaN(i)) {
      this.id = nextUniqueId();
      this.interval = Math.max(i, 16);
      this.members = [];
      this.models = {};
      this.blocked = {
        head: false,
        foot: false
      };
    }
    else {
      throw new RangeError('Invalid sequence interval.')
    }
  }


  function SequenceModel(seq, prop, store) {

    var this$1 = this;

    this.head = [];
    this.body = [];
    this.foot = [];

    each(seq.members, function(id, index) {
      var element = store.elements[id];
      if (element && element[prop]) {
        this$1.body.push(index);
      }
    });

    if (this.body.length) {
      each(seq.members, function(id, index) {
        var element = store.elements[id];
        if (element && !element[prop]) {
          if (index < this$1.body[0]) {
            this$1.head.push(index);
          }
          else {
            this$1.foot.push(index);
          }
        }
      });
    }
  }


  function cue(seq, i, direction, pristine) {

    var this$1 = this;

    var blocked = ['head', null, 'foot'][1 + direction];
    var nextId = seq.members[i + direction];
    var nextElement = this.store.elements[nextId];

    seq.blocked[blocked] = true;

    setTimeout(function() {
      seq.blocked[blocked] = false;
      if (nextElement) {
        sequence.call(this$1, nextElement, pristine);
      }
    }, seq.interval);
  }


  function initialize() {

    var this$1 = this;

    rinse.call(this);

    each(this.store.elements, function(element) {
      var styles = [element.styles.inline.generated];

      if (element.visible) {
        styles.push(element.styles.opacity.computed);
        styles.push(element.styles.transform.generated.final);
        element.revealed = true;
      }
      else {
        styles.push(element.styles.opacity.generated);
        styles.push(element.styles.transform.generated.initial);
        element.revealed = false;
      }

      element.node.setAttribute('style', styles.filter(function(s) { return s !== ''; }).join(' '));
    });

    each(this.store.containers, function(container) {
      var target =
        container.node === document.documentElement ? window : container.node;
      target.addEventListener('scroll', this$1.delegate);
      target.addEventListener('resize', this$1.delegate);
    });

    /**
     * Manually invoke delegate once to capture
     * element and container dimensions, container
     * scroll position, and trigger any valid reveals
     */
    this.delegate();

    /**
     * Wipe any existing `setTimeout` now
     * that initialization has completed.
     */
    this.initTimeout = null;
  }


  function isMobile(agent) {
    if (agent === void 0) agent = navigator.userAgent;

    return /Android|iPhone|iPad|iPod/i.test(agent)
  }


  function deepAssign(target) {
    var sources = [],
      len = arguments.length - 1;
    while (len-- > 0) sources[len] = arguments[len + 1];

    if (isObject(target)) {
      each(sources, function(source) {
        each(source, function(data, key) {
          if (isObject(data)) {
            if (!target[key] || !isObject(target[key])) {
              target[key] = {};
            }
            deepAssign(target[key], data);
          }
          else {
            target[key] = data;
          }
        });
      });
      return target
    }
    else {
      throw new TypeError('Target must be an object literal.')
    }
  }


  function reveal(target, options, syncing) {

    var this$1 = this;
    if (options === void 0) options = {};
    if (syncing === void 0) syncing = false;

    var containerBuffer = [];
    var sequence$$1;
    var interval = options.interval || defaults.interval;

    try {
      if (interval) {
        sequence$$1 = new Sequence(interval);
      }

      var nodes = tealight(target);
      if (!nodes.length) {
        throw new Error('Invalid reveal target.')
      }

      var elements = nodes.reduce(function(elementBuffer, elementNode) {
        var element = {};
        var existingId = elementNode.getAttribute('data-sr-id');

        if (existingId) {
          deepAssign(element, this$1.store.elements[existingId]);

          /**
           * In order to prevent previously generated styles
           * from throwing off the new styles, the style tag
           * has to be reverted to its pre-reveal state.
           */
          element.node.setAttribute('style', element.styles.inline.computed);
        }
        else {
          element.id = nextUniqueId();
          element.node = elementNode;
          element.seen = false;
          element.revealed = false;
          element.visible = false;
        }

        var config = deepAssign({}, element.config || this$1.defaults, options);

        if ((!config.mobile && isMobile()) || (!config.desktop && !isMobile())) {
          if (existingId) {
            clean.call(this$1, element);
          }
          return elementBuffer // skip elements that are disabled
        }

        var containerNode = tealight(config.container)[0];
        if (!containerNode) {
          throw new Error('Invalid container.')
        }
        if (!containerNode.contains(elementNode)) {
          return elementBuffer // skip elements found outside the container
        }

        var containerId; {
          containerId = getContainerId(
            containerNode,
            containerBuffer,
            this$1.store.containers
          );
          if (containerId === null) {
            containerId = nextUniqueId();
            containerBuffer.push({ id: containerId, node: containerNode });
          }
        }

        element.config = config;
        element.containerId = containerId;
        element.styles = style(element);

        if (sequence$$1) {
          element.sequence = {
            id: sequence$$1.id,
            index: sequence$$1.members.length
          };
          sequence$$1.members.push(element.id);
        }

        elementBuffer.push(element);
        return elementBuffer
      }, []);

      /**
       * Modifying the DOM via setAttribute needs to be handled
       * separately from reading computed styles in the map above
       * for the browser to batch DOM changes (limiting reflows)
       */
      each(elements, function(element) {
        this$1.store.elements[element.id] = element;
        element.node.setAttribute('data-sr-id', element.id);
      });
    }
    catch (e) {
      return logger.call(this, 'Reveal failed.', e.message)
    }

    /**
     * Now that element set-up is complete...
     * Let’s commit any container and sequence data we have to the store.
     */
    each(containerBuffer, function(container) {
      this$1.store.containers[container.id] = {
        id: container.id,
        node: container.node
      };
    });
    if (sequence$$1) {
      this.store.sequences[sequence$$1.id] = sequence$$1;
    }

    /**
     * If reveal wasn't invoked by sync, we want to
     * make sure to add this call to the history.
     */
    if (syncing !== true) {
      this.store.history.push({ target: target, options: options });

      /**
       * Push initialization to the event queue, giving
       * multiple reveal calls time to be interpreted.
       */
      if (this.initTimeout) {
        window.clearTimeout(this.initTimeout);
      }
      this.initTimeout = window.setTimeout(initialize.bind(this), 0);
    }
  }


  function getContainerId(node) {
    var collections = [],
      len = arguments.length - 1;
    while (len-- > 0) collections[len] = arguments[len + 1];

    var id = null;
    each(collections, function(collection) {
      each(collection, function(container) {
        if (id === null && container.node === node) {
          id = container.id;
        }
      });
    });
    return id
  }


  /**
   * Re-runs the reveal method for each record stored in history,
   * for capturing new content asynchronously loaded into the DOM.
   */
  function sync() {
    var this$1 = this;

    each(this.store.history, function(record) {
      reveal.call(this$1, record.target, record.options, true);
    });

    initialize.call(this);
  }

  var polyfill = function(x) { return (x > 0) - (x < 0) || +x; };
  var mathSign = Math.sign || polyfill


  var polyfill$1 = (function() {
    var clock = Date.now();

    return function(callback) {
      var currentTime = Date.now();
      if (currentTime - clock > 16) {
        clock = currentTime;
        callback(currentTime);
      }
      else {
        setTimeout(function() { return polyfill$1(callback); }, 0);
      }
    }
  })();


  var index = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    polyfill$1;


  function getGeometry(target, isContainer) {
    /**
     * We want to ignore padding and scrollbars for container elements.
     * More information here: https://goo.gl/vOZpbz
     */
    var height = isContainer ? target.node.clientHeight : target.node.offsetHeight;
    var width = isContainer ? target.node.clientWidth : target.node.offsetWidth;

    var offsetTop = 0;
    var offsetLeft = 0;
    var node = target.node;

    do {
      if (!isNaN(node.offsetTop)) {
        offsetTop += node.offsetTop;
      }
      if (!isNaN(node.offsetLeft)) {
        offsetLeft += node.offsetLeft;
      }
      node = node.offsetParent;
    } while (node)

    return {
      bounds: {
        top: offsetTop,
        right: offsetLeft + width,
        bottom: offsetTop + height,
        left: offsetLeft
      },
      height: height,
      width: width
    }
  }


  function getScrolled(container) {
    var top, left;
    if (container.node === document.documentElement) {
      top = window.pageYOffset;
      left = window.pageXOffset;
    }
    else {
      top = container.node.scrollTop;
      left = container.node.scrollLeft;
    }
    return { top: top, left: left }
  }


  function isElementVisible(element) {
    if (element === void 0) element = {};

    var container = this.store.containers[element.containerId];
    if (!container) { return }

    var viewFactor = Math.max(0, Math.min(1, element.config.viewFactor));
    var viewOffset = element.config.viewOffset;

    var elementBounds = {
      top: element.geometry.bounds.top + element.geometry.height * viewFactor,
      right: element.geometry.bounds.right - element.geometry.width * viewFactor,
      bottom: element.geometry.bounds.bottom - element.geometry.height * viewFactor,
      left: element.geometry.bounds.left + element.geometry.width * viewFactor
    };

    var containerBounds = {
      top: container.geometry.bounds.top + container.scroll.top + viewOffset.top,
      right: container.geometry.bounds.right + container.scroll.left - viewOffset.right,
      bottom: container.geometry.bounds.bottom + container.scroll.top - viewOffset.bottom,
      left: container.geometry.bounds.left + container.scroll.left + viewOffset.left
    };

    return (
      (elementBounds.top < containerBounds.bottom &&
        elementBounds.right > containerBounds.left &&
        elementBounds.bottom > containerBounds.top &&
        elementBounds.left < containerBounds.right) ||
      element.styles.position === 'fixed'
    )
  }


  function delegate(
    event,
    elements
  ) {
    var this$1 = this;
    if (event === void 0) event = { type: 'init' };
    if (elements === void 0) elements = this.store.elements;

    index(function() {
      var stale = event.type === 'init' || event.type === 'resize';

      each(this$1.store.containers, function(container) {
        if (stale) {
          container.geometry = getGeometry.call(this$1, container, true);
        }
        var scroll = getScrolled.call(this$1, container);
        if (container.scroll) {
          container.direction = {
            x: mathSign(scroll.left - container.scroll.left),
            y: mathSign(scroll.top - container.scroll.top)
          };
        }
        container.scroll = scroll;
      });

      /**
       * Due to how the sequencer is implemented, it’s
       * important that we update the state of all
       * elements, before any animation logic is
       * evaluated (in the second loop below).
       */
      each(elements, function(element) {
        if (stale) {
          element.geometry = getGeometry.call(this$1, element);
        }
        element.visible = isElementVisible.call(this$1, element);
      });

      each(elements, function(element) {
        if (element.sequence) {
          sequence.call(this$1, element);
        }
        else {
          animate.call(this$1, element);
        }
      });

      this$1.pristine = false;
    });
  }


  function transformSupported() {
    var style = document.documentElement.style;
    return 'transform' in style || 'WebkitTransform' in style
  }


  function transitionSupported() {
    var style = document.documentElement.style;
    return 'transition' in style || 'WebkitTransition' in style
  }


  var version = "0.0.1";

  var boundDelegate;
  var boundDestroy;
  var boundReveal;
  var boundClean;
  var boundSync;
  var config;
  var debug;
  var instance;


  function ScrollReveal(options) {
    if (options === void 0) options = {};

    var invokedWithoutNew =
      typeof this === 'undefined' ||
      Object.getPrototypeOf(this) !== ScrollReveal.prototype;

    if (invokedWithoutNew) {
      return new ScrollReveal(options)
    }

    if (!ScrollReveal.isSupported()) {
      logger.call(this, 'Instantiation failed.', 'This browser is not supported.');
      return mount.failure()
    }

    var buffer;
    try {
      buffer = config ?
        deepAssign({}, config, options) :
        deepAssign({}, defaults, options);
    }
    catch (e) {
      logger.call(this, 'Invalid configuration.', e.message);
      return mount.failure()
    }

    try {
      var container = tealight(buffer.container)[0];
      if (!container) {
        throw new Error('Invalid container.')
      }
    }
    catch (e) {
      logger.call(this, e.message);
      return mount.failure()
    }

    config = buffer;

    if ((!config.mobile && isMobile()) || (!config.desktop && !isMobile())) {
      logger.call(
        this,
        'This device is disabled.',
        ("desktop: " + (config.desktop)),
        ("mobile: " + (config.mobile))
      );
      return mount.failure()
    }

    mount.success();

    this.store = {
      containers: {},
      elements: {},
      history: [],
      sequences: {}
    };

    this.pristine = true;

    boundDelegate = boundDelegate || delegate.bind(this);
    boundDestroy = boundDestroy || destroy.bind(this);
    boundReveal = boundReveal || reveal.bind(this);
    boundClean = boundClean || clean.bind(this);
    boundSync = boundSync || sync.bind(this);

    Object.defineProperty(this, 'delegate', { get: function() { return boundDelegate; } });
    Object.defineProperty(this, 'destroy', { get: function() { return boundDestroy; } });
    Object.defineProperty(this, 'reveal', { get: function() { return boundReveal; } });
    Object.defineProperty(this, 'clean', { get: function() { return boundClean; } });
    Object.defineProperty(this, 'sync', { get: function() { return boundSync; } });

    Object.defineProperty(this, 'defaults', { get: function() { return config; } });
    Object.defineProperty(this, 'version', { get: function() { return version; } });
    Object.defineProperty(this, 'noop', { get: function() { return false; } });

    return instance ? instance : (instance = this)
  }

  ScrollReveal.isSupported = function() { return transformSupported() && transitionSupported(); };

  Object.defineProperty(ScrollReveal, 'debug', {
    get: function() { return debug || false; },
    set: function(value) { return (debug = typeof value === 'boolean' ? value : debug); }
  });

  ScrollReveal();

  return ScrollReveal;

})));

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

/*
  Krunch Asynchronous Environment for routing, mouting and
  enable the build-in utilities.
*/
(async function main() {

  // Routing
  // Isomorphic urls routing api.
  // krunch.register('router', route.Router)
  // krunch.register('route', route.Route)

  krunch.probeConnection() // check connection
  krunch.networkSpeed() // show network properties
  progressbar.pageRead() // show reading progress

  await krunch.compile() // init compiler

  // add critical assets
  // into Cache Storage
  const assets = [
    'https://loouislow81.github.io/old/assets/pdf/loouislow_resume_10_jan_2020.pdf',
    // Drift
    'https://js.driftt.com/deploy/assets/index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css',
    'https://driftt.imgix.net/https%3A%2F%2Fdriftt.imgix.net%2Fhttps%253A%252F%252Fs3.amazonaws.com%252Fcustomer-api-avatars-prod%252F143025%252Fd74fd385e545499b4199612f8f3271abazeu45xncm6n%3Ffit%3Dmax%26fm%3Dpng%26h%3D200%26w%3D200%26s%3D618df2d1becd817272750d418c8b612a?fit=max&fm=png&h=200&w=200&s=f8df938f30bececc2631946e17b48633',
    'https://js.driftt.com/deploy/assets/assets/vendors-AwayMessage-LiveAudienceMessagePreview-ProductAnnouncementWelcomeMessage-WelcomeMessage-mess-e915d62e-7fe953248f449bcfb50d.js',
    'https://js.driftt.com/deploy/assets/assets/ProductAnnouncementWelcomeMessage-5a2aaa591e5640330e4b.js',
    'https://js.driftt.com/include/1586019600000/9ad3433dnnis.js',
    // Twitter
    'https://pbs.twimg.com/profile_images/977770118234062848/yjD37ySD_normal.jpg',
    'https://platform.twitter.com/js/timeline.d228dcf3573461f298b082c9a5c0a42c.js',
    'https://platform.twitter.com/js/moment~timeline~tweet.99ce5e0e4617985354c5c426d7e1b9f4.js',
    'https://platform.twitter.com/css/timeline.d41c1d7e4bac44f4658ca45d09564e79.dark.ltr.css'
  ]
  krunch.addCache(assets)

  // `card-cookies-consent` is a master controller mount
  // components only after accepting the cookies consent.
  const components = 'card-cookies-consent'
  krunch.mount(components) // mount components

}())