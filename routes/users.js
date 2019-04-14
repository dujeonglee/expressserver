var express = require('express');
var userinfo = require('../model/userinfo');
var router = express.Router();

router.get('/', function (req, res, next) {
  /**
   * Check if name is in the query.
   */
  if (typeof req.query.phone === "undefined") {
    res.status(400).json({ success: false, message: "phone is undefined" });
    return;
  }

  userinfo.findUser(req.query.phone).then(function (result) {
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
  if(req.verifiedToken.admin !== true){
    res.status(400).json({ success: false, message: "Permission denied" });
    return;
  }
  if (typeof req.body.phone === "undefined") {
    res.status(400).json({ success: false, message: "phone is undefined" });
    return;
  }
  if (typeof req.body.cumulative_points === "undefined") {
    res.status(400).json({ success: false, message: "cumulative_points is undefined" });
    return;
  }
  if (typeof req.body.available_points === "undefined") {
    res.status(400).json({ success: false, message: "available_points is undefined" });
    return;
  }
  if (typeof req.body.visit_count === "undefined") {
    res.status(400).json({ success: false, message: "visit_count is undefined" });
    return;
  }
  if (typeof req.body.level === "undefined") {
    res.status(400).json({ success: false, message: "level is undefined" });
    return;
  }

  userinfo.createCustomerUser(req.body.phone, req.body.cumulative_points, req.body.available_points, req.body.visit_count, req.body.level).then(function (result) {
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
  if(req.verifiedToken.admin !== true){
    res.status(400).json({ success: false, message: "Permission denied" });
    return;
  }
  if (typeof req.body.phone === "undefined") {
    res.status(400).json({ success: false, message: "phone is undefined" });
    return;
  }
  if (typeof req.body.cumulative_points === "undefined") {
    res.status(400).json({ success: false, message: "cumulative_points is undefined" });
    return;
  }
  if (typeof req.body.available_points === "undefined") {
    res.status(400).json({ success: false, message: "available_points is undefined" });
    return;
  }
  if (typeof req.body.visit_count === "undefined") {
    res.status(400).json({ success: false, message: "visit_count is undefined" });
    return;
  }
  if (typeof req.body.level === "undefined") {
    res.status(400).json({ success: false, message: "level is undefined" });
    return;
  }

  userinfo.updateUser(req.body.phone, req.body.cumulative_points, req.body.available_points, req.body.visit_count, req.body.level).then(function (result) {
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
  if(req.verifiedToken.admin !== true){
    res.status(400).json({ success: false, message: "Permission denied" });
    return;
  }
  if (typeof req.body.phone === "undefined") {
    res.status(400).json({ success: false, message: "name is undefined" });
    return;
  }

  userinfo.deleteUser(req.body.phone).then(function (result) {
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
