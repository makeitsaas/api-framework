module.exports = function(app, config, auth, framework) {
  if(config && config.resources && config.resources.expose) {
    for(var key in config.resources.expose) {
      let routes = config.resources.expose[key];
      if(routes){
        routes.map(route => {
          for(var method in route) {
            break;
          }
          let appRoot = require('app-root-path'),
              handlerPath,
              handlerFunction,
              handler;

          try {
            handlerPath = `${appRoot}/../app/src/handlers/${route.handler.split('.')[0]}`;
            handlerFunction = route.handler.split('.')[1];
            handler = require(handlerPath);
          } catch(e) {
            console.log('[NOTICE] handler not available :', route.handler);
          }

          app[method](route[method], auth.middlewareParseUser, (req, res) => {
            console.log('catch route', route, req.user.isAuthenticated());

            const resolve = (body) => {
              res.send(body);
            };

            if(handler) {
              try {
                let ctx = {
                  user: req.user,
                  ...framework
                };
                handler(ctx, resolve)[handlerFunction]();
              } catch(error) {
                console.log('error', error);
                resolve({mode: 'handler', route, error});
              }
            } else {
              resolve({mode: 'auto', route});
            }
          });
        });
      }
    }
  }
};
