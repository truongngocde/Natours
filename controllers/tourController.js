const { query } = require('express');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeaturesTour');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handleFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// GET -> Read
exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// GET -> Read
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate({
    path: 'reviews',
  });
  if (!tour) {
    return next(
      new AppError(`No tour found with the ID of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// const catchAsync = (fn) => {
//   // return middleware - anonymous function
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };

// POST -> Create
exports.createTour = factory.createOne(Tour);

// PATCH -> Update
exports.updateTour = factory.updateOne(Tour);

// DELETE -> Delete
exports.deleteTour = factory.deleteOne(Tour);

// Aggregation Pipeline : Matcing and Grouping (kĩ thuật thống kê)
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY'} } bỏ EASY
    // }
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      stats,
    },
  });
});

// Aggregation pipeline : Unwinding and Projecting
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numToursStart: -1 },
    },
    {
      $limit: 12, // hien thi 12
    },
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      plan,
    },
  });
});
