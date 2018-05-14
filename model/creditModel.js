var {Table_ExchangeModel} = require('./table_exchangeModel');
var {bookshelf} = require('../db/dbconnect');
var {UserModel} = require('./userModel');
var Promise = require('bluebird');
var _ = require('lodash');
var CreditModel = bookshelf.Model.extend({
    tableName:"credits",
    table_exchange:function(){
        return this.hasOne('Table_ExchangeModel','nominal_value','nominal_value');
    },
},{
    topUpMoney:Promise.method(function({iduser,serial_number,pincode}){
        let self = this;
        return this.forge().where({serial_number:serial_number,pincode:pincode,status:enumStatus.Available})
                .fetch({require:true,withRelated:['table_exchange']})
                .tap(result=>{
                    return UserModel.forge()
                    .where({iduser:iduser})
                    .fetch({require:true})
                    .tap(user=>{
                        return UserModel
                            .forge({account_balance:user.toJSON().account_balance+result.toJSON().table_exchange.amount_of_coin})
                            .where({iduser:iduser})
                            .save(null,{method:"update"})
                            .tap(successtopup=>{
                                return self.forge({status:enumStatus.UnAvailable}).where({serial_number:serial_number,pincode:pincode}).save(null,{method:"update"})
                            });
                    });
                });
    }),
});
var Credits = bookshelf.Collection.extend({
    model:CreditModel,
});
var enumStatus = {
    Available:0,
    UnAvailable:1,
}
module.exports.CreditModel = bookshelf.model('CreditModel',CreditModel);
module.exports.CreditCollection = bookshelf.collection('CreditCollection',Credits);