const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

// app.get('/', (req, res) => {
//     res.status(200).json({
//         title: 'Learning NodeJs',
//         content: "Study with me",

//     });
// })

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);
// GET -> Read
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        tours
      },
    });
  });

// GET -> Read
app.get('/api/v1/tours/:id', (req, res) => {
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
});

// POST -> Create
app.post('/api/v1/tours', (req, res) => {
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
});

// PATCH -> Update
app.patch('/api/v1/tours/:id', (req, res) => {
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            status: 'Fail',
            message: 'Invalid ID'
        })
    }
    res.status(200).json({
        status: 'Success',
        data: {
            tour: "<Update here...>"
        }
    })
});

// DELETE -> Delete
app.delete('/api/v1/tours/:id', (req, res) => {
    if (+req.params.id > tours.length) {
        res.status(404).json({
            status: 'fail',
            message: "Invalid ID"
        })
    }
    res.status(204).json({
        status: 'success',
        data: {
            tour: null
        }
    })
})

const port = 8000;
app.listen(port, () => {
  console.log('App natours is running on http://localhost:8000');
});
