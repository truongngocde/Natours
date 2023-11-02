const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');


// Connect database
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  console.log(`Database connected successfully`);
});

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

//IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded')
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

// DALETE ALL DATA FROM DB
const deleteAllTours = async()=>{
    try {
        await Tour.deleteMany();
        console.log("Delete all data success");
    } catch (error) {
        console.log(error);
    }
    process.exit();
}
if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteAllTours();
}
console.log(process.argv);

// node dev-data/data/import-dev-data.js --import
