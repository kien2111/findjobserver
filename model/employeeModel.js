var bookshelf = require('../db/dbconnect');
module.exports.Employee = bookshelf.Model.extend({
    tableName:"employees",
});