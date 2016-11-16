// transaction.js
// SnagIt

// CALL PACKAGES
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// transaction schema
var TransactionSchema = new Schema({
	buy_user_id : {type : String, required : true},
	sell_user_id : {type : String, required : true},
	book_id: {type : String, required : true}
}, {
	timestamps: true
});

// return model
module.exports = mongoose.model("Transaction", TransactionSchema);