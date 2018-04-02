const mongoose = require('mongoose');
const BettingType = mongoose.model('BettingType')
exports.create = function(req, res){
    var bettingType = new BettingType(req.body);
    bettingType.save(function(err, data){
        if(err) throw err;
        res.json(data);
    });
};
exports.getList = function(req, res){
    let bettingQuery = BettingType.find();
    if(req.query.seriesid){
        bettingQuery = bettingQuery.where({series:{$in: req.query.seriesid}});
    }
    bettingQuery
    .populate('series')
    
    .exec(function(err, data){
        if(err) throw err;
        res.json(data);
    });
};
exports.getListById = function(req, res){
    res.json(req.match);
};
exports.updateListById = function(req, res){
    BettingType.find({},function(err, data){
        if(err) throw err;
        res.json(data);
    });
};
exports.deleteById = function(req, res){
    BettingType.find({},function(err, data){
        if(err) throw err;
        res.json(data);
    });
};

exports.BettingTypeById = function(req, res, next, id){
    BettingType.findById(id, function(err, doc){
        if(err) throw err;
        req.series = doc;
        next();
    });
}