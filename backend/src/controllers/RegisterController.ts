import { NextFunction, Request, Response } from 'express';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider.js';
import { DefaultSchema, DefaultLanes, DefaultCards } from '../Constants.js';
import { Account, CurrencyCode } from '../entities/Account.js';
import { Card } from '../entities/Card.js';
import { Lane } from '../entities/Lane.js';
import { Schema } from '../entities/Schema.js';
import { User } from '../entities/User.js';
import { log } from '../logger.js';
import { database } from '../worker.js';
import { isValidName, isValidPassword } from './RegisterControllerValidator.js';

const register = async (req: Request, res: Response, next: NextFunction) => {
  log.debug(`get user by name: ${req.body.name}`);

  try {
    const name = req.body.name.trim();
    const password = req.body.password;

    await isValidName(name);
    await isValidPassword(password);

    const account = await database.manager.save(
      new Account(`${name}'s Account`, CurrencyCode.USD)
    );

    const lanes: Lane[] = [];

    for (const [index, item] of DefaultLanes.entries()) {
      const lane = await database.manager.save(
        new Lane(
          account.id!.toString(),
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
        account.id!.toString(),
        DefaultSchema.type,
        DefaultSchema.schema
      )
    );

    const user = new User(account.id!.toString(), name);

    user.password = await new PasswordAuthenticationProvider().create(password);

    const updated = await database.manager.save(user);

    await Promise.all(
      DefaultCards.map(async (item, index) => {
        const laneIndex = index < 4 ? index : 0;

        await database.manager.save(
          new Card(
            account.id!.toString(),
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
};
