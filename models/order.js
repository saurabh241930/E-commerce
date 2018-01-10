var  mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var OrderSchema = new mongoose.Schema({

Title:String,
Price :Number,
Image:String,
Quantity:{type:Number,default:1},
Category:String,
ProductID:{id:{
type : mongoose.Schema.Types.ObjectId,
ref : "Product"}},
Size:String,
AreaPincode:Number,
ShippingAddress:String,
UserFullName:String,
UserPhoneNo:String,
OrderPlacedOn:{type:Date,default:Date.now},
Delivered:{type:Boolean,default:false},
BuyedByTheUser:String
});





module.exports = mongoose.model("Order",OrderSchema);