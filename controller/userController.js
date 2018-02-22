var Users = require('../model/userModel');
var _ = require('lodash');
new Users().fetchAll().then(models=>{
    console.log(JSON.stringify(models));
});

function userController(){

}
userController.prototype.SignUp = function(obj){
    Users.forge.save(obj).then(function(model){
        console.log(JSON.stringify(model));
    }).catch(err=>{
        console.log(JSON.stringify(err));
    });
}