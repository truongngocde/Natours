const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.name}, ${err.message}`);
  console.log('UNCAUGHT REJECTION ⚠️ Shutting down');

  // Close server & exit process
  process.exit(1);
});

const app = require('./app');

// Connect database
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Database connected successfully`);
  });


// Create server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log('App natours is running on http://localhost:8000');
});

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.name}, ${err.message}`);
  console.log('UNHANDLED REJECTION ⚠️ Shutting down');
  server.close(() => {
    // Close server & exit process
    process.exit(1);
  });
});
// Error: MongoError, bad auth : authentication failed
// UNHANDLED REJECTION ⚠️ Shutting down -> file config.env error
