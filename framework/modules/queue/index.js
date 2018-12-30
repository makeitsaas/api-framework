const redis = require("redis");
const CHANNELS = ['a nice channel', 'another channel']
module.exports = () => {

  // connection to redis
  var sub = redis.createClient();
  var pub = redis.createClient();
  var msg_count = 0;


  sub.on("error", function (err) {
      console.log("Error connecting queue " + err);
  });
  sub.on("ready", function (err) {
      console.log("queue connection .....OK");
  });

  //CHANNELS.map(channel => sub.subscribe(channel))
  sub.subscribe(CHANNELS);

  // when receiving a message from subscribed channels, do this
  sub.on("message", function (messageChannel, message) {
      console.log("sub channel " + messageChannel + ": " + message);
      // sub.unsubscribe();
      // sub.quit();
      // pub.quit();
  });

  setInterval(() => {
    if(CHANNELS.length) {
      let channel = CHANNELS[Math.floor(Math.random() * CHANNELS.length)];
      pub.publish(channel, `Some message to ${channel}`);
    }
  }, 2000)
}
