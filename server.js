const dotenv = require('dotenv');
const app = require('./app');


dotenv.config({ path: './config.env' });
console.log(process.env);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log('App natours is running on http://localhost:8000');
});