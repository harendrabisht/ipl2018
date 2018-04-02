/*!
 * Module dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var PlayerSchema = new Schema({
  code: {
    type: String,
    default: ''
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName:{
    type: String,
    default: ''
  },
  country:{
    type: String,
    default: ''
  },
  type:{
    type: String,
    default:''
  },
  url:{
    type: String,
    default: ''
  },
  team: {
    type:[{
      type: Schema.Types.ObjectId,
      ref: 'Team',
      index: true
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

PlayerSchema.method({});

/**
 * Statics
 */

PlayerSchema.static({});

/**
 * Register
 */

mongoose.model('Player', PlayerSchema);