var express	=	require("express");
var router	=	express.Router();
var	Campground	=	require("../models/campgrounds");
var middleware	= 	require("../middleware"); //no need to put index.js coz its asusumed to be default

//INDEX -- DISPLAY ALL CAMPGROUNDS
router.get('/campgrounds',function(req,res){  //each campground has a name and image for now
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	});	
	
});


//CREATE -- DISPLAY A FORM TO ENTER CAMPGROUNDS
router.post('/campgrounds',middleware.isLoggedIn, function(req,res){	
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var desc=req.body.description;
	//add to compound array
	var author	={
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name:name,image:image,description:desc,author:author};
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			res.redirect('/campgrounds')
		}
	});
});

//NEW -- ADD NEW CAMPGROUND
router.get('/campgrounds/new', middleware.isLoggedIn, (req,res)=>{
	res.render('campgrounds/new');
});

//SHOW--shows more info about the campground
router.get('/campgrounds/:id', (req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}
		else{
			// console.log(foundCampground);
			res.render("campgrounds/show",{campground: foundCampground, currentUser:req.user});
		}	
	});
});


//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit",{campground:foundCampground});
	});	
});
//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updateCampground){
		if(err)
			res.redirect("/campgrounds");
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//Destroy route
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/campgrounds");
		else{
			res.redirect("/campgrounds");
		}
	});
});


// //middleware
// function isLoggeIn(req,res,next){
// 	if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login")
// }

// //middleware
// function checkCampgroundOwnership(req,res,next){
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id,function(err,foundCampground){
// 			if(err){
// 				res.redirect("back");
// 			}
// 			else{
// 				if(foundCampground.author.id.equals(req.user._id)){
// 					next();
// 				}
// 				else{
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	}
// }



module.exports	=	router;
