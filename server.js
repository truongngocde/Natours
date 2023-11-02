const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

// Connect database
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log(`Database connected successfully`);
});

// Create server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log('App natours is running on http://localhost:8000');
});