function greeting() {}

greeting.withTime = function() {

  const time = new Date().getHours();
  const msg = " Are you coming here to hire me?";

  if (time < 12) { // morning

    const yelling = "<strong>Good morning!</strong>" + msg;
    snicker.onLoad(yelling, 15000);

  } else if (time < 20) { // evening

    const yelling = "<strong>Good evening!</strong>" + msg;
    snicker.onLoad(yelling, 15000);

  } else { // night

    const yelling = "<strong>Good night!</strong>" + msg;
    snicker.onLoad(yelling, 15000);

  }

};
