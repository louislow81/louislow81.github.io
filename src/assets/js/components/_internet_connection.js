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

