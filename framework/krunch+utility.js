// Utility function
function krunch() {}


/*
  Developer options
  @methodOf log('','');
  @enable with `console.log(msg, req);`
  @disable with `console.log();`
*/
const log = function(msg, req) {
  console.log("krugurt:", msg, req);
  //console.log();
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
  const temp = document.createElement("y");

  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}


/*
  Check Connection with display message
  @param {null}
*/
krunch.probeConnection = function() {
  const element = injectDOM(
    '<y class="w-screen" id="ba194bb5a0b6e42d520d17a3b75f5962"></y><style>#ba194bb5a0b6e42d520d17a3b75f5962{color:#fff;font-size:0.8em;text-align:center;width:100%;top:0;left:0;z-index:999999;position:fixed;}.is-online{background:transparent;padding:0}.is-online:after{visibility:visible;content:"";}.is-offline{background:#607d8b;padding:0.15rem}.is-offline:after{visibility:visible;content:"No connection!";}</style>'
  );
  document.body.insertBefore(element, document.body.childNodes[0]);

  try {
    window.addEventListener("load", function() {
      function checkStatus() {
        // display status
        window.document.getElementById(
          "ba194bb5a0b6e42d520d17a3b75f5962"
        ).className = navigator.onLine ? "is-online" : "is-offline";
        log(
          "(CONN) is " +
          window.document.getElementById("ba194bb5a0b6e42d520d17a3b75f5962")
          .className
        );
      }

      setInterval(function() {
        // check connection
        window.addEventListener("online", checkStatus);
        window.addEventListener("offline", checkStatus);
      }, 1000);
    });
  }
  catch (error) {
    log("(CONN)", error);
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
  log("(SW) add cache", req);
};


/*
  Remove `request` from the cache
  @param {string[]|Request[]|string|Request} request
*/
krunch.removeCache = function(req) {
  serviceWorker.remove(req);
  log("(SW) remove cache", req);
};


/*
  Executed immediately
  @methodOf serviceWorker
  @param {function} callback
  @returns {function} dispose
*/
krunch.isCached = function() {
  serviceWorker.onCached(function() {
    log("(SW) (CACHED)");
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
    log("(SW) (ONLINE)");
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
    .init({
        // init processor
        fallbackLang: "en",
        debug: true,
        namespace: ["special", "common"],
        defaultNS: "special",
        backend: {
          loadPath: "assets/locale/{{lng}}/{{namespace}}.json", // !! default
          crossDomain: true
        }
      },
      function(err, t) {
        updatePayload(getId, getData); // init set content
      }
    );

  function updatePayload(getId, getData) {
    const getElementId = document.getElementById(getId);
    let getLocaleValue = locale.t(getData);

    getElementId.innerHTML = getLocaleValue;
  }

  locale.on("languageChanged", function() {
    updatePayload(getId, getData);
  });
}


/*
  Localization Worker
  @param {array}
*/
function localeGenerator(array) {
  for (let i = 0; i < array.length; i++) {
    let obj = array[i];
    localeProcessor(obj.id, obj.data);
  }
}


/*
  Get ids and initialize localization
*/
krunch.lang = function() {
  const file = "assets/locale/id.json";

  fetch(file)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      localeGenerator(data);
      log("(LANG) (id)", data);
    })
    .catch(function(err) {
      log("(LANG) (ERR)", err);
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
  Check WebP is supported
  @param {null}
*/
const isWebP = (function() {
  "use strict";
  const index = new Promise(function(resolve) {
    const image = new Image();
    image.onerror = function() {
      return resolve(false);
    };
    image.onload = function() {
      return resolve(image.width === 1);
    };
    image.src =
      "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=";
  }).catch(function() {
    return false;
  });

  return index;
})();


/*
  Sanitizer broken images masked with transparent dummy image
  @param {DOMimages}
*/
krunch.sanitizeBrokenImage = function (DOMimages) {
  if (!DOMimages || !DOMimages.nodeName || DOMimages.nodeName != "IMG") {
    // get all images from DOM
    const getImg = document.getElementsByTagName("IMG");
    let i = getImg.length;
    if (i) {
      while (i--) {
        krunch.sanitizeBrokenImage(getImg[i]);
      }
    }
    return;
  }
  // masking
  const dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4//8/AwAI/AL+hc2rNAAAAABJRU5ErkJggg==';
  const replaceImg = new Image();
  replaceImg.onerror = function () {
    DOMimages.src = dummyImage;
    log("(image) broken image masked with dummy", "");
  };
  replaceImg.src = DOMimages.src;
};


/*
  Image replacer for `krunch.adaptiveImageLoader()` and
  `krunch.adaptiveWebpLoader()`
  @param {className}
*/
function imageReplacer(className) {
  const images = document.getElementsByClassName(className);
  Array.from(images).map(imageElement => {

    const adaptive = new Image(); // start loading image
    adaptive.src = imageElement.dataset.src;

    // once image is loaded replace the src of the HTML element
    adaptive.onload = function() {
      imageElement.classList.remove(className);
      if ("IMG" === imageElement.nodeName) imageElement.src = adaptive.src;
      // support background image
      else imageElement.style.backgroundImage = `url(${adaptive.src})`;
    };
  });
}


/*
  Unsupported User Agents for,
  `krunch.adaptiveImageLoader()`,
  `krunch.adaptiveWebpLoader()`,
  `krunch.networkSpeed()`
*/
let isFirefox = typeof InstallTrigger !== 'undefined';

let isSafari = /constructor/i.test(window.HTMLElement) ||
    (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] ||
    (typeof safari !== 'undefined' && safari.pushNotification));

let isIE = /*@cc_on!@*/ false || !!document.documentMode;

let isEdge = !isIE && !!window.StyleMedia;


/*
  Adaptive Image Loader
  @param {null}
  @usage,
    <img class="adaptive"
         src="assets/image/low/image.jpeg"
         data-src="assets/image/high/image.jpeg">
  @reference,
    GPRS (50 KB/s 500ms RTT)
    Regular 2G (250 KB/s 300ms RTT)
    Good 2G (450 KB/s 150ms RTT)
    Regular 3G (750 KB/s 100ms RTT)
    Good 3G (1 MB/s 40ms RTT)
    Regular 4G (4 MB/s 20ms RTT)
    DSL (2 MB/s 5ms RTT)
    WiFi (30 MB/s 2ms RTT)
*/
krunch.adaptiveImageLoader = function() {
  const triggerClassName = "adaptive";

  if (isFirefox === true ||
      isSafari == true ||
      isIE === true ||
      isEdge === true) {
    log("(ERR) adaptiveImageLoader is unsupported for this web browser", "")
  }
  else {

    const downLink = navigator.connection.downlink;
    const roundTripTime = navigator.connection.rtt;

    let maxMBps = 1;
    let maxRtt = 600;

    if (downLink < maxMBps || roundTripTime > maxRtt) {
      log("(CONN) slow, low-res image", "");
      // no nothing, use default src=""
    }
    else {
      log("(CONN) fast, hi-res image", "");
      imageReplacer(triggerClassName);
    }
  }
};

/*
  Adaptive Image Loader for WebP
  (with fallback to non-webp format)
  @param {null}
  @usage,
    <img class="adaptiveWebp"
         src="assets/image/low/image.jpeg"
         data-src="assets/image/high/image.webp">
    <img class="adaptiveWebp"
         src="assets/image/low/image.webp"
         data-src="assets/image/high/image.webp">
*/
krunch.adaptiveWebpLoader = function() {
  const triggerClassName = "adaptiveWebp";

  if (isFirefox === true ||
      isSafari == true ||
      isIE === true ||
      isEdge === true) {
    log("(ERR) adaptiveImageLoader is unsupported for this web browser", "")
  }
  else {

    const downLink = navigator.connection.downlink;
    const roundTripTime = navigator.connection.rtt;

    let maxMBps = 1;
    let maxRtt = 600;

    if (downLink < maxMBps || roundTripTime > maxRtt) {
      log("(CONN) slow, low-res image", "");

      isWebP.then(supported => {
        if (supported) {
          log("(BROWSER) has-WebP", "");
          imageReplacer(triggerClassName);
        }
        else {
          log("(BROWSER) no-WebP", "");
          // no nothing, use default src=""
        }
      });
    }
    else {
      log("(CONN) fast, hi-res image", "");

      isWebP.then(supported => {
        if (supported) {
          log("(BROWSER) has-WebP", "");
          imageReplacer(triggerClassName);
        }
        else {
          log("(BROWSER) no-WebP", "");
          // no nothing, use default src=""
        }
      });
    }
  }
};



/*
  Display browser network properties
  @param {null}
 */
krunch.networkSpeed = function() {

  if (isFirefox === true ||
      isSafari == true ||
      isIE === true ||
      isEdge === true) {
    log("(ERR) networkSpeed is unsupported for this web browser", "")
  }
  else {

    // network type that browser uses
    log("(Network Type) " + navigator.connection.type);
    // effective bandwidth estimate
    log("(Downlink) " + navigator.connection.downlink + " MBytes/s", "");
    // effective round-trip time estimate
    log("(Round-Trip Time) " + navigator.connection.rtt + " miliseconds", "");
    // upper bound on the downlink speed of the first network hop
    log("(Downlink Max) " + navigator.connection.downlinkMax + " MBytes/s", "");
    // effective connection type determined using a combination of recently
    // observed rtt and downlink values.
    log("(Effective Type) " + navigator.connection.effectiveType, "");
    // true if the user has requested a reduced data usage mode from the
    // user agent.
    log("(DataSaver Mode) " + navigator.connection.saveData, "");
  }
};


/*
  (!! experiemental !!)
  Torrent File Streaming
  @param {id} as in html element id
  @param {uri} as in torrent magnet uri
  @usage krunch.torrent('#elementId', 'magnetURI');
*/
krunch.torrent = function(id, uri) {
  const client = new KrunchTorrent();
  const magnetURI = uri;

  client.add(magnetURI, function(torrent) {
    log("(torrent) seed:", torrent.infoHash);
    torrent.files.forEach(function(file) {
      // display the file by appending it to the DOM,
      // specify a container element (CSS selector or reference to DOM node).
      file.appendTo(id, function(error, element) {
        if (error) throw error; // file failed to download or display in the DOM
        log("(torrent) DOM content:", element);
        log("(torrent) just downloaded:", torrent.download + " Bytes");
        log("(torrent) total downloaded: ", torrent.downloaded + " Bytes");
        log("(torrent) download speed:", torrent.downloadSpeed + " Bytes");
        log("(torrent) progress:", torrent.progress);
      });
    });
  });
};


/*
  Request user to install PWA app
  @param {null}
  @usage,
          <y class="hidden"
             id="requestAppInstall">
            <y id="requestAppTrigger">
              ...
            </y>
          </y>
*/
krunch.requestAppInstall = function() {
  const appInstallContainer = document.getElementById("requestAppInstall");
  const appTrigger = document.getElementById("requestAppTrigger");

  self.addEventListener("beforeinstallprompt", function(event) {
    log("(PWA)", event);
    // stash the event so it can be triggered later
    window.deferredPrompt = event;
    // remove the 'hidden' class from the element
    appInstallContainer.classList.toggle("hidden", false);
  });

  appTrigger.addEventListener("click", function() {
    log("(PWA) app installed", "");
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      // the deferred prompt isn't available
      return;
    }
    // show the install prompt
    promptEvent.prompt();
    // log the result
    promptEvent.userChoice.then(function(result) {
      log("(PWA)", result);
      // reset the deferred prompt variable, since
      // prompt() can only be called once
      window.deferredPrompt = null;
      // hide the install button
      appInstallContainer.classList.toggle("hidden", true);
    });
  });

  self.addEventListener("appinstalled", function(event) {
    log("(PWA) app installed", event);
  });
};


/*
  (!! experiemental !!)
  Train with Sigmoid Neural Network
  @param {inputArray}
  @param {targetArray}
*/

// const nn = new NeuralNetwork(inputLayer, hiddenLayer, outputLayer);

// krunch.trainNN = function (inputArray, targetArray) {
//   nn.train(inputArray, targetArray);
// };


/*
  (!! experiemental !!)
  Predict with Sigmoid Neural Network
  @param {inputArray}
*/
// krunch.predictNN = function (inputArray) {
//   const predict = nn.predict(inputArray);
// };

