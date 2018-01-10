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












router.get('/buy/:id',isLoggedIn,function(req,res){
  
  Product.findById(req.params.id,function(err,product){
    if (err) {
      console.log(err);
    } else {
      
  
      
       res.render('show',{product:product});
    }
  })
});


router.post('/AddToCart/:id',isLoggedIn,function(req,res){ 
 User.findById(req.user._id,function(err,user){
    if (err) {
      console.log(err);
    } else {
      
      Product.findById(req.params.id,function(req,product){
        if (err) {
          console.log(err);
        } else {
          
            var OrderInfo = {
              id:product._id,
              ProductImage:product.ImageMain,
              Title:product.Title,
              Price:product.Price
            }
          
          user.ProductInCart.push(OrderInfo);
          user.save();
          res.redirect("back");
            
        }
         
      })
      
      
    }
  })
});



router.get('/cart',isLoggedIn,function(req,res){
  
  User.findById(req.user._id,function(err,user){
    if (err) {
      console.log(err);
    } else {
      
var priceListArray = user.ProductInCart.map(function(order){
  return order.Price;
});
      
var TotalAmountOfCart = priceListArray.reduce(function(a, b) { return a + b; }, 0);
        res.render('cart',{user:user,TotalAmountOfCart:TotalAmountOfCart});
    }
  })
});


router.delete('/cart/remove/:ordername/:id',isLoggedIn,function(req,res){
  
 var ProductId = req.params.id;
 var OrderName = req.params.ordername; 
  
  
User.update({_id:req.user._id})  
  
  
  
  
// User.findById(req.user._id,function(err,user){
// if (err) {
// throw err;
// } else {  
//  if (user.ProductInCart && user.ProductInCart[OrderName]) {
//    user.ProductInCart[OrderName].splice(ProductId,1);
//    user.save();
// }
//   res.redirect("back");
// }
// })       
})


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
          var ProductID = product._id;
          var AreaPincode = req.body.AreaPincode;
          var ShippingAddress = req.body.ShippingAddress;
          var UserFullName = req.body.UserFullName;
          var UserPhoneNo = req.body.UserPhoneNo;
          var BuyedByTheUser = req.user.username;
          var Quantity = req.body.Quantity;
          
    
          var newOrder = {
            Title:Title,
            Price:Price,
            Image:Image,
            Quantity:Quantity,
            ProductID:ProductID,
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
              Quantity:createdOrder.Quantity
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


router.get('/order/:id',function(req,res){
  Order.findById(req.params.id,function(err,order){
    if (err) {
      console.log(err);
    } else {
      res.render('order',{order:order});
    }
  })
  
  
});



router.delete('/order/cancel/:id',function(req,res){
  Order.findByIdAndRemove(req.params.id,function(err,DeletedOrder){
    if (err) {
      console.log(err);
    } else {
      res.redirect("back");
    }
  })
  
  
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