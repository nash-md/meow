import { Request, Response } from 'express';
import { TokenHelper } from '../helpers/TokenHelper.js';
import { log } from '../logger.js';
import { database } from '../worker.js';
import { Account } from '../entities/Account.js';
import { AccountNotFoundError } from '../errors/AccountNotFoundError.js';
import { UserNotFoundError } from '../errors/UserNotFoundError.js';
import { User } from '../entities/User.js';

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
        animal: user.animal,
      },
      account: {
        id: user.accountId,
        currency: account.currency,
      },
      board: user.board,
    };

    res.json({ isValid: true, body: body });
  } catch (error) {
    res.json({ isValid: false });
  }
};

export const ValidateTokenController = {
  validate,
};
