"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

module.exports = function (app, config, framework) {
  var redisSettings = {
    host: process.env.REDIS_HOST || 'localhost'
  };
  return {
    configureQueue: function configureQueue() {
      var queueAPI = require('../modules/queue/index')(redisSettings);

      return Promise.resolve(queueAPI);
    },
    configureCache: function configureCache() {
      var cacheAPI = require('../modules/cache/index')(redisSettings);

      return Promise.resolve(cacheAPI);
    },
    configureRoutes: function configureRoutes() {
      var auth = require('../modules/auth/auth');

      var routes = require('../modules/route/route')(app, config, auth, framework); // default root path


      app.get('/', function (req, res) {
        return res.send('App is up and running');
      });
      return Promise.resolve(routes);
    },
    configureDatabase: function () {
      var _configureDatabase = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var sequelize, models;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return require('../modules/database/sequelize')(framework);

              case 2:
                sequelize = _context.sent;
                _context.next = 5;
                return require('../modules/database/entities-loader')(sequelize);

              case 5:
                models = _context.sent;
                return _context.abrupt("return", {
                  sequelize: sequelize,
                  models: models
                });

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function configureDatabase() {
        return _configureDatabase.apply(this, arguments);
      }

      return configureDatabase;
    }()
  };
};