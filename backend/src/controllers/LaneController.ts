import { Response, NextFunction } from 'express';
import { Lane } from '../entities/Lane';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest';
import { database } from '../worker';

const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      accountId: { $eq: req.jwt.account.id!.toString() },
    };

    let cards = await database.getMongoRepository(Lane).findBy(query);

    return res.json(cards);
  } catch (error) {
    return next(error);
  }
};

export const LaneController = {
  list,
};
