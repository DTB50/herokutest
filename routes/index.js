var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
    res.sendFile('/public/index.html');
    console.log("page served");
});

module.exports = router;
