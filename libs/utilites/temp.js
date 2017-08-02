var ips =[], uniqueIps = [], processedRecords = [],urls = [], registeredUrls = [];


var records = [];

for (var i=0;i<100;i++){
    var url = "url" + Math.floor( Math.random()*100 );
    records.push( {url: url} );
}

var time1 = new Date().getTime();

records.forEach(function(rec,i){

    if (registeredUrls.indexOf(rec.url) !== -1)
        return;

    rec.count = records.filter(function (r) {
        return r.url === rec.url;
    }).length;

    processedRecords.push(rec);
    registeredUrls.push(rec.url);

});

processedRecords.sort(function (a, b) {
    if (a.count > b.count) {
        return -1;
    }
    if (a.count < b.count) {
        return 1;
    }
    // a должно быть равным b
    return 0;
});

var delay = new Date().getTime() - time1;

var countTest = 0;
processedRecords.forEach(function(r){
    countTest += r.count;
});

console.log(records);
console.log(processedRecords);
console.log(delay);
console.log("count test: %d", countTest);