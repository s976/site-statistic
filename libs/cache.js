var Record = require('../libs/records');
var Page = require('../libs/pages');
var settings = require('../settings');

var cache = {
    updated : new Date(),
    range : 10, //Count visits in last n minutes
    updateInterval : 10000, //milliseconds Cache update
    maxPages : 10,
    maxVisits : 1000 //Максимум визитов, которые учитываются (чтобы не загружать систему)
};

settings.sites.forEach(function (site) {
    cache[site] = [];
});



var timer = setInterval(function () {

    settings.sites.forEach(function(site){
        Record.lastVisits(cache.range,
            cache.maxPages,
            cache.maxVisits,
            site,
            function (err, pages) {
                if(err)
                    console.error(err);

                Page.enrichWithTitles(pages,function(pages){
                    cache.updated = new Date();
                    cache[site] = pages;
                });
        });
    });

},cache.updateInterval);



module.exports = cache;


