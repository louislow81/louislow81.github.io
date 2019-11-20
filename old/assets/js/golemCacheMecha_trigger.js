/**
 * @file: golemCacheMecha_trigger.js
 * @description: listener and event trigger for Golem CachMecha
 * @version: 1.0.0
 * @license: MIT
 * @author: Loouis Low <loouis@gmail.com>
 * @copyright: Loouis Low (https://github.com/loouislow81/golem-sdk)
 */

/**
 * event trigger and simulator
 */

// DOM decorator
function create(htmlStr) {
  var frag = document.createDocumentFragment(),
    temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

var enableGolemSimulation = function () {

  // create new element
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

  // time in secs
  var maxSimulation = 100;
  var waitTimeOnEachSimulation = 50000;
  var startSimulationAfter = 1000;

  // trigger
  setTimeout(function () {
    var counter = 0;
    var interval = setInterval(function () {
      // click the button
      document.getElementById("d0ca0fd2bfa3100c95365c4ad784627b").click();
      counter++; // increases counter after every click
      // stops after x clicks
      if (counter == maxSimulation) clearInterval(interval);
    }, waitTimeOnEachSimulation);
  }, startSimulationAfter);

};

/**
 * check requests to remote server
 */

var enableNetworkRequestMonitor = function () {

  // create new element
  var fragment = create('<div id="ba194bb5a0b6e42d520d17a3b75f5962"></div>');

  // <style>#get-network-status{text-align:center;width:88%;border-radius:0 0 5px 5px;color:#ffffff;font-size:15px;font-weight:bold;top:0;left:-40px;z-index:200;position:absolute;box-shadow:0 2px 2px rgba(0,0,0,.05), 0 1px 0 rgba(0,0,0,.05);}.is-online{background:#2f78f9;padding:15px}.is-online:after{visibility:visible;content:"Connected to internet!";}.is-offline{background:#FF5722;padding:15px}.is-offline:after{visibility:visible;content:"No internet connection!";}</style>

  // insert element
  document.body.insertBefore(fragment, document.body.childNodes[0]);

  // check internet connection
  try {
    window.addEventListener('load', function () {
      function checkStatus() {
        // change color to either green or red
        window.document.getElementById('ba194bb5a0b6e42d520d17a3b75f5962').className = navigator.onLine ? 'is-online' : 'is-offline';
        // display connection status
        console.log('INFO: internet is ' + window.document.getElementById('ba194bb5a0b6e42d520d17a3b75f5962').className);
      }
      // detect browser is online
      window.addEventListener('online', checkStatus);
      // detect browser is offline
      window.addEventListener('offline', checkStatus);
    });
  }
  // throw err
  catch (error) {
    window.console.log(error)
  }

};

/**
 * init
 */

enableNetworkRequestMonitor();
enableGolemSimulation();
