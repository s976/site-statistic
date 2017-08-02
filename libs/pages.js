/**
 * Created by Shimon on 11/07/2017.
 */
var mongoose = require('./db').mongoose;
var Schema = mongoose.Schema;

var pageSchema = new Schema({
    url : String,
    title: String,
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
                if (fields.title){
                    page.title = (fields.title);
                }
                page.save(function(err,page){
                    if (err) console.error(err);
                    console.log('Добавили 1 к посещениям страницы');
                    console.log(page);
                })
            } else { //Создаем запись страницы
                var t = (fields.title) ? fields.title : '';
                var p = new self({
                    url : fields.url,
                    title :t,
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
 * Получает масив объектов, в каждом объекте задано url. В соответствии с url дообавляет title и кол. посещений
 * @param arr
 * @param cb
 */
pageSchema.statics.enrichWithTitles = function (arr, cb) {
    var self = this;
    var processed = 0;
    arr.forEach(function (page,i) {
        self.find({url:page.url})
            .sort({count:-1})
            .exec(function(err,pages){
                arr[i].title = pages[0].title;
                arr[i].visits = pages[0].count;
                arr[i].last_visit=pages[0].last_visit;
                processed++;
                if( processed>=arr.length ){
                    cb(arr);
                }
            });
    });
};


/**
 * Для заданной страницы, находит ее дубликаты (может с большими буквами), стирает их, а количество засчитывает как
 * общее
 *
 * @param url
 * @param cb
 * @returns {boolean}
 */
pageSchema.statics.repairToLowerCase = function (url,status,cb) {
    var self = this;

    status.curUrl = url;
    //console.log("Начинаем лечить %s",url);

    if(!url){
        console.log("!url");
        cb();
        return false;
    }


    //Зкранирование спец. символов
    var urlForReg = '^' + url.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '$';

    self.find({ url:{$regex:urlForReg,$options:'i'} },
        function(err,pages){
            if (err) console.error(err);

            //console.log("Нашли для %s %d записей. Начинаем обрабатывать",url,pages.length);

            if(!pages || pages.length===0){
                console.log("Что-то не то. Нет таких страниц. %s",url);
                status.errors++;
                cb();  //Должно быть запущенно всегда. Иначе счетчик собъется
                return false;
            }

            if ( (pages.length===1) && (pages[0].url.toLowerCase() === pages[0].url)){
                status.wasOk++;
                cb(pages[0].url);
                return false; //Все хорошо, ничего не надо
            }

            var count = 0;
            var title = '';
            pages.forEach(function (page) {
                count+=page.count;
                if (page.title)
                    title = page.title;
            });
            pages[0].count = count;
            pages[0].title = title;
            pages[0].url = pages[0].url.toLowerCase();


            pages[0].save(function (err,p) {
                if (err) {
                    console.error(err);
                    status.errors++;
                }
                status.duplicated++;
                //console.log("Исравлено к маленьким буквам, для стр. %s. Было %d страницы", p.url,pages.length);
                if(pages.length>1){
                    var removed = 0;
                    var haveToBeRemoved = pages.length-1;
                    for(var a=1;a<pages.length;a++){
                        pages[a].remove(function (err,removedPage) {
                            if (err) console.error(err);
                            removed++;
                            if(removed>=haveToBeRemoved){
                                status.removed+=haveToBeRemoved;
                                cb(pages[0].url);
                            }
                        })
                    }
                } else {
                    cb(pages[0].url);
                }

            })
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
            if(err) {
                console.error(err);
                cb(err);
                return false;
            }

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
                    if (err) {
                        console.error(err);
                        console.log('The error was for row: %j',fields);
                    }
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

