const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController.js');

// Routes files import
const tourRouter = require('./routers/tourRouters');
const userRouter = require('./routers/userRouters');
const app = express();

// Set security HTTP headers
app.use(helmet())

// 1) GLOBAL/ MIDDLEWARES
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// attracker DOS 
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from this IP, please try again in an hour!"
});
app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));

// Data sanitization against NoSQL query injection "email": {"$gt": ""}
app.use(mongoSanitize());
// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution -> getAllTour -> fix: ?sort=duration&sort=price
app.use(hpp({
  whitelist: [
    'duration', // -> getAllTour -> ?duration=5&duration=9 -> 3 result
     'price',
     'ratingsAverage',
     'maxGroupSize',
     'difficulty',
     'ratingQuantity',
  ]
}));

// Serving static files
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
