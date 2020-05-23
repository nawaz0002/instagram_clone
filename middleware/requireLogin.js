const jwt = require('jsonwebtoken');
const User = require('../model/user');
const mongoose = require('mongoose');
const JWT_TOKEN = require('../config/keys').JWT_TOKEN;


module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization){
        return res.status(401).json({error: "You must be loged in"});
    }

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_TOKEN, (err, payload) => {
        if(err){
            return res.status(401).json({error: "You must be loged in"});
        }

        const {_id} = payload;
        User.findById(_id).select("-password")
            .then(userData => {
                req.user = userData;
                next();
            })
    })
}