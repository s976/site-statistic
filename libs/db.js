/**
 * Created by shimon on 19/06/2017.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/statistic');


/**
 * Mongoose instance
 */
exports.mongoose = mongoose;