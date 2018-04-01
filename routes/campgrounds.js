var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');
var geocoder = require('geocoder');

//INDEX ALL CAMPGOUNDS
router.get('/', function(req, res){
  //get all campgrounds from DB
  Campground.find({},'-__v',function(err, allCampgrounds){
    if(err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds, page: 'campgrounds'});
    }
  });
});

//NEW FORM
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

//ADD NEW
router.post('/', middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  geocoder.geocode(req.body.location, function(err, data){
    if(err) {
      req.flash('error', err);
      res.redirect('/campgrounds');
    }
    var lat;
    var lng;
    var location;
    try {
      lat = data.results[0].geometry.location.lat;
      lng = data.results[0].geometry.location.lng;
      location = data.results[0].formatted_address;
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back");
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
    Campground.create(newCampground, function(err, newlyCreated){
       if(err) {
        res.redirect('/campgrounds');
      } else {
        res.redirect('/campgrounds');
      }
    });
  });
});

//SHOW CAMPGROUND
router.get('/:id', function(req, res) {
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err) {
      req.flash('error', 'Campground not found');
      res.redirect('/campgrounds');
    } else {
      // console.log(foundCampground);
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

//EDIT CAMPGROUNG
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      req.flash('error', 'Campground not found');
      res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground: foundCampground});
  });     
});

//UPDATE CAMPGROUND
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function(err, data){
    if(err) {
      req.flash('error', err);
      res.redirect('back');
    }
    // console.log(data.results[0]);
    // if(data.results[0] === undefined) {
    //   req.flash("error", 'Something went wrong.');
    //   res.redirect("back");
    // }
    var lat;
    var lng;
    var location;
    try {
      lat = data.results[0].geometry.location.lat;
      lng = data.results[0].geometry.location.lng;
      location = data.results[0].formatted_address;
    } catch (error) {
      req.flash("error", err.message);
      res.redirect("back");
    }
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.price, location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
});

//DESTROY CAMPGROUND
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      req.flash('error', 'Campground not found');
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds');
    }
  });
});


module.exports = router;