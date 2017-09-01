var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('API GET');
    console.log(req.verifiedToken);
    res.send();
});
router.put('/', function(req, res, next) {
    console.log('API PUT');
    console.log(req.verifiedToken);
    res.send();
});
router.post('/', function(req, res, next) {
    console.log('API POST');
    console.log(req.verifiedToken);
    res.send();
});
router.delete('/', function(req, res, next) {
    console.log('API DELETE');
    console.log(req.verifiedToken);
    res.send();
});

module.exports = router;
