"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = function (redisSettings) {
  var redisNamespace = process.env.NAMESPACE || 'app-password-namespace',
      prefix = "".concat(redisNamespace, ":cache"),
      redis = require("redis"),
      client = redis.createClient(_objectSpread({}, redisSettings, {
    prefix: prefix
  })); // put here password


  client.on("error", function (err) {
    console.log("Error connecting cache " + err);
  });
  client.on("ready", function (err) {
    console.log("cache connection ..........OK");
  }); // client.set("cache-xyz", JSON.stringify([1, 2, 3]), (err, res) => {
  //   console.log("set response", err, res);
  //   redis.createClient().get("cache-xyz", (err, res) => {
  //     console.log("get response", err, JSON.parse(res));
  //     // client.quit();
  //   });
  // });

  return {
    set: function set(key, value) {
      return new Promise(function (resolve, reject) {
        client.set(key, JSON.stringify(value), function (err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    },
    get: function get(key) {
      return new Promise(function (resolve, reject) {
        client.get(key, function (err, res) {
          if (err) {
            reject(err);
          } else {
            var parsed;

            try {
              parsed = JSON.parse(res);
            } catch (e) {
              console.log('parse error', res);
            }

            resolve(parsed || res);
          }
        });
      });
    }
  };
};