
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var PlayerPointsSchemas = new Schema({
    match: {
        type: Schema.Types.ObjectId,
        ref: 'Match',
        index: true
 
    },
    points:{
        type:[{
            player:{
                type: Schema.Types.ObjectId,
                ref: 'Player',
                index: true
            },
            bettingType:{
                type: Schema.Types.ObjectId,
                ref: 'BettingType',
                index: true
            },
            multiplier:{
                type: Number,
                default: 1
            }
        }]
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

PlayerPointsSchemas.method({});

/**
 * Statics
 */

PlayerPointsSchemas.static({});

/**
 * Register
 */

mongoose.model('PlayerPoints', PlayerPointsSchemas);