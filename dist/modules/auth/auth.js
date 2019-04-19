"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var request = require('request');

var jwkToPem = require('jwk-to-pem');

var PUBLIC_JWK_URL = "".concat(process.env.AUTH_BASE_URL, "/jwks.json");

var getRemoteKey = function getRemoteKey(header, callback) {
  request(PUBLIC_JWK_URL, {
    json: true
  }, function (err, res, body) {
    var remoteJwk = body && body.keys && body.keys[0];

    if (err || !remoteJwk) {
      callback(err);
    } else {
      var key = jwkToPem(remoteJwk);
      callback(null, key);
    }
  });
};

var parseToken = function parseToken(token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, getRemoteKey, {}, function (err, decoded) {
      if (decoded) {
        resolve(decoded.user);
      } else {
        reject(err);
      }
    });
  });
};

var User =
/*#__PURE__*/
function () {
  function User(parsedJwtUser) {
    _classCallCheck(this, User);

    _defineProperty(this, "jwt", null);

    this.jwt = parsedJwtUser;
  }

  _createClass(User, [{
    key: "isAuthenticated",
    value: function isAuthenticated() {
      return !!this.jwt;
    }
  }]);

  return User;
}();

module.exports = {
  middlewareParseUser: function middlewareParseUser(req, res, next) {
    var authorization = req.headers.authorization;

    if (!authorization) {
      // user is simply not authenticated
      req.user = new User();
      next();
    } else if (authorization && !/^Bearer .+/.test(authorization)) {
      // authoriation is set bu not readable
      res.status(400).send({
        message: "Wrong token format"
      });
    } else {
      var token = authorization.replace(/^Bearer +/i, '');
      parseToken(token).then(function (decoded) {
        req.user = new User(decoded);
        next();
      })["catch"](function (err) {
        //console.log('auth error', err);
        req.user = new User();
        res.status(401).send({
          message: "Invalid token"
        });
      });
    }
  }
};