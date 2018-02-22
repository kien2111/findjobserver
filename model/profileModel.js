var bookshelf = require('../db/dbconnect');
module.exports.Profile = bookshelf.Model.extend({
    tableName:"profiles",
});