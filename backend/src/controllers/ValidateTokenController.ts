import { Request, Response } from 'express';
import { TokenHelper } from '../helpers/TokenHelper';
import { log } from '../logger';
import { database } from '../worker';
import { Account } from '../entities/Account';
import { AccountNotFoundError } from '../errors/AccountNotFoundError';
import { UserNotFoundError } from '../errors/UserNotFoundError';
import { User } from '../entities/User';

const validate = async (req: Request, res: Response) => {
  log.debug(`validate token ${req.body.token}`);

  try {
    const payload = TokenHelper.verifyJwt(req.body.token);

    const account = await database.manager.findOneById(
      Account,
      payload.accountId
    );

    if (!account) {
      throw new AccountNotFoundError();
    }

    const user = await database.manager.findOneById(User, payload.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const body = {
      token: req.body.token,
      user: {
        id: user.id,
        name: user.name,
      },
      account: {
        id: user.accountId,
      },
    };

    res.json({ isValid: true, body: body });
  } catch (error) {
    res.json({ isValid: false });
  }
};

export const ValidateTokenController = {
  validate,
};
