
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var MatchSchema = new Schema({

    venue: {
        type: String,
        default: ''
    },
    teamA: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        index: true
    },
    teamB: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        index: true
 
    },
    format:{
        type: String,
        default:'IPL'
    },
    series:{
        type: Schema.Types.ObjectId,
        ref: 'Series',
        index: true
    },
    status:{
        type: Boolean,
        default: false
    },
    date: {
        type: Date
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

MatchSchema.method({});

/**
 * Statics
 */

MatchSchema.static({});

/**
 * Register
 */

mongoose.model('Match', MatchSchema);