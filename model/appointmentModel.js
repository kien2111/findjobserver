var {bookshelf} = require('../db/dbconnect');
var Promise = require('bluebird');
var _ = require('lodash');
var {enumTransaction,
    Approve_Upgrade_Profile,
    enumhistoryOrOnProgress,
    enumStatus,
    TransactionType,
    enumStatusAppointment} = require('../model/globalconstant');
var {UserModel} = require('../model/userModel');
var {Deposit_FeeModel} = require('./deposit_feeModel');
var {TransactionModel,TransactionCollection} = require('../model/transactionModel');
var AppointmentModel = bookshelf.Model.extend({
    tableName:"appointments",
    idAttribute:'idappointment',
    hasTimestamps:true,
    user_create_appointment(){
        return this.belongsTo('UserModel','user_who_create_appointment','iduser');
    },
    user_receive_appointment(){
        return this.belongsTo('UserModel','user_who_receive_appointment','iduser');
    },
    deposit_fee:function(){
        return this.hasOne('Deposit_FeeModel','iddeposit_fee','iddeposit_fee');
    }
},{
    fetchFreelancerAppointment:Promise.method(function({iduser,page,historyOrOnProgress}){
        //act as freelancer request
        return this.forge().query(function(db){
            //db.innerJoin('users','users.iduser','appointments.user_who_create_appointment');
            //db.groupBy('users.iduser');
            db.where('appointments.user_who_receive_appointment','=',iduser);
            db.andWhere(function(){
                if(historyOrOnProgress==enumhistoryOrOnProgress.HISTORY){
                    this.where('appointments.status','=',enumStatusAppointment.Fail);
                    this.orWhere('appointments.status','=',enumStatusAppointment.Success);
                    this.orWhere('appointments.status','=',enumStatusAppointment.OnConFlict);
                }else{
                    this.where('appointments.status','=',enumStatusAppointment.OnProgress);
                    this.orWhere('appointments.status','=',enumStatusAppointment.OnWaitAdminAccepted);
                }
            });
            db.debug(true);
        })
        .orderBy('appointments.created_at','DESC')
        .fetchPage({
            pageSize:3,
            page:page?page:1,
            withRelated:['user_create_appointment','deposit_fee']
        })
    }),
    fetchEmployerAppointment:Promise.method(function({iduser,page,historyOrOnProgress}){
        //act as employer request
        return this.forge().query(function(db){
            //db.innerJoin('users','users.iduser','appointments.user_who_receive_appointment');
            //db.groupBy('users.iduser');
            db.where('appointments.user_who_create_appointment','=',iduser);
            db.andWhere(function(){
                if(historyOrOnProgress==enumhistoryOrOnProgress.HISTORY){
                    this.where('appointments.status','=',enumStatusAppointment.Fail);
                    this.orWhere('appointments.status','=',enumStatusAppointment.Success);
                    this.orWhere('appointments.status','=',enumStatusAppointment.OnConFlict);
                }else{
                    this.where('appointments.status','=',enumStatusAppointment.OnProgress);
                    this.orWhere('appointments.status','=',enumStatusAppointment.OnWaitAdminAccepted);
                }
            });
            db.debug(true);
        })
        .orderBy('appointments.created_at','DESC')
        .fetchPage({
            pageSize:3,
            page:page?page:1,
            withRelated:['user_receive_appointment','deposit_fee']
        })
    }),
    bookingAppointment:Promise.method(function(appointment){
        appointment.estimate_time = new Date(appointment.estimate_time);
        let self = this;
        let saveddata = _.omit(appointment,['deposit_fee']);
        return bookshelf.transaction(trx=>{
            return UserModel.forge()
                .where({iduser:appointment.user_who_create_appointment})
                .fetch({transacting:trx})
                .tap(userresult=>{
                if(!userresult)throw new Error("Không tìm thấy thông tin tài khoản của bạn");
                return Deposit_FeeModel.getAvailableDepositFeeWithTransaction(trx).tap(depositresult=>{
                    if(userresult.get('account_balance')<depositresult.get('fee'))throw new Error("Không đủ tiền trong tài khoản để thực hiện yêu cầu");
                    let transaction = {
                        amount_of_coin:depositresult.get('fee'),
                        user_give:appointment.user_who_create_appointment,
                        user_receive:appointment.user_who_receive_appointment,
                        purpose:appointment.name,
                        status:enumTransaction.ON_PROGRESS,
                        transaction_type:TransactionType.Booking_Appointment,
                    };
                    return TransactionModel.insertTransaction(transaction,trx).tap(result=>{
                        return self.forge(saveddata).save({idtransaction:result.get('idtransaction')},{transacting:trx})
                    });
                })
            })
        });
    }),
    acceptAppointment:Promise.method(function({idappointment}){
        return this.forge({idappointment:idappointment}).fetch({require:true}).tap(res=>{
            switch(res.toJSON().status){
                case enumStatusAppointment.Fail:
                            throw new Error("Cuộc hẹn đã thất bại");
                                            break;
                case enumStatusAppointment.OnConFlict:
                            throw new Error("Cuộc hẹn có vấn đề xin liên hệ với admin để được hỗ trợ");
                                            break;
                case enumStatusAppointment.OnProgress:
                            return this.forge({status:enumStatusAppointment.OnWaitAdminAccepted})
                                .where({idappointment:idappointment})
                                .save(null,{method:'update'});                    
                case enumStatusAppointment.OnWaitAdminAccepted:
                            throw new Error("Cuộc hẹn đang chờ admin xử lý");
                                            break;
                case enumStatusAppointment.Success:
                            throw new Error("Cuộc hẹn đã thành công");
                                            break;
            }
        });
    }),
    declineAppointment:Promise.method(function({idappointment}){
        return this.forge({idappointment:idappointment}).fetch({require:true}).tap(res=>{
            switch(res.toJSON().status){
                case enumStatusAppointment.Fail:
                            throw new Error("Cuộc hẹn đã thất bại");
                                            break;
                case enumStatusAppointment.OnConFlict:
                            throw new Error("Cuộc hẹn có vấn đề xin liên hệ với admin để được hỗ trợ");
                                            break;
                case enumStatusAppointment.OnProgress:
                            return this.forge({status:enumStatusAppointment.Fail})
                                .where({idappointment:idappointment})
                                .save(null,{method:'update'});           
                case enumStatusAppointment.OnWaitAdminAccepted:
                            throw new Error("Cuộc hẹn đang chờ admin xử lý");
                                            break;
                case enumStatusAppointment.Success:
                            throw new Error("Cuộc hẹn đã thành công");
                                            break;
            }
        });
        
    }),
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
    
    
});
module.exports.AppointmentModel = bookshelf.model('AppointmentModel',AppointmentModel);
module.exports.AppointmentCollection = bookshelf.collection('AppointmentCollection',Appointments);


