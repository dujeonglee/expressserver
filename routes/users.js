var express = require('express');
var userinfo = require('../model/userinfo');
var router = express.Router();

router.get('/', function (req, res, next) {
  /**
   * Check if name is in the query.
   */
  if (typeof req.query.name === "undefined") {
    res.status(400).json({ success: false, message: "name is undefined" });
    return;
  }

  userinfo.findUser(req.query.name).then(function (result) {
    if (result.success === false) {
      res.status(404).json(result);
      return;
    }
    res.status(200).json(result);
    return;
  }).catch(function (err) {
    res.status(404).json(err);
    return;
  });;
});

router.put('/', function (req, res, next) {
  if (typeof req.body.name === "undefined") {
    res.status(400).json({ success: false, message: "name is undefined" });
    return;
  }
  if (typeof req.body.password === "undefined") {
    res.status(400).json({ success: false, message: "password is undefined" });
    return;
  }
  if (typeof req.body.admin === "undefined") {
    res.status(400).json({ success: false, message: "admin is undefined" });
    return;
  }

  userinfo.createUser(req.body.name, req.body.password, req.body.admin).then(function (result) {
    if (result.success === false) {
      res.status(404).send(result);
      return;
    }
    res.status(200).send(result);
    return;
  }).catch(function (err) {
    res.status(404).send(err);
    return;
  });
});

router.post('/', function (req, res, next) {
  if (typeof req.body.name === "undefined") {
    res.status(400).json({ success: false, message: "name is undefined" });
    return;
  }
  if (typeof req.body.password === "undefined") {
    res.status(400).json({ success: false, message: "password is undefined" });
    return;
  }
  if (typeof req.body.admin === "undefined") {
    res.status(400).json({ success: false, message: "admin is undefined" });
    return;
  }

  userinfo.updateUser(req.body.name, req.body.password, req.body.admin).then(function (result) {
    if (result.success === false) {
      res.status(404).json(result);
      return;
    }
    res.status(200).json(result);
    return;
  }).catch(function (err) {
    res.status(404).json(err);
    return;
  });
});

router.delete('/', function (req, res, next) {
  if (typeof req.body.name === "undefined") {
    res.status(400).json({ success: false, message: "name is undefined" });
    return;
  }

  userinfo.deleteUser(req.body.name).then(function (result) {
    if (result.success === false) {
      res.status(404).json(result);
      return;
    }
    res.status(200).json(result);
    return;
  }).catch(function (err) {
    res.status(404).json(err);
    return;
  });
});

module.exports = router;
