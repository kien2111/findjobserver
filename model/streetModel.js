var bookshelf = require('../db/dbconnect');
module.exports.Street = bookshelf.Model.extend({
    tableName:"streets",
});