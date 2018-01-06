var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Product = require('../models/product');
var Order = require('../models/order');
var flash = require('connect-flash');




router.get('/',function(req,res){
  
  Product.find({},function(err,products){
    if (err) {
      console.log(err);
    } else {
      res.render('index',{products:products});
    }
  })
  
  
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


router.post('/addProduct',function(req,res){
 
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




router.get('/buy/:id',function(req,res){
  
  Product.findById(req.params.id,function(err,product){
    if (err) {
      console.log(err);
    } else {
       res.render('show',{product:product});
    }
  })
});






router.post('/buy/:id/order',isLoggedIn,function(req,res){
  
  Product.findById(req.params.id,function(err,product){
    if (err) {
      console.log(err);
    } else {
       
      User.findById(req.user._id,function(err,user){
        if (err) {
          console.log(err);
        } else {
          
          
          var Title = product.Title;
          var Price = product.Price;
          var Image = product.ImageMain;
          var AreaPincode = req.body.AreaPincode;
          var ShippingAddress = req.body.ShippingAddress;
          var UserFullName = req.body.UserFullName;
          var UserPhoneNo = req.body.UserPhoneNo;
          var BuyedByTheUser = req.user.username;
          
    
          var newOrder = {
            Title:Title,
            Price:Price,
            Image:Image,
            AreaPincode:AreaPincode,
            ShippingAddress:ShippingAddress,
            UserFullName:UserFullName,
            UserPhoneNo:UserPhoneNo,
            BuyedByTheUser:BuyedByTheUser
          }
          
        
    Order.create(newOrder,function(err,createdOrder){
      if (err) {
        console.log(err);
      } else {
        
        User.findById(req.user._id,function(err,user){
          if (err) {
            console.log(err);
          } else {
            
            var OrderInfo = {
              id:createdOrder._id,
              OrderName:createdOrder.Title,
              ProductImage:createdOrder.Image,
              PlacedOn:createdOrder.OrderPlacedOn,
              Price:createdOrder.Price,
            }
            
            user.Orders.push(OrderInfo);
            user.save();
            
        Product.find({},function(err,products){
    if (err) {
      console.log(err);
    } else {
      res.render('index',{products:products});
    }
  })       
          }
        })
      }
    })       
        }
      })
      
    }
  }) 
});



//////////////////MY ORDERS////////////
router.get('/myOrders',function(req,res){
  
  User.findById(req.user._id,function(err,user){
    if (err) {
      console.log(err);
    } else {
        res.render('myOrders',{user:user});
    }
  })
  
  
  

});

//////////////////MY ORDERS////////////









router.get('/AdminPortal',function(req,res){
  if (req.user.username.toString() === "Admin" ) {
      res.render('adminPage');
  } else {
    res.render("login")
  }
});






//////////////////////////////////////////AUTH ROUTES////////////////////////////////////////
//register
router.get('/register',function(req,res){
  res.render('register');
});

//Sign Up logic
router.post('/register',function(req,res){
var newUser = new User ({username: req.body.username});
var firstName = req.body.firstName;
var lastName = req.body.lastName;

User.register(newUser,req.body.password,function(err,user){
if (err) {
console.log(err);
return res.render('register');
} else {
passport.authenticate("local")(req,res,function(){
res.redirect('/');
})
}

})

});


/////////////////////Login route///////////////////////////
router.get('/login',function(req,res){
res.render('login');
});

//login logic
// app.post('/login',middleware,callback)
router.post('/login',passport.authenticate("local",
{successRedirect: "/",
failureRedirect: "/login"
}),function(req,res){

});


router.get('/logout',function(req,res){
req.logout();
res.redirect('/');
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