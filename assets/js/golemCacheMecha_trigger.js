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

// create element
var fragment = create('<div id="d0ca0fd2bfa3100c95365c4ad784627b"></div>');

// <style>#get-network-status{text-align:center;width:100%;color:#FFF;font-size:16px;}.is-online{background:#4CAF50;padding:10px;}.is-online:after{visibility:visible;content:"Connected to server! Try reload the page if necessary.";}.is-offline{background:#E91E63;padding:10px;}.is-offline:after{visibility:visible;content:"We are having trouble to connecting to server. We will keep trying...";}</style><div id="get-network-status"></div>

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

// simulate
setTimeout(function () {
  var counter = 0;
  var interval = setInterval(function () {
    // Clicks the button
    document.getElementById("d0ca0fd2bfa3100c95365c4ad784627b").click();
    counter++; // Increases counter after every click
    // Stops after x clicks
    if (counter == 100) clearInterval(interval);
  }, 20000); // Will click the button every x seconds
}, 1000); // Starts after x seconds