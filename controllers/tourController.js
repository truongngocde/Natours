const fs = require('fs');

// HANDLER TOURS
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

// Middlewares handle check ID when get/pacth/delete and check name, price when post
exports.checkID = (req, res, next, val) => {
  console.log(`Tour ID : ${val}`)
  if(val > tours.length) { // val = req.param.id * 1
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    })
  }
  next();
}

exports.checkBody = (req, res, next) => {
  if(!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Fail',
      message: 'Missing name or price',
    })
  }
  next();
}
// GET -> Read
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    data: {
      tours,
    },
  });
};

// GET -> Read
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// POST -> Create
exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
};

// PATCH -> Update
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'Success',
    data: {
      tour: '<Update here...>',
    },
  });
};

// DELETE -> Delete
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};
