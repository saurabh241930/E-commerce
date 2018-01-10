var  mongoose = require('mongoose');


var ProductSchema = new mongoose.Schema({

Title:String,
Price :Number,
ImageMain:String,
SideImage:String,
BackImage:String,
Description:String,
Rating:String,
  
Reviews:[{
id:{
type : mongoose.Schema.Types.ObjectId,
ref : "User"
},
Review:String,
username: String,
}]   


});



module.exports = mongoose.model("Product",ProductSchema);