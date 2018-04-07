
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var MatchResultSchema = new Schema({
    match: {
        type: Schema.Types.ObjectId,
        ref: 'Match',
        index: true
 
    },
    teamBid:{
        type: Schema.Types.ObjectId,
        ref: 'Team',
        index: true
    },
    playerBid:{
        type: Schema.Types.ObjectId,
        ref: 'Player',
        index: true
    },
    isPublished:{
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now,
        index: true
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

MatchResultSchema.method({});

/**
 * Statics
 */

MatchResultSchema.static({});

/**
 * Register
 */

mongoose.model('MatchResult', MatchResultSchema);