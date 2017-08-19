const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const configDB = require('./config/database.js');

mongoose.connect(configDB.url);
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'anystringoftext',
  saveUninitialized: true,
  resave: true,
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
require('./app/routes.js')(app, passport);

app.listen(port);
console.log(`Server running on port: ${port}`);
