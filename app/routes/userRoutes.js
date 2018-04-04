const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const passport = require('passport');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./../../config');
const _ = require('lodash');
const deferred = require('deferred');
router
    .route('/signup')
    .post((req, res, next) => {
        passport.authenticate('local-signup', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res
                    .status(404)
                    .send();
            }
            // create a token
            let userInfo = user
                .toJSON()
                .local;
                userInfo.user = user.id;
                req.userInfo = userInfo;
                next();
            
        })(req, res, next);
    }, userController.addUser);
router
    .route('/login')
    .post(function (req, res, next) {

        passport
            .authenticate('local-login', function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.redirect('/login');
                }
                // create a token
                let userInfo = user
                    .toJSON()
                    .local;

                userInfo.user = user.id;
                req.userInfo = userInfo;
                next();

            })(req, res, next);
    }, userController.doLogin);

router
    .route('/userinfo')
    .get(userController.getUser);

router
.route('/savebet')
.post(userController.userInfoByToken, userController.saveUserBet);

router
    .route('/:match/mybet')
    .get(userController.userInfoByToken, userController.myMatchBet);

module.exports = router;