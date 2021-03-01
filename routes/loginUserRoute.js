const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const _= require('lodash')
const config = require('config')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const {User} = require("../models/registerUserModel")


router.post("/login",async (req,res)=>{
    try{
        // console.log(typeof(req.body.Username));
        const {error} = validateUserLogin(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        const userExists = await User.findOne({Username:req.body.Username})
        if(!userExists) return res.status(400).send("Invalid username or password!");
        //@ts-ignore
        const validPassword = await bcrypt.compare(req.body.Password,userExists.Password)
        if(!validPassword) return res.status(400).send("Invalid username or password!");
        //@ts-ignore
        const token  =jwt.sign({_id:userExists._id,Email:userExists.Email,FullName:userExists.FullName,Username:userExists.Username,Password:userExists.Password},config.get('jwtPrivateKey'))
        res.setHeader('x-auth-token',token)
        res.header('x-auth-token',token).send(
            //@ts-ignore
             "Successfully logged In  as "+userExists.Username,)
    }
    catch(ex){
        res.status(500).send(ex.message)
    }
})

function validateUserLogin(user){
    const schema = {
        Username:Joi.string().lowercase().min(5).max(100).required(),
        Password:Joi.string().min(8).max(500).required()
    }
    return Joi.validate(user,schema)
}

module.exports = router