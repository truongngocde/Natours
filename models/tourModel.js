const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A tour must have a name !'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour name must have less or equal then 40 characters'],
    minlength: [10, 'A tour name must have more or equal then 10 characters'],
    validate: [validator.isAlpha, 'Tour name must only contain character.']
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, 'A tour must have duration !'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have maximum group size !'],
  },
  difficulty: {
    type: String,
    require: [true, 'A tour must have a difficulty !'],
    // Filed difficulty must have values : easy, medium, dificult
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult',
    }
      
  },
  ratingsAverage: {
    type: Number,
    default: 4.7,
    min: [1, 'Ranting must be above 1.0'],
    min: [5, 'Ranting must be below 5.0'],
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    require: [true, 'A tour must have a price !'],   
  },
  priceDiscount: {
    type: Number,
    validate: {
      // validator github
      validator: function(val) {
        return val < this.price; // discount: 250 < price: 200 -> false -> error
      },
      message: 'Discount price ({VALUE}) should be below regular price'
    }
  },
  summary: {
    type: String,
    trim: true,
    require: [true, 'A tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have an image cover']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false,
  }
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

// Thêm 1 field mà không có trong database
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true});
  next();
})
// tourSchema.pre('save', function(next) {
//   console.log('Will save document...')
//   next();
// })
// tourSchema.post('save', function(doc, next) {
//   console.log(`${doc} has been saved`);
//   next();
// })

// QUERY MIDDLEWARE
//tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
  this.find({secretTour: {$ne: true}});

  this.start = Date.now()
  next();
})

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`)
  console.log(docs)
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({
    $match: {secretTour: {$ne: true}}
  })
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
