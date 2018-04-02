const mongoose = require('mongoose');
const UserAccount = mongoose.model('UserAccount');
const _ = require('lodash');
const passport = require('passport');
const deferred = require('deferred');
const jwt = require('jsonwebtoken');
const config = require('./../../config');
exports.addUser = (user) => {
    var defer = deferred()
    let userInfo = user;
    userInfo.role = 'USER';
    let userAccount = new UserAccount(userInfo);
    userAccount.save((err, data) => {
        if (err) 
            throw err;
        defer.resolve(data.toJSON());
    });
    return defer.promise;
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
                    res.json({role: user.role, name: user.user.local.name, totalPoints: user.totalPoints, email: user.user.local.email});
                });
        } else{ 
            res.status(401).send();
        }

    })
}