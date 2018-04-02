/*
 * Module dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var SeriesSchema = new Schema({

    name: {
        type: String,
        default: ''
    },
    format: {
        type: String,
        default: ''
    },
    teams: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Team',
                index: true
            }
        ]
    },
    url:{
        type: String,
        default: ''
    },
    host:{
        type:String
    },
    startDate: {
        type: Date
    },
    endDate: {
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

SeriesSchema.method({});

/**
 * Statics
 */

SeriesSchema.static({});

/**
 * Register
 */

mongoose.model('Series', SeriesSchema);