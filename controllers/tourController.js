const { query } = require('express');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handleFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// GET -> Read All Tour
exports.getAllTours = factory.getAll(Tour);
// GET -> Read
exports.getTour = factory.getOne(Tour, {path: 'reviews'})
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

// /tours-within?distance=23dd&center=40,45&unit=mi
// /tours-within/23dd/center/10.813322, 106.623381/unit/mi
//router.route('/tours-within/:distance/center/:lating/unit/:unit', tourController.getToursWithin);

exports.getToursWithin = catchAsync( async(req, res, next) => {
  const {distance, latlng, unit } = req.params;
  const [lat, lng ] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat, lng.', 400))
  }

  const tours = await Tour.find({
    startLocation : { $geoWithin: { $centerSphere: [[lng, lat], radius]} }
  });

  res.status(200).json({
    status:'success',
    results: tours.length,
    data: {
      data: tours
    }
  })
});

exports.getDistances = catchAsync( async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng ] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat, lng.', 400))
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1 , lat*1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      }
    },
    {
      $project:{
        distance: 1,
        name: 1
      }
    }
  ])

  res.status(200).json({
    status:'success',
    data: {
      data: distances
    }
  })
  
})
