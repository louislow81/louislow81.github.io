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

var enableNetworkRequestMonitor = function() {

  // create new element
  var fragment = create('<y class="w-screen" id="ba194bb5a0b6e42d520d17a3b75f5962"></y><style>#ba194bb5a0b6e42d520d17a3b75f5962{color:#fff;font-size:0.8em;text-align:center;width:100%;top:0;left:0;z-index:200;position:absolute;}.is-online{background:transparent;padding:0.3rem}.is-online:after{visibility:visible;content:"";}.is-offline{background:#607D8B;padding:0.3rem}.is-offline:after{visibility:visible;content:"No internet connection!";}</style>');

  // insert element
  document.body.insertBefore(fragment, document.body.childNodes[0]);

  // check internet connection
  try {
    window.addEventListener('load', function() {
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

/*
 * init
 */

enableNetworkRequestMonitor();
