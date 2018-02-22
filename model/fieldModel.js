var bookshelf = require('../db/dbconnect');
module.exports.Field = bookshelf.Model.extend({
    tableName:"fields",
});