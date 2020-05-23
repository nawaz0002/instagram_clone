const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_TOKEN = require('../config/keys').JWT_TOKEN

const User = require('../model/user');
const Post = require('../model/post');

exports.getOtherProfile = (req, res) => {
    User.findOne({_id: req.params.id})
        .select("-password")
        .then(user => {
            Post.find({postedBy: req.params.id})
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if(err){
                        return res.status(422).json({error: err})
                    }
                    res.json({user, posts})
                })
        })
        .catch(err => console.log(err))
}

exports.putFollow = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: {followers: req.user._id}
    }, {
        new: true
    }, (err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: {following: req.body.followId}
        }, {
            new: true
        })
        .select("-password")
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            return res.status(422).json({error: err})
        })
    })
}

exports.putUnFollow = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: {followers: req.user._id}
    }, {
        new: true
    }, (err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.body.unfollowId}
        }, {
            new: true
        })
        .select("-password")
        .then(result => {
            res.json(result)
        })
        .catch(err => {
            return res.status(422).json({error: err})
        })
    })
}