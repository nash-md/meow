import { NextFunction, Request, Response } from 'express';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider.js';
import {
  DefaultCardSchema,
  DefaultAccountSchema,
  DefaultLanes,
  DefaultCards,
} from '../Constants.js';
import { Card } from '../entities/Card.js';
import { Lane } from '../entities/Lane.js';
import { Schema } from '../entities/Schema.js';
import { CurrencyCode, Team } from '../entities/Team.js';
import { User, UserStatus } from '../entities/User.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';
import { InvalidRequestBodyError } from '../errors/InvalidRequestBodyError.js';
import { InvalidRequestParameterError } from '../errors/InvalidRequestParameterError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { log } from '../logger.js';
import { database } from '../worker.js';
import { isValidName, isValidPassword } from './RegisterControllerValidator.js';

const invite = async (req: Request, res: Response, next: NextFunction) => {
  log.debug(`get user by invite: ${req.query.invite}`);

  try {
    if (!req.query.invite || req.query.invite.toString().length !== 8) {
      throw new InvalidRequestParameterError();
    }

    const user = await EntityHelper.findUserByInvite(
      req.query.invite.toString()
    );

    if (!user) {
      throw new EntityNotFoundError();
    }

    res.json({ name: user.name });
  } catch (error) {
    next(error);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  log.debug(`get user by name: ${req.body.name}`);

  try {
    const name = req.body.name.trim();
    const password = req.body.password;

    await isValidPassword(password);

    if (req.body.invite) {
      if (req.body.invite.length !== 8) {
        throw new InvalidRequestBodyError();
      }

      const user = await EntityHelper.findUserByInvite(req.body.invite);

      if (!user) {
        throw new EntityNotFoundError();
      }

      user.password = await new PasswordAuthenticationProvider().create(
        password
      );

      user.invite = null;
      user.status = UserStatus.Enabled;

      await database.manager.save(user);

      return res.json({ welcome: true });
    }

    await isValidName(name);

    const team = await database.manager.save(
      new Team(`${name}'s Team`, CurrencyCode.USD)
    );

    const lanes: Lane[] = [];

    for (const [index, item] of DefaultLanes.entries()) {
      const lane = await database.manager.save(
        new Lane(
          team.id!.toString(),
          item.name,
          index,
          item.tags,
          item.inForecast,
          item.color
        )
      );

      lanes.push(lane);
    }

    database.manager.save(
      Schema,
      new Schema(
        team.id!.toString(),
        DefaultCardSchema.type,
        DefaultCardSchema.schema
      )
    );

    database.manager.save(
      Schema,
      new Schema(
        team.id!.toString(),
        DefaultAccountSchema.type,
        DefaultAccountSchema.schema
      )
    );

    const user = new User(team.id!.toString(), name, UserStatus.Enabled);

    user.password = await new PasswordAuthenticationProvider().create(password);

    const updated = await database.manager.save(user);

    await Promise.all(
      DefaultCards.map(async (item, index) => {
        const laneIndex = index < 4 ? index : 0;

        await database.manager.save(
          new Card(
            team.id!.toString(),
            updated.id!.toString(),
            lanes[laneIndex]!.id!.toString(),
            item.name,
            item.amount
          )
        );
      })
    );

    res.json({ welcome: true });
  } catch (error) {
    next(error);
  }
};

export const RegisterController = {
  register,
  invite,
};
