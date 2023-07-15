import { Response, NextFunction } from 'express';
import { Lane, LaneRequest } from '../entities/Lane.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { AuthenticatedRequest } from '../requests/AuthenticatedRequest.js';
import { datasource } from '../helpers/DatabaseHelper.js';
import { Board } from '../entities/Board.js';

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
    if (req.params.id) {
      const lane = await EntityHelper.findOneById(req.jwt.user, Lane, req.params.id);

      lane.inForecast = req.body.inForecast;
      lane.name = req.body.name;
      lane.tags = req.body.tags;

      const updated = await datasource.manager.save(lane);

      return res.json(updated);
    }
  } catch (error) {
    return next(error);
  }
};

// TODO switch to upsert
const updateAll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const lanesInDatabase = await EntityHelper.findByTeam(Lane, req.jwt.team);

    const lanesToDelete = lanesInDatabase.filter((laneInDatabase: Lane) => {
      return !req.body.find((laneInRequest: LaneRequest) => {
        return laneInRequest.id === laneInDatabase.id!.toString();
      });
    });

    await Promise.all(
      lanesToDelete.map(async (lane: Lane) => {
        await datasource.manager.delete(Lane, lane.id);
      })
    );

    let board = await EntityHelper.findOneByTeam(Board, req.jwt.team);

    /* TODO temporary migration, if board does not exist just create it */
    if (!board) {
      board = await datasource.manager.save(new Board('default', req.jwt.team.id!.toString()));
    }

    const list: Lane[] = [];

    await Promise.all(
      req.body.map(async (item: LaneRequest) => {
        if (!item.id) {
          const lane = await datasource.manager.save(
            new Lane(
              req.jwt.team.id!.toString(), // TODO, typecast to string on Express middleware
              board!.id!.toString(),
              item.name,
              item.index,
              item.tags ?? {},
              item.inForecast,
              item.color
            )
          );

          list.push(lane);
        } else {
          const lane = await EntityHelper.findOneById(req.jwt.user, Lane, item.id);

          if (lane) {
            lane.name = item.name;
            lane.color = item.color === undefined ? '' : item.color;
            lane.inForecast = item.inForecast;
            lane.index = item.index;
            lane.tags = item.tags ?? {};
          }

          const updated = await datasource.manager.save(lane);

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
