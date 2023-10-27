const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        title: 'Learning NodeJs',
        content: "Study with me",
    });
})

const port = 8000;
app.listen(port, () => {
    console.log("App natours is running on http://localhost:8000");
})