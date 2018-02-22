var bookshelf = require('../db/dbconnect');
module.exports.Employer = bookshelf.Model.extend({
    tableName:"employers",
});