var  mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({




username:String,
password :String,
DefaultAddress:String,

Orders:[{
id:{
type : mongoose.Schema.Types.ObjectId,
ref : "Order"
},
ProductImage:String,
OrderName:String,
PlacedOn:Date,
Price:String
}],


ProductInCart:[{
id:{
type : mongoose.Schema.Types.ObjectId,
ref : "Product"
},
Title: String,
}]   
});



UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);