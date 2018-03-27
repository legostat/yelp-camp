var mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require("./models/comment");
    
var data = [
  {
    name: "Cloud's Rest",
    image: "https://farm4.staticflickr.com/3282/2770447094_2c64348643.jpg",  
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Desert Mesa",
    image: "https://farm5.staticflickr.com/4090/5191494570_72f9f20379.jpg",  
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Canyon Floor",
    image: "https://farm4.staticflickr.com/3129/2614431976_71ac060c3f.jpg",  
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
];    

function seedDB(){
  // Remove all campgrounds
  Campground.remove({}, function(err){
    if(err){
      console.log(err);
    } else {
      console.log('Removed campgrounds!');
      Comment.remove({}, function(err){
        if(err){
          console.log(err);
        } else {
          console.log('Removed comments!');
          // Add a few campgrounds
          data.forEach(function(seed){
             Campground.create(seed, function(err, campground){
              if(err){
                console.log(err);
              } else {
                console.log('added a campground!')
                // create a comment
                Comment.create({
                  text: "This place is great, but I wish there was internet",
                  author: "Homer"
                }, function (err, comment) {
                  if(err) {
                    console.log(err);
                  } else {
                    campground.comments.push(comment);
                    campground.save();
                    console.log("Created new comment");
                  }
                });
              }
             });
          });
        }
      });
    }
  });
}    

module.exports = seedDB; 