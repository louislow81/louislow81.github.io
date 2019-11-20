/**
 * @file: golemCacheMecha_settings.js
 * @description: your configuration for Golem CacheMecha engine
 * @version: 1.0.0
 * @license: MIT
 * @author: Loouis Low <loouis@gmail.com>
 * @copyright: Loouis Low (https://github.com/loouislow81/golem-sdk)
 */

/**
 * Settings
 */

const enableGolemCacheMecha = function () {
  // debug log in console
  GolemCacheMecha.options.debug = true;
  // name of the cache folder
  GolemCacheMecha.options.localCacheFolder = 'golemCacheMecha';
  // use src="data:.."? otherwise will use src="filesystem:.."
  GolemCacheMecha.options.useDataURI = false;
  // allocated cache space: here 100MB
  GolemCacheMecha.options.chromeQuota = 100 * 1024 * 1024;
  // false = use temporary cache storage
  GolemCacheMecha.options.usePersistentCache = true;
  // size in MB that triggers cache clear on init, 0 to disable
  GolemCacheMecha.options.cacheClearSize = 90;
  // HTTP headers for the download requests -- e.g: headers: { 'Accept': 'application/jpg' }
  GolemCacheMecha.options.headers = {};
  // indicates whether or not cross-site Access-Control requests should be made using credentials
  GolemCacheMecha.options.withCredentials = false;
  // enable if URIs are already encoded (skips call to sanitizeURI)
  GolemCacheMecha.options.skipURIencoding = false;
  // if specified, use one of the Android File plugin's app directories for storage
  GolemCacheMecha.options.androidFilesystemRoot = null;
  // timeout delay in ms for xhr request
  GolemCacheMecha.options.timeout = 0;
  // activate the engine (default)
  GolemCacheMecha.init();
};

/**
 * Assets Stashing Manager
 *
 * items that are stored into persistent storage
 * for supported text-based assets (html, js, css, xml, yaml, json)
 * and binary-based assets (ttf, eot)
 *
 * `inject: true` is asset injected into HTML document with <script> tag and
 * start execute it immediately asynchronously.
 *
 * `inject: false` is asset not injected into HTML document but store-only,
 * until being called by <link> tag and then grab from persistent storage.
 */

const enableGolemImports = function () {

  golemCacheMecha.add({
      // google-fonts
      url: 'https://fonts.googleapis.com/css?family=Oswald:200,300,400,500,600',
      key: 'item-google-fonts',
      // expire: 12,
      inject: false // store-only
    }, {
      // font-awesome
      url: 'https://use.fontawesome.com/releases/v5.1.1/css/all.css',
      key: 'item-fontawesome',
      // expire: 12,
      inject: false // store-only
    }, {
      // app css
      url: 'assets/css/ui.min.css',
      key: 'item-main-css',
      // expire: 12,
      inject: false // store-only
    }, {
      // app js
      url: 'assets/js/app.min.js',
      key: 'item-main-js',
      // expire: 12,
      // inject: true
    })
    // error handler
    .then(function () {
      console.log('INFO: All (css,js) assets are nicely loaded.');
    }, function (error) {
      console.log('ERROR: missing stash items, either no connection or incorrect path');
    });

};

/**
 *
 */

const enableGolemPrefetcher = function () {
  // preload page for valid links
  window.addEventListener('load', (data) => {
    quicklink();
    console.log(data)
  });
}

/**
 * init
 */

enableGolemCacheMecha();
enableGolemImports();
enableGolemPrefetcher();


