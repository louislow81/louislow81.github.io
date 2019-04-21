/**
 * @file: golem_cache_mecha.js
 * @description: all purpose persistent local caching mechanism
 * @license: MIT
 * @author: Loouis Low <loouis@gmail.com>
 * @copyright: Loouis Low (https://github.com/loouislow81/golem-sdk)
 */

var GolemCacheMecha = {
    version: '1.0.0',
    // engine options
    options: {
      debug: false, // call the log method ?
      localCacheFolder: 'golemCacheMecha', // name of the cache folder
      useDataURI: false, // use src="data:.."? otherwise will use src="filesystem:.."
      chromeQuota: 10 * 1024 * 1024, // allocated cache space: here 10MB
      usePersistentCache: true, // false = use temporary cache storage
      cacheClearSize: 0, // size in MB that triggers cache clear on init, 0 to disable
      headers: {}, // HTTP headers for the download requests -- e.g: headers: { 'Accept': 'application/jpg' }
      withCredentials: false, // indicates whether or not cross-site Access-Control requests should be made using credentials
      skipURIencoding: false, // enable if URIs are already encoded (skips call to sanitizeURI)
      androidFilesystemRoot: null, // if specified, use one of the Cordova File plugin's app directories for storage
      timeout: 0, // timeout delay in ms for xhr request
      brokenImageHandler: true // throw broken images into dummy placeholder instant
    },
    overridables: {
      hash: function (s) {
        /* tiny-sha1 r4 (11/2011) - MIT License - http://code.google.com/p/tiny-sha1/ */
        /* jshint ignore:start */
        function U(a,b,c){while(0<c--){a.push(b)}}function L(a,b){return(a<<b)|(a>>>(32-b))}function P(a,b,c){return a^b^c}function A(a,b){var c=(b&0xFFFF)+(a&0xFFFF),d=(b>>>16)+(a>>>16)+(c>>>16);return((d&0xFFFF)<<16)|(c&0xFFFF)}var B="0123456789abcdef";return(function(a){var c=[],d=a.length*4,e;for(var i=0;i<d;i+=1){e=a[i>>2]>>((3-(i%4))*8);c.push(B.charAt((e>>4)&0xF)+B.charAt(e&0xF))}return c.join('')}((function(a,b){var c,d,e,f,g,h=a.length,v=0x67452301,w=0xefcdab89,x=0x98badcfe,y=0x10325476,z=0xc3d2e1f0,M=[];U(M,0x5a827999,20);U(M,0x6ed9eba1,20);U(M,0x8f1bbcdc,20);U(M,0xca62c1d6,20);a[b>>5]|=0x80<<(24-(b%32));a[(((b+65)>>9)<<4)+15]=b;for(var i=0;i<h;i+=16){c=v;d=w;e=x;f=y;g=z;for(var j=0,O=[];j<80;j+=1){O[j]=j<16?a[j+i]:L(O[j-3]^O[j-8]^O[j-14]^O[j-16],1);var k=(function(a,b,c,d,e){var f=(e&0xFFFF)+(a&0xFFFF)+(b&0xFFFF)+(c&0xFFFF)+(d&0xFFFF),g=(e>>>16)+(a>>>16)+(b>>>16)+(c>>>16)+(d>>>16)+(f>>>16);return((g&0xFFFF)<<16)|(f&0xFFFF)})(j<20?(function(t,a,b){return(t&a)^(~t&b)}(d,e,f)):j<40?P(d,e,f):j<60?(function(t,a,b){return(t&a)^(t&b)^(a&b)}(d,e,f)):P(d,e,f),g,M[j],O[j],L(c,5));g=f;f=e;e=L(d,30);d=c;c=k}v=A(v,c);w=A(w,d);x=A(x,e);y=A(y,f);z=A(z,g)}return[v,w,x,y,z]}((function(t){var a=[],b=255,c=t.length*8;for(var i=0;i<c;i+=8){a[i>>5]|=(t.charCodeAt(i/8)&b)<<(24-(i%32))}return a}(s)).slice(),s.length*8))));
        /* jshint ignore:end */
      },
      log: function (str, level) {
        'use strict';
        if (GolemCacheMecha.options.debug) {
          if (level === LOG_LEVEL_INFO) {
            str = 'INFO: ' + str;
          }
          if (level === LOG_LEVEL_WARNING) {
            str = 'WARN: ' + str;
          }
          if (level === LOG_LEVEL_ERROR) {
            str = 'ERROR: ' + str;
          }
          console.log(str);
        }
      }
    },
    ready: false,
    attributes: {}
  },
  LOG_LEVEL_INFO = 1,
  LOG_LEVEL_WARNING = 2,
  LOG_LEVEL_ERROR = 3;

(function ($) {

  'use strict';

  /*
   * ////////////////////////////////
   * ////////// HELPERS
   * ////////////////////////////////
   */

  var Helpers = {};

  // make sure the url does not contain funny characters like spaces that might
  // make the download fail.
  Helpers.sanitizeURI = function (uri) {
    if (GolemCacheMecha.options.skipURIencoding) {
      return uri;
    }
    else {
      if (uri.length >= 2 && uri[0] === '"' && uri[uri.length - 1] === '"') {
        uri = uri.substr(1, uri.length - 2);
      }
      var encodedURI = encodeURI(uri);
      /*
      TODO: The following bit of code will have to be checked first (#30)
      if (Helpers.isCordova()) {
          return encodedURI.replace(/%/g, '%25');
      }
      */
      return encodedURI;
    }
  };

  // with a little help from http://code.google.com/p/js-uri/
  Helpers.URI = function (str) {
    if (!str) {
      str = '';
    }
    // Based on the regex in RFC2396 Appendix B.
    var parser = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/,
      result = str.match(parser);
    this.scheme = result[1] || null;
    this.authority = result[2] || null;
    this.path = result[3] || null;
    this.query = result[4] || null;
    this.fragment = result[5] || null;
  };

  // returns lower cased filename from full URI
  Helpers.URIGetFileName = function (fullpath) {
    if (!fullpath) {
      return;
    }
    //TODO: there must be a better way here.. (url encoded strings fail)
    var idx = fullpath.lastIndexOf('/');
    if (!idx) {
      return;
    }
    return fullpath.substr(idx + 1).toLowerCase();
  };

  // returns lower cased path from full URI
  Helpers.URIGetPath = function (str) {
    if (!str) {
      return;
    }
    var uri = Helpers.URI(str);
    return uri.path.toLowerCase();
  };

  // returns extension from filename (without leading '.')
  Helpers.fileGetExtension = function (filename) {
    if (!filename) {
      return '';
    }
    filename = filename.split('?')[0];
    var ext = filename.split('.').pop();
    // make sure it's a realistic file extension - for images no more than 4 characters long (.jpeg)
    if (!ext || ext.length > 4) {
      return '';
    }
    return ext;
  };

  Helpers.appendPaths = function (path1, path2) {
    if (!path2) {
      path2 = '';
    }
    if (!path1 || path1 === '') {
      return (path2.length > 0 && path2[0] == '/' ? '' : '/') + path2;
    }
    return path1 + (((path1[path1.length - 1] == '/') || (path2.length > 0 && path2[0] == '/')) ? '' : '/') + path2;
  };

  Helpers.hasJqueryOrJqueryLite = function () {
    return (GolemCacheMecha.jQuery || GolemCacheMecha.jQueryLite);
  };

  Helpers.isCordova = function () {
    return (typeof cordova !== 'undefined' || typeof phonegap !== 'undefined') && (cordova || phonegap).platformId !== 'browser';
  };

  Helpers.isCordovaAndroid = function () {
    return (Helpers.isCordova() && device && device.platform && device.platform.toLowerCase().indexOf('android') >= 0);
  };

  Helpers.isCordovaWindowsPhone = function () {
    return (Helpers.isCordova() && device && device.platform && ((device.platform.toLowerCase().indexOf('win32nt') >= 0) || (device.platform.toLowerCase().indexOf('windows') >= 0)));
  };

  Helpers.isCordovaIOS = function () {
    return (Helpers.isCordova() && device && device.platform && device.platform.toLowerCase() === 'ios');
  };

  // special case for #93
  Helpers.isCordovaAndroidOlderThan3_3 = function () {
    return (Helpers.isCordovaAndroid() && device.version && (
      device.version.indexOf('2.') === 0 ||
      device.version.indexOf('3.0') === 0 ||
      device.version.indexOf('3.1') === 0 ||
      device.version.indexOf('3.2') === 0
    ));
  };

  // special case for #47
  Helpers.isCordovaAndroidOlderThan4 = function () {
    return (Helpers.isCordovaAndroid() && device.version && (device.version.indexOf('2.') === 0 || device.version.indexOf('3.') === 0));
  };

  // Fix for #42 (Cordova versions < 4.0)
  Helpers.EntryToURL = function (entry) {
    if (Helpers.isCordovaAndroidOlderThan4() && typeof entry.toNativeURL === 'function') {
      return entry.toNativeURL();
    }
    else if (typeof entry.toInternalURL === 'function') {
      // Fix for #97
      return entry.toInternalURL();
    }
    else {
      return entry.toURL();
    }
  };

  // Returns a URL that can be used to locate a file
  Helpers.EntryGetURL = function (entry) {
    // toURL for html5, toURI for cordova 1.x
    return (typeof entry.toURL === 'function' ? Helpers.EntryToURL(entry) : entry.toURI());
  };

  // Returns the full absolute path from the root to the FileEntry
  Helpers.EntryGetPath = function (entry) {
    if (Helpers.isCordova()) {
      // #93
      if (Helpers.isCordovaIOS()) {
        if (Helpers.isCordovaAndroidOlderThan3_3()) {
          return entry.fullPath;
        }
        else {
          return entry.nativeURL;
        }
      }
      // From Cordova 3.3 onward toURL() seems to be required instead of fullPath (#38)
      return (typeof entry.toURL === 'function' ? Helpers.EntryToURL(entry) : entry.fullPath);
    }
    else {
      return entry.fullPath;
    }
  };

  Helpers.getCordovaStorageType = function (isPersistent) {
    // From Cordova 3.1 onward those constants have moved to the window object (#38)
    if (typeof LocalFileSystem !== 'undefined') {
      if (isPersistent && LocalFileSystem.hasOwnProperty('PERSISTENT')) {
        return LocalFileSystem.PERSISTENT;
      }
      if (!isPersistent && LocalFileSystem.hasOwnProperty('TEMPORARY')) {
        return LocalFileSystem.TEMPORARY;
      }
    }
    return (isPersistent ? window.PERSISTENT : window.TEMPORARY);
  };

  /*
   * ////////////////////////////////
   * ////////// DOM HELPERS
   * ////////////////////////////////
   */

  var DomHelpers = {};

  DomHelpers.trigger = function (DomElement, eventName) {
    if (GolemCacheMecha.jQuery) {
      $(DomElement).trigger(eventName);
    }
    else {
      /* CustomEvent polyfill */
      if (Helpers.isCordovaWindowsPhone() || !window.CustomEvent) {
        // CustomEvent for browsers which don't natively support the Constructor method
        window.CustomEvent = function CustomEvent(type, params) {
          var event;
          params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
          };
          try {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
          }
          catch (error) {
            // for browsers that don't support CustomEvent at all, we use a regular event instead
            event = document.createEvent('Event');
            event.initEvent(type, params.bubbles, params.cancelable);
            event.detail = params.detail;
          }
          return event;
        };
      }
      DomElement.dispatchEvent(new CustomEvent(eventName));
    }
  };

  DomHelpers.removeAttribute = function (element, attrName) {
    if (Helpers.hasJqueryOrJqueryLite()) {
      element.removeAttr(attrName);
    }
    else {
      element.removeAttribute(attrName);
    }
  };

  DomHelpers.setAttribute = function (element, attrName, value) {
    if (Helpers.hasJqueryOrJqueryLite()) {
      element.attr(attrName, value);
    }
    else {
      element.setAttribute(attrName, value);
    }
  };

  DomHelpers.getAttribute = function (element, attrName) {
    if (Helpers.hasJqueryOrJqueryLite()) {
      return element.attr(attrName);
    }
    else {
      return element.getAttribute(attrName);
    }
  };

  DomHelpers.getBackgroundImage = function (element) {
    if (Helpers.hasJqueryOrJqueryLite()) {
      return element.attr('data-old-background') ? "url(" + element.attr('data-old-background') + ")" : element.css('background-image');
    }
    else {
      var style = window.getComputedStyle(element, null);
      if (!style) {
        return;
      }
      return element.getAttribute("data-old-background") ? "url(" + element.getAttribute("data-old-background") + ")" : style.backgroundImage;
    }
  };

  DomHelpers.setBackgroundImage = function (element, styleValue) {
    if (Helpers.hasJqueryOrJqueryLite()) {
      element.css('background-image', styleValue);
    }
    else {
      element.style.backgroundImage = styleValue;
    }
  };

  /*
   * ////////////////////////////////
   * ////////// PRIVATE
   * ////////////////////////////////
   */

  var Private = {
    attributes: {}
  };

  Private.isImgCacheLoaded = function () {
    if (!GolemCacheMecha.attributes.filesystem || !GolemCacheMecha.attributes.dirEntry) {
      GolemCacheMecha.overridables.log('GolemCacheMecha not loaded yet! - Have you called GolemCacheMecha.init() first?', LOG_LEVEL_WARNING);
      return false;
    }
    return true;
  };

  Private.attributes.hasLocalStorage = false;

  Private.hasLocalStorage = function () {
    // if already tested, avoid doing the check again
    if (Private.attributes.hasLocalStorage) {
      return Private.attributes.hasLocalStorage;
    }
    try {
      var mod = GolemCacheMecha.overridables.hash('imgcache_test');
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      Private.attributes.hasLocalStorage = true;
      return true;
    }
    catch (e) {
      // this is an info, not an error
      GolemCacheMecha.overridables.log('Could not write to local storage: ' + e.message, LOG_LEVEL_INFO);
      return false;
    }
  };

  Private.setCurrentSize = function (curSize) {
    GolemCacheMecha.overridables.log('current size: ' + curSize, LOG_LEVEL_INFO);
    if (Private.hasLocalStorage()) {
      localStorage.setItem('golemCacheMecha:' + GolemCacheMecha.options.localCacheFolder, curSize);
    }
  };

  Private.getCachedFilePath = function (img_src) {
    return Helpers.appendPaths(GolemCacheMecha.options.localCacheFolder, Private.getCachedFileName(img_src));
  };

  // used for FileTransfer.download only
  Private.getCachedFileFullPath = function (img_src) {
    var local_root = Helpers.EntryGetPath(GolemCacheMecha.attributes.dirEntry);
    return Helpers.appendPaths(local_root, Private.getCachedFileName(img_src));
  };

  Private.getCachedFileName = function (img_src) {
    if (!img_src) {
      GolemCacheMecha.overridables.log('No source given to getCachedFileName', LOG_LEVEL_WARNING);
      return;
    }
    var hash = GolemCacheMecha.overridables.hash(img_src);
    var ext = Helpers.fileGetExtension(Helpers.URIGetFileName(img_src));
    return hash + (ext ? ('.' + ext) : '');
  };

  Private.setNewImgPath = function ($img, new_src, old_src) {
    DomHelpers.setAttribute($img, 'src', new_src);
    // store previous url in case we need to reload it
    DomHelpers.setAttribute($img, OLD_SRC_ATTR, old_src);
  };

  Private.createCacheDir = function (success_callback, error_callback) {
    if (!GolemCacheMecha.attributes.filesystem) {
      GolemCacheMecha.overridables.log('Filesystem instance was not initialised', LOG_LEVEL_ERROR);
      if (error_callback) {
        error_callback();
      }
      return;
    }
    var _fail = function (error) {
      GolemCacheMecha.overridables.log('Failed to get/create local cache directory: ' + error.code, LOG_LEVEL_ERROR);
      if (error_callback) {
        error_callback();
      }
    };
    var _getDirSuccess = function (dirEntry) {
      GolemCacheMecha.attributes.dirEntry = dirEntry;
      GolemCacheMecha.overridables.log('Store assets to folder: ' + Helpers.EntryGetPath(dirEntry), LOG_LEVEL_INFO);

      //Put .nomedia file in cache directory so Android doesn't index it.
      if (Helpers.isCordovaAndroid()) {
        var _androidNoMediaFileCreated = function () {
          GolemCacheMecha.overridables.log('.nomedia file created.', LOG_LEVEL_INFO);
          if (success_callback) {
            success_callback();
          }
        };

        dirEntry.getFile('.nomedia', {
          create: true,
          exclusive: false
        }, _androidNoMediaFileCreated, _fail);
      }
      else if (!Helpers.isCordovaWindowsPhone()) {
        // #73 - iOS: the directory should not be backed up in iCloud
        if (Helpers.isCordovaIOS() && dirEntry.setMetadata) {
          dirEntry.setMetadata(function () {
            /* success*/
            GolemCacheMecha.overridables.log('com.apple.MobileBackup metadata set', LOG_LEVEL_INFO);
          }, function () {
            /* failure */
            GolemCacheMecha.overridables.log('com.apple.MobileBackup metadata could not be set', LOG_LEVEL_WARNING);
          }, {
            // 1=NO backup oddly enough..
            'com.apple.MobileBackup': 1
          });
        }

        if (success_callback) {
          success_callback();
        }
      }
      else {
        if (success_callback) {
          success_callback();
        }
      }

      GolemCacheMecha.ready = true;
      DomHelpers.trigger(document, IMGCACHE_READY_TRIGGERED_EVENT);
    };
    GolemCacheMecha.attributes.filesystem.root.getDirectory(GolemCacheMecha.options.localCacheFolder, {
      create: true,
      exclusive: false
    }, _getDirSuccess, _fail);
  };

  // This is a wrapper for phonegap's FileTransfer
  // object in order to implement the same feature
  // In Chrome (and possibly extra browsers in the future)
  Private.FileTransferWrapper = function (filesystem) {
    if (Helpers.isCordova()) {
      // PHONEGAP
      this.fileTransfer = new FileTransfer();
    }
    this.filesystem = filesystem; // only useful for CHROME
  };

  Private.FileTransferWrapper.prototype.download = function (uri, localPath, success_callback, error_callback, on_progress) {
    var headers = GolemCacheMecha.options.headers || {};
    var isOnProgressAvailable = (typeof on_progress === 'function');

    if (this.fileTransfer) {
      if (isOnProgressAvailable) {
        this.fileTransfer.onprogress = on_progress;
      }
      return this.fileTransfer.download(uri, localPath, success_callback, error_callback, false, {
        'headers': headers
      });
    }

    var filesystem = this.filesystem;

    // CHROME - browsers
    var _fail = function (str, level, error_callback) {
      GolemCacheMecha.overridables.log(str, level);
      // mock up FileTransferError, so at least caller knows there was a problem.
      // Normally, the error.code in the callback is a FileWriter error, we return 0 if the error was an XHR error
      if (error_callback) {
        error_callback({
          code: 0,
          source: uri,
          target: localPath
        });
      }
    };
    var xhr = new XMLHttpRequest();
    xhr.open('GET', uri, true);
    if (isOnProgressAvailable) {
      xhr.onprogress = on_progress;
    }
    if (GolemCacheMecha.options.withCredentials) {
      xhr.withCredentials = true;
    }
    xhr.timeout = GolemCacheMecha.options.timeout;
    xhr.responseType = 'blob';
    for (var key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
    xhr.onload = function () {
      if (xhr.response && (xhr.status === 200 || xhr.status === 0)) {
        filesystem.root.getFile(localPath, {
          create: true
        }, function (fileEntry) {
          fileEntry.createWriter(function (writer) {
            writer.onerror = error_callback;
            writer.onwriteend = function () {
              success_callback(fileEntry);
            };
            writer.write(xhr.response, error_callback);
          }, error_callback);
        }, error_callback);
      }
      else {
        _fail('Image ' + uri + ' could not be downloaded - status: ' + xhr.status, 3, error_callback);
      }
    };
    xhr.onerror = function () {
      _fail('XHR error - Image ' + uri + ' could not be downloaded - status: ' + xhr.status, 3, error_callback);
    };
    xhr.ontimeout = function () {
      _fail('XHR error - Image ' + uri + ' timed out - status: ' + xhr.status, 3, error_callback);
    };
    xhr.send();
  };

  Private.getBackgroundImageURL = function ($div) {
    var backgroundImageProperty = DomHelpers.getBackgroundImage($div);
    if (!backgroundImageProperty) {
      return;
    }
    var regexp = /url\s?\((.+)\)/;
    var img_src = regexp.exec(backgroundImageProperty)[1];
    return img_src.replace(/(['"])/g, '');
  };

  Private.getBase64DataFromEntry = function (entry, filename, success_callback, error_callback) {
    var _success = function (file) {
      var reader = new FileReader();
      reader.onloadend = function (e) {
        var base64content = e.target.result;
        if (base64content) {
          GolemCacheMecha.overridables.log('File ' + filename + ' loaded from cache', LOG_LEVEL_INFO);
          if (success_callback) {
            success_callback(base64content);
          }
        }
        else {
          GolemCacheMecha.overridables.log('File in cache ' + filename + ' is empty', LOG_LEVEL_WARNING);
          if (error_callback) {
            error_callback(filename);
          }
        }
      };
      reader.readAsDataURL(file);
    };
    var _failure = function (error) {
      GolemCacheMecha.overridables.log('Failed to read file ' + error.code, LOG_LEVEL_ERROR);
      if (error_callback) {
        error_callback(filename);
      }
    };

    entry.file(_success, _failure);
  };

  Private.loadCachedFile = function ($element, img_src, set_path_callback, success_callback, error_callback) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    if (!$element) {
      GolemCacheMecha.overridables.log('First parameter of loadCachedFile is empty, should be a DOM element', LOG_LEVEL_ERROR);
      return;
    }

    var filename = Helpers.URIGetFileName(img_src);

    var _gotFileEntry = function (entry) {
      if (GolemCacheMecha.options.useDataURI) {
        Private.getBase64DataFromEntry(entry, filename, function (base64content) {
          set_path_callback($element, base64content, img_src);
          if (success_callback) {
            success_callback($element);
          }
        }, function () {
          if (error_callback) {
            error_callback($element);
          }
        });
      }
      else {
        // using src="filesystem:" kind of url
        var new_url = Helpers.EntryGetURL(entry);
        set_path_callback($element, new_url, img_src);
        GolemCacheMecha.overridables.log('File ' + filename + ' loaded from cache', LOG_LEVEL_INFO);
        if (success_callback) {
          success_callback($element);
        }
      }
    };
    // if file does not exist in cache, cache it now!
    var _fail = function () {
      GolemCacheMecha.overridables.log('File ' + filename + ' not in cache', LOG_LEVEL_INFO);
      if (error_callback) {
        error_callback($element);
      }
    };
    GolemCacheMecha.attributes.filesystem.root.getFile(Private.getCachedFilePath(img_src), {
      create: false
    }, _gotFileEntry, _fail);
  };

  Private.setBackgroundImagePath = function ($element, new_src, old_src) {
    DomHelpers.setBackgroundImage($element, 'url("' + new_src + '")');
    // store previous url in case we need to reload it
    DomHelpers.setAttribute($element, OLD_BACKGROUND_ATTR, old_src);
  };

  /****************************************************************************/

  var OLD_SRC_ATTR = 'data-old-src',
    OLD_BACKGROUND_ATTR = 'data-old-background',
    IMGCACHE_READY_TRIGGERED_EVENT = 'ImgCacheReady';

  GolemCacheMecha.init = function (success_callback, error_callback) {

    // trying to be cross browser support
    GolemCacheMecha.jQuery = (window.jQuery || window.Zepto) ? true : false; /* using jQuery if it's available otherwise the DOM API */
    GolemCacheMecha.jQueryLite = (typeof window.angular !== 'undefined' && window.angular.element) ? true : false; /* is AngularJS jQueryLite available */

    GolemCacheMecha.attributes.init_callback = success_callback;

    GolemCacheMecha.overridables.log('GolemCacheMecha initialising', LOG_LEVEL_INFO);

    var _checkSize = function (callback) {
      if (GolemCacheMecha.options.cacheClearSize > 0) {
        var curSize = GolemCacheMecha.getCurrentSize();
        if (curSize > (GolemCacheMecha.options.cacheClearSize * 1024 * 1024)) {
          GolemCacheMecha.clearCache(callback, callback);
        }
        else {
          if (callback) {
            callback();
          }
        }
      }
      else {
        if (callback) {
          callback();
        }
      }
    };

    var _gotFS = function (filesystem) {
      GolemCacheMecha.overridables.log('`LocalFileSystem` service opened', LOG_LEVEL_INFO);

      // store filesystem handle
      GolemCacheMecha.attributes.filesystem = filesystem;

      Private.createCacheDir(function () {
        _checkSize(GolemCacheMecha.attributes.init_callback);
      }, error_callback);
    };

    var _fail = function (error) {
      GolemCacheMecha.overridables.log('Failed to initialise LocalFileSystem ' + error.code, LOG_LEVEL_ERROR);
      if (error_callback) {
        error_callback();
      }
    };

    if (Helpers.isCordova() && window.requestFileSystem) {
      // PHONEGAP
      if (GolemCacheMecha.options.androidFilesystemRoot) {
        try {
          window.resolveLocalFileSystemURL(
            GolemCacheMecha.options.androidFilesystemRoot,
            function (dirEntry) {
              _gotFS({
                root: dirEntry
              });
            },
            _fail
          );
        }
        catch (e) {
          _fail({
            code: e.message
          });
        }
      }
      else {
        window.requestFileSystem(Helpers.getCordovaStorageType(GolemCacheMecha.options.usePersistentCache), 0, _gotFS, _fail);
      }
    }
    else {
      //CHROME
      var savedFS = window.requestFileSystem || window.webkitRequestFileSystem;
      window.storageInfo = window.storageInfo || (GolemCacheMecha.options.usePersistentCache ? navigator.webkitPersistentStorage : navigator.webkitTemporaryStorage);
      if (!window.storageInfo) {
        GolemCacheMecha.overridables.log('Your browser does not support to use this caching mechanism!', LOG_LEVEL_WARNING);
        if (error_callback) {
          error_callback();
        }
        return;
      }
      // request space for storage
      var quota_size = GolemCacheMecha.options.chromeQuota;
      window.storageInfo.requestQuota(
        quota_size,
        function () {
          /* success*/
          var persistence = (GolemCacheMecha.options.usePersistentCache ? window.PERSISTENT : window.TEMPORARY);
          savedFS(persistence, quota_size, _gotFS, _fail);
        },
        function (error) {
          /* error*/
          GolemCacheMecha.overridables.log('Failed to request quota: ' + error.message, LOG_LEVEL_ERROR);
          if (error_callback) {
            error_callback();
          }
        }
      );
      // EXPERIMENTAL: santizing broken images and masking with dummy
      var dummyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4//8/AwAI/AL+hc2rNAAAAABJRU5ErkJggg==';
      var sanitizeBrokenImages = function (DOMimages) {
        // sanitizer
        if (!DOMimages || !DOMimages.nodeName || DOMimages.nodeName != 'IMG') {
          console.log('INFO: Sanitizing images');
          // get all images from DOM
          var getImg = document.getElementsByTagName('IMG');
          var i = getImg.length;
          if (i) {
            while (i--) {
              sanitizeBrokenImages(getImg[i]);
            }
          }
          return;
        }
        // masker
        var alterImg = new Image(); // create new Image
        alterImg.onerror = function () { // assign pure JS `onerror`
          console.log('INFO: Broken image found! Masking with dummy image.');
          DOMimages.src = dummyImage; // handler function
        };
        alterImg.src = DOMimages.src; // set src of new Image
      };
      // init
      sanitizeBrokenImages();
    }
  };

  GolemCacheMecha.getCurrentSize = function () {
    if (Private.hasLocalStorage()) {
      var curSize = localStorage.getItem('golemCacheMecha:' + GolemCacheMecha.options.localCacheFolder);
      if (curSize === null) {
        return 0;
      }
      return parseInt(curSize, 10);
    }
    else {
      return 0;
    }
  };

  // this function will not check if the image is already cached or not => it
  // will overwrite existing data on_progress callback follows this spec:
  // http://www.w3.org/TR/2014/REC-progress-events-20140211/ -- see #54
  GolemCacheMecha.cacheFile = function (img_src, success_callback, error_callback, on_progress) {
    if (!Private.isImgCacheLoaded() || !img_src) {
      return;
    }

    img_src = Helpers.sanitizeURI(img_src);

    var filePath = Private.getCachedFileFullPath(img_src);

    var fileTransfer = new Private.FileTransferWrapper(GolemCacheMecha.attributes.filesystem);
    fileTransfer.download(
      img_src,
      filePath,
      function (entry) {
        entry.getMetadata(function (metadata) {
          if (metadata && ('size' in metadata)) {
            GolemCacheMecha.overridables.log('Cached file size: ' + metadata.size, LOG_LEVEL_INFO);
            Private.setCurrentSize(GolemCacheMecha.getCurrentSize() + parseInt(metadata.size, 10));
          }
          else {
            GolemCacheMecha.overridables.log('No metadata size property available', LOG_LEVEL_INFO);
          }
        });
        GolemCacheMecha.overridables.log('Download complete: ' + Helpers.EntryGetPath(entry), LOG_LEVEL_INFO);

        // iOS: the file should not be backed up in iCloud
        // new from cordova 1.8 only
        if (entry.setMetadata) {
          entry.setMetadata(
            function () {
              /* success*/
              GolemCacheMecha.overridables.log('com.apple.MobileBackup metadata set', LOG_LEVEL_INFO);
            },
            function () {
              /* failure */
              GolemCacheMecha.overridables.log('com.apple.MobileBackup metadata could not be set', LOG_LEVEL_WARNING);
            }, {
              // 1=NO backup oddly enough..
              'com.apple.MobileBackup': 1
            }
          );
        }

        if (success_callback) {
          success_callback(entry.toURL());
        }
      },
      function (error) {
        if (error.source) {
          GolemCacheMecha.overridables.log('Download error source: ' + error.source, LOG_LEVEL_ERROR);
        }
        if (error.target) {
          GolemCacheMecha.overridables.log('Download error target: ' + error.target, LOG_LEVEL_ERROR);
        }
        GolemCacheMecha.overridables.log('Download error code: ' + error.code, LOG_LEVEL_ERROR);
        if (error_callback) {
          error_callback();
        }
      },
      on_progress
    );
  };

  // Returns the file already available in the cached
  // Reminder: this is an asynchronous method!
  // Answer to the question comes in response_callback as the second argument
  // (first being the path)
  GolemCacheMecha.getCachedFile = function (img_src, response_callback) {
    // sanity check
    if (!Private.isImgCacheLoaded() || !response_callback) {
      return;
    }

    var original_img_src = img_src;
    img_src = Helpers.sanitizeURI(img_src);

    var path = Private.getCachedFilePath(img_src);
    if (Helpers.isCordovaAndroid()) {
      // This hack is probably only used for older versions of Cordova
      if (path.indexOf('file://') === 0) {
        // issue #4 -- android cordova specific
        path = path.substr(7);
      }
    }

    // try to get the file entry: if it fails, there's no such file in the cache
    GolemCacheMecha.attributes.filesystem.root.getFile(
      path, {
        create: false
      },
      function (file_entry) {
        response_callback(img_src, file_entry);
      },
      function () {
        response_callback(original_img_src, null);
      }
    );
  };

  // Returns the local url of a file already available in the cache
  GolemCacheMecha.getCachedFileURL = function (img_src, success_callback, error_callback) {
    var _getURL = function (img_src, entry) {
      if (entry) {
        success_callback(img_src, Helpers.EntryGetURL(entry));
      }
      else {
        if (error_callback) {
          error_callback(img_src);
        }
      }
    };

    GolemCacheMecha.getCachedFile(img_src, _getURL);
  };

  GolemCacheMecha.getCachedFileBase64Data = function (img_src, success_callback, error_callback) {
    var _getData = function (img_src, entry) {
      if (entry) {
        Private.getBase64DataFromEntry(entry, img_src, function (base64content) {
          success_callback(img_src, base64content);
        }, error_callback);
      }
      else {
        if (error_callback) {
          error_callback(img_src);
        }
      }
    };

    GolemCacheMecha.getCachedFile(img_src, _getData);
  };

  // checks if a copy of the file has already been cached
  // Reminder: this is an asynchronous method!
  // Answer to the question comes in response_callback as the second argument
  // (first being the path)
  GolemCacheMecha.isCached = function (img_src, response_callback) {
    GolemCacheMecha.getCachedFile(img_src, function (src, file_entry) {
      response_callback(src, file_entry !== null);
    });
  };

  // $img: jQuery object of an <img> element
  // Synchronous method
  GolemCacheMecha.useOnlineFile = function ($img) {
    if (!Private.isImgCacheLoaded() || !$img) {
      return;
    }

    var prev_src = DomHelpers.getAttribute($img, OLD_SRC_ATTR);
    if (prev_src) {
      DomHelpers.setAttribute($img, 'src', prev_src);
    }
    DomHelpers.removeAttribute($img, OLD_SRC_ATTR);
  };

  // $img: jQuery object of an <img> element
  GolemCacheMecha.useCachedFile = function ($img, success_callback, error_callback) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    var img_url = Helpers.sanitizeURI(DomHelpers.getAttribute($img, 'src'));

    Private.loadCachedFile($img, img_url, Private.setNewImgPath, success_callback, error_callback);
  };

  // When the source url is not the 'src' attribute of the given img element
  GolemCacheMecha.useCachedFileWithSource = function ($img, image_url, success_callback, error_callback) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    var img_url = Helpers.sanitizeURI(image_url);

    Private.loadCachedFile($img, img_url, Private.setNewImgPath, success_callback, error_callback);
  };

  // clears the cache
  GolemCacheMecha.clearCache = function (success_callback, error_callback) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    // delete cache dir completely
    GolemCacheMecha.attributes.dirEntry.removeRecursively(
      function () {
        GolemCacheMecha.overridables.log('Local cache cleared', LOG_LEVEL_INFO);
        Private.setCurrentSize(0);
        // recreate the cache dir now
        Private.createCacheDir(success_callback, error_callback);
      },
      function (error) {
        GolemCacheMecha.overridables.log('Failed to remove directory or its contents: ' + error.code, LOG_LEVEL_ERROR);
        if (error_callback) {
          error_callback();
        }
      }
    );
  };

  GolemCacheMecha.removeFile = function (img_src, success_callback, error_callback) {
    img_src = Helpers.sanitizeURI(img_src);

    var filePath = Private.getCachedFilePath(img_src);
    var _fail = function (error) {
      GolemCacheMecha.overridables.log('Failed to remove file due to ' + error.code, LOG_LEVEL_ERROR);
      if (error_callback) {
        error_callback();
      }
    };
    GolemCacheMecha.attributes.filesystem.root.getFile(filePath, {
      create: false
    }, function (fileEntry) {
      fileEntry.remove(
        function () {
          if (success_callback) {
            success_callback();
          }
        },
        _fail
      );
    }, _fail);
  };

  GolemCacheMecha.isBackgroundCached = function ($div, response_callback) {
    var img_src = Private.getBackgroundImageURL($div);
    GolemCacheMecha.getCachedFile(img_src, function (src, file_entry) {
      response_callback(src, file_entry !== null);
    });
  };

  GolemCacheMecha.cacheBackground = function ($div, success_callback, error_callback, on_progress) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    var img_src = Private.getBackgroundImageURL($div);
    if (!img_src) {
      GolemCacheMecha.overridables.log('No background to cache', LOG_LEVEL_WARNING);
      if (error_callback) {
        error_callback();
      }
      return;
    }

    GolemCacheMecha.overridables.log('Background image URL: ' + img_src, LOG_LEVEL_INFO);
    GolemCacheMecha.cacheFile(img_src, success_callback, error_callback, on_progress);
  };

  GolemCacheMecha.useCachedBackground = function ($div, success_callback, error_callback) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    var img_src = Private.getBackgroundImageURL($div);
    if (!img_src) {
      GolemCacheMecha.overridables.log('No background to cache', LOG_LEVEL_WARNING);
      if (error_callback) {
        error_callback();
      }
      return;
    }

    Private.loadCachedFile($div, img_src, Private.setBackgroundImagePath, success_callback, error_callback);
  };

  GolemCacheMecha.useCachedBackgroundWithSource = function ($div, image_url, success_callback, error_callback) {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    Private.loadCachedFile($div, image_url, Private.setBackgroundImagePath, success_callback, error_callback);
  };

  // Improved by Nathan
  // $div: jQuery object of an element
  // Synchronous method
  // Method used to revert call to useCachedBackground
  GolemCacheMecha.useBackgroundOnlineFile = function ($div) {
    if (!$div) {
      return;
    }

    var prev_src = DomHelpers.getAttribute($div, OLD_BACKGROUND_ATTR);
    if (prev_src) {
      DomHelpers.setBackgroundImage($div, 'url("' + prev_src + '")');
    }
    DomHelpers.removeAttribute($div, OLD_BACKGROUND_ATTR);
  };

  // returns the URI of the local cache folder (filesystem:)
  // this function is more useful for the examples than for anything else..
  // Synchronous method
  GolemCacheMecha.getCacheFolderURI = function () {
    if (!Private.isImgCacheLoaded()) {
      return;
    }

    return Helpers.EntryGetURL(GolemCacheMecha.attributes.dirEntry);
  };

  // private methods can now be used publicly
  GolemCacheMecha.helpers = Helpers;
  GolemCacheMecha.domHelpers = DomHelpers;
  GolemCacheMecha.private = Private;

  /****************************************************************************/

  // Expose the class either via AMD, CommonJS or the global object
  if (typeof define === 'function' && define.amd) {
    define('golemCacheMecha', [], function () {
      return GolemCacheMecha;
    });
  }
  else if (typeof module === 'object' && module.exports) {
    module.exports = GolemCacheMecha;
  }
  else {
    window.GolemCacheMecha = GolemCacheMecha;
  }

})(window.jQuery || window.Zepto || function () {
  throw "ERR: require jQuery to use for `$img` (will fix with Polyfill in the future)";
});