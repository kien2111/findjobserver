var {bookshelf} = require('../db/dbconnect');
var {UserModel} = require('../model/userModel');
var Promise = require('bluebird');
var {enumTransaction,
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
        return this.forge(obj).save(null,{method:"insert",transacting:trx});
    }),
    successTransaction:Promise.method(function(idtransaction,trx){
        return TransactionModel.forge({status:enumTransaction.SUCCESS})
            .where({idtransaction:idtransaction})
            .save(null,{method:'update',transacting:trx})
            .tap(console.log);
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
    fetchRevenuePerDay:Promise.method(function(datestart,dateend){
        let newdatestart = new Date(datestart);
        let newdateend = new Date(dateend);
        let strdatestart = formatDate(newdatestart);
        let strdateend = formatDate(newdateend);
        console.log(strdatestart);
        console.log(strdateend);
        return bookshelf.knex.raw(`select distinct dates,coalesce(total,0) as total from (
            select date_format(selected_date,'%d/%m/%Y') as dates from 
            (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) as selected_date from
             (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
             (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
             (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
             (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
             (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
            where selected_date between '${strdatestart}' and '${strdateend}' 
            ) as days left join (SELECT DATE_FORMAT(created_at,'%d/%m/%Y') as date_created_transaction, SUM(amount_of_coin) as total
                    FROM transactions where created_at between  '${strdatestart}' and '${strdateend}'
                    GROUP BY DATE(created_at)) as d on dates = date_created_transaction order by STR_TO_DATE(dates,'%d/%m/%Y');`);
    }),
    fetchRevenuePerMonth:Promise.method(function(datestart,dateend){
        let newdatestart = new Date(datestart);
        let newdateend = new Date(dateend);
        let strdatestart = formatDate(newdatestart);
        let strdateend = formatDate(newdateend);
        console.log(strdatestart);
        console.log(strdateend);
        return bookshelf.knex.raw(`select distinct dates,coalesce(total,0) as total from (
            select date_format(selected_date,'%m/%Y') as dates from 
            (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) as selected_date from
             (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
             (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
             (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
             (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
             (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
            where selected_date between '${strdatestart}' and '${strdateend}' 
            ) as days left join (SELECT DATE_FORMAT(created_at,'%m/%Y') as date_created_transaction, SUM(amount_of_coin) as total
                    FROM transactions where created_at between  '${strdatestart}' and '${strdateend}'
                    GROUP BY YEAR(created_at),month(created_at)) as d on dates = date_created_transaction order by STR_TO_DATE(dates,'%m/%Y')
        `);
    }),
    fetchRevenuePerYear:Promise.method(function(datestart,dateend){
        let newdatestart = new Date(datestart);
        let newdateend = new Date(dateend);
        let strdatestart = formatDate(newdatestart);
        let strdateend = formatDate(newdateend);
        console.log(strdatestart);
        console.log(strdateend);
        return bookshelf.knex.raw(`
        SELECT distinct selected_date as dates,COALESCE(total,0) as total from (
            select * from 
            (select DATE_FORMAT(adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0),'%Y') selected_date from
             (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
             (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
             (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
             (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
             (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
            where selected_date between '${strdatestart}' and '${strdateend}'
            ) days left join (select DATE_FORMAT(created_at,'%Y') as year, SUM(amount_of_coin) as total
            FROM transactions where created_at between  '${strdatestart}' and '${strdateend}'
            GROUP BY YEAR(created_at)) d on selected_date = year order by selected_date            
        `);
    }),
});
var Transactions = bookshelf.Collection.extend({
    model:TransactionModel,
});
module.exports.TransactionModel = bookshelf.model('TransactionModel',TransactionModel);
module.exports.TransactionCollection = bookshelf.collection('TransactionCollection',Transactions);
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
