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
        throw err;
    }
}

module.exports.findOneByFields = async function (feilds){
    try
    {
        let user = await Users.findOne(feilds);
        return user;

    }
    catch (err)
    {
        console.log(err);
        return null;
    }
}
