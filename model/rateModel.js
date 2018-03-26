var bookshelf = require('../db/dbconnect').bookshelf;
var Criteria_RateModel = require('./criteria_rateModel').Criteria_RateModel;
var UserModel = require('./userModel').UserModel;
var RateModel = bookshelf.Model.extend({
    tableName:"rates",
    idAttribute:'idrate',
    criteria_rate:function(){
        return this.hasMany(Criteria_RateModel,'rate_id','idrate');
    },
    user_create_rate:function(){
        return this.belongsTo(UserModel,'iduser','user_who_rate_this');
    },
    user_take_rate:function(){
        return this.belongsTo(UserModel,'iduser','user_who_receive_this_rate');
    }
});
var Rates = bookshelf.Collection.extend({
    model:RateModel,
});
module.exports.RateModel = RateModel;
module.exports.RateCollection = Rates;