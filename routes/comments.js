var express=require("express");
var router=express.Router({mergeParams: true});
var middleware= require("../middleware");

var Campground = require("../models/campground");
var Comment = require("../models/comment");
 //================
   //COMMENTS ROUTES
   //================
   
   //Commentsnew

router.get("/new", middleware.isLoggedIn,function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err)
        {
            console.log(err);
            
        }
        else
        {
            res.render("comments/new",{campground: campground});
        }
        
    });
     
});


//CommentsCreate
router.post("/",middleware.isLoggedIn,function(req,res){
    //look up campground by id
     Campground.findById(req.params.id,function(err,campground){
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
            
        }
        else
        {
            //create a new comment
            Comment.create(req.body.comment,function(err,comment){
              if(err)
              {    
                   req.flash("error","Something Went Wrong");
                   console.log(err);
              }
              else
              {   
                  //add username and id to comment
                  comment.author.id= req.user._id;
                  comment.author.username=req.user.username;
                  // save comments
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                   req.flash("success","Successfully Added Comment");
                  res.redirect("/campgrounds/" + campground._id);
              }
                
            });
            //connect new comment to campground
            //redirect campground show page
           
        }
        
    });
});
    
    //Comment_Edit
    router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
        
        Campground.findById(req.params.id,function(err, foundCampground) {
            if(err || !foundCampground)
            {
                req.flash("error","No Campground Found");
                return res.redirect("back");
            }
            else
            {
                Comment.findById(req.params.comment_id,function(err, foundComment) {
                 if(err)
                 {
                  res.redirect("back");    
                 }
                 else
                {
                res.render("comments/edit",{campground_id: req.params.id,comment: foundComment});
               
               }
               });
                
            }
        });
        
       
    });
       

   //comment_Update
   router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
          if(err)
          {
              res.redirect("back");
          }
          else
          {
              //redirect somewhere
              res.redirect("/campgrounds/" + req.params.id);
          }
      });
      
   });
   
   //DELETEROUTE
     router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
      //destroy blog
       Comment.findByIdAndRemove(req.params.comment_id,function(err){
              if(err)
           {
              console.log(err);
              res.redirect("back");
           }
        else
            {
              req.flash("success","Comment deleted");
              //redirect somewhere
              res.redirect("/campgrounds/" + req.params.id);
            }
       });
  });
   
    
   module.exports=router;