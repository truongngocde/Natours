
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routers/tourRouters');
const userRouter = require('./routers/userRouters');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

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

// START SERVER
module.exports = app;
