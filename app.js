const path = require('path')
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController.js');

// Routes files import
const tourRouter = require('./routers/tourRouters');
const userRouter = require('./routers/userRouters');
const reviewRouter = require('./routers/reviewRouters.js');
const viewRouter = require('./routers/viewRouters.js');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

// Set security HTTP headers
//app.use(helmet())
app.use( helmet({ contentSecurityPolicy: false }) ); //use axios link
app.use(cors());
// 1) GLOBAL/ MIDDLEWARES

// Serving static files
//app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// attracker DOS 
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

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

app.use((req, res, next) => {
  console.log("Hello from the Middleware 👌");
  next();
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
})
// 3) ROUTERS


app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`), 404);
})


app.use(globalErrorHandler)
// START SERVER
module.exports = app;
