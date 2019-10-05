var express	=	require("express");
var app	=	express();
var bodyParser	=	require("body-parser");
var mongoose	=	require("mongoose");
var	Campground	=	require("./models/campgrounds.js");
var Comment	=	require("./models/comment.js")
var	SeedDb	=	require("./seeds.js");
var passport =	require("passport"),
	LocalStrategy =          require("passport-local"),
    passportLocalMongoose =  require("passport-local-mongoose"),
	methodOverride	=	require("method-override"),
	User =                   require("./models/user.js"),
	flash	= require("connect-flash");
var campgroundRoute	= require("./routes/campgrounds");
var commentRoute	=	require("./routes/comments");
var indexRoute	=	require("./routes/index");
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended:true}));
//SeedDb(); //seeds the database 
mongoose.connect('mongodb://localhost/Yelp_Camp_v12', {useNewUrlParser: true});


app.set("view engine", "ejs");
app.use(express.static(__dirname+'/public'));
app.use(methodOverride('_method'));


//Passport Configuration
app.use(require("express-session")({
	secret: "You fell for it fool, thunder cross split attack",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//it will pass currentUser to every single object\
//its positions is important

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error=req.flash('error');
	res.locals.success	=	req.flash('success');
	next();
	
});


app.use(campgroundRoute);
app.use(commentRoute);
app.use(indexRoute);

app.use("/campgrounds/:id/comments",commentRoute);



function isLoggeIn(req,res,next){
	if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}
//===========



app.listen(3000,()=>{
	console.log("YelpCamp Server has started");
});


//-----------------



//Testing connect-flash
// var express = require('express');
// var session = require('express-session');
// var cookieParser = require('cookie-parser');
// var flash = require('connect-flash');
// var app = express();

// app.use(cookieParser('secret'));
// app.use(session({cookie: { maxAge: 60000 }}));
// app.use(flash());

// app.all('/', function(req, res){
//   req.flash('test', 'it worked');
//   res.redirect('/test')
// });

// app.all('/test', function(req, res){
//   res.send(JSON.stringify(req.flash('test')));
// });

// app.listen(3000);

// module.exports = app;

