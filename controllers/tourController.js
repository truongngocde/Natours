const { query } = require('express');
const Tour = require('./../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1. Filtering
    const queryObj = { ...this.queryString };
    const excludedFieds = ['page', 'sort', 'limit', 'fields'];
    excludedFieds.forEach((param) => delete queryObj[param]);

    // 2. Advenced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    return this;
    //let query = Tour.find(JSON.parse(queryStr));
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      //this.query = this.query.sort(req.this.query.sort);
      // sort('price ratingAverage)
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    let skip = (page - 1) * limit;
    // tours?page=2&limit=10
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
// GET -> Read
exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // // 1. Filtering
    // const queryObj = {...req.query};
    // console.log(queryObj);
    // const excludedFieds = ['page', 'sort', 'limit', 'fields'];
    // excludedFieds.forEach(param => delete queryObj[param]);

    // // 2. Advenced Filtering
    // // {difficulty: 'easy', duration: {gte: 5}}
    // // {difficulty: 'easy', duration: {$gte: 5}}
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // let query = Tour.find(JSON.parse(queryStr));

    // 3) Sorting
    // tours?sort=price,ratingAverage
    // if(req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    //   //query = query.sort(req.query.sort);
    //   // sort('price ratingAverage)
    // }else {
    //   query = query.sort('-createdAt');
    // }

    // 4) Field limiting
    // tours?fields=name,duration,price,difficulty
    // if(req.query.fields){
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // }else {
    //   query = query.select('-__v');
    // }

    // 5) Pagination (phan trang)
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // let skip = (page - 1) * limit;
    // // tours?page=2&limit=10
    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if(skip >= numTours) throw new Error('This page not does exist');
    // }

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
