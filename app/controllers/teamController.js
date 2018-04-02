const mongoose = require('mongoose');
const Team = mongoose.model('Team')
exports.create = function (req, res) {

    var team = new Team(req.body);
    team.save(function (err, data) {
        if (err) 
            throw err;
        res.json(data);
    });
};
exports.getList = function (req, res) {

    let teamQuery = Team.find();
    // if(teamQuery.query.team){
    //     teamQuery = teamQuery.where({'team':{$in:teamQuery.query.team}})
    // }
    teamQuery.exec(function (err, data) {
        if (err) 
            throw err;
        res.json(data);
    });
};
exports.getListById = function (req, res) {
    const team = new Team(req.body);
    res.json(req.team);
};
exports.updateListById = function (req, res) {
    var team = new Team(req.body);
    Team.find({}, function (err, data) {
        if (err) 
            throw err;
        res.json(data);
    });
};
exports.deleteById = function (req, res) {
    var team = new Team(req.body);
    Team.find({}, function (err, data) {
        if (err) 
            throw err;
        res.json(data);
    });
};

exports.teamById = function (req, res, next, id) {
    Team
        .findById(id, function (err, doc) {
            if (err) 
                throw err;
            req.team = doc;
            next();
        });
}
exports.teamByFormat = function (req, res) {
    const format = req.query.format;
    Team.find({
        $or: [
            {
                format: format.toUpperCase()
            }, {
                format:format.toLowerCase()
            }
            ]
    })
        .exec(function (err, data) {
            if (err) 
                throw err;
            res.json(data);
        })
}