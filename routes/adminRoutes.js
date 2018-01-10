var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Product = require('../models/product');
var Order = require('../models/order');
var flash = require('connect-flash');



router.get('/AdminPortal',function(req,res){
  if (req.user.username.toString() === "Admin" ) {
      res.render('adminPage');
  } else {
    res.render("login")
  }
});


router.get('/addProduct',function(req,res){
  res.render('AddProduct');
});


router.get('/orders',function(req,res){
    Order.find({},function(err,orders){
    if (err) {
      console.log(err);
    } else {
      res.render('orders',{orders:orders});
    }
  }) 
});



router.post('/addProduct',isLoggedIn,function(req,res){
 
  var Title = req.body.Title;
  var Price = req.body.Price;
  var Description = req.body.Description;
  var ImageMain = req.body.ImageMain;
  var SideImage = req.body.SideImage;
  var BackImage = req.body.BackImage;

  
  
  var newProduct = {
    Title:Title,
    Price:Price,
    Description:Description,
    ImageMain:ImageMain,
    SideImage:SideImage,
    BackImage:BackImage
  }
  
  
  Product.create(newProduct,function(err,createdProduct){
    if (err) {
      console.log(err);
    } else {
      
   Product.find({},function(err,products){
    if (err) {
      console.log(err);
    } else {
      res.render('index',{products:products});
    }
  })
    }
  })
});










////////////////// #### Middleware ##### for checking if user is logged in or not//////////////////////////////////////
function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error","You must be logged in to do that");
    res.redirect('/login');
  }
}







 module.exports = router; 