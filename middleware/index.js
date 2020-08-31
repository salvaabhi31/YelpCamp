var Campground = require("../models/campground");
var Comment = require("../models/comment");


//all middleware goes here


var middlewareObj={};

middlewareObj.checkCampgroundOwnership=function(req,res,next)
    {
     if(req.isAuthenticated())
       {  
          
          Campground.findById(req.params.id, function(err, foundCampground){
               if(err || !foundCampground)
              {
                 req.flash("error","Campground Not Found.");
                res.redirect("back");
              }
               else
              {
                   //check if he ownns the campground
                    if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin)
                    {
                      next();
                    }
                    else
                    {  
                     req.flash("error","You don't have permission to do that.");    
                      // if not redirect
                     res.redirect("back");
                    }
               }
            });
         }
         else
         {
             req.flash("error","You Need to be Logged-In to do that.");
             res.redirect("back");
         }
   };
   
   
   middlewareObj.checkCommentOwnership=function(req,res,next){
        if(req.isAuthenticated())
       {  
          
          Comment.findById(req.params.comment_id, function(err, foundComment){
               if(err || !foundComment)
              {
                req.flash("error","Comment Not Found.");
                res.redirect("back");
              }
               else
              {
                   //check if he ownns the comment
                     if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin)
                    {
                      next();
                    }
                    else
                    {  
                      req.flash("error","You don't have permission to do that.");
                      // if not redirect
                     res.redirect("back");
                    }
               }
            });
         }
         else
         {
             req.flash("error","You Need to be Logged-In to do that.");
             res.redirect("back");
         }
   }
   
  middlewareObj.isLoggedIn= function(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You Need to be Logged-In to do that.");
    res.redirect("/login");
}
   
   
    


module.exports=middlewareObj;