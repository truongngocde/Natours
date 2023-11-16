const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // new = true -> khi update trả lại giá trị đã update
    // runValidators: true -> chạy lại ràng buộc dữ liệu
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new AppError(`No document found with the ID of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(
        new AppError(`No document found with the ID of ${req.params.id}`, 404)
      );
    }
    res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  });
