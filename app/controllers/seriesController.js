const mongoose = require('mongoose');
const Series = mongoose.model('Series')
exports.create = function(req, res){
    var series = new Series(req.body);
    series.save(function(err, data){
        if(err) throw err;
        res.json(data);
    });
};
exports.getList = function(req, res){
    Series
        .find({})
        .populate('teams')
        .exec(function(err, data){
        if(err) throw err;
        res.json(data);
    });
};
exports.getListById = function(req, res){
    res.json(req.match);
};
exports.updateListById = function(req, res){
    Series.find({},function(err, data){
        if(err) throw err;
        res.json(data);
    });
};
exports.deleteById = function(req, res){
    Series.find({},function(err, data){
        if(err) throw err;
        res.json(data);
    });
};

exports.SeriesById = function(req, res, next, id){
    Series.findById(id, function(err, doc){
        if(err) throw err;
        req.series = doc;
        next();
    });
}