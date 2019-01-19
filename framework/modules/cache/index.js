module.exports = () =>  {
  let redisNamespace = process.env.namespace || 'app-password-namespace',
      prefix = `${redisNamespace}:cache`,
      redis = require("redis"),
      client = redis.createClient({prefix});  // put here password

  client.on("error", function (err) {
      console.log("Error connecting cache " + err);
  });
  client.on("ready", function (err) {
      console.log("cache connection .....OK");
  });

  // client.set("cache-xyz", JSON.stringify([1, 2, 3]), (err, res) => {
  //   console.log("set response", err, res);
  //   redis.createClient().get("cache-xyz", (err, res) => {
  //     console.log("get response", err, JSON.parse(res));
  //     // client.quit();
  //   });
  // });

  return {
    set: (key, value) => {
      return new Promise((resolve, reject) => {
        client.set(key, JSON.stringify(value), (err, res) => {
          if(err) {
            reject(err);
          } else {
            resolve(res);
          }
        })
      });
    },
    get: (key) => {
      return new Promise((resolve, reject) => {
        client.get(key, (err, res) => {
          if(err) {
            reject(err);
          } else {
            let parsed;
            try {parsed = JSON.parse(res)} catch(e) {console.log('parse error', res)}
            resolve(parsed || res);
          }
        })
      });
    }
  }

}
