var bookshelf = require('../db/dbconnect');
module.exports.Promote = bookshelf.Model.extend({
    tableName:"promotes",
});