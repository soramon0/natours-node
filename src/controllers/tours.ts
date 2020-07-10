import Tour from '../models/tour';
import { Response, Request, NextFunction } from 'express';
import { DEFAULT_QUERY_UPDATE_OPTIONS } from '../constant';
import APIFeatures from '../lib/APIFeatures';
import AppError from '../lib/AppError';

export async function topTours(req: Request, _: Response, next: NextFunction) {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

export async function listTours(req: Request, res: Response) {
  const features = new APIFeatures(Tour.find(), req.query);

  features.filter().sort().limitFields().paginate();

  // Executing the query
  const tours = await features.query;

  return res.json({
    count: tours.length,
    data: tours,
  });
}

export async function createTour(req: Request, res: Response) {
  const tour = await Tour.create(req.body);

  return res.status(201).json({
    data: tour,
  });
}

export async function retrieveTour(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  return res.status(200).json({
    data: tour,
  });
}

export async function updateTour(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tour = await Tour.findByIdAndUpdate(
    req.params.id,
    req.body,
    DEFAULT_QUERY_UPDATE_OPTIONS
  );

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  return res.json({
    data: tour,
  });
}

export async function destroyTour(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  return res.status(204).json({
    data: tour,
  });
}

export async function listStats(_: Request, res: Response) {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: '$difficulty',
        toursTotal: { $sum: 1 },
        ratingsTotal: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  return res.json({
    data: stats,
  });
}

export async function retrieveMonthlyPlan(req: Request, res: Response) {
  const year = parseInt(req.params.year, 10);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
  ]);

  return res.json({
    data: plan,
  });
}
