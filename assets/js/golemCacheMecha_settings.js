// general golem cache mecha settings
var golemCacheSettings = function () {
  GolemCacheMecha.options.debug = true;
  GolemCacheMecha.options.usePersistentCache = true;
  GolemCacheMecha.options.chromeQuota = 100 * 1024 * 1024;
  GolemCacheMecha.init();
};

// init
golemCacheSettings();

// asynchronous stashing manager,
// items that are stored into persistent storage
// for supported assets (js, css)

// (proto) extended support for other scripts (xml, yaml, json)
// (proto) extended support for fonts (ttf, eot)

// (css)/(font) would be slightly different behaviour, should store in
// persistent storage at first before calling with <link> tag
// without doing injecting like (js).

golemCacheMecha.add({
    // jquery
    url: 'https://fonts.googleapis.com/css?family=Oswald:200,300,400,500,600',
    key: 'item-google-fonts',
    expire: 6,
    inject: false
  }, {
    // font-awesome
    url: 'https://use.fontawesome.com/releases/v5.1.1/css/all.css',
    key: 'item-fontawesome',
    expire: 6,
    inject: false
  }, {
    // app css
    url: 'assets/css/ui.min.css',
    key: 'item-main-css',
    expire: 6,
    inject: false
  }, {
    // app js
    url: 'assets/js/app.min.js',
    key: 'item-main-js',
    expire: 6
  })
  // error handler
  .then(function () {
    console.log('INFO: all assets are nicely loaded.');
  }, function (error) {
    console.log('ERROR: missing stash items, either no connection or incorrect path');
  });