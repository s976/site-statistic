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


/** @class Record */
var Record = mongoose.model('Record', recordSchema);


module.exports = Record;