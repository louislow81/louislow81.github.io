function greeting() {}

greeting.withTime = function() {

  const time = new Date().getHours();

  if (time < 12) { // morning

    const yelling = "<strong>Good morning!</strong>"
    snicker.onLoad(yelling, 10000);

  } else if (time < 20) { // evening

    const yelling = "<strong>Good evening!</strong>"
    snicker.onLoad(yelling, 10000);

  } else { // night

    const yelling = "<strong>Good night!</strong>"
    snicker.onLoad(yelling, 10000);

  }

};
