const mongoose = require('mongoose');
const Match = mongoose.model('Match');
const _ = require('lodash');

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
        .populate('teamA', {teamName: true, url: true})
        .populate('teamB', {teamName: true, url: true})
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
            url: true
        })
        .populate('teamB', {
            teamName: true,
            url: true
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

    matchQuery
        .populate('teamA', {teamName: true})
        .populate('teamB', {teamName: true})
        .populate('series', {name: true})
        .exec(function (err, matches) {
            const mathes = _.groupBy(matches, 'series.name')
            res.json(mathes);
        });
}
