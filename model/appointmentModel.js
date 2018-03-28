var bookshelf = require('../db/dbconnect').bookshelf;
var Promise = require('bluebird');
require('./employeeModel').EmployeeModel;
require('./employerModel').EmployerModel;
require('../model/userModel').UserModel;
var {TransactionModel,TransactionCollection} = require('../model/transactionModel');
var AppointmentModel = bookshelf.Model.extend({
    tableName:"appointments",
    idAttribute:'idappointment',
    hasTimestamps:true,
    employee:function(){
        return this.belongsTo('EmployeeModel','employee_id','idemployee');
    },
    employer:function(){
        return this.belongsTo('EmployerModel','employer_id','idemployer');
    },
    user_create_appointment(){
        return this.belongsTo('UserModel','user_who_create_appointment','iduser');
    },
    user_take_appointment(){
        return this.belongsTo('UserModel','user_who_receive_appointment','iduser');
    }
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