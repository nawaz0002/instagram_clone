const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_TOKEN = require('../config/keys').JWT_TOKEN;
const MAILTRAP_USER = require('../config/keys').MAILTRAP_USER;
const MAILTRAP_PASSWORD = require('../config/keys').MAILTRAP_PASSWORD;
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: MAILTRAP_USER,
        pass: MAILTRAP_PASSWORD
    }
})

const User = require('../model/user');

exports.postSignup = (req, res) => {
    const { name, email, password, pic} = req.body;

    if(!name || !email || !password){
        return res.status(422).json({error: "Please enter all the field"});
    }

    User.findOne({email : email})
        .then(savedUser => {
            if(savedUser){
                // console.log(savedUser)
                return res.status(400).json({error: "Email already exists"})
            }


            bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        const user = new User({
                            name,
                            email,
                            password: hashedPassword,
                            pic: pic
                        })
                        console.log(user)
                        user.save()
                            .then(userRegistered => {
                                transporter.sendMail({
                                    to: user.email,
                                    from: "no-reply@instagram.com",
                                    subject: "signup succes",
                                    html: `<h1>Welcome ${user.name} to instagram. You have successfully signedup</h1>`
                                })
                                jwt.sign({
                                    _id: userRegistered._id
                                }, JWT_TOKEN)
                                return res.status(200).json({message: 'user registered'})
                            })
                            .catch(err => {
                                console.log('err', err);
                                return res.status(400).json({error: "error occured"});
                            })
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(400).json({error: "error while creating password"})
                    })
            
        })

}

exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    
    if(!email || !password){
        return res.status(422).json({error: "Please enter all the field"});
    }

    User.findOne({email: email})
        .then(savedUser => {
            if(!savedUser){
                return res.status(422).json({error: "Invalid mail or password"})
            }
            bcrypt.compare(password, savedUser.password)
                    .then(doMatch => {
                        if(doMatch){
                            // console.log(savedUser._id)
                            const token = jwt.sign({_id : savedUser._id}, JWT_TOKEN)
                            const {_id, email, name, followers, following, pic} = savedUser;
                            return res.status(200).json({token, user: {_id, email, name, followers, following, pic}})
                        }
                        return res.status(422).json({error: "Invalid mail or password"})
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(422).json({error: "internal error"})
                    })
        })
}

exports.putUploadPic = (req, res) => {
    User.findByIdAndUpdate(req.user._id, 
        {  
            $set: {pic: req.body.pic}
        }, 
        {new : true}, 
        (err, result)=>{
            if(err){
                return res.status(400).json({error: "error while uploading photo"});
            }
            res.json(result)
    })
}

exports.postReset = (req, res) => {

    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            return res.status(404).json({error: "Email not found"})
        }
        const token = buffer.toString('hex')
    User.findOne({email : req.body.email})
        .then(user => {
            if(!user){
                return res.status(404).json({error: "User doesnt exists with this email id"})
            }
            user.resetToken = token,
            user.expireToken = new Date() + 360000
            user.save().then(result => {
                transporter.sendMail({
                    to: user.email,
                    from: 'no-reply@instagram.com',
                    subject: 'password reset',
                    html:  `
                        <p>you requested for password reset</p>
                        <h4>Click in this <a href="http://localhost:3000/reset/${token}">link</a>to reset password</h4>
                    `
                })
                res.json({message: 'Check mail for the reset link'})
            })
        })
    })
}

exports.postNewPassword = (req, res) => {
    const sentToken = req.body.token;
    const newPassword = req.body.password
    User.findOne({resetToken :sentToken})
    .then(user => {
        // console.log(Date.now(), {$gt : Date.now()})
            if(!user){
                return res.status(404).json({error: 'Session doesnt exists'})
            }
            bcrypt.hash(newPassword, 12)
                    .then(hashedPassword => {
                        user.resetToken = undefined,
                        user.expireToken = undefined,
                        user.password = hashedPassword
                        user.save()
                            .then(savedUser => {
                                return res.json({message: 'password changed successfully'})
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
                    .catch(err => {
                        console.log(err)
                    })
        })
}

exports.getSearchedUsers = (req, res) => {
    const userPattern  = new RegExp("^" + req.body.query);
    User.find({name: {$regex: userPattern}})
        .select("_id name pic")
        .then(user => {
            res.json({user})
        })
        .catch(err => console.log(err))
}