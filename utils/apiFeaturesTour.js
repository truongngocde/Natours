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

module.exports = APIFeatures