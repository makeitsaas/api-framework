const redis = require("redis");
const rxjs = require('rxjs');
let CHANNELS = [];
module.exports = (redisSettings) => {

  let SUBSCRIPTIONS_CALLBACKS = [],
      redisNamespace = process.env.NAMESPACE || 'app-password-namespace',
      prefix = `${redisNamespace}:queue-`,
      prefixRegex = new RegExp(`^${prefix}`);

  // connection to redis
  const sub = redis.createClient({...redisSettings});  // put here password
  const pub = redis.createClient({...redisSettings});  // put here password

  sub.on("error", (err) => console.log("Error connecting queue " + err));
  sub.on("ready", (err) => console.log("queue connection .....OK"));

  // when receiving a message from subscribed channels, do this
  sub.on("message", function (prefixedChannel, message) {
    //console.log('prefixedChannel', prefixedChannel, message)
    if(isValidPrefix(prefixedChannel)) {
      let channel = removePrefix(prefixedChannel);
      //console.log("sub channel " + channel + ": " + message);
      SUBSCRIPTIONS_CALLBACKS.map(callback => {
        if(typeof callback === "function") {
          callback(channel, message);
        }
      });
    }
  });

  // sub.unsubscribe();
  // sub.quit();
  // pub.quit();

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
  };

  const getPrefixedChannel = (channel) => {
    return `${prefix}${channel}`
  };

  const removePrefix = (prefixedChannel) => {
    return prefixedChannel.replace(prefixRegex, '');
  };

  const isValidPrefix = (prefixedChannel) => {
    return prefixRegex.test(prefixedChannel);
  };

  return {
    observable: function(channel) {
      let active = true;
      let callback;
      let prefixedChannel = getPrefixedChannel(channel);

      let obs = rxjs.Observable.create(observer => {

        callback = (c, message) => {
          if(c === channel && active) {
            observer.next(message);
          }
        };
        SUBSCRIPTIONS_CALLBACKS.push(callback);

        const unsubscribe = () => {
          active = false;
          callback = null;
        };

        return unsubscribe;
      });

      subscribeIfNecessary(prefixedChannel);

      return obs;
    },
    publish: function(channel, message) {
      let prefixedChannel = getPrefixedChannel(channel);
      pub.publish(prefixedChannel, `${JSON.stringify(message)}`);
    }
  }
};
