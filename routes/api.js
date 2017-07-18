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

    if ( origins.indexOf(req.headers.origin) === -1 ){
        res.status(400).json({errMessage:'nu nu nu!'});
        return false;
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    //ответ с данными о статистике стр.
    Page.findOne({url:req.headers.referer},function (err,page) {
        if (err) console.error(err);

        if(page){
            res.json(page);
        } else {
            res.json({
                count : 1,
                last_visit : Date.now(),
                just_recorded : true
            });
        }
    });

    Record.needRecord({
        ip:req.connection.remoteAddress,
        url: req.headers.referer
        },
        function (err,records) {
            if (err) console.error(err);

            if (records.length === 0){ //посещений не было в последнее время. нужно регистрировать
                Record.addRecord({
                    ip:req.connection.remoteAddress,
                    url: req.headers.referer
                });

                Page.registerVisit({
                    ip:req.connection.remoteAddress,
                    url: req.headers.referer
                });


            }
        });





});


module.exports = router;