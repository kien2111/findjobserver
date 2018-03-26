var bookshelf = require('../db/dbconnect').bookshelf;
var AccountModel = require('./accountModel').AccountModel;
var FavouriteModel = bookshelf.Model.extend({
    tableName:"favourites",
    whobefavourited:function(){
        return this.belongsTo(AccountModel,'id','idwhobefavourited');
    },
    whofavourited:function(){
        return this.belongsTo(AccountModel,'id','idwhofavourited')
    }

});
var Favourites = bookshelf.Collection.extend({
    model:FavouriteModel,
});
module.exports.FavouriteModel = FavouriteModel;
module.exports.FavouriteCollection = Favourites;