var {bookshelf} = require('../db/dbconnect');
var Promise = require('bluebird');
var {UserModel} = require('../model/userModel');
var {TransactionModel,TransactionCollection} = require('../model/transactionModel');
var AppointmentModel = bookshelf.Model.extend({
    tableName:"appointments",
    idAttribute:'idappointment',
    hasTimestamps:true,
    user_create_appointment(){
        return this.belongsTo('UserModel','user_who_create_appointment','iduser');
    },
    user_take_appointment(){
        return this.belongsTo('UserModel','user_who_receive_appointment','iduser');
    }
    
},{
    fetchOnProgressFreelancerAppointment:Promise.method(function({iduser,page}){
        //act as freelancer request
        return this.forge().query(function(db){
            db.innerJoin('users','users.iduser','appointments.user_who_create_appointment');
            db.groupBy('users.iduser');
            db.where('appointments.user_who_receive_appointment','=',iduser);
            db.where('appointments.status','=',enumStatusAppointment.OnProgress);
        })
        .orderBy('appointments.created_at','DESC')
        .fetchPage({
            pageSize:3,
            page:page?page:1,
            withRelated:['user_create_appointment']
        })
    }),
    fetchOnProgressEmployerAppointment:Promise.method(function({iduser,page}){
        //act as employer request
        return this.forge().query(function(db){
            db.innerJoin('users','users.iduser','appointments.user_who_receive_appointment');
            db.groupBy('users.iduser');
            db.where('appointments.user_who_create_appointment','=',iduser);
            db.where('appointments.status','=',enumStatusAppointment.OnProgress);
        })
        .orderBy('appointments.created_at','DESC')
        .fetchPage({
            pageSize:3,
            page:page?page:1,
            withRelated:['user_take_appointment']
        })
    })
});
var Appointments = bookshelf.Collection.extend({
    model:AppointmentModel,
},{
    bookingappointment:Promise.method(function(appointmentobj){
        return bookshelf.transaction(trx=>{
            return this.forge(appointmentobj).save(null,{method:'insert',transacting:trx}).tap(result=>{
                //create new transaction and wait for freelancer accept or decline if accept
                //turn it to success else turn it fail admin can mark this transaction as conflict status
                //when create this need deposit price so first fetch it before insert transact
               return TransactionModel.forge().save(null,{method:'insert',transacting:trx})
            });
        })
    }),
    acceptAppointment:Promise.method(function({appointmentid}){
        return this.forge(appointmentid).save(null,{method:'update'}).tap(result=>{
            
        })
    }),
    declineAppointment:Promise.method(function(){

    }),
    
});
module.exports.AppointmentModel = bookshelf.model('AppointmentModel',AppointmentModel);
module.exports.AppointmentCollection = bookshelf.collection('AppointmentCollection',Appointments);

const enumStatusAppointment = {
    OnProgress:0,
    Fail:1,
    Success:2,
    OnConFlict:3
}
