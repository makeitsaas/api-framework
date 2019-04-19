"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var redis = require("redis");

var rxjs = require('rxjs');

var CHANNELS = [];

module.exports = function (redisSettings) {
  var SUBSCRIPTIONS_CALLBACKS = [],
      redisNamespace = process.env.NAMESPACE || 'app-password-namespace',
      prefix = "".concat(redisNamespace, ":queue-"),
      prefixRegex = new RegExp("^".concat(prefix)); // connection to redis

  var sub = redis.createClient(_objectSpread({}, redisSettings)); // put here password

  var pub = redis.createClient(_objectSpread({}, redisSettings)); // put here password

  sub.on("error", function (err) {
    return console.log("Error connecting queue " + err);
  });
  sub.on("ready", function (err) {
    return console.log("queue connection .....OK");
  }); // when receiving a message from subscribed channels, do this

  sub.on("message", function (prefixedChannel, message) {
    //console.log('prefixedChannel', prefixedChannel, message)
    if (isValidPrefix(prefixedChannel)) {
      var channel = removePrefix(prefixedChannel); //console.log("sub channel " + channel + ": " + message);

      SUBSCRIPTIONS_CALLBACKS.map(function (callback) {
        if (typeof callback === "function") {
          callback(channel, message);
        }
      });
    }
  }); // sub.unsubscribe();
  // sub.quit();
  // pub.quit();
  // setInterval(() => {
  //   if(CHANNELS.length) {
  //     let channel = CHANNELS[Math.floor(Math.random() * CHANNELS.length)];
  //     pub.publish(channel, `Some message to ${channel}`);
  //   }
  // }, 2000)

  var subscribeIfNecessary = function subscribeIfNecessary(channel) {
    if (CHANNELS.indexOf(channel) === -1) {
      CHANNELS.push(channel);
      sub.subscribe(channel);
    }
  };

  var getPrefixedChannel = function getPrefixedChannel(channel) {
    return "".concat(prefix).concat(channel);
  };

  var removePrefix = function removePrefix(prefixedChannel) {
    return prefixedChannel.replace(prefixRegex, '');
  };

  var isValidPrefix = function isValidPrefix(prefixedChannel) {
    return prefixRegex.test(prefixedChannel);
  };

  return {
    observable: function observable(channel) {
      var active = true;
      var callback;
      var prefixedChannel = getPrefixedChannel(channel);
      var obs = rxjs.Observable.create(function (observer) {
        callback = function callback(c, message) {
          if (c === channel && active) {
            observer.next(message);
          }
        };

        SUBSCRIPTIONS_CALLBACKS.push(callback);

        var unsubscribe = function unsubscribe() {
          active = false;
          callback = null;
        };

        return unsubscribe;
      });
      subscribeIfNecessary(prefixedChannel);
      return obs;
    },
    publish: function publish(channel, message) {
      var prefixedChannel = getPrefixedChannel(channel);
      pub.publish(prefixedChannel, "".concat(JSON.stringify(message)));
    }
  };
};