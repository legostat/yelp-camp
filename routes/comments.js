var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

//Comments New
router.get('/new', middleware.isLoggedIn, function(req, res) {
  //find campground by id
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      req.flash('error', err);
      res.redirect('back');
    } else {
      res.render('comments/new', {campground: foundCampground}); 
    }
  });
});

//Comments Create
router.post('/', middleware.isLoggedIn, function(req, res){
  //lookup campground using ID
  Campground.findById(req.params.id, function(err, foundCampground) {
    if(err){
      req.flash('error', 'Something went wrong');
      res.redirect('/camgrounds');
    } else {
      //create new coment
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash('error', 'Something went wrong');
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          //connect new comment to campground
          foundCampground.comments.push(comment);
          foundCampground.save();
          //redirect to campground show page
          req.flash('success', 'Successfully added comment');
          res.redirect('/campgrounds/' + foundCampground._id);
        }
      });
    }
  });
});


//EDIT FORM
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if(err){
      res.redirect('back');
    } else {
      res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
    }
  });
  
});

//UPDATE COMMENT ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

//DESTROY COMMENT ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err) {
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted');
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});


module.exports = router;