// book.js
// SnagIt

// CALL PACKAGES
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// book schema
var BookSchema = new Schema({
	title: {type : String, required : true},
	author: {type : String, required : true},
	user_id : {type : String, required : true},
	for_sale: {type : Boolean, required : true}
	selling_price : {type : Number, required : true}
}, {
	timestamps: true
});

// return model
module.exports = mongoose.model("Book", BookSchema);
