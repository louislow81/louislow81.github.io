/*
 * general golem cache mecha settings
 */

var enableGolemCacheMecha = function () {
  GolemCacheMecha.options.debug = true;
  GolemCacheMecha.options.usePersistentCache = true;
  GolemCacheMecha.options.chromeQuota = 100 * 1024 * 1024;
  GolemCacheMecha.init();
};

/*
 * asynchronous stashing manager,
 *
 * items that are stored into persistent storage
 * for supported text-based assets (js, css, xml, yaml, json)
 * and binary-based assets (ttf, eot)
 *
 * `inject: true` is asset injected into HTML document with <script> tag and
 * start execute it immediately.
 *
 * `inject: false` is asset not injected into HTML document but store-only,
 * until being called by <link> tag and then grab from persistent storage.
 */

var enableImportAssets = function () {

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
      console.log('INFO: All assets are nicely loaded.');
    }, function (error) {
      console.log('ERROR: missing stash items, either no connection or incorrect path');
    });

};


/*
 * init
 */
enableGolemCacheMecha();
enableImportAssets();