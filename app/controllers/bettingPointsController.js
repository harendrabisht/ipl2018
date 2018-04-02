const mongoose = require('mongoose');
const TeamPoints = mongoose.model('TeamPoints');
const PlayerPoints = mongoose.model('PlayerPoints');
exports.create = function(req, res){
    var teamPoints = new TeamPoints(req.body);
    teamPoints.save(function(err, data){
        if(err) throw err;
        res.json(data);
    });
};
exports.getList = function(req, res){
    TeamPoints.find({},function(err, data){
        if(err) throw err;
        res.json(data);
    });
};
exports.getListById = function(req, res){
    res.json(req.match);
};
exports.updateListById = function(req, res){
    TeamPoints.find({},function(err, data){
        if(err) throw err;
        res.json(data);
    });
};
exports.deleteById = function(req, res){
    TeamPoints.find({},function(err, data){
        if(err) throw err;
        res.json(data);
    });
};

exports.getTeamPoints = function(req, res){
    const matchId = req.params.match_id;
    TeamPoints
    .find({match: matchId})
    .populate('points.team')
    .exec((err, data)=>{
        if(err) throw err;
        res.json(data);
    });
}
exports.getPlayerPoints = function(req, res){
    const matchId = req.params.matchid;
    PlayerPoints
    .find({match: matchId})
    .populate('points.player')
    .exec((err, data)=>{
        if(err) throw err;
        res.json(data);
    });
}

exports.saveTeamPoints = function(req, res){
    let existingPoints = req.points,
    newPoints = req.body.points;
    req.body.points = existingPoints.concat(newPoints);
    
    var teamPoints = new TeamPoints(req.body);


    TeamPoints.update({
        match: req.body.match
    },{
        match:  req.body.match,
        points: req.body.points,
        team: req.body.team
    },{ upsert: true })
    .exec((err, data)=>{
        if(err) throw err;
        res.json(data);
    });
};
exports.PointsByMatchId = function(req, res, next, match_id){
    TeamPoints.find({match: match_id})
    .exec((err, data)=>{
        if(err) throw err;
        req.points = data.length > 0 ? data[0].points : [];
        next();
    });
}
exports.playerPoints = function(req, res){
    let existingPoints = req.points,
    newPoints = req.body.points;
    req.body.points = existingPoints.concat(newPoints);
    
    var playerPoints = new PlayerPoints(req.body);


    PlayerPoints.update({
        match: req.body.match
    },{
        match:  req.body.match,
        points: req.body.points,
        player: req.body.player
    },{ upsert: true })
    .exec((err, data)=>{
        if(err) throw err;
        res.json(data);
    });
};
exports.pointsByMatch = (req, res, next, matchId) => {
    PlayerPoints.find({match: matchId})
    .exec((err, data)=>{
        if(err) throw err;
        req.points = data.length > 0 ? data[0].points : [];
        next();
    });
}