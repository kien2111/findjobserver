var bookshelf = require('../db/dbconnect');
module.exports.District = bookshelf.Model.extend({
    tableName:"districts",
});