const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController.js');

// Routes files import
const tourRouter = require('./routers/tourRouters');
const userRouter = require('./routers/userRouters');

// 1) MIDDLEWARES
const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  console.log("Hello from the Middleware 👌");
  next();
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})
// 3) ROUTERS
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server!`
  // })

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
})


app.use(globalErrorHandler)
// START SERVER
module.exports = app;
