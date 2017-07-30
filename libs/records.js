/**
 * Created by Shimon on 08/07/2017.
 *
 * *Журанал. Регистрирует каждый отдельный заход. См. колекция 1*
 **Методы (статичные):**
 1. Запись инфы о визите
 1. Проверка нужно ли записывать данный визит
 */

var mongoose = require('./db').mongoose;
var Schema = mongoose.Schema;

var recordSchema = new Schema({
    date : Date,
    ip : String,
    url : String
});

/**
 * Запись инфы о визите
 *
 * @param fields
 */
recordSchema.statics.addRecord = function (fields) {
    var record = new this({
        date : Date.now(),
        ip : fields.ip,
        url : fields.url
    });
    record.save(function(err,record){
        if (err) console.error(err);
    });
};

/**
 * Проверка нужно ли записывать данный визит
 *
 * @param fields
 * @param cb
 */
recordSchema.statics.needRecord = function (fields,cb) {
    var self = this;
    var interval = 5*60*1000;
    var startDate = new Date() - interval;

    self.find(
        {
            ip : fields.ip,
            url : fields.url,
            date : {$gt : startDate}
        },
        function (err,records) {
            cb(err, records);
        });

};


/**
 * Сколько пользователей сейчас на сайте
 *
 * @param minutes
 * @param origin Для какого сайта запрос
 * @param cb
 */
recordSchema.statics.visitorsNow = function(minutes, origin, cb) {
    var self = this;
    var interval = minutes*60*1000;
    var startDate = new Date() - interval;

    self.find(
        {
            date : {$gt : startDate},
            url : {$regex : origin + ".*"}
        },
        function (err,records) {
            if (err) console.error(err);
            var ips =[], uniqueIps = [];
            if (records && Array.isArray(records)){
                ips = records.map(function (rec) {
                    return rec.ip;
                });
                uniqueIps = ips.filter(function (ip,i) {
                    return ips.indexOf(ip) === i;
                });

            }
            cb(err,uniqueIps.length);
    });
};


/** @class Record */
var Record = mongoose.model('Record', recordSchema);


module.exports = Record;