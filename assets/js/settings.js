$(document).ready(function () {
  "use strict";
  try {

    /* ==========================================================================
     #PieChart For Skills Page
     ========================================================================== */

    $('.chart').easyPieChart({
      easing: 'easeOutBounce',
      onStep: function (from, to, percent) {
        $(this.el).find('.percent').text(Math.round(percent));
      }
    });


    /* ==========================================================================
     #Carousel Popup For Portfolio Page
     ========================================================================== */
    $(".owl-carousel").owlCarousel({
      navigation: true,
      slideSpeed: 300,
      paginationSpeed: 400,
      singleItem: true,
      autoPlay: false
    });

    /* ==========================================================================
     #Text Rotator
     ========================================================================== */
    $('#rotate').rotaterator({
      fadeSpeed: 800,
      pauseSpeed: 800
    });

    /* ==========================================================================
     #Orientation change event
     ========================================================================== */
    $(window).on('orientationchange', function (event) {
      window.location.href = window.location.href;
    });

    //Videos
    $(".content-scroller").fitVids();

  }
  catch (ex) {}
});

/* ==========================================================================
 #Progress Bar For Skills Page
 ========================================================================== */

progressBar(90, $('#progressBar9'));
progressBar(80, $('#progressBar8'));
progressBar(70, $('#progressBar7'));
progressBar(60, $('#progressBar6'));
progressBar(50, $('#progressBar5'));
progressBar(40, $('#progressBar4'));
progressBar(30, $('#progressBar3'));
progressBar(20, $('#progressBar2'));
progressBar(10, $('#progressBar1'));

progressBar(99, $('#progressBar99'));
progressBar(88, $('#progressBar88'));
progressBar(77, $('#progressBar77'));
progressBar(66, $('#progressBar66'));
progressBar(55, $('#progressBar55'));
progressBar(44, $('#progressBar44'));
progressBar(33, $('#progressBar33'));
progressBar(22, $('#progressBar22'));
progressBar(11, $('#progressBar11'));

progressBar(99, $('#progressBar991'));
progressBar(99, $('#progressBar993'));
progressBar(99, $('#progressBar995'));
progressBar(99, $('#progressBar996'));
progressBar(99, $('#progressBar997'));

progressBar(88, $('#progressBar881'));
progressBar(88, $('#progressBar882'));
progressBar(88, $('#progressBar883'));
progressBar(88, $('#progressBar884'));
progressBar(88, $('#progressBar885'));
progressBar(88, $('#progressBar886'));
progressBar(88, $('#progressBar887'));
progressBar(88, $('#progressBar888'));
progressBar(88, $('#progressBar889'));

progressBar(77, $('#progressBar771'));
progressBar(77, $('#progressBar772'));
progressBar(77, $('#progressBar773'));
progressBar(77, $('#progressBar774'));
progressBar(77, $('#progressBar775'));
progressBar(77, $('#progressBar776'));

progressBar(66, $('#progressBar661'));
progressBar(66, $('#progressBar662'));
progressBar(66, $('#progressBar663'));
progressBar(66, $('#progressBar664'));

/* ==========================================================================
 #Mobile Menu
 ========================================================================== */

var $menu = $('#menu1'),
  $menulink = $('.menu-link');
$menulink.click(function () {
  $menulink.toggleClass('active');
  $menu.toggleClass('active');
  return false;
});

$('nav#menu1 a').click(function () {
  $('#menu1').removeClass('active');
});

/* ==========================================================================
 #iPad,iPhone,iPod Keyboard issue with position fixed
 ========================================================================== */
var iPad = navigator.userAgent.toLowerCase().indexOf("ipad");
var iPhone = navigator.userAgent.toLowerCase().indexOf("iphone");
var iPod = navigator.userAgent.toLowerCase().indexOf("ipod");
if (iPad > -1 || iPhone > -1 || iPod > -1) {
  window.onscroll = function () {
    $('.totop-link').css('position', 'absolute');
    $('.totop-link').css('top', (window.pageYOffset + window.innerHeight - 39) + 'px');
  };
}


// *****************************************

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
var fragment = create('<div id="cache_images"></div>');

// insert element
document.body.insertBefore(fragment, document.body.childNodes[0]);

// *****************************************

// settings
var golemCacheSettings = function () {
  GolemCacheMecha.options.debug = true;
  GolemCacheMecha.options.usePersistentCache = true;
  GolemCacheMecha.options.chromeQuota = 100 * 1024 * 1024;
  GolemCacheMecha.init();
};

// *****************************************

// init
golemCacheSettings();

// get all image sources
document.getElementById('cache_images').addEventListener("click", function () {
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
    document.getElementById("cache_images").click();
    counter++; // Increases counter after every click
    // Stops after x clicks
    if (counter == 100) clearInterval(interval);
  }, 20000); // Will click the button every x seconds
}, 5000); // Starts after x seconds

// *****************************************