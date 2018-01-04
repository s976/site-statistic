/**
 * Created by shimon on 20/06/2017.
 */
var express = require('express');
var router = express.Router();
var Record = require('../libs/records');
var Page = require('../libs/pages');
var cache = require('../libs/cache');
var settings = require('../settings');

router.post('/record',function (req,res,next) {
    if ( settings.sites.indexOf(req.headers.origin) === -1){
        res.status(400).json({errMessage:'nu nu nu!'});
        return false;
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var theIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //это для CloudFlare

    req.headers.referer = req.headers.referer.toLowerCase();

    //ответ с данными о статистике стр.
    Page.findOne({url:req.headers.referer},function (err,page) {
        if (err) console.error(err);

        var response = {};

        if(page){
            response.page = page;
        } else {
            response.page = {
                count : 1,
                last_visit : Date.now(),
                just_recorded : true
            };
        }
        
        Record.visitorsNow(10, req.headers.origin ,function (err, visitorsNumber) {
            response.visitors = visitorsNumber;
            res.json(response);
        });

    });

    Record.needRecord({
        ip: theIP,
        url: req.headers.referer
        },
        function (err,records) {
            if (err) console.error(err);
            if (!records) console.log("No records!!!");

            if (records.length === 0){ //посещений не было в последнее время. нужно регистрировать
                Record.addRecord({
                    ip:theIP,
                    url: req.headers.referer
                });


                Page.registerVisit({
                    ip:theIP,
                    url: req.headers.referer,
                    title: req.body.title
                });


            }
        });
});

router.get('/cache',function (req,res) {
    if ( settings.sites.indexOf(req.headers.origin) === -1){
        res.status(400).json({errMessage:'nu nu nu!'});
        return false;
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    //res.json(cache);
    var site = req.headers.origin;
    res.json(cache[site]);

});


router.post('/test',function (req,res,next) {
    res.json(cache);
});

module.exports = router;