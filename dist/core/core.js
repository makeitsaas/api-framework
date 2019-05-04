"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var config = require('./core-config');

var app = require('./core-server');

var framework = {};

var builder = require('./core-builder')(app, config, framework);

var load =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var _ref2, sequelize, models;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return builder.configureRoutes();

          case 2:
            framework.routes = _context.sent;
            _context.next = 5;
            return builder.configureQueue();

          case 5:
            framework.queue = _context.sent;
            _context.next = 8;
            return builder.configureCache();

          case 8:
            framework.cache = _context.sent;
            _context.next = 11;
            return builder.configureDatabase();

          case 11:
            _ref2 = _context.sent;
            sequelize = _ref2.sequelize;
            models = _ref2.models;
            framework.database = {
              query: sequelize.query
            };
            framework.models = models;

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function load() {
    return _ref.apply(this, arguments);
  };
}();

module.exports = load().then(function () {
  return framework;
});