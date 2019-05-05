"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = function (app, config, auth, framework) {
  if (config && config.resources && config.resources.expose) {
    for (var key in config.resources.expose) {
      var routes = config.resources.expose[key];

      if (routes) {
        routes.map(function (route) {
          for (var method in route) {
            break;
          }

          var appRoot = process.env.__PROJECT_ROOT_PATH__,
              handlerPath,
              handlerFunction,
              handler;

          try {
            handlerPath = "".concat(appRoot, "/app/src/handlers/").concat(route.handler.split('.')[0]);
            handlerFunction = route.handler.split('.')[1];
            handler = require(handlerPath);
          } catch (e) {
            console.log('[NOTICE] handler not available :', route.handler);
          }

          app[method](route[method], auth.middlewareParseUser, function (req, res) {
            console.log('catch route', route, req.user.isAuthenticated());

            var resolve = function resolve(arg1, arg2) {
              var status = arg2,
                  body = isNaN(arg1) ? arg1 : null; // specific case : only 1 argument that is a number (404, 400, ... with no message)

              if (!status && !isNaN(arg1)) {
                status = parseInt(arg1);
              }

              res.status(status || 200).send(body);
            };

            if (handler) {
              Promise.resolve().then(function () {
                var ctx = _objectSpread({
                  request: {
                    params: req.params,
                    query: req.query,
                    body: req.body
                  },
                  user: req.user
                }, framework);

                return handler(ctx, resolve)[handlerFunction]();
              })["catch"](function (error) {
                console.log('error', error);
                resolve({
                  error: error && error.message,
                  route: route,
                  mode: 'handler'
                }, getErrorCode(error));
              });
            } else {
              resolve({
                mode: 'auto',
                route: route
              });
            }
          });
        });
      }
    }
  }
};

var codeInMessageRegExp = /^((\(|\[)?(\d+)(\)|\]| ?:)? +)(.*)/;

function getErrorCode(error) {
  var msg = error && error.message;

  if (msg) {
    if (codeInMessageRegExp.test(msg)) {
      return parseInt(msg.replace(codeInMessageRegExp, '$3'));
    } else if (/not found/i.test(msg)) {
      return 404;
    } else if (/invalid/i.test(msg)) {
      return 400;
    }
  }

  return 500;
}