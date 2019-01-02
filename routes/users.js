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


//sends parsed bar chart data to client
router.get('/ufosChartData/', function(req, res, next) {
    var chartData = [];

    //calculate number of occurrences per year in the UK
    //for each year in the dataset for the UK (1955-2014), count how many sightings occur
    for (var year = 1955; year < 2015; year++){
        var sightingCount = 0;
        ufoData.forEach(function(d){
            if (d.country == "gb" && d.datetime.substr(6, 4) == year){
                sightingCount++;
            }
        })
        //put that into a year/sightings object and that object into an array
        var yearObject = {
            year: year,
            sightingCount: sightingCount
            }
        chartData.push(yearObject);
    }
    
    //send the array to the client
    console.log(chartData);
    res.json(chartData);
});

router.post('/ufosUpdate', function(req, res) {
    var year = req.body.year;
    var toSend = [];
    for (let i = 0; i < ufoData.length; i++){
        if (ufoData[i].country == "gb" && ufoData[i].datetime.substr(6, 4) == year){
            var addThis = ufoData[i];
            toSend.push(addThis);
        }
    }
    console.log(toSend);
    res.json(toSend);
});



module.exports = router;
