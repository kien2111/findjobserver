var bookshelf = require('../db/dbconnect');
var bcrypt = require('bcrypt');

module.exports.Account= bookshelf.Model.extend({
    tableName:"accounts",
});
