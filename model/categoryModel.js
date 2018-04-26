var {bookshelf} = require('../db/dbconnect');
var {ProfileModel} = require('./profileModel');
var Promise = require('bluebird');
var CategoryModel = bookshelf.Model.extend({
    tableName:"categories",
    idAttribute:'idcategory',
    profiles:function(){
        return this.hasMany('ProfileModel','category','idcategory');
    },

},{
    searchCategory:Promise.method(function({query}){
        return this.forge({category_name:query})
                .query(qb=>{
                    qb.whereRaw(`match (category_name) against ("${query}")`);
                })
                .fetchAll({withRelated:['profiles']})
                .then(categories=>{
                    return Promise.map(categories.toJSON(),(item,index,arr_length)=>{
                       return categories.at(index).set('num_count',categories.at(index).toJSON().profiles.length);
                    });
                });
    }),
});
var Categories = bookshelf.Collection.extend({
    model:CategoryModel,
},{
    
});
module.exports.CategoryModel = bookshelf.model('CategoryModel',CategoryModel);
module.exports.CategoryCollection = bookshelf.collection('CategoryCollection',Categories);

/* .then(categories=>{
    return Promise.map(categories.toJSON(),(item,index,arr_length)=>{
        return {
            data:item,
            count:function(){
                return categories.at(index)
                .constructor
                .forge({idcategory:categories.at(index).get('idcategory')})
                .profiles()
                .query({where:{category:categories.at(index).get('idcategory')}})
                .count();
            }
        }
    });
}) */