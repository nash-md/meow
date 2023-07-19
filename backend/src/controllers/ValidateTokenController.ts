import { Request, Response } from 'express';
import { TokenHelper } from '../helpers/TokenHelper.js';
import { datasource } from '../helpers/DatabaseHelper.js';
import { UserNotFoundError } from '../errors/UserNotFoundError.js';
import { User } from '../entities/User.js';
import { Team } from '../entities/Team.js';
import { TeamNotFoundError } from '../errors/TeamNotFoundError.js';
import { ObjectId } from 'mongodb';
import { log } from '../worker.js';

const validate = async (req: Request, res: Response) => {
  log.debug(`validate token ${req.body.token}`);

  try {
    const payload = TokenHelper.verifyJwt(req.body.token);

    const team = await datasource.manager.findOneById(Team, new ObjectId(payload.teamId));

    if (!team) {
      throw new TeamNotFoundError();
    }

    const user = await datasource.manager.findOneById(User, new ObjectId(payload.userId));

    if (!user) {
      throw new UserNotFoundError();
    }

    res.status(200).end();
  } catch (error) {
    return res.status(401).end();
  }
};

export const ValidateTokenController = {
  validate,
};
