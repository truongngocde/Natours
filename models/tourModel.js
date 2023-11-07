const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A tour must have a name !'],
    unique: true,
    trim: true,
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
    require: [true, 'A tour must have a difficulty !']
  },
  ratingsAverage: {
    type: Number,
    default: 4.7,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    require: [true, 'A tour must have a price !'],   
  },
  priceDiscount: Number,
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
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
