var bookshelf = require('../db/dbconnect').bookshelf;
var Joi = require('joi');
var {Criteria_RateModel,Criteria_RateCollection} = require('./criteria_rateModel');
require('./userModel').UserModel;
var Promise = require('bluebird');
var RateModel = bookshelf.Model.extend({
    tableName:"rates",
    idAttribute:'idrate',
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
        return this.belongsTo('UserModel','iduser','user_who_rate_this');
    },
    user_take_rate:function(){
        return this.belongsTo('UserModel','iduser','user_who_receive_this_rate');
    }
},{
    dorate:Promise.method(function({rateobj,arr_rate_criterias}){
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
        console.log(rateobj);
        return bookshelf.transaction(trx=>{
            return this.forge(rateobj).save(null,{method:'insert',transacting:trx}).tap(rate=>{
                return Promise.all(Criteria_RateCollection.forge(arr_rate_criterias).invokeMap('save'))
            })
        })
    }),
});
const schemaValidateRate = Joi.object().keys({

});
var Rates = bookshelf.Collection.extend({
    model:RateModel,
});
module.exports.RateModel = bookshelf.model('RateModel',RateModel);
module.exports.RateCollection = bookshelf.collection('RateCollection',Rates);