var {bookshelf} = require('../db/dbconnect');
var Joi = require('joi');
var {Criteria_RateModel,Criteria_RateCollection} = require('./criteria_rateModel');
require('./userModel').UserModel;
var Promise = require('bluebird');
var RateModel = bookshelf.Model.extend({
    tableName:"rates",
    idAttribute:'idrate',
    hidden:['user_who_rate_this','user_who_receive_this_rate'],
    initialize:function(){
        this.constructor.__super__.initialize.apply(this,arguments);
       // this.on('saving',this.validateSave)
    },
    validateSave:function(savingmodel){
        return Joi.validate(savingmodel,schemaValidateRate)
    },
    criteria_rate:function(){
        return this.hasMany('Criteria_RateModel','rate_id','idrate');
    },
    user_create_rate:function(){
        return this.hasOne('UserModel','iduser','user_who_rate_this');
    },
    user_take_rate:function(){
        return this.hasOne('UserModel','iduser','user_who_receive_this_rate');
    }
},{
    doRate:Promise.method(function(raterequest){
        /**
         * "rateobj":{
		"idrate":1,
		"content":"rate freelancer",
		"user_who_receive_this_rate":"1",
		"user_who_rate_this":"2"
	},
	"arr_rate_criterias":[{
		"rate_id":1,
		"criteria_id":1,
		"point":5.0
	},{
		"rate_id":1,
		"criteria_id":2,
		"point":5.0
	},{
		"rate_id":1,
		"criteria_id":3,
		"point":5.0
		}
	]
         */
        return bookshelf.transaction(trx=>{
            return this.forge(raterequest).save(null,{method:'insert',transacting:trx});
        })
    }),
    getListRate:Promise.method(function({iduser,page}){
        return this.forge().query(function(db){
            db.innerJoin('users','users.iduser','rates.user_who_rate_this');
            db.where('rates.user_who_receive_this_rate','=',iduser);
        })
        .orderBy('rates.idrate','DESC')
        .fetchPage({
            pageSize:3,
            page:page?page:1,
            withRelated:['user_create_rate']
        })
    }),
    getAveragePoint:Promise.method(function({iduser}){
        return this.forge().where({user_who_receive_this_rate:iduser})
        .fetchAll({columns:['average_point']}).then(result=>{
            let average = 0
            result.toJSON().forEach(element => {
                average+=element.average_point;
            });
            return average/result.toJSON().length;
        });
    }),
});
const schemaValidateRate = Joi.object().keys({

});
var Rates = bookshelf.Collection.extend({
    model:RateModel,
});
module.exports.RateModel = bookshelf.model('RateModel',RateModel);
module.exports.RateCollection = bookshelf.collection('RateCollection',Rates);

