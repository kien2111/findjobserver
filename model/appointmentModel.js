var bookshelf = require('../db/dbconnect');
var EmployeeModel = require('./employeeModel').EmployeeModel;
var EmployerModel = require('./employerModel').EmployerModel;
var AppointmentModel = bookshelf.Model.extend({
    tableName:"appointments",
    hasTimestamps:true,
    employee:function(){
        return this.belongsTo(EmployeeModel,'employee_id','idemployee');
    },
    employer:function(){
        return this.belongsTo(EmployerModel,'employer_id','idemployer');
    }
});
var Appointments = bookshelf.Collection.extend({
    model:AppointmentModel,
});
module.exports.AppointmentModel = AppointmentModel;
module.exports.AppointmentCollection = Appointments;