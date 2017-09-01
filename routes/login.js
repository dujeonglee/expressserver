var express = require('express');
var userinfo = require('../model/userinfo');
const jwt = require('jsonwebtoken')
var router = express.Router();

router.post('/', function (req, res, next) {
  if (typeof req.body.name === "undefined") {
    res.status(400).json({ success: false, message: "name is undefined" });
    return;
  }
  if (typeof req.body.password === "undefined") {
    res.status(400).json({ success: false, message: "password is undefined" });
    return;
  }
  const secret = req.app.get('jwt-secret')
  userinfo.verifyUser(req.body.name, req.body.password).then(function (result) {
    req.jwtToken = result.message;
    req.jwtOption = {
      expiresIn: '1d',
      issuer: 'dujeonglee',
      subject: 'userinfo'
    };
    next();
  }).catch(function (err) {
    res.status(404).json(err);
  });
});

module.exports = router;
