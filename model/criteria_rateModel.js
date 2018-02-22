var bookshelf = require('../db/dbconnect');
module.exports.Criteria_Rate = bookshelf.Model.extend({
    tableName:"criteria_rate",
});