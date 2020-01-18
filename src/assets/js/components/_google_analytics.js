/*
  Google Analytics Tracker
  @param {null}
*/
function googleAnalytics() {

  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments)
  };

  gtag('js', new Date());
  gtag('config', 'UA-109094106-2');
};
