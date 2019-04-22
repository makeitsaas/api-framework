module.exports = function(app, config, auth, framework) {
  if(config && config.resources && config.resources.expose) {
    for(var key in config.resources.expose) {
      let routes = config.resources.expose[key];
      if(routes){
        routes.map(route => {
          for(var method in route) {
            break;
          }
          let appRoot = process.env.__PROJECT_ROOT_PATH__,
              handlerPath,
              handlerFunction,
              handler;

          try {
            handlerPath = `${appRoot}/app/src/handlers/${route.handler.split('.')[0]}`;
            handlerFunction = route.handler.split('.')[1];
            handler = require(handlerPath);
          } catch(e) {
            console.log('[NOTICE] handler not available :', route.handler);
          }

          app[method](route[method], auth.middlewareParseUser, (req, res) => {
            console.log('catch route', route, req.user.isAuthenticated());

            const resolve = (arg1, arg2) => {
              let status = arg2,
                  body = isNaN(arg1) ? arg1 : null;

              // specific case : only 1 argument that is a number (404, 400, ... with no message)
              if(!status && !isNaN(arg1)) {
                status = parseInt(arg1);
              }

              res.status(status || 200).send(body);
            };

            if(handler) {
              Promise.resolve()
                  .then(() => {
                    let ctx = {
                      request: {
                        params: req.params,
                        query: req.query,
                        body: req.body
                      },
                      user: req.user,
                      ...framework
                    };
                    return handler(ctx, resolve)[handlerFunction]();
                  })
                  .catch(error => {
                    console.log('error', error);
                    resolve({error: error && error.message, route, mode: 'handler'}, 500);
                  });
            } else {
              resolve({mode: 'auto', route});
            }
          });
        });
      }
    }
  }
};
