const mongoose = require('mongoose');
const TeamPoints = mongoose.model('TeamPoints');
const PlayerPoints = mongoose.model('PlayerPoints');
const MatchResult = mongoose.model('MatchResult');
const UserBids = mongoose.model('UserBids');
const UserAccount = mongoose.model('UserAccount');
const _ = require('lodash');
const mailCtrl = require('./mailController.js');

exports.create = function (req, res) {
    var teamPoints = new TeamPoints(req.body);
    teamPoints.save(function (err, data) {
        if (err) 
            throw err;
        res.json(data);
    });
};
exports.getList = function (req, res) {
    TeamPoints
        .find({}, function (err, data) {
            if (err) 
                throw err;
            res.json(data);
        });
};
exports.getListById = function (req, res) {
    res.json(req.match);
};
exports.updateListById = function (req, res) {
    TeamPoints
        .find({}, function (err, data) {
            if (err) 
                throw err;
            res.json(data);
        });
};
exports.deleteById = function (req, res) {
    TeamPoints
        .find({}, function (err, data) {
            if (err) 
                throw err;
            res.json(data);
        });
};

exports.getTeamPoints = function (req, res) {
    const matchId = req.params.match_id;
    TeamPoints
        .find({match: matchId})
        .populate('points.team')
        .exec((err, data) => {
            if (err) 
                throw err;
            res.json(data);
        });
}
exports.getPlayerPoints = function (req, res) {
    const matchId = req.params.matchid;
    PlayerPoints
        .find({match: matchId})
        .populate('points.player')
        .exec((err, data) => {
            if (err) 
                throw err;
            res.json(data);
        });
}

exports.saveTeamPoints = function (req, res) {
    let existingPoints = req.points,
        newPoints = req.body.points;
    req.body.points = existingPoints.concat(newPoints);

    var teamPoints = new TeamPoints(req.body);

    TeamPoints.update({
        match: req.body.match
    }, {
        match: req.body.match,
        points: req.body.points,
        team: req.body.team
    }, {upsert: true}).exec((err, data) => {
        if (err) 
            throw err;
        res.json(data);
    });
};
exports.PointsByMatchId = function (req, res, next, match_id) {
    TeamPoints
        .find({match: match_id})
        .exec((err, data) => {
            if (err) 
                throw err;
            req.points = data.length > 0
                ? data[0].points
                : [];
            next();
        });
}
exports.playerPoints = function (req, res) {
    let existingPoints = req.points,
        newPoints = req.body.points;
    req.body.points = existingPoints.concat(newPoints);

    var playerPoints = new PlayerPoints(req.body);

    PlayerPoints.update({
        match: req.body.match
    }, {
        match: req.body.match,
        points: req.body.points,
        player: req.body.player
    }, {upsert: true}).exec((err, data) => {
        if (err) 
            throw err;
        res.json(data);
    });
};
exports.pointsByMatch = (req, res, next, matchId) => {
    PlayerPoints
        .find({match: matchId})
        .exec((err, data) => {
            if (err) 
                throw err;
            req.points = data.length > 0
                ? data[0].points
                : [];
            next();
        });
}

exports.getBettings = (req, res) => {
    TeamPoints
        .find()
        .populate({
            path: 'match',
            populate: [
                {
                    path: 'teamA',
                    model: 'Team'
                }, {
                    path: 'teamB',
                    model: 'Team'
                }, {
                    path: 'series',
                    model: 'Series'
                }
            ]
        })
        .exec((err, data) => {
            res.json(data);
        })
};

exports.getBettingByMatch = (req, res) => {
    let matchId = req.params.matchid;
    console.log(matchId);
    TeamPoints
        .find({match: matchId})
        .populate('points.team')
        .populate('match')
        .exec((err, data) => {
            if (err) 
                throw err;
            
            var match;
            if (data.length > 0) {
                match = data[0].match;
                teamPoints = data[0].points
            }
            PlayerPoints
                .find({match: matchId})
                .populate('points.player')
                .exec((err, player) => {
                    if (err) 
                        throw err;
                    var playersPoints = player[0].points;
                    res.json({match: match, teamsPoint: teamPoints, playersPoints: playersPoints});

                });
        })
}
exports.saveBettingByMatch = (req, res) => {
    let body = req.body;
    let matchResult = new MatchResult(body);
    matchResult.save((err, result) => {
        if (err) 
            throw err;
        res
            .status(204)
            .send();
    });
}
exports.getBettingResult = (req, res) => {
    const matchId = req.params.matchid;
    MatchResult
        .findOne({match: matchId})
        .populate('match')
        .populate('playerBid')
        .populate('teamBid')
        .exec((err, result) => {
            if (err) 
                throw err;
            res.json(result);
        });
}

exports.publishMatchResult = (req, res) => {
    const matchId = req.params.matchid;
    MatchResult
        .findOne({match: matchId})
        .exec((err, result) => {
            if (err) 
                throw err;
            let {playerBid, teamBid} = result;
            UserBids
                .find({match: matchId})
                .exec((err, users) => {
                    if (err) 
                        throw err;
                    
                    _.forEach(users, (user, id) => {
                        let players = user.playerBid;
                        let point = 0;
                        let updatePlayerBid = _.map(players, (player, i) => {

                            if (player.player.equals(playerBid)) {
                                player.result = 'WIN';
                                point += player.winPoint;
                            } else {
                                player.result = 'LOSS';
                                // point -= player.point;
                            }
                            return player;
                        });
                        let updateTeamBid = user.teamBid;
                        if (user.teamBid.team.equals(teamBid)) {
                            updateTeamBid.result = 'WIN';
                            point += updateTeamBid.winPoint;
                        } else {
                            updateTeamBid.result = 'LOSS';
                            // point -= updateTeamBid.point;
                        }

                        UserBids.update({
                            match: matchId,
                            user: user.user
                        }, {
                            $set: {
                                playerBid: updatePlayerBid,
                                teamBid: updateTeamBid

                            }
                        }, {upsert: true}).exec((err, result) => {
                            if (err) 
                                throw err;
                            
                            UserAccount
                                .findOne({user: user.user})
                                .exec((err, userinfo) => {
                                    const remainingPoint = userinfo.totalPoints + point;
                                    UserAccount.update({
                                        user: user.user
                                    }, {
                                        $set: {
                                            totalPoints: remainingPoint
                                        }
                                    }).exec((err, useracc) => {
                                        if (id === user.length - 1) {
                                            res
                                                .status(200)
                                                .send();
                                        }
                                    });
                                });
                        });

                    });
                });

        });
}

exports.sendMatchResult =(req, res)=>{

    const matchId = req.params.matchid;
    UserBids
    .find({match: matchId})
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
    .populate('user',{'local.name': true, 'local.email': true})
    .exec((err, results)=>{
        
        _.forEach(results, (result)=>{
            let{match, user, teamBid, playerBid} = result;
            let name = user.local.name;
            let email = user.local.email;
            let teamName = teamBid.team.teamName;
            
            let messageBody = '';
            let points = 0;
            if(teamBid.result === 'WIN'){
                messageBody+=`<h3>You have won <strong>${teamBid.winPoint}</strong> on <strong>${teamName}</strong></h3>`
                points+=result.teamBid.winPoint;
            } else{
                messageBody+=`<h3>You have lost <strong>${result.teamBid.point}</strong> on <strong>${teamName}</strong></h3>`
                points-=result.teamBid.point;
            }
            if(result.playerBid.length > 0){
             _.forEach(result.playerBid, (playerBid)=>{
                    if(playerBid.result==='WIN'){
                        messageBody+=`<h3>You have won <strong>${playerBid.winPoint}</strong> on <strong>${playerBid.player.firstName} ${playerBid.player.lastName}</strong></h3>`
                        points+=playerBid.winPoint;
                    } else{
                        messageBody+=`<h3>You have lost <strong>${playerBid.point}</strong> on <strong>${playerBid.player.firstName} ${playerBid.player.lastName}</strong></h3>`
                        points-= playerBid.point;
                    }
                });
            }
            let replace = {
                username: name,
                pretextheader: `${match.teamA.teamName} vs ${match.teamB.teamName}`,
                message: 'Match result is here',
                teamAicon: 'http://ipl2018.us-east-2.elasticbeanstalk.com/icons/'+match.teamA.code+'.png',
                teamBicon:'http://ipl2018.us-east-2.elasticbeanstalk.com/icons/'+match.teamB.code+'.png',
                teamA: match.teamA.teamName,
                teamB: match.teamB.teamName,
                messageBody: messageBody
            },
            subject = points > 0 ? `Congratulations! You won ${points}` : `Ooops! You lost ${Math.abs(points)}`;
            mailCtrl.sendMail('matchResult.html', replace, email, subject);
        });
        res.status(200).json();
    });
}