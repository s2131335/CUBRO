const bcrypt = require('bcrypt');
const Users = require('../database/models/users');

module.exports.addUser = async function (userData) {
    try
    {
        let user = await Users.create(userData);
        user.password = await bcrypt.hash(userData.password,10);
        await user.save();

    }
    catch (err)
    {   
        if (err.code===11000) throw "EmailExist";
    }
}

module.exports.findOneByFields = async function (fields){
    try
    {
        let user = await Users.findOne(fields);
        return user;

    }
    catch (err)
    {
        console.log(err);
        return null;
    }
}

module.exports.findAllUserByFilter = async function (filter={}){
    try
    {
        let users = await Users.find(filter);
        return users;

    }
    catch (err)
    {
        console.log(err);
        return null;
    }
}