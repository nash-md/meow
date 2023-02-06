import { NextFunction, Request, Response } from 'express';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider';
import { Account, CurrencyCode } from '../entities/Account';
import { User } from '../entities/User';
import { TokenHelper } from '../helpers/TokenHelper';
import { log } from '../logger';
import { database } from '../worker';
import { isValidName, isValidPassword } from './RegisterControllerValidator';

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
