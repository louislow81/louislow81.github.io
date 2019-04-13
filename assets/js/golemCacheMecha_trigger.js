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

// insert element
document.body.insertBefore(fragment, document.body.childNodes[0]);

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
