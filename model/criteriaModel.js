var bookshelf = require('../db/dbconnect');
module.exports.Criteria = bookshelf.Model.extend({
    tableName:"criterias",
});