/**
 * Created by Shimon on 11/07/2017.
 */
var mongoose = require('./db').mongoose;
var Schema = mongoose.Schema;

var pageSchema = new Schema({
    url : String,
    count : {type:Number,default:1},
    last_visit : Date
});

pageSchema.statics.registerVisit = function (fields) {
    var self = this;

    self.findOne({
            url : fields.url
        },
        function (err, page) {
            if(err) console.error(err);

            if (page){ //Обновляем статистику страницы
                page.count++;
                page.last_visit = Date.now();
                page.save(function(err,page){
                    if (err) console.error(err);
                    console.log('Добавили 1 к посещениям страницы');
                    console.log(page);
                })
            } else { //Создаем запись страницы
                var p = new self({
                    url : fields.url,
                    count : 1,
                    last_visit : Date.now()
                });
                p.save(function(err,p){
                    if (err) console.error(err);
                    console.log('Создали запись новой страницы');
                    console.log(p);
                });

            }

    });

};

/**
 * Для импорта из аналитикс - используется утилитой import.js
 *
 * @param fields
 */
pageSchema.statics.importVisitData = function (fields,cb) {
    var self = this;

    self.findOne({
            url : fields.url
        },
        function (err, page) {
            if(err) console.error(err);

            if (page){ //Обновляем статистику страницы
                page.count = fields.count;
                page.save(function(err,page){
                    if (err) console.error(err);
                    cb(err,'update');
                })
            } else { //Создаем запись страницы
                var p = new self({
                    url : fields.url,
                    count : fields.count
                    //last_visit : Date.now()
                });
                p.save(function(err,p){
                    if (err) console.error(err);
                    cb(err,'new');
                });

            }

        });

};

pageSchema.statics.getData = function(url,cb){
    var self = this;

    self.findOne({
        url : url
        },
        function (err, page) {
            cb(err,page);
    });
};


/** @class Record */
var Page = mongoose.model('Page', pageSchema);

module.exports = Page;

