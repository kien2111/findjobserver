var bookshelf = require('../db/dbconnect').bookshelf;
var UserModel = require('./userModel').UserModel;
var Request_Update_ProfileModel = require('./request_update_profileModel').Request_Update_ProfileModel;
var Pakage_UpdateModel = bookshelf.Model.extend({
    tableName:"pakage_update",
    idAttribute:'idpakage_update',
    request_update_profile:function(){
        return this.hasMany(Request_Update_ProfileModel,'idpakage','idpakage_update');
    }
});
var Pakage_Updates = bookshelf.Collection.extend({
    model:Pakage_UpdateModel,
});
module.exports.Pakage_UpdateModel = Pakage_UpdateModel;
module.exports.Pakage_UpdateCollection = Pakage_Updates;