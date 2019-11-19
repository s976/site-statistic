/**
 * Created by shimon on 20/06/2017.
 */
var express = require('express');
var router = express.Router();
var Record = require('../libs/records');
var Page = require('../libs/pages');
//var cache = require('../libs/cache');
var settings = require('../settings');
let lastVisits = require('../libs/LastVisits');

/**
 * Middleware function. Check if a request is from enabled site
 *
 * @param req
 * @param res
 * @param next
 * @returns {boolean}
 */
const checkIfRightDomain = function(req, res, next){
    let i = req.headers.origin.indexOf("//");
    if(i<5){ //may be 5 or 6
        res.status(400).json({errMessage:'Invalid origin header'});
        return false;
    }
    let site = req.headers.origin.slice(i+2); //cut "http(s)://" part
    if ( settings.sites.indexOf(site) === -1){
        res.status(400).json({errMessage:'nu nu nu!'});
        return false;
    }
    req.site = site;
    next();
};

router.post('/record',
    checkIfRightDomain,
    function (req,res,next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        var theIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //это для CloudFlare

        req.headers.referer = req.headers.referer.toLowerCase();

        lastVisits.registerVisit({
            ip:theIP,
            url: req.headers.referer,
            title: req.body.title
        });



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

                if (!records || records.length === 0){ //посещений не было в последнее время. нужно регистрировать
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

router.get('/cache',
    checkIfRightDomain, //middleware function
    function (req,res){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        res.json(lastVisits.summary[req.site]);
});


router.post('/test',function (req,res,next) {
    res.json(lastVisits);
});

module.exports = router;