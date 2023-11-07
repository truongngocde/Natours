const { query } = require('express');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeaturesTour');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// GET -> Read
exports.getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// GET -> Read
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// POST -> Create
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failure',
      message: error,
    });
  }
};

// PATCH -> Update
exports.updateTour = async (req, res) => {
  try {
    // new = true -> khi update trả lại giá trị đã update
    // runValidators: true -> chạy lại ràng buộc dữ liệu
    const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: {
        updateTour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// DELETE -> Delete
exports.deleteTour = async (req, res) => {
  try {
    const tourDelete = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};


// Aggregation Pipeline : Matcing and Grouping (kĩ thuật thống kê)
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: {$gte: 4.5} }
      },
      {
        $group: {
          _id: {$toUpper: '$difficulty'},
          numTours: { $sum: 1},
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage'},
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        }
      }, 
      {
        $sort: {avgPrice: 1}
      },
      // {
      //   $match: { _id: { $ne: 'EASY'} } bỏ EASY
      // }

    ]);

    res.status(200).json({
      status: 'Success',
      data: {
        stats
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
}

// Aggregation pipeline : Unwinding and Projecting
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates"
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      }, 
      {
        $group: {
          _id: {$month: '$startDates'},
          numToursStart: {$sum: 1},
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: { '_id': 0 }
      }, 
      {
        $sort: { numToursStart: -1 }
      },
      {
        $limit: 12 // hien thi 12
      }
    ]);

    res.status(200).json({
      status: 'Success',
      data: {
        plan
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
}