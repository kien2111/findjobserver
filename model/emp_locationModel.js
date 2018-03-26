var bookshelf = require('../db/dbconnect').bookshelf;
var EmployeeModel = require('./employeeModel').EmployeeModel;
var EmployerModel = require('./employerModel').EmployerModel;
var AddressModel = require('./addressModel').AddressModel;
var UserModel = require('./userModel').UserModel;
var Emp_LocationModel = bookshelf.Model.extend({
    tableName:"emp_location",
    idAttribute:'address_id',
    employee:function(){
        return this.belongsTo(EmployeeModel,'idemployee','employee_id');
    },
    employer:function(){
        return this.belongsTo(EmployerModel,'idemployer','employer_id');
    },
    address:function(){
        return this.belongsTo(AddressModel,'idaddress','address_id');
    },
    user:function(){
        return this.belongsTo(UserModel,'iduser','iduser');
    }
});
var Emp_Locations = bookshelf.Collection.extend({
    model:Emp_LocationModel,
});
module.exports.Emp_LocationModel = Emp_LocationModel;
module.exports.Emp_LocationCollection = Emp_Locations;