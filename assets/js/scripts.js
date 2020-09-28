/*
  Krunch Asynchronous Environment for routing, mouting and
  enable the build-in utilities.
*/
(async function main() {

  // Routing
  // Isomorphic urls routing api.
  // krunch.register('router', route.Router)
  // krunch.register('route', route.Route)

  // krunch.probeConnection() // check connection
  // krunch.networkSpeed() // show network properties

  await krunch.compile() // init compiler

  // add critical assets
  // into Cache Storage
  // const assets = [
  //   'https://loouislow81.github.io/old/assets/pdf/loouislow_resume_10_jan_2020.pdf',
  //   // Drift
  //   'https://js.driftt.com/deploy/assets/index.html',
  //   'https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css',
  //   'https://driftt.imgix.net/https%3A%2F%2Fdriftt.imgix.net%2Fhttps%253A%252F%252Fs3.amazonaws.com%252Fcustomer-api-avatars-prod%252F143025%252Fd74fd385e545499b4199612f8f3271abazeu45xncm6n%3Ffit%3Dmax%26fm%3Dpng%26h%3D200%26w%3D200%26s%3D618df2d1becd817272750d418c8b612a?fit=max&fm=png&h=200&w=200&s=f8df938f30bececc2631946e17b48633',
  //   'https://js.driftt.com/deploy/assets/assets/vendors-AwayMessage-LiveAudienceMessagePreview-ProductAnnouncementWelcomeMessage-WelcomeMessage-mess-e915d62e-7fe953248f449bcfb50d.js',
  //   'https://js.driftt.com/deploy/assets/assets/ProductAnnouncementWelcomeMessage-5a2aaa591e5640330e4b.js',
  //   'https://js.driftt.com/include/1586019600000/9ad3433dnnis.js',
  //   // Twitter
  //   'https://pbs.twimg.com/profile_images/977770118234062848/yjD37ySD_normal.jpg',
  //   'https://platform.twitter.com/js/timeline.d228dcf3573461f298b082c9a5c0a42c.js',
  //   'https://platform.twitter.com/js/moment~timeline~tweet.99ce5e0e4617985354c5c426d7e1b9f4.js',
  //   'https://platform.twitter.com/css/timeline.d41c1d7e4bac44f4658ca45d09564e79.dark.ltr.css'
  // ]
  // krunch.addCache(assets)

  // `card-cookies-consent` is a master controller mount
  // components only after accepting the cookies consent.
  const components = 'card-cookies-consent'
  krunch.mount(components) // mount components

}())

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
      return { w: source.w * widthRatio, h: source.h * widthRatio, fit: true };
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
      backgroundColor: "rgba(0,0,0,0.8)"
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
        fontWeight: "bold",
        fontSize: "18px",
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
popup.imageTouchDevice = function(id) {
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
  Never Call `popup.image()` On Not Touch Device
  @param {element_id}
*/
popup.imageNotTouchDevice = function(id) {
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

function snicker() {};

/*
  Snicker UI Decorator
  @param {data}
  @param {duration}
*/
function snickerUI(data, duration) {
  const element = document.createElement("y");
  const css ="position:fixed; bottom:13%; left:3%; width:auto; color:#192127; background-color:#ffc300; padding:1em; font-size:0.8em; font-family:inherit; font-weight:600; border-radius:10px; box-shadow: 0 0 4px #0a0e10; z-index:999;";
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
