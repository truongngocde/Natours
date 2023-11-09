module.exports = (fn) => {
  // return middleware - anonymous function
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
