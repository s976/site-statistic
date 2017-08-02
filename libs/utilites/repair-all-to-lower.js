var Page = require('../pages');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var status = {
    wasOk : 0,
    duplicated : 0,
    removed : 0,
    errors :0
};

Page.find({},function (err,pages) {
    //pages.length = 400;
    var nagla = 50;
    var start = 0;
    var naglot = Math.ceil(pages.length/nagla);

    doNagla(start,nagla,pages);

    eventEmitter.on('naglaDone', function () {
        start +=nagla;
        if(start>=pages.length-1){
            console.log("Починка двойных записей закончена...");
            console.log(status);
            process.exit();
        }

        var count = (pages.length-1<start+nagla) ? pages.length-1-start : nagla;
        doNagla(start,count,pages);
        console.log("Запускаем новую наглу от %d", start);
    });

});




function doNagla(start,count,pages) {
    var a=0,timeout = 30;
    var timer = setTimeout(function (start) {
        console.log("Прошло уже %d секунд, а нагла, которая начинается с %d не завершилась... Обработали %d записей для этой наглы", start,timeout,a);
        console.log(status);
        process.exit();
    },60*1000);
    for(var i = start; i<start+count;i++){
        if (i>=pages.length){
            console.log("Ты хочешь выйти из массива!");
            console.log(i,start,count);
        }
        Page.repairToLowerCase(pages[i].url,status,function(url){
            a++;
            if(a>=count){
                clearTimeout(timer);
                eventEmitter.emit('naglaDone');
            }
        });
    }
}