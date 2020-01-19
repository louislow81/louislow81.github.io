const pageReadingMeter = {

  "defaults": {
    "color": "rgba(49, 130, 206, 1)",
    "height": "3px",
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0,
    "zIndex": 9999,
    "ontop": true, // bottom or top
    "ltr": true, // left to right
    "attach": false, // element to use value
    "css": false, // js style or css
    "round": false, // decimal numbers
    "nobar": false // use only values
  },
  "start": function(configs = {}) {

    let progressJSelem;

    if (!configs.nobar) {
      //create element
      progressJSelem = document.createElement("y");
      //use css instead of js style
      progressJSelem.setAttribute('id', 'pageReadProgressBar');
      //append to body
      document.body.appendChild(progressJSelem);
      //styles
      progressJSelem.style.position = 'fixed';
      progressJSelem.style.zIndex = '99999';
      progressJSelem.style.width = '0%';

      //configurable options
      //top or bottom
      configs.ontop ? progressJSelem.style.bottom = '0' : progressJSelem.style.top = reader.defaults.top;
      //ltr or rtl
      configs.ltr ? progressJSelem.style.right = '0' : progressJSelem.style.left = reader.defaults.left;
      //height
      configs.height ? progressJSelem.style.height = configs.height : progressJSelem.style.height = reader.defaults.height;
      //color
      configs.color ? progressJSelem.style.backgroundColor = configs.color : progressJSelem.style.backgroundColor = reader.defaults.color;
    }

    let attachElem = reader.defaults.attach;
    let roundto = reader.defaults.round;

    //round to
    configs.round ? roundto = configs.round : roundto = 2;
    //attach
    configs.attach ? attachElem = document.querySelector(configs.attach) : false;

    //scroll event
    document.addEventListener('scroll', function(e) {
      const maxHeight = document.body.scrollHeight;
      const sizeHeight = window.innerHeight;
      const scrolls = window.scrollY;
      const percentage = (scrolls / (maxHeight - sizeHeight)) * 100;
      if (!configs.nobar) {
        progressJSelem.style.width = percentage.toFixed(roundto) + "%";
      }
      if (attachElem) {
        attachElem.innerHTML = percentage.toFixed(roundto);
      }
    });

  }
}

