var express	=	require("express");
var router	=	express.Router();
var	Campground	=	require("../models/campgrounds");
var Comment	=	require("../models/comment.js");
var middleware	=	 require("../middleware")



//new route
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground:campground});
		}
	});
});


//create route
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		}
		else{
			Comment.create(req.body.comments,function(err,comment){
				if(err){
					console.log(err);
				}	
				else{
					comment.author.id	=req.user._id;
					comment.author.username	=	req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash('success','Successfully added comment');
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
});


//Edit route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}	
		else{
			res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
		}
	});	
});

//update route
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/campgrounds"); //change it to redirect to "/campgrounds/"+req.params.id
		}
	});
	//res.send("You are going to the right place");
});

//Destroy Route
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err)
			res.redirect("back");
		else{
			req.flash('success','Comment Deleted');
			res.redirect("/campgrounds/"); //change it to redirect to "/campgrounds/"+req.params.id
		}
	});
});

// //middleware

// function checkCommentOwnership(req,res,next){
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id,function(err,foundComment){
// 			if(err){
// 				res.redirect("back");
// 			}
// 			else{
// 				if(foundComment.author.id.equals(req.user._id)){
// 					next();
// 				}
// 				else{
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	}
// }

// function isLoggeIn(req,res,next){
// 	if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login")
// }



module.exports	=	router;