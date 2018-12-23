module.exports = {
  configureRoutes: function(app, config) {
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
