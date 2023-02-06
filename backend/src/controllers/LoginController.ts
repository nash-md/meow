import { Request, Response, NextFunction } from 'express';
import { PasswordAuthenticationProvider } from '../authentication/PasswordAuthenticationProvider';
import { User } from '../entities/User';
import { TokenHelper } from '../helpers/TokenHelper';
import { log } from '../logger';
import { database } from '../worker';

const handle = async (req: Request, res: Response, next: NextFunction) => {
  log.info(`get user by name: ${req.body.name}`);

  try {
    const user = await database.manager.findOneBy(User, {
      name: req.body.name,
    });

    if (!user) {
      /* do not expose a dedicated error code if user is not found */
      return res.status(401).end();
    }

    const isValidPassword =
      await new PasswordAuthenticationProvider().authenticate(
        user,
        req.body.password
      );

    if (isValidPassword) {
      const payload = {
        token: TokenHelper.createJwt(user, 14400),
        user: {
          id: user.id,
          name: user.name,
        },
        account: {
          id: user.accountId,
        },
      };

      res.json(payload);
    } else {
      res.status(401).end();
    }
  } catch (error) {
    next(error);
  }
};

export const LoginController = {
  handle,
};
