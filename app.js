const fs = require('fs');
const express = require('express');

const app = express();

// app.get('/', (req, res) => {
//     res.status(200).json({
//         title: 'Learning NodeJs',
//         content: "Study with me",

//     });
// })
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status:'success',
        data: {
            tours
        }
    });
});

const port = 8000;
app.listen(port, () => {
    console.log("App natours is running on http://localhost:8000");
})