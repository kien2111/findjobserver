var bookshelf = require('../db/dbconnect');
module.exports.Rate = bookshelf.Model.extend({
    tableName:"transactions",
});