var {bookshelf} = require('../db/dbconnect');
var _ = require('lodash');
var Promise = require('bluebird');
var {enumTransation,
    Approve_Upgrade_Profile,
    enumhistoryOrOnProgress,
    enumStatus,
    TransactionType,
    enumStatusAppointment} = require('../model/globalconstant');
var {Request_Update_ProfileModel} = require('../model/request_update_profileModel');
var {UserModel} = require('../model/userModel');
var {CityModel} = require('../model/cityModel');
var {DistrictModel} = require('../model/districtModel');
var {CategoryModel} = require('../model/categoryModel');
var {Pakage_UpdateModel} = require('../model/pakage_updateModel');
var {TransactionModel} = require('../model/transactionModel');
var ProfileModel = bookshelf.Model.extend({
    tableName:"profiles",
    idAttribute:"idprofile",
    user:function(){
        return this.hasOne('UserModel','iduser','idprofile');
    },
    request_update_profiles:function(){
        return this.hasMany('Request_Update_ProfileModel','profile_id','idprofile');
    },
    category:function(){
        return this.hasOne('CategoryModel','idcategory','category');
    },
    city:function(){
        return this.hasOne('CityModel','cityid','cityid');
    },
    district:function(){
        return this.hasOne('DistrictModel','distid','distid');
    }
},{
    getprofile:Promise.method(function({idcategory,page,filter}){
        //return this.forge({category:idcategory}).fetch({withRelated:['user']})
        return this.forge().query(function(db){
            db.innerJoin('users','users.iduser','profiles.idprofile');
            db.leftJoin('cities','cities.cityid','profiles.cityid');
            db.leftJoin('districts','districts.distid','profiles.distid');
            db.where('profiles.category','=',idcategory);
            db.orderBy('profiles.level');
            if(filter){
                db.andWhere(function(){
                    this.where('cities.namecity','=',filter);
                    this.orWhere('districts.namedist','=',filter);
                });
            }
        })
        .fetchPage({
            pageSize:5,
            page:page?page:1,
            withRelated:['category','user.user_receive_rate','district','city']
        }).tap(result=>{
            //console.log(result.toJSON()[0].user);
            //result.set('rate_point',calculateAverage(result.toJSON().user_receive_rate));
        })
    }),
    fetchDetaiProfileWithId:Promise.method(function(idprofile){
        return this.forge()
            .where({idprofile:idprofile})
            .fetch({require:true,
                withRelated:['category','user.user_receive_rate','district','city']
             });
    }),
    searchProfile:Promise.method(function({query}){
        return this.forge().query(qb=>{
            qb.innerJoin('users','profiles.idprofile','users.iduser');
            qb.whereRaw(`MATCH (realname,brand_name_company,about_company,username,email) against ("${query}")`);
        })
        .fetchAll({withRelated:['user']}).then(profiles=>{
            return Promise.map(profiles.toJSON(),(item,index,arr_length)=>{
                return Object.assign(_.omit(item,'user'),item.user);
            });
        });
    }),
    doTaskUpgradeProfile:Promise.method(({profile_id,level_expected,idpakage})=>{
        //process
        /**
         * check pocket money
         * check old request
         */
        return bookshelf.transaction(trx=>{
            return ProfileModel.forge().where({idprofile:profile_id})
        .fetch({withRelated:['user'],transacting:trx})
        .tap(profile=>{
            return Pakage_UpdateModel.forge().where({level_expected:level_expected,idpakage:idpakage})
            .fetch({transacting:trx})
            .tap(pakage=>{
                return Request_Update_ProfileModel.forge().query(db=>{
                    let date = new Date();
                    date.setFullYear( date.getFullYear() - 1 );
                    db.where('profile_id','=',profile_id);
                    db.andWhere('approve','=',Approve_Upgrade_Profile.ON_PROGRESS);
                    db.andWhere('created_at','>=',date)
                })
                .fetch({transacting:trx})
                .tap(oldrequest=>{
                    if(!oldrequest){
                        // no old request in last one year till now
                        if(profile.toJSON().user.account_balance>=pakage.get('pakage_fee')){
                            return Promise.all([Request_Update_ProfileModel.insertRequest({profile_id:profile_id,
                                level_expected:level_expected,
                                approve:Approve_Upgrade_Profile.ON_PROGRESS,
                                idpakage:idpakage},
                                trx),
                                TransactionModel.insertTransaction({
                                    purpose:"Nâng cấp tài khoản",
                                    user_give:profile_id,
                                    amount_of_coin:pakage.get('pakage_fee'),
                                    status:enumTransation.ON_PROGRESS,
                                    transaction_type:TransactionType.Upgrade_Profile,
                                },trx)
                            ])
                        }else{
                            throw new Error("Bạn không đủ tiền để nâng cấp tài khoản");
                        }
                        }else{
                        // have old request with same level_expected
                        throw new Error("Hồ sơ của bạn đang chờ để được thăng cấp");
                        }
                    });
                
                })
            })
        });
    }),
    adminAcceptProfileUpgrade:Promise.method(function(arr){
        /**
         * [
         *  {
         *  profile_id,
         *  idrequest_update_profile
         * },
         * ]
         */
        let self = this;
        return bookshelf.transaction(trx=>{
            return Promise.map(arr,item=>{
                return new Request_Update_ProfileModel({approve:Approve_Upgrade_Profile.ACCEPT})
                .where({profile_id:item.profile_id,idrequest_update_profile:item.idrequest_update_profile})
                .save(null,{method:"update",transacting:trx})
                .tap(result=>{
                    return self.forge({level:item.level_expected}).where({idprofile:item.profile_id}).save(null,{method:"update",transacting:trx});
                });
            });
        });
    }),
    doTaskPublishProfile:Promise.method(function({iduser,approve_publish}){
        return this.forge({approve_publish:approve_publish}).where({idprofile:iduser}).save(null,{method:"update"});
    }),
    adminblocprofile:Promise.method(function(arr){
        //let role = obj.role;
        //let userdata = _.omit(obj,['role']);
        //console.log(userdata);
        if(!arr) throw new Error("Pls provide data to signup");
        if(!Array.isArray(arr))throw new Error("Param provide not an array");
        return bookshelf.transaction(trx=>{
            return Promise.map(arr,item=>{
                    console.log(item);
                    return new ProfileModel().where({idprofile:item.idprofile})
                    .save(item,{method:"update",transacting:trx,patch:true});
            });
        });
    }),
    
    // blockuser:Promise.method(function(arr){
    //     console.log(arr);
    //     if(!arr) throw new Error("Pls provide data to signup");
    //     if(!Array.isArray(arr))throw new Error("Param provide not an array");
    //     return bookshelf.transaction(trx=>{
    //         return Promise.map(arr,item=>{
    //             console.log(item);
    //             return new Account_RoleModel().where({iduser:item.iduser})
    //             .save(item,{method:"update",transacting:trx,patch:true});
    //         });
    //     })
    // }),


});
var Profiles = bookshelf.Collection.extend({
    model:ProfileModel,
});
var Approve_Upgrade_Profile = {
    NORMAL:1,
    ON_PROGRESS:2,
    ACCEPT:3,
    DECLINE:5
}
var Level = {
    FREE:0,
    BASIC:1,
    MEDIUM:2,
    PREMIUM:3,
}
const calculateAverage = (arrayobj)=>{
    if(!arrayobj || arrayobj.length<=0)return 0;
    let result=0;

    arrayobj.forEach(element => {
        result +=element.average_point;
    });
    return result/arrayobj.length;
}
module.exports.ProfileModel = bookshelf.model('ProfileModel',ProfileModel);
module.exports.ProfileCollection = bookshelf.collection('ProfileCollection',Profiles);