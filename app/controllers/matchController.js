const mongoose = require('mongoose');
const Match = mongoose.model('Match');
const UserAccount = mongoose.model('UserAccount');
const _ = require('lodash');
const mailCtrl = require('./mailController.js');
const BettingCtrl = require('./bettingPointsController');

exports.create = function (req, res) {
    var match = new Match(req.body);
    match.save(function (err, data) {
        if (err) 
            throw err;
        res.json(data);
    });
};
exports.getList = function (req, res) {
    let matchQuery = Match.find();
    if (req.query.seriesid !== null && req.query.seriesid) {
        matchQuery = matchQuery.where({
            series: {
                $in: req.query.seriesid
            }
        });
    }
    matchQuery
        .populate('teamA', {teamName: true, url: true, code: true})
        .populate('teamB', {teamName: true, url: true, code: true})
        .populate('series', {name: true})
        .sort({date: 1})
        .exec(function (err, data) {
            if (err) 
                throw err;
            res.json(data);
        });
};
exports.getListById = function (req, res) {
    res.json(req.match);
};
exports.updateListById = function (req, res) {
    var Match = req.match;
    const matchData = req.body;
    Match = _.extend(Match, matchData);
    Match.save(function (err, data) {
        if (err) 
            throw err;
        if(data.status)
            sendMatchLiveNotification(data);
        res.json(data);
        
    });
};
exports.deleteById = function (req, res) {
    Match
        .find({}, function (err, data) {
            if (err) 
                throw err;
            res.json(data);
        });
};

exports.MatchById = function (req, res, next, id) {
    Match
        .findById(id)
        .populate('teamA', {
            teamName: true,
            url: true,
            code: true
        })
        .populate('teamB', {
            teamName: true,
            url: true,
            code: true
        })
        .populate('series', {name: true})
        .exec(function (err, doc) {
            if (err) 
                throw err;
            req.match = doc;
            next();
        });
}

exports.getMatchesByFormats = (req, res) => {
    var formatQuery = req.query.format;
    var matchQuery = Match.find();
    matchQuery = matchQuery.where({'status': true});
    matchQuery
        .populate('teamA', {teamName: true, code: true, url: true})
        .populate('teamB', {teamName: true, code: true, url: true})
        .populate('series', {name: true})
        .exec(function (err, matches) {
            const mathes = _.groupBy(matches, 'series.name')
            res.json(mathes);
        });
}
const sendMatchLiveNotification = (match) =>{
    let replace = {
        username: null,
        message: 'Match is available for choosing your favourite team and players.',
        teamAicon: 'http://ipl2018.us-east-2.elasticbeanstalk.com/icons/'+match.teamA.code+'.png',
        teamBicon:'http://ipl2018.us-east-2.elasticbeanstalk.com/icons/'+match.teamB.code+'.png',
        teamA: match.teamA.teamName,
        teamB: match.teamB.teamName,
        matchLink: 'http://ipl2018.us-east-2.elasticbeanstalk.com/match-details/'+match._id
    },
    subject = `${replace.teamA} vs ${replace.teamB}`;
    
    UserAccount
    .find()
    .populate('user',{'local.name': true, 'local.email': true})
    .exec((err, users)=>{
        if(err)
            throw err;
        _.forEach(users, (user)=>{
            const email= user.user.local.email,
            name= user.user.local.name;
            replace.username = name;
            mailCtrl.sendMail('match.html', replace,email, subject);
        });
    });
}