const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');


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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A tour must have a name !'],
    unique: true
  },
  price: {
    type: Number,
    default: 4.7,
  },
  rating: {
    type: Number,
    require: [true, 'A tour must have a rating !'],
  }
})

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.3,
  price: 1000,
})

testTour.save().then(doc => {
  console.log(doc);
}).catch(err => {
  console.log(`ERROR ⚠️ ${err}`)
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log('App natours is running on http://localhost:8000');
});