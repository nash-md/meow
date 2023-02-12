import { Response, NextFunction } from 'express';
import { Lane, LaneRequest } from '../entities/Lane.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { database } from '../worker.js';

const list = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      accountId: { $eq: req.jwt.account.id!.toString() },
    };

    let lanes = await database.getMongoRepository(Lane).findBy(query);

    // TODO refactor at a later stage
    return res.json(
      lanes.map((lane) => {
        return { ...lane, key: lane.id };
      })
    );
  } catch (error) {
    return next(error);
  }
};

const update = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.params.id) {
      const lane = await database
        .getMongoRepository(Lane)
        .findOneById(req.params.id);

      if (
        !lane ||
        lane.accountId?.toString() !== req.jwt.account.id?.toString() // TODO remove toString()
      ) {
        throw new EntityNotFoundError();
      }

      lane.inForecast = req.body.inForcast;
      lane.key = Lane.createKeyFromName(req.body.name);
      lane.name = req.body.name;

      const updated = await database.manager.save(lane);

      return res.json(updated);
    }
  } catch (error) {
    return next(error);
  }
};

// TODO switch to upsert
const updateAll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      accountId: { $eq: req.jwt.account.id!.toString() },
    };

    const lanesInDatabase = await database
      .getMongoRepository(Lane)
      .findBy(query);

    const lanesToDelete = lanesInDatabase.filter((laneInDatabase: Lane) => {
      return !req.body.find((laneInRequest: LaneRequest) => {
        return laneInRequest.id === laneInDatabase.id!.toString();
      });
    });

    await Promise.all(
      lanesToDelete.map(async (lane: Lane) => {
        await database.manager.delete(Lane, lane.id);
      })
    );

    const list: Lane[] = [];

    await Promise.all(
      req.body.map(async (item: LaneRequest) => {
        if (!item.id) {
          const lane = await database.manager.save(
            new Lane(
              req.jwt.account.id!.toString(), // TODO, typecast to string on Express middleware
              Lane.createKeyFromName(item.name),
              item.name,
              item.index,
              item.inForecast,
              item.color
            )
          );

          list.push(lane);
        } else {
          const lane = await database
            .getMongoRepository(Lane)
            .findOneById(item.id);

          if (lane) {
            lane.name = item.name;
            lane.key = Lane.createKeyFromName(item.name);
            lane.color = item.color;
            lane.index = item.index;
            lane.inForecast = item.inForecast;
          }

          const updated = await database.manager.save(lane);

          list.push(updated!);
        }
      })
    );

    return res.json(list);
  } catch (error) {
    return next(error);
  }
};

export const LaneController = {
  list,
  update,
  updateAll,
};
