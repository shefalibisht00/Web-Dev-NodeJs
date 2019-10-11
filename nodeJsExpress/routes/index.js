var express = require('express');
var models = require('../models/index');
var router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../config/auth');
const passport = require('passport');

/* GET home page. */
// Welcome Page
router.get('/', checkNotAuthenticated, function (req, res, next) {
  res.render('index', { user: req.user });
});
router.get('/index', checkNotAuthenticated, function (req, res, next) {
  res.redirect('/');
});

// Dashboard
router.get('/dashboard', checkAuthenticated, (req, res) => {
  models.MusicBands.findAll({ where: { userId: req.user.id } })
    .then(MusicBands => {
      res.render('dashboard',
        {
          user: req.user,
          MusicBands: MusicBands
        }
      );
    });
});

// Create MusicBands
router.get('/createBands', checkAuthenticated, function (req, res) {
  res.render('createBands', { user: req.user, error: req.flash('error')[0] });
});

router.post('/createBands', checkAuthenticated, function (req, res) {
  var data = {
    name: req.body.name,
    genre: req.body.genre,
    userId: req.user.id
  };
  if (!data.name || !data.genre) {
    return res.render('createBands', { user: req.user, error: 'All fields required.' });
  }

  if (!isNaN(data.genre)) {
    return res.render('createBands', { user: req.user, error: 'Genre should not be numeric.' });
  }
  models.MusicBands.findOne({
    where: { name: data.name }
  })
    .then((band) => {
      if (band) return res.render('createBands', { user: req.user, error: 'Music band already entered' });
      models.MusicBands.create(data);
      res.redirect('/dashboard');
    })
    .catch((err) => {
      console.log("Error Creating music band\n\n" + err);
    });

});

router.get('/deleteBands/:id', function (req, res,next) {
  models.MusicBands.findOne({where: {id:req.params.id}})
  .then(sm => {  
    if (sm.userId !== req.user.id){
      return res.redirect('/dashboard');
    }
    sm.destroy();
    res.redirect('/dashboard');
    });
    
});

// Create MusicBands
router.get('/editBands/:id', checkAuthenticated, function (req, res, next) {
  models.MusicBands.findOne({where: {id:req.params.id}})
  .then(musicbands => {
    if (musicbands.userId !== req.user.id){
      return res.redirect('/dashboard');
    }
    res.render('editBands', 
    { 
      user: req.user,
      MusicBands: musicbands,
      error: req.flash('error')[0]
    });
  });
});

// Update bands 
router.post('/editBands/:id', checkAuthenticated,function (req, res, next) {  
  models.MusicBands.findOne({where: {id:req.params.id}})
  .then(musicbands => {
    if (!req.body.name || !req.body.genre) {
   
     //return res.redirect('/editBands/15');
       return res.render('editBands', { user: req.user, MusicBands: musicbands,error: 'All fields required.' });
    }   
     if (!isNaN(req.body.genre)) {
      return res.render('editBands', { user: req.user, MusicBands: musicbands,error: 'Genre should not be numeric.' });
     }
 
     musicbands.update({
      name: req.body.name,
      genre: req.body.genre
      }).then( ()=>{
      res.redirect('/dashboard');
    });
    })
    .catch((err) => {
      console.log("Error updating music band\n\n" + err);
    });
});

// Login 
router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login', { user: req.user, error: req.flash('error')[0] });
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

// Register
router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register', { user: req.user, error: req.flash('error')[0] });
});

router.post('/register', checkNotAuthenticated, (req, res) => {

  var data = {
    name: req.body.name,
    company: req.body.company,
    dob: req.body.dob,
    email: req.body.email,
    password: req.body.password
  };
  if (!data.name || !data.dob || !data.email || !data.password) {
    return res.render('register', { user: req.user, error: 'All fields required.' });
  }
  if (new Date(data.dob) > new Date()){
    return res.render('register', { user: req.user, error: 'Invalid DoB' });
  }
  if (!validateEmail(data.email)){
    return res.render('register', { user: req.user, error: 'Invalid Email' });
  }
  models.Users.findOne({
    where: { email: data.email }
  })
    .then((user) => {
      if (user) return res.render('register', { user: req.user, error: 'Email already exist' });
      if (data.password < 3) {
        return res.render('register', { user: req.user, error: 'Password must be greater than 3.' });
      }
      models.Users.create(data).then((user) => {
        console.log("cdcdcd \n" + user);

        passport.authenticate('local')(req, res, function () {
          return res.redirect('/dashboard');
        });
      })
        .catch((err) => {
          console.log("New error\n" + err);

        });
    }).catch((err) => {
      console.log("Error baby\n\n" + err);
    });


});

// User details
router.get('/myDetails', checkAuthenticated, function (req, res) {
  models.Users.findOne({ where: { id: req.user.id } })
    .then(userDetails => {
      res.render('userDetails',
        {
          user: req.user,
          userDetails: userDetails
        }
      );
    })
    .catch((err) => {
        console.log("Error in user details\n" + err);
    });
});

// Logout
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/index');
});

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
module.exports = router;