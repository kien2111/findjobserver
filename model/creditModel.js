var {Table_ExchangeModel} = require('./table_exchangeModel');
var {bookshelf} = require('../db/dbconnect');
var {UserModel} = require('./userModel');
var {enumTransation,
    Approve_Upgrade_Profile,
    enumhistoryOrOnProgress,
    enumStatus,
    TransactionType,
    enumStatusAppointment} = require('./globalconstant');
var Promise = require('bluebird');
var {TransactionModel} = require('./transactionModel');
var _ = require('lodash');
var CreditModel = bookshelf.Model.extend({
    tableName:"credits",
    table_exchange:function(){
        return this.hasOne('Table_ExchangeModel','nominal_value','nominal_value');
    },
},{
    topUpMoney:Promise.method(function({iduser,serial_number,pincode}){
        let self = this;
        return bookshelf.transaction(trx=>{
            return this.forge().where({serial_number:serial_number,pincode:pincode,status:enumStatus.Available})
                .fetch({require:true,withRelated:['table_exchange'],transacting:trx})
                .tap(result=>{
                    return UserModel.forge()
                    .where({iduser:iduser})
                    .fetch({require:true,transacting:trx})
                    .tap(user=>{
                        return UserModel
                            .forge({account_balance:user.toJSON().account_balance+result.toJSON().table_exchange.amount_of_coin})
                            .where({iduser:iduser})
                            .save(null,{method:"update",transacting:trx})
                            .tap(successtopup=>{
                                return Promise.all([
                                    self.forge({status:enumStatus.UnAvailable}).where({serial_number:serial_number,pincode:pincode}).save(null,{method:"update",transacting:trx}),
                                    TransactionModel.insertTransaction({
                                        //obj insert transaction
                                        purpose:"Nạp tiền",
                                        user_give:iduser,
                                        amount_of_coin:pakage.get('pakage_fee'),
                                        status:enumTransation.ON_PROGRESS,
                                        transaction_type:TransactionType.TopUp_Money,
                                    },trx)
                                ])
                            });
                    });
                });
        })
    }),
});
var Credits = bookshelf.Collection.extend({
    model:CreditModel,
});

module.exports.CreditModel = bookshelf.model('CreditModel',CreditModel);
module.exports.CreditCollection = bookshelf.collection('CreditCollection',Credits);