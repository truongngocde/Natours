const { query } = require('express');
const Tour = require('./../models/tourModel');

// GET -> Read
exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1. Filtering
    const queryObj = {...req.query};
    const excludedFieds = ['page', 'sort', 'limit', 'fields'];
    excludedFieds.forEach(param => delete queryObj[param]);

    // 2. Advenced Filtering
    console.log(queryObj);
    // {difficulty: 'easy', duration: {gte: 5}}
    // {difficulty: 'easy', duration: {$gte: 5}}
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));
    
    

    const query = Tour.find(JSON.parse(queryStr));
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    // EXECUTE QUERY    
    
    const tours = await query;

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
