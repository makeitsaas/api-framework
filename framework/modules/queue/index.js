const redis = require("redis");
let CHANNELS = [];
module.exports = () => {

  let SUBSCRIPTIONS_CALLBACKS = [];

  // connection to redis
  var sub = redis.createClient();
  var pub = redis.createClient();
  var msg_count = 0;


  sub.on("error", (err) => console.log("Error connecting queue " + err));
  sub.on("ready", (err) => console.log("queue connection .....OK"));

  // when receiving a message from subscribed channels, do this
  sub.on("message", function (messageChannel, message) {
      console.log("sub channel " + messageChannel + ": " + message);
      SUBSCRIPTIONS_CALLBACKS.map(callback => {
        if(typeof callback === "function") {
          callback(messageChannel, message);
        }
      })
      // sub.unsubscribe();
      // sub.quit();
      // pub.quit();
  });

  // setInterval(() => {
  //   if(CHANNELS.length) {
  //     let channel = CHANNELS[Math.floor(Math.random() * CHANNELS.length)];
  //     pub.publish(channel, `Some message to ${channel}`);
  //   }
  // }, 2000)

  const subscribeIfNecessary = (channel) => {
    if(CHANNELS.indexOf(channel) === -1) {
      CHANNELS.push(channel);
      sub.subscribe(channel);
    }
  }


  return {
    subscribe: function(queueName) {
      let active = true;
      let callback;
      let q = new Promise((resolve, reject) => {
        callback = (channel, message) => {
          if(channel === queueName && active) {
            resolve(message);
          }
        }
        SUBSCRIPTIONS_CALLBACKS.push(callback)
      });

      q.unsubscribe = function() {
        active = false;
        callback = null;
        // plus remove callback
      }

      subscribeIfNecessary(queueName);

      return q;
    },
    publish: function(queueName, message) {
      pub.publish(queueName, `Some message to ${queueName} ${JSON.stringify(message)}`);
    }
  }
}
