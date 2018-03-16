var mysql = require('mysql');
var knex = require('knex')({
    client:'mysql',
    connection:{
        host:process.env.DB_HOST || 'kien.com',
        user:process.env.DB_USER || 'kien',
        password:process.env.DB_PASS || '123',
        database:process.env.DB_NAME || 'my_db' 
    },
    pool:{min:0,max:10},
    acquireConnectionTimeout:10000,
});
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');
module.exports = bookshelf;
