const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const _= require('lodash')
const config = require('config')
const jwt = require('jsonwebtoken')
const {User,validate} = require("../models/registerUserModel")

router.post('/signup',async (req,res)=>{
    try{
        const {error} = validate(req.body)
        if(error) return res.status(400).send(error.details[0].message)
        const newUser = new User({
           Email:req.body.Email,    
           FullName:req.body.FullName,
           Username:req.body.Username,
           Password:req.body.Password
       })
       const userExists = await User.findOne({Username:req.body.Username})
       if(userExists !== null) return res.status(400).send("Username already exists")
       const salt = await bcrypt.genSalt(10);
       //@ts-ignore
       newUser.Password = await bcrypt.hash(newUser.Password,salt)
       try{
           await newUser.save()
           //@ts-ignore
           const token  =jwt.sign({_id:newUser._id,Email:newUser.Email,FullName:newUser.FullName,Username:newUser.Username,Password:newUser.Password},config.get('jwtPrivateKey'))
           res.header('x-auth-token',token).send(
               //@ts-ignore
                "Successfully registered as "+newUser.Username,)
       }
       catch(ex){
           res.status(400).send(ex.message)
       }
    }
    catch(ex){
       res.status(400).send(ex.message)
    }
})

module.exports = router

