var express=require("express");
var router=express.Router();
var middleware= require("../middleware");


var Campground = require("../models/campground");
var Comment = require("../models/comment");
// INDEX show campgrounds!
router.get("/",function(req,res){
    
    //get all campgrounds from db
     Campground.find({},function(err,allCampgrounds){
     
     var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  noMatch = "No campgrounds match that query, please try again.";
              }
              res.render("campground/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              res.render("campground/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    }
    
    
});
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


//CREATE -add new campground
router.post("/",middleware.isLoggedIn,function(req,res){
    //get data from form and add to campgrounds array
    var name=req.body.name;
    var image=req.body.image;
    var price=req.body.price;
    var desc=req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username
    }
    var newCampground={ name: name, image: image, description: desc,author: author,price:price}
    //create a new campground and save to database
    Campground.create(newCampground,function(err,newlyCreated){
        
        if(err)
        {
             console.log(err);
        }
        else
        {
              //to redirect back to campgrounds page
              res.redirect("/campgrounds");
        }
        
    });
   
    
    
});


// NEW-Show form to create campgrouds
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campground/new");
    
});

//SHOW-shows more information about campground
// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campground/show", {campground: foundCampground});
        }
    });
});
   
   
   //EDIT CAMPGROUND
   router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
     Campground.findById(req.params.id,function(err, foundCampground){
        if(err)
        {
          req.flash("error","Campground Not found");
        }
        else
         {
        res.render("campground/edit",{campground: foundCampground}); 
        }
       
   });
   });
       
  
   //UPDATE CAMPGROUND
   router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
      //find and update the campground 
      
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
          if(err)
          {
              res.redirect("/campgrounds");
          }
          else
          {
              //redirect somewhere
              res.redirect("/campgrounds/" + req.params.id);
          }
      });
      
      
   });
  
  //DESTROY CAMPGRPUND ROUTE
  // DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
      //destroy blog
       Campground.findByIdAndRemove(req.params.id,function(err){
              if(err)
           {
              console.log(err);
              res.redirect("/campgrounds");
           }
        else
            {
              //redirect somewhere
              res.redirect("/campgrounds");
            }
       });
  });
   

   module.exports=router;
   