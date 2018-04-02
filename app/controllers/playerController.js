
const mongoose = require('mongoose');
const Player = mongoose.model('Player');
const _ = require('lodash');

exports.create = function(req, res){
    
    var player = new Player(req.body);
    player.save(function(err, data){
        if(err) throw err;
        res.json(data);
    });
};
exports.getList = function(req, res){
    let playerQuery = Player.find();
    if(req.query.team){
        playerQuery = playerQuery.where({'team':{$in:req.query.team}})
    }
    playerQuery
        .populate('team')
        .sort({country:1})
        .exec(function(err, data){
            if(err) throw err;
            res.json(data);
        })
    
};

exports.getListById = function(req, res){
    res.json(req.player);
};

exports.updateListById = function(req, res){
    var player = req.player,
    playerData = req.body,
    format = playerData.format,
    isFormatExist = false,
    teams = _.clone(player.team),
    teamData = _.map(teams, function(team){
        const teamFormat = team._doc.format;
        if(teamFormat.toUpperCase() === format.toUpperCase()){
            isFormatExist = true;
            return playerData.team
        } else{
            return team._id;
        }
    });
    teamData = isFormatExist ? teamData : teamData.concat(playerData.team);
    
    player.team = teamData;

    player.save(function(err, data){
        if(err) throw err;
        res.json(data);
    });
};

exports.deleteById = function(req, res){
    Player.find({},function(err, data){
        if(err) throw err;
        res.json(data);
    });
};

exports.playerById = function(req, res, next, playerId){
    Player
    .findById(playerId)
    .populate('team')
    .exec(function(err, doc){
        if(err) throw err;
        req.player = doc;
        next();
    });
}