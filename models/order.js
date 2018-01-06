var  mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var OrderSchema = new mongoose.Schema({

Title:String,
Price :String,
Image:String,
Size:String,
AreaPinCode:String,
ShippingAddress:String,
UserFullName:String,
UserPhoneNo:String,
OrderPlacedOn:{type:Date,default:Date.now},
Delivered:{type:Boolean,default:false},
BuyedByTheUser:String,


});





module.exports = mongoose.model("Order",OrderSchema);