var express               = require("express"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    passport              = require("passport"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    seedDB                = require("./seeds");


//requiring routes
var commentRoutes         = require("./routes/comments"),
    campgroundRoutes      = require("./routes/campgrounds"),
   indexRoutes           = require("./routes/index");


mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost/yelp_camp_v13" ,{ useNewUrlParser: true });
mongoose.connect("mongodb://localhost/yelp_camp_v13" ,{ useFindAndModify: false});

var app = express();
app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: true}));

// seedDB();//seed the database

app.locals.moment = require('moment');

//PASSPORT CONFIGURATION

app.use(require("express-session")({
    
    secret: "Lincoln is the best",
    resave: false,
    saveUninitialized: false
    
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use(function(req , res ,next){
    
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);



  
app.listen(process.env.PORT,process.env.IP,function(){
    
    console.log("YelpCamp Server has started"); 
});