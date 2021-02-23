const mongoose = require('mongoose');
const Joi = require('joi');

function validateUserRegistration(user){
    const schema = {
        Email:Joi.string().min(5).max(255).required(),
        FullName:Joi.string().min(5).max(255).required(),
        Username:Joi.string().min(5).max(100).required(),
        Password:Joi.string().min(8).max(500).required()
    }
    return Joi.validate(user,schema)
}
const userSchema = new mongoose.Schema({
    Email:{
        type:String,
        minLength:5,
        maxLength:255,
        required:true
    },
    FullName:{
        type:String,
        minLength:5,
        maxLength:255,
        required:true
    },
    Username:{
        type:String,
        unique:true,
        minLength:5,
        lowercase:true,
        maxLength:100,
        required:true
    },
    Password:{
        type:String,
        minLength:8,
        maxLength:500,
        required:true
    }
})

const User = mongoose.model('users',userSchema)

module.exports.User = User;
module.exports.validate = validateUserRegistration