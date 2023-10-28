const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from the Middleware 👌");
  next();
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

// 2) ROUTE HANDLERS
// HANDLER TOURS
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);
// GET -> Read
const getAllTours = (req, res) => {
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
const getTour = (req, res) => {
  console.log(req.params.id);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// POST -> Create
const createTour = (req, res) => {
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
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'Success',
    data: {
      tour: '<Update here...>',
    },
  });
};

// DELETE -> Delete
const deleteTour = (req, res) => {
  if (+req.params.id > tours.length) {
    res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: {
      tour: null,
    },
  });
};

// HANDLE USERS
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`, 'utf-8')
);
// GET -> Read all Users -> /api/v1/users
const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  })
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Method not defined',
  })
}
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Method not defined',
  })
}
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Method not defined',
  })
}
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Method not defined',
  })
}

// 3) ROUTERS

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// api tours


const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// api users
userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);
userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

  app.use('/api/v1/tours', tourRouter);
  app.use('/api/v1/users', userRouter);

// START SERVER
const port = 8000;
app.listen(port, () => {
  console.log('App natours is running on http://localhost:8000');
});
