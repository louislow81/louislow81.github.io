/*
 * event trigger and simulator
 */

var enableGolemSimulation = function () {

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

  // create new element
  var fragment = create('<div id="d0ca0fd2bfa3100c95365c4ad784627b"></div>');

  // <style>#get-network-status{text-align:center;width:100%;border-radius:0 0 3px 3px;color:#3c4144;font-size:15px;font-weight:600;top:52px!important;z-index:99999;position:absolute;box-shadow:0 2px 2px rgba(0,0,0,.05),0 1px 0 rgba(0,0,0,.05)}.is-offline{background:#fff;padding:15px}.is-online{background:#fff;padding:15px}</style><div id="get-network-status"></div>

  // insert element
  document.body.insertBefore(fragment, document.body.childNodes[0]);

  // check internet connection
  // try {
  //   window.addEventListener('load', function () {
  //     function checkStatus() {
  //       // change color to either green or red
  //       window.document.getElementById('get-network-status').className = navigator.onLine ? 'is-online' : 'is-offline';
  //       // display connection status
  //       console.log('INFO: internet is ' + window.document.getElementById('get-network-status').className);
  //     }
  //     // detect browser is online
  //     window.addEventListener('online', checkStatus);
  //     // detect browser is offline
  //     window.addEventListener('offline', checkStatus);
  //   });
  // }
  // // throw err
  // catch (error) {
  //   window.console.log(error)
  // }

  // get all image sources
  document.getElementById('d0ca0fd2bfa3100c95365c4ad784627b').addEventListener("click", function () {
    var elements = document.querySelectorAll('img');
    Array.prototype.forEach.call(elements, function (el, i) {
      GolemCacheMecha.cacheFile(el.getAttribute('src'));
    });
  });

  var waitInterval = 100,
    clickOnEverySec = 30000,
    startAfterXSec = 1000;

  // timely trigger
  setTimeout(function () {
    var counter = 0;
    var interval = setInterval(function () {
      // click the button
      document.getElementById("d0ca0fd2bfa3100c95365c4ad784627b").click();
      counter++; // Increases counter after every click
      // Stops after x clicks
      if (counter == waitInterval) clearInterval(interval);
    }, clickOnEverySec);
  }, startAfterXSec);

};

/*
 * init
 */
enableGolemSimulation();