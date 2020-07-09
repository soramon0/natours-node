import Tour from '../models/tour';
import { Response, Request } from 'express';
import { DEFAULT_QUERY_UPDATE_OPTIONS } from '../constant';

export async function listTours(_: Request, res: Response) {
  const tours = await Tour.find();
  return res.json({
    data: tours,
  });
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

export async function retriveTour(req: Request, res: Response) {
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

export async function UpdateTour(req: Request, res: Response) {
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

export async function DestroyTour(req: Request, res: Response) {
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
