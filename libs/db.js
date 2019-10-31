/**
 * Created by shimon on 19/06/2017.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/statistic', {useMongoClient:true});


/**
 * Mongoose instance
 */
exports.mongoose = mongoose;