
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var UserBidsSchema = new Schema({
    match: {
        type: Schema.Types.ObjectId,
        ref: 'Match',
        index: true
 
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    teamBid:{
        team:{
                type: Schema.Types.ObjectId,
                ref: 'Team',
                index: true
        },
        point:{
            type: Number,
            default:0
        },
        winPoint:{
            type: Number,
            default:0
        },
        result:{
            type: String,
            enum:['WIN','LOSS', 'NA'],
            default:'NA'
        }
    },
    playerBid:{
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
            point:{
                type: Number,
                default: 0
            },
            winPoint:{
                type: Number,
                default:0
            },
            result:{
                type: String,
                enum:['WIN','LOSS', 'NA'],
                default:'NA'
            }
        }]
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

UserBidsSchema.method({});

/**
 * Statics
 */

UserBidsSchema.static({});

/**
 * Register
 */

mongoose.model('UserBids', UserBidsSchema);