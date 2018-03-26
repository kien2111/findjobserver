var bookshelf = require('../db/dbconnect').bookshelf;
var EmployeeModel = require('./employeeModel').EmployeeModel;
var EmployerModel = require('./employerModel').EmployerModel;
var UserModel = require('../model/userModel').UserModel;
var AppointmentModel = bookshelf.Model.extend({
    tableName:"appointments",
    idAttribute:'idappointment',
    hasTimestamps:true,
    employee:function(){
        return this.belongsTo(EmployeeModel,'employee_id','idemployee');
    },
    employer:function(){
        return this.belongsTo(EmployerModel,'employer_id','idemployer');
    },
    user_create_appointment(){
        return this.belongsTo(UserModel,'user_who_create_appointment','iduser');
    },
    user_take_appointment(){
        return this.belongsTo(UserModel,'user_who_receive_appointment','iduser');
    }
});
var Appointments = bookshelf.Collection.extend({
    model:AppointmentModel,
});
module.exports.AppointmentModel = AppointmentModel;
module.exports.AppointmentCollection = Appointments;