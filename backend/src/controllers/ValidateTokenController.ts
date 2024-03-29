import { Request, Response } from 'express';
import { TokenHelper } from '../helpers/TokenHelper.js';
import { User } from '../entities/User.js';
import { Team } from '../entities/Team.js';
import { log } from '../worker.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';

const validate = async (req: Request, res: Response) => {
  log.debug(`validate token ${req.body.token}`);

  try {
    const payload = TokenHelper.verifyJwt(req.body.token);

    const team = await EntityHelper.findOneById(Team, payload.teamId);

    if (!team) {
      throw new EntityNotFoundError();
    }

    const user = await EntityHelper.findOneById(User, payload.userId);

    if (!user) {
      throw new EntityNotFoundError();
    }

    res.status(200).end();
  } catch (error) {
    return res.status(401).end();
  }
};

export const ValidateTokenController = {
  validate,
};
