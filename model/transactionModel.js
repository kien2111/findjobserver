var {bookshelf} = require('../db/dbconnect');
var {UserModel} = require('../model/userModel');
var Promise = require('bluebird');
var {enumTransation,
    Approve_Upgrade_Profile,
    enumhistoryOrOnProgress,
    enumStatus,
    enumStatusAppointment} = require('../model/globalconstant');
var TransactionModel = bookshelf.Model.extend({
    tableName:"transactions",
    idAttribute:'idtransaction',
    hasTimestamps:true,
    user_give:function(){
        return this.hasOne('UserModel','iduser','user_give');
    },
    user_receive:function(){
        return this.hasOne('UserModel','iduser','user_receive');
    },
    transactiontype:function(){
        return this.hasOne('TransactionModel','idtransactiontype','transaction_type');
    }
},{
    insertTransaction:Promise.method(function(obj,trx){
        return this.forge(obj).save({method:"insert",transacting:trx});
    }),
    fetchLastestRevenuePerMonth:Promise.method(function(){
        return bookshelf.knex.raw(`SELECT 
        SUM(IF(month = 'Jan', total, 0)) AS 'Jan',
        SUM(IF(month = 'Feb', total, 0)) AS 'Feb',
        SUM(IF(month = 'Mar', total, 0)) AS 'Mar',
        SUM(IF(month = 'Apr', total, 0)) AS 'Apr',
        SUM(IF(month = 'May', total, 0)) AS 'May',
        SUM(IF(month = 'Jun', total, 0)) AS 'Jun',
        SUM(IF(month = 'Jul', total, 0)) AS 'Jul',
        SUM(IF(month = 'Aug', total, 0)) AS 'Aug',
        SUM(IF(month = 'Sep', total, 0)) AS 'Sep',
        SUM(IF(month = 'Oct', total, 0)) AS 'Oct',
        SUM(IF(month = 'Nov', total, 0)) AS 'Nov',
        SUM(IF(month = 'Dec', total, 0)) AS 'Dec',
        SUM(total) AS total_yearly
        FROM (
    SELECT DATE_FORMAT(created_at, "%b") AS month, SUM(amount_of_coin) as total
    FROM transactions
    WHERE 
    (transaction_type=1 or transaction_type=2)/*revenue from topup money upgrade profile*/
    and (status =1)/*success transaction*/
    and created_at< NOW() and created_at >Now() - interval 12 month
    GROUP BY DATE_FORMAT(created_at, "%m-%Y")) as sub`)
    }),
    fetchLastestRevenuePerYear:Promise.method(function(){
        return bookshelf.knex.raw(`select 
        year(created_at), 
        sum(amount_of_coin) as sum_of_year
      from transactions
      where (transaction_type=1 or transaction_type=2)/*revenue from topup money upgrade profile*/
      and (status =1)/*success transaction*/
      and (created_at <= NOW() and created_at >= NOW() - interval 5 year)/* lastest 5 month*/
      group by YEAR(created_at)
      order by YEAR(created_at) desc`);
    }),
    fetchLastestFiveDayRevenue:Promise.method(function(){
        return bookshelf.knex.raw(`select 
        dayname(created_at), 
        sum(amount_of_coin) as sum_of_day
      from transactions
      where (transaction_type=1 or transaction_type=2)/*revenue from topup money upgrade profile*/
      and (status =1)/*success transaction*/
      and (created_at <= NOW() and created_at >= NOW() - interval 5 day)/* lastest 5 month*/
      group by YEAR(created_at)
      order by YEAR(created_at) desc`);
    }),
});
var Transactions = bookshelf.Collection.extend({
    model:TransactionModel,
});
module.exports.TransactionModel = bookshelf.model('TransactionModel',TransactionModel);
module.exports.TransactionCollection = bookshelf.collection('TransactionCollection',Transactions);
