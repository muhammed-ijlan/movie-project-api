var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
require("dotenv").config();
const cors = require("cors")
var path = require('path');

var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
const movieRouter = require("./routes/movie")
const exportRouter = require("./routes/export")

var app = express();

mongoose.connect(process.env.MONGO).then(() => {
  console.log("DB connected");
}).catch((e) => {
  console.log(e);
})

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }))
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRouter);
app.use('/user', usersRouter);
app.use("/movie", movieRouter)
app.use("/export", exportRouter)

// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   console.log("ERROR");
// });

module.exports = app;
