/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var userPlugin = require('mongoose-user');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var UserAccountSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    totalPoints: {
        type: Number,
        default: 1000
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN']
    }
});

/**
 * User plugin
 */

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

UserAccountSchema.method({});

/**
 * Statics
 */

UserAccountSchema.static({});

/**
 * Register
 */

mongoose.model('UserAccount', UserAccountSchema);
