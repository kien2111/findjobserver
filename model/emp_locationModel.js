var bookshelf = require('../db/dbconnect');
var EmployeeModel = require('./employeeModel').EmployeeModel;
var EmployerModel = require('./employerModel').EmployerModel;
var AddressModel = require('./addressModel').AddressModel;
var Emp_LocationModel = bookshelf.Model.extend({
    tableName:"emp_location",
    employee:function(){
        return this.belongsTo(EmployeeModel,'idemployee','employee_id');
    },
    employer:function(){
        return this.belongsTo(EmployerModel,'idemployer','employer_id');
    },
    address:function(){
        return this.belongsTo(AddressModel,'idaddress','address_id');
    }
});
var Emp_Locations = bookshelf.Collection.extend({
    model:Emp_LocationModel,
});
module.exports.Emp_LocationModel = Emp_LocationModel;
module.exports.Emp_LocationCollection = Emp_Locations;