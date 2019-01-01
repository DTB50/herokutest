var express = require('express');
var router = express.Router();

let jsonData = require('./student.json');
let ufoData = require('./ufo-sightings.json');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/student/', function(req, res, next) {
    for (let i = 0; i < jsonData.length; i++){
        if (jsonData[i].car == "Honda"){
            var printThis = jsonData[i];
            res.send(printThis);
            console.log(printThis); 
        }
    }
});

//sends parsed data to client
router.get('/ufos/', function(req, res, next) {
    var toSend = [];
    for (let i = 0; i < ufoData.length; i++){
        if (ufoData[i].country == "gb" && ufoData[i].datetime.substr(6, 4) == 2000){
            var addThis = ufoData[i];
            toSend.push(addThis);
        }
    }
    console.log(toSend);
    res.json(toSend);
});

module.exports = router;
