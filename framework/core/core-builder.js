module.exports = function(app, config) {
  return {
    configureQueue: function() {
      return require('../modules/queue/index')();
    },
    configureCache: function() {
      return require('../modules/cache/index')();
    },
    configureRoutes: function() {
      //console.log('configure routes', config);
      if(config && config.resources && config.resources.expose) {
        for(var key in config.resources.expose) {
          let routes = config.resources.expose[key];
          if(routes){
            routes.map(route => {
              for(var method in route) {
                break;
              }
              app[method](route[method], (req, res) => {
                console.log('auto rule for', route);
                res.send({route});
              });
            });
          }
        }
      }
    }
  }
}
