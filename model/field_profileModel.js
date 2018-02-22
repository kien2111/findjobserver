var bookshelf = require('../db/dbconnect');
module.exports.Field_Profile = bookshelf.Model.extend({
    tableName:"field_profile",
});