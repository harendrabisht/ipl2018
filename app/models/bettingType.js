/*
 * Module dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var BettingTypeSchema = new Schema({

    name: {
        type: String,
        default: ''
    },
    series:{
        type: Schema.Types.ObjectId,
        ref: 'Series',
        index: true
    },
    associted:{
        type: String,
        enum:['TEAM', 'PLAYER']
    }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

BettingTypeSchema.method({});

/**
 * Statics
 */

BettingTypeSchema.static({});

/**
 * Register
 */

mongoose.model('BettingType', BettingTypeSchema);