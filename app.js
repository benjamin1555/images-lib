const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config();

const User = require('./models/user');
const repositoryRoutes = require('./routes/repository');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const errorController = require('./controllers/error');

const app = express();
const store = new MongoDBStore( {
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(csrfProtection);
app.use(flash());

app.use(async (req, res, next) => {
  if (!req.session.user) return next();

  try {
    req.user = await User.findById(req.session.user._id);
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(repositoryRoutes);
app.use(authRoutes);
app.use(userRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(3000)
  })
  .catch(err => console.log(err));