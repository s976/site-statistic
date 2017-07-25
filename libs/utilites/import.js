/**
 * Created by Shimon on 20/07/2017.
 *
 * Запускается из командной строки
 * Импортирует данные из аналитикс
 */
var fs = require('fs');
var parse = require('csv-parse');
var Page = require('../pages');
var home = 'http://din.org.il';


fs.readFile('data1.csv','utf8',function(err,data){
    if (err) console.error(err);

    parse(data,{columns: true},function (err,data) {
        if (err) throw err;

        var status = {
            processed : 0,
            new : 0,
            updated : 0,
            errors : 0
        };

        data.forEach(function(row,i){
            if(row && row.url && row.count && (row.url[0]==="/") ){
                Page.importVisitData({
                    url: home + encodeURI(row.url),
                    count: row.count
                },function (err,stat) {
                    status.processed++;
                    if(err){
                        status.processed++;
                        status.errors++;
                    }
                    if ('update'===stat){
                        status.updated++;
                    }
                    if ('new'===stat){
                        status.new++;
                    }

                    if(status.processed%100===0){
                        console.log(status.processed + ' rows processed');
                    }

                    if(data.length<=status.processed){
                        console.log('Status object %j',status);
                        process.exit();
                    }

                });
            } else {
                console.log('Error: row && row.url && row.count && (row.url[0]==="/") === false. For row %d %j',i,row);
                status.processed++;
                status.errors++;
            }
        });

    });
});


