function message() {};

message.timezone = function() {

  const time = new Date().getHours();
  const msg = " Are you come here to hire me?";

  if (time < 10) { // morning

    const yelling = '<strong>Good morning!</strong>' + msg;
    snicker.onLoad(yelling, 15000);

  }
  else if (time < 18) { // evening

    const yelling = '<strong>Good evening!</strong>' + msg;
    snicker.onLoad(yelling, 15000);

  }
  else { // night

    const yelling = '<strong>Good night!</strong>' + msg;
    snicker.onLoad(yelling, 15000);

  }

};
