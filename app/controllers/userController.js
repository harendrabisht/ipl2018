const mongoose = require('mongoose');
const UserAccount = mongoose.model('UserAccount');
const _ = require('lodash');
const passport = require('passport');
const deferred = require('deferred');
const jwt = require('jsonwebtoken');
const UserBids = mongoose.model('UserBids');
const config = require('./../../config');
const mailCtrl = require('./mailController.js');



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
        mailCtrl.sendMail('signup.html', {username:userInfo.name, message:'You have 1000 points in your account. Let\'s begin the game.'},userInfo.email, 'Welcome to IPL 2018');
        userInfo = _.omit(userInfo, 'password');
        res.json(userInfo);
    });
}
exports.doLogin = (req, res) => {
    let userInfo = req.userInfo;

    UserAccount
        .findOne({user: userInfo.user})
        .exec((err, data) => {
            userInfo.role = data.role;
            userInfo = _.omit(userInfo, 'password');
            const token = jwt.sign({
                userId: userInfo.user,
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
                    if (user) 
                        res.json({role: user.role, name: user.user.local.name, totalPoints: user.totalPoints, email: user.user.local.email});
                    else 
                        res
                            .status(401)
                            .send();
                    }
                );
        } else {
            res
                .status(401)
                .send();
        }

    })
}

exports.userInfoByToken = (req, res, next) => {
    let token = req.header('token');
    jwt.verify(token, config.secretId, (err, decoded) => {
        if (decoded) {
            req.user = decoded;
            next();
        } else 
            res
                .status(401)
                .send();
        }
    );
};

exports.saveUserBet = (req, res) => {
    let user = req.user,
        userBet = req.body,
        userId = mongoose
            .Types
            .ObjectId(user.userId);

    userBet.user = userId;
    let {playerBid, teamBid} = userBet;
    let totalPoint = 0;
    totalPoint += teamBid.point;
    for (let i = 0; i < playerBid.length; i++) {
        totalPoint += playerBid[i].point;
    }

    let userBids = new UserBids(userBet);
    UserBids
        .find({user: user.userId, match: userBet.match})
        .exec((err, data) => {
            if (data.length > 0) {
                res
                    .status(400)
                    .send();
            } else {
                userBids.save((err, data) => {
                    if (err) 
                        throw err;
                    UserAccount.findOne({user: userId})
                    .exec((err, userinfo)  =>{
                        const remainingPoint = userinfo.totalPoints - totalPoint;
                        UserAccount.update({
                            user: userId
                        }, {
                            $set: {
                                totalPoints: remainingPoint
                            }
                        }).exec((err, useracc) => {
                            res.json(data);
                        });
                    });
                })
            }
        })
};

exports.myMatchBet = (req, res) => {
    let user = req.user,
        match = req.params.match,
        userId = user.userId;
    UserBids
        .find({user: user.userId, match: match})
        .populate('playerBid.player')
        .populate('teamBid.team')
        .exec((err, data) => {
            if (err) 
                throw err;
            if (data.length > 0) 
                res.json(data[0])
            else 
                res
                    .status(404)
                    .send({});
            }
        );
}
exports.getMyAllBet = (req, res) => {
    let user = req.user,
        match = req.params.match,
        userId = user.userId;
    UserBids
        .find({user: user.userId})
        .populate('playerBid.player')
        .populate('teamBid.team')
        .populate({
            path: 'match',
            populate: [
                {
                    path: 'teamA',
                    model: 'Team'
                }, {
                    path: 'teamB',
                    model: 'Team'
                }
            ]
        })
        .exec((err, data) => {
            if (err) 
                throw err;
          
                res.json(data)
        
            }
        )
}

exports.getTrendingBet = (req, res) =>{
    let user = req.user,
        match = req.params.match;
    UserBids
        .find()
        .populate('playerBid.player')
        .populate('teamBid.team')
        .populate('user', {'local.name': true})
        .populate({
            path: 'match',
            populate: [
                {
                    path: 'teamA',
                    model: 'Team'
                }, {
                    path: 'teamB',
                    model: 'Team'
                }
            ]
        })
        .exec((err, data) => {
            if (err) 
                throw err;
          
                res.json(data)
        
            }
        )
}