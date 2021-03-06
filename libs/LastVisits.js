let settings = require('../settings');

/**
 * Register all visits. Compute last visits (on interval basis).
 */
class LastVisits {

    constructor(){
        this.visits = []; //Visits on expireTime. Sorted by time (from old to new). Updated every few (expireTime)
        // minutes
        this.updateInterval = settings.updateSummaryInterval*1000; //milliseconds to refresh object status
        this.expireTime = settings.expireTime*60*1000; //Define what is "last"
        this.summary = {};

        setInterval(this.updateStatus.bind(this), this.updateInterval);
    }


    updateSummary(){
        this.summary = {};

        //Sort visits by url
        let visitsSortedByUrl = this.visits.slice().sort(
            function (a, b) {
                if(a.visitInfo.url<b.visitInfo.url) return -1;
                if(a.visitInfo.url>b.visitInfo.url) return 1;
                return 0;
            }
        );

        visitsSortedByUrl = visitsSortedByUrl.filter(item=>{
            return !settings.block.some(p=>item.visitInfo.url.indexOf(p)>-1); //Remove visit if belongs to black list
        });

        //Compute summary
        let prevUrl = ''; //previous item in loop
        for(let i=0; i<visitsSortedByUrl.length; i++){
            let domain = this._getDomainNameByUrl(visitsSortedByUrl[i].visitInfo.url);
            if(  visitsSortedByUrl[i].visitInfo.url !== prevUrl ){ //should add new record to summary
                if(!this.summary[domain]) {
                    this.summary[domain] = [];
                }

                this.summary[domain].push({ //Add record to summary
                    url : visitsSortedByUrl[i].visitInfo.url,
                    title : visitsSortedByUrl[i].visitInfo.title,
                    count : 1
                });
                prevUrl = visitsSortedByUrl[i].visitInfo.url;
            } else { //current url equals to previous (in loop). Should increment last record
                this.summary[domain][this.summary[domain].length-1].count++;
            }
        }

        //Sort summary bu count
        for(let d in this.summary){
            if(this.summary.hasOwnProperty(d)){
                this.summary[d].sort((a,b)=>{
                    if(a.count<b.count) return 1;
                    if(a.count>b.count) return -1;
                    return 0;
                })
            }
        }
    }

    _getDomainNameByUrl(url){
        let test = url.match(/\/\/([^/]*)\//); //Simple regex to fetch text portion from "//" to "/"
        if(test && test[1])
            return test[1];
    }

    updateStatus(){
        //drop old visits
        this.visits = this.visits.slice( this._findIndexOfOldestRelevantVisit(this.visits, this.expireTime) );
        this.updateSummary();
    }

    _findIndexOfOldestRelevantVisit(visits, interval){
        let oldestTime = new Date() - interval; //the oldest time we want to take into account
        for(let i=0; i<visits.length; i++){ //Possible to improve with binary tree search
            if(visits[i].time>oldestTime) return i;
        }
        return visits.length; //All visits have to be removed from queue
    }

    registerVisit(visitInfo){
        if(this._shouldBeRegistered(visitInfo)) {
            this.visits.push({
                time: new Date(),
                visitInfo: visitInfo
            });
        }
    }

    _shouldBeRegistered(visitInfo){
        return !this.visits.some(v=>{ //If this IP on this URL already exists in last visits return FALSE
            return (v.visitInfo.url===visitInfo.url && v.visitInfo.ip===visitInfo.ip);
        });
    }
}

module.exports = new LastVisits();