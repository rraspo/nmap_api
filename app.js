const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const apiRoutes = require('./server/scans');

const app = express();

app.use(fileUpload({
  createParentPath: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', apiRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
