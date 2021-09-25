var express = require('express');
var router = express.Router();
const Action = require('../models/action');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const initializePassport = require('../passport-config');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');

initializePassport(passport, async email =>
  await User.findOne({ email: email })
);

router.use(flash());
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
router.use(passport.initialize())
router.use(passport.session())

/* GET home page. */
router.get('/', async function (req, res, next) {
  var users = await User.find();
  const rankUsers=[];
  const records = await Action.find();
  users.forEach((user) => {
    var rankuser={
      id: user.id,
      name: user.name,
      totalpoint: 0
      }
    records.forEach((record) => {
  
      if (record.userid == user.id) {
        rankuser.totalpoint+=record.totalPoint;
      }
    })
    rankUsers.push(rankuser);
  });
  rankUsers.sort(function(a, b){
    return b.totalpoint-a.totalpoint;
  })

  res.render('index', { username: req.user, rankusers: rankUsers });
});

router.get('/login', isLoggedout, (req, res) => {
  res.render('login');
})

router.get('/register', isLoggedout, (req, res) => {
  res.render('register');
})

router.post('/register', isLoggedout, async (req, res, next) => {
  const { name, email, password, confirm } = req.body;
 
  let errors = [];

  if (password !== confirm) {
    errors.push({ msg: 'Passwords are not matched' });
  }

  if (errors.length > 0) {
    res.render('register', { errors });
  }
  else {
    if (await User.findOne({ email: email })) {
      errors.push({ msg: `An account with email '${email}' already exists.` });
    }
    if (errors.length > 0) {
      res.render('register', { errors });
    }
    else {
      try {
        const zero = 0;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email: email, name: name, password: hashedPassword, rankpoint: zero})
        console.log(user);
        await user.save();
        req.flash('success_msg', 'You are now registered!');
        res.redirect('/login');
      } catch (err) {
        console.log(err);
        res.redirect('/register');
      }
    }
  }
})

router.post('/login', isLoggedout, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/logout', isLoggedin, (req, res) => {
  req.logout();
  res.redirect("/");
})

function isLoggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}
function isLoggedout(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  }
  next()
}

module.exports = router;
