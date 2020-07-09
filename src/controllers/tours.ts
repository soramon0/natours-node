import Tour from '../models/tour';
import { Response, Request, NextFunction } from 'express';
import { DEFAULT_QUERY_UPDATE_OPTIONS } from '../constant';
import APIFeatures from '../lib/APIFeatures';

export async function topTours(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
}

export async function listTours(req: Request, res: Response) {
  try {
    const features = new APIFeatures(Tour.find(), req.query);

    features.filter().sort().limitFields().paginate();

    // Executing the query
    const tours = await features.query;

    return res.json({
      count: tours.length,
      data: tours,
    });
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
}

export async function createTour(req: Request, res: Response) {
  try {
    const tour = await Tour.create(req.body);

    return res.status(201).json({
      data: tour,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
}

export async function retrieveTour(req: Request, res: Response) {
  try {
    const tour = await Tour.findById(req.params.id);

    return res.status(200).json({
      data: tour,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
}

export async function updateTour(req: Request, res: Response) {
  try {
    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      DEFAULT_QUERY_UPDATE_OPTIONS
    );

    return res.json({
      data: tour,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
}

export async function destroyTour(req: Request, res: Response) {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    return res.status(204).json({
      data: tour,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
}

export async function listStats(_: Request, res: Response) {
  try {
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
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
}

export async function retrieveMonthlyPlan(req: Request, res: Response) {
  try {
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
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
}
