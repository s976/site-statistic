/**
 * Created by Shimon on 20/07/2017.
 *
 * Запускается из командной строки
 * Импортирует данные из аналитикс
 */
var fs = require('fs');
var parse = require('csv-parse');
var Page = require('../pages');
var home = 'http://dinonline.org';


fs.readFile('data1.csv','utf8',function(err,data){
    if (err) console.error(err);

    parse(data,{columns: true},function (err,output) {
        if (err) throw err;

        output.forEach(function(row){
            if(row && row.url && row.count){
                Page.importVisitData({
                    url: home + row.url,
                    count: row.count
                });
            } else {
                console.log('row && row.url && row.count');
            }
        });



    });
});


