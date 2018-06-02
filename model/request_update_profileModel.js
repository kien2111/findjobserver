var {TransactionModel} = require('./transactionModel');

var {bookshelf} = require('../db/dbconnect');
var {ProfileModel} = require('./profileModel');
var Approve_Upgrade_Profile = {
    NORMAL:1,
    ON_PROGRESS:2,
    ACTIVE:3,
    DECLINE:5
}
var Promise = require('bluebird');
var {enumTransaction,
    Approve_Upgrade_Profile,
    enumhistoryOrOnProgress,
    enumStatus,
    enumStatusAppointment} = require('../model/globalconstant');
var _ = require('lodash');
var Request_Update_ProfileModel = bookshelf.Model.extend({
    tableName:"requests_update_profile",
    idAttribute:'idrequest_update_profile',
    hasTimestamps:true,
    profile:function(){
        return this.hasOne('ProfileModel','idprofile','profile_id');
    }
},{
    getAllUpgradeAccount:Promise.method(function(){
        return this.forge().where({approve:Approve_Upgrade_Profile.ON_PROGRESS})
                .fetchAll({withRelated:['profile']});
    }),
    // getAllUpgradeAccount:Promise.method(function(query){
    //     return this.forge().where('approve','=',Approve_Upgrade_Profile.ON_PROGRESS)}
    //     .fetchAll({withRelated:['requests_update_profile.profile_id','users.iduser']})
    insertRequest:Promise.method(function(obj){
        return this.forge(obj).save();
    }),
    getLastestProcessRequest:Promise.method(function(iduser){
        return this.forge().query(function(db){
            let date = new Date();
            date.setFullYear( date.getFullYear() - 1 );
            db.where('created_at','>=',date);
            db.where('approve','=',Approve_Upgrade_Profile.ON_PROGRESS);
            db.where({profile_id:iduser});
            db.debug();
        })
        .orderBy('-created_at')
        .fetch({require:true});
    }),
    deleteLastestUpgradeRequest:Promise.method(function(profile_id,trx){
        return this.forge({transacting:trx})
            .where({profile_id:profile_id,approve:Approve_Upgrade_Profile.ON_PROGRESS})
            .save({approve:Approve_Upgrade_Profile.DECLINE},{method:"update"});
    }),
    getAllRequestUpgrade:Promise.method(function(){
        return bookshelf.knex.raw(`
            select * from requests_update_profile as r
                inner join profiles as p on r.profile_id = p.idprofile 
                inner join users as u on p.idprofile = u.iduser
                where approve = :status
        `,{status:Approve_Upgrade_Profile.ON_PROGRESS});
    }),
    acceptUpgradeProfile:Promise.method(function(arr){
        let self = this;
        if(!Array.isArray(arr))throw new Error(`This ${arr} not an array!!!`);
        return Promise.map(arr,item=>{
            return bookshelf.transaction(trx=>{
                return self.forge({approve:Approve_Upgrade_Profile.ACTIVE})
                    .where({idrequest_update_profile:item.idrequest_update_profile})
                    .save(null,{method:'update',transacting:trx})
                    .tap(result=>{                           
                        return self.forge()
                            .where({idrequest_update_profile:item.idrequest_update_profile})
                            .fetch({require:true,transacting:trx})
                            .tap(requestresult=>{
                                return require('./profileModel').ProfileModel.forge({level:requestresult.get('level_expected')})
                                    .where({idprofile:requestresult.get('profile_id')})
                                    .save(null,{method:'update',transacting:trx}).tap(profileresult=>{
                                        TransactionModel.successTransaction(requestresult.get('idtransaction'),trx);
                                    })
                            })              
                    });           
            })
        });
    }),
});
var Request_Update_ProfileModels = bookshelf.Collection.extend({
    model:Request_Update_ProfileModel
});
module.exports.Request_Update_ProfileModel = bookshelf.model('Request_Update_ProfileModel',Request_Update_ProfileModel);
module.exports.Request_Update_ProfileCollection = bookshelf.collection('Request_Update_ProfileCollection',Request_Update_ProfileModels);