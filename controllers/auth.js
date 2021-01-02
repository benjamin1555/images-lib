const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Images Lib | Login',
    path: '/login',
    errorMessage: req.flash('error')
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    const doPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doPasswordMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    req.flash('success', 'Successfully logged in.');
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    req.flash('info', 'Successfully logged out.');
    await req.session.destroy();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

exports.getSignup = (req, res, next) => {
  const errors = validationResult(req);
  res.render('auth/signup', {
    pageTitle: 'Images Lib | Sign Up',
    path: '/signup',
    validationErrors: errors.array(),
    oldInput: {
      email: '',
      username: '',
      password: '',
      passwordConfirmation: ''
    }
  });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const passwordConfirmation = req.body.passwordConfirmation;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Images Lib | Sign Up',
      path: '/signup',
      validationErrors: errors.array(),
      oldInput: {
        email,
        username,
        password,
        passwordConfirmation
      }
    });
  }

  try {
    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
      req.flash('error', 'Email already taken.');
      return res.redirect('/signup');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await new User({ email, username, password: hashedPassword}).save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};
