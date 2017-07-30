/**
 * Created by shimon on 20/06/2017.
 */
var express = require('express');
var router = express.Router();
var Record = require('../libs/records');
var Page = require('../libs/pages');

router.post('/record',function (req,res,next) {

    var origins = [
        'http://dev.dinonline.org',
        'http://dinonline.org',
        'http://din.org.il'
    ];

    if ( origins.indexOf(req.headers.origin) === -1){
        res.status(400).json({errMessage:'nu nu nu!'});
        return false;
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var theIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //это для CloudFlare

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

            if (records.length === 0){ //посещений не было в последнее время. нужно регистрировать
                Record.addRecord({
                    ip:theIP,
                    url: req.headers.referer
                });


                Page.registerVisit({
                    ip:theIP,
                    url: req.headers.referer
                });


            }
        });





});


module.exports = router;