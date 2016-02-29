var crypto = require('crypto');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Password hash must be private, we cannot send that information back to the client.
var UserSchema = Schema({
	username: { type: String, unique: true, required: true, dropDups: true },
	email: { type: String, unique: true, required: true, dropDups: true },
	passwordHash: String,
	joinedAt: { type: Date, default: Date.now }
});

UserSchema.methods.validatePasswordHash = function(password) {
	return (password === this.passwordHash);
};

UserSchema.methods.hashPassword = function(password) {
	var hash = crypto.createHash('sha256');
	hash.write(password);
	return hash.digest('hex');
};

UserSchema.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj.passwordHash;
	return obj;
};

module.exports = mongoose.model('User', UserSchema);
