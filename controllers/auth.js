const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Images Lib | Login',
    path: '/login'
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.redirect('/login');
    }

    const doPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doPasswordMatch) {
      return res.redirect('/login');
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

exports.postLogout = async (req, res, next) => {
  try {
    await req.session.destroy();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Images Lib | Sign Up',
    path: '/signup'
  });
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const passwordConfirmation = req.body.passwordConfirmation;

  try {
    const userDoc = await User.findOne({ email: email });
    if (userDoc) {
      return res.redirect('/signup');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await new User({ email, username, password: hashedPassword}).save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};