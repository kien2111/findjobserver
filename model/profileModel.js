var {bookshelf} = require('../db/dbconnect');
var _ = require('lodash');
var Promise = require('bluebird');
var {enumTransaction,
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
        return this.hasOne('CategoryModel','idcategory','idcategory');
    },
    city:function(){
        return this.hasOne('CityModel','cityid','cityid');
    },
    district:function(){
        return this.hasOne('DistrictModel','distid','distid');
    }
},{
    getprofile:Promise.method(function({idcategory,page,distid,cityid,salaryFrom,salaryTo,level}){
        //return this.forge({category:idcategory}).fetch({withRelated:['user']})
        return this.forge().query(function(db){
            db.innerJoin('users','users.iduser','profiles.idprofile');
            db.leftJoin('cities','cities.cityid','profiles.cityid');
            db.leftJoin('districts','districts.distid','profiles.distid');
            db.where('profiles.idcategory','=',idcategory);
            db.andWhere('profiles.approve_publish','=',Approve_Publish.ACCEPT);
            db.orderBy('profiles.level','DESC');
            if(cityid && cityid!="All"){
                this.andWhere('cities.cityid','=',cityid);
            }
            if(distid && distid!="All"){
                this.andWhere('districts.distid','=',distid);
            }
            if((salaryFrom && salaryTo) &&(salaryFrom!=0.0 || salaryTo!=0.0)){
                if(salaryFrom>salaryTo){
                    db.andWhere(function(){
                        this.where('profiles.salary_expected_from','<=',salaryTo*10000000);
                        this.andWhere('profiles.salary_expected_to','>=',salaryFrom*10000000);
                    });
                }else{
                    db.andWhere(function(){
                        this.where('profiles.salary_expected_from','<=',salaryFrom*10000000);
                        this.andWhere('profiles.salary_expected_to','>=',salaryTo*10000000);
                    });
                }
            }
            if(level){
                if(level==4){
                    //means that all
                }else{
                    db.andWhere('profiles.level','=',level);
                }

            }
        })
        .fetchPage({
            pageSize:5,
            page:page?page:1,
            withRelated:['category','user.user_receive_rate','district','city']
        })
    }),
    fetchDetaiProfileWithId:Promise.method(function(idprofile){
        return this.forge()
            .where({idprofile:idprofile})
            .fetch({require:true,
                withRelated:['category','user.user_receive_rate','district','city']
             });
    }),
    getMapProfile:Promise.method(function(lat,long,priority,distance,unit){
        console.log(mapUnit(unit));
        if(!priority || priority==Level.ALL){
            return bookshelf.knex.raw(`
            select p.*,u.realname,u.avatar,(select avg(r.average_point) from rates as r where r.user_who_receive_this_rate = p.idprofile) as rate_point 
            from profiles as p left join users as u on p.idprofile = u.iduser where ST_Distance_Sphere(
                    point(${long},${lat}),
                    point(p.long,p.lat) 
                ) <${distance*mapUnit(unit)} LIMIT 50;
            `) 
        }else{
            return bookshelf.knex.raw(`
            select p.*,u.realname,u.avatar,(select avg(r.average_point) from rates as r where r.user_who_receive_this_rate = p.idprofile) as rate_point 
            from profiles as p left join users as u on p.idprofile = u.iduser where ST_Distance_Sphere(
                    point(${long},${lat}),
                    point(p.long,p.lat) 
                ) <${distance*mapUnit(unit)} and level = ${priority}  LIMIT 50;
            `)
        }
        
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
            return Pakage_UpdateModel.forge().where({idpakage_update:idpakage})
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
                            return TransactionModel.insertTransaction({
                                purpose:"Nâng cấp tài khoản",
                                user_give:profile_id,
                                amount_of_coin:pakage.get('pakage_fee'),
                                status:enumTransaction.ON_PROGRESS,
                                transaction_type:TransactionType.Upgrade_Profile,
                            },trx).tap(transactionresult=>{
                                return Request_Update_ProfileModel.insertRequest({profile_id:profile_id,
                                    level_expected:level_expected,
                                    approve:Approve_Upgrade_Profile.ON_PROGRESS,
                                    idpakage:idpakage,
                                    idtransaction:transactionresult.get('idtransaction')},
                                    trx)
                            })
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
    ALL:4
}
var Approve_Publish = {
    NOT_DO_ANYTHING:0,
    ACCEPT:1,
    CONFLICT:2,
    ADMIN_BLOCKED:3,
}
var Unit = {
    KM:0,
    METER:1,
    MILES:2,
    FOOT:3,
    CM:4,
    YARDS:5
}
function mapUnit(unit){
    switch(parseInt(unit)){
        case Unit.KM:
        console.log(unit);
            return 1000;
        case Unit.CM:
            return 0.01;
        case Unit.METER:
            return 1;
        case Unit.YARDS:break;
        case Unit.MILES:break;
    }
}
module.exports.ProfileModel = bookshelf.model('ProfileModel',ProfileModel);
module.exports.ProfileCollection = bookshelf.collection('ProfileCollection',Profiles);