var bookshelf = require('../db/dbconnect');
module.exports.Address = bookshelf.Model.extend({
    tableName:"addresses",
});