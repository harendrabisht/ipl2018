const mongoose = require('mongoose');
const UserAccount = mongoose.model('UserAccount');
const _ = require('lodash');
const passport = require('passport');
const deferred = require('deferred');
const jwt = require('jsonwebtoken');
const UserBids = mongoose.model('UserBids');
const config = require('./../../config');
exports.addUser = (req, res) => {
    let userInfo = req.userInfo;
    userInfo.role = 'USER';
    userInfo.totalPoints = 1000;
    

    const token = jwt.sign({
        userId: userInfo.user,
        role: userInfo.role,
        email: userInfo.email
    }, config.secretId, {
        expiresIn: 86400 // expires in 24 hours
    });
    userInfo.token = token;
    let userAccount = new UserAccount(userInfo);
    userAccount.save((err, data) => {
        if (err) 
            throw err;
            
        userInfo.role = data.role;
        userInfo = _.omit(userInfo, 'password');
        res.json(userInfo);
    });
}
exports.doLogin = (req, res) => {
    let userInfo = req.userInfo;

    UserAccount
        .findOne({user: userInfo.userId})
        .exec((err, data) => {
            userInfo.role = data.role;
            userInfo = _.omit(userInfo, 'password');
            const token = jwt.sign({
                userId: userInfo.userId,
                role: userInfo.role,
                email: userInfo.email
            }, config.secretId, {
                expiresIn: 86400 // expires in 24 hours
            });
            userInfo.token = token;
            res.json(userInfo);
        });

}
exports.getUser = (req, res) => {
    let token = req.header('token');
    jwt.verify(token, config.secretId, function (err, decoded) {
        if (decoded) {
            UserAccount
                .findOne({
                user: mongoose
                    .Types
                    .ObjectId(decoded.userId)
            })
                .populate('user')
                .exec((err, user) => {
                    if (err) 
                        throw err;
                    
                    // let {u} = user
                    if(user)
                        res.json({role: user.role, name: user.user.local.name, totalPoints: user.totalPoints, email: user.user.local.email});
                    else
                        res.status(401).send();
                });
        } else{ 
            res.status(401).send();
        }

    })
}

exports.userInfoByToken = (req, res, next) =>{
    let token = req.header('token');
    jwt.verify(token, config.secretId, (err, decoded)=> {
        if (decoded) {
            req.user = decoded;
            next();
        } else
        res.status(401).send();
    });
};

exports.saveUserBet = (req, res) =>{
    let user = req.user,
    userBet = req.body;
    userBet.user = mongoose.Types.ObjectId(user.userId);
    let userBids = new UserBids(userBet);
    UserBids
    .find({
        user: user.userId
    })
    .exec((err, data) =>{
        if(data.length > 0){
            res.status(400).send();
        } else{
            userBids.save((err, data)=>{
                if(err) throw err;
                res.json(data);
            })
        }
    })
};

exports.myMatchBet = (req, res) =>{
    let user = req.user,
    match = req.params.match,
    userId = user.userId;
    UserBids
    .find({
        user: user.userId,
        match: match
    })
    .populate('playerBid.player')
    .populate('teamBid.team')
    .exec((err, data)=>{
        if(err) throw err;
        res.json(data);
    })
}