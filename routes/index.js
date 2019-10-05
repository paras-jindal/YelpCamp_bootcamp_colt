var express	=	require("express");
var router	=	express.Router();
var passport	=	require("passport");
var User =      require("../models/user.js");

//home route
router.get('/',function(req,res){
	res.render('landing');
});


//show registeration route
router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
	let newUser= new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error',err.message);
            res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
        
    });
});

//show login form
router.get("/login",function(req,res){
	
	res.render("login");
});

router.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(req,res){
})

//Logout route
router.get("/logout",function(req,res){
	req.logout();
	req.flash('success','Logged you out');
    res.redirect("/campgrounds")
});

// function isLoggeIn(req,res,next){
// 	if(req.isAuthenticated()){
//         return next();
//     }
// 	req.flash('error','Please login first');
//     res.redirect("/login");
// }

module.exports	=	router;