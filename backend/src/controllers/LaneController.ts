import { Response, NextFunction } from 'express';
import { Lane, LaneRequest, NewLane } from '../entities/Lane.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { Board, NewBoard } from '../entities/Board.js';
import { validateAndFetchLane } from '../helpers/EntityFetchHelper.js';
import { emitLaneEvent } from '../helpers/EventHelper.js';

const list = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const lanes = await EntityHelper.findByTeam(Lane, req.jwt.team);

    return res.json(lanes);
  } catch (error) {
    return next(error);
  }
};

const update = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const lane = await validateAndFetchLane(req.params.id, req.jwt.user);

    lane.inForecast = req.body.inForecast;
    lane.name = req.body.name;
    lane.tags = req.body.tags;

    const updated = await EntityHelper.update(lane);

    emitLaneEvent(lane._id);

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const updateAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const lanesInDatabase = await EntityHelper.findByTeam(Lane, req.jwt.team);

    const lanesToDelete = lanesInDatabase.filter((laneInDatabase: Lane) => {
      return !req.body.find((laneInRequest: LaneRequest) => {
        return laneInRequest._id === laneInDatabase._id!.toString();
      });
    });

    await Promise.all(
      lanesToDelete.map(async (lane: Lane) => {
        await EntityHelper.remove(Lane, lane);
      })
    );

    let board = await EntityHelper.findOneByTeam(Board, req.jwt.team);

    /* TODO temporary migration, if board does not exist just create it */
    if (!board) {
      board = await EntityHelper.create(new NewBoard(req.jwt.team, 'default'), Board);
    }

    const list: Lane[] = [];

    await Promise.all(
      req.body.map(async (item: LaneRequest) => {
        if (!item._id) {
          const lane = await EntityHelper.create(
            new NewLane(
              req.jwt.team,
              board!,
              item.name,
              item.index,
              item.color,
              item.inForecast,
              item.tags ?? {}
            ),
            Lane
          );

          list.push(lane!);
        } else {
          const lane = await validateAndFetchLane(item._id, req.jwt.user);

          if (lane) {
            lane.name = item.name;
            lane.color = item.color === undefined ? '' : item.color;
            lane.inForecast = item.inForecast;
            lane.index = item.index;
            lane.tags = item.tags ?? {};

            const updated = await EntityHelper.update(lane);

            emitLaneEvent(updated._id);

            list.push(updated);
          }
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
