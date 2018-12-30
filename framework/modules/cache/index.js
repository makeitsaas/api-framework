module.exports = () =>  {
  var redis = require("redis"),
      client = redis.createClient();

  client.on("error", function (err) {
      console.log("Error connecting cache " + err);
  });
  client.on("ready", function (err) {
      console.log("cache connection .....OK");
  });

  client.set("cache-xyz", JSON.stringify([1, 2, 3]), function(err, res) {
    console.log("set response", err, res);
    redis.createClient().get("cache-xyz", function(err, res) {
      console.log("get response", err, JSON.parse(res));
      client.quit();
    });
  });

}
