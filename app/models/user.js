// user.js
// SnagIt

// CALL PACKAGES
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");

// user schema
var UserSchema = new Schema({
	firstName: { type: String, required: true },
	 lastName: { type: String, required: true },
	 username: { type: String, required: true, index: { unique: true } },
	    email: { type: String, required: true, index: { unique: true } },
	 password: { type: String, required: true, select: false }
}, {
	timestamps: true
});

//hash password before user is saved
UserSchema.pre("save", function(next) {
	var user = this;
	
	//hash password only if password has been changed or user is new
	if (!user.isModified("password"))
		return next();
	
	//generate hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err)
			return next(err);
		
		//change password to hashed version
		user.password = hash;
		next();
	})
})

//method to compare given password with database hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
};

//return model
module.exports = mongoose.model("User", UserSchema);