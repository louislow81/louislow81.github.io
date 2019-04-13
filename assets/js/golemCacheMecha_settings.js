// general golem cache mecha settings
var golemCacheSettings = function () {
  GolemCacheMecha.options.debug = true;
  GolemCacheMecha.options.usePersistentCache = true;
  GolemCacheMecha.options.chromeQuota = 100 * 1024 * 1024;
  GolemCacheMecha.init();
};

// init
golemCacheSettings();

// asynchronous scripts manager
golemCacheMecha.add({
  url: 'https://fonts.googleapis.com/css?family=Oswald:200,300,400,500,600',
  key: 'google-fonts'
}, {
  url: 'https://use.fontawesome.com/releases/v5.1.1/css/all.css',
  key: 'fontawesome'
}, {
  url: 'assets/css/ui.min.css',
  key: 'ui.min.css'
}, {
  url: 'assets/js/app.min.js',
  key: 'app.min.js'
});