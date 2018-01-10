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
Price:Number,
Quantity:{type:Number,default:0},
}],


ProductInCart:[{
id:{
type : mongoose.Schema.Types.ObjectId,
ref : "Product"
},
ProductImage:String,
Title: String,
Price:Number
}]
  
  
  
  
});



UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);