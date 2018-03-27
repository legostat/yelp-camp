var express  = require('express'),
    app      = express(),
    mongoose = require('mongoose'),
    flash    = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    bodyParser = require('body-parser'),
    Campground = require('./models/campground'),
    Comment    = require('./models/comment'),
    User       = require('./models/user'),
    seedDB = require('./seeds');

var camgroundRoutes = require('./routes/campgrounds'),
    commentsRoutes  = require('./routes/comments'),
    indexRoutes     = require('./routes/index');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/yelp_camp_v14', { useMongoClient: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(flash());

// seedDB(); //seed databse

//PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.locals.moment = require('moment');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', camgroundRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
  console.log('The YelpCamp Server has started!');
});    