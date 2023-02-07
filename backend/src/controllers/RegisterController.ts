import { NextFunction, Request, Response } from 'express';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider';
import { DefaultLanes } from '../Constants';
import { Account, CurrencyCode } from '../entities/Account';
import { Lane } from '../entities/Lane';
import { User } from '../entities/User';
import { TokenHelper } from '../helpers/TokenHelper';
import { log } from '../logger';
import { database } from '../worker';
import { isValidName, isValidPassword } from './RegisterControllerValidator';

const createKeyFromName = (value: string) => {
  return value
    .replace(/[A-Z]/g, (letter) => `${letter.toLowerCase()}`)
    .replace(/ /, '-');
};

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
          createKeyFromName(item.name),
          item.name,
          index,
          item.inForecat,
          item.color
        )
      );
    });

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
