
/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var userPlugin = require('mongoose-user');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

/**
 * User schema
 */

var UserSchema = new Schema({
  local:{
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    mobile:{
      type: String
    }
  }
});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

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

UserSchema.method({

});

/**
 * Statics
 */

UserSchema.static({

});

/**
 * Register
 */

mongoose.model('User', UserSchema);
