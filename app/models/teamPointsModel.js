
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var TeamPointsSchemas = new Schema({
    match: {
        type: Schema.Types.ObjectId,
        ref: 'Match',
        index: true
 
    },
    points:{
        type:[{
            team:{
                type: Schema.Types.ObjectId,
                ref: 'Team',
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

TeamPointsSchemas.method({});

/**
 * Statics
 */

TeamPointsSchemas.static({});

/**
 * Register
 */

mongoose.model('TeamPoints', TeamPointsSchemas);