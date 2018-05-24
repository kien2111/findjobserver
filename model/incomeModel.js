var {bookshelf} = require('../db/dbconnect');
var {enumTransation,
    Approve_Upgrade_Profile,
    enumhistoryOrOnProgress,
    enumStatus,
    enumStatusAppointment} = require('../model/globalconstant');
var IncomeModel = bookshelf.Model.extend({
    tableName:"incomes",
    idAttribute:'idincome',
});
var Incomes = bookshelf.Model.extend({
    model:IncomeModel,
});
module.exports.IncomeModel = bookshelf.model('IncomeModel',IncomeModel);
module.exports.IncomeCollection = bookshelf.collection('IncomeCollection',Incomes)
