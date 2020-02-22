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
  // console.log();
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
    '<y class="w-screen" id="ba194bb5a0b6e42d520d17a3b75f5962"></y><style>#ba194bb5a0b6e42d520d17a3b75f5962{color:#fff;font-size:0.8em;text-align:center;width:100%;top:0;left:0;z-index:999999;position:fixed;}.is-online{background:transparent;padding:0}.is-online:after{visibility:visible;content:"";}.is-offline{background:#F44336;padding:0.15rem}.is-offline:after{visibility:visible;content:"No connection!";}</style>'
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
  Adaptive Image Loader
  @param {null}
  @usage,
    <img class="adaptive"
         src="assets/image/low/image.jpg"
         data-src="assets/image/high/image.jpg">
*/
krunch.adaptiveImageLoader = function() {
  const images = document.getElementsByClassName("adaptive");

  Array.from(images).map(imageElement => {
    const adaptive = new Image(); // start loading image
    adaptive.src = imageElement.dataset.src;

    // once image is loaded replace the src of the HTML element
    adaptive.onload = function() {
      imageElement.classList.remove("adaptive");
      if ("IMG" === imageElement.nodeName) imageElement.src = adaptive.src;
      else imageElement.style.backgroundImage = `url(${adaptive.src})`;
    };
  });
};


/*
  Display browser network properties
  @param {null}
 */
krunch.networkSpeed = function() {
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