var bookshelf = require('../db/dbconnect').bookshelf;
var Emp_LocationModel = require('../model/emp_locationModel').Emp_LocationModel;
var AccountModel = require('../model/accountModel').AccountModel;
var TransactionModel = require('../model/transactionModel').TransactionModel;
var AppointmentModel = require('../model/appointmentModel').AppointmentModel;
var ProfileModel = require('../model/profileModel').ProfileModel;
var UserModel = bookshelf.Model.extend({
    tableName:"users",
    idAttribute:'iduser',
    emp_locations:function(){
        return this.hasMany(Emp_LocationModel,'iduser','iduser');
    },
    account:function(){
        return this.hasOne(AccountModel,'iduser','iduser');
    },
    user_give:function(){
        return this.hasMany(TransactionModel,'user_give','iduser');
    },
    user_receive:function(){
        return this.hasOne(TransactionModel,'user_receive','iduser');
    },
    profile:function(){
        return this.hasOne(ProfileModel,'idprofile','iduser');
    },
    user_receive_rate:function(){
        return this.hasMany(RateModel,'user_who_receive_this_rate','iduser');
    },
    user_give_rate:function(){
        return this.hasMany(RateModel,'user_who_rate_this','iduser');
    },
    user_create_appointments(){
        return this.hasMany(AppointmentModel,'user_who_create_appointment','iduser');
    },
    user_take_appointments(){
        return this.hasMany(AppointmentModel,'user_who_receive_appointment','iduser');
    }
    
})
var Users = bookshelf.Collection.extend({
    model:UserModel
})
module.exports.UserModel = UserModel;
module.exports.UserCollection = Users;
