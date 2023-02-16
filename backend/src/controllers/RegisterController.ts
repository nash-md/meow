import { NextFunction, Request, Response } from 'express';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider.js';
import { DefaultSchema, DefaultLanes } from '../Constants.js';
import { Account, CurrencyCode } from '../entities/Account.js';
import { Lane } from '../entities/Lane.js';
import { Schema } from '../entities/Schema.js';
import { User } from '../entities/User.js';
import { TokenHelper } from '../helpers/TokenHelper.js';
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

    DefaultLanes.map(async (item, index) => {
      await database.manager.save(
        new Lane(
          account.id!.toString(),
          Lane.createKeyFromName(item.name),
          item.name,
          index,
          item.tags,
          item.inForecast,
          item.color
        )
      );
    });

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

    const payload = {
      token: TokenHelper.createJwt(user, 14400),
      user: {
        id: updated.id,
        name: updated.name,
      },
      account: {
        id: updated.accountId,
        currency: account.currency,
      },
    };

    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const RegisterController = {
  register,
};
