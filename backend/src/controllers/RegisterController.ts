import { NextFunction, Request, Response } from 'express';
import { DateTime } from 'luxon';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider.js';
import {
  DefaultCardSchema,
  DefaultAccountSchema,
  DefaultLanes,
  DefaultCards,
  DefaultAccounts,
} from '../Constants.js';
import { Card } from '../entities/Card.js';
import { Lane } from '../entities/Lane.js';
import { Schema } from '../entities/Schema.js';
import { Account } from '../entities/Account.js';
import { CurrencyCode, Team } from '../entities/Team.js';
import { User, UserStatus } from '../entities/User.js';
import { EntityNotFoundError } from '../errors/EntityNotFoundError.js';
import { InvalidRequestBodyError } from '../errors/InvalidRequestBodyError.js';
import { InvalidRequestParameterError } from '../errors/InvalidRequestParameterError.js';
import { EntityHelper } from '../helpers/EntityHelper.js';
import { datasource } from '../helpers/DatabaseHelper.js';
import { isValidName, isValidPassword } from './RegisterControllerValidator.js';
import { Board } from '../entities/Board.js';
import { EventHelper } from '../helpers/EventHelper.js';
import { log } from '../worker.js';

const invite = async (req: Request, res: Response, next: NextFunction) => {
  log.debug(`get user by invite: ${req.query.invite}`);

  try {
    if (!req.query.invite || req.query.invite.toString().length !== 8) {
      throw new InvalidRequestParameterError();
    }

    const user = await EntityHelper.findUserByInvite(req.query.invite.toString());

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

      user.password = await new PasswordAuthenticationProvider().create(password);

      user.invite = null;
      user.status = UserStatus.Enabled;

      await datasource.manager.save(user);

      return res.json({ welcome: true });
    }

    await isValidName(name);

    const team = await datasource.manager.save(new Team(`${name}'s Team`, CurrencyCode.USD));

    const board = await datasource.manager.save(new Board('default', team.id!.toString()));

    const lanes: Lane[] = [];

    for (const [index, item] of DefaultLanes.entries()) {
      const lane = await datasource.manager.save(
        new Lane(
          team.id!.toString(),
          board.id!.toString(),
          item.name,
          index,
          item.tags,
          item.inForecast,
          item.color
        )
      );

      lanes.push(lane);
    }

    datasource.manager.save(
      Schema,
      new Schema(team.id!.toString(), DefaultCardSchema.type, DefaultCardSchema.schema)
    );

    datasource.manager.save(
      Schema,
      new Schema(team.id!.toString(), DefaultAccountSchema.type, DefaultAccountSchema.schema)
    );

    let user = new User(team.id!.toString(), name, UserStatus.Enabled);

    user.password = await new PasswordAuthenticationProvider().create(password);

    user = await datasource.manager.save(user);

    //const cardEventService = new CardEventService(datasource);

    await Promise.all(
      DefaultCards.map(async (item, index) => {
        const laneIndex = index < 4 ? index : 0;

        const tomorrow = DateTime.utc()
          .plus({ days: 1 })
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

        const card = await datasource.manager.save(
          new Card(
            team.id!.toString(),
            user.id!.toString(),
            lanes[laneIndex]!.id!.toString(),
            item.name,
            item.amount,
            tomorrow.toJSDate()
          )
        );

        EventHelper.get().emit('card', { user: user, card: card.toPlain() });
      })
    );

    await Promise.all(
      DefaultAccounts.map(async (item, index) => {
        await datasource.manager.save(new Account(team.id!.toString()!, item.name));
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
