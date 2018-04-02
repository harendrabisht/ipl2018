/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var TeamSchema = new Schema({
  code: {
    type: String,
    default: ''
  },
  teamName: {
    type: String,
    default: ''
  },
  game: {
    type: String,
    default: ''
  },
  format: {
    type: String,
    default: ''
  },
  url:{
    type: String,
    default: ''
  },
  flag: {
    tyep: String,
    defalut: ''
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

TeamSchema.method({});

/**
 * Statics
 */

TeamSchema.static({});

/**
 * Register
 */

mongoose.model('Team', TeamSchema);