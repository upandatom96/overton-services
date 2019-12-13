// imports
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

// bring in util
const { logError, logInfo } = require('./utilities/logger.util');

// bring in controllers
const indexController = require('./controllers/index.controller');
const showController = require('./controllers/show.controller');
const authController = require('./controllers/auth.controller');

// passport config
require('./config/passport.config')(passport);

const app = express();

// DB setup
const db = require('./config/database.config');
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    logInfo("mongodb connected...");
  })
  .catch((err) => {
    logError(err);
  });

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS middleware
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', ['Authorization', 'Content-Type']);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
}
app.use(allowCrossDomain);

// session middleware
const { SESSION_SECRET } = require("../local.env");
app.use(session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use controllers
app.use('/', indexController);
app.use('/show', showController);
app.use('/auth', authController);

// error handlers
// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({ "message": err.name + ": " + err.message });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
